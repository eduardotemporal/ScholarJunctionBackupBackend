const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    myProfile: [
        {
            gradeLevel: { type: String },   
            previousSchool: { type: String }, 
            schoolType: { type: String }, 
            familyOccupation: { type: String },
            pwd: { type: Boolean }, 
            chosenSchool: { type: String }, 
            chosenCourse: { type: String },             
            gpa: { type: Number, min: 1.0, max: 4.0 },
            financialStatus: { type: String },  
            financialStatusMinimum: { type: String },
            financialStatusMaximum: {type: String}, 
            applyingForVarsity: { type: Boolean },
            applyingForArtistScholarship: { type: Boolean },
            extracurricularActivities: { type: Boolean },	
            leadershipExperience: { type: Boolean },
            minorityGroup: { type: Boolean },
            studentWorker: { type: Boolean },
            innovativeProjects: { type: Boolean },
        }
    ],
    customCriteria: [
                {
                    criteriaName: { type: String },
                    criteriaValue: { type: String }
                }
    ]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
