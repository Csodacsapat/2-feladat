import {Points} from "../../../types/Points";
import {drawLines} from "../drawLines";

export function drawBSplineSurface(gl: WebGL2RenderingContext, controlPoints: Points[][], program: WebGLProgram) {
    function bsplineBasisFunction(i: number, u: number, p: number, U: number[]): number {
        let N = new Array(p + 1).fill(0);
        let Uleft: number, Uright: number, saved: number, temp: number;

        if (u < U[i] || u >= U[i + p + 1]) {
            return 0;
        }

        for (let j = 0; j <= p; j++) {
            if (u >= U[i + j] && u < U[i + j + 1]) {
                N[j] = 1;
            } else {
                N[j] = 0;
            }
        }

        for (let k = 1; k <= p; k++) {
            if (N[0] === 0) {
                saved = 0;
            } else {
                saved = ((u - U[i]) * N[0]) / (U[i + k] - U[i]);
            }

            for (let j = 0; j <= p - k; j++) {
                Uleft = U[i + j + 1];
                Uright = U[i + j + k + 1];

                if (N[j + 1] === 0) {
                    N[j] = saved;
                    saved = 0;
                } else {
                    temp = N[j + 1] / (Uright - Uleft);
                    N[j] = saved + (Uright - u) * temp;
                    saved = (u - Uleft) * temp;
                }
            }
        }
        return N[0];
    }

    /**
     * @param n control pontok száma
     * @param p bspline fokszáma
     */
    const generateKnots = (n: number, p: number): number[] => {
        const knots: number[] = [];
        const numKnots = n + p + 1;
        for (let i = 0; i < numKnots; i++) {
            knots.push(i / (numKnots -1));
        }
        return knots;
    };

    const degreeU = 3; // Degree in the U direction
    const degreeV = 3;
    const n = controlPoints.length;
    const m = controlPoints[0].length;
    const bSplineHorizontally: number[][] = [];
    const bSplineVertically: number[][] = [];
    const knotsU: number[] = generateKnots(n,degreeU)
    const knotsV: number[] = generateKnots(m,degreeV);

    for (let u = 0.01; u <= 1; u += 0.01) {
        let row: number[] = [];
        for (let v = 0.01; v <= 1; v += 0.01) {
            let weightSum =0;
            let x = 0, y = 0, z = 0;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < m; j++) {
                    const basisU = bsplineBasisFunction(i, u,degreeU, knotsU);
                    const basisV = bsplineBasisFunction(j, v,degreeV, knotsV);
                    const weight = basisU * basisV;
                    x += weight * controlPoints[i][j].x;
                    y += weight * controlPoints[i][j].y;
                    z += weight * controlPoints[i][j].z;
                    weightSum+=weight;
                }

            }
            if(weightSum){
                x/=weightSum;
                y/=weightSum;
                z/=weightSum;
            }

            row.push(x, y, z);
        }
        bSplineHorizontally.push(row);
    }

    for (let u = 0.01; u <= 1; u += 0.01) {
        let row: number[] = [];
        for (let v = 0.01; v <= 1; v += 0.01) {
            let weightSum =0;
            let x = 0, y = 0, z = 0;
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < m; j++) {
                    const basisU = bsplineBasisFunction(i, v,degreeU, knotsU);
                    const basisV = bsplineBasisFunction(j, u,degreeV, knotsV);
                    const weight = basisU * basisV;
                    x += weight * controlPoints[i][j].x;
                    y += weight * controlPoints[i][j].y;
                    z += weight * controlPoints[i][j].z;
                    weightSum+=weight;
                }

            }
            if(weightSum){
                x/=weightSum;
                y/=weightSum;
                z/=weightSum;
            }

            //if(x==0 && y ==0 && z==0){
            /* continue;
         }*/
            row.push(x, y, z);
        }
        bSplineHorizontally.push(row);
    }

    drawLines(gl, bSplineHorizontally, program);
    //drawLines(gl, bSplinePointsVertically, program);


}