import { client } from "../config/redis.js";

//# fixed window methods

// const rateLimiter = async (req,res, next)=>{
//   try{
//     const ip = req.ip
//     const limit = await client.incr(ip)   ///ip jitani baar aayega uske key ki value badhati jayegi

//     if(limit>=65)
//       throw new Error("Your Request limit is exceeded")

//     if(limit==1)
//       await client.expire(3600)    //jab user pahla request mara hoga tab uska time hane note kar liya 
    
//     console.log(limit)
//     next();

//   }catch(err){
//     res.send({
//       Error:err.message
//     })
//   }
// }

//sliding-window

const windowSize = 3600;
const limit = 60;
const rateLimiter = async (req,res, next)=>{
  try{
    const key= `IP:${req.ip}`
    const currentTime = Date.now()/1000;
    const windowTime = currentTime- windowSize 

    await client.zRemRangeByScore(key , 0 , windowTime)  //sorted set se 0 se windowTime tak ki value delete ho jayegi
    const NumberOfRequest = await client.zCard(key)   //total number of request kitani hai usko find karega

    if(NumberOfRequest>=limit)
      throw new Error("your limit is exceeded")

    await client.zAdd(key , [{score:currentTime , value:`${currentTime}:${Math.random()}`}])  //request ko hamne sorted set me add kar liya

    await client.expire(key, windowSize)    // TTL ko hamne yaha par set kiya 
   
    next(); 
  }catch(err){
    res.send({
      Error:err.message
    })
  }
}

export {rateLimiter}