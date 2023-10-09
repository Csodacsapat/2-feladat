import {factorial} from "./factorial";

export function binomialCoefficient(n: number, index: number) {
    /*if (index === 0 || n === index) {
        return 1;
    }
    if (index < 0 || index > n) {
        return 0;
    }*/
    return factorial(n) / (factorial(index) * (factorial(n - index)))
}
