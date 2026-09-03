package com.ruixue.passport;

import com.ruixue.model.BaseResult;
import com.ruixue.passport.AccessToken;

public class RefreshToken extends BaseResult {
    private AccessToken data;
    public RefreshToken(AccessToken data) {
        this.data = data;
    }
    public AccessToken getToken() {
        return data;
    }
}
