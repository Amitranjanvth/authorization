import User from '../models/user.models.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../../config/nodemailer.js'
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from '../../config/emailTemplate.js'

export const registerUser = async (req, res) => {
    const { username, email, password, fullName } = req.body;
    
    // Validation
    if (!username || !email || !password || !fullName) {
      
        return res.status(400).json({
            success: false,
            message: "All inputs are required"
        });
    }

    try {
        // Check if user already exists
        const existedUser = await User.findOne({
        
            $or: [{ email }, { username }]
        });
     
        if (existedUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email or username"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
            username,
        });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
            expiresIn: "7d" 
        });

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Welcome to Auth App`,
            text: `Welcome to the Auth App website ...You are successfully register to our website portal with email : ${email}`
        }
        await transporter.sendMail(mailOptions);

       

        // Send success response (excluding password)
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName
            }
        });

    } catch (error) {
        console.error("Error while registering user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    // Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password"
            });
        }
       
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
            expiresIn: "7d" 
        });
   
        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Send success response (excluding password)
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName
            }
        });

    } catch (error) {
        console.error("Error while logging in user:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const logoutUser = async(req,res) => {
    try {
       res.clearCookie("token",{
           httpOnly: true,
           secure: process.env.NODE_ENV === "production",
           sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
       })
       return res.json({ success: true, message: "Logged out"})
       
    } catch (error) {
        return res.json({ success : false, message: error.message})
    }
}

export const sendVerifyOtp = async(req, res) => {
    try {
        const userId = req.user.id;
       //  console.log(userId)
        const user = await User.findById(userId);
      //  console.log(user)
        if(user.isAccountVerified){
            return res.json({success:false, message: "User already verified"})
        }
    
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
       
        await user.save();
    
         const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: `Welcome to Auth App`,
                // text: `Your otp is : ${otp}`
                html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email)
            }
            await transporter.sendMail(mailOptions);
    
           return res.json({success:true, message: "verification otp send to your email"});
    
    } catch (error) {
         return res.json({success: false, message:"Something went wrong yaa..."});
    }

}

export const verifyEmail = async(req,res) => {
    const {otp} = req.body;
    const userId = req.user.id;
    if(!userId || !otp){
        return res.json({success:false, message: "Something went wrong"});
    }
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.json({success:false, message: "user not found"})
        }
        if(user.verifyOtp === "" || user.verifyOtp !== otp){
            return res.json({success:false,message:"Invalid credentials"})
        }

        if(user.verifyOtpExpireAt <Date.now()){
            return res.json({success:false, message: "otp is expired"})
        }

        user.isAccountVerified=true,
        user.verifyOtp=" ",
        user.verifyOtpExpireAt=0

        await user.save();

        return res.json({success:true, message: "User is verified"})

    } catch (error) {
          return res.json({success:true, message: error})
    }
}

export const isAuthenticated = async(req,res) => {
    try {
        return res.json({success:true,message: "Authenticated user"})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const resetOtp = async(req,res) => {
    const {email} = req.body;
    if(!email){
        res.send("please filled your email")
    }

    try {
        const user = await User.findOne({email});
        if(!user){
            res.json({success: false, message: "User not found..."})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 5 * 60  * 1000;
       
        await user.save();
    
         const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: `Welcome to Auth App`,
                // text: `Your otp is : ${otp}`
                html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email)
            }
            await transporter.sendMail(mailOptions);

            return res.json({success:true, message: "otp sent to your email..."})
    } catch (error) {
         return res.json({success:false, message: error.message})
    }
}

export const resetPassword = async(req,res) => {
    const {email, otp, newPassword} = req.body;
   
    if(!email || !otp || !newPassword){
      return res.send("All credentials are Neccessary");
    }

   try {
     const user = await User.findOne({email});
  
     if(!user){
        return res.json({success: false, message: "User not found.... "})
     }
 
     if(user.resetOtp === '' || user.resetOtp !== otp){
         return res.json({success:false, message: "Invalid Credentials..."})
     }
 
     if(user.resetOtpExpireAt < Date.now()){
          return res.json({success:false, message: "otp is expired"})
     }
    console.log(user)
     const hashedPassword = await bcrypt.hash(newPassword,10);
     user.password = hashedPassword,
     user.resetOtp = "",
     user.resetOtpExpireAt = 0,
     await user.save();
 
     return res.json({success:true, message: "Password changed Successfully..."})
   } catch (error) {
     return res.json({success: false, message: "Something went wrong while changing password"})
   }
}
