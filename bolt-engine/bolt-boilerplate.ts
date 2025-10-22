import {boltGL, COLOR_TYPE} from './bolt-main.js';

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

export function transformColorToRGBA(type: COLOR_TYPE, col: number[]) {
    let rgbaCol: number[];
    switch (type) {
        case COLOR_TYPE.LA: rgbaCol = [col[0]!, col[0]!, col[0]!, col[1]!]; break;
        case COLOR_TYPE.RGBA: rgbaCol = [col[0]!/255, col[1]!/255, col[2]!/255, col[3]!/255]; break;
        case COLOR_TYPE.CMYKA: 
            let L = (1-col[3]!);
            let r = (1-col[0]!)*L;
            let g = (1-col[1]!)*L;
            let b = (1-col[2]!)*L;
            let a = col[4]!;
            rgbaCol = [r, g, b, a];
        break;
        case COLOR_TYPE.HSVA:
            let chroma = col[1]!*col[2]!;
            let sector = col[0]!/60;
            let intermediary = chroma*(1-Math.abs((sector%2)-1));
            let rgbPrime: number[];
            switch (Math.floor(sector)) {
                case 0: rgbPrime = [chroma, intermediary, 0]; break;
                case 1: rgbPrime = [intermediary, chroma, 0]; break;
                case 2: rgbPrime = [0, chroma, intermediary]; break;
                case 3: rgbPrime = [0, intermediary, chroma]; break;
                case 4: rgbPrime = [intermediary, 0, chroma]; break;
                case 5: rgbPrime = [chroma, 0, intermediary]; break;
                default: rgbPrime = [0, 0, 0]; break;
            }
            let constant = col[2]!-chroma;
            let rgbFinal = [rgbPrime[0]!+constant, rgbPrime[1]!+constant, rgbPrime[2]!+constant];
            rgbaCol = [rgbFinal[0]!, rgbFinal[1]!, rgbFinal[2]!, col[3]!]; 
        break;
        default: rgbaCol = [0, 0, 0, 0];
    }
    return rgbaCol;
}