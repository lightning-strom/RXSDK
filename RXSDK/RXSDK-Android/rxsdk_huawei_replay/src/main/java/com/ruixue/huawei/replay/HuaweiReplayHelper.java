package com.ruixue.huawei.replay;

import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.huawei.game.replay.GameReplayManager;
import com.huawei.game.replay.callback.ReplayCallback;
import com.huawei.game.replay.common.model.ClipParam;
import com.huawei.game.replay.common.model.ExportParam;
import com.huawei.game.replay.common.model.InitParam;
import com.huawei.game.replay.common.model.InitResult;
import com.huawei.game.replay.common.model.RecordParam;
import com.huawei.game.replay.common.model.RecordResult;
import com.huawei.game.replay.common.model.ShareParam;
import com.huawei.game.replay.common.model.ShareResult;
import com.huawei.game.replay.common.model.TemplateResult;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXCustomShareConfig;
import com.ruixue.share.ShareData;
import com.ruixue.share.ShareDataResult;
import com.ruixue.share.ShareManager;
import com.ruixue.share.ShareMediaType;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Created by wangliang on 2025/1/3
public class HuaweiReplayHelper {

    static class Single {
        final static HuaweiReplayHelper INSTANCE = new HuaweiReplayHelper();
    }

    private HuaweiReplayHelper() {
    }

    public static HuaweiReplayHelper getInstance() {
        return Single.INSTANCE;
    }

    private GameReplayManager gameReplayManager;

    private OnRecordCallback mOnRecordCallback;

    private OnVideoClippedCallback mOnVideoClippedCallback;
    private OnVideoExportedCallback mOnVideoExportedCallback;
    private OnApplyShareCallback mOnApplyShareCallback;
    private OnQueryTemplatesCallback mOnQueryTemplatesCallback;

    /**
     * 初始化
     *
     * @param context  上下文，一般为 activity
     * @param params   Map，具体参数参考下边测试代码
     * @param callback 回调
     */
    public void init(@NonNull Context context, @NonNull Map<String, Object> params, OnInitCallback callback) {
        gameReplayManager = GameReplayManager.create(context.getApplicationContext(), new ReplayCallback() {
            @Override
            public void onInit(InitResult initResult) {
                RXLogger.d("onInit code:" + initResult.code + ", msg:" + initResult.msg);
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null) {
                        callback.onInit(initResult.code, initResult.msg);
                    }
                });
            }

