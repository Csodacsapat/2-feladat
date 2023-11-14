import {canvasHeight, canvasWidth} from "./SurfaceContainer";
import {tan} from "mathjs";
import {mat4, vec4} from "gl-matrix"


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

export function view(){
    // ezt kell majd növelni, hogy forogjon a test.
    const camYaw = 0.5
    //itt az utolsó paramétert kell növelni/csökkenteni hogy közelebb/ távolabb menjen tölünk a test;
    const cam_pos = [ 0, 0, 2.0 ]
    const T:mat4 = mat4.create();
    const identity = mat4.create()
    mat4.translate(T,mat4.identity(identity),[-cam_pos[0],-cam_pos[1],-cam_pos[2]]);
    const R:mat4 = mat4.create();
    mat4.identity(R);
    mat4.rotateY(R,R,camYaw);
    const view_mat = mat4.create();
    mat4.multiply(view_mat,T,R);
    return view_mat;

}

export function applyFOV(gl: WebGL2RenderingContext,pointsProgram:WebGLProgram){
    let fovMatrix = generateFOV(70, 0.1, 100 );
    let viewT = view();

    const uModelViewMatrix = gl.getUniformLocation(pointsProgram, "view");
    gl.uniformMatrix4fv(uModelViewMatrix, false, viewT);
    const projMat = gl.getUniformLocation(pointsProgram, "proj");
    gl.uniformMatrix4fv(projMat, false, fovMatrix);

}


