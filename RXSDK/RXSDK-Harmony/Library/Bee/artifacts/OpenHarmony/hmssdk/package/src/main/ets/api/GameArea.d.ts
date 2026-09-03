import { CreateGameAreaParams, CreateGameCharacterParams, DeleteGameCharacterParams, IGameAreaApi, RCallback, RXCallback, RXResult, UpdateGameAreaParams, UpdateGameCharacterParams } from '../types/Index';
declare class GameArea implements IGameAreaApi {
    searchGameAccount(l1: RCallback): Promise<RXResult<object>>;
    searchGameAreaInfo(j1: string | null, k1: RCallback): Promise<RXResult<object>>;
    searchGameAreaListInfo(i1: RCallback<object[]>): Promise<RXResult<object[]>>;
    updateGameAreaInfo(g1: UpdateGameAreaParams, h1: RCallback): Promise<RXResult<object>>;
    createGameArea(e1: CreateGameAreaParams, f1: RCallback): Promise<RXResult<object>>;
    deleteGameArea(c1: string, d1: RCallback): Promise<RXResult<object>>;
    createGameCharacter(a1: CreateGameCharacterParams, b1: RCallback): Promise<RXResult<object>>;
    updateGameCharacterInfo(y: UpdateGameCharacterParams, z: RCallback): Promise<RXResult<object>>;
    deleteGameCharacter(w: DeleteGameCharacterParams, x: RCallback): Promise<RXResult<object>>;
    searchGameCharacterListInfo(u: string, v: RXCallback<RXResult<object[]>>): Promise<RXResult<unknown>>;
    searchGameCharacterListInArea(r: string, s: string, t: RXCallback<RXResult<object[]>>): Promise<RXResult<unknown>>;
    searchGameCharacterInfo(n: string, o: string, p: string, q: RCallback): Promise<RXResult<object>>;
    private getOpenid;
}
declare const _default: GameArea;
export default _default;
