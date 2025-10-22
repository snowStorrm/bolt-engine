import { boltGL } from './bolt-main.js';
import { BUFFER_TYPE_INT } from './bolt-main.js';

// External enums + their index-matched internal buffer type objects
// i.e. index 0 in the external enum corresponds to index 0 in the internal array
export enum BUFFER_TYPE {XY_FLOAT_ARRAY, XYZ_FLOAT_ARRAY, XYZW_FLOAT_ARRAY}

// The buffer class
export class Buffer {
    id: string;
    type: typeof BUFFER_TYPE_INT[0] | undefined;
    attribLoc: number;
    data: Float32Array | undefined;
    numVertices: number;

    glBuffer: WebGLBuffer;

    constructor(id: string, attribLoc: number, data: number[], type: BUFFER_TYPE | undefined = 0) {
        this.id = id;
        this.type = BUFFER_TYPE_INT[type];
        this.attribLoc = attribLoc;
        this.data = (
            (this.type!.dataType == boltGL!.FLOAT) ? new Float32Array(data) :
            (undefined)
        );
        if (!this.data) throw new Error("Could not parse data of buffer '" + id + "'. Type may be incorrect.");
        this.numVertices = this.data.length/this.type!!.size;

        this.glBuffer = boltGL!.createBuffer();
        boltGL!.bindBuffer(this.type!.bufferType, this.glBuffer);
        boltGL!.bufferData(this.type!.bufferType, this.data, boltGL!.DYNAMIC_DRAW);
        boltGL!.enableVertexAttribArray(this.attribLoc);
        boltGL!.vertexAttribPointer(this.attribLoc, this.type!.size, this.type!.dataType, this.type!.normalize, this.type!.stride, this.type!.offset);
    }
}