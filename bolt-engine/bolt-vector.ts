import { isIdx, arrayForm } from "./bolt-boilerplate";

const getSet = { 
    get(target, property) { 
        if (target.decodeStr.indexOf(property) != -1) return Reflect.get(target, "dimArr")[target.decodeStr.indexOf(property)];
        else switch (String(property)) {
            case 'length': return Reflect.get(target, "length");
            case 'dimArr': return Reflect.get(target, "dimArr");
            case 'unitVector': 
                if (target instanceof vec2) return new vec2(target.dimArr[0]!/target.length, target.dimArr[1]!/target.length);
                else if (target instanceof vec3) return new vec3(target.dimArr[0]!/target.length, target.dimArr[1]!/target.length, target.dimArr[2]!/target.length);
                else if (target instanceof vec4) return new vec4(target.dimArr[0]!/target.length, target.dimArr[1]!/target.length, target.dimArr[2]!/target.length, target.dimArr[3]!/target.length);
                else return null;             
        }
        return null;
    }, 
    set(target, property, value) {
        if (target.decodeStr.indexOf(String(property)) != -1) {
            let T = Reflect.set(target.dimArr, target.decodeStr.indexOf(String(property)), value), s = 0;
            for (let i = 0; i < target.dimArr.length; i++) { s+=target.dimArr[i]**2 };
            target.length = Math.sqrt(s);
            return T;
        }; 
        return false;
    } 
}

const arrayGetSet = {
    get(target, property) {
        if (isIdx(property)) return Reflect.get(target, "vectorArray")[Number(property)];
        else switch (property) {
            case 'length': return (Reflect.get(target, "vectorArray")).length;
            case 'type': return Reflect.get(target, "type");
            case 'push': return function() { target[property].apply(target, arguments) };
            case 'pop': return function() { return target.pop() };
            case 'slice': return function() { return target.slice(arguments) };
            case 'arrayForm': return function() { return arrayForm(target) };
        }
    },
    set(target, property, value) {
        return false;
    },
}

class Vector {
    dimArr!: number[];
    decodeStr: string;
    length: number;
    x?: number;
    y?: number;
    z?: number;
    w?: number;
    unitVector!: vec2 | vec3 | vec4;
    constructor() {
        this.dimArr = [];
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

export class VectorArray {
    length!: number;
    vectorArray: Vector[];
    type: string;
    constructor(initialValues: vec2[] | vec3[] | vec4[]) {
        if (!this.checkDims(initialValues)) throw new Error("Error attemtping to create new Bolt.VectorArray: dimension mismatch")
        this.type = this.getType(initialValues[0]!)!;
        this.vectorArray = initialValues as Vector[];
        return new Proxy(this, arrayGetSet);
    }
    push(vector: vec2 | vec3 | vec4): void {
        if ((vector instanceof vec2 && this.type == 'vec2') || (vector instanceof vec3 && this.type == 'vec3') || (vector instanceof vec4 && this.type == 'vec4')) {
            this.vectorArray.push(vector as Vector); 
        }
        else throw new Error("Error attemtping to append to Bolt.VectorArray: dimension mismatch");
    }
    pop(): any {
        return this.castType(this.vectorArray.pop());
    }
    slice(start: number, end: number | undefined): any {
        return this.castType(this.vectorArray.slice(start, end));
    }
    arrayForm(): number[] { return []; }
    private castType(vec: Vector | Vector[] | undefined): vec2 | vec3 | vec4 | vec2[] | vec3[] | vec4[] | undefined {
        if (Array.isArray(vec)) {
            if (this.type == 'vec2')return vec as vec2[];
            else if (this.type == 'vec3') return vec as vec3[];
            else if (this.type == 'vec4') return vec as vec4[];
        } else {
            if (this.type == 'vec2') return vec as vec2;
            else if (this.type == 'vec3') return vec as vec3;
            else if (this.type == 'vec4') return vec as vec4;
        }
        return undefined;
    }
    private checkDims(vectorArray: Vector[]): boolean {
        for (let i = 1; i < vectorArray.length; i++) { if (vectorArray[0]!.dimArr.length != vectorArray[i]!.dimArr.length) return false };
        return true;
    }
    private getType(T: Vector) { return (T instanceof vec2) ? 'vec2' : (T instanceof vec3) ? 'vec3' : (T instanceof vec4) ? 'vec4' : undefined; }
}