import express,{Request,Response} from 'express';
import './controllers/telegramControllers';

const app = express();

app.get("/",(_req:Request, res:Response)=>{
    res.status(200).send("COOL").end();
});

const PORT = 3000;

app.listen(PORT, ()=>{
    console.log("Media converter running on port", PORT);
});
