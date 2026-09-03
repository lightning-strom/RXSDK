package com.ruixue.passport;

import android.os.Parcel;
import android.os.Parcelable;
import android.text.TextUtils;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.BitUtil;
import com.ruixue.utils.MobileUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

//openid	瑞雪openid,
//inviter_openid	当前分享用户的瑞雪openid
//username	用户名
//nickname	昵称
//avatar	头像地址
//region	地区码
//ts 服务器当前时间戳(毫秒)
//client_ts 客户端时间戳, 有请求数据中获取, 原封不动带回去(毫秒)
//attr 用户扩展属性位运算（1-已实名认证，2-已绑定手机，4-已绑定邮箱，8-已设置密码 ）
//flag 本次登录逻辑标记位运算（1-是否新用户, 2-是否进行防沉迷控制, 4-游客是否绑定了三方账号(仅在游客登录返回时有效),8-已完成首次绑定手机,16-已完成首次绑定 Email）,32-用户处在注销申请中
//source_channel	来源
//source	string
//topinviter_openid	首个分享用户瑞雪openid
//tid	三方OpenID
//uid	三方UnionID
//subchannelid	用户所属子渠道
//age	 年龄
//sex	 性别
//login_openid	加密后的瑞雪openid 二次登录时使用
@Keep
public class LoginData implements Parcelable {
    @Keep
    protected AccessToken token;
    @Keep
    protected String openid;

    public String getOldOpenid() {
        return oldopenid;
    }

    @Keep
    protected String oldopenid;
    @Keep
    protected String inviter_openid;

    @Keep
    protected String username;

    protected String login_username;
    protected String usernameOrigin;
    protected String devicecode;


    @Keep
    protected String nickname = "";

    @Keep
    protected String avatar = "";
    @Keep
    protected String region = "";
    @Keep
    protected final int ts;
    @Keep
    protected final int client_ts;
    /*
            用户扩展属性位运算（1-已实名认证，2-已绑定手机，4-已绑定邮箱，8-已设置密码 ）
     */
    @Keep
    protected int attr;
    /*
    本次登录逻辑标记位运算（1-是否新用户, 2-是否进行防沉迷控制, 4-游客是否绑定了三方账号(仅在游客登录返回时有效),8-已完成首次绑定手机,16-已完成首次绑定 Email）,32-用户处在注销申请中
     */
    @Keep
    protected int flag;

    /**
     * （1 - 是达人）
     */
    @Keep
    protected int user_flag;

    /**
     * 游戏 id (达人获取福利码用的字段)
     */
    @Keep
    protected String cp_user_id;

    @Keep
    protected Reward reward;

    @Keep
    protected String source_channel = "";
    @Keep
    protected String source = "";
    @Keep
    protected String topinviter_openid = "";
    @Keep
    protected String tid = "";
    @Keep
    protected String uid = "";
    //用户所属子渠道
    @SerializedName(value = "subchannelid", alternate = {"sub_channel_id"})
    @Keep
    protected String subchannelid = "";
    @Keep
    protected int age;
    @Keep
    protected int sex;
    @Keep
    protected String login_openid = "";

    public void setLogin_openid_expire(long login_openid_expire) {
        this.login_openid_expire = login_openid_expire > 0 ? (int) (System.currentTimeMillis() / 1000 + login_openid_expire) : login_openid_expire;
    }

    protected long login_openid_expire;

    public void setAas(int aas) {
        this.aas = aas;
    }

    // 1.  登录返回的flag(二进制) 第2位是1   (表示进行防沉迷控制)
//                2.  登录返回的aas >0(表示还可以进行游戏的剩余时间)
//                3.  登录返回的attr(二进制) 第1位是1  （表示已经实名）
//                4.  登录返回的age < 18
    @Keep
    protected int aas;
    @Keep
    protected Map<String, Object> ext;

    @Keep
    protected String method = "";


    protected String login_method = "";

    protected boolean password_set;

    protected String password;

