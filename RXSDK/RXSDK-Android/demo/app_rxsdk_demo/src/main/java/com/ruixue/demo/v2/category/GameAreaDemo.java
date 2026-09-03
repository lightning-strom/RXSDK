package com.ruixue.demo.v2.category;

import static com.ruixue.demo.config.TestButtonConfig.ACCENT;
import static com.ruixue.demo.config.TestButtonConfig.DANGER;
import static com.ruixue.demo.config.TestButtonConfig.PRIMARY;

import android.app.Activity;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.demo.config.TestButtonConfig.ButtonGroup;
import com.ruixue.demo.gamearea.GameAreaConsoleHost;
import com.ruixue.demo.gamearea.GameAreaResultFormatter;
import com.ruixue.demo.gamearea.GameAreaTestFormData;
import com.ruixue.demo.utils.DemoUtils;
import com.ruixue.demo.v2.DemoCategory;
import com.ruixue.demo.v2.DemoManager;
import com.ruixue.qipai.R;

import org.json.JSONObject;

/**
 * 游戏区服 API 示例
 * <p>
 * 统一处理动态按钮面板和 XML 布局按钮的区服功能调用
 * <p>
 * <b>包含功能：</b>
 * <ul>
 *   <li><b>区服管理</b>: 创建、修改、删除、查询区服</li>
 *   <li><b>角色管理</b>: 创建、修改、删除角色</li>
 *   <li><b>角色查询</b>: 查询角色列表、角色详情</li>
 * </ul>
 *
 * @since 2.0
 * @see com.ruixue.RuiXueSdk#getApi() 获取 API 实例
 */
public class GameAreaDemo extends DemoCategory {

    private final GameAreaConsoleHost host;

    private interface JsonAction {
        void run(@NonNull GameAreaTestFormData formData, @NonNull RXJSONCallback callback);
    }

    private interface RequestAction {
        void run(@NonNull GameAreaTestFormData formData, @NonNull RXRequestCallback callback);
    }

    public GameAreaDemo(@NonNull Activity activity,
                        @NonNull DemoManager.ResultCallback callback,
                        @NonNull GameAreaConsoleHost host) {
        super(activity, callback);
        this.host = host;
    }

    @Override
    public String getName() {
        return "区服";
    }

    @Override
    public String getEmoji() {
        return "🎮";
    }

    @Override
    protected void registerButtons(ButtonGroup group) {
        group.addButton(button("create_area", "创建区服", PRIMARY, this::createGameArea));
        group.addButton(button("update_area", "修改区服", this::updateGameAreaInfo));
        group.addButton(button("delete_area", "删除区服", DANGER, this::confirmDeleteGameArea));
        group.addButton(button("search_area", "区服详情", this::searchGameAreaInfo));
        group.addButton(button("area_list", "区服列表", this::searchGameAreaListInfo));

        group.addButton(button("create_char", "创建角色", ACCENT, this::createGameCharacter));
        group.addButton(button("update_char", "修改角色", this::updateGameCharacterInfo));
        group.addButton(button("delete_char", "删除角色", DANGER, this::confirmDeleteGameCharacter));

        group.addButton(button("char_info", "角色详情", this::searchGameCharacterInfo));
        group.addButton(button("char_list", "角色列表", PRIMARY, this::searchGameCharacterListInfo));
        group.addButton(button("char_in_area", "区服角色", this::searchGameCharacterListInArea));
    }

    public boolean onClick(View v) {
        int id = v.getId();
        if (id == R.id.btn_create_game_area) {
            createGameArea();
        } else if (id == R.id.btn_update_game_area_info) {
            updateGameAreaInfo();
        } else if (id == R.id.btn_delete_game_area) {
            confirmDeleteGameArea();
        } else if (id == R.id.btn_search_game_area_info) {
            searchGameAreaInfo();
        } else if (id == R.id.btn_search_game_area_list_info) {
            searchGameAreaListInfo();
        } else if (id == R.id.btn_create_game_character) {
            createGameCharacter();
        } else if (id == R.id.btn_update_game_character_info) {
            updateGameCharacterInfo();
        } else if (id == R.id.btn_delete_game_character) {
            confirmDeleteGameCharacter();
        } else if (id == R.id.btn_search_game_character_list_info) {
            searchGameCharacterListInfo();
        } else if (id == R.id.btn_search_game_character_list_in_area) {
            searchGameCharacterListInArea();
        } else if (id == R.id.btn_search_game_character_info) {
            searchGameCharacterInfo();
        } else if (id == R.id.game_quick_area_flow) {
            runAreaFlow();
        } else if (id == R.id.game_quick_character_flow) {
            runCharacterFlow();
        } else {
            return false;
        }
        return true;
    }

