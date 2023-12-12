import {DrawData} from "../types/DrawData";
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {vertexShaderSource, fragmentShaderSource} from "../utils/shaders/shaders";
import {Points} from "../types/Points";
import {createControlPoints} from "../utils/helpers/controlPoint";
import {drawBezierSurface} from "../utils/drawing/bezier/drawBezierSurface";
import {drawPoints} from "../utils/drawing/drawPoints";
import {applyFOV, view} from "../utils/helpers/projection";
import {drawBSplineSurface} from "../utils/drawing/bspline/drawBSplineSurface";
import {handleWheel, onMouseDown, onMouseMove, onMouseUp} from "../utils/listener/listeners";
import {Indexes} from "../types/Indexes";
import {Button, Divider, Grid, Stack, TextField} from "@mui/material";
import {Coordinates} from "../types/SelectedPoint";

type props = {
    drawData: DrawData,
    surfaceType: string,
}

export const canvasWidth = 800;
export const canvasHeight = 600;

export function SurfaceContainer({drawData, surfaceType}: props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const program: MutableRefObject<WebGLProgram | null> = useRef(null);
    const pointsProgram: MutableRefObject<WebGLProgram | null> = useRef(null);
    const vertexShader: MutableRefObject<WebGLShader | null> = useRef(null);
    const fragmentShader: MutableRefObject<WebGLShader | null> = useRef(null);
    const [controlPoints, setControlPoints] = useState<Points[][]>([[]])

    const [camRotateX, setCamRotateX] = useState<number>(0);
    const [camRotateY, setCamRotateY] = useState<number>(0);
    const [objectMove, setObjectMove] = useState<number[]>([0, 0, 1.5])
    const [wValue, setWValue] = useState<number>(1.0);

    const [editedCoordinate, setEditedCoordinate] = useState<Coordinates>({x: 0, y: 0})

    const [editedX, setEditedX] = useState<number>(0)
    const [editedY, setEditedY] = useState<number>(0)
    const [editedZ, setEditedZ] = useState<number>(0)

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
        canvas.setAttribute('tabindex', "0");
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
        if (!controlPoints[0].length || !editedCoordinate || editedCoordinate.x == null || editedCoordinate.y == null || editedCoordinate.y == -1 || editedCoordinate.x == -1) {
            return
        }
        setEditedX(controlPoints[editedCoordinate.x][editedCoordinate.y].x)
        setEditedY(controlPoints[editedCoordinate.x][editedCoordinate.y].y)
        setEditedZ(controlPoints[editedCoordinate.x][editedCoordinate.y].z)
    }, [editedCoordinate]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl2', {antialias: true});
        if (!gl || !pointsProgram.current || !program.current) {
            return;
        }
        const viewT = view(camRotateY, camRotateX, objectMove);

        console.log("drawPoints")
        drawPoints(gl, controlPoints.flat(), pointsProgram.current);
        if (surfaceType === "Bezier") {
            console.log("asdasdasd")
            drawBezierSurface(gl, controlPoints, program.current)
        } else if (surfaceType === "B-spline") {
            drawBSplineSurface(gl, controlPoints, program.current);
        }

        applyFOV(gl, pointsProgram.current, viewT, wValue)
        canvas.focus()

    }, [controlPoints, surfaceType, camRotateY, camRotateX, objectMove, wValue]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case "w":
                setCamRotateX(camRotateX - 0.01);
                break;
            case "s":
                setCamRotateX(camRotateX + 0.01);
                break;
            case "a":
                setCamRotateY(camRotateY - 0.01);
                break;
            case "d":
                setCamRotateY(camRotateY + 0.01);
                break;
            case "ArrowUp":
                setObjectMove([objectMove[0], objectMove[1] - 0.01, objectMove[2]]);
                break;
            case "ArrowDown":
                setObjectMove([objectMove[0], objectMove[1] + 0.01, objectMove[2]]);
                break;
            case "ArrowLeft":
                setObjectMove([objectMove[0] + 0.01, objectMove[1], objectMove[2]]);
                break;
            case "ArrowRight":
                setObjectMove([objectMove[0] - 0.01, objectMove[1], objectMove[2]]);
                break;
        }
    }


    return <React.Fragment>
                    <TextField id="standard-basic" label="X" variant="standard" type="number" onChange={(e: any) => {
                        if (!editedCoordinate) {
                            return
                        }
                        const modifiedControlPoints = [...controlPoints];
                        modifiedControlPoints[editedCoordinate.x][editedCoordinate.y].x = Number(e.target.value)
                        setControlPoints(modifiedControlPoints)
                        setEditedX(e.target.value)
                    }} value={editedX}/>
                    <TextField value={editedY} id="standard-basic" label="Y" variant="standard" type="number" onChange={(e: any) => {
                        if (!editedCoordinate) {
                            return
                        }
                        const modifiedControlPoints = [...controlPoints];
                        modifiedControlPoints[editedCoordinate.x][editedCoordinate.y].y = Number(e.target.value)
                        setControlPoints(modifiedControlPoints)
                        setEditedY(e.target.value)
                    }}/>

                    <TextField value={editedZ} id="standard-basic" label="Z" variant="standard" type="number" onChange={(e: any) => {
                        if (!editedCoordinate) {
                            return
                        }
                        const modifiedControlPoints = [...controlPoints];
                        modifiedControlPoints[editedCoordinate.x][editedCoordinate.y].z = Number(e.target.value)
                        setControlPoints(modifiedControlPoints)
                        setEditedZ(e.target.value)
                    }}/>

                <canvas
                    onKeyDown={handleKeyDown}
                    onWheel={(event: React.WheelEvent) => handleWheel(event, wValue, setWValue)}
                    onMouseUp={(event: any) => onMouseUp(event)}
                    onMouseDown={(event: any) => onMouseDown(event, controlPoints, camRotateY, camRotateX, objectMove, wValue, canvasRef.current, setEditedCoordinate)}
                    ref={canvasRef}
                    width={canvasWidth}
                    height={canvasHeight}/>
    </React.Fragment>
}
