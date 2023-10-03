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
bezierBaseFunction(4, 2, 0.5)

test("Bezier base function calculating where n = 4, index = 2 and t=0.05" , ()=>{
    const value:number = bezierBaseFunction(4,2,0.05)
    const expectedValue = 0.013537500000000003
    expect(value).toBe(expectedValue);
})

test("Bezier base function calculating n= 0 to 3 index = 0 to 3 and t=0.5", ()=>{
    const n = 3;
    const t = 0.5;
    const expValues:number[]=[0.125,0.375,0.375,0.125]
    for (let index = 0; index <= n; index++) {
        const result = bezierBaseFunction(n, index, t);
        expect(expValues[index]).toEqual(result)
    }
})
