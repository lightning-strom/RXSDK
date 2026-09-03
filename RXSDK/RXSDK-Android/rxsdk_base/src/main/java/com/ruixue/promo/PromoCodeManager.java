package com.ruixue.promo;

import android.os.Handler;
import android.os.HandlerThread;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * 福利码
 * <p>
 * Created by wangliang on 2024/9/2
 */
public class PromoCodeManager {

    // 请求的最小时间间隔，客户端默认值
    private static final long MIN_INTERVAL_SECONDS = 10L;

    // 默认值为 MIN_INTERVAL_SECONDS， 如果后端下发则以后端为准
    private long requestIntervalSeconds = MIN_INTERVAL_SECONDS;

    private HandlerThread handlerThread = new HandlerThread("PromoCodeHandler");
    private Handler handler;
    private String gameId;

    private final Runnable runnable = () -> doRequest(false);

    private static class Single {
        static PromoCodeManager sInstance = new PromoCodeManager();
    }

    public PromoCodeManager() {
        handlerThread.start();
        handler = new Handler(handlerThread.getLooper());
    }

    public static PromoCodeManager getInstance() {
        return PromoCodeManager.Single.sInstance;
    }

    /**
     * 开启获取福利码请求的循环
     */
    public void init(String gameId) {
        RXLogger.d("PromoCodeManager init");
        reset();
        this.gameId = gameId;
    }

    private void doRequest(boolean force) {
        RXLogger.d("PromoCodeManager doRequest");

        Map<String, Object> params = new HashMap<>();
        params.put("game_id", gameId);

        ThreadUtils.getInstance().runOnBgThreadUseExecutor(() -> RXRequest.create(RXApiPath.PROMO_GET_API).setNeedLoggedIn(true).setBody(params).get(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data == null) {
                    if (mAutoRefresh) {
                        handler.removeCallbacks(runnable);
                        handler.postDelayed(runnable, requestIntervalSeconds * 1000L);
                    } else {
                        // 非自动刷新，data 为空抛出一个错误，正常也不会出现这种 case
                        ThreadUtils.getMainLooperHandler().post(() -> {
                            mCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_ERROR.getValue(), "data is null"));
                        });
                    }
                    return;
                }

                long refreshPeriodExp = data.optLong("refresh_period_exp");
                long polling = data.optLong("polling");
                if (polling > 0) {
                    requestIntervalSeconds = polling;
                }
                ThreadUtils.getMainLooperHandler().post(() -> {
                    if (mCallback != null) {
                        String promoCode = data.optString("promo_code");
                        if (force) {
                            RXLogger.d("PromoCodeManager promo code force callback data");
                            mLastCallbackPromoCode = promoCode;
                            mCallback.onSuccess(data);
                        } else {
                            if (!promoCode.equals(mLastCallbackPromoCode)) {
                                RXLogger.d("PromoCodeManager promo code auto callback data");
                                mLastCallbackPromoCode = promoCode;
                                mCallback.onSuccess(data);
                            } else {
                                RXLogger.d("PromoCodeManager promo code had callback, so do nothing.");
                            }
                        }
                    }
                });

                if (mAutoRefresh) {
                    if (refreshPeriodExp < 1) {
                        RXLogger.d("PromoCodeManager next request in " + requestIntervalSeconds + " seconds, because refresh_period_exp < 1");
                        handler.removeCallbacks(runnable);
                        handler.postDelayed(runnable, requestIntervalSeconds * 1000L);
                    } else {
                        RXLogger.d("PromoCodeManager next request in " + refreshPeriodExp + " seconds");
                        handler.removeCallbacks(runnable);
                        handler.postDelayed(runnable, refreshPeriodExp * 1000L);
                    }
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                ThreadUtils.getMainLooperHandler().post(() -> {
                    if (mCallback != null) {
                        mCallback.onFailed(cause);
                    }
                });
            }

            @Override
            public void onError(RXException e) {
                // 自动刷新直接进入下一次循环，否则直接 callback 错误即可
                if (mAutoRefresh) {
                    RXLogger.d("PromoCodeManager next request in " + requestIntervalSeconds + " seconds, because onError");
                    handler.removeCallbacks(runnable);
                    handler.postDelayed(runnable, requestIntervalSeconds * 1000L);
                } else {
                    ThreadUtils.getMainLooperHandler().post(() -> {
                        if (mCallback != null) {
                            mCallback.onFailed(e.toJSONObject());
                        }
                    });
                }
            }
        }));
    }

    private RXJSONCallback mCallback;
    private boolean mAutoRefresh;
    private String mLastCallbackPromoCode;

    /**
     * SDK 向外暴漏的福利码
     */
    public void getCode(boolean autoRefresh, RXJSONCallback callback) {
        mCallback = callback;
        mAutoRefresh = autoRefresh;
        if (handler != null) {
            handler.removeCallbacksAndMessages(null);
        }
        doRequest(true);
    }

    /**
     * SDK 向外暴漏 兑换达人福利码
     *
     * @param cdKey
     * @param callback
     */
    public void exchangeCDKey(String cdKey, RXRequestCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("cdkey", cdKey);
        RXRequest.create(RXApiPath.PROMO_EXCHANGE).setRestfulData(false).setNeedLoggedIn(true).setBody(map).postAsync(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                ThreadUtils.getMainLooperHandler().post(() -> {
                    if (callback != null) {
                        callback.onResponse(data);
                    }
                });
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                ThreadUtils.getMainLooperHandler().post(() -> {
                    if (callback != null) {
                        callback.onResponse(cause);
                    }
                });
            }
        });
    }

    public void reset() {
        RXLogger.d("PromoCodeManager reset");
        requestIntervalSeconds = MIN_INTERVAL_SECONDS;
        mCallback = null;
        mAutoRefresh = false;
        mLastCallbackPromoCode = null;
        if (handler != null) {
            handler.removeCallbacksAndMessages(null);
        }
    }
}
