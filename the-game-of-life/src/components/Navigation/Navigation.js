import React from "react";
import { Button } from "@mui/material";
import { FormControl, InputLabel, Input } from "@mui/material";

export default function Navigation(props) {
    return (
        <div style={{ margin: "20px" }}>
            <Button
                    variant="contained"
                    onClick={() => props.initiateGame(true,[])}
                    color="secondary"
                >
                    🎲RANDOM🎲
                </Button>
            <Button
                    variant="contained"
                    onClick={() => props.initiateGame(false,[])}
                >
                    NEW GAME
                </Button>
        </div>
    );
}
