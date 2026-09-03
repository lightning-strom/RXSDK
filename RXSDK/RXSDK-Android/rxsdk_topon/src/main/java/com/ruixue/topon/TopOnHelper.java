package com.ruixue.topon;

import android.app.Activity;
import android.content.Context;

import com.anythink.core.api.ATAdInfo;
import com.anythink.core.api.ATDebuggerConfig;
import com.anythink.core.api.ATGDPRAuthCallback;
import com.anythink.core.api.ATGDPRConsentDismissListener;
import com.anythink.core.api.ATSDK;
import com.anythink.core.api.DeviceInfoCallback;
import com.anythink.core.api.IATAdFilter;
import com.anythink.core.api.IATThirdPartyMaterial;
import com.anythink.core.api.NetTrafficeCallback;

import java.util.List;
import java.util.Map;

public class TopOnHelper {

    //SDK日志功能，集成测试阶段建议开启，上线前必须关闭
    public static void setNetworkLogDebug(boolean debug) {
        ATSDK.setNetworkLogDebug(debug);
    }

    public static String getSDKVersionName() {
        return ATSDK.getSDKVersionName();
    }

    //检查广告平台的集成状态，提交审核时需注释此API
    public static void integrationChecking(Context context) {
        ATSDK.integrationChecking(context);
    }

    public static boolean isCnSDK() {
        return ATSDK.isCnSDK();
    }

    //(v5.7.77新增) 打印当前设备的设备信息(IMEI、OAID、GAID、AndroidID等)
    public static void testModeDeviceInfo(Context context, DeviceInfoCallback deviceInfoCallback) {
        ATSDK.testModeDeviceInfo(context, deviceInfoCallback);
    }

    // v6.2.95+，针对国内SDK，调用start启动SDK。海外SDK无调用
    public static void start() {
        ATSDK.start();
    }

    // 设置渠道信息
    public static void setChannel(String channel) {
        ATSDK.setChannel(channel);
    }

    // 设置子渠道信息
    public static void setSubChannel(String subChannel) {
        ATSDK.setSubChannel(subChannel);
    }

    // 自定义key-value，可用于App维度匹配后端下发的广告列表信息
    public static void initCustomMap(Map<String, Object> customMap) {
        ATSDK.initCustomMap(customMap);
    }

    // 自定义key-value，可用于广告位维度匹配后端下发的广告列表信息
    public static void initPlacementCustomMap(String TopOnPlacementID, Map<String, Object> customMap) {
        ATSDK.initPlacementCustomMap(TopOnPlacementID, customMap);
    }

    // 检查当前网络是否是欧盟
    public static void checkIsEuTraffic(Context context, NetTrafficeCallback callback) {
        ATSDK.checkIsEuTraffic(context, callback);
    }

    // 设置GDPR下数据的上报等级，level主要分以下两个等级
    public static void setGDPRUploadDataLevel(Context context, int level) {
        ATSDK.setGDPRUploadDataLevel(context, level);
    }

    // 获取当前的上报等级
    public static void getGDPRDataLevel(Context context) {
        ATSDK.getGDPRDataLevel(context);
    }

    // 展示GDPR授权页面的Activity
    public static void showGdprAuth(Activity activity) {
        ATSDK.showGdprAuth(activity);
    }

    // 展示GDPR授权页面的Activity，回调授权信息
    public static void showGdprAuth(Activity activity, ATGDPRAuthCallback callback) {
        ATSDK.showGdprAuth(activity, callback);
    }

    // 针对交叉推广设置排除包名的列表，被排除的包名所对应的产品不会再被推广
    public static void setExcludePackageList(List<String> packageList) {
        ATSDK.setExcludePackageList(packageList);
    }

    // 设置广告加载时过滤指定广告位下的广告源，被过滤的广告源不会发起加载
    public static void setFilterAdSourceIdList(String placementId, List<String> adSourceIdList) {
        ATSDK.setFilterAdSourceIdList(placementId, adSourceIdList);
    }

    // 设置广告加载时过滤指定广告位下的广告源，被过滤的广告源不会发起加载
    public static void setFilterNetworkFirmIdList(String placementId, List<String> networkFirmIdList) {
        ATSDK.setFilterNetworkFirmIdList(placementId, networkFirmIdList);
    }

    // 设置广告源加载成功时是否需要被过滤掉，被过滤的广告源将当做请求失败处理
    public static void setATAdFilter(String[] placementIds, IATAdFilter adFilter) {
        ATSDK.setATAdFilter(placementIds, adFilter);
    }

    public static void setDebuggerConfig(Context context, String deviceId, ATDebuggerConfig atDebuggerConfig) {
        ATSDK.setDebuggerConfig(context, deviceId, atDebuggerConfig);
    }

    public static void showGDPRConsentDialog(Activity activity, ATGDPRConsentDismissListener listener) {
        ATSDK.showGDPRConsentDialog(activity, listener);
    }

    /**
     * 开发者需要实现此方法
     * adInfo：广告的信息对象， 见ATAdInfo信息说明
     * nativeAdMaterial：原生广告的素材对象，参考ATNativeMaterial
     */
//    public static void isAdFilter(ATAdInfo adInfo, IATThirdPartyMaterial nativeAdMaterial) {
//        ATSDK.isAdFilter(adInfo, nativeAdMaterial);
//    }

//    // 设置广告源加载成功时是否需要被过滤掉，被过滤的广告源将当做请求失败处理
//    public static void requestPermissionIfNecessary(Context context) {
//        ATSDK.requestPermissionIfNecessary(placementIds, adFilter);
//    }


}
