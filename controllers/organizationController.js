const Organization = require("../models/Organization");
const Provider = require("../models/Provider");
const auth = require("../auth2");
const bcrypt = require('bcryptjs');




// function generatePassword(length = 10) {
//     // Define characters allowed in the password
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?-=[];,.';

//     let password = '';
//     for (let i = 0; i < length; i++) {
//         // Select a random character from the characters string
//         const randomIndex = Math.floor(Math.random() * characters.length);
//         password += characters[randomIndex];
//     }

//     return password;
// }



// module.exports.createOrganization = async (req, res) => {
//     try {
//         const { name } = req.body;

//         const existingOrganization = await Organization.findOne({ name: name });
//         if (existingOrganization) {
//             return res.status(400).json({ error: 'Organization with the same name already exists' });
//         }

//         const newOrganization = new Organization({
//             name: name,
//             address: req.body.address,
//             organizationPassword: req.body.password
//         });

//         const savedOrganization = await newOrganization.save();

//         const providerId = req.provider.id;
//         const provider = await Provider.findById(providerId);
//         if (!provider) {
//             return res.status(404).json({ error: 'Provider not found' });
//         }
//         provider.organizationDetails.push({
//             _id: savedOrganization._id,
//             name: savedOrganization.name,
//             address: savedOrganization.address,
//             position: req.body.position
//         });
//         await provider.save();

//         return res.json({ organization: savedOrganization });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Failed to create organization' });
//     }
// };


module.exports.createOrg = async (req, res) => {
    try {
        const { name, address, organizationPassword } = req.body;

        const organization = new Organization({
            name,
            address,
            organizationPassword,
        });
        console.log(organization);
        console.log(req.body.organizationPassword);
        console.log(req.body.name);
        console.log(req.body.address);

        await organization.save();

        return res.status(201).json({ success: true, organization });

    } catch (error) {
        console.error('Error saving organization:', error);

        if (error.code === 11000) {
            return res.status(400).json({ error: 'Organization name must be unique' });
        }

        return res.status(500).json({ error: `Error creating organization: ${error.message}` });
    }
};




module.exports.getAllOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find();
        
        return res.json({ organizations });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve organizations' });
    }
};