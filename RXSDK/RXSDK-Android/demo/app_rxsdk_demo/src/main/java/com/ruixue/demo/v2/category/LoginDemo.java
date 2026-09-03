package com.ruixue.demo.v2.category;

import static com.ruixue.demo.config.TestButtonConfig.PRIMARY;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.demo.config.TestButtonConfig.ButtonGroup;
import com.ruixue.demo.v2.DemoCategory;
import com.ruixue.demo.v2.DemoManager;
import com.ruixue.passport.AccessToken;

import org.json.JSONObject;

import java.util.HashMap;

/**
 * 登录相关 API 示例
 * <p>
 * <b>包含功能：</b>
 * <ul>
 *   <li>{@link #checkLoginStatus()} - 检查登录状态</li>
 *   <li>{@link #getOpenId()} - 获取用户 OpenID</li>
 *   <li>{@link #getToken()} - 获取 AccessToken</li>
 *   <li>{@link #checkTokenExpired()} - 检查 Token 是否过期</li>
 *   <li>{@link #doLogin()} - 执行登录</li>
 *   <li>{@link #doLogout()} - 执行登出</li>
 * </ul>
 *
 * @since 2.0
 * @see com.ruixue.RuiXueSdk#isLoggedIn() 登录状态
 * @see com.ruixue.RuiXueSdk#getOpenid() 获取 OpenID
 * @see com.ruixue.RuiXueSdk#login 登录接口
 */
public class LoginDemo extends DemoCategory {

    public LoginDemo(@NonNull Activity activity, @NonNull DemoManager.ResultCallback callback) {
        super(activity, callback);
    }

    @Override
    public String getName() {
        return "登录";
    }

    @Override
    public String getEmoji() {
        return "🔐";
    }

    @Override
    protected void registerButtons(ButtonGroup group) {
        group.addButton(button("check_login", "登录状态", PRIMARY, this::checkLoginStatus));
        group.addButton(button("get_openid", "获取OpenID", PRIMARY, this::getOpenId));
        group.addButton(button("get_token", "获取Token", PRIMARY, this::getToken));
        group.addButton(button("check_expired", "Token过期", PRIMARY, this::checkTokenExpired));
        group.addButton(button("do_login", "执行登录", PRIMARY, this::doLogin));
        group.addButton(button("do_logout", "执行登出", PRIMARY, this::doLogout));
    }

    // ==================== API 示例方法 ====================

    /** 检查登录状态 */
    public void checkLoginStatus() {
        boolean isLogin = RuiXueSdk.isLoggedIn();
        showResult("登录状态: " + (isLogin ? "已登录 ✅" : "未登录 ❌"));
    }

    /** 获取当前用户 OpenID */
    public void getOpenId() {
        String openid = RuiXueSdk.getOpenid();
        showResult("OpenID: " + (openid != null ? openid : "未登录"));
    }

    /** 获取当前 AccessToken */
    public void getToken() {
        AccessToken token = RuiXueSdk.getCurrentAccessToken();
        if (token != null) {
            String result = "AccessToken:\n"
                    + "• access: " + token.getAccess() + "\n"
                    + "• refresh: " + token.getRefresh() + "\n"
                    + "• accessExpire: " + token.getAccessExpire() + "\n"
                    + "• refreshExpire: " + token.getRefreshExpire();
            showResult(result);
        } else {
            showResult("Token: 未登录");
        }
    }

    /** 检查 Token 是否过期 */
    public void checkTokenExpired() {
        AccessToken token = RuiXueSdk.getCurrentAccessToken();
        if (token != null) {
            String result = "Token 过期状态:\n"
                    + "• Access 过期: " + (token.isExpired() ? "是 ❌" : "否 ✅") + "\n"
                    + "• Refresh 过期: " + (token.isRefreshExpired() ? "是 ❌" : "否 ✅");
            showResult(result);
        } else {
            showResult("Token: 未登录");
        }
    }

    /** 执行登录 */
    public void doLogin() {
        RuiXueSdk.login(activity, new HashMap<>(), new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                showResult("登录成功:\n" + (data != null ? data.toString() : ""));
                showToast("登录成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                showResult("登录失败:\n" + cause.toString());
            }
        });
    }

    /** 执行登出 */
    public void doLogout() {
        RuiXueSdk.logout(new OnLogoutCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                showResult("已登出");
                showToast("已登出");
            }

            @Override
            public void onFailed(int code, String msg) {
                showResult("登出失败: " + code + " - " + msg);
            }
        });
    }
}
