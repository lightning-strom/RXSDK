package com.ruixue.demo.v2.category;

import static com.ruixue.demo.config.TestButtonConfig.ACCENT;
import static com.ruixue.demo.config.TestButtonConfig.DANGER;
import static com.ruixue.demo.config.TestButtonConfig.PRIMARY;

import android.app.Activity;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.demo.config.TestButtonConfig.ButtonGroup;
import com.ruixue.demo.permission.PermissionInterceptor;
import com.ruixue.demo.social.SocialConsoleHost;
import com.ruixue.demo.social.SocialResultFormatter;
import com.ruixue.demo.social.SocialTestFormData;
import com.ruixue.demo.v2.DemoCategory;
import com.ruixue.demo.v2.DemoManager;
import com.ruixue.demo.utils.DemoUtils;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.IRXSdkApi;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.permission.OnPermissionCallback;
import com.ruixue.permission.Permission;
import com.ruixue.permission.RXPermissions;
import com.ruixue.qipai.R;
import com.ruixue.reflect.GpsManager;
import com.ruixue.utils.JSONUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 社交功能 API 示例
 * <p>
 * 统一处理动态按钮面板和 XML 布局按钮的社交功能调用
 * <p>
 * <b>包含功能：</b>
 * <ul>
 *   <li><b>定位</b>: 开始定位、停止定位、删除位置、查询附近</li>
 *   <li><b>好友</b>: 添加、删除、查询好友</li>
 *   <li><b>关系</b>: 自定义关系增删改查</li>
 *   <li><b>排行榜</b>: 积分、排名、好友排行</li>
 * </ul>
 *
 * @since 2.0
 * @see com.ruixue.openapi.RXSdkApi 核心 API 接口
 */
public class SocialDemo extends DemoCategory {

    private final IRXSdkApi api = RXSdkApi.getInstance();
    private final SocialConsoleHost host;

    private interface SocialAction {
        void run(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback);
    }

    public SocialDemo(@NonNull Activity activity,
                      @NonNull DemoManager.ResultCallback callback,
                      @NonNull SocialConsoleHost host) {
        super(activity, callback);
        this.host = host;
    }

    @Override
    public String getName() {
        return "社交";
    }

    @Override
    public String getEmoji() {
        return "👥";
    }

    @Override
    protected void registerButtons(ButtonGroup group) {
        group.addButton(button("location_start", "开始定位", PRIMARY, this::startLocation));
        group.addButton(button("location_stop", "停止定位", this::stopLocation));
        group.addButton(button("location_del", "删除位置", DANGER, this::confirmDeleteLocation));
        group.addButton(button("lbs_radius", "附近用户", this::lbsRadius));

        group.addButton(button("add_friend", "添加好友", ACCENT, this::addFriends));
        group.addButton(button("del_friend", "删除好友", DANGER, this::confirmRemoveFriends));
        group.addButton(button("is_friend", "好友状态", this::isFriends));
        group.addButton(button("friend_list", "好友列表", this::relationFriends));

        group.addButton(button("relation_add", "添加关系", PRIMARY, this::relationAdd));
        group.addButton(button("relation_del", "删除关系", DANGER, this::confirmRelationDelete));
        group.addButton(button("relation_has", "关系状态", this::relationHas));
        group.addButton(button("relation_list", "关系列表", this::relationList));

        group.addButton(button("add_score", "增加积分", ACCENT, this::addScore));
        group.addButton(button("set_score", "设置积分", this::setScore));
        group.addButton(button("user_rank", "用户排名", this::queryUserRank));
        group.addButton(button("rank_list", "排行榜", this::getRankList));
        group.addButton(button("friend_rank", "好友榜", this::friendsRank));
    }

