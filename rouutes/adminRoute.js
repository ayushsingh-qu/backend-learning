import express from 'express'
import { user } from '../models/userSchema.js'

const adminRoute = express.Router()

adminRoute.get('/userInfo',async (req,res)=>{
  try{

    //varification
    // const payload = jwt.verify(req.cookies.token,'Lund') //agar valid user hoga to payload return karega
    // console.log(payload);  // middelware kar dega

    const users = await user.find({})
    res.send(users)
    console.log(req.cookies)
  }
  catch (err) {
    res.send({
      error: err.message
    })
  }
})

export {adminRoute}