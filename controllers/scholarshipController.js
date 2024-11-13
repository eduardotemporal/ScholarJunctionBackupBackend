const { ScholarshipType, Scholarship, ScholarshipCriteria } = require('../models/Scholarship');
const Provider = require("../models/Provider");
const auth = require("../auth2");


// module.exports.createScholarship = async (req, res) => {
//     try {
       
//         const providerId = req.provider.id;

  
//         const provider = await Provider.findById(providerId);


//         if (!provider) {
//             return res.status(404).json({ error: 'Provider not found' });
//         }

//         const { scholarshipTypes } = req.body;

//         const newScholarship = new Scholarship({
//             scholarshipTypes: scholarshipTypes.map(scholarshipTypeData => {
//                 const { name, criteria } = scholarshipTypeData;


//                 const organization = provider.organization;


//                 const author = `${provider.firstName} ${provider.lastName}`;

//                 console.log(author)
//                 console.log(organization)

//                 const newScholarshipType = new ScholarshipType({
//                     name,
//                     organization,
//                     author,
//                     criteria
//                 });

//                 return newScholarshipType;
//             })
//         });

//         const savedScholarship = await newScholarship.save();

//         return res.status(201).json({ scholarship: savedScholarship });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Failed to create scholarship' });
//     }
// };




// module.exports.createScholarshipType = async (req, res) => {
//     try {
//         const { name } = req.body;

//         const newScholarshipType = new ScholarshipType({
//             name,
//             scholarships: [] 
//         });

//         const savedScholarshipType = await newScholarshipType.save();

//         return res.status(201).json({ scholarshipType: savedScholarshipType });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Failed to create scholarship type' });
//     }
// };





// module.exports.createScholarship = async (req, res) => {
//     try {
//     	const providerId = req.provider.id;
//     	const provider = await Provider.findById(providerId);

//     	if (!provider) {
//             return res.status(404).json({ error: 'Provider not found' });
//         }

//         const { scholarshipTypeName, name, criteria } = req.body;


//          const organization = provider.organization;
//          const author = `${provider.firstName} ${provider.lastName}`;

//         const scholarshipType = await ScholarshipType.findOne({ name: scholarshipTypeName });
//         if (!scholarshipType) {
//             return res.status(404).json({ error: 'Scholarship type not found' });
//         }


//         const newScholarship = {
//             name,
//             organization,
//             author,
//             criteria
//         };


//         scholarshipType.scholarships.push(newScholarship);


//         const savedScholarshipType = await scholarshipType.save();

//         return res.status(201).json({ scholarshipType: savedScholarshipType });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Failed to create scholarship' });
//     }
// };





module.exports.addScholarshipType = async (req, res) => {
    try {
        const { name } = req.body;

        const newScholarshipType = new ScholarshipType({ name });
        const savedType = await newScholarshipType.save();

        return res.status(201).json({ message: 'Scholarship type created successfully', scholarshipType: savedType });
    } catch (error) {
        console.error("Error creating scholarship type:", error);
        return res.status(500).json({ error: 'Error creating scholarship type' });
    }
};

// Add a new Scholarship under a specific Scholarship Type
module.exports.addScholarship = async (req, res) => {
    try {
        const { typeId, userId } = req.params;  
        const { name, organization, author, criteria } = req.body;


        const scholarshipType = await ScholarshipType.findById(typeId);
        if (!scholarshipType) {
            return res.status(404).json({ error: 'Scholarship type not found' });
        }


        const newScholarship = new Scholarship({
            name,
            organization,
            author,
            type: typeId,
            userId,
            criteria 
        });

        const savedScholarship = await newScholarship.save();
        return res.status(201).json({ message: 'Scholarship created successfully', scholarship: savedScholarship });
    } catch (error) {
        console.error("Error creating scholarship:", error);
        return res.status(500).json({ error: 'Error creating scholarship' });
    }
};

// Add a new Scholarship Criteria to an existing Scholarship
module.exports.addScholarshipCriteria = async (req, res) => {
    try {
        const { scholarshipId } = req.params;  
        const { name, valueType, value, description } = req.body;

 
        const scholarship = await Scholarship.findById(scholarshipId);
        if (!scholarship) {
            return res.status(404).json({ error: 'Scholarship not found' });
        }


        const newCriteria = new ScholarshipCriteria({
            name,
            valueType,
            value,
            description
        });

        scholarship.criteria.push(newCriteria);


        const updatedScholarship = await scholarship.save();
        return res.status(201).json({ message: 'Scholarship criteria added successfully', scholarship: updatedScholarship });
    } catch (error) {
        console.error("Error adding scholarship criteria:", error);
        return res.status(500).json({ error: 'Error adding scholarship criteria' });
    }
};
