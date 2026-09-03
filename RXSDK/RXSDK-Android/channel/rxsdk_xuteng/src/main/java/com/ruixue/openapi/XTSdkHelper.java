package com.ruixue.openapi;

import androidx.annotation.NonNull;

import com.brsdk.android.bean.BRSdkRole;


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


}
