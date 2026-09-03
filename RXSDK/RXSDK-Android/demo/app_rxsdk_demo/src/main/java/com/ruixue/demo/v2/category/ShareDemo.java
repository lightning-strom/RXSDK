package com.ruixue.demo.v2.category;

import static com.ruixue.demo.config.TestButtonConfig.ACCENT;
import static com.ruixue.demo.config.TestButtonConfig.PRIMARY;

import android.app.Activity;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.callback.RXCallback;
import com.ruixue.demo.config.TestButtonConfig.ButtonGroup;
import com.ruixue.demo.share.ShareConsoleHost;
import com.ruixue.demo.share.ShareResultFormatter;
import com.ruixue.demo.share.ShareTestFormData;
import com.ruixue.demo.v2.DemoCategory;
import com.ruixue.demo.v2.DemoManager;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.share.ShareDataResult;

import org.json.JSONException;
import org.json.JSONObject;

public class ShareDemo extends DemoCategory {

    private final ShareConsoleHost host;

    private interface JsonAction {
        void run(@NonNull ShareTestFormData formData, @NonNull RXJSONCallback callback);
    }

    public ShareDemo(@NonNull Activity activity,
                     @NonNull DemoManager.ResultCallback callback,
                     @NonNull ShareConsoleHost host) {
        super(activity, callback);
        this.host = host;
    }

    @Override
    public String getName() {
        return "分享";
    }

    @Override
    public String getEmoji() {
        return "📤";
    }

    @Override
    protected void registerButtons(ButtonGroup group) {
        group.addButton(button("share_ui", "通路UI", PRIMARY, this::openShareUi));
        group.addButton(button("share_standard", "标准分享", ACCENT, this::shareStandard));
        group.addButton(button("share_custom", "自定义分享", this::shareCustom));
        group.addButton(button("share_data", "分享数据", this::getShareData));
        group.addButton(button("share_short", "短链", this::getShortUrl));
        group.addButton(button("share_schedule_init", "调度初始化", this::scheduleInit));
        group.addButton(button("share_schedule_report", "调度上报", this::scheduleReport));
    }

    public boolean onClick(@NonNull View view) {
        int id = view.getId();
        if (id == com.ruixue.qipai.R.id.btn_share_open_ui) {
            openShareUi();
        } else if (id == com.ruixue.qipai.R.id.btn_share_standard) {
            shareStandard();
        } else if (id == com.ruixue.qipai.R.id.btn_share_custom) {
            shareCustom();
        } else if (id == com.ruixue.qipai.R.id.btn_share_get_data) {
            getShareData();
        } else if (id == com.ruixue.qipai.R.id.btn_share_short_url) {
            getShortUrl();
        } else if (id == com.ruixue.qipai.R.id.btn_share_schedule_init) {
            scheduleInit();
        } else if (id == com.ruixue.qipai.R.id.btn_share_schedule_report) {
            scheduleReport();
        } else if (id == com.ruixue.qipai.R.id.btn_share_preset_wechat_link) {
            applyPreset(ShareTestFormData.presetWechatLink(), "已回填微信链接分享模板");
        } else if (id == com.ruixue.qipai.R.id.btn_share_preset_line_text) {
            applyPreset(ShareTestFormData.presetLineText(), "已回填 LINE 文本分享模板");
        } else if (id == com.ruixue.qipai.R.id.btn_share_preset_facebook_image) {
            applyPreset(ShareTestFormData.presetFacebookImage(), "已回填 Facebook 图片分享模板");
        } else if (id == com.ruixue.qipai.R.id.btn_share_preset_system_text) {
            applyPreset(ShareTestFormData.presetSystemText(), "已回填系统文本分享模板");
        } else if (id == com.ruixue.qipai.R.id.btn_share_preset_messenger_image) {
            applyPreset(ShareTestFormData.presetMessengerImage(), "已回填 Messenger 图片分享模板");
        } else if (id == com.ruixue.qipai.R.id.btn_share_preset_zalo_link) {
            applyPreset(ShareTestFormData.presetZaloLink(), "已回填 Zalo 链接分享模板");
        } else if (id == com.ruixue.qipai.R.id.btn_share_preset_snapchat_image) {
            applyPreset(ShareTestFormData.presetSnapchatImage(), "已回填 Snapchat 图片分享模板");
        } else if (id == com.ruixue.qipai.R.id.share_quick_share_flow) {
            runShareQuickFlow();
        } else if (id == com.ruixue.qipai.R.id.share_quick_report_flow) {
            runReportQuickFlow();
        } else {
            return false;
        }
        return true;
    }

    private void openShareUi() {
        executeJsonAction("通路UI", (formData, callback) ->
                RXSdkUI.getInstance().showShareUI(activity, "lure", formData.buildShareUiParams(), callback));
    }

    private void shareStandard() {
        executeJsonAction("标准分享", (formData, callback) -> {
            try {
                RXSdkApi.getInstance().share(activity, formData.toStandardShareConfig(), callback);
            } catch (Exception e) {
                callback.onFailed(buildLocalError("标准分享参数错误: " + e.getMessage()));
            }
        });
    }

    private void shareCustom() {
        executeJsonAction("自定义分享", (formData, callback) ->
                RXSdkApi.getInstance().shareCustom(activity, formData.toCustomShareConfig(), callback));
    }

