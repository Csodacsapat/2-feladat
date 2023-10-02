import {DrawData} from "../utils/DrawData";
import React, {MutableRefObject, useEffect, useRef} from "react";
import {vertexShaderSource, fragmentShaderSource} from "../utils/shaders/shaders";
import {bezierBaseFunction} from "../utils/helpers/bezierBaseFunction";

type props = {
    drawData: DrawData
}
type Points = {
    x: number,
    y: number,
    z: number
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
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
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
        // Az itt létrehozott adatok a Bézier felület vezérlőpontjai lennének
        const controlPoints: Points[][] = [
            [{x: -0.8, y: -0.8, z: 0.0}, {x: -0.8, y: -0.5, z: 0.0}, {x: -0.8, y: 0.0, z: 0.0}, {
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

        drawPoints(gl, controlPoints.flat());
        drawBezierSurface(gl, controlPoints);

    }, [drawData.xPoint, drawData.yPoint]);

    function drawBezierSurface(gl: any, controlPoints: Points[][]) {
        const n = controlPoints.length;
        const m = controlPoints[0].length;
        const bezierPointsHorizontally: number[][] = new Array(m).fill([]).map(() => []);
        const bezierPointsVertically: number[][] = new Array(n).fill([]).map(() => []);

        //az első 2 forciklus a pontok aik kockával jelennek meg
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                let x, y, z;
                //horizontális szakaszok számítása
                for (let u = 0; u < 1; u = u + 0.01) {
                    for (let v = 0; v < 1; v = v + 0.1) {
                        x = bezierBaseFunction(n, i, u) * bezierBaseFunction(m, j, v) * controlPoints[i][j].x;
                        y = controlPoints[i][j].y;
                        z = bezierBaseFunction(n, i, u) * bezierBaseFunction(m, j, v) * controlPoints[i][j].z;
                        bezierPointsHorizontally[j].push(x, y, z)

                    }
                }
                bezierPointsHorizontally[j].push(controlPoints[i][j].x, controlPoints[i][j].y, controlPoints[i][j].z)
                //vertikális szakaszok
                for (let v = 0; v < 1; v += 0.01) {
                    for (let u = 0; u < 1; u += 0.1) {
                        x = controlPoints[i][j].x;
                        y = bezierBaseFunction(n, i, u) * bezierBaseFunction(m, j, v) * controlPoints[i][j].y;
                        z = bezierBaseFunction(n, i, u) * bezierBaseFunction(m, j, v) * controlPoints[i][j].z;
                        bezierPointsVertically[i].push(x, y, z)
                    }
                }
                bezierPointsVertically[i].push(controlPoints[i][j].x, controlPoints[i][j].y, controlPoints[i][j].z)
            }
        }

        const vertexBuffer = gl.createBuffer();
        for (let i = 0; i < bezierPointsHorizontally.length; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bezierPointsHorizontally[i]), gl.STATIC_DRAW);

            const coord = gl.getAttribLocation(program.current as WebGLProgram, "controlPoints");
            gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(coord);

            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.drawArrays(gl.LINE_STRIP, 0, bezierPointsHorizontally[i].length / 3);

        }

        for (let i = 0; i < bezierPointsVertically.length; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bezierPointsVertically[i]), gl.STATIC_DRAW);

            const coord = gl.getAttribLocation(program.current as WebGLProgram, "controlPoints");
            gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(coord);
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.drawArrays(gl.LINE_STRIP, 0, bezierPointsVertically[i].length / 3);

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
