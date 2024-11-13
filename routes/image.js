const express = require('express');
const router = express.Router();
const { getProfilePicture } = require('../controllers/imageController'); // Import the controller


router.get('/profile-picture/:filename', getProfilePicture);

module.exports = router;
