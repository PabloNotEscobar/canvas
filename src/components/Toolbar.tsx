import React from 'react';
import '../styles/toolbar.scss'

const Toolbar = () => {
    return (
        <div className="toolbar">
            <button className="toolbar__btn brush"/>
            <button className="toolbar__btn circle"/>
            <button className="toolbar__btn eraser"/>
            <button className="toolbar__btn line"/>
            <button className="toolbar__btn rect"/>
            <input style={{marginLeft: 10}} type="color"/>
            <button className="toolbar__btn redo"/>
            <button className="toolbar__btn save"/>
            <button className="toolbar__btn undo"/>
        </div>
    );
};

export default Toolbar;