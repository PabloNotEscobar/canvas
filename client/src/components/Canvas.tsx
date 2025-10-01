import React, {useEffect, useRef, useState} from 'react';
import "../styles/canvas.scss"
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import {useParams} from "react-router-dom";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import axios from "axios";
import {Eraser} from "../tools/Eraser";
import {Circle} from "../tools/Circle";
import Line from "../tools/Line";
import {Button, Modal} from 'react-bootstrap';



const Canvas = observer(() => {

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const usernameRef = useRef<HTMLInputElement>(null)
    const [modal, setModal] = useState<boolean>(true)
    const params = useParams()
    let DEBOUNCE_TIMER: ReturnType<typeof setTimeout>;

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image();
                img.src = response.data;
                img.onload = () => {
                    if (canvasRef.current) {
                        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    }
                };
            })
        }
    }, []);

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000/')
            canvasState.setSocket(socket)
            if (params.id) {
                canvasState.setSessionId(params.id)
            }
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: 'connection'
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data)
                switch (msg.method) {
                    case "connection":
                        console.log(`Пользователь ${msg.username} подключен`)
                        break
                    case "draw":
                        drawHandler(msg)
                        break
                }
            }
        }

    }, [canvasState.username]);

    const drawHandler = (msg: any) => {
        const figure = msg.figure
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d')
            if (ctx)
            switch (figure.type) {
                case "brush":
                    Brush.draw(ctx, figure.x, figure.y, figure.strokeStyle, figure.lineWidth)
                    break
                case "finish":
                    ctx.beginPath()
                    break
                case "rect":
                    Rect.staticDraw(ctx, figure.x, figure.y, figure.h, figure.w, figure.fillStyle, figure.strokeStyle, figure.lineWidth)
                    break
                case "eraser":
                    Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth)
                    break
                case "circle":
                    Circle.staticDraw(ctx, figure.x, figure.y, figure.h, figure.fillStyle, figure.strokeStyle, figure.lineWidth)
                    break
                case "line":
                    Line.staticDraw(ctx, figure.x, figure.y, figure.currentX, figure.currentY, figure.strokeStyle, figure.lineWidth)
                    break
            }
        }

    }

    function mouseDownHandler() {
        if (canvasRef.current !== null) {
            canvasState.pushToUndo(canvasRef.current.toDataURL())
        }
    }

    function mouseUpHandler() {
        clearTimeout(DEBOUNCE_TIMER)
        DEBOUNCE_TIMER = setTimeout(() => {
            if (canvasRef.current !== null) {
                axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
                    .then(response => console.log(response))
            }
        }, 5000)
    }

    const connectionHandler = () => {
        if (usernameRef.current !== null) {
            canvasState.setUsername(usernameRef.current.value)
        }
        setModal(false)
    }

    return (
        <div className="canvas">
            <Modal show={modal} onHide={() => {}}>
                <Modal.Header >
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectionHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseUp={() => mouseUpHandler()} onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400}/>
        </div>
    );
});

export default Canvas;