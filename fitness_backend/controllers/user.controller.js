import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import user from '../models/user.model.js'
import Workout from '../models/workout.model.js'

dotenv.config()

 const UserRegister = async (req,res) => {
    try {
        const {email, password, name, img} = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }
        const existingUser = await user.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new user({
            name: name,
            password:hashedPassword,
            email:email,
            img:img
        });

        await newUser.save()
        const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {expiresIn: '30d'})
        res.status(201).json({message: "User registered successfully"});
        
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({message: "Internal server error"});
        
    }
    
}

const UserLogin = async (req,res) => {
    try {
        const {email, password} = req.body;

        //check if the user exist
        const User = await user.findOne({email});
        if(!User){
            return res.status(404).json({ message: 'user not found' });
        }

        //check the password
        const isMatch = bcrypt.compareSync(password,User.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //create a jwt token
        const token = jwt.sign({id:User._id}, process.env.JWT_SECRET, {expiresIn:'30d'})
        res.status(200).json({message: 'Login successful'});

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
        
    }
    
}


export {UserRegister, UserLogin}