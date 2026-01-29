import express from "express"
import bcrypt from "bcrypt"
import { user } from "../models/userSchema.js"
import { validation } from "../validator.js"
import cookieParser from 'cookie-parser'


const authRoute = express.Router()


authRoute.post('/registration',async (req,res)=>{
  try{
    //api level validation for required field
    //isko ham alag function bnakar karte hai
    
    validation(req.body);

    //password ko encrypt kar ke store karega
    req.body.password = await bcrypt.hash(req.body.password,10)

    await user.create(req.body)
    res.send("user is created")
  }
  catch (err) {
    res.status(400).send({
      error: err.message
    })
  }
})

authRoute.post('/login',async(req,res)=>{
  try{
    //validate user inputs ,email,userid,and password
     console.log(req.body)
    const newUser =await user.findOne({emailid:req.body.emailid}) //ab ham without id login kar sakte hai aur id ko as a cookies send kar denge 

    //user ka varification hoga
    // if(!(newUser.emailid === req.body.emailid))
    //   throw new Error('Email or Password is Incorrect')
    
    const isAllowed = await bcrypt.compare(req.body.password,newUser.password)
    if(!isAllowed)
      throw new Error("password galat hai bhai")
    
    //jwt tokens cookies ke form me jayega
    //  const token = jwt.sign({_id:newUser._id,emailid:newUser.emailid},'Lund',{expiresIn:'2d'})
     //  payload aur key hai isme  ,, expires in optional hai aur isko string ke form me '10h' ya '2 days' bhi send kar sakte hai
     const token = newUser.getJWT(); 
     res.cookie('token',token) 

     res.status(200).send({
      message: "Login successfully ✅"
    })

  }
 catch (err) {
    res.status(400).send({
      error: err.message
    })
  }
})



export {authRoute}