            @Override
            public void onStart(RecordResult recordResult) {
                // 录制开始会回调此方法
                RXLogger.d("onStart code:" + recordResult.code + ", msg:" + recordResult.msg);
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (mOnRecordCallback != null) {
                        mOnRecordCallback.onStart(recordResult);
                    }
                });
            }

            @Override
            public void onStop(RecordResult recordResult) {
                RXLogger.d("onStop code:" + recordResult.code + ", msg:" + recordResult.msg);
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (mOnRecordCallback != null) {
                        mOnRecordCallback.onStop(recordResult);
                        mOnRecordCallback = null;
                    }
                });
            }

            @Override
            public void onVideoClipped(RecordResult recordResult) {
                //生成高光时刻时回调此方法
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (mOnVideoClippedCallback != null) {
                        mOnVideoClippedCallback.onVideoClipped(recordResult);
                        mOnVideoClippedCallback = null;
                    }
                });
            }

            @Override
            public void onVideoExported(RecordResult recordResult) {
                // 导出视频结果回调此方法
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (mOnVideoExportedCallback != null) {
                        mOnVideoExportedCallback.onVideoExported(recordResult);
                        mOnVideoExportedCallback = null;
                    }
                });
            }

            @Override
            public void onExportProgress(int percent) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (mOnVideoExportedCallback != null)
                        mOnVideoExportedCallback.onExportProgress(percent);
                });
            }

            @Override
            public void onQueryTemplates(TemplateResult templateResult) {
                // 查询模板时回调此方法
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (mOnQueryTemplatesCallback != null) {
                        mOnQueryTemplatesCallback.onQueryTemplates(templateResult);
                        mOnQueryTemplatesCallback = null;
                    }
                });
            }

            @Override
            public void onApplyShare(ShareResult shareResult) {
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (mOnApplyShareCallback != null) {
                        mOnApplyShareCallback.onApplyShare(shareResult);
                        mOnApplyShareCallback = null;
                    }
                });
            }

            @Override
            public void onError(RecordResult recordResult) {
                RXLogger.d("onError code:" + recordResult.code + ", msg:" + recordResult.msg);
                ThreadUtils.getInstance().runOnUiThread(() -> {
                    if (callback != null)
                        callback.onError(recordResult);
                });
            }
        });

        String agcAppId = (String) params.get("agcAppId"); // 应用 ID
        String clientId = (String) params.get("clientId"); // 客户端 ID
        String clientSecret = (String) params.get("clientSecret"); // 客户端秘钥
        String openId = (String) params.get("openId"); // 玩家的唯一ID标识
        String apiKey = (String) params.get("apiKey"); // API 秘钥
        String outputPath = (String) params.get("outputPath"); // 录制视频的存储目录
        InitParam initParam = new InitParam()
                .setClientAppId(agcAppId)
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setOpenId(openId)
                .setApiKey(apiKey)
                .setOutputPath(outputPath);
        gameReplayManager.init(initParam);
    }

    /**
     * 手动录制
     *
     * @param activity null: 系统录制模式(支持录制设备显示的wet全部画面) not null: 应用内录制模式(仅支持录制应用内显示画面)
     * @param filename 录制的文件名
     * @param duration 手动录制的最大时长，最长为1小时，单位为秒
     */
    public void startManualRecord(@Nullable Activity activity, String filename, int duration, OnRecordCallback callback) {
        if (gameReplayManager == null) {
            RXLogger.e("startManualRecord gameReplayManager is null, pls init first.");
            return;
        }
        mOnRecordCallback = callback;
        RecordParam recordParam = new RecordParam().setFileName(filename).setDuration(duration).setActivity(activity);
        gameReplayManager.startManualRecord(recordParam);
    }

    /**
     * 结束录制
     */
    public void stopRecord() {
        if (gameReplayManager == null) {
            RXLogger.e("stopRecord gameReplayManager is null, pls init first.");
            return;
        }

        gameReplayManager.stopRecord();
    }

    /**
     * 开启自动录制
     *
     * @param activity null: 系统录制模式(支持录制设备显示的wet全部画面) not null: 应用内录制模式(仅支持录制应用内显示画面)
     */
    public void startAutoRecord(@Nullable Activity activity, OnRecordCallback callback) {
        if (gameReplayManager == null) {
            RXLogger.e("startAutoRecord gameReplayManager is null, pls init first.");
            return;
        }
        mOnRecordCallback = callback;
        gameReplayManager.startAutoRecord(new RecordParam().setActivity(activity));
    }

    /**
     * 生成高光时刻
     *
     * @param filename 文件名
     * @param duration 生成高光时刻视频的时长，注意这里是从当前时刻往前 duration 作为视频起始时间
     * @param callback 回调
     */
    public void clipVideo(String filename, int duration, OnVideoClippedCallback callback) {
        if (gameReplayManager == null) {
            RXLogger.e("clipVideo gameReplayManager is null, pls init first.");
            return;
        }
        mOnVideoClippedCallback = callback;
        gameReplayManager.clipVideo(new ClipParam().setDuration(duration).setFileName(filename));
    }

    /**
     * 通过查询可用模板，可以查看当前游戏可使用的模板列表，用于后续视频的剪辑与导出。
     *
     * @param callback
     */
    public void queryTemplates(OnQueryTemplatesCallback callback) {
        if (gameReplayManager == null) {
            RXLogger.e("queryTemplates gameReplayManager is null, pls init first.");
            return;
        }
        mOnQueryTemplatesCallback = callback;
        gameReplayManager.queryTemplates();
    }

    /**
     * 导出视频
     *
     * @param filename            导出文件名
     * @param templateId          模板ID
     * @param importFilePaths     包含视频文件名的绝对路径列表,视频文件必须为.mp4格式,按顺序替换模板中的视频片段
     * @param replaceWords        用于替换视频模板文案的文字片段,最长30个字符,按顺序替换模板中的文字片段,为空则删除模板中的原文案内容,为null则不替换
     * @param replaceStickerPaths 包含图片文件名的绝对路径列表,图片文件仅支持.jpg/.png/.gif格式,按顺序替换模板中的图片,为空或为null则不替换
     * @param replaceAudioPaths   包含音频文件名的绝对路径列表,音频文件仅支持.mp3格式,按顺序替换模板中的音频片段,为空或为null则不替换
     */
    public void exportVideo(String filename,
                            String templateId,
                            List<String> importFilePaths,
                            List<String> replaceWords,
                            List<String> replaceStickerPaths,
                            List<String> replaceAudioPaths, OnVideoExportedCallback callback) {
        if (gameReplayManager == null) {
            RXLogger.e("exportVideo gameReplayManager is null, pls init first.");
            return;
        }

        mOnVideoExportedCallback = callback;
        ExportParam exportParam = new ExportParam()
                .setFileName(filename)
                .setTemplateId(templateId)
                .setImportFilePaths(importFilePaths)
                .setReplaceWords(replaceWords)
                .setReplaceStickerPaths(replaceStickerPaths)
                .setReplaceAudioPaths(replaceAudioPaths);
        gameReplayManager.exportVideo(exportParam);
    }

    /**
     * 申请分享链接
     *
     * @param filepath   使用模版生成的视频本地路径
     * @param templateId 模版 ID
     * @param callback   回调
     */
    public void applyShare(String filepath, String templateId, OnApplyShareCallback callback) {
        if (gameReplayManager == null) {
            RXLogger.e("applyShare gameReplayManager is null, pls init first.");
            return;
        }

        mOnApplyShareCallback = callback;
        gameReplayManager.applyShare(new ShareParam().setFilePath(filepath).setTemplateId(templateId));
    }

    /**
     * 一键分享
     *
     * @param activity    调用对应的 activity
     * @param filePaths   用于导出视频的高光时刻视频列表
     * @param shareReqMap 分享参数
     * @param callback    回调
     */
    public void share(Activity activity, List<String> filePaths, Map<String, Object> shareReqMap, RXJSONCallback callback) {
        if (shareReqMap == null) {
            if (callback != null) {
                callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject());
            }
            return;
        }

        shareReqMap.put("platform", "hw_replay");
        //获取分享埋点数据
        boolean autoReport = true;
        if (shareReqMap.containsKey("auto_report")) {
            autoReport = ObjectUtils.toBoolean(shareReqMap.get("auto_report"));
        }
        final boolean isAutoReport = autoReport;
        String androidProtocol = shareReqMap.containsKey("protocol_android") ? (String) shareReqMap.get("protocol_android") : "";
        String iosProtocol = shareReqMap.containsKey("protocol_ios") ? (String) shareReqMap.get("protocol_ios") : "";
        RXCustomShareConfig config = new RXCustomShareConfig();
        config.setPlatform("system"); // 这里只做系统分享
        config.setAndroidProtocol(androidProtocol);
        config.setIOSProtocol(iosProtocol);
        RuiXueSdk.getApi().getShareData(shareReqMap, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data == null) {
                    if (callback != null) {
                        callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject());
                    }
                    return;
                }

                try {
                    ShareData shareData = ShareData.fromJson(data);
                    if (shareData == null || shareData.getContent() == null) {
                        if (callback != null) {
                            callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject());
                        }
                        return;
                    }

                    config.setTitle(shareData.getContent().getTitle());

                    ShareData.TemplateBean templateBean = shareData.getContent().getTemplate();
                    if (templateBean == null) {
                        if (callback != null) {
                            callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject());
                        }
                        return;
                    }

                    List<String> stickerUrls = templateBean.getImages();
                    List<String> contents = templateBean.getContents();
                    List<String> audioUrls = templateBean.getAudios();
                    String templateId = templateBean.getTemplate_id();
                    String materialType = shareData.getContent().getMaterial_type();

                    List<String> downloadUrls = new ArrayList<>();
                    if (stickerUrls != null) {
                        downloadUrls.addAll(stickerUrls);
                    }

                    if (audioUrls != null) {
                        downloadUrls.addAll(audioUrls);
                    }
                    if (!downloadUrls.isEmpty()) {
                        MediaUtils.downloadFiles(activity, downloadUrls, new MediaUtils.DownloadCallback() {

                            @Override
                            public void onComplete(Map<String, String> url2PathMap) {
                                List<String> stickerPaths = new ArrayList<>();
                                if (stickerUrls != null) {
                                    for (String url : stickerUrls) {
                                        stickerPaths.add(url2PathMap.get(url));
                                    }
                                }

                                List<String> audioPaths = new ArrayList<>();
                                if (audioUrls != null) {
                                    for (String url : audioUrls) {
                                        audioPaths.add(url2PathMap.get(url));
                                    }
                                }
                                exportAndShare(activity, config, templateId, filePaths, contents, stickerPaths, audioPaths, materialType, isAutoReport, shareData, shareReqMap, callback);
                            }

                            @Override
                            public void onError(String msg) {
                                if (callback != null) {
                                    callback.onFailed(JSONUtil.toJSONObject(-1, msg));
                                }
                            }
                        });
                    } else {
                        exportAndShare(activity, config, templateId, filePaths, contents, null, null, materialType, isAutoReport, shareData, shareReqMap, callback);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    if (callback != null) {
                        callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject());
                    }
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }
        });
    }

    private void exportAndShare(Activity activity,
                                RXCustomShareConfig config,
                                String templateId,
                                List<String> importFilePaths,
                                List<String> replaceWords,
                                List<String> replaceStickerPaths,
                                List<String> replaceAudioPaths,
                                String materialType,
                                boolean autoReport,
                                ShareData shareData,
                                Map<String, Object> shareReqMap,
                                RXJSONCallback callback) {
        String filename = "export_video_" + System.currentTimeMillis() + ".mp4";
        exportVideo(filename, templateId, importFilePaths, replaceWords, replaceStickerPaths, replaceAudioPaths, new OnVideoExportedCallback() {
            @Override
            public void onVideoExported(RecordResult recordResult) {
                if (recordResult.code != 0) {
                    if (callback != null) {
                        callback.onFailed(RXErrorCode.UNKNOWN_ERROR.toJSONObject(recordResult.code, recordResult.msg));
                    }
                    return;
                }
                String videoPath = recordResult.filePath;
                File file = new File(videoPath);
                if (!file.exists()) {
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(-1, "export video failed"));
                    }
                    return;
                }
                if (ShareMediaType.VIDEO.equals(materialType)) {
                    // 直接分享视频
                    shareVideo(activity, videoPath, config, autoReport, shareData, shareReqMap, callback);
                } else {
                    // 再申请分享链接
                    applyShare(videoPath, templateId, shareResult -> {
                        if (recordResult.code != 0) {
                            if (callback != null) {
                                callback.onFailed(RXErrorCode.UNKNOWN_ERROR.toJSONObject(recordResult.code, recordResult.msg));
                            }
                            return;
                        }
                        shareUrl(activity, shareResult.getUrl(), config, autoReport, shareData, shareReqMap, callback);
                    });
                }
            }

            @Override
            public void onExportProgress(int percent) {
                RXLogger.d("onExportProgress percent:" + percent);
            }
        });
    }

    private void shareVideo(Activity context, String videoPath, RXCustomShareConfig config, boolean autoReport, ShareData shareData, Map<String, Object> shareReqMap, RXJSONCallback callback) {
        File videoFile = new File(videoPath);
        if (!videoFile.exists()) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(-1, "share video not exist."));
            }
            return;
        }

        config.setType(ShareMediaType.VIDEO);
        config.setUrl(videoPath);

        RuiXueSdk.getApi().shareCustom(context, config, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {

                if (callback != null) {
                    callback.onSuccess(data);
                }

                shareReportSchedule(autoReport, true, 0, shareData, shareReqMap);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }

                int code = cause.optInt("code", RXErrorCode.SHARE_PARAMS_ERROR.getValue());
                shareReportSchedule(autoReport, false, code, shareData, shareReqMap);
            }
        });
    }

    private void shareUrl(Activity activity, String url, RXCustomShareConfig config, boolean autoReport, ShareData shareData, Map<String, Object> shareReqMap, RXJSONCallback callback) {
        RXLogger.d("WLTest", "shareUrl " + url);
        config.setType(ShareMediaType.WEBPAGE);
        config.setUrl(url);
        RuiXueSdk.getApi().shareCustom(activity, config, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (callback != null) {
                    callback.onSuccess(data);
                }

                shareReportSchedule(autoReport, true, 0, shareData, shareReqMap);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
                int code = cause.optInt("code", RXErrorCode.SHARE_PARAMS_ERROR.getValue());
                shareReportSchedule(autoReport, false, code, shareData, shareReqMap);
            }
        });
    }

    @SuppressWarnings("unchecked")
    private void shareReportSchedule(boolean autoReport, boolean isSuccess, int errorCode, ShareData shareData, Map<String, Object> hashMap) {
        RXLogger.d("WLTest", "shareReportSchedule >> ");
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

}