    private void createGameArea() {
        executeJsonAction("创建区服", this::requestCreateGameArea);
    }

    private void requestCreateGameArea(@NonNull GameAreaTestFormData formData, @NonNull RXJSONCallback callback) {
        RuiXueSdk.getApi().createGameArea(
                formData.areaId, formData.areaName, formData.areaStatus, formData.areaType,
                formData.buildExtension(), callback);
    }

    private void updateGameAreaInfo() {
        executeJsonAction("修改区服", this::requestUpdateGameArea);
    }

    private void requestUpdateGameArea(@NonNull GameAreaTestFormData formData, @NonNull RXJSONCallback callback) {
        RuiXueSdk.getApi().updateGameAreaInfo(
                formData.areaId, formData.areaName, formData.areaStatus, formData.areaType,
                formData.buildExtension(), callback);
    }

    private void deleteGameArea() {
        executeJsonAction("删除区服", this::requestDeleteGameArea);
    }

    private void confirmDeleteGameArea() {
        DemoUtils.showConfirmDialog(activity,
                "确认删除区服",
                "将按当前区服 ID 删除区服数据，确认继续吗？",
                this::deleteGameArea);
    }

    private void requestDeleteGameArea(@NonNull GameAreaTestFormData formData, @NonNull RXJSONCallback callback) {
        RuiXueSdk.getApi().deleteGameArea(formData.areaId, callback);
    }

    private void searchGameAreaInfo() {
        executeJsonAction("区服详情", this::requestSearchGameAreaInfo);
    }

    private void requestSearchGameAreaInfo(@NonNull GameAreaTestFormData formData, @NonNull RXJSONCallback callback) {
        RuiXueSdk.getApi().searchGameAreaInfo(formData.areaId, callback);
    }

    private void searchGameAreaListInfo() {
        executeRequestAction("区服列表", this::requestSearchGameAreaListInfo);
    }

    private void requestSearchGameAreaListInfo(@NonNull GameAreaTestFormData formData, @NonNull RXRequestCallback callback) {
        RuiXueSdk.getApi().searchGameAreaListInfo(callback);
    }

    private void createGameCharacter() {
        executeJsonAction("创建角色", this::requestCreateCharacter);
    }

    private void requestCreateCharacter(@NonNull GameAreaTestFormData formData, @NonNull RXJSONCallback callback) {
        RuiXueSdk.getApi().createGameCharacter(
                formData.areaId, formData.characterName, formData.characterLevel,
                formData.characterFaction, formData.characterProfession, formData.characterStatus,
                formData.characterType, formData.characterVipLevel,
                formData.cpUserId, formData.buildExtension(), callback);
    }

    private void updateGameCharacterInfo() {
        executeJsonAction("修改角色", this::requestUpdateCharacter);
    }

    private void requestUpdateCharacter(@NonNull GameAreaTestFormData formData, @NonNull RXJSONCallback callback) {
        RuiXueSdk.getApi().updateGameCharacterInfo(
                formData.characterId, formData.areaId, formData.characterFaction, formData.characterLevel,
                formData.characterName, formData.characterProfession, formData.characterStatus,
                formData.characterType, formData.characterVipLevel,
                formData.cpUserId, formData.buildExtension(), callback);
    }

    private void deleteGameCharacter() {
        executeJsonAction("删除角色", this::requestDeleteCharacter);
    }

    private void confirmDeleteGameCharacter() {
        DemoUtils.showConfirmDialog(activity,
                "确认删除角色",
                "将按当前区服/角色/CP 用户 ID 删除角色数据，确认继续吗？",
                this::deleteGameCharacter);
    }

    private void requestDeleteCharacter(@NonNull GameAreaTestFormData formData, @NonNull RXJSONCallback callback) {
        RuiXueSdk.getApi().deleteGameCharacter(formData.areaId, formData.characterId, formData.cpUserId, callback);
    }

    private void searchGameCharacterListInfo() {
        executeRequestAction("角色列表", this::requestSearchCharacterList);
    }

    private void requestSearchCharacterList(@NonNull GameAreaTestFormData formData, @NonNull RXRequestCallback callback) {
        RuiXueSdk.getApi().searchGameCharacterListInfo(formData.cpUserId, callback);
    }

    private void searchGameCharacterListInArea() {
        executeRequestAction("区服角色", this::requestSearchCharacterInArea);
    }

