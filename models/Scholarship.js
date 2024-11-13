const mongoose = require('mongoose');


const scholarshipCriteriaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    valueType: { type: String, enum: ['string', 'range', 'number', 'boolean', 'date', 'enumerated', 'object'], required: true },
    value: { type: mongoose.Schema.Types.Mixed },  
    description: { type: String }
});

const ScholarshipCriteria = mongoose.model('ScholarshipCriteria', scholarshipCriteriaSchema);


const scholarshipTypeSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

const ScholarshipType = mongoose.model('ScholarshipType', scholarshipTypeSchema);

const scholarshipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    organization: { type: String, required: true },  
    author: { type: String, required: true }, 
    criteria: [scholarshipCriteriaSchema], 
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'ScholarshipType', required: true },  
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
});

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

module.exports = { ScholarshipType, Scholarship, ScholarshipCriteria };
