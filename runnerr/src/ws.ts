import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { saveToS3 } from "./aws";
import path from "path";
import { fetchDir, fetchFileContent, saveFile } from "./fs";
import { TerminalManager } from "./pty";

const terminalManager = new TerminalManager();

export const initWs=(httpserver : HttpServer)=>{
    const io = new Server(httpserver,{
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    })
    io.on("connection",async(socket) => {
        const host = socket.handshake.headers.host;
        const replId = host?.split('.')[0];
        if(!replId){
            socket.disconnect();
            terminalManager.clear(socket.id);
            return;
        }
        socket.emit('loaded',{
            rootContent: await fetchDir("/workspace", "")
        })
        initHandlers(socket, replId);
    })
}
const initHandlers = (socket : Socket, replId: string)=> {

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on('fetchDir',async (dir:string,callback) => {
      const fullpath = `./workspace/${dir}`;
      const contents = await fetchDir(fullpath,dir);
      callback(contents);
    });

    socket.on('fetchContent', async ({path : filepath} :{ path : string},callback) => {
        const fullPath = `/workspace/${filepath}`;
        const data = await fetchFileContent(fullPath);
        callback(data);
    })

    socket.on('save')
    
}