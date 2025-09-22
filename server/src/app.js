import express from 'express';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import {authRouter} from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js';

const allowedOrigin = ['http://localhost:5173']

const app = express();

app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(express.static('public'));
app.use(cookieparser());

app.get('/', function(req,res){
    res.send("welcome")
})



app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

export default app;

