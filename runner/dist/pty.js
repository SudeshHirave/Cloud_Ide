"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalManager = void 0;
//@ts-ignore => someone fix this
const node_pty_1 = require("node-pty");
const SHELL = "bash";
class TerminalManager {
    constructor() {
        this.sessions = {};
        this.sessions = {};
    }
    createPty(id, replId, onData) {
        let term = (0, node_pty_1.fork)(SHELL, [], {
            cols: 100,
            name: 'xterm',
            cwd: `/workspace`
        });
        term.on('data', (data) => onData(data, term.pid));
        this.sessions[id] = {
            terminal: term,
            replId
        };
        term.on('exit', () => {
            delete this.sessions[term.pid];
        });
        return term;
    }
    write(terminalId, data) {
        var _a;
        (_a = this.sessions[terminalId]) === null || _a === void 0 ? void 0 : _a.terminal.write(data);
    }
    clear(terminalId) {
        this.sessions[terminalId].terminal.kill();
        delete this.sessions[terminalId];
    }
}
exports.TerminalManager = TerminalManager;
