export declare abstract class IPlugin {
    abstract name(): string;
    init?(a24: ESObject, b24: ESObject): void;
}
declare class PluginManager {
    private providers;
    register(y23: IPlugin): void;
    getPlugin(x23: string): IPlugin | undefined;
    getAllPlugins(): Map<string, IPlugin>;
}
export declare const pluginProvider: PluginManager;
export declare function RegisterPlugin(): (target: new () => IPlugin) => void;
export declare function applyMixins1(q23: any, r23: any[]): void;
export declare function applyMixins(l23: new (...args: any[]) => any, m23: Array<new (...args: any[]) => any>): void;
export {};
