import {factorial} from "../factorial"

test("calculating factorial to 5",()=>{
    const value = factorial(5);
    const expectedValue = 120;
    expect(value).toEqual(expectedValue);
})