    private void getShareData() {
        executeShareDataAction("分享数据", null);
    }

    private void getShortUrl() {
        executeJsonAction("短链", (formData, callback) ->
                RXSdkApi.getInstance().getShortUrl(formData.buildShortUrlRequest(), callback));
    }

    private void scheduleInit() {
        executeJsonAction("调度初始化", (formData, callback) ->
                RXSdkApi.getInstance().shareSchedulingInit(formData.buildScheduleInitRequest(), callback));
    }

    private void scheduleReport() {
        executeJsonAction("调度上报", (formData, callback) -> {
            try {
                RXSdkApi.getInstance().shareSchedulingReport(formData.buildScheduleReportRequest(), callback);
            } catch (Exception e) {
                callback.onFailed(buildLocalError("调度上报参数错误: " + e.getMessage()));
            }
        });
    }

    private void applyPreset(@NonNull ShareTestFormData formData, @NonNull String summary) {
        host.applyFormData(formData, summary);
        showToast(summary);
    }

    private void runShareQuickFlow() {
        host.clearFlowLog();
        host.appendFlowLog("分享快捷流开始");
        executeFlowJson("分享快捷流", "调度初始化", (formData, callback) ->
                        RXSdkApi.getInstance().shareSchedulingInit(formData.buildScheduleInitRequest(), callback),
                () -> executeFlowShareData("分享快捷流", "分享数据", () ->
                        executeFlowJson("分享快捷流", "标准分享", (formData, callback) -> {
                                    try {
                                        RXSdkApi.getInstance().share(activity, formData.toStandardShareConfig(), callback);
                                    } catch (Exception e) {
                                        callback.onFailed(buildLocalError("标准分享参数错误: " + e.getMessage()));
                                    }
                                },
                                () -> host.appendFlowLog("分享快捷流完成"))));
    }

    private void runReportQuickFlow() {
        host.clearFlowLog();
        host.appendFlowLog("调度上报流开始");
        executeFlowShareData("调度上报流", "分享数据", () ->
                executeFlowJson("调度上报流", "调度上报", (formData, callback) -> {
                            try {
                                RXSdkApi.getInstance().shareSchedulingReport(formData.buildScheduleReportRequest(), callback);
                            } catch (Exception e) {
                                callback.onFailed(buildLocalError("调度上报参数错误: " + e.getMessage()));
                            }
                        },
                        () -> host.appendFlowLog("调度上报流完成")));
    }

    private void executeJsonAction(@NonNull String title, @NonNull JsonAction action) {
        ShareTestFormData formData = host.getFormData();
        action.run(formData, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                host.renderResult(ShareResultFormatter.fromJson(title, data));
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                host.renderResult(ShareResultFormatter.fromJson(title + "失败", cause));
            }
        });
    }

    private void executeShareDataAction(@NonNull String title, @Nullable Runnable onNext) {
        ShareTestFormData formData = host.getFormData();
        RXSdkApi.getInstance().getShareData(formData.buildShareDataRequest(), new RXCallback<ShareDataResult>() {
            @Override
            public void onSuccess(@Nullable ShareDataResult data) {
                host.renderResult(ShareResultFormatter.fromShareDataResult(title, data));
                ShareResultFormatter.SelectionData selection = ShareResultFormatter.fromShareDataResult(data);
                if (selection.hasValue()) {
                    host.applyFormData(formData.withSelection(selection), "已根据分享数据回填素材、平台和策略ID");
                }
                if (onNext != null) {
                    onNext.run();
                }
            }

            @Override
            public void onFailed(@NonNull ShareDataResult cause) {
                host.renderResult(ShareResultFormatter.fromShareDataResult(title + "失败", cause));
            }

            @Override
            public void onError(com.ruixue.error.RXException e) {
                host.renderResult(ShareResultFormatter.fromText(title + "异常", e == null ? "未知错误" : e.getJSONString()));
            }
        });
    }

    private void executeFlowJson(@NonNull String flowTitle,
                                 @NonNull String actionTitle,
                                 @NonNull JsonAction action,
                                 @Nullable Runnable onNext) {
        ShareTestFormData formData = host.getFormData();
        host.appendFlowLog(flowTitle + " - 开始" + actionTitle);
        action.run(formData, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                host.renderResult(ShareResultFormatter.fromJson(actionTitle, data));
                host.appendFlowLog(flowTitle + " - " + actionTitle + "成功");
                if (onNext != null) {
                    onNext.run();
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                host.renderResult(ShareResultFormatter.fromJson(actionTitle + "失败", cause));
                host.appendFlowLog(flowTitle + " - " + actionTitle + "失败");
            }
        });
    }

    private void executeFlowShareData(@NonNull String flowTitle,
                                      @NonNull String actionTitle,
                                      @Nullable Runnable onNext) {
        host.appendFlowLog(flowTitle + " - 开始" + actionTitle);
        executeShareDataAction(actionTitle, () -> {
            host.appendFlowLog(flowTitle + " - " + actionTitle + "成功");
            if (onNext != null) {
                onNext.run();
            }
        });
    }

    @NonNull
    private JSONObject buildLocalError(@NonNull String message) {
        JSONObject error = new JSONObject();
        try {
            error.put("msg", message);
            error.put("code", -1);
        } catch (JSONException ignored) {
        }
        return error;
    }
}
