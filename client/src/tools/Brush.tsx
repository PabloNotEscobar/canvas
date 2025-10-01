import Tool from "./Tool";

export default class Brush extends Tool {
    private mouseDown: boolean = false;
    constructor(canvas: HTMLCanvasElement | null,  socket: WebSocket, id: string) {
        super(canvas, id, socket);
        this.listen()
        this._name = 'brush'
    }

    listen () {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler (e: MouseEvent) {
        this.mouseDown = false
        if (e.target instanceof HTMLCanvasElement) {
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: 'finish'
                }
            }))
        }
    }

    mouseDownHandler (e: MouseEvent) {
        this.mouseDown = true
        this.ctx.beginPath()
    }

    mouseMoveHandler (e: MouseEvent) {
        if (this.mouseDown && e.target instanceof HTMLCanvasElement) {
            // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    strokeStyle: this.ctx.strokeStyle,
                    lineWidth: this.ctx.lineWidth
                }
            }))
        }
    }

    static draw (ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyle: string, lineWidth: number) {
        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = lineWidth;
        ctx.lineTo(x, y)
        ctx.stroke()
    }

    get name(): string {
        return this._name;
    }
}