package com.ruixue.passport;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.gson.Gson;

import org.json.JSONObject;

public final class AccessToken implements Parcelable {
    private final String access;
    private int access_expire;
    private final String refresh;
    private int refresh_expire;

    protected AccessToken(Parcel in) {
        access = in.readString();
        access_expire = in.readInt();
        refresh = in.readString();
        refresh_expire = in.readInt();
    }

    public static final Creator<AccessToken> CREATOR = new Creator<AccessToken>() {
        @Override
        public AccessToken createFromParcel(Parcel in) {
            return new AccessToken(in);
        }

        @Override
        public AccessToken[] newArray(int size) {
            return new AccessToken[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(access);
        dest.writeInt(access_expire);
        dest.writeString(refresh);
        dest.writeInt(refresh_expire);
    }

    public String getAccess() {
        return access;
    }

    /**
     * @return access本地过期时间
     */
    public int getAccessExpire() {
        return access_expire;
    }

    public String getRefresh() {
        return refresh;
    }

    /**
     * @return refresh 本地过期时间
     */
    public int getRefreshExpire() {
        return refresh_expire;
    }

    /**
     * @param access_expire 过期剩余时间
     */
    public void setAccessExpire(int access_expire) {
        this.access_expire = access_expire > 0 ? (int) (System.currentTimeMillis() / 1000 + access_expire) : access_expire;
    }

    /**
     * @param refresh_expire 过期剩余时间
     */
    public void setRefreshExpire(int refresh_expire) {
        this.refresh_expire = refresh_expire > 0 ? (int) (System.currentTimeMillis() / 1000 + refresh_expire) : refresh_expire;
    }

    /**
     * @return 是否过期
     */
    public boolean isRefreshExpired() {
        long currentTime = System.currentTimeMillis() / 1000;
        return currentTime >= this.refresh_expire - 60;
    }

    //是否过期
    public boolean isExpired() {
        return isExpired(60);
    }

    //是否过期
    public boolean isExpired(int nearly) {
        long currentTime = System.currentTimeMillis() / 1000;
        return currentTime >= this.access_expire - nearly;
    }


    public AccessToken calcTokenExpireTime() {
        this.setAccessExpire(this.access_expire);
        this.setRefreshExpire(this.refresh_expire);
        return this;
    }

    public String toJson() {
        return new Gson().toJson(this);
    }

    public static AccessToken fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return AccessToken.fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    public static AccessToken fromJson(String jsonStr) {
        return new Gson().fromJson(jsonStr, AccessToken.class);
    }

    public interface AccessTokenRefreshCallback {
        void onTokenRefreshed(AccessToken accessToken);

        void onTokenRefreshFailed(JSONObject cause);
    }

}