    public boolean onClick(View v) {
        int id = v.getId();
        if (id == R.id.location_start) {
            startLocation();
        } else if (id == R.id.location_stop) {
            stopLocation();
        } else if (id == R.id.location_del) {
            confirmDeleteLocation();
        } else if (id == R.id.lbs_radius) {
            lbsRadius();
        } else if (id == R.id.relationadd) {
            relationAdd();
        } else if (id == R.id.relationdelete) {
            confirmRelationDelete();
        } else if (id == R.id.hasRelation) {
            relationHas();
        } else if (id == R.id.updateRelationRemarks) {
            relationRemarks();
        } else if (id == R.id.relationlist) {
            relationList();
        } else if (id == R.id.allfriends) {
            relationFriends();
        } else if (id == R.id.addfriend) {
            addFriends();
        } else if (id == R.id.deletefriend) {
            confirmRemoveFriends();
        } else if (id == R.id.isfriend) {
            isFriends();
        } else if (id == R.id.updatefriendremarks) {
            updateFriendRemarks();
        } else if (id == R.id.addscore) {
            addScore();
        } else if (id == R.id.setscore) {
            setScore();
        } else if (id == R.id.queryuserrank) {
            queryUserRank();
        } else if (id == R.id.getranklist) {
            getRankList();
        } else if (id == R.id.friendsrank) {
            friendsRank();
        } else if (id == R.id.social_quick_friend_flow) {
            runFriendQuickFlow();
        } else if (id == R.id.social_quick_relation_flow) {
            runRelationQuickFlow();
        } else if (id == R.id.social_quick_rank_flow) {
            runRankQuickFlow();
        } else if (id == R.id.social_quick_lbs_flow) {
            runLbsQuickFlow();
        } else {
            return false;
        }
        return true;
    }

    private void startLocation() {
        executeAction("启动定位", this::requestStartLocation);
    }

    private void requestStartLocation(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        RXPermissions.with(activity)
                .permission(Permission.ACCESS_COARSE_LOCATION)
                .permission(Permission.ACCESS_FINE_LOCATION)
                .interceptor(new PermissionInterceptor())
                .request(new OnPermissionCallback() {
                    @Override
                    public void onGranted(List<String> permissions, boolean all) {
                        if (!all) {
                            showToast("需要定位权限");
                            return;
                        }
                        GpsManager.initLocation(activity);
                        GpsManager.startLocation(activity, formData.getLocationTypes(), 5, new RXStringCallback() {
                            @Override
                            public void onSuccess(@Nullable String data) {
                                try {
                                    callback.onSuccess(data == null ? null : new JSONObject(data));
                                } catch (JSONException e) {
                                    JSONObject err = new JSONObject();
                                    try {
                                        err.put("error", "LBS parse failed: " + e.getMessage());
                                    } catch (JSONException ignored) {
                                        RXLogger.w("SocialDemo", "Failed to build LBS error payload: " + ignored.getMessage());
                                    }
                                    callback.onFailed(err);
                                }
                            }

                            @Override
                            public void onFailed(int code, String msg, @Nullable String traceId) {
                                callback.onFailed(JSONUtil.toJSONObject(code, msg, traceId));
                            }
                        });
                    }
                });
    }

    private void stopLocation() {
        GpsManager.stopLocation();
        showToast("已停止定位");
        executeAction("停止定位", (formData, callback) -> {
            JSONObject result = new JSONObject();
            try {
                result.put("msg", "已停止定位");
            } catch (JSONException e) {
                RXLogger.w("SocialDemo", "Failed to build stopLocation result: " + e.getMessage());
            }
            callback.onSuccess(result);
        });
    }

    private void lbsDelete() {
        executeAction("删除位置", this::requestDeleteLbs);
    }

    private void confirmDeleteLocation() {
        DemoUtils.showConfirmDialog(activity,
                "确认删除位置",
                "将删除当前定位信息，确认继续吗？",
                this::lbsDelete);
    }

    private void requestDeleteLbs(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        Map<String, Object> params = new HashMap<>();
        params.put("type", formData.getLocationTypes());
        api.lbsDelete(params, callback);
    }

    private void lbsRadius() {
        executeAction("附近用户", this::requestLbsRadius);
    }

    private void requestLbsRadius(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        Map<String, Object> params = new HashMap<>();
        params.put("lon", formData.getLonValue());
        params.put("lat", formData.getLatValue());
        params.put("radius", formData.getRadiusValue());
        params.put("count", 0);
        params.put("page", formData.getPageValue());
        params.put("page_size", formData.getPageSizeValue());
        params.put("type", formData.lbsType);
        api.lbsRadius(params, callback);
    }

