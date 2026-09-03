package com.ruixue.passport;

import android.text.TextUtils;

import com.ruixue.openapi.RXGlobalData;
import com.ruixue.utils.ResUtils;

import org.json.JSONObject;

import java.util.List;
import java.util.Map;

public class AccountHelper {

    //    public static void readOldRuiXueAccount() {
//        String RXACCOUNT = "rxlogin";
//        String strjson = SPUtils.getInstance().getString(RXACCOUNT, "");
//        List<OldAccount> rxAccounts = null;
//        if (!TextUtils.isEmpty(strjson)) {
//            rxAccounts = new Gson().fromJson(strjson, new TypeToken<List<OldAccount>>() {
//            }.getType());
//        }
//        if (rxAccounts != null) {
//            for (OldAccount oldAccount : rxAccounts) {
//                Account newAccount = Account.create(oldAccount.getOpenid());
//                newAccount.setUsername(oldAccount.getAccount());
//                newAccount.setHeaderUrl(oldAccount.getImgurl());
//                newAccount.setMethod(oldAccount.getMethod());
//                AccountManager.getInstance().updateAccount(newAccount);
//                RXLogger.i("move ruixue account:" + newAccount.toJson());
//            }
//            //            SPUtils.getInstance().remove(RXACCOUNT);
//        }
//    }
    public static String getDisplayUsername(String username, String method, String defaultName) {
        if (TextUtils.isEmpty(username)) {
            username = defaultName;
        }
        if (TextUtils.isEmpty(method)) {
            return username;
        } else if (method.equals("phone") || method.equals(LoginMethod.USERNAME) || method.equals(LoginMethod.CAPTCHACODE)) {
            if (username.startsWith("+") && username.length() > 5) {
                String reginCode = username.substring(1, 5);
                return "+" + Integer.valueOf(reginCode) + username.substring(5).replaceAll("(\\d{3})\\d{3}(\\d{1})", "$1***$2");
            } else {
                return username.replaceAll("(\\d{3})\\d{4}(\\d{4})", "$1****$2");
            }
        } else if (method.equals(LoginMethod.GUEST)) {
            return TextUtils.isEmpty(RXGlobalData.getGuestTitle()) ? ResUtils.getInstance().getString("rx_account_type_guest") : RXGlobalData.getGuestTitle() + "账号";
        } else {
            return username;
        }
    }


    /**
     * 往缓存中添加账号
     * 增加、修改、删除
     * @param openid
     * @param account
     * @param imgurl
     * @param password
     */
    public static void updateAccountCache(String openid, String account, String imgurl, String password) {
        Account account1 = Account.create(openid);
        account1.setUsername(account);
        account1.setPassword(password);
        account1.setHeaderUrl(imgurl);
        AccountManager.getInstance().updateAccount(account1);
    }

    public static void updateAccountCache(LoginData loginData) {
        updateAccountCache(loginData, null);
    }


    public static void syncAccounts(List<Map<String, String>> accounts) {
        for (Map<String, String> account : accounts) {
            Account a = Account.create(null);
            String username = account.get("username");
            if (!TextUtils.isEmpty(username)) {
                a.setUsername(username);
                a.setPassword(account.get("password"));
                a.setMethod(LoginMethod.USERNAME);
                AccountManager.getInstance().updateAccount(a);
            }
        }
    }

    public static void updateAccountCache(JSONObject loginData, String password) {
        LoginData loginDataObj = LoginData.fromJson(loginData);
        AccountManager.getInstance().updateAccount(loginDataObj, password);
    }

    public static void updateAccountCache(LoginData loginData, String password) {
        //只缓存用户名登录方式
        AccountManager.getInstance().updateAccount(loginData, password);
    }

    public static void updateAccountCache(LoginData loginData, String password, boolean add) {
        //只缓存用户名登录方式
        AccountManager.getInstance().updateAccount(loginData, password, add);
    }

    public static void deleteAccountByOpenid(String openid) {
        AccountManager.getInstance().removeByOpenid(openid);
    }

    public static void deleteAccountLoginOpenid(String login_openid) {
        AccountManager.getInstance().removeLoginOpenid(login_openid);
    }

    public static void deleteAccount(Account account) {
        AccountManager.getInstance().remove(account);
    }

    public static void updatePassword(String openid, String password) {
        Account account1 = Account.create(openid);
        account1.setPassword(password);
        AccountManager.getInstance().updateAccount(account1);
    }

    public static Account findAccountByOpenid(String openid, int defaultIdx) {
        return AccountManager.getInstance().findAccountByOpenid(openid, defaultIdx);
    }


    public static List<Account> getAccounts() {
        return AccountManager.getInstance().getAccounts();
    }

    public static int getAccountSize() {
        List<Account> accounts = AccountManager.getInstance().getAccounts();
        return accounts == null ? 0 : accounts.size();
    }


}
