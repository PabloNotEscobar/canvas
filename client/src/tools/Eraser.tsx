import Tool from "./Tool";

export class Eraser extends Tool {
    private mouseDown: boolean = false;

    constructor(canvas: HTMLCanvasElement | null, socket: WebSocket, id: string) {
        super(canvas, id, socket);
        this._name = 'eraser';
        this.listen();
    }

    public listen() {
        this.canvas.onmousedown = this.onMouseDown.bind(this);
        this.canvas.onmouseup = this.onMouseUp.bind(this);
        this.canvas.onmousemove = this.onMouseMove.bind(this);
    }

    public onMouseUp(e: MouseEvent) {
        this.mouseDown = false;
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: 'finish'
                }
            }))
    }

    public onMouseDown(e: MouseEvent) {
        if (e.target instanceof HTMLCanvasElement) {
            this.mouseDown = true;
            this.ctx?.beginPath();
        }
    }

    public onMouseMove(e: MouseEvent) {
        if (this.mouseDown && e.target instanceof HTMLCanvasElement) {
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.id,
                figure: {
                    type: 'eraser',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    lineWidth: this.ctx.lineWidth
                }
            }))
        }
    }

    static draw(ctx: CanvasRenderingContext2D, x: number, y: number, lineWidth: number) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = lineWidth
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    get name(): string {
        return this._name;
    }
}