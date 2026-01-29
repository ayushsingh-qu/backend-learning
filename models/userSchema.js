import mongoose from "mongoose";
import { Schema } from "mongoose";
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
  firstName:{
    type:String,
    required: true,
    minLength:3,
    maxLength:20

  },

  lastName:{
    type:String,
    minLength:1,
    maxLength:15
  },

  age:{
    type:Number,
    min:15,
    max:80,
    required: true
  },

  gender:{
    type:String,
    // enum:['male','female','other']
    
  },

  password:{
    type:String,
    required: true
  },

  emailid:{
    type:String,
    required: true,
    unique:true, //unique email id hoga tabhi user register ho payega
    trim: true,
    lowerCase:true
  },

  photo:{
    type:String,
    default:"this is default photo link"

  }

},{timestamps:true}) //timestamps se hamara last updations and kab create hua tha wo date store ho jata hai

userSchema.methods.getJWT = function(){
  const ans = jwt.sign({emailid:this.emailid , _id:this._id},process.env.AUTH_KEY,{expiresIn:'2d'})   //ye function ham dirctly call kar sakte hai token genrate karne ke liye
  console.log("new token generated")
  return ans;
} //yaha hame arrow function ko use nahi karna chahiye kyunki wha par this keyword ka meanig change ho jaye

const user = mongoose.model('user', userSchema);

export {user}