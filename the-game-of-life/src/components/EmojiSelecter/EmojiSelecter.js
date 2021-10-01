import React from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

export default function EmojiSelecter(props) {

    return (
        <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    margin: "10px",
                }}
            >
                <FormControl
                    variant="standard"
                    style={{
                        width: "10%",
                        margin: "2px"
                    }}
                >
                    <InputLabel id="emojialive">Alive</InputLabel>
                    <Select
                        labelId="emojialive"
                        id="emojialive"
                        name="emojialive"
                        value={props.emojis.alive}
                        onChange={(event) => props.onEmojiChangehandler(event)}
                    >
                        <MenuItem value={"⬛"}>⬛</MenuItem>
                        <MenuItem value={"😀"}>😀</MenuItem>
                        <MenuItem value={"🔷"}>🔷</MenuItem>
                        <MenuItem value={"😶"}>😶</MenuItem>
                    </Select>
                </FormControl>
                <FormControl
                    variant="standard"
                    style={{
                        width: "10%",
                        margin: "2px"
                    }}
                >
                    <InputLabel id="emojidead">Dead</InputLabel>
                    <Select
                        labelId="emojidead"
                        id="emojidead"
                        name="emojidead"
                        value={props.emojis.dead}
                        onChange={(event) => props.onEmojiChangehandler(event)}
                    >
                        <MenuItem value={"⬜"}>⬜</MenuItem>
                        <MenuItem value={"🤢"}>🤢</MenuItem>
                        <MenuItem value={"🔶"}>🔶</MenuItem>
                        <MenuItem value={"👻"}>👻</MenuItem>
                    </Select>
                </FormControl>
            </div>
    );
}
