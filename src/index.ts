
import express, {Request, Response, urlencoded} from "express";


const app = express();

app.use(express.json())
app.use(urlencoded({extended:true}));

app.get("/", (req:Request, res: Response)=>{
    res.send("Hello");
})



app.listen(4000, ()=>{
    console.log(`listening on port ${4000}`)
})