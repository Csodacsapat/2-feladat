import {squashMatrix} from "./SquashMatrix";


describe("SquashMatrix", () => {
    it("squashes the 2D matrix into 1D array", () => {
        expect(squashMatrix(1, 2)).toBe(3);
    });
});