const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, sparse: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Student', 'Provider', 'Admin'], required: true },
    
    ppi: {
        address: { type: String },
        birthdate: { type: String },
        nationality: { type: String },
        gender: { type: String },
        contactNumber: { type: String }
    },

    notifications: 
        {
            notificationNumber: { type: Number },
            type: { type: String }, 
            content: { type: String}, 
            status: { type: String, enum: ['read', 'unread', 'archived'], default: 'unread' },
            timestamp: { type: Date, default: Date.now },
            seen: { type: Boolean, default: false },
            priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
    },

    profile: {
        profilePicture: { type: String }, 
    },

    emailVerification: {
        token: { type: String },
        verified: { type: Boolean, default: false },
        sentAt: { type: Date }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
