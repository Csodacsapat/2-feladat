import {Points} from "../../types/Points";
import {bezierBaseFunction} from "../helpers/bezierBaseFunction";
import {drawLines} from "./drawLines";
export function drawBezierSurface(gl: WebGL2RenderingContext, controlPoints: Points[][],program:WebGLProgram) {

    const n = controlPoints.length;
    const m = controlPoints[0].length;
    const bezierPointsHorizontally: number[][] = []
    const bezierPointsVertically: number[][] = []

    for (let u = 0; u <= 1; u = Number((u + 0.01).toFixed(2))) {
        let row: number[] = []
        for (let v = 0; v <= 1; v = Number((v + 0.1).toFixed(2))) {
            let x = 0, y = 0, z = 0;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < m; j++) {
                    x += bezierBaseFunction(m - 1, j, u) * bezierBaseFunction(n - 1, i, v) * controlPoints[i][j].x;
                    y += bezierBaseFunction(m - 1, j, u) * bezierBaseFunction(n - 1, i, v) * controlPoints[i][j].y;
                    z += bezierBaseFunction(m - 1, j, u) * bezierBaseFunction(n - 1, i, v) * controlPoints[i][j].z;
                }
            }
            row.push(x, y, z)
        }
        bezierPointsHorizontally.push(row)
    }

    for (let u = 0; u <= 1; u = Number((u + 0.01).toFixed(2))) {
        let row: number[] = []
        for (let v = 0; v <= 1; v = Number((v + 0.1).toFixed(2))) {
            let x = 0, y = 0, z = 0;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < m; j++) {
                    //TODO: Spagetizzük meg, hogy itt if legyen és úgy döntse el, hogy vertikális vagy horizontális-e a cucc?
                    x += bezierBaseFunction(n - 1, i, u) * bezierBaseFunction(m - 1, j, v) * controlPoints[i][j].x;
                    y += bezierBaseFunction(n - 1, i, u) * bezierBaseFunction(m - 1, j, v) * controlPoints[i][j].y;
                    z += bezierBaseFunction(n - 1, i, u) * bezierBaseFunction(m - 1, j, v) * controlPoints[i][j].z;
                }
            }
            row.push(x, y, z)
        }
        bezierPointsVertically.push(row)
    }

    drawLines(gl,bezierPointsHorizontally,program);
    drawLines(gl,bezierPointsVertically,program);
}
