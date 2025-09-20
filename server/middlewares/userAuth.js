import jwt from 'jsonwebtoken'

const userAuth = async(req, res, next) => {
    const {token} = req.cookies;

    if(!token){
        return res.json({success:false, message: "tokens not found"});
    }
 
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

   if(tokenDecode.id){
    req.body.userId = tokenDecode.id
   }else{
    return res.send("un authorised")
   }
 next();
       
    } catch (error) {
        return res.json({success:false, message: "kya hbuaaaaa"})
    }
}

export default userAuth;
