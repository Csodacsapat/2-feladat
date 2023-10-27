import {factorial} from "../factorial";
import {createControlPoints} from "../controlPoint";
import {Points} from "../../../types/Points";

test("testing createControlPoints returns the correct length array",()=>{
    const value = createControlPoints({xPoint: 3, yPoint:3});
    expect(value.length).toEqual(3);
})

test("testing createControlPoints returns the correct array",()=>{
    const value = createControlPoints({xPoint: 3, yPoint:3});
    const expectedValue: Points[][] = [
        [{"x": -0.8, "y": -0.8, "z": 0}, {"x": -0.8, "y": 0, "z": 0}, {"x": -0.8, "y": 0.8, "z": 0}],
        [{"x": 0, "y": -0.8, "z": 0}, {"x": 0, "y": 0, "z": 0}, {"x": 0, "y": 0.8, "z": 0}],
        [{"x": 0.8, "y": -0.8, "z": 0}, {"x": 0.8, "y": 0, "z": 0}, {"x": 0.8, "y": 0.8, "z": 0}]
    ];
    expect(value).toEqual(expectedValue);
})

test("testing createControlPoints returns the correct array not 3x3",()=>{
    const value = createControlPoints({xPoint: 3, yPoint:4});
    const expectedValue: Points[][] = [
        [{"x": -0.8, "y": -0.8, "z": 0}, {"x": -0.8, "y": -0.2666666666666667, "z": 0}, {"x": -0.8, "y": 0.2666666666666666, "z": 0}, {"x": -0.8, "y": 0.8, "z": 0}],
        [{"x": 0, "y": -0.8, "z": 0}, {"x": 0, "y": -0.2666666666666667, "z": 0}, {"x": 0, "y": 0.2666666666666666, "z": 0}, {"x": 0, "y": 0.8, "z": 0}],
        [{"x": 0.8, "y": -0.8, "z": 0}, {"x": 0.8, "y": -0.2666666666666667, "z": 0}, {"x": 0.8, "y": 0.2666666666666666, "z": 0}, {"x": 0.8, "y": 0.8, "z": 0}]
    ]

    expect(value).toEqual(expectedValue);
})