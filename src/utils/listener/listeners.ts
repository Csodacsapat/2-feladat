import {Points} from "../../types/Points";
import {getNearestPoint} from "../helpers/getNearestPoint";
import {Indexes} from "../../types/Indexes";
import {mat4, vec3, vec4} from "gl-matrix";
import {generateFOV, view} from "../helpers/projection";
import React, {SetStateAction} from "react";

let isDragging: boolean = false;
let selectedPoint: Points | null | {} = null;
let pointIndexes: Points | Indexes | null = {i: -1, j: -1};

export function onMouseDown(event: MouseEvent, controlPoints: Points[][], camRotateY: number, camRotateX: number, objectMove: number[],wValue:number, canvas: any) {

    if (controlPoints.length === 0 || controlPoints[0].length === 0) {
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
    const proj_mat = generateFOV(70, 0.1, 100);
    const view_mat = view(camRotateY, camRotateX, objectMove);
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Normalizáljuk a kattintási koordinátákat a [-1, 1] tartományba
    const x = mouseX / canvas.width * 2 - 1;
    const y = 1 - mouseY / canvas.height * 2;
    const multipleMatrix = mat4.create();
    mat4.multiply(multipleMatrix, proj_mat, view_mat);

    const kat1 = vec4.create();

    vec4.transformMat4(kat1,vec4.fromValues(x,y,0,wValue),multipleMatrix);

    //console.log(multipleMatrix);
    //console.log(vec4.fromValues(x,y,0,1));
    console.log(x,y);
    console.log(kat1);
    console.log(controlPoints[2][2]);
    [selectedPoint,pointIndexes] = getNearestPoint(kat1[0]*kat1[3], kat1[1]/kat1[2],controlPoints);
    console.log(pointIndexes);
    console.log(selectedPoint);
    //console.log(kat2);
    // Invertált projekciós és nézetmátrix számítása

    /*const pontok:Points[][] = new Array(controlPoints.length).fill(new Array(controlPoints[0].length));
    controlPoints.map((row,iIndex)=>{
        row.map((point,jIndex)=>{
            const coord: vec4 = vec4.create();
            const kat = vec4.create();
            vec4.set(kat,point.x,point.y,point.z,wValue);
            vec4.transformMat4(coord, kat, multipleMatrix);
            pontok[iIndex][jIndex] = {x:coord[0],y:coord[1],z:coord[3]}
        })
    })*/
    // Kattintási pont visszaszámolása WebGL térbe

    //vec4.transformMat4(clickedPoint, clickedPoint, inverseMat);

    //checkClickedPoint(vec3.fromValues(result[0],result[1],result[2]),controlPoints);
}

function checkClickedPoint(clickCoords: vec3, controlPoints: Points[][]) {
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

export function onMouseMove(event: MouseEvent, canvas: any, callback: Function) {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const normalizedX = (x / canvas.width) * 2 - 1;
        const normalizedY = 1 - (y / canvas.height) * 2;

        callback(pointIndexes, normalizedX, normalizedY, 0);
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