    @Keep
    protected LoginData(Parcel in) {
        token = in.readParcelable(AccessToken.class.getClassLoader());
        openid = in.readString();
        inviter_openid = in.readString();
        username = in.readString();
        nickname = in.readString();
        avatar = in.readString();
        region = in.readString();
        ts = in.readInt();
        client_ts = in.readInt();
        attr = in.readInt();
        flag = in.readInt();
        source_channel = in.readString();
        source = in.readString();
        topinviter_openid = in.readString();
        tid = in.readString();
        uid = in.readString();
        subchannelid = in.readString();
        age = in.readInt();
        sex = in.readInt();
        login_openid = in.readString();
        aas = in.readInt();
        method = in.readString();
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeParcelable(token, flags);
        dest.writeString(openid);
        dest.writeString(inviter_openid);
        dest.writeString(username);
        dest.writeString(nickname);
        dest.writeString(avatar);
        dest.writeString(region);
        dest.writeInt(ts);
        dest.writeInt(client_ts);
        dest.writeInt(attr);
        dest.writeInt(flag);
        dest.writeString(source_channel);
        dest.writeString(source);
        dest.writeString(topinviter_openid);
        dest.writeString(tid);
        dest.writeString(uid);
        dest.writeString(subchannelid);
        dest.writeInt(age);
        dest.writeInt(sex);
        dest.writeString(login_openid);
        dest.writeInt(aas);
        dest.writeString(method);
        dest.writeString(login_method);
        dest.writeString(login_username);
    }

    public static final Creator<LoginData> CREATOR = new Creator<LoginData>() {
        @Override
        public LoginData createFromParcel(Parcel in) {
            return new LoginData(in);
        }

        @Override
        public LoginData[] newArray(int size) {
            return new LoginData[size];
        }
    };

    public LoginData setMethod(String method) {
        if (!TextUtils.isEmpty(method)) {
            this.method = method;
        }
        return this;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }


    public String getLoginMethod() {
        return TextUtils.isEmpty(login_method) ? method : login_method;
    }

    public void setLoginMethod(String login_method) {
        this.login_method = login_method;
    }

    public String getLoginUsername() {
        return TextUtils.isEmpty(login_username) ? username : login_username;
    }

    public void setLoginUsername(String login_username) {
        this.login_username = login_username;
    }

    public String getExtRealName() {
        if (ext != null && ext.containsKey("realname")) {
            return (String) ext.get("realname");
        } else {
            return null;
        }
    }

    public String getExtIdcard() {
        if (ext != null && ext.containsKey("idcard")) {
            return (String) ext.get("idcard");
        } else {
            return null;
        }
    }

    public void setAge(int age) {
        this.age = age;
        if (age > 0) {
            attr = attr | 1 | 1 << 4;
        }
    }

    /**
     * 自动计算过期时间为本地时间
     * @param token AccessToken
     */
    public LoginData setAccessToken(AccessToken token) {
        this.token = token;
        return this;
    }

    /**
     * token服务器下发过期剩余时间，构建时根据当前系统时间计算一次实际到期时间
     */
    public LoginData calcTokenExpireTime() {
        token.calcTokenExpireTime();
        this.setLogin_openid_expire(this.login_openid_expire);
        return this;
    }

    public LoginData updateLoginData(LoginData loginData) {
        if (null != loginData) {
            if (this.openid.equals(loginData.getLoginOpenid())) {
                this.avatar = loginData.getAvatar();
                if (!TextUtils.isEmpty(loginData.getUsername()))
                    this.nickname = loginData.getNickname();
                if (!TextUtils.isEmpty(loginData.getUsername()))
                    this.username = loginData.getUsername();
                if (loginData.getSex() != -1) {
                    this.sex = loginData.getSex();
                }
            }
        }
        return this;
    }

