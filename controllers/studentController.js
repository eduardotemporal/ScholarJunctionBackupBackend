
const Student = require("../models/Student");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../auth");




//
module.exports.createOrUpdateStudentProfile = async (req, res) => {

    try {
        const { userId } = req.params; 
        const { myProfile, customCriteria } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'Student') {
            return res.status(403).json({ error: 'Unauthorized: User is not a student' });
        }

        let student = await Student.findOne({ userId: userId });

        if (student) {
            student.userId = userId
            student.myProfile = myProfile;
            student.customCriteria = customCriteria;
        } else {

            student = new Student({
                userId,
                myProfile,
                customCriteria
            });
        }

        const savedStudentProfile = await student.save();
        return res.status(200).json({ message: 'Student profile saved successfully', student: savedStudentProfile });

    } catch (error) {
        console.error("Error saving student profile:", error);
        return res.status(500).json({ error: 'Error saving student profile' });
    }

};

module.exports.createOrUpdateCustomCriteria = async (req, res) => {
    try {
        const { userId } = req.params; 
        const { customCriteria } = req.body;

        // Fetch the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 'Student') {
            return res.status(403).json({ error: 'Unauthorized: User is not a student' });
        }

        let student = await Student.findOne({ userId });

        if (student) {

            if (customCriteria && customCriteria.length > 0) {
                customCriteria.forEach(newCriteria => {
                    const existingCriteria = student.customCriteria.find(
                        c => c.criteriaName === newCriteria.criteriaName
                    );
                    if (existingCriteria) {

                        existingCriteria.criteriaValue = newCriteria.criteriaValue;
                    } else {

                        student.customCriteria.push(newCriteria);
                    }
                });
            }
        } else {
            return res.status(500).json({ error: 'Student Missing' });
        }

        // Save the updated student profile
        const savedStudentProfile = await student.save();

        return res.status(200).json({ message: 'Custom criteria saved successfully', student: savedStudentProfile });

    } catch (error) {
        console.error("Error saving custom criteria:", error);
        return res.status(500).json({ error: 'Error saving custom criteria' });
    }
};


module.exports.getStudentProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        console.log(user)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 'Student') {
            return res.status(403).json({ error: 'Unauthorized: User is not a student' });
        }

        const student = await Student.findOne({ userId });
        console.log(student)
        if (!student) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        return res.status(200).json({ student });
    } catch (error) {
        console.error("Error retrieving student profile:", error);
        return res.status(500).json({ error: 'Error retrieving student profile' });
    }
};