package com.ruixue.openapi;

import androidx.annotation.NonNull;

import com.netease.yofun.external.HubAction;
import com.netease.yofun.external.data.PayInfo;
import com.netease.yofun.external.data.UserInfo;

/*********************************************************************
 * This file is part of YOFUN project
 * Copyright (c) 2018 NetEase, Inc. - All Rights Reserved
 *********************************************************************/

public abstract class HubActionAdapter implements HubAction {

    @Override
    public void onInit(int code, String msg) {/*do nothing*/}

    @Override
    public void onSplash() {/*do nothing*/}

    @Override
    public void onLogin(int code, String msg, @NonNull UserInfo info) {/*do nothing*/}

    @Override
    public void onPay(int code, String msg, @NonNull PayInfo info) {/*do nothing*/}

    @Override
    public void onLogout(int code) {/*do nothing*/}

    @Override
    public void onQuit(boolean realQuit) {/*do nothing*/}

    @Override
    public void onIsShowingSdkUi(boolean b) {/*do nothing*/}
}