    private void addFriends() {
        executeAction("添加好友", this::requestAddFriend);
    }

    private void requestAddFriend(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        api.addFriends(formData.targetOpenId, formData.friendRemark, formData.userRemark, callback);
    }

    private void removeFriends() {
        executeAction("删除好友", this::requestRemoveFriend);
    }

    private void confirmRemoveFriends() {
        DemoUtils.showConfirmDialog(activity,
                "确认删除好友",
                "将按当前 target openid 删除好友关系，确认继续吗？",
                this::removeFriends);
    }

    private void requestRemoveFriend(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        api.removeFriends(formData.targetOpenId, callback);
    }

    private void isFriends() {
        executeAction("好友状态", this::requestIsFriend);
    }

    private void requestIsFriend(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        api.isFriend(formData.targetOpenId, callback);
    }

    private void updateFriendRemarks() {
        executeAction("修改好友备注", this::requestUpdateFriendRemark);
    }

    private void requestUpdateFriendRemark(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        api.updateFriendRemarks(formData.targetOpenId, formData.friendRemark, callback);
    }

    private void relationFriends() {
        executeAction("好友列表", this::requestRelationFriends);
    }

    private void requestRelationFriends(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        api.relationFriends(callback);
    }

    private void relationAdd() {
        executeAction("添加关系", this::requestRelationAdd);
    }

    private void requestRelationAdd(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        api.relationAdd(formData.targetOpenId, buildRelationTypes(formData.relationKey),
                formData.relationRemark, formData.userRemark, callback);
    }

    private void relationDelete() {
        executeAction("删除关系", this::requestRelationDelete);
    }

    private void confirmRelationDelete() {
        DemoUtils.showConfirmDialog(activity,
                "确认删除关系",
                "将按当前 target openid 和关系 key 删除关系，确认继续吗？",
                this::relationDelete);
    }

    private void requestRelationDelete(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        api.relationDelete(formData.targetOpenId, buildRelationTypes(formData.relationKey), callback);
    }

    private void relationHas() {
        executeAction("关系状态", this::requestHasRelation);
    }

    private void requestHasRelation(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        api.hasRelation(formData.targetOpenId, formData.relationKey, callback);
    }

    private void relationRemarks() {
        executeAction("修改关系备注", this::requestRelationRemark);
    }

    private void requestRelationRemark(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        api.updateRemarks(formData.targetOpenId, formData.relationKey, formData.relationRemark, callback);
    }

    private void relationList() {
        executeAction("关系列表", this::requestRelationList);
    }

    private void requestRelationList(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        api.relationList(formData.relationKey, callback);
    }

    private void addScore() {
        executeAction("增加分数", this::requestAddScore);
    }

    private void requestAddScore(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        showResult("增加积分: " + formData.getScoreValue());
        api.addScore(formData.rankId, formData.getScoreValue(), callback);
    }

    private void setScore() {
        executeAction("设置分数", this::requestSetScore);
    }

    private void requestSetScore(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        showResult("设置积分: " + formData.getScoreValue());
        api.setScore(formData.rankId, formData.getScoreValue(), callback);
    }

    private void queryUserRank() {
        executeAction("用户排名", this::requestQueryUserRank);
    }

    private void requestQueryUserRank(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        api.queryUserRank(formData.rankId, formData.getQueryOpenId(), callback);
    }

    private void getRankList() {
        executeAction("排行榜", this::requestGetRankList);
    }

    private void requestGetRankList(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        api.getRankList(formData.rankId, formData.getRankStartValue(), formData.getRankEndValue(), callback);
    }

    private void friendsRank() {
        executeAction("好友榜", this::requestFriendsRank);
    }

    private void requestFriendsRank(@NonNull SocialTestFormData formData, @NonNull RXJSONCallback callback) {
        api.friendsRank(formData.rankId, callback);
    }

    private void runFriendQuickFlow() {
        host.clearFlowLog();
        host.appendFlowLog("好友测试流开始");
        executeFlowAction("好友测试流", "添加好友", this::requestAddFriend, () ->
                executeFlowAction("好友测试流", "好友状态", this::requestIsFriend, () ->
                        executeFlowAction("好友测试流", "好友列表", this::requestRelationFriends, () ->
                                executeFlowAction("好友测试流", "修改好友备注", this::requestUpdateFriendRemark, () ->
                                        executeFlowAction("好友测试流", "删除好友", this::requestRemoveFriend, () ->
                                                executeFlowAction("好友测试流", "好友列表(删除后)", this::requestRelationFriends, () ->
                                                        host.appendFlowLog("好友测试流完成")))))));
    }

