package com.ruixue.openapi;

import android.app.Application;
import android.content.Context;
import android.content.res.Configuration;
import android.util.Log;

import androidx.annotation.NonNull;

import com.brsdk.android.bean.BRSdkRole;
import com.brsdk.android.core.BRSdkApi;
import com.brsdk.android.event.BROAIDListener;

import java.util.Map;


public class XTSdkHelper {

    static class Single {
        final static XTSdkHelper INSTANCE = new XTSdkHelper();
    }

    protected XTSdkHelper() {
    }

    @NonNull
    public static XTSdkHelper getInstance() {
        return Single.INSTANCE;
    }

    public void applicationAttachBaseContext(Context context, Application application) {
        // Xuteng SDK 的 attachBaseContext 处理已在 XTSdkApiImpl 中实现
    }

    public void applicationCreate(Application application) {
        // Xuteng SDK 的 onCreate 处理已在 XTSdkApiImpl 中实现
    }

    public void applicationConfigurationChanged(Configuration newConfig) {
        // Xuteng SDK 的 onConfigurationChanged 处理已在 XTSdkApiImpl 中实现
    }

    /**
     * 设置角色信息
     * @param roleInfo 角色信息 Map
     */
    public void setRoleInfo(Map<String, String> roleInfo) {
        if (roleInfo == null || roleInfo.isEmpty()) {
            return;
        }
        // 根据角色信息构造 BRSdkRole
        BRSdkRole brSdkRole = new BRSdkRole()
                .setRoleId(roleInfo.get("role_id"))
                .setRoleName(roleInfo.get("role_name"))
                .setRoleLevel(roleInfo.get("role_level"))
                .setServerId(roleInfo.get("server_id"))
                .setServerName(roleInfo.get("server_name"))
                .setBalance(roleInfo.get("balance") != null ? roleInfo.get("balance") : "0")
                .setCreateTime(roleInfo.get("create_time") != null ? roleInfo.get("create_time") : String.valueOf(System.currentTimeMillis() / 1000))
                .setPartyId(roleInfo.get("party_id"))
                .setPartyName(roleInfo.get("party_name"))
                .setVipLevel(roleInfo.get("vip_level"))
                .setRolePower(roleInfo.get("combat_number") != null ? roleInfo.get("combat_number") : "0");

        // 根据 role_action 设置事件类型
        String roleAction = roleInfo.get("role_action");
        BRSdkRole.Event event = BRSdkRole.Event.create; // 默认进入游戏
        if ("1".equals(roleAction)) {
            event = BRSdkRole.Event.online;
        } else if ("2".equals(roleAction)) {
            event = BRSdkRole.Event.levelUp;
        } else if ("3".equals(roleAction)) {
            event = BRSdkRole.Event.toParty;
        }
        brSdkRole.setRoleEvent(event);

        // 上报角色信息
        BRSdkApi.getInstance().onUpRole(brSdkRole);
    }


    // 角色数据说明
    private static BRSdkRole fakeRole(BRSdkRole.Event event) {
        return new BRSdkRole()
                .setRoleId("1001") // 角色ID
                .setRoleName("角色名") // 角色名
                .setRoleLevel("10") // 角色等级
                .setServerId("101") // 服务器ID
                .setServerName("服务器名") // 服务器名
                .setBalance("1000") // 角色账户余额
                .setCreateTime(System.currentTimeMillis() / 1000 + "") // 角色创建时间(秒)
                .setPartyId("11") // 帮派/工会ID
                .setPartyName("帮派/工会名") // 帮派/工会
                .setVipLevel("5") // 角色VIP等级
                .setRolePower("1000000") // 战斗力
                .setRoleEvent(event) // 角色事件
                .setReincarnation("1") // 转生等级
                .setProfession("法师") // 角色职业
                .setGender(BRSdkRole.Gender.male); // 角色性别
    }

    private void upRole(BRSdkRole.Event event) {
        // TODO 角色上报根据不同的角色事件上传角色信息；必须在登录成功之后
        BRSdkApi.getInstance().onUpRole(fakeRole(event));
    }

    private void sdkFunctionSample() {
        BRSdkApi.getInstance().getOAID(new BROAIDListener() {
            @Override
            public void onFinished(String data) {
                Log.e(getClass().getName(), "OAID: " + data);
            }
        });
    }

}
