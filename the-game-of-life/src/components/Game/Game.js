import React, { useEffect, useState } from "react";
import Cell from "../Cell/Cell";
import "./Game.css";

export default function Game(props) {
    const [size, setSize] = useState(5);
    const [gameBoard, setGameBoard] = useState([]);
    const [stateBoard, setStateBoard] = useState([]);
    const [cellState, setCellState] = useState([]);
    const [gameRunning, setGameRunning] = useState(false);

    useEffect(() => {
        if (stateBoard.length !== 0 && gameRunning === false) {
            const x = cellState[0];
            const y = cellState[1];
            const cell = stateBoard[x][y];
            const newStateBoard = JSON.parse(JSON.stringify(stateBoard));
            newStateBoard[x][y] = !cell;
            setStateBoard(newStateBoard);
        }
    }, [cellState]);

    useEffect(() => {
        if (stateBoard.length !== 0) {
            const newGameBoard = [];
            for (let i = 0; i < size; ++i) {
                const tempArray = [];
                for (let j = 0; j < size; ++j) {
                    tempArray.push(
                        <Cell
                            key={String(i) + String(j)}
                            x={i}
                            y={j}
                            alive={stateBoard[i][j]}
                            onCellChange={setCellState}
                        ></Cell>
                    );
                }
                newGameBoard.push(tempArray.flat());
            }
            setGameBoard(newGameBoard);
        }
    }, [stateBoard]);

    const initiateGame = () => {
        setGameRunning(false);
        const newStateBoard = [];

        for (let i = 0; i < size; ++i) {
            const tempArray = [];
            for (let j = 0; j < size; ++j) {
                tempArray.push(false);
            }
            newStateBoard.push(tempArray);
        }

        setStateBoard(newStateBoard);
    };

    const countAliveNeighbours = (cellx, celly) => {
        let numberOfAliveNeighbours = 0;

        const directions = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
        ];

        directions.forEach((direction, index) => {
            let x = direction[0] + cellx;
            let y = direction[1] + celly;
            //let neighbour = false;

            if (0 <= x && x < size && 0 <= y && y < size) {
                let neighbour = stateBoard[x][y];
                if (neighbour) {
                    ++numberOfAliveNeighbours;
                }
            }
        });
        return numberOfAliveNeighbours;
    };

    // decide if a cell should live or die
    const decideFate = (x, y) => {
        let numberOfAliveNeighbours = countAliveNeighbours(x, y);

        // if dead, check for 3 alive cells nearby
        if (stateBoard[x][y] === false && numberOfAliveNeighbours === 3) {
            return true;
        }
        // if alive, check for exactly 2 or 3 alive cells nearby
        else if (
            stateBoard[x][y] &&
            (numberOfAliveNeighbours === 2 || numberOfAliveNeighbours === 3)
        ) {
            return true;
        } else {
            return false;
        }
    };

    const play = () => {
        setGameRunning(true);
        const newStateBoard = JSON.parse(JSON.stringify(stateBoard));

        //iteration

        stateBoard.forEach((row, rindex) => {
            row.forEach((cell, cindex) => {
                let shouldLive = decideFate(rindex, cindex);
                newStateBoard[rindex][cindex] = shouldLive;
            });
        });
        setStateBoard(newStateBoard);
    };

    const test = () => {
        console.log(gameBoard);
        console.log(stateBoard);
        console.log(countAliveNeighbours(2, 2));
        console.log(decideFate(2, 2));
    };

    const onSizeChangeHandler = (event) => {
        const { value } = event.currentTarget;
        setSize(value);
    };

    return (
        <React.Fragment>
            <div
                className="container"
                style={{
                    gridTemplateColumns: `repeat(${size}, 30px)`,
                    gridTemplateRows: `repeat(${size}, 30px)`,
                }}
            >
                {gameBoard}
            </div>
            <div style={{ margin: "20px" }}>
                <input
                    type="text"
                    value={size}
                    onChange={(event) => onSizeChangeHandler(event)}
                ></input>
                <button onClick={initiateGame}>SET UP</button>
                <button onClick={test}>TEST</button>
                <button onClick={play}>PLAY</button>
            </div>
            <div>{stateBoard.toString()}</div>
            <div></div>
        </React.Fragment>
    );
}
