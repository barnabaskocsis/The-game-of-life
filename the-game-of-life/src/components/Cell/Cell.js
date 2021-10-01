import React from "react";
import "./Cell.css";

export default function Cell(props) {

    const onClickhandler = () => {
        props.onCellChange([props.x, props.y]);
    };

    return (
        <div
            className={`item ${props.alive ? "alive" : ""}`}
            onClick={() => onClickhandler()}
        >
            {props.alive ? props.emojiAlive : props.emojiDead}
        </div>
    );
}
