package com.ruixue.permission;

/**
 *    author : lee
 *    time   : 2022/01/17
 *    desc   : 权限设置页结果回调接口
 */
public interface OnPermissionPageCallback {

    /**
     * 权限已经授予
     */
    void onGranted();

    /**
     * 权限已经拒绝
     */
    void onDenied();
}