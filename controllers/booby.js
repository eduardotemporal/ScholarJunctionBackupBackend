
const Student = require("../models/Student");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");
const auth = require("../auth");


module.exports.registerStudent = async (reqBody) => {
    try {
        const existingStudent = await Student.findOne({ email: reqBody.email });
        if (existingStudent) {
            return { error: 'Email already in use' };
        }

        if (reqBody.password !== reqBody.confirmPassword) {
            return { error: 'Passwords do not match' };
        }
        const hashedPassword = await bcrypt.hashSync(reqBody.password, 10);

        const newStudent = new Student({
            email: reqBody.email,
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            password: hashedPassword,
            address: reqBody.address,
            birthdate: reqBody.birthdate,
            nationality: reqBody.nationality,
            gender: reqBody.gender,
            contactNumber: reqBody.contactNumber,
            isAdmin : false,
            role: reqBody.role
        });

        const savedStudent = await newStudent.save();

        const accessToken = auth.createAccessToken(savedStudent);

        return { student: savedStudent, accessToken };

    } catch (error) {
    console.error(error);
    return { error: 'Failed to register student' };
    }
};


    module.exports.getRegisteredStudent = async (req, res) => {
        try {
           
            const studentId = req.student.id;

            const student = await Student.findById(studentId);

            if (!student) {
                return res.status(404).json({ error: 'Student not found' });
            }


            return res.json({ student });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to retrieve student information' });
        }
    };

module.exports.addCustomCriteria = async (req, res) => {
  try {
   const studentId = req.student.id;
    const data = req.body

    const newCriteria = ({
        criteriaName:data.criteriaName,
        criteriaValue:data.criteriaValue
    })

    console.log(newCriteria)

    // Find the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }

    // Add the new custom criteria to the student's profile
    student.customCriteria.push(newCriteria);

    // Save the updated student document
    await student.save();

    return res.send({ message: 'Custom criteria added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to add custom criteria' });
  }
};




module.exports.createStudentProfile = async (req, res) => {
  try {
    const studentId = req.student.id; 
    const profileData = req.body; 
    const newProfile = new Profile({
      gradeLevel: profileData.gradeLevel,
      previousSchool: profileData.previousSchool,
      schoolType: profileData.schoolType,
      familyOccupation: profileData.familyOccupation,
      pwd: profileData.pwd,
      chosenSchool: profileData.chosenSchool,
      chosenCourse: profileData.chosenCourse,
      gpa: profileData.gpa,
      financialStatus: profileData.financialStatus,
      financialStatusMinimum: profileData.financialStatusMinimum,
      financialStatusMaximum: profileData.financialStatusMaximum,
      applyingForVarsity: profileData.applyingForVarsity,
      applyingForArtistScholarship: profileData.applyingForArtistScholarship,
      extracurricularActivities: profileData.extracurricularActivities,
      leadershipExperience: profileData.leadershipExperience,
      minorityGroup: profileData.minorityGroup,
      studentWorker: profileData.studentWorker,
      innovativeProjects: profileData.innovativeProjects
    });

    const student = await Student.findById(studentId);
    const savedProfile = await newProfile.save();

    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }

    student.myProfile.push(newProfile); // Push the new profile entry

    await student.save(); // Save the updated student document

    return res.send({ message: 'Profile saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to post profile' });
  }
}

module.exports.getStudentProfileById = async (req, res) => {
  try {
    const profileId = req.params.profileId; // Extract the profile ID from the request parameters

  
    const profile = await StudentProfile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }


    res.json({ profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve student profile' });
  }
};

module.exports.updateStudentProfile = async (studentId, profileData) => {
    try {

        const student = await Student.findById(studentId);
        if (!student) {
            return { error: 'Student not found' };
        }

        student.gradeLevel = profileData.gradeLevel;
        student.previousSchool = profileData.previousSchool;
        student.schoolType = profileData.schoolType;
        student.familyOccupation = profileData.familyOccupation;
        student.pwd = profileData.pwd;
        student.chosenSchool = profileData.chosenSchool;
        student.chosenCourse = profileData.chosenCourse;
        student.gpa = profileData.gpa;
        student.financialStatus = profileData.financialStatus;
        student.applyingForVarsity = profileData.applyingForVarsity;
        student.applyingForArtistScholarship = profileData.applyingForArtistScholarship;
        student.extracurricularActivities = profileData.extracurricularActivities;
        student.leadershipExperience = profileData.leadershipExperience;
        student.minorityGroup = profileData.minorityGroup;
        student.studentWorker = profileData.studentWorker;
        student.innovativeProjects = profileData.innovativeProjects;


        const updatedStudent = await student.save();
        return updatedStudent;
    } catch (error) {
        throw error;
    }
};

module.exports.getStudentById = async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        return res.status(200).json(student);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};