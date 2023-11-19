import {Points} from "../../types/Points";
import {Indexes} from "../../types/Indexes";

const closeEnough: number = 0.003

export function getNearestPoint(normalizedX: number, normalizedY: number, controlPoints: Points[][]) {
    let nearestPoint = null;
    let nearestDistance = Infinity;
    let falseCounter: number = 0;
    let indexes: Indexes = {i: -1, j: -1};
    for (let i = 0; i < controlPoints.length; i++) {
        for (let j = 0; j < controlPoints[i].length; j++) {
            const pointX = controlPoints[i][j].x;
            const pointY = controlPoints[i][j].y;
            const distance = (pointX - normalizedX) ** 2 + (pointY - normalizedY) ** 2;

            if (distance <= closeEnough && distance < nearestDistance) {
                nearestPoint = controlPoints[i][j];
                indexes.i = i;
                indexes.j = j;
                nearestDistance = distance;
            } else {
                falseCounter++;
            }
        }
    }

    if (falseCounter === controlPoints.flat().flat().length) {
        nearestPoint = null;
    }
    return [nearestPoint, indexes];
}
