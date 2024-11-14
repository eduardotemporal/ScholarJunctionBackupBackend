const express = require("express");
const router = express.Router();
const scholarshipController = require("../controllers/scholarshipController");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;




router.post('/criteria/:userId', (req, res) => {
    scholarshipController.addScholarshipCriteria(req, res);
});
router.post('/types/create', (req, res) => {
	scholarshipController.createScholarshipType(req,res);
});

router.get('/types', scholarshipController.getScholarshipTypes);


router.post('/:userId', (req, res) => {
    scholarshipController.createScholarship(req, res);
});

router.get('/', (req, res) => {
    scholarshipController.getScholarships(req, res);
});

router.get('/type/get/:typeId', scholarshipController.getScholarshipsByType);

router.get('/type/:typeId/criteria', scholarshipController.getUniqueCriteriaByScholarshipType);




module.exports = router;