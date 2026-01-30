import jwt from 'jsonwebtoken'
import { user } from '../models/userSchema.js'
import { client } from '../config/redis.js'

const userAuth = async (req,res,next)=>{
  try{

const {token} = req.cookies
if(!token)
  throw new Error("token is not present")

 const data = jwt.verify(token, process.env.AUTH_KEY)
 const {_id} = data
 if(!_id)
  throw new Error('id is not prsent')
 
 const result = await user.findById(_id);
 if(!result)
  throw new Error('user is not present in the database')

 const isBlocked = await client.exists(`token:${token}`)
   if(isBlocked)
     throw new Error("Please Login Your Token is expired")

 req.result= result  //isko ham req.result ke andar daal diye  hai so that aur kahi ye use ho paye
 req._id = _id
 console.log('user Authenticated')
 
 next();
 

  }catch(err){
    res.send({
      Error:err.message
    })
  }

}

export {userAuth}