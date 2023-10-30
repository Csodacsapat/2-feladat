import {DrawData} from "../types/DrawData";
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {vertexShaderSource, fragmentShaderSource} from "../utils/shaders/shaders";
import {Points} from "../types/Points";
import {createControlPoints} from "../utils/helpers/controlPoint";
import {drawBezierSurface} from "../utils/drawing/drawBezierSurface";
import {drawPoints} from "../utils/drawing/drawPoints";
import {onMouseDown, onMouseMove, onMouseUp} from "../utils/listener/listeners";
import {Indexes} from "../types/Indexes";

type props = {
    drawData: DrawData
}

export function SurfaceContainer({drawData}: props) {
    console.log("render")
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const program: MutableRefObject<WebGLProgram | null> = useRef(null);
    const pointsProgram: MutableRefObject<WebGLProgram | null> = useRef(null);
    const vertexShader: MutableRefObject<WebGLShader | null> = useRef(null);
    const fragmentShader: MutableRefObject<WebGLShader | null> = useRef(null);
    const [controlPoints, setControlPoints] = useState<Points[][]>([[]])

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
        setControlPoints(createControlPoints(drawData));

    }, [drawData.xPoint, drawData.yPoint]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.addEventListener("mousedown", (e) => onMouseDown(e, controlPoints, canvas), false)
        canvas.addEventListener("mouseup", onMouseUp, false)
        canvas.addEventListener("mousemove", (e) => onMouseMove(e, canvas, (indexes: Indexes, newX: number, newY: number, newZ: number) => {
            if (indexes.i < 0 || indexes.j < 0) {
                return;
            }
            let newControlPoints = [...controlPoints];
            try {
                newControlPoints[indexes.i][indexes.j].x = newX;
                newControlPoints[indexes.i][indexes.j].y = newY;
                newControlPoints[indexes.i][indexes.j].z = newZ;
                setControlPoints(newControlPoints)

            } catch (e) {
                canvas.removeEventListener("mousedown",()=>onMouseDown,false);
                canvas.removeEventListener("mouseup",()=>onMouseUp,false);
                canvas.removeEventListener("mousemove",()=>onMouseMove,false);
                console.log("err")
            }
        }), false)
        const gl = canvas.getContext('webgl2', {antialias: true});
        if (!gl || !pointsProgram.current || !program.current) {
            return;
        }
        drawPoints(gl, controlPoints.flat(), pointsProgram.current);
        drawBezierSurface(gl, controlPoints, program.current);
    }, [controlPoints]);

    return <canvas ref={canvasRef} width={800} height={600}/>
}
