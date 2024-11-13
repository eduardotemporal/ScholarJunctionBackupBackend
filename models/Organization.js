const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },  // Added 'required'
    address: { type: String, required: true },  // Added 'required'
    organizationPassword: { type: String, required: true } // Added 'required'
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;