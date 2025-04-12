import {appConfig} from "../../config/app.config";
import mongoose from "mongoose";

const connectDatabase = async()=>{
    try{
        await mongoose.connect(appConfig.DATABASE_URL);
        console.log("connected to mongo database");
    }catch(error){
        console.log("Error connecting to mongo database", error);
        process.exit(1);
    }
}

export default connectDatabase;

