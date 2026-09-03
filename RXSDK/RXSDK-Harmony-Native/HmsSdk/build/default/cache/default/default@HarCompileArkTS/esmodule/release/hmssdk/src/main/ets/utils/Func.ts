export default class Func {
    static async wrapCall<h188>(i188: (args: string) => Promise<string>, j188: string): Promise<string> {
        try {
            const l188 = JSON.parse(j188);
            const m188 = await i188(l188);
            return JSON.stringify(m188);
        }
        catch (k188) {
            return JSON.stringify({ error: k188 instanceof Error ? k188.message : String(k188) });
        }
    }
    static async call<d188>(e188: () => Promise<d188>): Promise<string> {
        try {
            const g188 = await e188();
            return JSON.stringify(g188);
        }
        catch (f188) {
            return JSON.stringify(f188);
        }
    }
    public static getFunctionName(c188: Function): string {
        return c188.toString().match(/function\s*([^(]*)\(/)[1];
    }
}
