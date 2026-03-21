import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import generateUniqueConnectCode from "../utils/generateUniqueConnectCode.js"

class AuthController {
    static async register(req, res) {
        try {
            const { fullName, username, email, password } = req.body;

            if (!fullName || !username || !email || !password) {
                return res.status(400).json({ message: "All fields are required" })
            }

            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" })
            }

            const existingUser = await User.findOne({ $or: [{ email }, { username }] })
                ;
            if (existingUser) {
                return res.status(400).json({ message: "Email or username already in use" })
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = new User({
                fullName,
                username,
                email,
                password: hashedPassword,
                connectCode: await generateUniqueConnectCode(),
            });

            await user.save();

            res.status(201).json({ message: "User registered successfully" });

        } catch (error) {
            console.error("Registration error", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" })
            }
            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );


            res.cookie("jwt", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "development",
            });

            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    connectCode: user.connectCode,
                },

            });

        } catch (error) {
            console.error("Login error", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async me(req, res) {
        try {
            const user = await User.findById(req.user.userId).select("-password");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    connectCode: user.connectCode,
                },
            });

        } catch (error) {
            console.error("me error", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default AuthController;