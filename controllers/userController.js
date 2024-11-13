const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../auth");
const User = require('../models/User');
const { upload, uploadProfile } = require('../config/uploadConfig');

//AES libs and req
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = Buffer.from("scholarJunction@Benilde>>AESPass");



// AES BLOCK

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return JSON.stringify({ iv: iv.toString('hex'), encryptedData: encrypted });
}

function decrypt(encryptedText) {
  const text = JSON.parse(encryptedText);
  const iv = Buffer.from(text.iv, 'hex');
  const encryptedData = Buffer.from(text.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// AES BLOCK

module.exports.registerUser = async (reqBody) => {
    try {
        const existingUser = await User.findOne({ email: reqBody.email });
        if (existingUser) {
            return { error: 'Email already in use' };
        }
        if (reqBody.password !== reqBody.confirmPassword) {
            return { error: 'Passwords do not match' };
        }
        const hashedPassword = await bcrypt.hashSync(reqBody.password, 10);

        var encryptedEmail = encrypt(reqBody.email)
        var encryptedFirstName = encrypt(reqBody.firstName)
        var encryptedLastName = encrypt(reqBody.lastName)

        var decryptedEmail = decrypt(encryptedEmail)
        var decryptedFirstName = decrypt(encryptedFirstName)
        var decryptedLastName = decrypt(encryptedLastName)

        console.log(encryptedEmail)
        console.log(encryptedFirstName)
        console.log(encryptedLastName)

        console.log(decryptedEmail)
        console.log(decryptedFirstName)
        console.log(decryptedLastName)

        const newUser = new User({
            email: encryptedEmail,
            firstName: encryptedFirstName,
            lastName: encryptedLastName,
            password: hashedPassword,
            role: reqBody.role
        });

        const savedUser = await newUser.save();
        const accessToken = auth.createAccessToken(savedUser);

        return { user: savedUser, accessToken };

    } catch (error) {
        console.error(error);
        return { error: 'Error registering user' };
    }
};


module.exports.registerPPI = async (userId, reqBody) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { error: 'User not found' };
        }

        user.ppi = {
            address: encrypt(reqBody.address),
            birthdate: encrypt(reqBody.birthdate),
            nationality: encrypt(reqBody.nationality),
            gender: encrypt(reqBody.gender),
            contactNumber: encrypt(reqBody.contactNumber)
        };
        console.log(reqBody.reqaddress)
        console.log(reqBody.birthdate)
        console.log(reqBody.nationality)
        console.log(reqBody.address)
        console.log(reqBody.address)

        await user.save();
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Error updating PPI' };
    }
};


module.exports.getUserData = async (userId) => {
    try {
        const user = await User.findById(userId);


        if (!user) {
            return { error: 'User not found' };
        }

        const email = decrypt(user.email);
        const firstName = decrypt(user.firstName);
        const lastName = decrypt(user.lastName);

        let ppiData = {};
        let profilePicture = {}
        if (user.ppi) {
            ppiData = {
                address: decrypt(user.ppi.address),
                birthdate: decrypt(user.ppi.birthdate),
                nationality: decrypt(user.ppi.nationality),
                gender: decrypt(user.ppi.gender),
                contactNumber: decrypt(user.ppi.contactNumber)
            };
        }

        if (user.profile){
            profilePicture = user.profile.profilePicture
        }

        return {
            email,
            firstName,
            lastName,
            role: user.role,
            ppi: ppiData,
            profilePicture: profilePicture
        };

    } catch (error) {
        console.error(error);
        return { error: 'Error retrieving user data' };
    }
};


// module.exports.tester = async () => {
//     try {

//         const users = await User.find();

//         // Check if users exist
//         if (users.length === 0) {
//             console.log('No users found.');
//             return;
//         }

//         // Log the users to the console
//         console.log('Users found:', users);

//         // Optionally, log the first user's email to check
//         console.log('First user email:', users[0].email);

//     } catch (error) {
//         console.error('Error fetching users:', error);
//     }
// };



module.exports.loginUser = async (reqBody) => {
  try {
    const users = await User.find();

    for (const user of users) {
      const decryptedEmail = decrypt(user.email);

      if (decryptedEmail === reqBody.email) {
        const passwordMatch = await bcrypt.compare(reqBody.password, user.password);

        if (!passwordMatch) {
          return { error: { message: "Wrong password", statusCode: 401 } };
        }

        const userLoad = {
          id: user._id,
          email: decryptedEmail,
          role: user.role
        };

        const accessToken = auth.createAccessToken(userLoad);

        return {
          user: { id: user._id, email: decryptedEmail, role: user.role },
          accessToken,
        };
      }
    }

    return { error: { message: "Invalid email or password", statusCode: 404 } };

  } catch (error) {
    return { error: { message: "Error logging in user", statusCode: 500 } };
  }
};

module.exports.uploadProfilePicture = async (req, res) => {
  uploadProfile(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
      console.log(req.params.userId)
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
      console.log("req.params.userId")
    }

    try {
      const userId = req.params.userId; 
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }


      user.profile.profilePicture = req.file.filename;
      await user.save();

      return res.json({
        message: 'Profile picture uploaded successfully',
        profilePicture: req.file.filename, 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to upload profile picture' });
    }
  });
};

module.exports.getUserProfilePicture = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return { error: 'User not found' };
        }

        if (!user.profile || !user.profile.profilePicture) {
            return { error: 'Profile picture not found' };
        }

        const profilePictureUrl = user.profile.profilePicture;

        return {
            profilePicture: profilePictureUrl
        };

    } catch (error) {
        console.error(error);
        return { error: 'Error retrieving user profile picture' };
    }
};