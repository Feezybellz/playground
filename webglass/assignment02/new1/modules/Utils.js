export class Utils {
  static initShaderProgram(gl, vsSource, fsSource) {
    // Compile the vertex shader
    const vertexShader = Utils.loadShader(gl, gl.VERTEX_SHADER, vsSource);
    if (!vertexShader) {
      console.error("Vertex shader failed to compile.");
      return null;
    }

    // Compile the fragment shader
    const fragmentShader = Utils.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!fragmentShader) {
      console.error("Fragment shader failed to compile.");
      return null;
    }

    // Create the shader program and attach shaders
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // Check if the program linked successfully
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error(
        "Unable to initialize the shader program:",
        gl.getProgramInfoLog(shaderProgram)
      );
      gl.deleteProgram(shaderProgram);
      return null;
    }
    return shaderProgram;
  }

  static loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check if the shader compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        "An error occurred compiling the shader:",
        gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
}
