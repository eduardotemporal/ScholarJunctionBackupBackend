const mongoose = require('mongoose');

const scholarshipCriteriaSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    valueType: { type: String, enum: ['string', 'range', 'number', 'boolean', 'date', 'enumerated', 'object'], required: true },
    value: { type: [mongoose.Schema.Types.Mixed], default: [] }, 
    description: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const ScholarshipCriteria = mongoose.model('ScholarshipCriteria', scholarshipCriteriaSchema);

const scholarshipTypeSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    description: { type: String },
    criteria: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ScholarshipCriteria' }],
});

const ScholarshipType = mongoose.model('ScholarshipType', scholarshipTypeSchema);

const scholarshipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    organization: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    criteria: [{
        criterion: { type: mongoose.Schema.Types.ObjectId, ref: 'ScholarshipCriteria', required: true },
        value: { type: mongoose.Schema.Types.Mixed, required: true } 
    }],
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'ScholarshipType', required: true },
    deadline: { type: Date, required: true },
});

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

module.exports = { ScholarshipType, Scholarship, ScholarshipCriteria };
