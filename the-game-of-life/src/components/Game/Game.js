import React, { useEffect, useRef, useState } from "react";
import Cell from "../Cell/Cell";
import "./Game.css";
import Navigation from "../Navigation/Navigation";
import StatTracker from "../StatTracker/StatTracker";
import { FormControl, InputLabel, Input } from "@mui/material";
import { Divider } from "@mui/material";
import { Slider } from "@mui/material";
import EmojiSelecter from "../EmojiSelecter/EmojiSelecter";
import GameControls from "../Navigation/GameControls";

export default function Game(props) {
    const [size, setSize] = useState(30);
    const [gameBoard, setGameBoard] = useState([]);
    const [stateBoard, setStateBoard] = useState([]);
    const [initialStateBoard, setInitialStateBoard] = useState([]);
    const [cellState, setCellState] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameRunning, setGameRunning] = useState(false);
    const [interval, setInterval] = useState(1000);
    const [stats, setStats] = useState({ generation: 0, population: 0 });
    const [emojis, setEmojis] = useState({ alive: "⬛", dead: "⬜" });

    const iterationTimerRef = useRef();

    // update a cell on the board
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

    // renders the board visually every state update
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
                            emojiAlive={emojis.alive}
                            emojiDead={emojis.dead}
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

    // stop the game if every cell dies
    useEffect(() => {
        if (gameRunning && stats.population === 0) {
            setGameRunning(false);
        }
    }, [stats.population]);

    // clear board and initiate it blank, random or from a seed
    const initiateGame = (random, seed) => {
        setGameStarted(false);
        setGameRunning(false);
        setStats({ generation: 0, cellsAlive: 0 });
        setStateBoard([]);
        setInitialStateBoard([]);
        if (random) {
            generateRandomStateBoard();
        } else if (seed.length !== 0) {
            generateStateBoardFromSeed();
        } else {
            initiateNewStateBoard();
        }
    };

    // generate state board with default false values
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

    // generate state board with random values
    const generateRandomStateBoard = () => {
        const newStateBoard = [];
        let random = false;

        for (let i = 0; i < size; ++i) {
            const tempArray = [];
            for (let j = 0; j < size; ++j) {
                random = Math.floor(Math.random() * 2);
                tempArray.push(!!random);
            }
            newStateBoard.push(tempArray);
        }

        setStateBoard(newStateBoard);
    };

    // generate state board from seed
    const generateStateBoardFromSeed = (seed) => {
        setStateBoard(seed);
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

    // playing out an iteration
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

    const startGame = () => {
        setGameRunning(true);
    };

    const resetGame = () => {
        setGameStarted(false);
        setGameRunning(false);
        setStats({ generation: 0, population: 0 });
        setStateBoard(initialStateBoard);
    };

    const stopGame = () => {
        if (gameRunning) {
            setGameRunning(false);
            clearTimeout(iterationTimerRef.current);
        }
    };

    const onSizeChangeHandler = (event) => {
        const { value } = event.currentTarget;
        if(!isNaN(value)){
            setSize(value);
        }
    };

    const onIntervalChangeHandler = (event) => {
        const { value } = event.target;
        setInterval(value * 200);
    };

    const onEmojiChangehandler = (event) => {
        const { value, name } = event.target;
        if (name === "emojialive") {
            setEmojis({ ...emojis, alive: value });
        } else {
            setEmojis({ ...emojis, dead: value });
        }
    };

    return (
        <React.Fragment>
            <div style={{ margin: "20px", padding: "20px" }}>
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
            <p>Change the looks of your cells: </p>
            <EmojiSelecter
                emojis={emojis}
                onEmojiChangehandler={(event) => onEmojiChangehandler(event)}
            ></EmojiSelecter>
            <Navigation
                initiateGame={(random, seed) => initiateGame(random, seed)}
            ></Navigation>
            <div style={{justifyContent: "center"}}>
                <h1>How to start:</h1>
                <h3>Type in the size of the gameboard you want and</h3>
                <h3>press "NEW GAME" to start with an empty board</h3>
                <Divider textAlign="center" variant="middle">OR</Divider>
                <h3>press "RANDOM" and see what you get.</h3>
                <h5>(Important to press one of them every time you change the size)</h5>
            </div>
            <div>
                <p>Change simulation speed: </p>
                <Slider
                    size="small"
                    defaultValue={5}
                    min={1}
                    max={10}
                    marks
                    step={1}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    onChange={(event) => onIntervalChangeHandler(event)}
                    style={{ width: "50%" }}
                />
            </div>
            <StatTracker
                emoji={emojis.alive}
                generation={stats.generation}
                population={stats.population}
            ></StatTracker>
            <GameControls
                resetGame={resetGame}
                nextGen={play}
                startGame={startGame}
                stopGame={stopGame}
                onSizeChangeHandler={setSize}
            ></GameControls>
            <div
                className="container"
                style={{
                    gridTemplateColumns: `repeat(${size}, 30px)`,
                    gridTemplateRows: `repeat(${size}, 30px)`,
                }}
            >
                {gameBoard}
            </div>
        </React.Fragment>
    );
}
