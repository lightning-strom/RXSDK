export abstract class IPlugin {
    abstract name(): string;
    init?(a24: ESObject, b24: ESObject): void;
}
class PluginManager {
    private providers = new Map<string, IPlugin>();
    register(y23: IPlugin): void {
        const z23 = y23.name();
        if (!z23) {
            throw new Error("plugin name() must not be null");
        }
        if (this.providers.has(z23)) {
            console.warn(`plugin ${z23} allready exists`);
            return;
        }
        this.providers.set(z23, y23);
        console.log(`${z23} installed`);
    }
    getPlugin(x23: string): IPlugin | undefined {
        return this.providers.get(x23);
    }
    getAllPlugins(): Map<string, IPlugin> {
        return this.providers;
    }
}
export const pluginProvider = new PluginManager();
export function RegisterPlugin() {
    return function (v23: new () => IPlugin) {
        const w23 = new v23();
        pluginProvider.register(w23);
    };
}
export function applyMixins1(q23: any, r23: any[]) {
    r23.forEach((s23) => {
        Object.getOwnPropertyNames(s23.prototype).forEach((u23) => {
            if (u23 !== "constructor") {
                q23.prototype[u23] = s23.prototype[u23];
            }
        });
        Object.getOwnPropertyNames(s23).forEach((t23) => {
            if (t23 !== "prototype" && t23 !== "constructor") {
                q23[t23] = s23[t23];
            }
        });
    });
}
export function applyMixins(l23: new (...args: any[]) => any, m23: Array<new (...args: any[]) => any>) {
    for (const n23 of m23) {
        for (const p23 of Object.getOwnPropertyNames(n23.prototype)) {
            if (p23 !== 'constructor') {
                Object.defineProperty(l23.prototype, p23, Object.getOwnPropertyDescriptor(n23.prototype, p23)!);
            }
        }
        for (const o23 of Object.getOwnPropertyNames(n23)) {
            if (o23 !== 'prototype' && o23 !== 'constructor') {
                Object.defineProperty(l23, o23, Object.getOwnPropertyDescriptor(n23, o23)!);
            }
        }
    }
}
