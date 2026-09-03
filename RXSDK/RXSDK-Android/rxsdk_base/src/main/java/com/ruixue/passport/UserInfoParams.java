package com.ruixue.passport;

import androidx.annotation.Keep;

import com.ruixue.base.SdkInfo;
import com.ruixue.utils.EntityUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/7/27
 */
public class UserInfoParams {
    @Keep
    private final String avatarurl;
    @Keep
    private final String sex;
    @Keep
    private final String wechat_avatarurl;
    @Keep
    private final String nickname;
    @Keep
    private final String region;

    public String getAvatarurl() {
        return avatarurl;
    }

    public String getSex() {
        return sex;
    }

    public String getWechat_avatarurl() {
        return wechat_avatarurl;
    }

    public String getNickname() {
        return nickname;
    }

    public String getRegion() {
        return region;
    }

    public UserInfoParams(Builder builder) {
        this.avatarurl = builder.avatarurl;
        this.sex = builder.sex;
        this.wechat_avatarurl = builder.wechat_avatarurl;
        this.nickname = builder.nickname;
        this.region = builder.region;
    }

    public Map<String, Object> toMap() {
        return EntityUtils.entityToMap(this, true, false);
    }

    public static class Builder {
        @Keep
        private String avatarurl;
        @Keep
        private String sex;
        @Keep
        private String wechat_avatarurl;
        @Keep
        private String nickname;
        @Keep
        private String region;

        public Builder setAvatarUrl(String avatarurl) {
            this.avatarurl = avatarurl;
            return this;
        }

        public Builder setSex(String sex) {
            this.sex = sex;
            return this;
        }

        public Builder setWechatAvatarUrl(String wechat_avatarurl) {
            this.wechat_avatarurl = wechat_avatarurl;
            return this;
        }

        public Builder setNickname(String nickname) {
            this.nickname = nickname;
            return this;
        }

        public Builder setRegion(String region) {
            this.region = region;
            return this;
        }

        public UserInfoParams build() {
            return new UserInfoParams(this);
        }
    }
}
