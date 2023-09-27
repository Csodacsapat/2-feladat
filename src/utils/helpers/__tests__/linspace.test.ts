import {linSpace} from "../linspace";

test("linSpace calculating between -1 and 1" , ()=>{
    const value = linSpace(3,-1,1)
    const expectedValue = [-1,0,1]
    expect(value).toStrictEqual(expectedValue);
})
