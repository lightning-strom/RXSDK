package com.ruixue.openapi;

import android.app.Activity;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.PresetEventHelper;
import com.ruixue.base.TrackDataMgr;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXException;
import com.ruixue.net.HttpClient;
import com.ruixue.net.HttpMethod;
import com.ruixue.net.HttpUtil;
import com.ruixue.net.RXRequest;
import com.ruixue.net.RequestManager;
import com.ruixue.net.URLHelper;
import com.ruixue.passport.PassportManager;
import com.ruixue.share.ShareManager;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.view.CaptchaVerifyView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public final class RXApiHelper {

    public static RXRequest createApiRequest(String apiPath, Map<String, Object> bodyMap) {
        return RXRequest.create(apiPath).setBody(bodyMap);
    }

    public static RXRequest createApiRequest(String apiPath, String jsonBody) {
        return RXRequest.create(apiPath).setBody(jsonBody);
    }

    public static void sendApiRequest(String apiPath, Map<String, Object> bodyMap, RXJSONCallback callback) {
        createApiRequest(apiPath, bodyMap).postAsync(callback);
    }

    public static void sendApiRequest(String apiPath, String jsonBody, RXJSONCallback callback) {
        createApiRequest(apiPath, jsonBody).postAsync(callback);
    }

    public static void bindAdid(Map<String, Object> bodyMap, RXJSONCallback callback) {
        createApiRequest(RXApiPath.BIND_ADID, bodyMap).postAsync(callback);
    }

    public static void exchange(Map<String, Object> hashMap, RXJSONCallback callback) {
        RXRequest.create(RXApiPath.Pay.EXCHANGE).setBody(hashMap).sign(true).postAsync(callback);
    }

    public static class VersionCheck {
        public static void checkAppUpdate(String version, String region, Map<String, Object> queryMap, RXStringCallback callback) {
            String api = String.format("v1/vcapi/update/%s/%s/%s/%s/%s", RXGlobalData.getProductId(), RXGlobalData.getChannelId(), version, RuiXueSdk.getDeviceCode().replaceAll("[^a-zA-Z0-9]", "-"), region);
            queryMap = queryMap == null ? new HashMap<>() : queryMap;
            if (!queryMap.containsKey("format")) {
                queryMap.put("format", "json");
            }
            if (!queryMap.containsKey("local_country")) {
                queryMap.put("local_country", RXGlobalData.COUNTRY);
            }
            String query = URLHelper.buildQuery(queryMap);
            ThreadUtils.getInstance().runOnBgThreadUseExecutor(() -> {
                HttpClient.requestString(HttpMethod.GET, api, query, HttpUtil.getDefaultHeaders(), handleData(getCallback(callback)));
            });
        }

        @NonNull
        private static RXStringCallback handleData(RXStringCallback callback) {
            return new RXStringCallback() {
                @Override
                public void onSuccess(@Nullable String data) {
                    try {
                        if (data != null) {
                            JSONObject jsonObject = new JSONObject(data);
                            JSONObject vData = new JSONObject(jsonObject.optString("data"));
                            JSONArray lc = vData.optJSONArray("login_config");
                            if (lc != null && lc.length() == 1) {
                                JSONObject first = lc.optJSONObject(0);
                                if (first != null && first.has("region_tag")) {
                                    String vc = first.getString("region_tag");
                                    RXGlobalData.setGameRegionTag(vc);
                                }
                            }
                        }
                    } catch (JSONException ignored) {
                    }

                    if (callback != null)
                        callback.onSuccess(data);
                }

                @Override
                public void onFailed(int code, String msg, @Nullable String traceId) {
                    if (callback != null)
                        callback.onFailed(code, msg, traceId);

                }
            };
        }

        @NonNull
        private static RXStringCallback getCallback(RXStringCallback callback) {
            PresetEventHelper.checkVersion(PresetEventHelper.VERSIONCHECK_STAGE_START, null, null);
            return new RXStringCallback() {
                @Override
                public void onSuccess(@Nullable String data) {
                    if (callback != null)
                        callback.onSuccess(data);
                    PresetEventHelper.checkVersion(PresetEventHelper.VERSIONCHECK_STAGE_SUCCESS, null, null);
                }

                @Override
                public void onFailed(int code, String msg, @Nullable String traceId) {
                    if (callback != null)
                        callback.onFailed(code, msg, traceId);
                    PresetEventHelper.checkVersion(PresetEventHelper.VERSIONCHECK_STAGE_FAILED, "" + code, msg);

                }
            };
        }

        public static void checkAppUpdate(HttpMethod method, String version, String region, String type, Map<String, Object> queryMap, RXStringCallback callback) {
            Map<String, Object> apiQueryMap = new HashMap<>();
            if (!TextUtils.isEmpty(type)) {
                apiQueryMap.put("type", type);
            }
            if (queryMap != null && queryMap.containsKey("format")) {
                Object formatValueObject = queryMap.remove("format");
                if (formatValueObject instanceof String) {
                    String formatValue = (String) formatValueObject;
                    if (!TextUtils.isEmpty(formatValue)) {
                        apiQueryMap.put("format", formatValue);
                    }
                }
            }
            if (!apiQueryMap.containsKey("local_country")) {
                apiQueryMap.put("local_country", RXGlobalData.COUNTRY);
            }
            String apiQuery = URLHelper.buildQuery(apiQueryMap);
            if (!TextUtils.isEmpty(apiQuery)) {
                apiQuery = "?" + apiQuery;
            }
            String api = String.format("v1/vcapi/update/%s/%s/%s/%s/%s%s", RXGlobalData.getProductId(), RXGlobalData.getChannelId(), version, RuiXueSdk.getDeviceCode().replaceAll("[^a-zA-Z0-9]", "-"), region, apiQuery);
            queryMap = queryMap == null ? new HashMap<>() : queryMap;
            String query = method == HttpMethod.GET ? URLHelper.buildQuery(queryMap) : new JSONObject(queryMap).toString();
            ThreadUtils.getInstance().runOnBgThreadUseExecutor(() -> {
                HttpClient.requestString(method, api, query, HttpUtil.getDefaultHeaders(), handleData(getCallback(callback)));
            });
        }


        public static void checkActivityUpdate(String activityshortname, String activityversion, String activitycheckversion, Map<String, Object> queryMap, RXStringCallback callback) {
            //            https://ruixue.weiletest.com/v1/vcapi/update_activity/xxx/1?format=json
            String api = String.format("v1/vcapi/update_activity/%s/%s/%s", activityshortname, activityversion, activitycheckversion);
            queryMap = queryMap == null ? new HashMap<>() : queryMap;
            if (!queryMap.containsKey("format")) {
                queryMap.put("format", "json");
            }
            if (!queryMap.containsKey("local_country")) {
                queryMap.put("local_country", RXGlobalData.COUNTRY);
            }
            String query = URLHelper.buildQuery(queryMap);
            ThreadUtils.getInstance().runOnBgThreadUseExecutor(() -> {
                HttpClient.requestString(HttpMethod.GET, api, query, HttpUtil.getDefaultHeaders(), callback);
            });
        }

        public static void checkGameUpdate(String gameid, String gameversion, String gamecheckversion, Map<String, Object> queryMap, RXStringCallback callback) {
            String api = String.format("v1/vcapi/update_game/%s/%s/%s", gameid, gameversion, gamecheckversion);
            queryMap = queryMap == null ? new HashMap<>() : queryMap;
            if (!queryMap.containsKey("format")) {
                queryMap.put("format", "json");
            }
            if (!queryMap.containsKey("local_country")) {
                queryMap.put("local_country", RXGlobalData.COUNTRY);
            }
            String query = URLHelper.buildQuery(queryMap);
            ThreadUtils.getInstance().runOnBgThreadUseExecutor(() -> {
                HttpClient.requestString(HttpMethod.GET, api, query, HttpUtil.getDefaultHeaders(), callback);
            });
        }
    }


    /**
     * 埋点数据上报
     */
    public static final class Data {
        /**
         * @param eventName     事件名称
         * @param properties    自定义属性
         * @param flushInterval -1时，默认 1 分钟上报一次
         * @param maxCacheCount -1时，默认 缓存数据超过 100 条触发上报
         */
        public static boolean track(String eventName, String distinctId, Map<String, Object> properties, int flushInterval, int maxCacheCount) {
            return TrackDataMgr.getInstance().track(eventName, distinctId, properties, flushInterval, maxCacheCount);
        }

        public static boolean report(String type, String eventName, String distinctId, Map<String, Object> properties, int flushInterval, int maxCacheCount) {
            return TrackDataMgr.getInstance().report(type, eventName, distinctId, properties, flushInterval, maxCacheCount);
        }

        /**
         * 单独设置上报时间间隔（毫秒）
         */
        public static void setFlushInterval(int flushInterval) {
            TrackDataMgr.getInstance().setFlushInterval(flushInterval);
        }

        /**
         * 单独设置最大缓存条数
         */
        public static void setMaxCacheCount(int maxCacheCount) {
            TrackDataMgr.getInstance().setMaxCacheCount(maxCacheCount);
        }
    }

    public static final class Share {

        /**
         * 获取分享埋点数据
         * @param hashMap  map 参数
         *                 appType	string	非必须	 	小游戏需要传minigame
         *                 func	string	必须	 	埋点标识
         *                 transmitargs	string	非必须	 	透传参数，原样返回
         *                 custom	string	非必须	 	自定义参数，URLENCODE
         *                 method	string	非必须	 	分享方式1广告，2好友列表 4朋友圈 (2+4正常分享)，8指定分享
         *                 share_from	string	非必须	 	分享人瑞雪openid
         *                 share_first	string	非必须	 	首次分享人瑞雪openid
         *                 type	string	必须	 	写死 rx
         *                 action	string	必须	 	写死share
         *                 region	string	必须	 	地区码 取不到传空字符串
         * @param callback 回调函数
         */
        public static void shareGetData(Map<String, Object> hashMap, RXJSONCallback callback) {
            ShareManager.getInstance().getShareDataAsync(hashMap, callback);
        }

        public static void ADSchedulingReport(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Share.SCHEDULING_AD_REPORT).setBody(hashMap).postAsync(callback);
        }
    }

    /**
     * 通行证
     */
    public static final class Passport {

        public static void login(Map<String, Object> bodyMap, RXJSONCallback callback) {
            PassportManager.getInstance().startLoginAsync(bodyMap, callback);
        }

        public static void register(Map<String, Object> bodyMap, RXJSONCallback callback) {
            PassportManager.getInstance().register(bodyMap, callback);
        }

        public static void deregister(Map<String, Object> bodyMap, RXJSONCallback callback) {
            PassportManager.getInstance().deregister(bodyMap, callback);
        }

        public static void deregisterCancel(Map<String, Object> bodyMap, RXJSONCallback callback) {
            PassportManager.getInstance().deregisterCancel(bodyMap, callback);
        }

        public static boolean sendCaptcha(String phoneOrEmail, String purpose, boolean isMail, String randstr, String ticket, RXJSONCallback callback) {
            Map<String, Object> hashMap = new HashMap<>();
            if (!TextUtils.isEmpty(phoneOrEmail)) {
                if (isMail) {
                    hashMap.put("email", phoneOrEmail);
                } else {
                    hashMap.put("phone", phoneOrEmail);
                }

                Map<String, Object> captcha = new HashMap<>();
                if (!TextUtils.isEmpty(randstr)) {
                    captcha.put("randstr", randstr);
                }
                if (!TextUtils.isEmpty(ticket)) {
                    captcha.put("ticket", ticket);
                }
                if (!captcha.isEmpty()) {
                    hashMap.put("tencent_captcha", captcha);
                }
            }
            hashMap.put("purpose", purpose);
            return sendCaptcha(hashMap, callback);
        }

        /**
         * 发送验证码
         * @param bodyMap  email	string	非必须邮箱   (和参数phone二选一 全填写默认为手机号码)；
         *                 phone	string	 非必须 手机号码 (和参数email二选一  全填写默认为手机号码)；
         *                 purpose  意图标识 参考 {@link  com.ruixue.base.CaptchaPurpose}；
         * @param callback callback
         */
        public static boolean sendCaptcha(Map<String, Object> bodyMap, RXJSONCallback callback) {
            boolean needLogin = (!bodyMap.containsKey("email") && !bodyMap.containsKey("phone"));
            String path = needLogin ? RXApiPath.Passport.SEND_CAPTCHA_AUTH : RXApiPath.Passport.SEND_CAPTCHA;
            RXRequest request = RXRequest.create(path).setNeedLoggedIn(needLogin).setMethod(HttpMethod.POST).setBody(bodyMap).setCallback(callback);
            return RequestManager.getInstance().execRequest(request);
        }

        public static boolean sendCaptchaWithVerify(Activity activity, Map<String, Object> bodyMap, RXJSONCallback callback) {
            return sendCaptcha(bodyMap, new RXJSONCallback() {
                @Override
                public void onError(RXException e) {
                    if (callback != null) {
                        callback.onError(e);
                    }
                }

                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    if (callback != null) {
                        callback.onSuccess(data);
                    }
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    int code = cause.optInt("code", 0);
                    if (code == 312241 && activity != null) {
                        JSONObject data = cause.optJSONObject("data");
                        int captcha_app_id = 0;
                        if (data != null) {
                            captcha_app_id = data.optInt("captcha_app_id", 0);
                        }
                        CaptchaVerifyView.create(activity, bodyMap, callback).setAppid(captcha_app_id).show();
                    } else {
                        if (callback != null) {
                            callback.onFailed(cause);
                        }
                    }
                }
            });
        }

        public static boolean verifyCaptcha(Map<String, Object> bodyMap, RXJSONCallback callback) {
            RXRequest request = RXRequest.create(RXApiPath.Passport.VERIFY_CAPTCHA).setNeedLoggedIn((!bodyMap.containsKey("email") && !bodyMap.containsKey("phone"))).setMethod(HttpMethod.POST).setBody(bodyMap).setCallback(callback);
            return RequestManager.getInstance().execRequest(request);
        }


        public static void getUserInfo(RXJSONCallback callback) {
            PassportManager.getInstance().getUserInfo(callback);
        }

        public static void getUserInfoByField(Map<String, Object> bodyMap, RXJSONCallback callback) {
            PassportManager.getInstance().getUserInfoByField(bodyMap, callback);
        }

        public static void updateUserInfo(Map<String, Object> bodyMap, RXJSONCallback callback) {
            PassportManager.getInstance().updateUserInfo(bodyMap, callback);
        }

        public static void bindPhone(Map<String, Object> bodyMap, RXJSONCallback callback) {
            PassportManager.getInstance().bindPhone(bodyMap, callback);
        }

        public static void bindEmail(Map<String, Object> bodyMap, RXJSONCallback callback) {
            PassportManager.getInstance().bindEmail(bodyMap, callback);
        }

        public static void unbindPhone(Map<String, Object> bodyMap, RXJSONCallback callback) {
            PassportManager.getInstance().unbindPhone(bodyMap, callback);
        }

        public static void unbindEmail(Map<String, Object> bodyMap, RXJSONCallback callback) {
            PassportManager.getInstance().unbindEmail(bodyMap, callback);
        }

        public static void certification(Map<String, Object> bodyMap, RXJSONCallback callback) {
            PassportManager.getInstance().certification(bodyMap, callback);
        }

        public static void getIIFAAResultWithRetryCount(int retryCount, RXJSONCallback callback) {
            PassportManager.getInstance().getIIFAAResultWithRetryCount(retryCount, callback);
        }

        public static void getIIFAAResultWithSource(@Nullable String source, int retryCount, RXJSONCallback callback) {
            PassportManager.getInstance().getIIFAAResultWithSource(source, retryCount, callback);
        }

        public static void getIIFAARedirectURL(@Nullable String appName, @Nullable String thirdPartSchema, RXJSONCallback callback) {
            PassportManager.getInstance().getIIFAARedirectURL(appName, thirdPartSchema, callback);
        }

        public static void changePwd(Map<String, Object> bodyMap, RXJSONCallback callback) {
            PassportManager.getInstance().changePwd(bodyMap, callback);
        }

        public static void resetPwd(Map<String, Object> bodyMap, RXJSONCallback callback) {
            PassportManager.getInstance().resetPwd(bodyMap, callback);
        }
    }

    public static void legal(@Nullable Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap == null) {
            hashMap = new HashMap<>();
        }
        if (!hashMap.containsKey("channel_id")) {
            hashMap.put("channel_id", RXGlobalData.getChannelId());
        }
        if (!hashMap.containsKey("product_id")) {
            hashMap.put("product_id", RXGlobalData.getProductId());
        }
        RXRequest.create(RXApiPath.LEGAL).setBody(hashMap).getAsync(callback);
    }

    public static void legalTerms(@Nullable Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap == null) {
            hashMap = new HashMap<>();
        }
        if (!hashMap.containsKey("channel_id")) {
            hashMap.put("channel_id", RXGlobalData.getChannelId());
        }
        if (!hashMap.containsKey("product_id")) {
            hashMap.put("product_id", RXGlobalData.getProductId());
        }
        RXRequest.create(RXApiPath.LEGAL_TERMS).setBody(hashMap).getAsync(callback);
    }


    public static final class Social {
        /**
         * 上报/更新经纬度坐标
         * @param hashMap  map 参数
         * @param callback 回调函数
         */
        public static void lbsUpdate(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.LBS_UPDATE).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        /**
         * 获取指定半径内的其他用户信息
         * @param hashMap  map 参数
         * @param callback 回调函数
         */
        public static void lbsRadius(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.LBS_RADIUS).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        /**
         * 给用户设置CP的自定义信息
         * @param hashMap  map 参数
         * @param callback 回调函数
         */
        public static void userSetCustom(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.USER_SET_CUSTOM).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        /**
         * 删除经纬度坐标
         * @param hashMap  map 参数
         * @param callback 回调函数
         */
        public static void lbsDelete(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.LBS_DELETE).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        /**
         * 添加自定关系
         * @param hashMap  map 参数
         * @param callback 回调函数
         */
        public static void relationAdd(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RELATION_ADD).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        /**
         * 删除自定关系
         * @param hashMap  map 参数
         * @param callback 回调函数
         */
        public static void relationDelete(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RELATION_DELETE).setBody(hashMap).setRestfulData(false).postAsync(callback);

        }

        /**
         * 更新自定义关系备注
         * @param hashMap
         * @param callback
         */
        public static void updateRemarks(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RELATION_UPDATE_REMARKS).setBody(hashMap).setRestfulData(false).postAsync(callback);

        }

        /**
         * 8. 判断两用户是否存在某自定关系
         * @param hashMap
         * @param callback
         */
        public static void hasRelation(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RELATION_HAS_RELATION).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        /**
         * 获取自定关系列表
         * @param hashMap  map 参数
         * @param callback 回调函数
         */
        public static void relationList(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RELATION_LIST).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        /**
         * 添加好友
         * @param hashMap  map 参数
         * @param callback 回调函数
         */
        public static void addFriends(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RELATION_ADD_FRIEND).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        /**
         * 删除好友
         * @param hashMap  map 参数
         * @param callback 回调函数
         */
        public static void removeFriends(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RELATION_DEL_FRIEND).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        /**
         * 更新好友关系备注
         */
        public static void updateFriendRemarks(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RELATION_UPDATE_FRIEND_REMARKS).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        /**
         * 判断两用户是否为好友
         */
        public static void isFriend(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RELATION_IS_FRIEND).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }


        /**
         * 获取好友列表
         * @param hashMap  map 参数
         * @param callback 回调函数
         */
        public static void relationFriends(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RELATION_FRIENDS).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        /**
         * 排行榜
         * @param hashMap  map 参数
         * @param callback 回调函数
         */
        public static void addScore(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RANK_ADDSCORE).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        public static void setScore(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RANK_SETSCORE).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        public static void queryUserRank(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RANK_QUERYUSERRANK).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        public static void getRankList(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RANK_GETRANKLIST).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }

        public static void friendsRank(Map<String, Object> hashMap, RXJSONCallback callback) {
            RXRequest.create(RXApiPath.Social.RANK_FRIENDSRANK).setBody(hashMap).setRestfulData(false).postAsync(callback);
        }
    }
}
