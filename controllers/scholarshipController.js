const { ScholarshipType, Scholarship, ScholarshipCriteria } = require('../models/Scholarship');
const User = require("../models/User");


module.exports.addScholarshipCriteria = async (req, res) => {
    console.log("Bravo")
    try {
        const { name, valueType, value, description } = req.body;
        const { userId } = req.params;  

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newCriteria = new ScholarshipCriteria({
            name,
            valueType,
            value,
            description,
            userId
        });

        await newCriteria.save();
        res.status(201).json({ message: 'Scholarship criteria created successfully', criteria: newCriteria });
    } catch (error) {
        console.error('Error creating scholarship criteria:', error);
        res.status(500).json({ error: 'Failed to create scholarship criteria' });
    }
};



//SCHOLARSHIP TYPES

module.exports.createScholarshipType = async (req, res) => {
    try {
        const { name, description, criteria } = req.body;


        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const scholarshipType = new ScholarshipType({
            name,
            description,
            criteria, 
        });

        const savedScholarshipType = await scholarshipType.save();
        res.status(201).json(savedScholarshipType);
    } catch (error) {
        res.status(500).json({ message: 'Error creating scholarship type', error });
    }
};



//GET ALL SCHOLARSHIP TYPES
exports.getScholarshipTypes = async (req, res) => {
    try {
        const scholarshipTypes = await ScholarshipType.find().populate('criteria');
        res.status(200).json(scholarshipTypes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching scholarship types', error });
    }
};

// exports.getScholarshipTypeById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const scholarshipType = await ScholarshipType.findById(id).populate('criteria');
        
//         if (!scholarshipType) {
//             return res.status(404).json({ message: 'Scholarship type not found' });
//         }

//         res.status(200).json(scholarshipType);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching scholarship type', error });
//     }
// };


// exports.updateScholarshipType = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, description, criteria } = req.body;

//         const scholarshipType = await ScholarshipType.findByIdAndUpdate(
//             id,
//             { name, description, criteria },
//             { new: true }
//         );

//         if (!scholarshipType) {
//             return res.status(404).json({ message: 'Scholarship type not found' });
//         }

//         res.status(200).json(scholarshipType);
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating scholarship type', error });
//     }
// };

// // Delete a scholarship type
// exports.deleteScholarshipType = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const scholarshipType = await ScholarshipType.findByIdAndDelete(id);
//         if (!scholarshipType) {
//             return res.status(404).json({ message: 'Scholarship type not found' });
//         }

//         res.status(200).json({ message: 'Scholarship type deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting scholarship type', error });
//     }
// };



//SCHOLARSHIPS

module.exports.createScholarship = async (req, res) => {
    console.log('hello')
    const { name, organization, criteria, type, deadline } = req.body;
    const { userId } = req.params;  
    try {

        if (!name || !organization || !userId || !criteria || !type || !deadline) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newScholarship = new Scholarship({
            name,
            organization,
            userId,
            criteria,
            type,
            deadline
        });

        const savedScholarship = await newScholarship.save();
        res.status(201).json({ message: 'Scholarship created successfully', scholarship: savedScholarship });
    } catch (error) {
        res.status(500).json({ message: 'Error creating scholarship', error });
    }
};


//GET ALL SCHOLARSHIPS
module.exports.getScholarships = async (req, res) => {
    try {
        const scholarships = await Scholarship.find()
            .populate('userId', '_id') 
            .populate({
                path: 'criteria.criterion',
                model: 'ScholarshipCriteria',
                select: 'name description'  
            })
            .populate('type', 'name description');

        res.json(scholarships);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching scholarships', error });
    }
};


//GET ALL SCHOLARSHIPS UNDER ONE TYPE

module.exports.getScholarshipsByType = async (req, res) => {
        const { typeId } = req.params;
        try {
            const scholarships = await Scholarship.find({ type: typeId })
                .populate('type', 'name description')
                .populate({
                    path: 'criteria.criterion',
                    model: 'ScholarshipCriteria',
                    select: 'name description',
                });

            res.status(200).json(scholarships);
        } catch (error) {
            console.error('Error fetching scholarships by type:', error);
            res.status(500).json({ message: 'Error fetching scholarships by type', error });
    }
}


//GET CRITERIA OF ALL SCHOLARSHIPS UNDER ONE TYPE

module.exports.getUniqueCriteriaByScholarshipType = async (typeId) => {
    try {

        const scholarships = await Scholarship.find({ type: typeId }).select('criteria');


        const criteriaIds = scholarships.flatMap(scholarship => 
            scholarship.criteria.map(c => c.criterion.toString())
        );


        const uniqueCriteriaIds = [...new Set(criteriaIds)];

        const uniqueCriteria = await ScholarshipCriteria.find({ _id: { $in: uniqueCriteriaIds } });

        console.log("Unique criteria for the specified scholarship type:", uniqueCriteria);
        return uniqueCriteria;
    } catch (error) {
        console.error('Error fetching unique criteria by scholarship type:', error);
        throw error;
    }
};