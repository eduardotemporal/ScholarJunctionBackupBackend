const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const providerSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organization: { type: String, required: true },
    organizationType: { type: String, enum: ['new', 'existing'], required: true },
    kycDetails: [
        {
            governmentTypeID: { type: String }, 
            governmentID: { type: String },
            proofOfEmploymentType: { type: String }, 
            proofOfEmployment: { type: String }
        }
    ],
    organizationDetails: [
        {
            position: { type: String },
            name: { type: String },
            address: { type: String },
            organizationPassword: { type: String } 
        }
    ]
});

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;
        