import { padding } from "@mui/system";
import React from "react";

export default function StatTracker(props) {
    return (
        <div>
            <h2 style={{display: "inline-block"}}>Population: {props.population} 😀</h2>
            <h2 style={{display: "inline-block", padding: "10px"}}>|</h2>
            <h2 style={{display: "inline-block"}}>Generation: {props.generation} </h2>
        </div>
    );
}
