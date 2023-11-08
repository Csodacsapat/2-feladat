import {canvasWidth} from "./SurfaceContainer";
import {canvasHeight} from "./SurfaceContainer";
import {Points} from "../types/Points";
import {vec4} from 'gl-matrix';
import {tan} from "mathjs";
//let mat4 = require('gl-mat4');

export function generateFOV(angle : number, nearCull : number, farCull : number ){
    let aspect = canvasWidth/canvasHeight;
    let fov = angle * Math.PI/180;
    let inverseRange = 1 / tan(fov * 0.5);
    let sY = inverseRange;
    let sX = inverseRange/aspect;
    let sZ = -1 * (farCull + nearCull) / (farCull - nearCull);
    let pZ = -1 * (2 * farCull * nearCull) / (farCull - nearCull);

    let projectionMatrix = [sX , 0, 0, 0, 0, sY, 0, 0, 0, 0, sZ, -1, 0, 0, pZ, 0];
    return projectionMatrix;

}


export function view(){

    let cameraPosition = [0, 0, 2];
    //let cameraSpeed = 0;
    //let cameraYSpeed = 0;
    //let cameraY = 0;
    //let T = vec4.fromValues(-1*cameraPosition[0], -1*cameraPosition[1], -1*cameraPosition[2], 1);
    /*let T = [1, 0, 0, 0,
                       0, 1, 0, 0,
                       0, 0, 1, 0,
                       -1*cameraPosition[0], -1*cameraPosition[1], -1*cameraPosition[2], 1];*/

    let T = [1, 0, 0, 0,
                       0, 1, 0, 0,
                       0, 0, 1, 0,
                       0, 0, 0, 1];


    return T;
}


export function applyFOV(gl: WebGL2RenderingContext, points: Points[],pointsProgram:WebGLProgram){
    let fovMatrix = generateFOV(70, 0.1, 100 );
    let viewT = view();

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fovMatrix), gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(viewT), gl.STATIC_DRAW);

    //let attribLocationFov = gl.getAttribLocation(pointsProgram as WebGLProgram, "proj");
    let attribLocationView = gl.getAttribLocation(pointsProgram as WebGLProgram, "view");

    //gl.vertexAttribPointer(attribLocationFov, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(attribLocationView, 4, gl.FLOAT, false, 0, 0);
    //gl.enableVertexAttribArray(attribLocationFov);
    gl.enableVertexAttribArray(attribLocationView);

    //console.log(fov);

    console.log(fovMatrix);
    console.log(viewT);

}


