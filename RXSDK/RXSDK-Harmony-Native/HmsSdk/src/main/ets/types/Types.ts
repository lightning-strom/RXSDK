const instanceMap = new WeakMap();

export abstract class Singleton<T> {
  static getInstance<T>(this: new (...args: any[]) => T, ...args: any[]): T {
    if (!instanceMap.has(this)) {
      instanceMap.set(this, new this(...args));
    }
    return instanceMap.get(this)!;
  }
}

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
        Object.create(null)
      );
    });
  });
}
