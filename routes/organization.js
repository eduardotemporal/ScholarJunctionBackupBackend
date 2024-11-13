const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");

router.get('/getAll', organizationController.getAllOrganizations);


module.exports = router;