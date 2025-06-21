import user from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
                // Check password
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

                    const token = jwt.sign(userData, "disna12345")

                    res.json({
                        message: "Login successful",
                        token: token,
                        user: userData
                    });
                } else {
                    res.status(401).json({
                        message: "Invalid password"
                    });
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
