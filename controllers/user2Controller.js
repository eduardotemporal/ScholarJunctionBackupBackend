// const User2 = require('../models/User2');
// const User = require('../models/User');

// // AES libraries and setup
// const crypto = require('crypto');
// const algorithm = 'aes-256-cbc';
// const key = Buffer.from("scholarJunction@Benilde>>AESPass"); // Ensure key is a Buffer

// // AES BLOCK
// function encrypt(text) {
//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv(algorithm, key, iv);
//   let encrypted = cipher.update(text, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   return JSON.stringify({ iv: iv.toString('hex'), encryptedData: encrypted });
// }

// function decrypt(encryptedText) {
//   const text = JSON.parse(encryptedText);
//   const iv = Buffer.from(text.iv, 'hex');
//   const encryptedData = Buffer.from(text.encryptedData, 'hex');
//   const decipher = crypto.createDecipheriv(algorithm, key, iv);
//   let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }
// // AES BLOCK

// module.exports.registerUser2 = async (userId, reqBody) => {
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return { error: 'User not found' };
//     }

//     // Encrypt fields
//     const encryptedAddress = encrypt(reqBody.address);
//     const encryptedBirthdate = encrypt(reqBody.birthdate);
//     const encryptedNationality = encrypt(reqBody.nationality);
//     const encryptedGender = encrypt(reqBody.gender);
//     const encryptedContactNumber = encrypt(reqBody.contactNumber);

//     // Create new User2 with encrypted data
//     const newUser2 = new User2({
//       address: encryptedAddress,
//       birthdate: encryptedBirthdate,
//       nationality: encryptedNationality,
//       gender: encryptedGender,
//       contactNumber: encryptedContactNumber,
//     });

//     // Save User2 and link to main user
//     const savedUser2 = await newUser2.save();
//     user.user2Id = savedUser2._id;
//     await user.save();

//     return { user: savedUser2 };

//   } catch (error) {
//     console.error(error);
//     return { error: 'Error registering user2' };
//   }
// };


// module.exports.getUserProfile = async (userId) => {
//   try {
//     // Find User2 document by userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return { error: 'User profile not found' };
//     }

//     // Decrypt each field
//     const decryptedAddress = decrypt(user2.address);
//     const decryptedBirthdate = decrypt(user2.birthdate);
//     const decryptedNationality = decrypt(user2.nationality);
//     const decryptedGender = decrypt(user2.gender);
//     const decryptedContactNumber = decrypt(user2.contactNumber);

//     // Construct and return the profile object with decrypted data
//     const userProfile = {
//       address: decryptedAddress,
//       birthdate: decryptedBirthdate,
//       nationality: decryptedNationality,
//       gender: decryptedGender,
//       contactNumber: decryptedContactNumber,
//     };

//     return { profile: userProfile };

//   } catch (error) {
//     console.error(error);
//     return { error: 'Error retrieving user profile' };
//   }
// };