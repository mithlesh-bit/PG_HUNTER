const jwt=require("jsonwebtoken")
const Register=require("../models/registers")

const authdash=async(req,resp,next)=>{
    try {
        const token  =req.cookies.jwt;
        const verify=jwt.verify(token,process.env.secretKey)
        const user= await Register.findOne({_id:verify._id})
        // resp.render("dashboard",{user})
        // console.log("user details",user);
        next();

    } catch (error) {
        resp.status(401).send("login timeout please login ")
    }
}

module.exports=authdash
