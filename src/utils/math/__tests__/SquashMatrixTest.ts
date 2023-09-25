import {squashMatrix} from "../SquashMatrix";
import {Matrix} from "ts-matrix";


describe("SquashMatrix", () => {
    it("squashes the 2D matrix into 1D array", () => {
        const testMatrix: Matrix = new Matrix(3, 2, [[1,2],[3,4],[5,6]]);
        const expectedArray: number[]  = [1,2,3,4,5,6]
        expect(squashMatrix(testMatrix)).toStrictEqual(expectedArray);
    });
});