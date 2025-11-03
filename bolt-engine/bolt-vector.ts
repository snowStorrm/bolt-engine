
const getSet = { 
    get(target, property) { 
        if (target.decodeStr.indexOf(property) != -1) return Reflect.get(target, "dimArr")[target.decodeStr.indexOf(property)];
        else switch (String(property)) {
            case "length": return Reflect.get(target, "length");
            case "unitVector": 
                if (target instanceof vec2) return new vec2(target.dimArr[0]!/target.length, target.dimArr[1]!/target.length);
                else if (target instanceof vec3) return new vec3(target.dimArr[0]!/target.length, target.dimArr[1]!/target.length, target.dimArr[2]!/target.length);
                else if (target instanceof vec4) return new vec4(target.dimArr[0]!/target.length, target.dimArr[1]!/target.length, target.dimArr[2]!/target.length, target.dimArr[3]!/target.length);
                else return null;             
        }
        return null;
    }, 
    set(target, property, value) {
        if (target.decodeStr.indexOf(String(property)) != -1) {
            return Reflect.set(target.dimArr, target.decodeStr.indexOf(String(property)), value);
        }; 
        return false;
    } 
}

class Vector {
    dimArr: number[];
    decodeStr: string;
    length: number;
    unitVector!: vec2 | vec3 | vec4;
    constructor() {
        this.dimArr = [0, 0, 0, 0];
        this.decodeStr = '';
        this.length = 0;
    }
}

export class vec2 extends Vector {
    x!: number;
    y!: number;
    constructor(x: number, y: number) {
        super();
        this.dimArr=[x, y];
        this.decodeStr = 'xy';
        this.length = Math.sqrt(x**2 + y**2);
        return new Proxy(this, getSet);
    }
}

export class vec3 extends Vector {
    x!: number;
    y!: number;
    z!: number;
    constructor(x: number, y: number, z: number) {
        super();
        this.dimArr=[x, y, z];
        this.decodeStr = 'xyz';
        this.length = Math.sqrt(x**2 + y**2 + z**2);
        return new Proxy(this, getSet);
    }
}

export class vec4 extends Vector {
    x!: number;
    y!: number;
    z!: number;
    w!: number;
    constructor(x: number, y: number, z: number, w: number) {
        super();
        this.dimArr=[x, y, z, w];
        this.decodeStr = 'xyzw';
        this.length = Math.sqrt(x**2 + y**2 + z**2 + w**2);
        return new Proxy(this, getSet);
    }
}