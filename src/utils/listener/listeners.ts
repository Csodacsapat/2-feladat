import {Points} from "../../types/Points";
import {getNearestPoint} from "../helpers/getNearestPoint";
import {Indexes} from "../../types/Indexes";
import {mat4, vec2, vec3, vec4} from "gl-matrix";
import {generateFOV, view} from "../../component/Projection";
let isDragging:boolean = false;
let selectedPoint:Points|null|{} = null;
let pointIndexes:Points|Indexes|null ={i:-1,j:-1};

export function onMouseDown(event:MouseEvent,controlPoints:Points[][],canvas:any) {

    if(controlPoints.length  === 0 || controlPoints[0].length === 0){
        return;
    }
   /* const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const normalizedX = (x / canvas.width) * 2 - 1;
    const normalizedY = 1 - (y / canvas.height) * 2;

    [selectedPoint,pointIndexes] = getNearestPoint(normalizedX, normalizedY,controlPoints);
    if (selectedPoint) {
        isDragging = true;
    }*/
    const fovMatrix = generateFOV(70, 0.1, 100);
    const view_mat = view();
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Számoljuk ki a kattintás térbeli koordinátáit a nézetprojekciós mátrix segítségével
    const normalizedX = (mouseX / canvas.width) * 2 - 1;
    const normalizedY = 1 - (mouseY / canvas.height) * 2;

    const multipleMatrix = mat4.create();
    mat4.multiply(multipleMatrix,fovMatrix,view_mat);
    const invMatrix = mat4.create();
    mat4.invert(invMatrix,multipleMatrix);

    const result = vec4.create();

    vec4.transformMat4(result,vec4.fromValues(normalizedX,normalizedY,0,1),invMatrix);

    //checkClickedPoint(vec3.fromValues(normalizedCoords[0],normalizedCoords[1],normalizedCoords[2]),controlPoints);
}
function checkClickedPoint(clickCoords:vec3,controlPoints:Points[][]) {
    const epsilon = 0.2; // Egy kis eltérés elfogadása a kattintás területén

    for (let i = 0; i < controlPoints.length; i++) {
        for (let j = 0; j < controlPoints[i].length; j++) {
            const point = controlPoints[i][j];
            const distance = vec3.distance(clickCoords, [point.x, point.y, point.z]);

            if (distance < epsilon) {
                console.log('Kattintás a(z) ' + i + '. sor, ' + j + '. oszlop négyzetsíkra.');
                //it kéne mozgatni
                return;
            }
        }
    }

    console.log('Nincs találat a kattintásra.');
};

export function onMouseMove(event:MouseEvent,canvas:any,callback:Function) {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const normalizedX = (x / canvas.width) * 2 - 1;
        const normalizedY = 1 - (y / canvas.height) * 2;

        callback(pointIndexes,normalizedX,normalizedY,0);
    }
}

export function onMouseUp(event:MouseEvent) {
    isDragging = false;
    selectedPoint = null;
    pointIndexes = {i:-1,j:-1};
}
