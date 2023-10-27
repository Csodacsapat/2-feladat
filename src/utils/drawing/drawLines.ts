export function drawLines(gl:WebGL2RenderingContext,arrayOfPoints:number[][],program:WebGLProgram){
    const vertexBuffer = gl.createBuffer();
    for (let i = 0; i < arrayOfPoints.length; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayOfPoints[i]), gl.STATIC_DRAW);

        const coord = gl.getAttribLocation(program as WebGLProgram, "controlPoints");
        gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coord);
        gl.drawArrays(gl.LINE_STRIP, 0, arrayOfPoints[i].length / 3);
    }
}
