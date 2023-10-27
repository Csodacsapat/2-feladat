import {DrawData} from "../utils/DrawData";
import React, {MutableRefObject, useEffect, useRef} from "react";
import {vertexShaderSource, fragmentShaderSource} from "../utils/shaders/shaders";
import {bezierBaseFunction} from "../utils/helpers/bezierBaseFunction";
import {Points} from "../types/Points";
import {createControlPoints} from "../utils/helpers/controlPoint";

type props = {
    drawData: DrawData
}

export function SurfaceContainer({drawData}: props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const program: MutableRefObject<WebGLProgram | null> = useRef(null);
    const pointsProgram: MutableRefObject<WebGLProgram | null> = useRef(null);
    const vertexShader: MutableRefObject<WebGLShader | null> = useRef(null);
    const fragmentShader: MutableRefObject<WebGLShader | null> = useRef(null);

    function init(gl: WebGL2RenderingContext) {
        if (!vertexShader.current || !fragmentShader.current || !program.current || !pointsProgram.current) {
            return;
        }
        gl.shaderSource(vertexShader.current, vertexShaderSource);
        gl.compileShader(vertexShader.current);

        gl.shaderSource(fragmentShader.current, fragmentShaderSource);
        gl.compileShader(fragmentShader.current);

        gl.attachShader(program.current, vertexShader.current);
        gl.attachShader(pointsProgram.current, vertexShader.current);
        gl.attachShader(program.current, fragmentShader.current);
        gl.attachShader(pointsProgram.current, fragmentShader.current);
        gl.linkProgram(program.current);
        gl.linkProgram(pointsProgram.current);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl2', {antialias: true});
        if (!gl) {
            console.error('WebGL is not supported');
            return;
        }
        program.current = gl.createProgram();
        pointsProgram.current = gl.createProgram();

        vertexShader.current = gl.createShader(gl.VERTEX_SHADER);
        fragmentShader.current = gl.createShader(gl.FRAGMENT_SHADER);

        init(gl)
        const controlPoints: Points[][] = createControlPoints(drawData);

        drawPoints(gl, controlPoints.flat());
        drawBezierSurface(gl, controlPoints);

    }, [drawData.xPoint, drawData.yPoint]);

    function drawBezierSurface(gl: any, controlPoints: Points[][]) {
        const n = controlPoints.length;
        const m = controlPoints[0].length;
        const bezierPointsHorizontally: number[][] = []
        const bezierPointsVertically: number[][] = []

        for (let u = 0; u <= 1; u = Number((u + 0.01).toFixed(2))) {
            let row: number[] = []
            for (let v = 0; v <= 1; v = Number((v + 0.1).toFixed(2))) {
                let x = 0, y = 0, z = 0;
                for (let i = 0; i < n; i++) {
                    for (let j = 0; j < m; j++) {
                        x += bezierBaseFunction(m - 1, j, u) * bezierBaseFunction(n - 1, i, v) * controlPoints[i][j].x;
                        y += bezierBaseFunction(m - 1, j, u) * bezierBaseFunction(n - 1, i, v) * controlPoints[i][j].y;
                        z += bezierBaseFunction(m - 1, j, u) * bezierBaseFunction(n - 1, i, v) * controlPoints[i][j].z;
                    }
                }
                row.push(x, y, z)
            }
            bezierPointsHorizontally.push(row)
        }

        for (let u = 0; u <= 1; u = Number((u + 0.01).toFixed(2))) {
            let row: number[] = []
            for (let v = 0; v <= 1; v = Number((v + 0.1).toFixed(2))) {
                let x = 0, y = 0, z = 0;
                for (let i = 0; i < n; i++) {
                    for (let j = 0; j < m; j++) {
                        //TODO: Spagetizzük meg, hogy itt if legyen és úgy döntse el, hogy vertikális vagy horizontális-e a cucc?
                        x += bezierBaseFunction(n - 1, i, u) * bezierBaseFunction(m - 1, j, v) * controlPoints[i][j].x;
                        y += bezierBaseFunction(n - 1, i, u) * bezierBaseFunction(m - 1, j, v) * controlPoints[i][j].y;
                        z += bezierBaseFunction(n - 1, i, u) * bezierBaseFunction(m - 1, j, v) * controlPoints[i][j].z;
                    }
                }
                row.push(x, y, z)
            }
            bezierPointsVertically.push(row)
        }


        drawLines(gl,bezierPointsHorizontally);
        drawLines(gl,bezierPointsVertically);
    }

    const drawLines = (gl:WebGL2RenderingContext,arrayOfPoints:number[][]) =>{
        const vertexBuffer = gl.createBuffer();
        for (let i = 0; i < arrayOfPoints.length; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayOfPoints[i]), gl.STATIC_DRAW);

            const coord = gl.getAttribLocation(program.current as WebGLProgram, "controlPoints");
            gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(coord);
            gl.drawArrays(gl.LINE_STRIP, 0, arrayOfPoints[i].length / 3);
        }
    }

    function drawPoints(gl: any, points: any) {
        const controlPoints = [];
        gl.useProgram(pointsProgram.current);
        for (const point of points) {
            controlPoints.push(point.x, point.y, point.z);
        }
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(controlPoints), gl.STATIC_DRAW);
        gl.lineWidth(5)
        let attribLocation = gl.getAttribLocation(pointsProgram.current as WebGLProgram, "controlPoints");

        gl.vertexAttribPointer(attribLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribLocation);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.drawArrays(gl.POINTS, 0, controlPoints.length / 3);
    }

    if (!drawData.xPoint || !drawData.yPoint) {
        return null;
    }
    return <canvas ref={canvasRef} width={800} height={600}/>
}