    public void setUsername(String username) {
        if (TextUtils.isEmpty(this.usernameOrigin)) {
            this.usernameOrigin = this.username;
        } else {
            this.usernameOrigin = MobileUtils.getPhone(username);
        }
        if (!TextUtils.isEmpty(username)) {
            this.username = username;
            AccountHelper.updateAccountCache(this);
        }
    }


    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    /**
     * 1.  登录返回的flag(二进制) 第2位是1   (表示进行防沉迷控制)
     * 2.  登录返回的aas >0(表示还可以进行游戏的剩余时间)
     * 3.  登录返回的attr(二进制) 第1位是1  （表示已经实名）
     * 4.  登录返回的age < 18
     * 满足四个条件才会触发防沉迷计时器
     */
    public int getAas() {
        return aas;
    }


    public int getClient_ts() {
        return client_ts;
    }

    public boolean loginOpenidExpireInvalid() {
        RXLogger.i("login_openid_expire:" + System.currentTimeMillis() / 1000 + "," + login_openid_expire);
        return !(login_openid_expire < 0 || (System.currentTimeMillis() / 1000) < login_openid_expire);
    }

    public String getLoginOpenid() {
        return login_openid;
    }

    public String getOpenid() {
        return openid;
    }

    public String getUsername() {
        return username;
    }

    public String getDisplayUsername() {
        return TextUtils.isEmpty(this.usernameOrigin) ? AccountHelper.getDisplayUsername(username, getLoginMethod(), getNickname()) : this.usernameOrigin;
    }

    public String getNickname() {
        return nickname;
    }

    public String getAvatar() {
        return avatar;
    }

    public String getRegion() {
        return region;
    }

    public int getTs() {
        return ts;
    }

    public int getAttr() {
        return attr;
    }

    public int getFlag() {
        return flag;
    }

    public int getUser_flag() {
        return user_flag;
    }

    public String getCp_user_id() {
        return cp_user_id;
    }

    public Reward getReward() {
        return reward;
    }

    public void setDeregister(boolean isRequest) {
        if (isRequest) {
            flag |= LoginFlagMask.FLAG_DEREGISTER;
        } else {
            flag &= ~(LoginFlagMask.FLAG_DEREGISTER);
        }
    }

    public void setLimit(boolean limit) {
        if (limit) {
            flag |= LoginFlagMask.FLAG_SCREEN_TIME;
        } else {
            flag &= ~(LoginFlagMask.FLAG_SCREEN_TIME);
        }
    }

    public void setFlag(int mask, boolean isMask) {
        if (isMask) {
            flag |= mask;
        } else {
            this.flag = mask;
        }
    }

    public void setUserFlag(int mask) {
        user_flag |= mask;
    }

    public void setCp_user_id(String cp_user_id) {
        this.cp_user_id = cp_user_id;
    }

    public void setAttr(int mask) {
        attr |= mask;
    }

    public void unsetAttr(int mask) {
        attr &= ~mask;
    }

    public void unsetFlag(int mask) {
        flag &= ~mask;
    }

    public boolean isAnchor() {
        return (user_flag & LoginUserFlagMask.FLAG_ANCHOR) > 0;
    }

    /**
     * @param mask {@link LoginFlagMask}
     */
    public boolean getFlag(int mask) {
        return (flag & mask) > 0;
    }


    public boolean isCaptchaLogin() {
        return LoginMethod.CAPTCHACODE.equals(this.getLoginMethod());
    }
    
    public boolean isUsernameLogin() {
        return LoginMethod.USERNAME.equals(this.getLoginMethod());
    }

    public boolean isRealName() {
        return (attr & LoginAttrMask.REAL_NAME) > 0;
    }

    public boolean isBindPhone() {
        return (attr & LoginAttrMask.BIND_PHONE) > 0;
    }

    public boolean isBindEmail() {
        return (attr & LoginAttrMask.BIND_EMAIL) > 0;
    }

    public static class LoginAttrMask {

        /**
         * 实名标识
         */
        public static final int REAL_NAME = 1;

