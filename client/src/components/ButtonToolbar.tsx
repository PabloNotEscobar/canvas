import React, {FC} from 'react';
import toolState from "../store/toolState";
import {observer} from "mobx-react-lite";
import Brush from "../tools/Brush";
import canvasState from "../store/canvasState";

interface ButtonToolbar {
    name: string;
    className: string;
    onClick: () => void;
}

const ButtonToolbar: FC<ButtonToolbar> = observer(({name, className, onClick}) => {

    const onClickButton = () => {
        if (toolState.tool !== null && name === toolState.tool?.name) {
            toolState.tool.destroyEvents()
            toolState.setTool(null)
        } else {
            onClick()
        }
    }

    return (
        <div className={'toolButton ' + (name === toolState.tool?.name ? 'highlight' : '')} onClick={onClickButton}>
            <button className={className}/>
        </div>
    );
});

export default ButtonToolbar;