// use a single import name for the User model
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import userModel from "../models/user.js";
import nodemailer from "nodemailer";
import otpModel from "../models/otp.js";

dotenv.config();

const transport = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || "dishnadinupriya@gmail.com",
        pass: process.env.EMAIL_PASS || "mhcd aili icuk twjh",
    },
});


export function saveUser(req, res) {

    if (req.body.rol == 'admin') {
        if (req.user == null) {
            res.status(401).json({ message: "You need to login first" });
            return;
        }
        if (req.user.rol !== 'admin') {
            res.status(403).json({ message: "You are not authorized to create a user" });
            return;
        }
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 8)
    // console.log(hashedPassword);
    const newUser = new userModel({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
        phone: req.body.phone,
        rol: req.body.rol,
    });

    newUser.save()
        .then((user) => {
            res.status(201).json({
                message: "User created successfully",
                user: user
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error creating user",
                error: error.message
            });
        });
}

export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    userModel.findOne({ email: email })
        .then((user) => {
            if (user == null) {
                res.status(404).json({
                    message: "User not found"
                });
            } else {

                //waradi pw dun wita block kirima
                // Check  for user.isDisabled
                //check if user is disabled
                //if invalid attesmts > 3, user.blockuntil >date.now()
                // if user.isDisabled is true, return 403 
                
                const isPasswordValid = bcrypt.compareSync(password, user.password);
                if (isPasswordValid) {
                    const userData = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        rol: user.rol,
                        isDisabled: user.isDisabled,
                        isMailVerified: user.isMailVerified
                    };

                    const token = jwt.sign(userData, process.env.JWT_KEY);

                    res.json({
                        message: "Login successful",
                        token: token,
                        user: userData
                    });
                } else {
                    res.status(401).json({
                        message: "Invalid password"
                    });

                    //use -> block until = Date.now() + 5 * 60 * 1000;
                    //user.invalidAttempts += 1;
                    //if (user.invalidAttempts >= 3) {
                    // user.isDisabled = true;
                }
            }
        }
        ).catch((error) => {
            res.status(500).json({
                message: "Error logging in",
                error: error.message
            });
        }
        );
}


export async function googleLogin(req, res) {
    const accussToken = req.body.accessToken;

    //verify token with google
    //if valid, get user info from google
    //check if user exists in db
    //if exists, generate jwt token and send to client
    //if not exists, create new user in db, generate jwt token and send to client

    //install axios
    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
            headers: {
                Authorization: "Bearer " + accussToken
            }
        });

        console.log(response);
        const user = await userModel.findOne({
            email: response.data.email
        });
        if(user === null){
            const newUser = new userModel({
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                isMailVerified: true,
                password:accussToken
                //image user.data.picture
            });
            await newUser.save();
            const userData = {
                        email:response.data.email,
                        firstName: response.data.given_name,
                        lastName: response.data.family_name,
                        rol:"user",
                        phone:"not Given",
                        isDisabled: false,
                        isMailVerified: true
                    };
                    const token = jwt.sign(userData, process.env.JWT_KEY, { expiresIn: '1h' });
                    res.json({
                        message: "Login successful",
                        token: token,
                        user: userData
                    });
        }
        else{
            const userData = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        rol: user.rol,
                        isDisabled: user.isDisabled,
                        isMailVerified: user.isMailVerified
                    };

                    const token = jwt.sign(userData, process.env.JWT_KEY);

                    res.json({
                        message: "Login successful",
                        token: token,
                        user: userData
                    });
        }

    } catch (error) {
        res.status(500).json({
            message: "Google login failed",
            error: error.message
        });
    }
}


export function getCurrentUser(req, res) {
    if (req.user == null) {
        res.status(401).json({ message: "you need to login first" });
        return;
    }
    res.json(req.user);
}

// 1. CONFIGURE EMAIL TRANSPORTER


export function sendOtp(req, res) {
    const { email } = req.body;

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const message = {
        from: "dishnadinupriya@gmail.com",
        to: email,
        subject: "Password Reset OTP",
        // HTML is prettier than plain text
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>OTP Verification</h2>
                <p>Your One-Time Password to reset your password is:</p>
                <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
                <p>This code expires in 10 minutes.</p>
            </div>
        `
    };

    transport.sendMail(message, (err, info) => {
        if (err) {
            console.error("Nodemailer Error:", err);
            // Return 500 so frontend knows it failed
            return res.status(500).json({ 
                message: "Error sending OTP", 
                error: err.message 
            });
        } else {
            // Save to DB
            const newOtp = new otpModel({ email, otp });
            newOtp.save()
                .then(() => {
                    res.json({ message: "OTP sent successfully" });
                })
                .catch((dbErr) => {
                    res.status(500).json({ message: "Error saving OTP", error: dbErr.message });
                });
        }
    });
}

// ... keep your changePassword function as is ...
// Assumes these are available in the module:
// const bcrypt = require('bcrypt');
// const userModel = require('./models/user');   // your user model
// const otpModel = require('./models/otp');     // your otp model

export async function changePassword(req, res) {
  const { email, newPassword, otp } = req.body;

  if (!email || !newPassword || !otp) {
    return res.status(400).json({ message: 'email, newPassword and otp are required' });
  }

  try {
    // Get the most recent OTP for this email (sort by createdAt descending)
    const lastOtpData = await otpModel.findOne({ email }).sort({ createdAt: -1 });

    if (!lastOtpData) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Optional: check OTP age (example: 10 minutes)
    const OTP_TTL_MS = 10 * 60 * 1000;
    const ageMs = Date.now() - new Date(lastOtpData.createdAt).getTime();
    if (ageMs > OTP_TTL_MS) {
      // remove old OTPs and treat as expired
      await otpModel.deleteMany({ email });
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Compare OTP values (coerce to strings to avoid type mismatch)
    if (String(lastOtpData.otp) !== String(otp)) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Hash new password (use async version to avoid blocking)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateResult = await userModel.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    // Remove OTP records for this email
    await otpModel.deleteMany({ email });

    if (updateResult.matchedCount === 0 && updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({
      message: 'Error changing password',
      error: error.message,
    });
  }
}

// controllers/userController.js

export function getUsers(req, res) {
    // Admin කෙනෙක්ද කියලා check කිරීම (ආරක්ෂාවට)
    if (!req.user || (req.user.rol !== "admin" && req.user.role !== "admin")) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    userModel.find()
        .then((users) => {
            res.json(users);
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
            res.status(500).json({ 
                message: "Error fetching users", 
                error: error.message 
            });
        });
}

// controllers/userController.js

// ... (අනිත් functions වලට පස්සේ මේක එකතු කරන්න)

export async function updateUser(req, res) {
    // Admin කෙනෙක්ද කියලා check කිරීම
    if (!req.user || (req.user.rol !== "admin" && req.user.role !== "admin")) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const userId = req.params.id;
    const updates = req.body; // { rol: "admin", isDisabled: true, etc. }

    try {
        const updatedUser = await userModel.findByIdAndUpdate(userId, updates, { new: true });
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
}
// controllers/userController.js

// ... keep all your existing functions ...

export async function deleteUser(req, res) {
    // 1. Security Check: Ensure only admins can delete
    if (!req.user || (req.user.rol !== "admin" && req.user.role !== "admin")) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const userId = req.params.id;

    try {
        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
}