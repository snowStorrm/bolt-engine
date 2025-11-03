import { boltGL } from './bolt-main';
import * as Color from './bolt-color';

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

export function transformColorToRGBA(col: Color.LA | Color.RGBA | Color.CMYK | Color.HSV | Color.Hex) {
    if (col instanceof Color.Hex) {
        let hexNoHash = col.hex!.replaceAll('#', '');
        let r = parseInt(hexNoHash.slice(0,2), 16)/255;
        let g = parseInt(hexNoHash.slice(2,4), 16)/255;
        let b = parseInt(hexNoHash.slice(4,6), 16)/255;
        return [r, g, b, col.colArr[0]!];
    } 
    else if (col instanceof Color.LA) return [col.colArr[0]!, col.colArr[0]!, col.colArr[0]!, col.colArr[1]!];
    else if (col instanceof Color.RGBA) return [col.colArr[0]!/255, col.colArr[1]!/255, col.colArr[2]!/255, col.colArr[3]!];
    else if (col instanceof Color.CMYK) {
        let L = (1 - col.colArr[3]!);
        let r = (1 - col.colArr[0]!) * L;
        let g = (1 - col.colArr[1]!) * L;
        let b = (1 - col.colArr[2]!) * L;
        let a = col.colArr[4]!;
        return [r, g, b, a];
    }
    else if (col instanceof Color.HSV) {
        let chroma = col.colArr[1]! * col.colArr[2]!;
        let sector = col.colArr[0]! / 60;
        let intermediary = chroma * (1 - Math.abs((sector % 2) - 1));
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
        let constant = col.colArr[2]! - chroma;
        let rgbFinal = [rgbPrime[0]! + constant, rgbPrime[1]! + constant, rgbPrime[2]! + constant];
        return [rgbFinal[0], rgbFinal[1], rgbFinal[2], col.colArr[3]!];
    }
    else return [1, 1, 1, 1];
}

export function testHexCodeForValidity(str: string) {
    if (str.length < 6 || str.length > 7) throw new Error("Hex color'" + str + "'is not valid");
    else { for (let i = 0; i < str.length; i++) { if ('#0123456789abcdefABCDEF'.indexOf(String(str[i])) == -1) throw new Error("Hex color '" + str + "' is not valid") } } 
    return true;
}