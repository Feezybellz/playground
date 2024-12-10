
import os

# Define the project structure and content
project_structure = {
    "WebGLBedroom": {
        "index.html": '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bedroom Scene</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>WebGL Bedroom Scene</h1>
    <div id="controls">
        <h3>Controls</h3>
        <label for="group-move">Move Table + Chair:</label>
        <input type="range" id="group-move" min="-5" max="5" step="0.1"><br>
        <label for="lamp-stand-move">Move Lamp + Stand:</label>
        <input type="range" id="lamp-stand-move" min="-5" max="5" step="0.1"><br>
        <label for="lamp-move">Move Lamp Independently:</label>
        <input type="range" id="lamp-move" min="-5" max="5" step="0.1">
    </div>
    <canvas id="webgl-canvas" width="800" height="600"></canvas>
    <script type="module" src="main.js"></script>
</body>
</html>
''',
        "styles.css": '''
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    text-align: center;
    background-color: #f4f4f4;
}

#controls {
    margin: 20px;
}

canvas {
    border: 1px solid #ccc;
    background-color: black;
}
''',
        "main.js": '''
import { BedroomScene } from './modules/BedroomScene.js';
import { SceneGraph } from './modules/SceneGraph.js';
import { Utils } from './modules/Utils.js';

const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('WebGL not supported!');
}

const vertexShaderSource = `
    attribute vec3 aPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 uColor;
    void main() {
        gl_FragColor = uColor;
    }
`;

const shaderProgram = Utils.createProgram(gl, vertexShaderSource, fragmentShaderSource);
if (!shaderProgram) {
    console.error("Shader program initialization failed.");
}
gl.useProgram(shaderProgram);

const sceneGraph = new SceneGraph();
const bedroomScene = new BedroomScene();
sceneGraph.setRoot(bedroomScene.getRoot());

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    sceneGraph.render(gl, shaderProgram);
    requestAnimationFrame(render);
}

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);

render();
''',
        "modules": {
            "BedroomScene.js": '''
import { SceneObject } from './SceneObject.js';

export class BedroomScene {
    constructor() {
        this.root = new SceneObject();

        const group = new SceneObject();
        const table = this.createObject([0, 0, 0], [2, 0.1, 1], [0.5, 0.3, 0.2, 1.0]);
        const chair = this.createObject([0, -0.5, -1], [1, 0.5, 1], [0.3, 0.2, 0.1, 1.0]);
        group.addChild(table);
        group.addChild(chair);

        const lampStand = this.createObject([1, 0, -2], [0.2, 1, 0.2], [0.6, 0.6, 0.6, 1.0]);
        const lamp = this.createObject([1, 1, -2], [0.5, 0.5, 0.5], [1.0, 1.0, 0.0, 1.0]);
        lampStand.addChild(lamp);

        this.root.addChild(group);
        this.root.addChild(lampStand);
    }

    createObject(position, scale, color) {
        const obj = new SceneObject();
        obj.position = position;
        obj.scale = scale;
        obj.color = color;
        return obj;
    }

    getRoot() {
        return this.root;
    }
}
''',
            "SceneObject.js": '''
export class SceneObject {
    constructor() {
        this.children = [];
        this.position = [0, 0, 0];
        this.scale = [1, 1, 1];
        this.color = [1.0, 1.0, 1.0, 1.0];
        
        this.vertexData = new Float32Array([
            -0.5, -0.5, 0.0,
             0.5, -0.5, 0.0,
             0.5,  0.5, 0.0,
            -0.5,  0.5, 0.0
        ]);

        this.vertexBuffer = null;
    }

    initializeBuffers(gl) {
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
    }

    addChild(child) {
        this.children.push(child);
    }

    render(gl, shaderProgram) {
        if (!this.vertexBuffer) {
            this.initializeBuffers(gl);
        }

        const aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);

        gl.uniform4fv(gl.getUniformLocation(shaderProgram, "uColor"), this.color);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        for (const child of this.children) {
            child.render(gl, shaderProgram);
        }
    }
}
''',
            "SceneGraph.js": '''
import { SceneObject } from './SceneObject.js';

export class SceneGraph {
    constructor() {
        this.root = new SceneObject();
    }

    setRoot(rootObject) {
        if (!(rootObject instanceof SceneObject)) {
            throw new Error("Root must be an instance of SceneObject.");
        }
        this.root = rootObject;
    }

    render(gl, shaderProgram) {
        if (!this.root) {
            console.warn("SceneGraph has no root object to render.");
            return;
        }
        
        this.root.render(gl, shaderProgram);
    }
}
''',
            "Utils.js": '''
export class Utils {
    static createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    static createProgram(gl, vertexShaderSource, fragmentShaderSource) {
        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }
}
'''
        }
    }
}

# Function to create the directory structure and files
def create_project_structure(base_path, structure):
    for name, content in structure.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            create_project_structure(path, content)
        else:
            with open(path, 'w') as file:
                file.write(content.strip())

# Create the project in the current directory
base_path = os.path.join(os.getcwd(), "WebGLBedroom")
create_project_structure(base_path, project_structure)
print(f"Project created at {base_path}")
