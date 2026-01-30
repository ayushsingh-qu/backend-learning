import { client } from "../config/redis.js";


const rateLimiter = async (req,res, next)=>{
  try{
    const ip = req.ip
    const limit = await client.incr(ip)   ///ip jitani baar aayega uske key ki value badhati jayegi

    if(limit>=65)
      throw new Error("Your Request limit is exceeded")

    if(limit==1)
      await client.expire(3600)    //jab user pahla request mara hoga tab uska time hane note kar liya 
    
    console.log(limit)
    next();

  }catch(err){
    res.send({
      Error:err.message
    })
  }
}

export {rateLimiter}