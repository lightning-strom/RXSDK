package com.ruixue.openapi;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.net.HttpMethod;
import com.ruixue.net.RXRequest;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/12/30
 */
class GameAreaApi implements IGameAreaApi {

    static class Single {
        final static GameAreaApi INSTANCE = new GameAreaApi();
    }

    public static GameAreaApi getInstance() {
        return Single.INSTANCE;
    }

    // ----------------------------------游戏区服接口----------------------------------
    // 查询游戏区服信息
    @Override
    public void searchGameAreaInfo(String areaId, RXJSONCallback callback) {
        Map<String, Object> params = new HashMap<>();
        params.put("area_id", areaId);

        RXRequest.create("v1/report/sdk/cp/game_area")
                .setMethod(HttpMethod.GET)
                .setBody(params)
                .setCallback(callback)
                .execRequestAsync();
    }

    // 查询区服列表信息
    @Override
    public void searchGameAreaListInfo(RXRequestCallback callback) {
        RXRequest.create("v1/report/sdk/cp/game_area/list")
                .setMethod(HttpMethod.GET)
                .setRestfulData(false)
                .setCallback(new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        callback.onResponse(data);
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        callback.onResponse(cause);
                    }
                })
                .execRequestAsync();
    }

    // 修改游戏区服信息
    //    {
    //  "area_id": "string",
    //  "area_name": "string",
    //  "area_status": "string",
    //  "area_type": "string",
    //  "extension": [
    //    0
    //  ]
    //}
    @Override
    public void updateGameAreaInfo(String areaId, String areaName, String areaStatus, String areaType, Map<String, Object> extension, RXJSONCallback callback) {
        Map<String, Object> params = new HashMap<>();
        params.put("area_id", areaId);
        params.put("area_name", areaName);
        params.put("area_status", areaStatus);
        params.put("area_type", areaType);
        if (null != extension)
            params.put("extension", extension);

        RXRequest.create("v1/report/sdk/cp/game_area")
                .setMethod(HttpMethod.PUT)
                .setBody(params)
                .setCallback(callback)
                .execRequestAsync();
    }

    // 创建游戏区服
//    {
//  "area_id": "string",
//  "area_name": "string",
//  "area_status": "string",
//  "area_type": "string",
//  "extension": [
//    0
//  ]
//}
    @Override
    public void createGameArea(String areaId, String areaName, String areaStatus, String areaType, Map<String, Object> extension, RXJSONCallback callback) {
        Map<String, Object> params = new HashMap<>();
        params.put("area_id", areaId);
        params.put("area_name", areaName);
        params.put("area_status", areaStatus);
        params.put("area_type", areaType);
        if (null != extension)
            params.put("extension", extension);

        RXRequest.create("v1/report/sdk/cp/game_area")
                .setMethod(HttpMethod.POST)
                .setBody(params)
                .setCallback(callback)
                .execRequestAsync();
    }

    // 删除游戏区服
    @Override
    public void deleteGameArea(String areaId, RXJSONCallback callback) {
        Map<String, Object> params = new HashMap<>();
        params.put("area_id", areaId);

        RXRequest.create("v1/report/sdk/cp/game_area")
                .setMethod(HttpMethod.DELETE)
                .setBody(params)
                .setCallback(callback)
                .execRequestAsync();
    }


    // ----------------------------------游戏角色----------------------------------

    // 创建游戏角色
    //    {
    //  "area_id": "string",
    //  "character_faction": "string",
    //  "character_id": "string",
    //  "character_level": "string",
    //  "character_name": "string",
    //  "character_profession": "string",
    //  "character_status": "string",
    //  "character_type": "string",
    //  "character_vip_level": "string",
    //  "cp_user_id": "string",
    //  "extension": {
    //    "property1": "string",
    //    "property2": "string"
    //  },
    //  "rx_openid": "string"
    //}
    @Override
    public void createGameCharacter(
            String areaId,                // 区服 ID
            String characterName,         // 角色名称
            String characterLevel,        // 角色等级
            String characterFaction,      // 角色阵营
            String characterProfession,   // 角色职业
            String characterStatus,       // 角色状态
            String characterType,         // 角色类型
            String characterVipLevel,     // 角色 VIP 等级
            String cpUserId,              // CP 用户 ID
            Map<String, Object> extension,// 扩展字段
            RXJSONCallback callback       // 回调接口
    ) {
        Map<String, Object> params = new HashMap<>();
        params.put("area_id", areaId);
        params.put("character_name", characterName);
        params.put("character_level", characterLevel);
        params.put("character_faction", characterFaction);
        params.put("character_profession", characterProfession);
        params.put("character_status", characterStatus);
        params.put("character_type", characterType);
        params.put("character_vip_level", characterVipLevel);
        params.put("cp_user_id", cpUserId);
        params.put("rx_openid", RuiXueSdk.getOpenid()); // 从 SDK 获取 OpenID

        // 添加扩展字段（如果存在）
        if (extension != null && !extension.isEmpty()) {
            params.put("extension", extension);
        }

        RXRequest.create("v1/report/sdk/cp/game_character")
                .setMethod(HttpMethod.POST) // 创建操作通常使用 POST 方法
                .setBody(params)
                .setCallback(new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        RXSdkAnalytics.getInstance().trackEvent(ISdkEvent.Event.CREATE_GAME_ROLE, data);
                        RXSdkKwaiAnalytics.getInstance().trackEvent(ISdkEvent.Event.CREATE_GAME_ROLE, data);
                        if (callback != null)
                            callback.onSuccess(data);
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        if (callback != null)
                            callback.onSuccess(cause);
                    }
                })
                .execRequestAsync();

    }

    //修改游戏角色信息