    private void runRelationQuickFlow() {
        host.clearFlowLog();
        host.appendFlowLog("关系测试流开始");
        executeFlowAction("关系测试流", "添加关系", this::requestRelationAdd, () ->
                executeFlowAction("关系测试流", "关系状态", this::requestHasRelation, () ->
                        executeFlowAction("关系测试流", "关系列表", this::requestRelationList, () ->
                                executeFlowAction("关系测试流", "修改关系备注", this::requestRelationRemark, () ->
                                        executeFlowAction("关系测试流", "删除关系", this::requestRelationDelete, () ->
                                                executeFlowAction("关系测试流", "关系列表(删除后)", this::requestRelationList, () ->
                                                        host.appendFlowLog("关系测试流完成")))))));
    }

    private void runRankQuickFlow() {
        host.clearFlowLog();
        host.appendFlowLog("排行榜测试流开始");
        executeFlowAction("排行榜测试流", "设置分数", this::requestSetScore, () ->
                executeFlowAction("排行榜测试流", "增加分数", this::requestAddScore, () ->
                        executeFlowAction("排行榜测试流", "用户排名", this::requestQueryUserRank, () ->
                                executeFlowAction("排行榜测试流", "排行榜", this::requestGetRankList, () ->
                                        executeFlowAction("排行榜测试流", "好友榜", this::requestFriendsRank, () ->
                                                host.appendFlowLog("排行榜测试流完成"))))));
    }

    private void runLbsQuickFlow() {
        host.clearFlowLog();
        host.appendFlowLog("LBS测试流开始");
        executeFlowAction("LBS测试流", "启动定位", this::requestStartLocation, () ->
                executeFlowAction("LBS测试流", "附近用户", this::requestLbsRadius, () ->
                        executeFlowAction("LBS测试流", "删除位置", this::requestDeleteLbs, () ->
                                executeFlowAction("LBS测试流", "停止定位", (formData, callback) -> {
                                    GpsManager.stopLocation();
                                    JSONObject result = new JSONObject();
                                    try {
                                        result.put("msg", "已停止定位");
                                    } catch (JSONException e) {
                                        RXLogger.w("SocialDemo", "Failed to build stopLocation flow result: " + e.getMessage());
                                    }
                                    callback.onSuccess(result);
                                }, () -> host.appendFlowLog("LBS测试流完成")))));
    }

    private void executeAction(@NonNull String title, @NonNull SocialAction action) {
        SocialTestFormData formData = host.getFormData();
        action.run(formData, buildCallback(title, null, null));
    }

    private void executeFlowAction(@NonNull String flowName,
                                   @NonNull String title,
                                   @NonNull SocialAction action,
                                   @Nullable Runnable nextOnSuccess) {
        SocialTestFormData formData = host.getFormData();
        action.run(formData, buildCallback(title, flowName, nextOnSuccess));
    }

    @NonNull
    private RXJSONCallback buildCallback(@NonNull String title,
                                         @Nullable String flowName,
                                         @Nullable Runnable nextOnSuccess) {
        return new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                String raw = data != null ? data.toString() : "成功";
                showResult(raw);
                host.renderResult(SocialResultFormatter.fromJson(title, data, false));
                if (flowName != null) {
                    host.appendFlowLog(flowName + " - " + title + " 成功");
                }
                if (nextOnSuccess != null) {
                    nextOnSuccess.run();
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                showResult("失败: " + cause.toString());
                host.renderResult(SocialResultFormatter.fromJson(title, cause, true));
                if (flowName != null) {
                    host.appendFlowLog(flowName + " - " + title + " 失败");
                }
            }
        };
    }

    @NonNull
    private Map<String, Object> buildRelationTypes(@NonNull String relationKey) {
        Map<String, Object> types = new HashMap<>();
        types.put(relationKey, true);
        return types;
    }
}
