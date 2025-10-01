
import Tool from "./Tool";

export default class Rect extends Tool {
    private mouseDown: boolean = false;
    private startX = 0;
    private startY = 0;
    private saved: string | null = null;
    private width!: number;
    private height!: number;

    constructor(canvas: HTMLCanvasElement | null, socket: WebSocket, id: string) {
        super(canvas, id, socket);
        this.listen()
        this._name = 'rect'
    }

    listen () {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler (e: MouseEvent) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: 'rect',
                x: this.startX,
                y: this.startY,
                h: this.height,
                w: this.width,
                fillStyle: this.ctx.fillStyle,
                strokeStyle: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))
    }

    mouseDownHandler (e: MouseEvent) {
        if (e.target instanceof HTMLCanvasElement) {
            this.mouseDown = true
            this.ctx.beginPath()
            this.startX = e.pageX - e.target.offsetLeft
            this.startY = e.pageY - e.target.offsetTop
            this.saved = this.canvas.toDataURL()
        }
    }

    mouseMoveHandler (e: MouseEvent) {
        if (this.mouseDown && e.target instanceof HTMLCanvasElement) {
            let currentX = e.pageX - e.target.offsetLeft
            let currentY = e.pageY - e.target.offsetTop
            this.width = currentX - this.startX
            this.height = currentY - this.startY
            this.draw(this.startX, this.startY, this.width, this.height)
        }
    }

    draw (x: number, y: number, w: number, h: number) {
        const img = new Image()
        if (this.saved !== null) {
            img.src = this.saved
        }
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.rect(x, y, w, h)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw (ctx: CanvasRenderingContext2D, x: number, y: number, h: number, w: number, fillStyle: string, strokeStyle: string, lineWidth: number) {
        ctx.fillStyle = fillStyle
        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.rect(x, y, w, h)
        ctx.fill()
        ctx.stroke()
    }

    get name(): string {
        return this._name;
    }
}