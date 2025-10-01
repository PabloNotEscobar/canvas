import React from 'react';
import '../styles/toolbar.scss'
import toolState from "../store/toolState";
import canvasState from "../store/canvasState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import {Circle} from "../tools/Circle";
import {Eraser} from "../tools/Eraser";
import Line from "../tools/Line";
import {observer} from "mobx-react-lite";
import ButtonToolbar from "./ButtonToolbar";

const Toolbar = observer(() => {

    const tools = [
        {
            name: 'brush',
            onClick: () => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId)),
            className: 'toolbar__btn brush '
        },
        {
            name: 'circle',
            onClick: () => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId)),
            className: 'toolbar__btn circle '
        },
        {
            name: 'eraser',
            onClick: () => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionId)),
            className: 'toolbar__btn eraser '
        },
        {
            name: 'line',
            onClick: () => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId)),
            className: 'toolbar__btn line '
        },
        {
            name: 'rect',
            onClick: () => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId)),
            className: 'toolbar__btn rect '
        }
    ]


    const download = () => {
        const dataURL = canvasState.canvas.toDataURL()
        const a = document.createElement('a')
        a.href = dataURL
        a.download = canvasState.sessionId + ".jpg"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className={'toolbar'}>
            {tools.map(tool =>
                <ButtonToolbar
                    key={tool.name}
                    name={tool.name}
                    className={tool.className}
                    onClick={tool.onClick}
                />
            )}
            {/*<button className={"toolbar__btn brush " + `${toolState.tool  }`} onClick={() => toolState.setTool(new Brush(canvasState.canvas))}/>*/}
            {/*<button className="toolbar__btn circle" onClick={() => toolState.setTool(new Circle(canvasState.canvas))}/>*/}
            {/*<button className="toolbar__btn eraser" onClick={() => toolState.setTool(new Eraser(canvasState.canvas))}/>*/}
            {/*<button className="toolbar__btn line" onClick={() => toolState.setTool(new Line(canvasState.canvas))}/>*/}
            {/*<button className="toolbar__btn rect" onClick={() => toolState.setTool(new Rect(canvasState.canvas))}/>*/}
            {
                (toolState.tool)
                    ?
                    toolState.tool.name === "line" || toolState.tool.name === "brush" || toolState.tool.name === "eraser"
                        ?
                        <></>
                        :
                        <input
                            style={{marginLeft: 10}}
                            type="color"
                            onChange={e => toolState.setFillColor(e.target.value)}
                        />
                    :
                    null
            }

            <button className="toolbar__btn undo" onClick={() => canvasState.undo()}/>
            <button className="toolbar__btn redo" onClick={() => canvasState.redo()}/>
            <button className="toolbar__btn save" onClick={() => download()}/>
        </div>
    );
});

export default Toolbar;