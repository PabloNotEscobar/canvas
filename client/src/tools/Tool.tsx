export default class Tool {
    protected _name: string = 'tool';
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected id: string;
    protected socket: WebSocket;

    constructor(canvas: HTMLCanvasElement | null, id: string, socket: WebSocket) {
        if (!canvas) {
            throw new Error('тих тих тих нету canvas')
        }
        let ctx = canvas.getContext('2d')
        if (!ctx) {
            throw new Error('ctx подбери потерял гдето')
        }
        this.canvas = canvas;
        this.id = id
        this.socket = socket
        this.ctx = ctx;
        this.destroyEvents();
    }

    set fillColor(color: string) {
        this.ctx.fillStyle = color;
    }

    set strokeColor(color: string) {
        this.ctx.strokeStyle = color;
    }

    set lineWidth(width: number) {
        this.ctx.lineWidth = width;
    }

    destroyEvents() {
        this.canvas.onmousedown = null;
        this.canvas.onmouseup = null;
        this.canvas.onmousemove = null;
    }

    get name(): string {
        return this._name;
    }
}