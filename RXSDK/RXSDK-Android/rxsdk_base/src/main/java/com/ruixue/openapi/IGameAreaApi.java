package com.ruixue.openapi;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;

import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: 游戏区服和角色相关 API 接口
 * @Author: ROC LEE
 * @Date: 2024/12/31
 */
public interface IGameAreaApi {

    /**
     * 查询游戏区服信息。
     * @param areaId   游戏区服的唯一标识符。例如："1001"。
     * @param callback 用于处理请求结果的回调对象。
     *                 示例用法：
     *                 <pre>
     *                                 RuiXueSdk.getApi().searchGameAreaInfo("1001", new RXRequestCallback() {
     *                                 @Override
     *                                 public void onResponse(JSONObject jsonObject) {
     *                                 // TODO: 处理业务逻辑
     *                                 }
     *                                 });
     *                                 </pre>
     */
    void searchGameAreaInfo(String areaId, RXJSONCallback callback);

    /**
     * 查询区服列表信息。
     * @param callback 用于处理请求结果的回调对象。
     *                 示例用法：
     *                 <pre>
     *                                 RuiXueSdk.getApi().searchGameAreaListInfo(new RXRequestCallback() {
     *                                 @Override
     *                                 public void onResponse(JSONObject jsonObject) {
     *                                 // TODO: 处理业务逻辑
     *                                 }
     *                                 });
     *                                 </pre>
     */
    void searchGameAreaListInfo(RXRequestCallback callback);

    /**
     * 修改游戏区服信息。
     * @param areaId     区服 ID。例如："1001"。如果为空表示修改所有相关区服。
     * @param areaName   区服名称。例如："一区"。
     * @param areaStatus 区服状态。例如："active" 或 "inactive"。
     * @param areaType   区服类型。例如："PVP" 或 "PVE"。
     * @param extension  扩展字段
     * @param callback   用于处理请求结果的回调对象。
     *                   示例用法：
     *                   <pre>
     *                                     RuiXueSdk.getApi().updateGameAreaInfo("1001", "新区服", "active", "PVP", List.of(1, 2, 3), new RXRequestCallback() {
     *                                     @Override
     *                                     public void onResponse(JSONObject jsonObject) {
     *                                     // TODO: 处理业务逻辑
     *                                     }
     *                                     });
     *                                     </pre>
     */
    void updateGameAreaInfo(String areaId, String areaName, String areaStatus, String areaType, Map<String, Object> extension, RXJSONCallback callback);

    /**
     * 创建游戏区服。
     * @param areaId     区服 ID。例如："1001"。
     * @param areaName   区服名称。例如："一区"。
     * @param areaStatus 区服状态。例如："active" 或 "inactive"。
     * @param areaType   区服类型。例如："PVP" 或 "PVE"。
     * @param extension  扩展字段
     * @param callback   用于处理请求结果的回调对象。
     *                   示例用法：
     *                   <pre>
     *                   RuiXueSdk.getApi().createGameArea("1002", "二区", "active", "PVE", List.of(4, 5, 6), new RXRequestCallback() {
     *                   @Override
     *                   public void onResponse(JSONObject jsonObject) {
     *                   // TODO: 处理业务逻辑
     *                   }
     *                   });
     *                   </pre>
     */
    void createGameArea(String areaId, String areaName, String areaStatus, String areaType, Map<String, Object> extension, RXJSONCallback callback);

    /**
     * 删除游戏区服。
     * @param areaId   游戏区服的唯一标识符。 此参数为必需，指定需要删除的区服。 例如："1001"。
     * @param callback 用于处理请求结果的回调对象。
     *                 示例用法：
     *                 <pre>
     *                                 RuiXueSdk.getApi().deleteGameArea("1001", new RXRequestCallback() {
     *                                 @Override
     *                                 public void onResponse(JSONObject jsonObject) {
     *                                 // TODO: 处理业务逻辑
     *                                 }
     *                                 });
     *                                 </pre>
     */
    void deleteGameArea(String areaId, RXJSONCallback callback);

    /**
     * 创建游戏角色。
     */
    void createGameCharacter(
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
    );

    /**
     * 更新游戏角色信息。
     * @param characterId         角色唯一标识。
     * @param areaId              区服 ID。
     * @param characterFaction    角色阵营（如：联盟、部落等）。
     * @param characterLevel      角色等级。
     * @param characterName       角色名称。
     * @param characterProfession 角色职业（如：战士、法师等）。
     * @param characterStatus     角色状态（如：在线、离线）。
     * @param characterType       角色类型（如：普通角色、VIP角色等）。
     * @param characterVipLevel   角色 VIP 等级。
     * @param cpUserId            开发者用户唯一标识。
     * @param extension           拓展字段，用于传递额外信息，键值对形式。
     * @param callback            回调接口，用于处理请求结果。
     */
    void updateGameCharacterInfo(
            String characterId,
            String areaId,
            String characterFaction,
            String characterLevel,
            String characterName,
            String characterProfession,
            String characterStatus,
            String characterType,
            String characterVipLevel,
            String cpUserId,
            Map<String, Object> extension,
            RXJSONCallback callback
    );

    /**
     * 删除游戏角色。
     * @param characterId 角色唯一标识符。例如："char12345"。
     * @param callback    用于处理请求结果的回调对象。
     */
    void deleteGameCharacter(String areaId, String characterId, String cpUserId, RXJSONCallback callback);

    // 查询账号下角色信息列表
    void searchGameCharacterListInfo(String cpUserId, RXRequestCallback callback);

    // 查询账号下某个区服下的角色信息列表
    void searchGameCharacterListInArea(String cpUserId, String areaId, RXRequestCallback callback);

    // 查询具体角色信息
    void searchGameCharacterInfo(String cpUserId, String areaId, String characterId, RXJSONCallback callback);
}