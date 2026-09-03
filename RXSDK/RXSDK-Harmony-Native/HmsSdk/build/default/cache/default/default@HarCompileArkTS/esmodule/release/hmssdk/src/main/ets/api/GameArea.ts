import { RXRequest, RequestMethod } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import type { CreateGameAreaParams, CreateGameCharacterParams, DeleteGameCharacterParams, IGameAreaApi, RCallback, RXCallback, RXResult, UpdateGameAreaParams, UpdateGameCharacterParams } from '../types/Index';
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
class GameArea implements IGameAreaApi {
    searchGameAccount(l1: RCallback) {
        return RXRequest.request({
            path: 'v1/report/sdk/cp_role/game_character',
            data: {},
            method: RequestMethod.GET,
        }, l1);
    }
    searchGameAreaInfo(j1: string | null, k1: RCallback) {
        return RXRequest.request({
            path: 'v1/report/sdk/cp/game_area',
            data: { area_id: j1 },
            method: RequestMethod.GET,
        }, k1);
    }
    searchGameAreaListInfo(i1: RCallback<object[]>) {
        return RXRequest.request({
            path: 'v1/report/sdk/cp/game_area/list',
            method: RequestMethod.GET,
        }, i1);
    }
    updateGameAreaInfo(g1: UpdateGameAreaParams, h1: RCallback) {
        return RXRequest.request({
            path: 'v1/report/sdk/cp/game_area',
            data: g1,
            method: RequestMethod.PUT,
        }, h1);
    }
    createGameArea(e1: CreateGameAreaParams, f1: RCallback) {
        return RXRequest.request({
            path: 'v1/report/sdk/cp/game_area',
            data: e1,
            method: RequestMethod.POST,
        }, f1);
    }
    deleteGameArea(c1: string, d1: RCallback) {
        return RXRequest.request({
            path: 'v1/report/sdk/cp/game_area',
            data: { area_id: c1 },
            method: RequestMethod.DELETE,
        }, d1);
    }
    createGameCharacter(a1: CreateGameCharacterParams, b1: RCallback) {
        return RXRequest.request({
            path: 'v1/report/sdk/cp/game_character',
            data: a1,
            method: RequestMethod.POST,
        }, b1);
    }
    updateGameCharacterInfo(y: UpdateGameCharacterParams, z: RCallback) {
        return RXRequest.request({
            path: 'v1/report/sdk/cp/game_character',
            data: y,
            method: RequestMethod.PUT,
        }, z);
    }
    deleteGameCharacter(w: DeleteGameCharacterParams, x: RCallback) {
        return RXRequest.request({
            path: 'v1/report/sdk/cp/game_character',
            data: w,
            method: RequestMethod.DELETE,
        }, x);
    }
    searchGameCharacterListInfo(u: string, v: RXCallback<RXResult<object[]>>) {
        return RXRequest.request({
            path: 'v1/report/sdk/cp/game_character/account',
            data: { cp_user_id: u, rx_openid: this.getOpenid() },
            method: RequestMethod.GET,
        }, v);
    }
    searchGameCharacterListInArea(r: string, s: string, t: RXCallback<RXResult<object[]>>) {
        return RXRequest.request({
            path: 'v1/report/sdk/cp/game_character/account/area',
            data: { cp_user_id: r, area_id: s, rx_openid: this.getOpenid() },
            method: RequestMethod.GET,
        }, t);
    }
    searchGameCharacterInfo(n: string, o: string, p: string, q: RCallback) {
        return RXRequest.request({
            path: 'v1/report/sdk/cp/game_character/account/area/character',
            data: {
                cp_user_id: n,
                area_id: o,
                character_id: p,
                rx_openid: this.getOpenid()
            },
            method: RequestMethod.GET,
        }, q);
    }
    private getOpenid(): string {
        return Passport.openid;
    }
}
export default new GameArea();
