export class Reflection {
    private static classMap: {
        [key: string]: any;
    } = {};
    static registerClass(g25: string, h25: any) {
        this.classMap[g25] = h25;
    }
    static newInstance<c25 = any>(d25: string, ...e25: any[]): c25 | null {
        const f25 = this.classMap[d25];
        if (!f25) {
            console.warn(`Class ${d25} not found in registry`);
            return null;
        }
        return new f25(...e25) as c25;
    }
    static getField(a25: any, b25: string): any {
        if (a25 && b25 in a25) {
            return a25[b25];
        }
        console.warn(`Field ${b25} not found in object`);
        return undefined;
    }
    static setField(x24: any, y24: string, z24: any): boolean {
        if (x24) {
            x24[y24] = z24;
            return true;
        }
        return false;
    }
    static invokeMethod(u24: any, v24: string, ...w24: any[]): any {
        if (u24 && typeof u24[v24] === "function") {
            return u24[v24](...w24);
        }
        console.warn(`Method ${v24} not found in object`);
        return undefined;
    }
}
