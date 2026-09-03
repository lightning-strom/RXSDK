package com.ruixue.view;

import android.app.Activity;
import android.content.res.Configuration;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareManager;
import com.ruixue.share.ShareScene;
import com.ruixue.socialize.ShareDialogAction;
import com.ruixue.socialize.ShareDialogConfig;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/7/31
 */
public class ShareHelper {
    public static void showShareDialog(Activity activity, String shareType, Map<String, Object> map, RXJSONCallback callback) {
        ShareManager.getInstance().getPlatforms(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data != null) {
                    ArrayList<PlatformType> platformTypes = new ArrayList<>();
                    Iterator<String> it = data.keys();
                    while (it.hasNext()) {
                        String platform = it.next();
                        int scene = 0;
                        Object value = data.opt(platform);
                        if (value instanceof JSONObject) {
                            JSONObject shareConfig = (JSONObject) value;
                            scene = shareConfig.optInt(shareType, 0) - 1;
                        }
                        if (platform.equals(PlatformType.WECHAT.getKeyword())) {
                            if (scene < 0) {
                                platformTypes.add(PlatformType.WECHAT_SESSION);
                                platformTypes.add(PlatformType.WECHAT_CIRCLE);
                                platformTypes.add(PlatformType.WECHAT_FAVORITE);
                            } else if (scene == ShareScene.TIMELINE) {
                                platformTypes.add(PlatformType.WECHAT_CIRCLE);
                            } else if (scene == ShareScene.SESSION) {
                                platformTypes.add(PlatformType.WECHAT_SESSION);
                            }
                        } else {
                            if (platform.equals("system") || platform.equals("twitter") || platform.equals("qq")) {
                                continue;
                            }
                            try {
                                PlatformType platformType = PlatformType.valueOf(platform.toUpperCase());
                                if (platformType != PlatformType.NONE) {
                                    platformTypes.add(platformType);
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    }
                    ShareDialogAction shareAction = new ShareDialogAction(activity).setDisplayList(platformTypes);
                    ShareDialogConfig shareDialogConfig = new ShareDialogConfig();
                    Configuration configuration = activity.getResources().getConfiguration();
                    boolean isPortrait = configuration.orientation == Configuration.ORIENTATION_PORTRAIT;
                    shareDialogConfig.setShareLayoutPosition(isPortrait ? ShareDialogConfig.LAYOUT_POSITION_BOTTOM : ShareDialogConfig.LAYOUT_POSITION_CENTER);
                    shareDialogConfig.setMenuItemBackgroundShape(ShareDialogConfig.BG_SHAPE_ROUNDED_SQUARE);

                    shareDialogConfig.setShareParamsMap(map);
                    shareAction.setShareResultCallback(callback);
                    shareAction.setOnDismissListener(() -> {
                        if (callback != null) {
                            JSONObject cancelJsonObject = RXErrorCode.SHARE_CANCEL.toJSONObject();
                            RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(),
                                    "", "rxlog_error_share", cancelJsonObject);
                            callback.onFailed(cancelJsonObject);
                        }
                    });
                    //显示分享方式面板
                    shareAction.open(shareDialogConfig);
                } else {
                    if (callback != null)
                        callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject());
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null)
                    callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject());
            }
        });
    }
}
