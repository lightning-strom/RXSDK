package com.ruixue.openapi;

import android.graphics.drawable.Drawable;
import android.text.TextUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/5/28
 */
public class RXUserCenterConfig {

    private String transmit_args;        //| String |透传数据，使用 jsonString 形式                      |
    private Object game_user_id;         //| String |用户的游戏 id，<span style='color:red'>不传在瑞雪后台不会账号注销页面不显示游戏侧的用户id</span>                                      |
    private String nickname;          //| String |用户昵称                                            |
    private String head_img_url;         //| String |用户头像                                            |
    private String queue_name;        //| String |在瑞雪客服系统设置的接入点名称 不填写默认为 default |

    private Drawable logoImage;       //| Drawable |显示的logo，没配置则读取调用登录 UI 时的 logoImage                     |

    private boolean lightTheme;

    private Map<String, Object> configParams;         //|  Map<String, Object> |用户中心配置，默认读取瑞雪后台配置


    private OnViewCloseListener onViewCloseListener;

    public RXUserCenterConfig() {
        configParams = RXGlobalData.getUserCenterCfg();
    }

    public boolean isLightTheme() {
        return lightTheme;
    }

    public void setLightTheme(boolean lightTheme) {
        this.lightTheme = lightTheme;
    }

    public Map<String, Object> getCustomParams() {
        if (customParams == null) {
            customParams = new HashMap<>();
        }
        if (!TextUtils.isEmpty(transmit_args))
            customParams.put("transmit_args", transmit_args);
        if (game_user_id != null)
            customParams.put("game_user_id", game_user_id);
        if (!TextUtils.isEmpty(nickname))
            customParams.put("nickname", nickname);
        if (!TextUtils.isEmpty(head_img_url))
            customParams.put("head_img_url", head_img_url);
        if (!TextUtils.isEmpty(queue_name))
            customParams.put("queue_name", queue_name);
        return customParams;
    }

    public void setCustomParams(Map<String, Object> customParams) {
        this.customParams = customParams;
    }

    private Map<String, Object> customParams;
    private boolean syncInfoEnable;       //| bool |用户中心是否展示同步信息按钮，YES 为展示，NO 为不展示，默认不展示，用于同步三方信息 |

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();

        return map;
    }

    public Drawable getLogoImage() {
        return logoImage;
    }

    public void setLogoImage(Drawable logoImage) {
        this.logoImage = logoImage;
    }

    public String getTransmit_args() {
        return transmit_args;
    }

    public void setTransmit_args(String transmit_args) {
        this.transmit_args = transmit_args;
    }

    public Object getGame_user_id() {
        return game_user_id;
    }

    public void setGame_user_id(Object game_user_id) {
        this.game_user_id = game_user_id;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getHead_img_url() {
        return head_img_url;
    }

    public void setHead_img_url(String head_img_url) {
        this.head_img_url = head_img_url;
    }

    public String getQueue_name() {
        return queue_name;
    }

    public void setQueue_name(String queue_name) {
        this.queue_name = queue_name;
    }

    public Map<String, Object> getConfigParams() {
        return configParams;
    }

    public void setConfigParams(Map<String, Object> setConfigParams) {
        this.configParams = setConfigParams;
    }

    public boolean isSyncInfoEnable() {
        return syncInfoEnable;
    }

    public void setSyncInfoEnable(boolean syncInfoEnable) {
        this.syncInfoEnable = syncInfoEnable;
    }

    public OnViewCloseListener getOnViewCloseListener() {
        return onViewCloseListener;
    }

    public void setOnViewCloseListener(OnViewCloseListener onViewCloseListener) {
        this.onViewCloseListener = onViewCloseListener;
    }
}
