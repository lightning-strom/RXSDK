package com.ruixue.legal;

import androidx.annotation.Keep;

import com.ruixue.model.BaseResult;

/**
 * 法务请求结果实体
 */
@Keep
public class LegalResult extends BaseResult {

    @Keep
    private LegalData data;

    public LegalData getData() {
        return data;
    }

    public void setData(LegalData data) {
        this.data = data;
    }


}
