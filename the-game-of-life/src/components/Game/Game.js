import React, { useEffect, useRef, useState } from "react";
import Cell from "../Cell/Cell";
import "./Game.css";

export default function Game(props) {
    const [size, setSize] = useState(5);
    const [gameBoard, setGameBoard] = useState([]);
    const [stateBoard, setStateBoard] = useState([]);
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

    // initiate and reset board
    const initiateGame = () => {
        setGameStarted(false);
        setGameRunning(false);
        setStats({generation: 0, cellsAlive: 0});
        setStateBoard([]);
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

    const play = (board) => {
        setGameStarted(true);
        let newStateBoard = [];
        const newGenNumber = stats.generation + 1;
        setStats({...stats, generation: newGenNumber})
        console.log("Playing...");
        console.log("Next gen: " + newGenNumber);
        newStateBoard = nextGeneration(board);
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

    const onStopHandler = () => {
        if (gameRunning) {
            setGameRunning(false);
            clearTimeout(iterationTimerRef.current);
        }
    };

    /* const userList = (
        <List>
          {userSearches.map((user) => (
            <UserListItem user={user} newChat={() => newChatHandler(user)} />
          ))}
        </List>
      ); */

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
                <input
                    type="text"
                    value={size}
                    onChange={(event) => onSizeChangeHandler(event)}
                ></input>
                <button onClick={initiateGame}>SET UP</button>
                <button onClick={initiateGame}>RESET</button>
                <button onClick={test}>TEST</button>
                <button onClick={() => play(stateBoard)}>NEXT GEN</button>
                <button onClick={startGame}>START</button>
                <button onClick={onStopHandler}>STOP</button>
            </div>
            <div>{stateBoard.toString()}</div>
            <div></div>
        </React.Fragment>
    );
}
