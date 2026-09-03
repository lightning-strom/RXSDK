package com.ruixue.openapi.module;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXRequestCallback;

import java.util.Map;

/**
 * 游戏区服功能模块
 *
 * <p>
 * 提供游戏区服管理、角色管理等游戏区服相关功能。
 * </p>
 *
 * <p>
 * 调用方式：{@code RXSDK.getInstance().gameArea.接口名()}
 * </p>
 *
 * @author ROC LEE
 * @date 2026/1/19
 */
public class GameAreaModule {

    private final com.ruixue.openapi.RXSDK sdk;

    public GameAreaModule(com.ruixue.openapi.RXSDK sdk) {
        this.sdk = sdk;
    }

    /**
     * 查询游戏区服信息
     *
     * @param areaId   区服 ID
     * @param callback 回调接口
     */
    public void searchGameAreaInfo(@NonNull String areaId, @NonNull RXRequestCallback callback) {
        sdk.searchGameAreaInfo(areaId, callback);
    }

    /**
     * 查询区服列表信息
     *
     * @param callback 回调接口
     */
    public void searchGameAreaListInfo(@NonNull RXRequestCallback callback) {
        sdk.searchGameAreaListInfo(callback);
    }

    /**
     * 修改游戏区服信息
     *
     * @param areaId     区服 ID
     * @param areaName   区服名称
     * @param areaStatus 区服状态
     * @param areaType   区服类型
     * @param extension  扩展字段
     * @param callback   回调接口
     */
    public void updateGameAreaInfo(@NonNull String areaId, @Nullable String areaName, @Nullable String areaStatus,
            @Nullable String areaType, @Nullable Map<String, Object> extension, @NonNull RXRequestCallback callback) {
        sdk.updateGameAreaInfo(areaId, areaName, areaStatus, areaType, extension, callback);
    }

    /**
     * 创建游戏区服
     *
     * @param areaId     区服 ID
     * @param areaName   区服名称
     * @param areaStatus 区服状态
     * @param areaType   区服类型
     * @param extension  扩展字段
     * @param callback   回调接口
     */
    public void createGameArea(@NonNull String areaId, @NonNull String areaName, @NonNull String areaStatus,
            @NonNull String areaType, @Nullable Map<String, Object> extension, @NonNull RXRequestCallback callback) {
        sdk.createGameArea(areaId, areaName, areaStatus, areaType, extension, callback);
    }

    /**
     * 删除游戏区服
     *
     * @param areaId   区服 ID
     * @param callback 回调接口
     */
    public void deleteGameArea(@NonNull String areaId, @NonNull RXRequestCallback callback) {
        sdk.deleteGameArea(areaId, callback);
    }

    /**
     * 创建游戏角色
     *
     * @param areaId              区服 ID
     * @param characterName       角色名称
     * @param characterLevel      角色等级
     * @param characterFaction    角色阵营
     * @param characterProfession 角色职业
     * @param characterStatus     角色状态
     * @param characterType       角色类型
     * @param characterVipLevel   角色 VIP 等级
     * @param cpUserId            CP 用户 ID
     * @param extension           扩展字段
     * @param callback            回调接口
     */
    public void createGameCharacter(
            @NonNull String areaId,
            @NonNull String characterName,
            @NonNull String characterLevel,
            @Nullable String characterFaction,
            @Nullable String characterProfession,
            @Nullable String characterStatus,
            @Nullable String characterType,
            @Nullable String characterVipLevel,
            @NonNull String cpUserId,
            @Nullable Map<String, Object> extension,
            @NonNull RXRequestCallback callback) {
        sdk.createGameCharacter(
                areaId, characterName, characterLevel, characterFaction,
                characterProfession, characterStatus, characterType, characterVipLevel,
                cpUserId, extension, callback);
    }

    /**
     * 更新游戏角色信息
     *
     * @param characterId         角色 ID
     * @param areaId              区服 ID
     * @param characterFaction    角色阵营
     * @param characterLevel      角色等级
     * @param characterName       角色名称
     * @param characterProfession 角色职业
     * @param characterStatus     角色状态
     * @param characterType       角色类型
     * @param characterVipLevel   角色 VIP 等级
     * @param cpUserId            CP 用户 ID
     * @param extension           扩展字段
     * @param callback            回调接口
     */
    public void updateGameCharacterInfo(
            @NonNull String characterId,
            @Nullable String areaId,
            @Nullable String characterFaction,
            @Nullable String characterLevel,
            @Nullable String characterName,
            @Nullable String characterProfession,
            @Nullable String characterStatus,
            @Nullable String characterType,
            @Nullable String characterVipLevel,
            @NonNull String cpUserId,
            @Nullable Map<String, Object> extension,
            @NonNull RXRequestCallback callback) {
        sdk.updateGameCharacterInfo(
                characterId, areaId, characterFaction, characterLevel, characterName,
                characterProfession, characterStatus, characterType, characterVipLevel,
                cpUserId, extension, callback);
    }

    /**
     * 删除游戏角色
     *
     * @param areaId      区服 ID
     * @param characterId 角色 ID
     * @param cpUserId    CP 用户 ID
     * @param callback    回调接口
     */
    public void deleteGameCharacter(@NonNull String areaId, @NonNull String characterId, @NonNull String cpUserId,
            @NonNull RXRequestCallback callback) {
        sdk.deleteGameCharacter(areaId, characterId, cpUserId, callback);
    }

    /**
     * 查询账号下角色信息列表
     *
     * @param cpUserId CP 用户 ID
     * @param callback 回调接口
     */
    public void searchGameCharacterListInfo(@NonNull String cpUserId, @NonNull RXRequestCallback callback) {
        sdk.searchGameCharacterListInfo(cpUserId, callback);
    }

    /**
     * 查询账号下某个区服下的角色信息列表
     *
     * @param cpUserId CP 用户 ID
     * @param areaId   区服 ID
     * @param callback 回调接口
     */
    public void searchGameCharacterListInArea(@NonNull String cpUserId, @NonNull String areaId,
            @NonNull RXRequestCallback callback) {
        sdk.searchGameCharacterListInArea(cpUserId, areaId, callback);
    }

    /**
     * 查询具体角色信息
     *
     * @param cpUserId    CP 用户 ID
     * @param areaId      区服 ID
     * @param characterId 角色 ID
     * @param callback    回调接口
     */
    public void searchGameCharacterInfo(@NonNull String cpUserId, @NonNull String areaId, @NonNull String characterId,
            @NonNull RXRequestCallback callback) {
        sdk.searchGameCharacterInfo(cpUserId, areaId, characterId, callback);
    }
}
