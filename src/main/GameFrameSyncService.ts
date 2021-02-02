const WebSocket = require('ws');

export enum SocketMsgType {
    Register,
    FrameSync,
}

export interface SocketMsg<T> {
    type: SocketMsgType;
    data: T
}

export interface RegisterMsg {
    uid: string;
}

export interface LogicFrame {
    uid: string;
    color: any;
    renderFrames: Array<RenderFrame>;
}

export interface RenderFrame {
    t: number; // 时间戳
    d: any; // 方向
    p: any; // 位置
}

class GameFrameSyncService {

    wss: any = null;

    private clients: Map<string, any> = new Map<string, any>();

    private logicFrames: Map<string, LogicFrame> = new Map<string, LogicFrame>();

    constructor() {
        this.wss = new WebSocket.Server({
            port: 8777,
            perMessageDeflate: {
                zlibDeflateOptions: {
                    // See zlib defaults.
                    chunkSize: 1024,
                    memLevel: 7,
                    level: 3
                },
                zlibInflateOptions: {
                    chunkSize: 10 * 1024
                },
                // Other options settable:
                clientNoContextTakeover: true, // Defaults to negotiated value.
                serverNoContextTakeover: true, // Defaults to negotiated value.
                serverMaxWindowBits: 10, // Defaults to negotiated value.
                // Below options specified as default values.
                concurrencyLimit: 10, // Limits zlib concurrency for perf.
                threshold: 1024 // Size (in bytes) below which messages
                // should not be compressed.
            }
        });

        setInterval(() => {
            this.boardcastMergedLogicFrames();
        }, 50);
    }

    public start(): void {
        this.wss.on('connection', (conn: any) => {

            conn.on('message', (data: any) => {
                let msg: SocketMsg<any> = JSON.parse(data);
                switch (msg.type) {
                    case SocketMsgType.Register:
                        let registerMsg: RegisterMsg = msg.data;
                        this.clients[registerMsg.uid] = conn;
                        console.log('register: %s', registerMsg.uid);
                        break;
                    case SocketMsgType.FrameSync:
                        let logicFrame: LogicFrame = msg.data;
                        this.mergeLogicFrames(logicFrame);
                        break
                }
            });

            conn.on("ping", (data: any)=> {
                console.log(`receive ping from client`);
            });

            conn.on("close", () => {
                console.log("conn close");
                let closedUid = null;
                for (var key in this.clients) {
                    if (this.clients[key] == conn) {
                        closedUid = key;
                        break;
                    }
                }

                console.log(`remove conn: ${closedUid}`)

                delete this.clients[closedUid];
                delete this.logicFrames[closedUid];
            });

            conn.on("error", () => {
                console.log("conn error");

                let closedUid = null;
                for (var key in this.clients) {
                    if (this.clients[key] == conn) {
                        closedUid = key;
                        break;
                    }
                }

                delete this.clients[closedUid];
                delete this.logicFrames[closedUid];
            });
        });
    }

    public stop(): void {

    }

    public restart(): void {

    }

    private mergeLogicFrames(data: LogicFrame) {
        if (!this.logicFrames.hasOwnProperty(data.uid)) {
            this.logicFrames[data.uid] = data;
        } else {
            var renderFrames = this.logicFrames[data.uid].renderFrames;
            if (!this.logicFrames[data.uid].hasOwnProperty("renderFrames")) {
                renderFrames = [];
            }
            this.logicFrames[data.uid].renderFrames = Object.assign(renderFrames, data.renderFrames);
        }
    }

    private boardcastMergedLogicFrames() {

        let data: {} = {
            type: SocketMsgType.FrameSync,
            data: this.logicFrames
        };
        for (var key in this.clients) {
            this.clients[key].send(JSON.stringify(data));
        }
    }
}

export default new GameFrameSyncService();