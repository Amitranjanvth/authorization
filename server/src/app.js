import express from 'express';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import {authRouter} from './routes/authRoutes.js'

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(express.static('public'));
app.use(cookieparser());

app.get('/', function(req,res){
    res.send("welcome")
})

app.use('/api/auth', authRouter);

export default app;

