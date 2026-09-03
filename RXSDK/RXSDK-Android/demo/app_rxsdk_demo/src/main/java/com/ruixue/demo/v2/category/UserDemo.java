package com.ruixue.demo.v2.category;

import static com.ruixue.demo.config.TestButtonConfig.PRIMARY;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.demo.config.TestButtonConfig.ButtonGroup;
import com.ruixue.demo.v2.DemoCategory;
import com.ruixue.demo.v2.DemoManager;
import com.ruixue.openapi.RXSdkApi;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户相关 API 示例
 * <p>
 * <b>包含功能：</b>
 * <ul>
 *   <li>{@link #getUserInfo()} - 获取用户基本信息（OpenID/DistinctId/DeviceCode）</li>
 *   <li>{@link #getUserDetail()} - 获取用户详细信息（调用服务端接口）</li>
 *   <li>{@link #getUserInfoByField()} - 获取指定用户信息</li>
 *   <li>{@link #getDistinctId()} - 获取设备唯一标识</li>
 *   <li>{@link #getDeviceCode()} - 获取设备码</li>
 * </ul>
 *
 * @since 2.0
 * @see com.ruixue.RuiXueSdk#getOpenid() 获取 OpenID
 * @see com.ruixue.RuiXueSdk#getDistinctId() 获取 DistinctId
 * @see com.ruixue.RuiXueSdk#getDeviceCode() 获取设备码
 * @see com.ruixue.openapi.RXSdkApi#getUserInfo 获取用户详情
 */
public class UserDemo extends DemoCategory {

    public UserDemo(@NonNull Activity activity, @NonNull DemoManager.ResultCallback callback) {
        super(activity, callback);
    }

    @Override
    public String getName() {
        return "用户";
    }

    @Override
    public String getEmoji() {
        return "👤";
    }

    @Override
    protected void registerButtons(ButtonGroup group) {
        group.addButton(button("user_info", "用户标识", PRIMARY, this::getUserInfo));
        group.addButton(button("user_detail", "用户详情", PRIMARY, this::getUserDetail));
        group.addButton(button("user_info_by_field", "指定用户信息", PRIMARY, this::getUserInfoByField));
        group.addButton(button("distinct_id", "DistinctId", PRIMARY, this::getDistinctId));
        group.addButton(button("device_code", "设备码", PRIMARY, this::getDeviceCode));
    }

    // ==================== API 示例方法 ====================

    /** 获取用户基本信息 */
    public void getUserInfo() {
        String openid = RuiXueSdk.getOpenid();
        String distinctId = RuiXueSdk.getDistinctId();
        String deviceCode = RuiXueSdk.getDeviceCode();

        String result = "用户标识信息:\n"
                + "• OpenID: " + (openid != null ? openid : "未登录") + "\n"
                + "• DistinctId: " + distinctId + "\n"
                + "• DeviceCode: " + deviceCode;
        showResult(result);
    }

    /** 获取用户详细信息 */
    public void getUserDetail() {
        RXSdkApi.getInstance().getUserInfo(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                showResult("用户详情:\n" + (data != null ? data.toString() : "空"));
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                showResult("获取失败:\n" + cause.toString());
            }
        });
    }

    /** 获取指定用户信息 */
    public void getUserInfoByField() {
        Map<String, Object> params = new HashMap<>();
        params.put("openid", RuiXueSdk.getOpenid());
        RXSdkApi.getInstance().getUserInfoByField(params, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                showResult("指定用户信息:\n" + (data != null ? data.toString() : "空"));
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                showResult("获取失败:\n" + cause.toString());
            }
        });
    }

    /** 获取 DistinctId */
    public void getDistinctId() {
        String distinctId = RuiXueSdk.getDistinctId();
        showResult("DistinctId:\n" + distinctId);
    }

    /** 获取设备码 */
    public void getDeviceCode() {
        String deviceCode = RuiXueSdk.getDeviceCode();
        showResult("DeviceCode:\n" + deviceCode);
    }
}
