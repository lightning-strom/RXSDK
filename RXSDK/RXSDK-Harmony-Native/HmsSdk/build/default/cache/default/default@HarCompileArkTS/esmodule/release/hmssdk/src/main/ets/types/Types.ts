const instanceMap = new WeakMap();
export abstract class Singleton<T> {
    static getInstance<m171>(this: new (...o171: any[]) => m171, ...o171: any[]): m171 {
        if (!instanceMap.has(this)) {
            instanceMap.set(this, new this(...o171));
        }
        return instanceMap.get(this)!;
    }
}
export function applyMixins(i171: any, j171: any[]) {
    j171.forEach(k171 => {
        Object.getOwnPropertyNames(k171.prototype).forEach(l171 => {
            Object.defineProperty(i171.prototype, l171, Object.getOwnPropertyDescriptor(k171.prototype, l171) ||
                Object.create(null));
        });
    });
}
