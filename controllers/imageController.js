const { gfs } = require('../config/uploadConfig'); 

module.exports.getProfilePicture = async (req, res) => {
    const filename = req.params.filename; 

    try {
        gfs.files.findOne({ filename: filename }, (err, file) => {
            if (err || !file) {
                return res.status(404).json({ error: 'File not found' });
            }

            // Check if the file is an image
            if (file.contentType.startsWith('image/')) {
                const readStream = gfs.createReadStream(file.filename);
                res.set('Content-Type', file.contentType);
                readStream.pipe(res);
            } else {
                return res.status(404).json({ error: 'File is not an image' });
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error retrieving profile picture' });
    }
};
