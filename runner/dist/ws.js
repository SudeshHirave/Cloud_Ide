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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWs = initWs;
const socket_io_1 = require("socket.io");
const aws_1 = require("./aws");
const fs_1 = require("./fs");
const pty_1 = require("./pty");
const terminalManager = new pty_1.TerminalManager();
function initWs(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        const host = socket.handshake.headers.host;
        console.log(`host is ${host}`);
        const replId = host === null || host === void 0 ? void 0 : host.split('.')[0];
        if (!replId) {
            socket.disconnect();
            terminalManager.clear(socket.id);
            return;
        }
        socket.emit("loaded", {
            rootContent: yield (0, fs_1.fetchDir)("/workspace", "")
        });
        initHandlers(socket, replId);
    }));
}
function initHandlers(socket, replId) {
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
    socket.on("fetchDir", (dir, callback) => __awaiter(this, void 0, void 0, function* () {
        const dirPath = `/workspace/${dir}`;
        const contents = yield (0, fs_1.fetchDir)(dirPath, dir);
        callback(contents);
    }));
    socket.on("fetchContent", (_a, callback_1) => __awaiter(this, [_a, callback_1], void 0, function* ({ path: filePath }, callback) {
        const fullPath = `/workspace/${filePath}`;
        const data = yield (0, fs_1.fetchFileContent)(fullPath);
        callback(data);
    }));
    socket.on("updateContent", (_a) => __awaiter(this, [_a], void 0, function* ({ path: filePath, content }) {
        const fullPath = `/workspace/${filePath}`;
        yield (0, fs_1.saveFile)(fullPath, content);
        yield (0, aws_1.saveToS3)(`code/${replId}`, filePath, content);
    }));
    socket.on("requestTerminal", () => __awaiter(this, void 0, void 0, function* () {
        terminalManager.createPty(socket.id, replId, (data, id) => {
            socket.emit('terminal', {
                data: Buffer.from(data, "utf-8")
            });
        });
    }));
    socket.on("terminalData", (_a) => __awaiter(this, [_a], void 0, function* ({ data }) {
        terminalManager.write(socket.id, data);
    }));
}
