import {binomialCoefficient} from "./binomialCoefficient";

export function bezierBaseFunction(n:number,index:number,t:number):number{
    const multiplier = (1-t)**(n-index)
    return binomialCoefficient(n,index)*(t**index)*multiplier;
}
