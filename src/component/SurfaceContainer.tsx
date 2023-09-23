import {DrawData} from "../utils/DrawData";
import {useEffect, useRef} from "react";
import {mat4, vec3} from 'gl-matrix';

type props = {
    drawData: DrawData
}

export function SurfaceContainer({drawData}: props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        if(!ctx){
            return;
        }

        // Define control points for the 5x4 Bézier surface
        const controlPoints:number[][] = [
            [-1.5, 1.5], [-0.5, 1.5], [0.5, 1.5], [1.5, 1.5],
            [-1.5, 0.5], [-0.5, 0.5], [0.5, 0.5], [1.5, 0.5],
            [-1.5, -0.5], [-0.5, -0.5], [0.5, -0.5], [1.5, -0.5],
            [-1.5, -1.5], [-0.5, -1.5], [0.5, -1.5], [1.5, -1.5]
        ];

        // Calculate and draw the Bézier surface
        const numUPoints = 5; // Number of rows
        const numVPoints = 4; // Number of columns
        const stepU = 1 / (numUPoints - 1);
        const stepV = 1 / (numVPoints - 1);

        const bezier = (points: number[][], u: number, v: number): number[] => {
            const n = numUPoints - 1;
            const m = numVPoints - 1;
            const result = [0, 0];
            for (let i = 0; i <= n; i++) {
                for (let j = 0; j <= m; j++) {
                    //const factor = binomialCoefficient(n, i) * binomialCoefficient(m, j) * (1 - u) ** (n - i) * u ** i * (1 - v) ** (m - j) * v ** j;
                    const factor = 0.001;
                    const point = points[i * numVPoints + j];
                    result[0] += factor * point[0];
                    result[1] += factor * point[1];
                }
            }
            return result;
        };

        const binomialCoefficient = (n: number, k: number): number => {
            if (k === 0) return 1;
            if (k === 1) return n;
            let result = 1;
            for (let i = 1; i <= k; i++) {
                result *= (n - i + 1) / i;
            }
            return result;
        };

        for (let u = 0; u <= 1; u += stepU) {
            for (let v = 0; v <= 1; v += stepV) {
                const point = bezier(controlPoints, u, v);
                const x = (point[0] + 2) * 50; // Adjust for canvas size and position
                const y = (-point[1] + 2) * 50; // Adjust for canvas size and position
                ctx!.fillRect(x, y, 2, 2); // Draw a point
            }
        }

    }, [drawData.xPoint, drawData.yPoint]);

    if (!drawData.xPoint || !drawData.yPoint) {
        return null;
    }
    return <canvas ref={canvasRef} width={500} height={500}/>
}