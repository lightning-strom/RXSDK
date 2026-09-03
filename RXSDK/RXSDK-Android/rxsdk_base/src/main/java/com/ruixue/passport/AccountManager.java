package com.ruixue.passport;

import android.text.TextUtils;

import androidx.annotation.Nullable;

import com.ruixue.logger.Logger;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

final class AccountManager {
    private static AccountManager instanceField;

    public static AccountManager getInstance() {
        if (instanceField == null) {
            synchronized (AccountManager.class) {
                if (instanceField == null) {
                    instanceField = new AccountManager();
                }
                return instanceField;
            }
        } else {
            return instanceField;
        }
    }

    private List<Account> mAccount;
    private final AccountCache mAccountCache;
    private boolean isLoaded = false;

    public AccountManager() {
        mAccountCache = new AccountCache(PassportManager.SHARED_PREFERENCES_NAME);
    }

    public List<Account> getAccounts() {
        if (!isLoaded) {
            this.load();
        }
        return this.mAccount;
    }

    public List<Account> getAccountsByMethod(  String method) {
        List<Account> accounts = getAccounts();
        List<Account> filter = new ArrayList<>();
        if (accounts != null) {
            for (Account account : accounts) {
                if (account.getMethod().equals(method)) {
                    filter.add(account);
                }
            }
        }
        return filter;
    }


    public List<Account> load() {
        this.mAccount = this.mAccountCache.load();
        isLoaded = true;
        if (null == this.mAccount) {
            this.mAccount = new ArrayList<>();
        }
//        AccountHelper.readOldRuiXueAccount();
        return this.mAccount;
    }

    public void flush() {
        if (this.mAccount != null) {
            this.mAccountCache.save(this.mAccount);
        }
    }

    public void updateAccount(LoginData loginData, String password, boolean add) {
        try {
            String oldopenid = loginData.getOldOpenid();
            if (!TextUtils.isEmpty(oldopenid) && !oldopenid.equals(loginData.getOpenid())) {
                removeByOpenid(oldopenid);
            }
            Account account1 = Account.create(loginData.getOpenid());
            account1.setUsername(loginData.getUsername());
            account1.setLoginOpenid(loginData.getLoginOpenid());
            account1.setHeaderUrl(loginData.getAvatar());
            account1.setMethod(loginData.getLoginMethod());
            account1.setNickname(loginData.getNickname());
            account1.setPassword(password);
            account1.setSex(loginData.getSex());
            account1.setCp_user_id(loginData.getCp_user_id());
            updateAccount(account1, add);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void updateAccount(LoginData loginData, String password) {
        updateAccount(loginData, password, true);
    }

    public void updateAccount(Account newAccount) {
        updateAccount(newAccount, true);
    }


    public void updateAccount(Account newAccount, boolean add) {
        try {
            if (null == this.mAccount) {
                this.mAccount = new ArrayList<>();
            }
            if (null != newAccount) {
                Account account = findAccount(newAccount);
                if (null != account) {
                    account.update(newAccount);
                    int idx = this.mAccount.indexOf(account);
                    if (idx > 0 && idx < this.mAccount.size()) {
                        this.mAccount.remove(idx);
                        this.mAccount.add(0, account);
                    }
                } else if (!TextUtils.isEmpty(newAccount.getMethod()) && add) {
                    this.mAccount.add(0, newAccount);
                } else {
                    return;
                }
                this.flush();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Nullable
    private Account findAccount(Account newAccount) {
        Account account = findAccountByOpenid(newAccount.getOpenid(), -1);
        if (account == null && !TextUtils.isEmpty(newAccount.getUsername())) {
            account = findAccountByUserName(newAccount.getUsername(), -1);
        }
        return account;
    }

    public Account findAccountByOpenid(String openid, int defaultIdx) {
        if (null != this.mAccount) {
            int len = this.mAccount.size();
            if (!TextUtils.isEmpty(openid)) {
                for (int i = 0; i < len; i++) {
                    Account account = this.mAccount.get(i);
                    if (!TextUtils.isEmpty(account.getOpenid()) && account.getOpenid().equals(openid)) {
                        Logger.e("rxaccount:"+account.toJson());
                        return account;
                    }
                }
            }
            if (defaultIdx >= 0 && defaultIdx < len) {
                return this.mAccount.get(defaultIdx);
            }
        }
        return null;
    }

    public Account findAccountByUserName(String username, int defaultIdx) {
        if (null != this.mAccount) {
            int len = this.mAccount.size();
            if (!TextUtils.isEmpty(username)) {
                for (int i = 0; i < len; i++) {
                    Account account = this.mAccount.get(i);
                    if (!TextUtils.isEmpty(account.getUsername()) && account.getUsername().equals(username)) {
                        return account;
                    }
                }
            }
            if (defaultIdx >= 0 && defaultIdx < len) {
                return this.mAccount.get(defaultIdx);
            }
        }
        return null;
    }

    public void remove(List<Account> accounts) {
        if (this.mAccount != null) {
            for (Account obj : accounts) {
                remove(obj);
            }
            this.flush();
        }
    }

    public boolean remove(Account accounts) {
        if (this.mAccount != null) {
            boolean ok;
            if (!TextUtils.isEmpty(accounts.getOpenid())) {
                ok = removeByOpenid(accounts.getOpenid());
            } else {
                ok = removeByUserName(accounts.getUsername());
            }
            return ok;
        }
        return false;
    }

    public boolean removeByOpenid(String openid) {
        if (openid != null && this.mAccount != null) {
            Iterator<Account> iterator = this.mAccount.iterator();
            boolean changed = false;
            while (iterator.hasNext()) {
                Account account = iterator.next();
                if (account != null && account.getOpenid() != null && account.getOpenid().equals(openid)) {
                    iterator.remove();
                    changed = true;
                }
            }
            if (changed) {
                this.flush();
            }
            return changed;
        }
        return false;

    }

    public boolean removeByUserName(String userName) {
        if (this.mAccount != null && userName != null) {
            Iterator<Account> iterator = this.mAccount.iterator();
            boolean changed = false;
            while (iterator.hasNext()) {
                Account account = iterator.next();
                if (null != account.getUsername() && account.getUsername().equals(userName)) {
                    iterator.remove();
                    changed = true;
                }
            }
            if (changed) {
                this.flush();
            }
            return changed;
        }
        return false;
    }

    public boolean removeLoginOpenid(String login_openid) {
        if (this.mAccount != null && !TextUtils.isEmpty(login_openid)) {
            Iterator<Account> iterator = this.mAccount.iterator();
            boolean changed = false;
            while (iterator.hasNext()) {
                Account account = iterator.next();
                if (!TextUtils.isEmpty(account.getLoginOpenid()) && account.getLoginOpenid().equals(login_openid)) {
                    account.setLoginOpenid(null);
                    changed = true;
                }
            }
            if (changed) {
                this.flush();
            }
            return changed;
        }
        return false;
    }

    public boolean removeByMethod(String method) {
        if (this.mAccount != null && method != null) {
            Iterator<Account> iterator = this.mAccount.iterator();
            boolean changed = false;
            while (iterator.hasNext()) {
                Account account = iterator.next();
                if (account.getMethod().equals(method)) {
                    iterator.remove();
                    changed = true;
                }
            }
            if (changed) {
                this.flush();
            }
            return changed;
        }
        return false;
    }

    public void removeAll() {
        if (null != this.mAccount) {
            this.mAccount.clear();
            this.mAccountCache.remove();
        }
    }
}
