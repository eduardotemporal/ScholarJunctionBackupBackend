const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../auth");
const router = express.Router();
const user2Controller = require('../controllers/user2Controller');
const { verify, verifyAdmin } = auth;


	router.post("/register", async (req, res) => {
	    try {
	        const result = await userController.registerUser(req.body);

	        if (result.error) {
	            return res.status(400).json({ error: result.error });
	        }

	        res.status(201).json({
	            message: "User registered successfully.",
	            user: result.user,
	            accessToken: result.accessToken,
	        });

	    } catch (error) {
	        res.status(500).json({ error: "Server error" });
	    }
	});


	// router.post('/register2/:userId', async (req, res) => {
	//     const { userId } = req.params; 
	//     const result = await user2Controller.registerUser2(userId, req.body);
	    
	//     if (result.error) {
	//         return res.status(400).json(result);
	//     }

	//     return res.status(201).json(result); 
	// });


	router.post('/register-ppi/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await userController.registerPPI(userId, req.body);

    if (result.error) {
        return res.status(400).json(result);
    }

    return res.status(200).json(result);
});


router.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await userController.getUserData(userId);

    if (result.error) {
        return res.status(404).json(result);
    }

    return res.status(200).json(result);
});


// router.get('/test-users', userController.tester);



router.post("/login", async (req, res) => {
    const result = await userController.loginUser(req.body); 

  if (result.error) {
    return res.status(result.error.statusCode).json({ message: result.error.message });
  }
  return res.status(200).json(result);
});


router.post('/upload-profile-picture/:userId',verify, userController.uploadProfilePicture);





router.get('/profile-picture/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await userController.getUserProfilePicture(userId);

    if (result.error) {
        return res.status(404).json(result);
    }

    return res.status(200).json(result);
});



module.exports = router;
