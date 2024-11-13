const mongoose = require("mongoose");
const cors = require("cors");
const user = require("./routes/user");
const student = require("./routes/student")
const provider = require("./routes/provider")
const scholarship = require("./routes/scholarship")
const organization = require("./routes/organization")
const image = require("./routes/image")
const { upload } = require("./config/uploadConfig");
const express = require("express")
const Grid = require('gridfs-stream');
const {GridFsStorage} = require('multer-gridfs-storage');

const app = express()
const port = 4006

require('dotenv').config();

	mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

	console.log("Node.js version:", process.version);

	let db = mongoose.connection;

	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", () => console.log("Welcome to ScholarJunction"))

	const bodyparser = require("body-parser");
	app.use(bodyparser.urlencoded({ extended: false }));
	app.use(bodyparser.json());
	app.use(cors());
	app.use("/students", student);
	app.use("/users", user);
	app.use("/providers", provider);
	app.use("/organization", organization);
	app.use("/scholarships", scholarship);
	app.use("/image", image);



	// const mongoURI = 'mongodb+srv://admin:admin1234@cluster0.zmvjnrl.mongodb.net/Capstone?retryWrites=true&w=majority';


	// const conn = mongoose.createConnection(mongoURI, {
	//   useNewUrlParser: true,
	//   useUnifiedTopology: true,
	// });

	let gfs, gridfsBucket;
	db.once('open', () => {
	 gridfsBucket = new mongoose.mongo.GridFSBucket(db, {
   bucketName: 'uploads'
 	});

   gfs = Grid(db, mongoose.mongo);
   gfs.collection('uploads');
	  
// 	  if (gfs) {
//     gfs.files.find().toArray()
//         .then(files => {
//             if (!files || files.length === 0) {
//                 console.log('No files found in uploads collection');
//             } else {
//                 files.forEach(file => {
//                     console.log('File:', {
//                         _id: file._id,
//                         filename: file.filename,
//                         contentType: file.contentType,
//                         length: file.length,
//                         uploadDate: file.uploadDate,
//                     });
//                 });
//             }
//         })
//         .catch(err => {
//             console.error('Error retrieving files:', err);
//         });
// } else {
//     console.error('GridFS is not initialized yet');
// }

});



//Get using id in params
	app.get('/file/:id', (req, res) => {
	    if (!gfs) {
	        console.error('GridFS is not initialized yet');
	        return res.status(500).json({ error: 'GridFS is not initialized yet' });
	    }

	    const fileId = req.params.id;

	    try {
	        const objectId = new mongoose.Types.ObjectId(fileId);
	        console.log(objectId)

	        gfs.files.findOne({ _id: objectId }, (err, file) => {
	        	console.log(file); 
	            if (err) {
	                console.error('Error finding file:', err);
	                return res.status(500).json({ error: 'Error finding file' });
	            }

	            if (!file) {
	                console.warn('No file found with that ID');
	                return res.status(404).json({ error: 'No file exists' });
	            }

	            if (file.contentType.startsWith('image/') || file.contentType === 'application/pdf') {
	                console.log("File found, streaming...");
	              
	                const readStream = gridfsBucket.openDownloadStream(file._id);
	                console.log(readStream)
        			readStream.pipe(res);

	            } else {
	                console.warn('File is not an image or PDF');
	                return res.status(404).json({ error: 'Not an image or pdf' });
	            }
	        });
	    } catch (error) {
	        console.error('Invalid file ID:', error);
	        return res.status(400).json({ error: 'Invalid file ID' });
	    }
	});

//Get using filename in reqBody
app.get('/file', (req, res) => {
    if (!gfs) {
        console.error('GridFS is not initialized yet');
        return res.status(500).json({ error: 'GridFS is not initialized yet' });
    }

    const { filename } = req.body + '.jpg'; // get filename from request body

    if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
    }


    gfs.files.findOne({ filename: filename }, (err, file) => {
        if (err) {
            console.error('Error finding file:', err);
            return res.status(500).json({ error: 'Error finding file' });
        }

        if (!file) {
            console.warn('No file found with that filename');
            return res.status(404).json({ error: 'No file exists' });
        }

        if (file.contentType.startsWith('image/') || file.contentType === 'application/pdf') {
            console.log("File found, streaming...");
            const readStream = gridfsBucket.openDownloadStream(file._id);
            readStream.pipe(res);
        } else {
            console.warn('File is not an image or PDF');
            return res.status(404).json({ error: 'Not an image or pdf' });
        }
    });
});


//Get using filename
app.get('/filename/:filename', (req, res) => {
    if (!gfs) {
        console.error('GridFS is not initialized yet');
        return res.status(500).json({ error: 'GridFS is not initialized yet' });
    }

    const filename = req.params.filename;  // Get the filename from the URL parameter
    console.log('Requested filename:', filename);

    gfs.files.findOne({ filename: filename }, (err, file) => {
        if (err) {
            console.error('Error finding file:', err);
            return res.status(500).json({ error: 'Error finding file' });
        }

        if (!file) {
            console.warn('No file found with that filename');
            return res.status(404).json({ error: 'No file exists' });
        }

        if (file.contentType.startsWith('image/') || file.contentType === 'application/pdf') {
            console.log('File found, streaming...');
            const readStream = gridfsBucket.openDownloadStream(file._id);
            readStream.pipe(res);
        } else {
            console.warn('File is not an image or PDF');
            return res.status(404).json({ error: 'Not an image or pdf' });
        }
    });
});


	if(require.main == module) {
		app.listen(port, () => console.log(`Server is running at port ${port}`));
	}

module.exports = app;