import { RXRequest, RequestMethod } from '../net/RXRequest'
import {
  CreateGameAreaParams,
  CreateGameCharacterParams,
  DeleteGameCharacterParams,
  IGameAreaApi,
  RCallback,
  RXCallback,
  RXResult,
  UpdateGameAreaParams,
  UpdateGameCharacterParams
} from '../types/Index'
import Passport from '../base/Passport';


class GameArea implements IGameAreaApi {
  // 查询角色信息
  searchGameAccount(callback: RCallback) {
    return RXRequest.request({
      path: 'v1/report/sdk/cp_role/game_character',
      data: {},
      method: RequestMethod.GET,
    }, callback);
  }

  searchGameAreaInfo(areaId: string | null, callback: RCallback) {
    return RXRequest.request({
      path: 'v1/report/sdk/cp/game_area',
      data: { area_id: areaId },
      method: RequestMethod.GET,
    }, callback);
  }

  // 查询区服列表信息
  searchGameAreaListInfo(callback: RCallback<object[]>) {
    return RXRequest.request({
      path: 'v1/report/sdk/cp/game_area/list',
      method: RequestMethod.GET,
    }, callback);
  }

  // 修改游戏区服信息
  updateGameAreaInfo(params: UpdateGameAreaParams, callback: RCallback) {
    return RXRequest.request({
      path: 'v1/report/sdk/cp/game_area',
      data: params,
      method: RequestMethod.PUT,
    }, callback);
  }

  // 创建游戏区服
  createGameArea(params: CreateGameAreaParams, callback: RCallback) {
    return RXRequest.request({
      path: 'v1/report/sdk/cp/game_area',
      data: params,
      method: RequestMethod.POST,
    }, callback);
  }

  // 删除游戏区服
  deleteGameArea(areaId: string, callback: RCallback) {
    return RXRequest.request({
      path: 'v1/report/sdk/cp/game_area',
      data: { area_id: areaId },
      method: RequestMethod.DELETE,
    }, callback);
  }

  // 创建游戏角色
  createGameCharacter(params: CreateGameCharacterParams, callback: RCallback) {
    return RXRequest.request({
      path: 'v1/report/sdk/cp/game_character',
      data: params,
      method: RequestMethod.POST,
    }, callback);
  }

  // 修改游戏角色信息
  updateGameCharacterInfo(params: UpdateGameCharacterParams, callback: RCallback) {
    return RXRequest.request({
      path: 'v1/report/sdk/cp/game_character',
      data: params,
      method: RequestMethod.PUT,
    }, callback);
  }

  // 删除游戏角色
  deleteGameCharacter(params: DeleteGameCharacterParams, callback: RCallback) {
    return RXRequest.request({
      path: 'v1/report/sdk/cp/game_character',
      data: params,
      method: RequestMethod.DELETE,
    }, callback);
  }

  // 查询账号下角色信息列表
  searchGameCharacterListInfo(cpUserId: string, callback: RXCallback<RXResult<object[]>>) {
    return RXRequest.request({
      path: 'v1/report/sdk/cp/game_character/account',
      data: { cp_user_id: cpUserId, rx_openid: this.getOpenid() },
      method: RequestMethod.GET,
    }, callback);
  }

  // 查询账号下某个区服的角色信息列表
  searchGameCharacterListInArea(cpUserId: string, areaId: string, callback: RXCallback<RXResult<object[]>>) {
    return RXRequest.request({
      path: 'v1/report/sdk/cp/game_character/account/area',
      data: { cp_user_id: cpUserId, area_id: areaId, rx_openid: this.getOpenid() },
      method: RequestMethod.GET,
    }, callback);
  }

  // 查询具体角色信息
  searchGameCharacterInfo(cpUserId: string, areaId: string, characterId: string, callback: RCallback) {
    return RXRequest.request({
      path: 'v1/report/sdk/cp/game_character/account/area/character',
      data: {
        cp_user_id: cpUserId,
        area_id: areaId,
        character_id: characterId,
        rx_openid: this.getOpenid()
      },
      method: RequestMethod.GET,
    }, callback);
  }

  private getOpenid(): string {
    return Passport.openid;
  }
}

export default new GameArea()