import {DrawData} from "../utils/DrawData";
import {useEffect, useRef} from "react";
import { mat4 } from "gl-matrix";
import {factorial} from "../utils/helpers/factorial"
type props = {
    drawData: DrawData
}

export function SurfaceContainer({drawData}: props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl2');
        if (!gl) {
            console.error('WebGL is not supported');
            return;
        }

        const vertexShaderSource = `
      attribute vec2 coordinates;
      void main(void) {
        gl_Position = vec4(coordinates, 0.0, 1.0);
        gl_PointSize = 5.0;
      }
    `;

        // Fragment shader for drawing points
        const fragmentShaderSource = `
      void main(void) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
      }
    `;

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        const program = gl.createProgram();
        const pointsProgram = gl.createProgram();

        if (!vertexShader || !fragmentShader || !program || !pointsProgram) {
            return;
        }

        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);

        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);

        gl.attachShader(program, vertexShader);
        gl.attachShader(pointsProgram, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.attachShader(pointsProgram, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Az itt létrehozott adatok a Bézier felület vezérlőpontjai lennének
        const controlPoints = [
            [{x: -0.8, y: -0.8, z: 0.0}, {x: -0.8, y: -0.6, z: 0.0}, {x: -0.8, y: 0.0, z: 0.0}, {
                x: -0.8,
                y: 0.6,
                z: 0.0
            }],
            [{x: -0.6, y: -0.8, z: 0.0}, {x: -0.6, y: -0.6, z: 0.0}, {x: -0.6, y: 0.0, z: 0.0}, {
                x: -0.6,
                y: 0.6,
                z: 0.0
            }],
            [{x: -0.2, y: -0.8, z: 0.0}, {x: -0.2, y: -0.6, z: 0.0}, {x: -0.2, y: 0.0, z: 0.0}, {
                x: -0.2,
                y: 0.6,
                z: 0.0
            }],
            [{x: 0.2, y: -0.8, z: 0.0}, {x: 0.2, y: -0.6, z: 0.0}, {x: 0.2, y: 0.0, z: 0.0}, {x: 0.2, y: 0.6, z: 0.0}],
            [{x: 0.8, y: -0.8, z: 0.0}, {x: 0.8, y: -0.6, z: 0.0}, {x: 0.8, y: 0.0, z: 0.0}, {x: 0.8, y: 0.6, z: 0.0}],
        ];


        // Calculate points on the Bezier curve
        const curvePoints = calculateBezierCurve(controlPoints);
        let lasPoint = controlPoints[3]
        curvePoints.push(lasPoint)

        drawPoints(gl, pointsProgram, controlPoints.flat());
        // Draw the Bezier curve
        drawBezierSurface(gl, program, curvePoints);
        /*gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(controlPoints), gl.STATIC_DRAW);

        const vao = gl.createVertexArray();
        if (!vao) {
            return;
        }
        gl.bindVertexArray(vao);
        gl.enableVertexAttribArray(positionAttributeLocation);

        const size = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(255, 255, 255, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //const numberOfPoints = 100; // Pontok száma a görbén
        const bezierPoints = [];


        const point = calculateBezierPoint(controlPoints);
        //bezierPoints.push(point[0], point[1]);


        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(point), gl.STATIC_DRAW);
        gl.lineWidth(2.0)
        gl.drawArrays(gl.LINE_STRIP, 0, point.length);*/

   }, [drawData.xPoint, drawData.yPoint]);

    function calculateBezierCurve(controlPoints: any) {
        // Calculate Bezier curve points
        const curvePoints = [];
        const numSegments = 100; // Detail of the curve

        for (let t = 0; t <= 1; t += 1 / numSegments) {
            const point = bezierInterpolation(controlPoints, t);
            curvePoints.push(point);
        }

        return curvePoints;
    }

    function bezierInterpolation(points: any, t: any): any {
        if (points.length === 1) {
            return points[0];
        }

        const interpolatedPoints = [];

        for (let i = 0; i < points.length - 1; i++) {
            const x = (1 - t) * points[i].x + t * points[i + 1].x;
            const y = (1 - t) * points[i].y + t * points[i + 1].y;
            interpolatedPoints.push({x, y});
        }

        return bezierInterpolation(interpolatedPoints, t);
    }

    function drawBezierSurface(gl: any, shaderProgram: any, curvePoints: any) {
        // Draw the Bezier curve
        const coordinates = [];
        const uPTS = curvePoints[0].length
        const wPTS = curvePoints.length;
        const uCELLS = 10;
        const wCELLS = 20;
        const n = uPTS-1;
        const m = wPTS-1;
        const u = linSpace(uCELLS);
        const w = linSpace(wCELLS);

        for (const point of curvePoints) {
            coordinates.push(point.x, point.y);
        }

        const cu:number[] = []
        const cw:number[]   = []
        for(let i= 0; i< n; i++){
            const currentCU = factorial(n) / (factorial(i)*factorial(n-i))
            cu.push(currentCU);
        }
        for(let j = 0 ; j<m ;j++){
            const currentCW = factorial(m) / (factorial(j)*factorial(n-j))
            cw.push(currentCW)
        }

        for (let k=1;k < uPTS;k++){

        }

        // Create vertex buffer and upload data
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordinates), gl.STATIC_DRAW);

        // Prepare for drawing
        const coord = gl.getAttribLocation(shaderProgram, "coordinates");
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coord);

        // Drawing
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        //gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.drawArrays(gl.LINE_STRIP, 0, curvePoints.length);
    }
    function linSpace(num:number) {
        const startValue:number = 0
        const stopValue:number = 1
        const cardinality:number = num
        const arr = [];
        const step = (stopValue - startValue) / (cardinality - 1);
        for (let i = 0; i < cardinality; i++) {
            arr.push(startValue + (step * i));
        }
        return arr;
    }
    function drawPoints(gl: any, shaderProgram: any, points: any) {
        // Draw points on the canvas
        const coordinates = [];

        for (const point of points) {
            coordinates.push(point.x, point.y);
        }

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordinates), gl.STATIC_DRAW);

        const coord = gl.getAttribLocation(shaderProgram, "coordinates");
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coord);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.useProgram(shaderProgram);
        gl.drawArrays(gl.POINTS, 0, points.length);
    }

    if (!drawData.xPoint || !drawData.yPoint) {
        return null;
    }
    return <canvas ref={canvasRef} width={800} height={600}/>
}