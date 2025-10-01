import React from 'react';
import toolState from "../store/toolState";
import '../styles/settingBar.scss'
import {observer} from "mobx-react-lite";

const SettingBar = observer(() => {
    return (
        <div className={'setting-bar ' + `${toolState.tool === null ? 'setting-bar-closed' : 'setting-bar-opened'}`}>
            <label htmlFor="line-width">Толщина линии</label>
            <input
                onChange={e => toolState.setLineWidth(e.target.value)}
                style={{marginLeft: 10, marginRight: 10}}
                id="line-width"
                type="number"
                min={1}
                max={50}
                defaultValue={1}/>
            <label htmlFor="stroke-color">Цвет обводки</label>
            <input
                onChange={e => toolState.setStrokeColor(e.target.value)}
                style={{marginLeft: 10, marginRight: 10}}
                id="stroke-color"
                type="color"
            />
        </div>
    );
});

export default SettingBar;