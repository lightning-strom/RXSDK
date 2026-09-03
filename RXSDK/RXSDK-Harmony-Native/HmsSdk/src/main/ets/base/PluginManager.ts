export abstract class IPlugin {
  abstract name(): string;

  init?(context: ESObject, params: ESObject): void;
}

class PluginManager {
  private providers = new Map<string, IPlugin>();

  register(client: IPlugin): void {
    const pluginName = client.name();
    if (!pluginName) {
      throw new Error("plugin name() must not be null");
    }
    if (this.providers.has(pluginName)) {
      console.warn(`plugin ${pluginName} allready exists`);
      return;
    }
    this.providers.set(pluginName, client);
    console.log(`${pluginName} installed`);
  }

  getPlugin(pluginName: string): IPlugin | undefined {
    return this.providers.get(pluginName);
  }

  getAllPlugins(): Map<string, IPlugin> {
    return this.providers;
  }
}


export const pluginProvider = new PluginManager();

export function RegisterPlugin() {
  return function (target: new () => IPlugin) {
    const instance = new target();
    pluginProvider.register(instance);
  };
}


export function applyMixins1(target: any, mixins: any[]) {
  mixins.forEach((mixin) => {
     Object.getOwnPropertyNames(mixin.prototype).forEach((propName) => {
       if (propName !== "constructor") {
        target.prototype[propName] = mixin.prototype[propName];
      }
    });

     Object.getOwnPropertyNames(mixin).forEach((propName) => {
      if (propName !== "prototype" && propName !== "constructor") {
        target[propName] = mixin[propName];
      }
    });
  });
}

export function applyMixins(
  target: new (...args: any[]) => any,
  mixins: Array<new (...args: any[]) => any>
) {
  for (const mixin of mixins) {
    for (const key of Object.getOwnPropertyNames(mixin.prototype)) {
      if (key !== 'constructor') {
        Object.defineProperty(
          target.prototype,
          key,
          Object.getOwnPropertyDescriptor(mixin.prototype, key)!
        );
      }
    }
    for (const key of Object.getOwnPropertyNames(mixin)) {
      if (key !== 'prototype' && key !== 'constructor') {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(mixin, key)!
        );
      }
    }
  }
}
