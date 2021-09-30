import React, { useEffect, useRef, useState } from "react";
import Cell from "../Cell/Cell";
import "./Game.css";
import Navigation from "../Navigation/Navigation";
import { FormControl, InputLabel, Input } from "@mui/material";

export default function Game(props) {
    const [size, setSize] = useState(5);
    const [gameBoard, setGameBoard] = useState([]);
    const [stateBoard, setStateBoard] = useState([]);
    const [initialStateBoard, setInitialStateBoard] = useState([]);
    const [cellState, setCellState] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameRunning, setGameRunning] = useState(false);
    const [interval, setInterval] = useState(1000);
    const [stats, setStats] = useState({generation: 0, cellsAlive: 0});

    const iterationTimerRef = useRef();
    //const stateRef = useRef(stateBoard);

    useEffect(() => {
        if (stateBoard.length !== 0 && gameStarted === false) {
            const x = cellState[0];
            const y = cellState[1];
            const cell = stateBoard[x][y];
            const newStateBoard = JSON.parse(JSON.stringify(stateBoard));
            newStateBoard[x][y] = !cell;
            setStateBoard(newStateBoard);
        }
    }, [cellState]);

    // renders board visually
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

        // count alive cells
        const counter = stateBoard.flat().filter(e => e === true).length;
        setStats({...stats, cellsAlive: counter});
    }, [stateBoard]);

    // automatic play
    useEffect(() => {
        if (gameRunning) {
            iterationTimerRef.current = setTimeout(() => {
                play(stateBoard);
            }, interval);
        } else {
            console.log("Game stopped!");
        }
    }, [gameRunning, stateBoard]);

    // initiate and clear board
    const initiateGame = () => {
        setGameStarted(false);
        setGameRunning(false);
        setStats({generation: 0, cellsAlive: 0});
        setStateBoard([]);
        setInitialStateBoard([]);
        initiateNewStateBoard();
        
    };

    const initiateNewStateBoard = () => {
        const newStateBoard = [];

        for (let i = 0; i < size; ++i) {
            const tempArray = [];
            for (let j = 0; j < size; ++j) {
                tempArray.push(false);
            }
            newStateBoard.push(tempArray);
        }

        setStateBoard(newStateBoard);
    }

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

    // 1 iteration calculating the next generation
    const nextGeneration = (board) => {
        console.log("Calculating next generation...");
        const newBoard = JSON.parse(JSON.stringify(board));

        board.forEach((row, rindex) => {
            row.forEach((cell, cindex) => {
                let shouldLive = decideFate(rindex, cindex);
                newBoard[rindex][cindex] = shouldLive;
            });
        });

        return newBoard;
    };

    const startGame = () => {
        setGameRunning(true);
    };

    const resetGame = () => {
        setGameStarted(false);
        setGameRunning(false);
        setStats({generation: 0, cellsAlive: 0});
        setStateBoard(initialStateBoard);
    }

    const play = (board = stateBoard) => {
        setGameStarted(true);

        
        if(initialStateBoard.length === 0) {
            setInitialStateBoard(board);
        }

        let newStateBoard = [];
        const newGenNumber = stats.generation + 1;
        setStats({...stats, generation: newGenNumber})
        console.log("Playing...");
        console.log("Next gen: " + newGenNumber);
        newStateBoard = nextGeneration(board);
        setStateBoard(newStateBoard);
    };

    const onSizeChangeHandler = (event) => {
        const { value } = event.currentTarget;
        setSize(value);
    };

    const stopGame = () => {
        if (gameRunning) {
            setGameRunning(false);
            clearTimeout(iterationTimerRef.current);
        }
    };

    const statsDiv = (
        <div>
            <p>Generation: {stats.generation}</p>
            <p>Alive cells: {stats.cellsAlive}</p>
        </div>
    )

    return (
        <React.Fragment>
            <div className="statsDiv">{statsDiv}</div>
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
                <FormControl variant="standard">
                    <InputLabel htmlFor="component-simple">
                        Gameboard size:
                    </InputLabel>
                    <Input id="gameboardsize" value={size} onChange={(event) => onSizeChangeHandler(event)} />
                </FormControl>
            </div>
            <Navigation
            initiateGame={initiateGame}
            resetGame={resetGame}
            nextGen={play}
            startGame={startGame}
            stopGame={stopGame}
            onSizeChangeHandler={setSize}
            ></Navigation>
        </React.Fragment>
    );
}
