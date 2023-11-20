import {canvasHeight, canvasWidth} from "../../component/SurfaceContainer";
import {tan} from "mathjs";
import {mat4} from "gl-matrix"

export function generateFOV(angle : number, nearCull : number, farCull : number ){
    let aspect = canvasWidth/canvasHeight;
    let fov = angle * Math.PI/180;
    let inverseRange = 1 / tan(fov * 0.5);
    let sY = inverseRange;
    let sX = inverseRange/aspect;
    let sZ = -1 * (farCull + nearCull) / (farCull - nearCull);
    let pZ = -1 * (2 * farCull * nearCull) / (farCull - nearCull);

    const fovMatrix = mat4.create()
    mat4.set(fovMatrix,sX, 0, 0, 0,
        0, sY, 0, 0,
        0, 0, sZ, -1,
        0, 0, pZ, 0)
    return fovMatrix; //proj_mat

}

export function view(camRotateY:number=0,camRotateX:number=0,objectMove:number[]){
    const T:mat4 = mat4.create();
    mat4.identity(T);
    const identity = mat4.create()
    mat4.translate(T,mat4.identity(identity),[-objectMove[0],-objectMove[1],-objectMove[2]]);
    const RX:mat4 = mat4.create();
    const RY:mat4 = mat4.create();
    mat4.rotateX(RX, mat4.identity(RX), camRotateX);
    mat4.rotateY(RY, mat4.identity(RY), camRotateY);
    const view_mat = mat4.create();
    mat4.multiply(view_mat,T,RX);
    mat4.multiply(view_mat,view_mat,RY);
    return view_mat;

}

export function applyFOV(gl: WebGL2RenderingContext,pointsProgram:WebGLProgram ,view:mat4,wValue:number){
    let proj = generateFOV(70, 0.1, 100 );

    const uModelViewMatrix = gl.getUniformLocation(pointsProgram , "view");
    gl.uniformMatrix4fv(uModelViewMatrix, false, view);
    const projMat = gl.getUniformLocation(pointsProgram , "proj");
    gl.uniformMatrix4fv(projMat, false, proj);

    const wLocation = gl.getUniformLocation(pointsProgram, 'wValue');

    gl.uniform1f(wLocation, wValue<0?1.0:wValue);

}
