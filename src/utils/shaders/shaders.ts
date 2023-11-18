export const vertexShaderSource = `
    attribute vec3 controlPoints;
    uniform mat4 view;
    uniform mat4 proj;
    uniform float wValue;
    
    void main(void) {
        gl_Position =  proj * view * vec4(controlPoints, wValue);
        gl_PointSize = 5.0;
    }
`;

export const fragmentShaderSource = `
      void main(void) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
      }
    `;
