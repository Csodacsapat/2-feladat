import {drawPoints} from "./drawPoints";
import {drawBezierSurface} from "./bezier/drawBezierSurface";
import {Points} from "../../types/Points";

export function redraw(canvas:any,controlPoints:Points[][],pointsProgram:WebGLProgram,bezierProgram:WebGLProgram){
    const gl = canvas.getContext('webgl2', {antialias: true});
    drawPoints(gl,controlPoints.flat(),pointsProgram);
    drawBezierSurface(gl,controlPoints,bezierProgram);
}
