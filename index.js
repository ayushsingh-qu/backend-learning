import express from 'express'
import { main } from './database.js'
import cookieParser from 'cookie-parser'
// import dotenv from 'dotenv';
// dotenv.config();
import 'dotenv/config';
import { userRoute } from './rouutes/userRoute.js'
import { authRoute } from './rouutes/authRoute.js'
import { adminRoute } from './rouutes/adminRoute.js';


const app = express()

app.use(express.json());
app.use(cookieParser());  //cookie ko json me convert karega

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/admin',adminRoute)


main()
.then( async ()=>{
  console.log('connectd to the DB')

  app.listen(4000,()=>{
  console.log('port is activated') 
  })
})
.catch((Error)=>console.log(Error))
  

