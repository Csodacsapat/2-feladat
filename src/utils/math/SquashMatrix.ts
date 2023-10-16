import {Matrix} from "ts-matrix";

export function squashMatrix(matrix: Matrix) : number[] {
    if (!matrix) {
        throw Error("squashMatrix Matrix is null!")
    }
    return matrix.values.reduce((accumulator, currentArray) => accumulator.concat(currentArray), []);
}

export function squashArray(matrix: number[][]) : number[] {
    if (!matrix) {
        throw Error("squashArray Matrix is null!")
    }
    return matrix.reduce((accumulator, currentArray) => accumulator.concat(currentArray), []);
}
