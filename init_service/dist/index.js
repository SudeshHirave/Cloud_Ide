"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const aws2_1 = require("./aws2");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/project", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { replId, language } = req.body;
    if (!replId) {
        res.status(400).send("Bad request");
        return;
    }
    //     await copyS3Folder(`base/${language}`,`repl/code/${replId}`);
    //     await copyS3Folders(process.env.S,`base/${language}`,`repl/code/${replId}`);
    //    // await copyS3Folder(`base/${language}`,`repl/code/${replId}`);
    //@ts-ignore
    yield (0, aws2_1.copyS3fol)({
        fromBucket: 'sudeshcloudide2',
        fromLocation: `base/${language}`,
        toBucket: 'sudeshcloudide2',
        toLocation: `repl/code/${replId}`
    });
    //@ts-ignore
    res.send("Project created");
}));
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`listening on *:${port}`);
});
