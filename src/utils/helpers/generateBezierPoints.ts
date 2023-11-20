import {Points} from "../../types/Points";
import {bezierBaseFunction} from "./bezierBaseFunction";

export default function generateBezierPoints (n:number,m:number,controlPoints:Points[][],horizontal:boolean):number[][]{
    const bezierPoints: number[][] = []
    for (let u = 0; u <= 1; u = Number((u + 0.01).toFixed(2))) {
        let row: number[] = []
        for (let v = 0; v <= 1; v = Number((v + 0.1).toFixed(2))) {
            let x = 0, y = 0, z = 0;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < m; j++) {
                    const baseJ = bezierBaseFunction(m - 1, j, horizontal?u:v);
                    const baseI = bezierBaseFunction(n - 1, i, horizontal?v:u);
                    x +=  baseI* baseJ * controlPoints[i][j].x;
                    y +=  baseI* baseJ * controlPoints[i][j].y;
                    z +=  baseI* baseJ * controlPoints[i][j].z;
                }
            }
            row.push(x, y, z)
        }
        bezierPoints.push(row)
    }
    return bezierPoints;
}