    private void requestSearchCharacterInArea(@NonNull GameAreaTestFormData formData, @NonNull RXRequestCallback callback) {
        RuiXueSdk.getApi().searchGameCharacterListInArea(formData.cpUserId, formData.areaId, callback);
    }

    private void searchGameCharacterInfo() {
        executeJsonAction("角色详情", this::requestSearchCharacterInfo);
    }

    private void requestSearchCharacterInfo(@NonNull GameAreaTestFormData formData, @NonNull RXJSONCallback callback) {
        RuiXueSdk.getApi().searchGameCharacterInfo(formData.cpUserId, formData.areaId, formData.characterId, callback);
    }

    private void runAreaFlow() {
        host.clearFlowLog();
        host.appendFlowLog("区服测试流开始");
        executeFlowJson("区服测试流", "创建区服", this::requestCreateGameArea, () ->
                executeFlowJson("区服测试流", "区服详情", this::requestSearchGameAreaInfo, () ->
                        executeFlowJson("区服测试流", "修改区服", this::requestUpdateGameArea, () ->
                                executeFlowRequest("区服测试流", "区服列表", this::requestSearchGameAreaListInfo, () ->
                                        executeFlowJson("区服测试流", "删除区服", this::requestDeleteGameArea, () ->
                                                host.appendFlowLog("区服测试流完成"))))));
    }

    private void runCharacterFlow() {
        host.clearFlowLog();
        host.appendFlowLog("角色测试流开始");
        executeFlowJson("角色测试流", "创建角色", this::requestCreateCharacter, () ->
                executeFlowJson("角色测试流", "角色详情", this::requestSearchCharacterInfo, () ->
                        executeFlowJson("角色测试流", "修改角色", this::requestUpdateCharacter, () ->
                                executeFlowRequest("角色测试流", "角色列表", this::requestSearchCharacterList, () ->
                                        executeFlowRequest("角色测试流", "区服角色", this::requestSearchCharacterInArea, () ->
                                                executeFlowJson("角色测试流", "删除角色", this::requestDeleteCharacter, () ->
                                                        host.appendFlowLog("角色测试流完成")))))));
    }

    private void executeJsonAction(@NonNull String title, @NonNull JsonAction action) {
        GameAreaTestFormData formData = host.getFormData();
        action.run(formData, buildJsonCallback(title, null, null));
    }

    private void executeRequestAction(@NonNull String title, @NonNull RequestAction action) {
        GameAreaTestFormData formData = host.getFormData();
        action.run(formData, buildRequestCallback(title, null, null));
    }

    private void executeFlowJson(@NonNull String flowName,
                                 @NonNull String title,
                                 @NonNull JsonAction action,
                                 @Nullable Runnable next) {
        GameAreaTestFormData formData = host.getFormData();
        action.run(formData, buildJsonCallback(title, flowName, next));
    }

    private void executeFlowRequest(@NonNull String flowName,
                                    @NonNull String title,
                                    @NonNull RequestAction action,
                                    @Nullable Runnable next) {
        GameAreaTestFormData formData = host.getFormData();
        action.run(formData, buildRequestCallback(title, flowName, next));
    }

    @NonNull
    private RXJSONCallback buildJsonCallback(@NonNull String title,
                                             @Nullable String flowName,
                                             @Nullable Runnable next) {
        return new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                String raw = data != null ? data.toString() : "成功";
                showResult(raw);
                host.renderResult(GameAreaResultFormatter.fromJson(title, data, false));
                if (flowName != null) {
                    host.appendFlowLog(flowName + " - " + title + " 成功");
                }
                if (next != null) {
                    next.run();
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                showResult("失败: " + cause);
                host.renderResult(GameAreaResultFormatter.fromJson(title, cause, true));
                if (flowName != null) {
                    host.appendFlowLog(flowName + " - " + title + " 失败");
                }
            }
        };
    }

    @NonNull
    private RXRequestCallback buildRequestCallback(@NonNull String title,
                                                   @Nullable String flowName,
                                                   @Nullable Runnable next) {
        return new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject json) {
                boolean error = json.optInt("code") != 0;
                if (error) {
                    showResult("错误: " + json);
                } else {
                    showResult(json.toString());
                }
                host.renderResult(GameAreaResultFormatter.fromJson(title, json, error));
                if (flowName != null) {
                    host.appendFlowLog(flowName + " - " + title + (error ? " 失败" : " 成功"));
                }
                if (!error && next != null) {
                    next.run();
                }
            }
        };
    }
}
