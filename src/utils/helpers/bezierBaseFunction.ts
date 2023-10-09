import {binomialCoefficient} from "./binomialCoefficient";

export function bezierBaseFunction(n:number,index:number,t:number):number{
    const multiplier = Math.pow((1-t),(n-index))
    return binomialCoefficient(n,index)*Math.pow(t,index)*multiplier;
}
