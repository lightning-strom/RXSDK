package com.ruixue.huawei.moment;

import android.content.Context;
import android.content.pm.ActivityInfo;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.huawei.game.dev.gdp.android.sdk.api.PgsMoment;
import com.huawei.game.dev.gdp.android.sdk.api.bean.InstantPublishBean;
import com.huawei.game.dev.gdp.android.sdk.api.bean.MomentInitParam;
import com.huawei.game.dev.gdp.android.sdk.api.bean.Response;
import com.huawei.game.dev.gdp.android.sdk.api.callback.CheckAdultCallback;
import com.huawei.game.dev.gdp.android.sdk.api.callback.CheckSceneIdCallback;
import com.huawei.game.dev.gdp.android.sdk.api.callback.InstantPublishCallback;
import com.huawei.game.dev.gdp.android.sdk.api.callback.PgsInitCallback;
import com.huawei.game.dev.gdp.android.sdk.api.callback.PgsOpenCallback;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXErrorCode;
import com.ruixue.share.ShareData;
import com.ruixue.share.ShareDataResult;
import com.ruixue.share.ShareManager;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Created by wangliang on 2025/1/3
public class HuaweiMomentHelper {

    static class Single {
        final static HuaweiMomentHelper INSTANCE = new HuaweiMomentHelper();
    }

    private HuaweiMomentHelper() {
    }

    public static HuaweiMomentHelper getInstance() {
        return Single.INSTANCE;
    }

    /**
     * 初始化
     *
     * @param context  上下文，一般为 activity
     * @param params   初始化参数
     * @param callback 回调
     */
    public void init(Context context, Map<String, Object> params, RXJSONCallback callback) {
        String appId = (String) params.get("appId");
        String clientId = (String) params.get("clientId");
        String clientSecret = (String) params.get("clientSecret");
        String cpAccessToken = (String) params.get("cpAccessToken");
        int orientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
        if (params.containsKey("orientation")) {
            orientation = ObjectUtils.toInt(params.get("orientation"), ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        }

        MomentInitParam initParam = new MomentInitParam(context);
        initParam.setAppId(appId);
        initParam.setClientId(clientId);
        initParam.setClientSecret(clientSecret);
        initParam.setCpAccessToken(cpAccessToken);
        initParam.setOrientation(orientation);
        PgsMoment.init(initParam, new PgsInitCallback() {
            @Override
            public void onSuccess(Response response) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null) {
                        callback.onSuccess(null);
                    }
                });
            }

