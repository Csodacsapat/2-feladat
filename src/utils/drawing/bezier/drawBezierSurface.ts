import {Points} from "../../../types/Points";
import {drawLines} from "../drawLines";
import generateBezierPoints from "../../helpers/generateBezierPoints";
export function drawBezierSurface(gl: WebGL2RenderingContext, controlPoints: Points[][],program:WebGLProgram) {

    const n = controlPoints.length;
    const m = controlPoints[0].length;
    const bezierPointsHorizontally: number[][] = generateBezierPoints(n,m,controlPoints,true)
    const bezierPointsVertically: number[][] =  generateBezierPoints(n,m,controlPoints,false)

    drawLines(gl,bezierPointsHorizontally,program);
    drawLines(gl,bezierPointsVertically,program);
}


