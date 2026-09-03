import { RCallback } from "../types/Index";
type queryType = {
    type: string;
    format?: string;
};
export default class Update {
    private static handlePath;
    private static handleUpdateResp;
    static updateGameVersion(k8: Record<string, any>, l8: RCallback): Promise<any>;
    static checkAppUpdate(z7: string, a8: string, b8?: Record<string, any>, c8?: RCallback, d8?: string, e8?: queryType): Promise<any>;
    static checkActivityUpdate(n7: string, o7: string, p7: string, q7: Record<string, any>, r7?: RCallback, s7?: string, t7?: queryType): Promise<any>;
    static checkGameUpdate(b7: string, c7: string, d7: string, e7: Record<string, any>, f7?: RCallback, g7?: string, h7?: queryType): Promise<any>;
}
export {};
