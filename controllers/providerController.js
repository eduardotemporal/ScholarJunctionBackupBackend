
const Provider = require("../models/Provider");
const User = require('../models/User');
const Organization = require("../models/Organization");
const { upload } = require('../config/uploadConfig');
const bcrypt = require("bcryptjs");
const auth = require("../auth2");


module.exports.createOrUpdateProviderProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { organization, organizationType, kycDetails, organizationDetails } = req.body;

        // Fetch the user and check if they are a provider
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 'Provider') {
            return res.status(403).json({ error: 'Unauthorized: User is not a provider' });
        }

        let provider = await Provider.findOne({ userId });

        if (provider) {
            provider.organization = organization;
            provider.organizationType = organizationType;
            provider.kycDetails = kycDetails;
            provider.organizationDetails = organizationDetails;
        } else {
            provider = new Provider({
                userId,
                organization,
                organizationType,
                kycDetails,
                organizationDetails
            });
        }

        const savedProviderProfile = await provider.save();
        return res.status(200).json({ message: 'Provider profile saved successfully', provider: savedProviderProfile });

    } catch (error) {
        console.error('Error saving provider profile:', error);
        return res.status(500).json({ error: 'Error saving provider profile' });
    }
};


// module.exports.registerProvider = async (reqBody) => {
//     try {

//         const existingProvider = await Provider.findOne({ email: reqBody.email });
//         if (existingProvider) {
//             return { error: 'Email already in use' };
//         }

//         if (reqBody.password !== reqBody.confirmPassword) {
//             return { error: 'Passwords do not match' };
//         }

//         const newProvider = new Provider({
//             firstName: reqBody.firstName,
//             lastName: reqBody.lastName,
//             email: reqBody.email,
//             contactDetails: reqBody.contactDetails,
//             password: bcrypt.hashSync(reqBody.password, 10),
//             organization: reqBody.organization,
//             organizationType: reqBody.organizationType 
//         });

//         const savedProvider = await newProvider.save();

//         const accessToken = auth.createAccessToken(savedProvider);

//         return { provider: savedProvider, accessToken };

//     } catch (error) {
//         console.error(error);
//         return { error: 'Failed to register scholarship provider' };
//     }
// };



// module.exports.getProvider = async (req, res) => {
//     try {
//         const providerId = req.provider.id;

//         const provider = await Provider.findById(providerId);

//         if (!provider) {
//             return res.status(404).json({ error: 'Provider not found' });
//         }

//         return res.json({ provider });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Failed to retrieve provider information' });
//     }
// };


// module.exports.createProviderOrganization = async (req, res) => {
//   try {
//     const providerId = req.provider.id; 
//     const profileData = req.body; 
//     const newOrganization = new Organization({
//         name: profileData.name,
//         address: profileData.address,
//         organizationPassword: profileData.organizationPassword
      
//     });

//     const provider = await Provider.findById(providerId);
//     const savedOrganization = await newOrganization.save();

//     if (!provider) {
//       return res.status(404).send({ message: 'Provider not found' });
//     }

//     provider.organizationDetails.push(newOrganization); 

//     await provider.save();

//     return res.send({ message: 'Profile saved successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Failed to post profile' });
//   }
// }

module.exports.createKYC = async (req, res) => {
    console.log("createKYC controller called");  // Debugging log
    upload(req, res, async (err) => {
        if (err) {
            console.error("File upload error:", err);
            return res.status(400).json({ error: err.message || 'File upload failed' });
        }

        try {
            const providerId = req.params.id;
            const provider = await Provider.findById(providerId);
            if (!provider) {
                return res.status(404).json({ error: 'Provider not found' });
            }

            const { governmentTypeID, proofOfEmploymentType } = req.body;

            const governmentIDPath = req.files['governmentID'] ? req.files['governmentID'][0].filename : null;
            const proofOfEmploymentPath = req.files['proofOfEmployment'] ? req.files['proofOfEmployment'][0].filename : null;

            provider.kycDetails.push({
                governmentTypeID,
                governmentID: governmentIDPath,
                proofOfEmploymentType,
                proofOfEmployment: proofOfEmploymentPath
            });

            await provider.save();

            console.log("KYC details saved successfully");
            return res.json({ success: true, kycDetails: provider.kycDetails });
        } catch (error) {
            console.error("Error saving KYC details:", error);
            return res.status(500).json({ error: 'Failed to create KYC details', details: error.message });
        }
    });
};



module.exports.updateOrganizationDetails = async (req, res) => {
  try {
    const providerId = req.provider.id; 
    const organizationData = req.body; 

   
    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).send({ message: 'Provider not found' });
    }

    
    const newOrganizationDetails = {
      position: organizationData.position,
      name: organizationData.name,
      address: organizationData.address,
      organizationPassword: organizationData.organizationPassword
    };

   
    provider.organizationDetails.push(newOrganizationDetails);

 
    await provider.save();

    return res.send({ message: 'Organization details added successfully' });
  } catch (error) {
    console.error('Error adding organization details:', error);
    res.status(500).send({ message: 'Failed to add organization details' });
  }
};

