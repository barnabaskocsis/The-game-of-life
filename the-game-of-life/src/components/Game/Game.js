import React, { useEffect, useRef, useState } from "react";
import Cell from "../Cell/Cell";
import "./Game.css";
import Navigation from "../Navigation/Navigation";
import StatTracker from "../StatTracker/StatTracker";
import { FormControl, InputLabel, Input } from "@mui/material";
import { Slider } from "@mui/material";

export default function Game(props) {
    const [size, setSize] = useState(5);
    const [gameBoard, setGameBoard] = useState([]);
    const [stateBoard, setStateBoard] = useState([]);
    const [initialStateBoard, setInitialStateBoard] = useState([]);
    const [cellState, setCellState] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameRunning, setGameRunning] = useState(false);
    const [interval, setInterval] = useState(1000);
    const [stats, setStats] = useState({ generation: 0, population: 0 });

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
        const counter = stateBoard.flat().filter((e) => e === true).length;
        setStats({ ...stats, population: counter });
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
        setStats({ generation: 0, cellsAlive: 0 });
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
        setStats({ generation: 0, population: 0 });
        setStateBoard(initialStateBoard);
    };

    const play = (board = stateBoard) => {
        setGameStarted(true);

        if (initialStateBoard.length === 0) {
            setInitialStateBoard(board);
        }

        let newStateBoard = [];
        const newGenNumber = stats.generation + 1;
        setStats({ ...stats, generation: newGenNumber });
        console.log("Playing...");
        console.log("Next gen: " + newGenNumber);
        newStateBoard = nextGeneration(board);
        setStateBoard(newStateBoard);
    };

    const onSizeChangeHandler = (event) => {
        const { value } = event.currentTarget;
        setSize(value);
    };

    const onIntervalChangeHandler = (event) => {
        const { value } = event.target;
        setInterval(value);
    }

    const stopGame = () => {
        if (gameRunning) {
            setGameRunning(false);
            clearTimeout(iterationTimerRef.current);
        }
    };

    return (
        <React.Fragment>
            <StatTracker
                generation={stats.generation}
                population={stats.population}
            ></StatTracker>
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
                    <Input
                        id="gameboardsize"
                        value={size}
                        onChange={(event) => onSizeChangeHandler(event)}
                    />
                </FormControl>
            </div>
            <div>
            <p>Change simulation speed: </p>
            <Slider
                size="small"
                defaultValue={1000}
                min={200}
                max={2000}
                marks
                step={200}
                aria-label="Small"
                valueLabelDisplay="auto"
                onChange={(event) => onIntervalChangeHandler(event)}
                style={{position: "", width: "50%"}}
            />
            </div>
            <Navigation
                initiateGame={initiateGame}
                resetGame={resetGame}
                nextGen={play}
                startGame={startGame}
                stopGame={stopGame}
                onSizeChangeHandler={setSize}
            ></Navigation>
            <div>
                <h2>
                    Type in the size of the gameboard you want and press "New
                    game".
                </h2>
            </div>
        </React.Fragment>
    );
}
