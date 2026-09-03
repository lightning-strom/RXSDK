package com.ruixue.share;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.model.BaseResult;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;

@Keep
public class ShareDataResult extends BaseResult {
    @Keep
    protected ShareData data;
    @Keep
    protected Map<String, Object> ext;

    @Keep
    public Map<String, Object> getExt() {
        return ext;
    }

    /**
     *
     * @param ext 自定义数据数据
     */
    @Keep
    public void setExt(Map<String, Object> ext) {
        this.ext = ext;
    }

    @Keep
    public ShareData getData() {
        return data;
    }

    @Keep
    public void setData(ShareData data) {
        this.data = data;
    }


    @Keep
    public static ShareDataResult fromJson(String jsonStr) {
        return new Gson().fromJson(jsonStr, ShareDataResult.class);
    }

    public JSONObject toJSONObject() {
        return JSONUtil.toJSONObject(new Gson().toJson(this));
    }
}
