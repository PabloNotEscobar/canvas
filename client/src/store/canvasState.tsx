
import {makeAutoObservable} from "mobx";
import canvas from "../components/Canvas";
import {isDataView} from "node:util/types";

class CanvasState {
    canvas!: HTMLCanvasElement;

    undoList: string[] = []
    redoList: string[] = []
    socket!: WebSocket;
    sessionId: string = ""
    username = ""


    constructor() {
        makeAutoObservable(this);
    }

    setCanvas(canvas: HTMLCanvasElement | null) {
        if (!canvas) {
            throw new Error('тих тих тих нету canvas 1234')
        }
        this.canvas = canvas;

    }

    setUsername(username: string) {
        this.username = username
    }

    setSocket(socket: WebSocket) {
        this.socket = socket
    }

    setSessionId(id: string) {
        this.sessionId = id
    }

    pushToUndo = (data: string) => {
        this.undoList.push(data)
    }

    pushToRedo = (data: string) => {
        this.redoList.push(data)
    }

    undo () {
        if (this.canvas !== null) {
            let ctx = this.canvas.getContext('2d')
            if (!ctx) {
                throw new Error('ctx подбери потерял гдето')
            }
            if (this.undoList.length > 0) {
                console.log(this.canvas.toDataURL())
                this.redoList.push(this.canvas.toDataURL())
                let dataUrl = this.undoList.pop()
                let img = new Image()
                if (dataUrl) {
                    img.src = dataUrl
                }
                img.onload = () => {
                    ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
                }

            } else {
                ctx.clearRect(0, 0, this.canvas?.width, this.canvas?.height)
            }
        }


    }

    redo () {
        if (this.canvas !== null) {
            let ctx = this.canvas.getContext('2d')
            if (!ctx) {
                throw new Error('ctx подбери потерял гдето')
            }
            if (this.redoList.length > 0) {
                this.undoList.push(this.canvas.toDataURL())
                let dataUrl = this.redoList.pop()
                console.log(dataUrl)
                let img = new Image()
                if (dataUrl) {
                    img.src = dataUrl
                }
                img.onload = () => {
                    ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
                }
            }
        }
    }
}

export default new CanvasState;