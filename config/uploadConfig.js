
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');


const mongoURI = 'mongodb+srv://admin:admin1234@cluster0.zmvjnrl.mongodb.net/Capstone?retryWrites=true&w=majority';


const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('GridFS UploadConfig Initialized');
});


const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex');
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage }).fields([
  { name: 'governmentID', maxCount: 1 },
  { name: 'proofOfEmployment', maxCount: 1 },
]);

const uploadProfile = multer({ storage }).single('profilePicture'); 

module.exports = {
  uploadProfile,
  upload,
  gfs,
};
