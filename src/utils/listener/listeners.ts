import {Points} from "../../types/Points";
import {getNearestPoint} from "../helpers/getNearestPoint";
import {Indexes} from "../../types/Indexes";
let isDragging:boolean = false;
let selectedPoint:Points|null|{} = null;
let pointIndexes:Points|Indexes|null ={i:-1,j:-1};

export function onMouseDown(event:MouseEvent,controlPoints:Points[][],canvas:any) {

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const normalizedX = (x / canvas.width) * 2 - 1;
    const normalizedY = 1 - (y / canvas.height) * 2;

    [selectedPoint,pointIndexes] = getNearestPoint(normalizedX, normalizedY,controlPoints);
    if (selectedPoint) {
        isDragging = true;
    }
}

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
