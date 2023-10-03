export const vertexShaderSource = `
      attribute vec3 controlPoints;
      void main(void) {
        gl_Position = vec4(controlPoints, 1.0);
        gl_PointSize = 5.0;
      }
    `;

export const fragmentShaderSource = `
      void main(void) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
      }
    `;
