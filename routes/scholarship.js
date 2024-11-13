const express = require("express");
const router = express.Router();
const scholarshipController = require("../controllers/scholarshipController");
const auth = require("../auth2");
const { verify, verifyAdmin } = auth;




router.post('/:typeId/scholarships/:userId', scholarshipController.addScholarship);




module.exports = router;