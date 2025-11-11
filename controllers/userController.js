import user from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import userModel from "../models/user.js";

dotenv.config();

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
    const newUser = new user({
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

    user.findOne({ email: email })
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