            @Override
            public void onFailure(Response response) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null) {
                        callback.onFailed(RXErrorCode.INIT_ERROR.toJSONObject(response.getRtnCode(), response.getMsg()));
                    }
                });
            }
        });
    }

    /**
     * 未成年检查
     *
     * @param callback 回调
     */
    public void checkAdult(RXJSONCallback callback) {
        PgsMoment.checkAdult(new CheckAdultCallback() {
            @Override
            public void onSuccess(int adult) {
                JSONObject json = new JSONObject();
                try {
                    json.put("adult", adult);
                } catch (JSONException e) {
                    throw new RuntimeException(e);
                }
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null)
                        callback.onSuccess(json);
                });
            }

            @Override
            public void onFailure(Response response) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(response.getRtnCode(), response.getMsg()));
                    }
                });
            }
        });
    }

    public void openForumPage(RXJSONCallback callback) {
        PgsMoment.open(new PgsOpenCallback() {
            @Override
            public void onSuccess(Response response) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null) {
                        callback.onSuccess(null);
                    }
                });
            }

            @Override
            public void onFailure(Response response) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(response.getRtnCode(), response.getMsg()));
                    }
                });
            }
        });
    }

    /**
     * 检查场景化入口
     *
     * @param sceneId  场景 ID
     * @param callback 回调
     */
    public void checkScene(String sceneId, RXJSONCallback callback) {
        PgsMoment.checkScene(sceneId, new CheckSceneIdCallback() {
            @Override
            public void onSuccess(String s, int i) {
                JSONObject json = new JSONObject();
                try {
                    json.put("valid", i == CheckSceneIdCallback.CHECK_STATUS_VALID);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null)
                        callback.onSuccess(json);
                });
            }

            @Override
            public void onFailure(String s, Response response) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(response.getRtnCode(), response.getMsg()));
                    }
                });
            }
        });
    }

    public void openScene(String sceneId, RXJSONCallback callback) {
        PgsMoment.openScene(sceneId, new PgsOpenCallback() {
            @Override
            public void onSuccess(Response response) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null)
                        callback.onSuccess(null);
                });
            }

            @Override
            public void onFailure(Response response) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(response.getRtnCode(), response.getMsg()));
                    }
                });
            }
        });
    }

    /**
     * 一键发布
     *
     * @param context     上下文，一般为 activity
     * @param shareReqMap 如果该参数为 null，则直接调起发布页，不带任何参数，如果非空则会从瑞雪SDK获取分享参数
     * @param callback    回调
     */
    public void publish(Context context, Map<String, Object> shareReqMap, RXJSONCallback callback) {
        if (shareReqMap != null) {
            //获取分享埋点数据
            boolean autoReport = true;
            if (shareReqMap.containsKey("auto_report")) {
                autoReport = ObjectUtils.toBoolean(shareReqMap.get("auto_report"));
            }
            final boolean autoReportFinal = autoReport;
            shareReqMap.put("platform", "hw_moment");
            RuiXueSdk.getApi().getShareData(shareReqMap, new RXJSONCallback() {

                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    if (data == null) {
                        publish(null, "", callback);
                        return;
                    }
                    try {
                        ShareData shareData = ShareData.fromJson(data);
                        String content = shareData.getContent().getContent();
                        List<ShareData.ImageBean> atlas = shareData.getContent().getAtlas();

                        ImageUtils.downloadImages(context, atlas, new ImageUtils.DownloadCallback() {
                            @Override
                            public void onComplete(List<String> filePaths) {
                                String[] images = null;
                                if (filePaths != null) {
                                    images = new String[filePaths.size()];
                                    for (int i = 0; i < filePaths.size(); i++) {
                                        images[i] = filePaths.get(i);
                                    }
                                }

                                publish(images, content, new RXJSONCallback() {
                                    @Override
                                    public void onSuccess(@Nullable JSONObject data) {
                                        if (callback != null) {
                                            callback.onSuccess(data);
                                        }
                                        shareReportSchedule(autoReportFinal, true, 0, shareData, shareReqMap);
                                    }

                                    @Override
                                    public void onFailed(@NonNull JSONObject cause) {
                                        if (callback != null) {
                                            callback.onFailed(cause);
                                        }
                                        int code = cause.optInt("code", RXErrorCode.SHARE_PARAMS_ERROR.getValue());
                                        shareReportSchedule(autoReportFinal, false, code, shareData, shareReqMap);
                                    }
                                });
                            }

                            @Override
                            public void onError(String msg) {
                                if (callback != null) {
                                    callback.onFailed(RXErrorCode.THIRD_UNKNOWN_ERROR.toJSONObject(-1, msg));
                                }
                            }
                        });
                    } catch (Exception e) {
                        publish(null, "", callback);
                    }
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    if (callback != null) {
                        callback.onFailed(cause);
                    }
                }
            });
        } else {
            publish(null, "", callback);
        }
    }

    /**
     * 一键发布
     *
     * @param images   String[] 本地图片路径数组
     * @param content  发表的动态内容
     * @param callback 回调
     */
    public void publish(String[] images, String content, RXJSONCallback callback) {
        InstantPublishBean bean = new InstantPublishBean(images, content);
        PgsMoment.publish(bean, new InstantPublishCallback() {
            @Override
            public void onSuccess(Response response) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null)
                        callback.onSuccess(null);
                });
            }

            @Override
            public void onFailure(Response response) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(response.getRtnCode(), response.getMsg()));
                    }
                });
            }
        });
    }

    @SuppressWarnings("unchecked")
    private void shareReportSchedule(boolean autoReport, boolean isSuccess, int errorCode, ShareData shareData, Map<String, Object> hashMap) {
        try {
            ShareDataResult shareResult = new ShareDataResult();
            if (autoReport && hashMap.containsKey("ext")) {
                shareResult.setExt((Map<String, Object>) hashMap.get("ext"));
            }
            shareResult.setData(shareData);

            if (isSuccess) {
                shareResult.setCode(RXErrorCode.SUCCESS.getValue());
                shareResult.setMsg("ok");
                if (autoReport) {
                    if (shareResult.getData() != null && shareResult.getData().getScheduling() == null) {
                        Map<String, Object> schedulingMap = new HashMap<>();
                        schedulingMap.put("scheduling_event", "done");
                        shareResult.getData().setScheduling(schedulingMap);
                    }
                    ShareManager.getInstance().shareReportSchedule(hashMap, shareResult);
                }
            } else {
                shareResult.setCode(errorCode);
                String errorMsg = "failed";
                try {
                    if (shareResult.getData().getScheduling() != null) {
                        Object errorObj = shareResult.getData().getScheduling().get("scheduling_failed_msg");
                        errorMsg = (String) errorObj;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                shareResult.setMsg(errorMsg);

                if (autoReport) {
                    if (shareResult.getData() != null && shareResult.getData().getScheduling() == null) {
                        Map<String, Object> schedulingMap = new HashMap<>();
                        schedulingMap.put("scheduling_event", "fail");
                        schedulingMap.put("scheduling_failed_msg", errorMsg);
                        shareResult.getData().setScheduling(schedulingMap);
                    }
                    ShareManager.getInstance().shareReportSchedule(hashMap, shareResult);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 关闭社区
     *
     * @param content  自定义弹窗正文，不超过50个字符。
     *                 若传入空字符串，则采用默认文案：“匹配成功，是否立即返回游戏？”
     * @param callback 回调
     */
    public void closeWithConfirm(String content, RXJSONCallback callback) {
        PgsMoment.closeWithConfirm(content, response -> {
            if (response.isSuccess()) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null)
                        callback.onSuccess(null);
                });
            } else {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(response.getRtnCode(), response.getMsg()));
                    }
                });
            }
        });
    }
}
