import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import UserRoutes from './routes/user.route.js'

dotenv.config()

const app = express()
app.use(express.json());
app.use(cors())

connectDB();

 
app.get('/', async (req,res) => {
    res.status(200).json({
        message: "hello selam",
    });
    
})

app.use('/api/user', UserRoutes)

app.listen(process.env.PORT || 5000, () => {
    console.log(`the server is running on http://localhost:${process.env.PORT}`);
});