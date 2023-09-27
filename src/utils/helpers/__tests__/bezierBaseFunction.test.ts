import {bezierBaseFunction} from "../bezierBaseFunction";

test("Bezier base function calculating where n = 3, index = 1 and t=0.5" , ()=>{
    const value = bezierBaseFunction(5,4,0.5)
    const expectedValue = 0.15625
    expect(value).toStrictEqual(expectedValue);
})

test("Bezier base function calculating where n = 5, index = 4 and t=0.01" , ()=>{
    const value:number = bezierBaseFunction(5,4,0.01)
    const expectedValue = 0.0000000495
    expect(value).toEqual(expectedValue);
})
