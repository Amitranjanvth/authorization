import User from '../../src/models/user.models.js'

//controller for get user data

export const getUserData = async (req,res) => {

    const {userId} = req.body;
    try {
        const user = await User.findById(userId)

        if(!user){
            res.send("User not found....");
         }

         return res.json({success:true, userData: {
            name: user.fullName,
            isAuthenticated: user.isAuthenticated
         }})
         
    } catch (error) {
        return res.json({success: false, message: "Something went wrong while getting user data"})
    }
} 