import {Points} from "../../types/Points";

export function drawPoints(gl: WebGL2RenderingContext, points: Points[],pointsProgram:WebGLProgram) {

    const controlPoints = [];
    gl.useProgram(pointsProgram);
    for (const point of points) {
        controlPoints.push(point.x, point.y, point.z);
    }
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(controlPoints), gl.STATIC_DRAW);
    gl.lineWidth(5)
    let attribLocation = gl.getAttribLocation(pointsProgram as WebGLProgram, "controlPoints");

    gl.vertexAttribPointer(attribLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribLocation);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.drawArrays(gl.POINTS, 0, controlPoints.length / 3);
}
