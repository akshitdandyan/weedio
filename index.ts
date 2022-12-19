import express, { Request, Response } from "express";
import { resolve } from "path";
// import "./controllers/telegramControllers";

const app = express();

const __dirname = resolve();
app.use(express.static(__dirname + "/public"));

app.get("/", (_req: Request, res: Response) => {
    res.sendFile(__dirname + "/public/index.html");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Media converter running on port", PORT);
});
