import {makeAutoObservable} from "mobx";
import Tool from "../tools/Tool";
import Brush from "../tools/Brush";

class ToolState {
    private _tool: Tool | null = null;
    constructor() {
        makeAutoObservable(this);
    }

    public setTool(tool: Tool | null) {
        this._tool = tool;
    }

    setFillColor(color: string) {
        this.safeTool.fillColor = color
    }

    setStrokeColor(color: string) {
        this.safeTool.strokeColor = color
    }

    public setLineWidth(width: any) {
        this.safeTool.lineWidth = width
    }

    private get safeTool(): Tool {
        if (!this._tool) {
            throw Error("инструмент не выбран")
        }
        return this._tool
    }

    public get tool(): Tool | null {
        return this._tool
    }

}

export default new ToolState;