        /**
         * 用户当前是否有绑定手机号，1 表示有绑定。
         */
        public static final int BIND_PHONE = 1 << 1;
        public static final int BIND_EMAIL = 1 << 2;
        //        用户当前是否有已设置密码的登录凭证
        public static final int SET_PASSWORD = 1 << 3;
        /**
         * 实名标识
         */
        public static final int REAL_NAME_RX = 1 << 4;
    }

    public static class LoginFlagMask {
        /**
         * 1是否新用户
         */
        public static final int FLAG_NEW_USER = 1;
        /**
         * 2是否进行防沉迷控制
         */
        public static final int FLAG_SCREEN_TIME = 1 << 1;
        /**
         * 4-游客是否绑定了三方账号(仅在游客登录返回时有效)
         */
        public static final int FLAG_GUEST_BIND_THIRD = 1 << 2;
        /**
         * 8-已完成首次绑定手机
         */
        public static final int FLAG_FIRST_BIND_MOBILE = 1 << 3;
        /**
         * 16-已完成首次绑定 Email
         */
        public static final int FLAG_FIRST_BIND_MAIL = 1 << 4;
        /**
         * 32注销申请中
         */
        public static final int FLAG_DEREGISTER = 1 << 5;
    }

    public static class LoginUserFlagMask {
        /**
         * 主播达人
         */
        public static final int FLAG_ANCHOR = 1;
    }

    public boolean isPasswordSet() {
        return password_set;
    }

    public boolean isNewUser() {
        return BitUtil.IsBitOn(flag, 0);
    }

    public boolean isScreenTimeLimit() {
        return BitUtil.IsBitOn(flag, 1);
    }

    public boolean isGuestBindOtherAccount() {
        return BitUtil.IsBitOn(flag, 2);
    }

    public boolean isFinishFirstBindMobile() {
        return BitUtil.IsBitOn(flag, 3);
    }

    public boolean isFinishFirstBindMail() {
        return BitUtil.IsBitOn(flag, 4);
    }

    //注销中
    public boolean isDeregistering() {
        return BitUtil.IsBitOn(flag, 5);
    }

    public String getMethod() {
        return method;
    }

    public Object getExt() {
        return ext;
    }

    public void removeExtKey(String key) {
        if (ext != null && key != null) {
            ext.remove(key);
        }
    }

    public void setExtPhone(String phone) {
        if (phone != null) {
            Map<String, Object> extMap = ext == null ? new HashMap<>() : ext;
            extMap.put("phone", MobileUtils.getPhone(phone));
            ext = extMap;
        }
    }

    public void setExtEmail(String mail) {
        if (mail != null) {
            Map<String, Object> extMap = ext == null ? new HashMap<>() : ext;
            extMap.put("email", mail);
            ext = extMap;
        }
    }

    public void updateExt(Map<String, Object> extMap) {
        if (ext != null) {
            if (extMap != null) {
                ext.putAll(extMap);
            }
        } else {
            ext = extMap;
        }
    }


    public int getAge() {
        return age;
    }

    public int getSex() {
        return sex;
    }

    /**
     * @return 来源分类
     */
    public String getSourceChannel() {
        return source_channel == null ? "" : source_channel;
    }

    /**
     * @return 来源
     */
    public String getSource() {
        return source == null ? "" : source;
    }

    /**
     * @return 用户所属子渠道
     */
    public String getSubchannelid() {
        return subchannelid == null ? "" : subchannelid;
    }

    public String getInviter_openid() {
        return inviter_openid;
    }

    public String getTopinviter_openid() {
        return topinviter_openid;
    }

    public String getTid() {
        return tid;
    }

    public String getUid() {
        return uid;
    }

    public AccessToken getAccessToken() {
        return token;
    }

    public static LoginData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return LoginData.fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    public static LoginData fromJson(String jsonStr) {
        return new Gson().fromJson(jsonStr, LoginData.class);
    }

    public String toJson() {
        return new Gson().toJson(this);
    }
}


