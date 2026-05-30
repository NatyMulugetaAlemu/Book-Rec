import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "Email already exists" });

        const user2 = await User.findOne({ username });

        if (user2) return res.status(400).json({ message: "Username already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // get random avatar
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;


        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profileImage,
        });
        if (newUser) {
           
            const token = generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                token,
                newUser: {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    profileImage: newUser.profileImage,
                }

            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const newUser = await User.findOne({ email });

        if (!newUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, newUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(newUser._id, res);

        res.status(200).json({
            token,
            newUser: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profileImage: newUser.profileImage,
            }
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};





