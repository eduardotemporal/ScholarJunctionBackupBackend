const express = require("express");
const studentController = require("../controllers/studentController");
const auth = require("../auth");
const router = express.Router();
const { verify, verifyAdmin, verifyStudent } = auth;


// router.post("/register", (req, res) => {
//     studentController.registerStudent(req.body).then(resultFromController => res.send(resultFromController))
// });



// router.post("/register/2", verify, studentController.createStudentProfile);

// router.get("/:id", verify, (req, res) => {
//     studentController.getStudentById(req, res)
//         .then(resultFromController => res.json(resultFromController))
//         .catch(error => res.status(500).json({ error: 'Internal server error' }));
// });

router.post('/user/post/:userId', verify, verifyStudent, (req, res) => {
    studentController.createOrUpdateStudentProfile(req, res);
});

router.get('/user/get/:userId', verify, verifyStudent, studentController.getStudentProfile);

router.post('/user/post/criteria/:userId', verify, verifyStudent, (req, res) => {
    studentController.createOrUpdateCustomCriteria(req, res);
});


// router.get('/profile/me', verify, studentController.getRegisteredStudent)

// router.get('/profile/:profileId', studentController.getStudentProfileById);

// router.post('/profile/customCrit', verify, studentController.addCustomCriteria)

module.exports = router;