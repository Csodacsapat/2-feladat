import {Matrix} from "ts-matrix";

export class Matrix2D {

    constructor(data: number[][]) {
        this._data = data;
    }

    get data(): number[][] {
        return this._data;
    }

    public transpose(): Matrix2D {
        if (!this._data) {
            return new Matrix2D(Array.of());
        }
        let transposedData: number[][] =  this._data[0].map((_, colIndex) => this._data.map(row => row[colIndex]));
        return new Matrix2D(transposedData);
    }

    public squash(): number[] {
        return this._data.reduce((accumulator, currentArray) => accumulator.concat(currentArray), []);
    }

    public multipy(matrix: Matrix2D) : Matrix2D {
        const rows1 = this._data.length;
        const cols1 = this._data.length;
        const rows2 = matrix.data.length;
        const cols2 = matrix.data.length;

        if (cols1 !== rows2) {
            console.error('Incompatible matrices for multiplication');
            throw new Error("Incompatible matrix")
        }

        const result: number[][] = [];

        for (let i = 0; i < rows1; i++) {
            result[i] = [];
            for (let j = 0; j < cols2; j++) {
                let sum = 0;
                for (let k = 0; k < cols1; k++) {
                    sum += this._data[i][k] * matrix.data[k][j];
                }
                result[i][j] = sum;
            }
        }

        return new Matrix2D(result);
    }

    private readonly _data: number[][];
}