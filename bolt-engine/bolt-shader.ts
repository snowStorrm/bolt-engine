import {boltGL} from './bolt-main.js';
import {Buffer, BUFFER_TYPE} from './bolt-buffer.js';
import {createShaderProgram, PROG_TYPE, getBufferIndex} from './bolt-boilerplate.js';


export class Shader {
    vertexShader: WebGLShader;
    fragmentShader: WebGLShader;
    program: WebGLProgram;
    buffers: Buffer[];
    vao: WebGLVertexArrayObject;

    constructor(vertexShaderSource: string, fragmentShaderSource: string) {
        this.vertexShader = createShaderProgram(vertexShaderSource, PROG_TYPE.VERTEX);
        this.fragmentShader = createShaderProgram(fragmentShaderSource, PROG_TYPE.FRAGMENT);
        this.program = boltGL!.createProgram();
        boltGL!.attachShader(this.program, this.vertexShader);
        boltGL!.attachShader(this.program, this.fragmentShader);
        boltGL!.linkProgram(this.program);
        if (!boltGL!.getProgramParameter(this.program, boltGL!.LINK_STATUS)) throw new Error(String(boltGL!.getProgramInfoLog(this.program)));
        this.buffers = [];
        this.vao = boltGL!.createVertexArray();
    }

    // Appends a Buffer object to this.buffers[]
    addBuffer(id: string, data: number[], type?: BUFFER_TYPE) {
        boltGL!.useProgram(this.program);
        boltGL!.bindVertexArray(this.vao);
        let attribLoc = boltGL!.getAttribLocation(this.program, id);
        this.buffers.push(new Buffer(id, attribLoc, data, type));
    }
    
    // Removes specified buffer
    delBuffer(id: string) {
        let idx = getBufferIndex(this.buffers, id);
        if (!idx) console.warn("Could not find buffer '" + id + "'. No buffers have been removed.");
        else {
            boltGL!.deleteBuffer(this.buffers[idx]!.glBuffer);
            this.buffers.splice(idx, 1);
        }
    }

    // Returns specified buffer
    getBuffer(id: string) {
        let idx = getBufferIndex(this.buffers, id);
        if (!idx) return null;
        else return this.buffers[idx];
    }

    // Sets data of specified buffer
    setBuffer(id: string, data: number[]) {
        let idx = getBufferIndex(this.buffers, id);
        if (idx == null) throw new Error("Attempting to set data on a nonexistant buffer!");
        else {
            boltGL!.bindBuffer(this.buffers[idx]!.type!.bufferType, this.buffers[idx]!.glBuffer);
            let dataArr = (this.buffers[idx]!.type!.dataType == boltGL!.FLOAT) ? new Float32Array(data) :
            (null);
            boltGL!.bufferData(this.buffers[idx]!.type!.bufferType, dataArr, boltGL!.DYNAMIC_DRAW);
            this.buffers[idx]!.numVertices = data.length/this.buffers[idx]!.type!.size;
        }
    }
    // TODO: rewrite uniformData as an object w/ type and data values
    //       + add handling for various types
    // remove private prefix once TODO completed
    private setUniform(uniformName: string, uniformData: number[]) {
        boltGL!.useProgram(this.program);
        let uniformLoc = boltGL!.getUniformLocation(this.program, uniformName);
    }

    // Runs shader program once
    // Update vertices and call this each frame to animate stuff
    draw() {
        boltGL!.useProgram(this.program);
        boltGL!.bindVertexArray(this.vao);
        if (this.buffers.length == 0) throw new Error("Attempting to call Shader.draw() on a shader with no buffer data!");
        else {
            let l = this.buffers[0]!.numVertices;
            for (let i = 0; i < this.buffers.length; i++) {
                if (l != this.buffers[i]!.numVertices) throw new Error("Not all shader buffers are of the same length!");
            }
            boltGL!.drawArrays(boltGL!.TRIANGLES, 0, this.buffers[0]!.numVertices);
        }
    }   
}