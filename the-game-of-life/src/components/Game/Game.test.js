import React from "react";
import renderer from 'react-test-renderer';
import {countAliveNeighbours} from "./Game";

test('Testing correct neighbour calculation', () => {
    const stateBoard = [[false,true,false],
                        [false,true,false],
                        [false,true,false]];
    const finState = countAliveNeighbours(1,1,stateBoard);

    expect(finState).toBe(2);
})