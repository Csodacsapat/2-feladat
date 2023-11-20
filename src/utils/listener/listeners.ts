import {Points} from "../../types/Points";
import {getNearestPoint} from "../helpers/getNearestPoint";
import {Indexes} from "../../types/Indexes";
import {mat4, vec3, vec4} from "gl-matrix";
import {generateFOV, view} from "../helpers/projection";
import React, {SetStateAction} from "react";
import {number} from "mathjs";

let isDragging: boolean = false;
let selectedPoint: Points | null | {} = null;
let pointIndexes: Points | Indexes | null = {i: -1, j: -1};
let actualW = 1;

export function onMouseDown(event: MouseEvent, controlPoints: Points[][], camRotateY: number, camRotateX: number, objectMove: number[],wValue:number, canvas: any) {

    if (controlPoints.length === 0 || controlPoints[0].length === 0) {
        return;
    }

    const proj_mat = generateFOV(70, 0.1, 100);
    const view_mat = view(camRotateY, camRotateX, objectMove);
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const x = mouseX / canvas.width * 2 - 1;
    const y = 1 - mouseY / canvas.height * 2;
    const multipleMatrix = mat4.create();
    mat4.multiply(multipleMatrix, proj_mat, view_mat);

    const movedControlPoints:Points[][] = new Array(controlPoints.length)
    for(let i=0; i<controlPoints.length;i++){
        movedControlPoints[i] = [];
        for (let j=0 ;j<controlPoints[i].length;j++){
            const pointOnCanvasTransformed = vec4.create();
            vec4.transformMat4(pointOnCanvasTransformed,vec4.fromValues(controlPoints[i][j].x,controlPoints[i][j].y,0,wValue),multipleMatrix)
            vec4.scale(pointOnCanvasTransformed,pointOnCanvasTransformed,1/pointOnCanvasTransformed[3])
            movedControlPoints[i].push( {
                x: pointOnCanvasTransformed[0],
                y: pointOnCanvasTransformed[1],
                z: pointOnCanvasTransformed[2]
            })

        }
    }

    [selectedPoint,pointIndexes] = getNearestPoint(x, y,movedControlPoints);

    if(selectedPoint){
        isDragging= true;
    }


}

export function onMouseMove(event: MouseEvent, canvas: any,camRotateY: number, camRotateX: number, objectMove: number[],wValue:number, callback: Function) {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const normalizedX = (x / canvas.width) * 2 - 1;
        const normalizedY = 1 - (y / canvas.height) * 2;

        const proj_mat = generateFOV(70, 0.1, 100);
        const view_mat = view(camRotateY, camRotateX, objectMove);

        const invProj = mat4.create()
        const invView = mat4.create();

        mat4.invert(invProj,proj_mat);
        mat4.invert(invView,view_mat);
        const multiple = mat4.create();
        mat4.multiply(multiple,invView,invProj)
        const multipleMatrix = mat4.create();
        mat4.multiply(multipleMatrix, proj_mat, view_mat);
        const vec42 = vec4.create();
        vec4.transformMat4(vec42,vec4.fromValues(normalizedX,normalizedY,0,wValue),multipleMatrix)
        vec4.transformMat4(vec42,vec42,multiple)
        vec4.scale(vec42,vec42,1/vec42[3])
        console.log(normalizedX)
        console.log(vec42[0])
        //callback(pointIndexes, normalizedX/0.7175, normalizedY/0.95, vec42[2]);
    }
}

export function onMouseUp(event: MouseEvent) {
    isDragging = false;
    selectedPoint = null;
    pointIndexes = {i: -1, j: -1};
}


function onScrollUp(callbackControlPoints: Function | null, callbackPoint: Function | null = null) {
    if (isDragging && callbackPoint) {
        callbackPoint(pointIndexes);
    }
    if (callbackControlPoints) {
        callbackControlPoints();
    }
}

function onScrollDown(callbackControlPoints: Function | null, callbackPoint: Function | null = null) {
    if (isDragging && callbackPoint) {
        callbackPoint(pointIndexes);
    }
    if (callbackControlPoints) {
        callbackControlPoints();
    }
}


export function handleWheel(event: React.WheelEvent, wValue: number, setWValue: React.Dispatch<SetStateAction<number>>) {
    if (event.deltaY < 100) {
        onScrollUp(() => {
            setWValue(wValue + 0.01)
        })
        return;
    }
    onScrollDown(() => {
        setWValue(wValue - 0.01 < 0 ? wValue : wValue - 0.01);
    })

}
