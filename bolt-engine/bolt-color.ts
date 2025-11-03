import { transformColorToRGBA, testHexCodeForValidity } from './bolt-boilerplate';

const getSet = {
    get(target, property) {
        if (target.decodeStr.indexOf(property) != -1) return Reflect.get(target, 'colArr')[target.decodeStr.indexOf(property)];
        else switch (property) {
            case 'glCol': return Reflect.get(target, 'glCol');
            case 'hex': if (target instanceof Hex) return Reflect.get(target, 'hex');
        }
        return null;
    },
    set(target, property, value) {
        if (target.decodeStr.indexOf(property) != -1) {
            let success = Reflect.set(target.colArr, target.decodeStr.indexOf(property), value);
            target.glCol = transformColorToRGBA(target);
            return success;
        } else if (property == 'hex' && target instanceof Hex && testHexCodeForValidity(value)) {
            let success = Reflect.set(target, 'hexStr', value);
            target.glCol = transformColorToRGBA(target) as number[];
            return success;
        }
        return false;
    }
}

class Color {
    colArr:number[];
    glCol: number[];
    decodeStr: string;
    constructor() {
        this.colArr = [];
        this.glCol = [0, 0, 0, 0];
        this.decodeStr = '';
    }
}

export class LA extends Color {
    L!: number; A!: number;
    constructor(lightness: number, alpha: number | undefined = 1) {
        super();
        this.colArr = [lightness, alpha];
        this.glCol = transformColorToRGBA(this) as number[];
        this.decodeStr = 'LA';
        return new Proxy(this, getSet);
    }
}
export class RGBA extends Color {
    R!: number; G!: number; B!: number; A!: number;
    constructor(red: number, green: number, blue: number, alpha: number | undefined = 1) {
        super();
        this.colArr = [red, green, blue, alpha];
        this.glCol = transformColorToRGBA(this) as number[];
        this.decodeStr = 'RGBA';
        return new Proxy(this, getSet);
    }
}
export class CMYK extends Color {
    C!: number; M!: number; Y!: number; K!: number; A!: number;
    constructor(cyan: number, magenta: number, yellow: number, key: number, alpha: number | undefined = 1) {
        super();
        this.colArr = [cyan, magenta, yellow, key, alpha];
        this.glCol = transformColorToRGBA(this) as number[];
        this.decodeStr = 'CMYKA';
        return new Proxy(this, getSet);
    }
}
export class HSV extends Color {
    H!: number; S!: number; V!: number; A!: number;
    constructor(hue: number, saturation: number, vibrance: number, alpha: number | undefined = 1) {
        super();
        this.colArr = [hue, saturation, vibrance, alpha];
        this.glCol = transformColorToRGBA(this) as number[];
        this.decodeStr = 'HSVA';
        return new Proxy(this, getSet);
    }
}
export class Hex extends Color {
    hex!: string; A!: number;
    constructor(hexCode: string, alpha: number | undefined = 1) {
        super();
        if (testHexCodeForValidity(hexCode)) this.hex = hexCode;
        this.colArr = [alpha];
        this.glCol = transformColorToRGBA(this) as number[];
        this.decodeStr = 'A';
        return new Proxy(this, getSet);
    }
}