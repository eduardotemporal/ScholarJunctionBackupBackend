const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(     {
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
        });

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
