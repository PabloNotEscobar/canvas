import Tool from "./Tool";

export default class Line extends Tool {
    private mouseDown: boolean = false;
    private currentX: number = 0;
    private currentY: number = 0;
    private saved: string | null = null;
    private x!: number;
    private y!: number;

    constructor(canvas: HTMLCanvasElement | null,  socket: WebSocket, id: string) {
        super(canvas, id, socket);
        this.listen()
        this._name = 'line'
    }

    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }

    mouseDownHandler(e: MouseEvent) {
        if (e.target instanceof HTMLCanvasElement) {
            this.mouseDown = true
            this.currentX = e.pageX - e.target.offsetLeft
            this.currentY = e.pageY - e.target.offsetTop
            this.ctx.beginPath()
            this.ctx.moveTo(this.currentX, this.currentY)
            this.saved = this.canvas.toDataURL()
        }
    }

    mouseUpHandler(e: MouseEvent) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: 'line',
                x: this.x,
                y: this.y,
                currentX: this.currentX,
                currentY: this.currentY,
                color: this.strokeColor,
                strokeStyle: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))
    }

    mouseMoveHandler(e: MouseEvent) {
        if (this.mouseDown && e.target instanceof HTMLCanvasElement) {
            this.x = e.pageX-e.target.offsetLeft
            this.y = e.pageY-e.target.offsetTop
            this.draw(e.pageX-e.target.offsetLeft, e.pageY-e.target.offsetTop);
        }
    }


    draw(x: number,y: number) {
        const img = new Image()
        if (this.saved !== null) {
            img.src = this.saved
        }
        img.onload = async function (this: Line) {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.currentX, this.currentY)
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
        }.bind(this)

    }


    static staticDraw (ctx: CanvasRenderingContext2D, x: number, y: number, currentX: number, currentY: number, strokeStyle: string, lineWidth: number) {
        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.moveTo(currentX, currentY)
        ctx.lineTo(x, y)
        ctx.stroke()
    }

    get name(): string {
        return this._name;
    }
}