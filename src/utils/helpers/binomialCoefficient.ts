import {factorial} from "./factorial";

export function binomialCoefficient(n: number, index: number) {
    return factorial(n) / (factorial(index) * (factorial(n - index)))
}
