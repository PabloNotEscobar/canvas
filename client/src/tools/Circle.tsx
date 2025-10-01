import Tool from './Tool';

export class Circle extends Tool {
    private mouseDown: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private saved: string | null = null;
    private hypoten: number = 0;

    constructor(canvas: HTMLCanvasElement | null,  socket: WebSocket, id: string) {
        super(canvas, id, socket);
        this._name = 'circle';
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
                type: 'circle',
                x: this.startX,
                y: this.startY,
                h: this.hypoten,
                fillStyle: this.ctx.fillStyle,
                strokeStyle: this.ctx.strokeStyle,
                lineWidth: this.ctx.lineWidth
            }
        }))
    }

    public onMouseDown(e: MouseEvent) {
        if (e.target instanceof HTMLCanvasElement) {
            this.mouseDown = true;
            this.saved = this.canvas.toDataURL();
            this.ctx?.beginPath();
            this.startX = e.pageX - e.target.offsetLeft;
            this.startY = e.pageY - e.target.offsetTop;
        }
    }

    public onMouseMove(e: MouseEvent) {
        if (this.mouseDown && e.target instanceof HTMLCanvasElement) {
            const currentX = e.pageX - e.target.offsetLeft;
            const currentY = e.pageY - e.target.offsetTop;
            let width = currentX - this.startX;
            const height = currentY - this.startY;
            this.hypoten = Math.sqrt(width ** 2 + height ** 2);
            this.draw(this.startX, this.startY, this.hypoten);
        }
    }

    draw(x: number, y: number, h: number) {
        const img = new Image();
        if (this.saved != null) {
            img.src = this.saved;
        }
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.arc(x, y, h, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        };
    }

    static staticDraw (ctx: CanvasRenderingContext2D, x: number, y: number, h: number, fillStyle: string, strokeStyle: string, lineWidth: number) {
        ctx.fillStyle = fillStyle
        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = lineWidth
        ctx.beginPath();
        ctx.arc(x, y, h, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    get name(): string {
        return this._name;
    }
}