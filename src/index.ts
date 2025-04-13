
import express, {Request, Response, urlencoded} from "express";
import connectDatabase from "./auth/database/dbConnect";
import { appConfig } from "./config/app.config";
import { authRoute } from "./routes/authRoutes";
const app = express();

app.use(express.json())
app.use(urlencoded({extended:true}));

app.get("/", (req:Request, res: Response)=>{
    res.send("Hello");
})

app.use("/api/auth", authRoute)



app.listen(appConfig.PORT,async ()=>{
    console.log(`listening on port `)
    await connectDatabase();
})