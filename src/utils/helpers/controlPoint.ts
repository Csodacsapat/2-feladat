import {DrawData} from "../DrawData";
import {Points} from "../../types/Points";
import {linSpace} from "./linspace";

export function createControlPoints(drawData: DrawData): Points[][] {
    const linspaceX = linSpace(drawData.xPoint, -0.8, 0.8)
    const linspaceY = linSpace(drawData.yPoint, -0.8, 0.8)

    const calculatedPoints: Points[][] = [];
    for (let i = 0; i < linspaceX.length; i++) {
        const row: Points[] = [];
        for (let j = 0; j < linspaceY.length; j++) {
            row.push({x: linspaceX[i], y: linspaceY[j], z: 0});
        }
        calculatedPoints.push(row)
    }
    return calculatedPoints
}