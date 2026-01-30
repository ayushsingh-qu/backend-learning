import express from 'express'
import { user } from '../models/userSchema.js';
import { userAuth } from '../middelware/userAuth.js';

const userRoute = express.Router();

//user ki details send karna
userRoute.get('/',userAuth,async (req,res)=>{
  try{
     //ab ham direct cookies ke through id ko receive kar sakte hai
   
    res.send(req.result);
  }catch(err){
    res.send(err)
  }
})

//user ko delete karna
userRoute.delete('/', userAuth,async (req,res)=>{
  try{
    await user.findByIdAndDelete(req._id);
    res.send("this user is deleted ");
  }catch(err){
    res.send(err)
  }
})

//user ke data ko update karna
userRoute.patch('/', async(req,res)=>{
  try{
    const {_id , ...update} = req.body;
    await user.findByIdAndUpdate(_id,update,{"runValidators":true});  ///ye 3rd argument data ko update karne se pahe se validation ko run karta hai by default ye false rahta hai agar isko true nahi karenge to data without validation uppdate ho jayegi
    res.send("Data updated succesfully")
  }catch (err) {
    res.status(400).send({
      error: err.message
    })
  }
})

export {userRoute}