const express = require("express");
const providerController = require("../controllers/providerController");
const organizationController = require("../controllers/organizationController");
const auth = require("../auth2");
const router = express.Router();
const { verify, verifyProvider } = auth;


router.post('/user/post/:userId', verify, (req, res) => {
    providerController.createOrUpdateProviderProfile(req, res);
});

// router.post("/register", (req, res) =>{
// 	providerController.registerProvider(req.body).then(resultFromController => res.send(resultFromController))
// })


router.post('/createKYC/:id', verify, (req, res) => {
    providerController.createKYC(req, res);
});

router.post('/organizations', organizationController.createOrg);

// router.post('/update', verify, providerController.updateOrganizationDetails);

// router.get('/profile', verify, providerController.getProvider);

module.exports = router;