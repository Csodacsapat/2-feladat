import {binomialCoefficient} from "../binomialCoefficient";

test("binomial coefficient calculating where n = 3 and index = 1" , ()=>{
    const value = binomialCoefficient(3,1)
    const expectedValue = 3
    expect(value).toStrictEqual(expectedValue);
})


test("binomial coefficient calculating where n = 5 and index = 4" , ()=>{
    const value = binomialCoefficient(5,4)
    const expectedValue = 5
    expect(value).toStrictEqual(expectedValue);
})

test("binomial coefficient calculating where n = 4 and index = 2" , ()=>{
    const value = binomialCoefficient(4,2)
    const expectedValue = 6
    expect(value).toStrictEqual(expectedValue);
})
