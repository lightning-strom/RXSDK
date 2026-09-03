package com.ruixue.sdk;

import android.app.Activity;
import android.app.Application;
import android.content.Context;

import androidx.multidex.MultiDex;

import com.netease.yofun.external.Api;
import com.netease.yofun.external.GameEventInfo;
import com.netease.yofun.external.GameEventType;
import com.netease.yofun.external.data.ApiInfo;
import com.ruixue.openapi.HubActionAdapter;

public class YofunSdkHelper {

    public static void install(Context context) {
        MultiDex.install(context);
    }

    public static void applicationAttach(Application application) {
        Api.getInstance().applicationAttach(application);
    }

    public static void applicationCreate(Application application) {
        Api.getInstance().applicationCreate(application);
    }

    /**
     * SDK内置了3种类型实现的闪屏（0,1,2）可以自测效果选择调用。
     *
     * @param activity
     * @param type
     * @param runnable
     */
    public static void displayChannelLogo(Activity activity, int type, Runnable runnable) {
        Api.getInstance().displayChannelLogo(activity, type, runnable);
    }

    public static void splashOnDestroy(Activity activity, HubActionAdapter hubActionAdapter) {
        if (hubActionAdapter != null) Api.getInstance().unregister(hubActionAdapter);
    }

    public static void uploadGameEventInfo(Activity activity, GameEventInfo gameInfo, GameEventType gameEventType) {

        if (activity == null || gameInfo == null || gameEventType == null) {
            return;
        }

        GameEventInfo gameEventInfo = new GameEventInfo.GameEventInfoBuilder()
                .eventType(gameEventType)  // 角色事件类型
                .roleId(gameInfo.getRoleId())  // 角色id
                .roleName(gameInfo.getRoleName())  // 角色名称
                .roleLevel(gameInfo.getRoleLevel())  //  角色等级
                .serverId(gameInfo.getServerId())  //  区服id
                .serverName(gameInfo.getServerName())  // 区服名字
                .roleType(gameInfo.getRoleType())  // 角色职业、类型
                .partyName(gameInfo.getPartyName())  // 工会名称
                .powerNum(gameInfo.getPowerNum())  // 战力数值
                .gameVipLevel(gameInfo.getGameVipLevel())  // 游戏vip等级
                .gameMoney(gameInfo.getGameMoney())  // 游戏货币数量
                .build();  //
        Api.getInstance().uploadGameEventInfo(activity, gameEventInfo);
    }

    public static void setDebugMode(boolean isDebug) {
        Api.getInstance().setDebugMode(isDebug);
    }

    public static ApiInfo copy() {
        return Api.getInstance().getInfo().copy();
    }


}
