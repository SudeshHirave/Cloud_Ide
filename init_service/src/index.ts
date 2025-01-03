import express from "express";
import dotenv from "dotenv"
import cors from "cors";
dotenv.config()
import { copyS3fol } from "./aws2";
const app = express();
app.use(express.json());
app.use(cors())

app.post("/project", async (req, res) => {
    const { replId, language } = req.body;

    if (!replId) {
        res.status(400).send("Bad request");
        return;
    }

//     await copyS3Folder(`base/${language}`,`repl/code/${replId}`);
//     await copyS3Folders(process.env.S,`base/${language}`,`repl/code/${replId}`);

//    // await copyS3Folder(`base/${language}`,`repl/code/${replId}`);
//@ts-ignore
await copyS3fol({
    fromBucket: 'sudeshcloudide2',
    fromLocation: `base/${language}`,
    toBucket: 'sudeshcloudide2',
    toLocation: `repl/code/${replId}`
  });

//@ts-ignore
    res.send("Project created");
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`listening on *:${port}`);
});