//    {
//  "area_id": "string",
//  "character_faction": "string",
//  "character_id": "string",
//  "character_level": "string",
//  "character_name": "string",
//  "character_profession": "string",
//  "character_status": "string",
//  "character_type": "string",
//  "character_vip_level": "string",
//  "cp_user_id": "string",
//  "extension": {
//    "property1": "string",
//    "property2": "string"
//  },
//  "rx_openid": "string"
//}
    @Override
    public void updateGameCharacterInfo(String characterId, String areaId, String characterFaction, String characterLevel, String characterName, String characterProfession, String characterStatus, String characterType, String characterVipLevel, String cpUserId, Map<String, Object> extension, RXJSONCallback callback) {
        // 构建参数 Map
        Map<String, Object> params = new HashMap<>();
        params.put("character_id", characterId);
        params.put("area_id", areaId);
        params.put("character_faction", characterFaction);
        params.put("character_level", characterLevel);
        params.put("character_name", characterName);
        params.put("character_profession", characterProfession);
        params.put("character_status", characterStatus);
        params.put("character_type", characterType);
        params.put("character_vip_level", characterVipLevel);
        params.put("cp_user_id", cpUserId);
        params.put("rx_openid", RuiXueSdk.getOpenid());

        // 合并扩展字段
        if (extension != null) {
            params.put("extension", extension);
        }

        // 发送请求
        RXRequest.create("v1/report/sdk/cp/game_character")
                .setMethod(HttpMethod.POST)
                .setBody(params)
                .setCallback(callback)
                .execRequestAsync();
    }

    // 删除游戏角色
//    {
//  "area_id": "string",
//  "character_id": "string",
//  "cp_user_id": "string",
//  "rx_openid": "string"
//}
    @Override
    public void deleteGameCharacter(String areaId, String characterId, String cpUserId, RXJSONCallback callback) {
        Map<String, Object> params = new HashMap<>();
        params.put("area_id", areaId);
        params.put("character_id", characterId);
        params.put("cp_user_id", cpUserId);
        params.put("rx_openid", RuiXueSdk.getOpenid());
        RXRequest.create("v1/report/sdk/cp/game_character")
                .setMethod(HttpMethod.DELETE)
                .setBody(params)
                .setCallback(callback)
                .execRequestAsync();
    }

    // 查询账号下角色信息列表
    @Override
    public void searchGameCharacterListInfo(String cpUserId, RXRequestCallback callback) {
        Map<String, Object> params = new HashMap<>();
        params.put("rx_openid", RuiXueSdk.getOpenid());
        params.put("cp_user_id", cpUserId);

        RXRequest.create("v1/report/sdk/cp/game_character/account")
                .setMethod(HttpMethod.GET)
                .setBody(params)
                .setRestfulData(false)
                .setCallback(new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        if (callback != null)
                            callback.onResponse(data);
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        if (callback != null)
                            callback.onResponse(cause);
                    }
                })
                .execRequestAsync();
    }

    // 查询账号下某个区服下的角色信息列表
    @Override
    public void searchGameCharacterListInArea(String cpUserId, String areaId, RXRequestCallback callback) {
        Map<String, Object> params = new HashMap<>();
        params.put("rx_openid", RuiXueSdk.getOpenid());
        params.put("cp_user_id", cpUserId);
        params.put("area_id", areaId);

        RXRequest.create("v1/report/sdk/cp/game_character/account/area")
                .setMethod(HttpMethod.GET)
                .setBody(params)
                .setRestfulData(false)
                .setCallback(new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        if (callback != null)
                            callback.onResponse(data);
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        if (callback != null)
                            callback.onResponse(cause);
                    }
                })
                .execRequestAsync();
    }

    // 查询具体角色信息
    @Override
    public void searchGameCharacterInfo(String cpUserId, String areaId, String characterId, RXJSONCallback callback) {
        Map<String, Object> params = new HashMap<>();
        params.put("rx_openid", RuiXueSdk.getOpenid());
        params.put("cp_user_id", cpUserId);
        params.put("area_id", areaId);
        params.put("character_id", characterId);

        RXRequest.create("v1/report/sdk/cp/game_character/account/area/character")
                .setMethod(HttpMethod.GET)
                .setBody(params)
                .setCallback(callback)
                .execRequestAsync();
    }
}
