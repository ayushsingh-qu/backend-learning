import express from "express"
import bcrypt from "bcrypt"
import { user } from "../models/userSchema.js"
import { validation } from "../validator.js"
import cookieParser from 'cookie-parser'
import { client } from "../config/redis.js"
import jwt from 'jsonwebtoken'
import { userAuth } from "../middelware/userAuth.js"


const authRoute = express.Router()

//registration
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

//login
authRoute.post('/login',async(req,res)=>{
  try{
    //validate user inputs ,email,userid,and password
    const {emailid , password} = req.body
    const newUser = await user.findOne({emailid}) //ab ham without id login kar sakte hai aur id ko as a cookies send kar denge 
     if(!newUser)
      throw new Error('Email or Password is Incorrect')

    //user ka varification hoga
    if(!(newUser.emailid === emailid))
      throw new Error('Email ya Password is Incorrect')
    
    const isAllowed = await bcrypt.compare(password,newUser.password)
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

//logout
//redis ke database me blocked token dalna hoga
authRoute.post('/logout',userAuth , async (req,res)=>{
  try{
    const {token} = req.cookies
    const payload = jwt.decode(token)
    console.log(payload);
    await client.set(`token:${token}`,'blocked')
    // await client.expire(`token:${token}`,1800)       //ye value second me dete hai(current time se)
    await client.expireAt(`token:${token}`,payload.exp)
    res.cookie('token', null , {expires: new Date( Date.now())})   //cookie ko expire kar dega
    res.send({
       message: "Logged out successfully ✅"
    })

  }catch(err){
    res.send({
      Error: err.message
    })
  }
})

export {authRoute}