package com.ruixue.passport;

import android.text.TextUtils;

import androidx.annotation.Keep;
import androidx.annotation.Nullable;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import com.google.gson.reflect.TypeToken;
import com.ruixue.utils.StringUtils;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Keep
public class Account implements Serializable {
    @Keep
    private String openid;
    @Keep
    private String login_openid;
    @Keep
    private String method;
    @Keep
    @SerializedName(value = "username", alternate = {"account"})
    private String username = "";
    @Keep
    private String password;
    @Keep
    private String headurl;
    @Keep
    private String cp_user_id;

    @Keep
    private String nickname;
    @Keep
    private int sex = -1;

    @Keep
    public Account(String openid) {
        this.openid = openid;
    }

    @Keep
    @Nullable
    public String getUsername() {
        return username;
    }

    public String getDisplayUsername() {
        return StringUtils.enforceLTR(AccountHelper.getDisplayUsername(username, getMethod(), getNickname()));
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getNickname() {
        return nickname;
    }

    @Keep
    public Account setUsername(String username) {
        this.username = username;
        return this;
    }

    @Keep
    public String getPassword() {
        return password;
    }

    @Keep
    public Account setPassword(String password) {
        this.password = password;
        return this;
    }

    @Keep
    @Nullable
    public String getOpenid() {
        return TextUtils.isEmpty(openid) ? "" : openid;
    }

    @Keep
    public int getSex() {
        return sex;
    }

    @Keep
    public Account setSex(int sex) {
        this.sex = sex;
        return this;
    }

    @Keep
    String getCp_user_id() {
        return TextUtils.isEmpty(cp_user_id) ? "" : cp_user_id;
    }

    @Keep
    public Account setCp_user_id(String cpUserId) {
        this.cp_user_id = cpUserId;
        return this;
    }

    @Keep
    public Account setMethod(String method) {
        if (!TextUtils.isEmpty(method))
            this.method = method;
        return this;
    }

    @Keep
    public String getMethod() {
        return method;
    }

    @Keep
    public String getHeaderUrl() {
        return headurl;
    }

    @Keep
    public Account setHeaderUrl(String headurl) {
        this.headurl = headurl;
        return this;
    }

    @Keep
    public void setLoginOpenid(String login_openid) {
        this.login_openid = login_openid;
    }

    @Keep
    public String getLoginOpenid() {
        return login_openid;
    }


    @Keep
    public void update(Account newAccount) {
        if (null == newAccount) {
            return;
        }
        // 这里账号不能包含 *，否则会出现不更新的问题
        if (!TextUtils.isEmpty(newAccount.getUsername()) && !newAccount.getUsername().contains("*")) {
            this.username = newAccount.getUsername();
        }
        if (TextUtils.isEmpty(this.openid) && !TextUtils.isEmpty(newAccount.getOpenid())) {
            this.openid = newAccount.getOpenid();
        }
        if (!TextUtils.isEmpty(newAccount.getPassword()))
            this.password = newAccount.getPassword();
        if (!TextUtils.isEmpty(newAccount.getMethod()))
            this.method = newAccount.getMethod();
        if (!TextUtils.isEmpty(newAccount.getHeaderUrl()))
            this.headurl = newAccount.getHeaderUrl();
        if (!TextUtils.isEmpty(newAccount.getLoginOpenid()))
            this.login_openid = newAccount.getLoginOpenid();
        if (!TextUtils.isEmpty(newAccount.getNickname()))
            this.nickname = newAccount.getNickname();
        if (-1 != newAccount.getSex())
            this.sex = newAccount.getSex();
        this.cp_user_id = newAccount.getCp_user_id();

    }

    @Keep
    public static List<Account> fromJson(String jsonStr) {
        return new Gson().fromJson(jsonStr, new TypeToken<List<Account>>() {
        }.getType());
    }

    @Keep
    public String toJson() {
        return new Gson().toJson(this);
    }

    @Keep
    public Map<String, Object> toLoginReqMap() {
        Map<String, Object> hashmap = new HashMap<>();
        hashmap.put("method", method);
        if (!TextUtils.isEmpty(login_openid))
            hashmap.put("login_openid", login_openid);
        if (!TextUtils.isEmpty(username))
            hashmap.put("username", username);
        if (!TextUtils.isEmpty(password))
            hashmap.put("password", password);
        return hashmap;
    }

    @Keep
    public static Account create(String openid) {
        return new Account(openid);
    }

    //-------------------------------------------------------------

}
