import React from "react";
import { Button } from "@mui/material";
import { FormControl, InputLabel, Input } from "@mui/material";

export default function Navigation(props) {
    return (
        <div style={{ margin: "20px" }}>
            <Button
                    variant="contained"
                    onClick={() => props.initiateGame()}
                >
                    NEW GAME
                </Button>
            <Button
                variant="contained"
                color="info"
                onClick={() => props.resetGame()}
            >
                RESET
            </Button>
            <Button
                variant="contained"
                color="warning"
                onClick={() => props.nextGen()}
            >
                NEXT GEN
            </Button>
            <Button
                variant="contained"
                color="success"
                onClick={() => props.startGame()}
            >
                START
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={() => props.stopGame()}
            >
                STOP
            </Button>
        </div>
    );
}
