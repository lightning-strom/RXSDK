export  default class Func {
  static async wrapCall<T>(fn: (args: string) => Promise<string>, args: string): Promise<string> {
    try {
      const parsed = JSON.parse(args);
      const result = await fn(parsed);
      return JSON.stringify(result);
    } catch (e) {
      return JSON.stringify({ error: e instanceof Error ? e.message : String(e) });
    }
  }

  static  async call<T>(fn: () => Promise<T>): Promise<string> {
    try {
      const ret = await fn();
      return JSON.stringify(ret);
    } catch (e) {
      return JSON.stringify(e);
    }
  }


  public static getFunctionName(func: Function): string {

    return func.toString().match(/function\s*([^(]*)\(/)[1];
  }
}