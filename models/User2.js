const mongoose = require('mongoose');

const user2Schema = new mongoose.Schema({
    address: { type: String , required: true},
    birthdate: { type: String , required: true },
    nationality: { type: String , required: true},
    gender: { type: String , required: true},
    contactNumber: { type: String , required: true},
});

const User2 = mongoose.model('User2', user2Schema);

module.exports = User2;
    