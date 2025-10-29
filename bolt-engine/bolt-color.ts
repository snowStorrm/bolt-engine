export enum COLOR_TYPE {LA, RGBA, CMYKA, HSVA, HEX6};
export class Color {
    type: COLOR_TYPE;
    L?: number; R?: number; G?: number; B?: number; C?: number; M?: number; Y?: number; K?: number; H?: number; S?: number; V?: number; A?: number; HEX?: String;
    glCol: number[];
    constructor(type: COLOR_TYPE.LA, col: readonly [number, number]);
    constructor(type: COLOR_TYPE.RGBA, col: readonly [number, number, number, number]);
    constructor(type: COLOR_TYPE.CMYKA, col: readonly [number, number, number, number, number]);
    constructor(type: COLOR_TYPE.HSVA, col: readonly [number, number, number, number]);
    constructor(type: COLOR_TYPE.HEX6, col: String, alpha?: number);
    constructor(type: COLOR_TYPE, col: readonly number[] | String, alpha: number | undefined=1) {
        this.type = type;
        console.log(this.type);
        switch (Number(this.type)) {
            case COLOR_TYPE.LA:
                this.L = Number(col[0]);
                this.A = Number(col[1]);
                break;
            case COLOR_TYPE.RGBA:
                this.R = Number(col[0]);
                this.G = Number(col[1]);
                this.B = Number(col[2]);
                this.A = Number(col[3]);
                break;
            case COLOR_TYPE.CMYKA:
                this.C = Number(col[0]);
                this.M = Number(col[1]);
                this.Y = Number(col[2]);
                this.K = Number(col[3]);
                this.A = Number(col[4]);
                break;
            case COLOR_TYPE.HSVA:
                this.H = Number(col[0]);
                this.S = Number(col[1]);
                this.V = Number(col[2]);
                this.A = Number(col[3]);
                break;
            case COLOR_TYPE.HEX6:
                this.HEX = String(col);
                if (this.HEX.length > 7 || this.HEX.length < 6) throw new Error("Invalid HEX string. Valid options are '#rrggbb' or 'rrggbb'.");
                this.A = alpha;
                break;
            default: throw new Error("Invalid color type selected. Use only those found in COLOR_TYPE.");
        }
        this.glCol = transformColorToRGBA(this);
    }
}

function transformColorToRGBA(col: Color) {
    let rgbaCol: number[];
    if (col.type == COLOR_TYPE.HEX6) {
        let hexNoHash = col.HEX!.replaceAll("#", "");
        let r = parseInt(hexNoHash.slice(0,2), 16)/255;
        let g = parseInt(hexNoHash.slice(2,4), 16)/255;
        let b = parseInt(hexNoHash.slice(4,6), 16)/255;
        rgbaCol = [r, g, b, col.A!];
    } else {
        switch (col.type) {
            case COLOR_TYPE.LA: rgbaCol = [col.L!, col.L!, col.L!, col.A!]; break;
            case COLOR_TYPE.RGBA: rgbaCol = [col.R!/255, col.G!/255, col.B!/255, col.A!]; break;
            case COLOR_TYPE.CMYKA:
                let L = (1 - col.K!);
                let r = (1 - col.C!) * L;
                let g = (1 - col.M!) * L;
                let b = (1 - col.Y!) * L;
                let a = col.A!;
                rgbaCol = [r, g, b, a];
                break;
            case COLOR_TYPE.HSVA:
                let chroma = col.S! * col.V!;
                let sector = col.H! / 60;
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
                let constant = col.V! - chroma;
                let rgbFinal = [rgbPrime[0]! + constant, rgbPrime[1]! + constant, rgbPrime[2]! + constant];
                rgbaCol = [rgbFinal[0]!, rgbFinal[1]!, rgbFinal[2]!, col.A!];
                break;
            default: rgbaCol = [0, 0, 0, 0];
        }
    }
    return rgbaCol;
}