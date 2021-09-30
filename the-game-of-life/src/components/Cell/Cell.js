import React, { useEffect, useState } from "react";
import "./Cell.css";

export default function Cell(props) {
    const [alive, setAlive] = useState(false);

    useEffect(() => {
        setAlive(props.alive);
    }, [alive]);

    useEffect(() => {
        console.log("alive: " + alive);
        setAlive(alive);
    }, [alive]);

    const onClickhandler = () => {
        setAlive(!alive);
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
