export var boltGL: WebGL2RenderingContext | null;
export var boltCanvas: HTMLCanvasElement; 

let setup = false;

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

