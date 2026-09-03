package com.ruixue.callback;

public interface ILoginStatusChangeListener {

    /**
     * 未登陆
     */
    int STATE_NOT_LOGIN = 0;
    /**
     * 登陆中
     */
    int STATE_In_LOGIN = 1;
    /**
     * 已登陆
     */
    int STATE_LOGINED = 2;
    /**
     * 登出中
     */
    int STATE_LOGOUT = 4;

    /**
     * @param status {@link ILoginStatusChangeListener#STATE_NOT_LOGIN } 未登陆,
     *               {@link ILoginStatusChangeListener#STATE_In_LOGIN } 登陆中,
     *               {@link ILoginStatusChangeListener#STATE_LOGINED } 已登陆,
     *               {@link ILoginStatusChangeListener#STATE_LOGOUT } 登出中
     */
    void onLoginStatusChange(int status);
}
