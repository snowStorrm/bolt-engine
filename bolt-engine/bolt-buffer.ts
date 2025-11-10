import { boltGL } from './bolt-main.js';
import { BUFFER_TYPE_INT } from './bolt-main.js';
import { VectorArray, vec2, vec3, vec4 } from './bolt-vector.js';

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

    constructor(id: string, attribLoc: number, data: VectorArray);
    constructor(id: string, attribLoc: number, data: number[], type: BUFFER_TYPE | undefined);
    constructor(id: string, attribLoc: number, data: number[] | VectorArray, type: BUFFER_TYPE | undefined = BUFFER_TYPE.XY_FLOAT_ARRAY) {
        this.id = id;
        this.attribLoc = attribLoc;
        if (data instanceof VectorArray) {
            if (data.type == 'vec2') this.type = BUFFER_TYPE_INT[BUFFER_TYPE.XY_FLOAT_ARRAY];
            if (data.type == 'vec3') this.type = BUFFER_TYPE_INT[BUFFER_TYPE.XYZ_FLOAT_ARRAY];
            if (data.type == 'vec4') this.type = BUFFER_TYPE_INT[BUFFER_TYPE.XYZW_FLOAT_ARRAY];
            this.data = new Float32Array(data.arrayForm());
            this.numVertices = data.length;
        } else {
            this.type = BUFFER_TYPE_INT[type];
            this.data = (
                (this.type.dataType == boltGL!.FLOAT) ? new Float32Array(data) :
                (undefined)
            );
            this.numVertices = this.data!.length/this.type.size;
        }
        if (!this.data) throw new Error("Error: could not parse data of buffer '" + id + "'. Type may be incorrect or unsupported.");

        this.glBuffer = boltGL!.createBuffer();
        boltGL!.bindBuffer(this.type!.bufferType, this.glBuffer);
        boltGL!.bufferData(this.type!.bufferType, this.data, boltGL!.DYNAMIC_DRAW);
        boltGL!.enableVertexAttribArray(this.attribLoc);
        boltGL!.vertexAttribPointer(this.attribLoc, this.type!.size, this.type!.dataType, this.type!.normalize, this.type!.stride, this.type!.offset);
    }
}