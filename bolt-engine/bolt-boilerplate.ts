import { boltGL } from './bolt-main.js';

export enum PROG_TYPE {VERTEX, FRAGMENT}
export function createShaderProgram(src: string, type: PROG_TYPE) {
    const sType = (Number(type)==PROG_TYPE.VERTEX) ? boltGL!.VERTEX_SHADER :
                  (Number(type)==PROG_TYPE.FRAGMENT) ? boltGL!.FRAGMENT_SHADER :
                  -1;
    const shader: WebGLShader | null = boltGL!.createShader(sType);
    if (shader) {
        boltGL!.shaderSource(shader, src);
        boltGL!.compileShader(shader);
        if (boltGL!.getShaderParameter(shader, boltGL!.COMPILE_STATUS)) return shader;
        else throw new Error(String(boltGL!.getShaderInfoLog(shader)));
    } else throw new Error("Error creating new shader of type " + type.toString + ": type may be invalid.")
}

export function getBufferIndex(bufferArr: any, id: string) {
    for (let i:number = 0; i < bufferArr.length + 1; i++) {
        if (bufferArr[i].id == id) return i;
    }
    return null;
}