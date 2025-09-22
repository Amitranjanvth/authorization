import User from '../../src/models/user.models.js'

//controller for get user data

export const getUserData = async (req,res) => {

     const userId = req.user.id;
    try {
        const user = await User.findById(userId)
  console.log(user)
        if(!user){
            res.send("User not found....");
         }

        res.json({success:true, userData: {
            fullName: user.fullName,
            isAuthenticated: user.isAccountVerified
         }})
        
    } catch (error) {
        return res.json({success: false, message: "Something went wrong while getting user data"})
    }
} 