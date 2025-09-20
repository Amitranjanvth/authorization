import mongoose from 'mongoose';
import {DB_NAME} from '../constant.js';

const connectDb = async () => {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n Mongodb connected successfully !! DB HOST : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Mongodb connect nhi ho pa rha hai bhai", error); 
        process.exit(1);
    }
}

export default connectDb;