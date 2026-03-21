import bycrypt from "bcrypt"
import User from "../models/User.js"

class AuthenticationController{
    static async register(req,res){
        try{
            const{fullName, username, email, password} = req.body;

            if(!fullName || !username || !email || !password){
                return res.status(400).json({message: "All fields are required"})
            }

            if (password.length < 6){
                return res.status(400).json({message: "Password must be at least 6 characters"})
            }

            const existingUser = await User.findOne({$or: [{email}, {username}]})
            ;
            if(existingUser){
                return res.status(400).json({message: "Email or username already in use"})
            }

            const salt = await bycrypt.genSalt(10);
            const hashedPassword = await bycrypt.hash(password, salt);

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
}