import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import publishRouter from './routes/PublisherRoute.js'
import userRouter from './routes/userRoute.js'
import bookRouter from './routes/bookRoute.js'
import reviewRouter from './routes/reviewRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares

app.use(express.json())
app.use(cors())

// api endpoints 
app.use('/api/admin',publishRouter)
app.use('/api/user',userRouter)
app.use('/api/book',bookRouter)
app.use('/api/review', reviewRouter);

app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port, ()=> console.log("Server Started",port))