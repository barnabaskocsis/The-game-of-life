import React from "react";
import Enzyme from 'enzyme';
import { mount, shallow, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {countAliveNeighbours, haha} from "../components/Game/Game";

import Game from "../components/Game/Game";

Enzyme.configure({adapter: new Adapter()});

/* test('Testing correct neighbour calculation', () => {
    const stateBoard = [[false,true,false],
                        [false,true,false],
                        [false,true,false]];

    const mockCountAliveNeighbours = jest.fn();
    countAliveNeighbours(1,1,stateBoard) = mockCountAliveNeighbours;
    const finState = mockCountAliveNeighbours.mock.call[0][0];
    expect(finState).toBe(2);
}) */

const stateBoard = [[false,true,false],
                    [false,true,false],
                    [false,true,false]];

/* var assert = require('assert');
describe('Testing correct neighbour calculation', function() {
    it('should return 2 in stateBoard', function() {
      assert.equal(countAliveNeighbours(stateBoard), 2);
    });
}); */

/* var assert = require('assert');
describe('Testing correct neighbour calculation', function() {
    it('should return 2 in stateBoard', function() {
      assert.equal(haha(2,4), 6);
    });
}); */

/* describe('<Game/>', () => {
  it("should calculate neighbours correctly", () => {
    const wrapper = shallow(<Game/>);
    expect(wrapper.haha()).to.equal(2);
  })
}) */

