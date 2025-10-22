import { transformColorToRGBA } from "./bolt-boilerplate";

export var boltGL: WebGL2RenderingContext | null;
export var boltCanvas: HTMLCanvasElement; 
export var BUFFER_TYPE_INT: any;

export function createCanvas(canvas?: HTMLCanvasElement, width?: number, height?: number) {
    boltCanvas = canvas || document.createElement("canvas");
    boltCanvas.width = width || 640;
    boltCanvas.height = height || 480;
    boltCanvas.id = "boltCanvas";
    if (!document.getElementById("boltCanvas")) document.body.appendChild(boltCanvas);
    boltGL = boltCanvas.getContext("webgl2");
    if (!boltGL) throw new Error("WebGL context not found! Is it enabled or supported by your browser?");
    boltGL.viewport(0, 0, boltCanvas.width, boltCanvas.height);

    BUFFER_TYPE_INT = [
        {
            bufferType: boltGL.ARRAY_BUFFER,
            size: 2,
            dataType: boltGL.FLOAT,
            normalize: false,
            stride: 0,
            offset: 0
        },
        {
            bufferType: boltGL.ARRAY_BUFFER,
            size: 3,
            dataType: boltGL.FLOAT,
            normalize: false,
            stride: 0,
            offset: 0
        },
        {
            bufferType: boltGL.ARRAY_BUFFER,
            size: 4,
            dataType: boltGL!.FLOAT,
            normalize: false,
            stride: 0,
            offset: 0
        }
    ]
}

export function clearCanvas(col?: Color) {
    let clearCol = (col) ? col.glCol : [0, 0, 0, 1];
    (boltGL!.clearColor as any)(...clearCol);
    boltGL!.clear(boltGL!.COLOR_BUFFER_BIT);
}

export enum COLOR_TYPE{LA, RGBA, CMYKA, HSVA};
export class Color {
    type: COLOR_TYPE;
    rawCol: number[];
    glCol: number[];
    constructor(type: COLOR_TYPE.LA, lightness: number, alpha: number);
    constructor(type: COLOR_TYPE.RGBA, red: number, green: number, blue: number, alpha: number);
    constructor(type: COLOR_TYPE.CMYKA, cyan: number, magenta: number, yellow: number, key: number, alpha: number);
    constructor(type: COLOR_TYPE.HSVA, hue: number, saturation: number, brightness: number, alpha: number);
    constructor(type: COLOR_TYPE, c1: number, c2: number, c3?: number, c4?: number, c5?: number) {
        this.type = type;
        switch (type) {
            case COLOR_TYPE.LA: this.rawCol = [c1, c2]; break;
            case COLOR_TYPE.RGBA: this.rawCol = [c1, c2, c3!, c4!]; break;
            case COLOR_TYPE.CMYKA: this.rawCol = [c1, c2, c3!, c4!, c5!]; break;
            case COLOR_TYPE.HSVA: this.rawCol = [c1, c2, c3!, c4!]; break;
            default: throw new Error("Invalid color type selected. Use only those found in Bolt.COLOR_TYPE.");
        }
        this.glCol = transformColorToRGBA(this.type, this.rawCol);
    }
    set(type: COLOR_TYPE.LA, lightness: number, alpha: number): void;
    set(type: COLOR_TYPE.RGBA, red: number, green: number, blue: number, alpha: number): void;
    set(type: COLOR_TYPE.CMYKA, cyan: number, magenta: number, yellow: number, key: number, alpha: number): void;
    set(type: COLOR_TYPE.HSVA, hue: number, saturation: number, brightness: number, alpha: number): void;
    set(type: COLOR_TYPE, c1: number, c2: number, c3?: number, c4?: number, c5?: number) {
        this.type = type;
        switch (type) {
            case COLOR_TYPE.LA: this.rawCol = [c1, c2]; break;
            case COLOR_TYPE.RGBA: this.rawCol = [c1, c2, c3!, c4!]; break;
            case COLOR_TYPE.CMYKA: this.rawCol = [c1, c2, c3!, c4!, c5!]; break;
            case COLOR_TYPE.HSVA: this.rawCol = [c1, c2, c3!, c4!]; break;
            default: throw new Error("Invalid color type selected. Use only those found in Bolt.COLOR_TYPE.");
        }
        this.glCol = transformColorToRGBA(this.type, this.rawCol);
    }
}