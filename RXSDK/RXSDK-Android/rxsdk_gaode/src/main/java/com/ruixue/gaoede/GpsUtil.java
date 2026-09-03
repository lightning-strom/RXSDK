package com.ruixue.gaoede;


import android.Manifest;
import android.app.Activity;
import android.os.Handler;
import android.text.TextUtils;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.amap.api.location.AMapLocationQualityReport;
import com.google.gson.Gson;
import com.ruixue.RXJSONCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.Logger;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.unity.UnityBaseCommonFun;
import com.ruixue.unity.UnityConvertRXStringCallback;

import java.util.HashMap;
import java.util.Map;

public class GpsUtil {
    private static int duration = 60;
    private static final Handler handler = new Handler();
    //是否需要检测后台定位权限，设置为true时，如果用户没有给予后台定位权限会弹窗提示
    private final boolean needCheckBackLocation = false;
    //如果设置了target > 28，需要增加这个权限，否则不会弹出"始终允许"这个选择框
    private static final String BACKGROUND_LOCATION_PERMISSION = "android.permission.ACCESS_BACKGROUND_LOCATION";
    /**
     * 需要进行检测的权限数组
     */
    protected static String[] needPermissions = {
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.READ_PHONE_STATE
    };

    private static final int PERMISSON_REQUESTCODE = 0;


    private static AMapLocationClient locationClient = null;
    private static AMapLocationClientOption locationOption = null;
    private static RXStringCallback mchannelCallback;
    private static String[] types;
    private static boolean flagSucess = false;

    /**
     * 初始化定位
     */
    public static void initLocation(Activity activity) {
        //初始化clientAMapLocation
        try {
            AMapLocationClient.updatePrivacyShow(activity, true, true);
            AMapLocationClient.updatePrivacyAgree(activity, true);
            locationClient = new AMapLocationClient(activity.getApplicationContext());

            locationOption = getDefaultOption();
            //设置定位参数
            locationClient.setLocationOption(locationOption);
            // 设置定位监听
            locationClient.setLocationListener(locationListener);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 默认的定位参数
     * @author hongming.wang
     * @since 2.8.0
     */
    private static AMapLocationClientOption getDefaultOption() {
        AMapLocationClientOption mOption = new AMapLocationClientOption();
        mOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Battery_Saving);//可选，设置定位模式，可选的模式有高精度、仅设备、仅网络。默认为高精度模式
        mOption.setGpsFirst(false);//可选，设置是否gps优先，只在高精度模式下有效。默认关闭
        mOption.setHttpTimeOut(30000);//可选，设置网络请求超时时间。默认为30秒。在仅设备模式下无效
        mOption.setInterval(2000);//可选，设置定位间隔。默认为2秒
        mOption.setNeedAddress(true);//可选，设置是否返回逆地理地址信息。默认是true
        mOption.setOnceLocation(false);//可选，设置是否单次定位。默认是false
        mOption.setOnceLocationLatest(false);//可选，设置是否等待wifi刷新，默认为false.如果设置为true,会自动变为单次定位，持续定位时不要使用
        AMapLocationClientOption.setLocationProtocol(AMapLocationClientOption.AMapLocationProtocol.HTTP);//可选， 设置网络请求的协议。可选HTTP或者HTTPS。默认为HTTP
        mOption.setSensorEnable(false);//可选，设置是否使用传感器。默认是false
        mOption.setWifiScan(true); //可选，设置是否开启wifi扫描。默认为true，如果设置为false会同时停止主动刷新，停止以后完全依赖于系统刷新，定位位置可能存在误差
        mOption.setLocationCacheEnable(true); //可选，设置是否使用缓存定位，默认为true
        mOption.setGeoLanguage(AMapLocationClientOption.GeoLanguage.DEFAULT);//可选，设置逆地理信息的语言，默认值为默认语言（根据所在地区选择语言）

        return mOption;
    }

    /**
     * 定位监听
     */
    public static AMapLocationListener locationListener = new AMapLocationListener() {
        @Override
        public void onLocationChanged(AMapLocation location) {
            if (null != location && location.getErrorCode() == 0) {
                location.setCoordType("WGS84");
                location.setLatitude(WGSLat(location.getLatitude(), location.getLongitude()));
                location.setLongitude(WGSLon(location.getLatitude(), location.getLongitude()));

                RXLocation rxLocation = new RXLocation();
                rxLocation.setCoordType(location.getCoordType());
                rxLocation.setLatitude(WGSLat(location.getLatitude(), location.getLongitude()));
                rxLocation.setLatitudeStr(String.valueOf(WGSLat(location.getLatitude(), location.getLongitude())));
                rxLocation.setLongitude(WGSLon(location.getLatitude(), location.getLongitude()));
                rxLocation.setLongitudeStr(String.valueOf(WGSLon(location.getLatitude(), location.getLongitude())));
//                sb.append("精    度    : " + location.getAccuracy()+ "米" + "\n");
//                sb.append("提供者    : " + location.getProvider() + "\n");
//
//                sb.append("速    度    : " + location.getSpeed() + "米/秒" + "\n");
//                sb.append("角    度    : " + location.getBearing() + "\n");
//                // 获取当前提供定位服务的卫星个数
//                sb.append("星    数    : " + location.getSatellites() + "\n");
//                sb.append("国    家    : " + location.getCountry() + "\n");
//                sb.append("省            : " + location.getProvince() + "\n");
//                sb.append("市            : " + location.getCity() + "\n");
//                sb.append("城市编码 : " + location.getCityCode() + "\n");
//                sb.append("区            : " + location.getDistrict() + "\n");
//                sb.append("区域 码   : " + location.getAdCode() + "\n");
//                sb.append("地    址    : " + location.getAddress() + "\n");
//                sb.append("兴趣点    : " + location.getPoiName() + "\n");
//                //定位完成的时间
//                sb.append("定位时间: " + com.ruixue.gaoede.Utils.formatUTC(location.getTime(), "yyyy-MM-dd HH:mm:ss") + "\n");
                rxLocation.setAccuracy(location.getAccuracy());
                rxLocation.setProvider(location.getProvider());
                rxLocation.setSpeed(location.getSpeed());
                rxLocation.setBearing(location.getBearing());
                rxLocation.setSatellites(location.getSatellites());
                rxLocation.setCountry(location.getCountry());
                rxLocation.setProvince(location.getProvince());
                rxLocation.setCity(location.getCity());
                rxLocation.setCityCode(location.getCityCode());
                rxLocation.setDistrict(location.getDistrict());
                rxLocation.setAdCode(location.getAdCode());
                rxLocation.setAddress(location.getAddress());
                rxLocation.setPoiName(location.getPoiName());
                rxLocation.setTime(com.ruixue.gaoede.Utils.formatUTC(location.getTime(), "yyyy-MM-dd HH:mm:ss"));

                if (null != mchannelCallback) {
                    mchannelCallback.onSuccess(new Gson().toJson(rxLocation));
                    mchannelCallback = null;
                }
                if (flagSucess) {
                    flagSucess = false;
                    Map<String, Object> maps = new HashMap<>();
                    maps.put("types", types);
                    maps.put("lon", location.getLongitude());
                    maps.put("lat", location.getLatitude());
                    RXSdkApi.getInstance().lbsUpdate(maps, RXJSONCallback.EMPTY);
                }

                StringBuffer sb = new StringBuffer();
                //errCode等于0代表定位成功，其他的为定位失败，具体的可以参照官网定位错误码说明
                if (location.getErrorCode() == 0) {
                    sb.append("定位成功" + "\n");
                    sb.append("定位类型: " + location.getLocationType() + "\n");
                    sb.append("经    度    : " + location.getLongitude() + "\n");
                    sb.append("纬    度    : " + location.getLatitude() + "\n");
                    sb.append("精    度    : " + location.getAccuracy() + "米" + "\n");
                    sb.append("提供者    : " + location.getProvider() + "\n");

                    sb.append("速    度    : " + location.getSpeed() + "米/秒" + "\n");
                    sb.append("角    度    : " + location.getBearing() + "\n");
                    // 获取当前提供定位服务的卫星个数
                    sb.append("星    数    : " + location.getSatellites() + "\n");
                    sb.append("国    家    : " + location.getCountry() + "\n");
                    sb.append("省            : " + location.getProvince() + "\n");
                    sb.append("市            : " + location.getCity() + "\n");
                    sb.append("城市编码 : " + location.getCityCode() + "\n");
                    sb.append("区            : " + location.getDistrict() + "\n");
                    sb.append("区域 码   : " + location.getAdCode() + "\n");
                    sb.append("地    址    : " + location.getAddress() + "\n");
                    sb.append("兴趣点    : " + location.getPoiName() + "\n");
                    //定位完成的时间
                    sb.append("定位时间: " + com.ruixue.gaoede.Utils.formatUTC(location.getTime(), "yyyy-MM-dd HH:mm:ss") + "\n");
                } else {
                    //定位失败
                    sb.append("定位失败" + "\n");
                    sb.append("错误码:" + location.getErrorCode() + "\n");
                    sb.append("错误信息:" + location.getErrorInfo() + "\n");
                    sb.append("错误描述:" + location.getLocationDetail() + "\n");
                }
                sb.append("***定位质量报告***").append("\n");
                sb.append("* WIFI开关：").append(location.getLocationQualityReport().isWifiAble() ? "开启" : "关闭").append("\n");
                sb.append("* GPS状态：").append(getGPSStatusString(location.getLocationQualityReport().getGPSStatus())).append("\n");
                sb.append("* GPS星数：").append(location.getLocationQualityReport().getGPSSatellites()).append("\n");
                sb.append("* 网络类型：" + location.getLocationQualityReport().getNetworkType()).append("\n");
                sb.append("* 网络耗时：" + location.getLocationQualityReport().getNetUseTime()).append("\n");
                sb.append("****************").append("\n");
                //定位之后的回调时间
                sb.append("回调时间: " + com.ruixue.gaoede.Utils.formatUTC(System.currentTimeMillis(), "yyyy-MM-dd HH:mm:ss") + "\n");

                //解析定位结果，
                String result = sb.toString();
//                tvResult.setText(result);
            } else if (location != null) {
                RXLogger.e("定位失败：" + location.toString());
                stopLocation();
                if (null != mchannelCallback) {
                    mchannelCallback.onFailed(location.getErrorCode(), location.getErrorInfo(), "");
                }
            } else {
                if (null != mchannelCallback) {
                    mchannelCallback.onFailed(RXErrorCode.GPS_DATA_ERROR.getValue(), RXErrorCode.GPS_DATA_ERROR.getDesc(), "");
                }
            }
        }
    };

    /**
     * 获取GPS状态的字符串
     * @param statusCode GPS状态码
     * @return
     */
    public static String getGPSStatusString(int statusCode) {
        String str = "";
        switch (statusCode) {
            case AMapLocationQualityReport.GPS_STATUS_OK:
                str = "GPS状态正常";
                break;
            case AMapLocationQualityReport.GPS_STATUS_NOGPSPROVIDER:
                str = "手机中没有GPS Provider，无法进行GPS定位";
                break;
            case AMapLocationQualityReport.GPS_STATUS_OFF:
                str = "GPS关闭，建议开启GPS，提高定位质量";
                break;
            case AMapLocationQualityReport.GPS_STATUS_MODE_SAVING:
                str = "选择的定位模式中不包含GPS定位，建议选择包含GPS定位的模式，提高定位质量";
                break;
            case AMapLocationQualityReport.GPS_STATUS_NOGPSPERMISSION:
                str = "没有GPS定位权限，建议开启gps定位权限";
                break;
        }
        return str;
    }

    /**
     * @param cbAddress      设置是否需要显示地址信息
     * @param cbGpsFirst     设置是否优先返回GPS定位结果，如果30秒内GPS没有返回定位结果则进行网络定位,注意：只有在高精度模式下的单次定位有效，其他方式无效
     * @param cbCacheAble    设置是否开启缓存
     * @param cbOnceLocation 设置是否单次定位
     * @param cbOnceLastest  设置是否等待设备wifi刷新，如果设置为true,会自动变为单次定位，持续定位时不要使用
     * @param cbSensorAble   设置是否使用传感器
     * @param strInterval    设置发送定位请求的时间间隔,最小值为1000，如果小于1000，按照1000算
     * @param strTimeout     设置网络请求超时时间
     */
    public static void resetOption(boolean cbAddress, boolean cbGpsFirst, boolean cbCacheAble, boolean cbOnceLocation, boolean cbOnceLastest,
                                   boolean cbSensorAble, long strInterval, long strTimeout) {
        // 设置是否需要显示地址信息
        locationOption.setNeedAddress(cbAddress);
        /**
         * 设置是否优先返回GPS定位结果，如果30秒内GPS没有返回定位结果则进行网络定位
         * 注意：只有在高精度模式下的单次定位有效，其他方式无效
         */
        locationOption.setGpsFirst(cbGpsFirst);
        // 设置是否开启缓存
        locationOption.setLocationCacheEnable(cbCacheAble);
        // 设置是否单次定位
        locationOption.setOnceLocation(cbOnceLocation);
        //设置是否等待设备wifi刷新，如果设置为true,会自动变为单次定位，持续定位时不要使用
        locationOption.setOnceLocationLatest(cbOnceLastest);
        //设置是否使用传感器
        locationOption.setSensorEnable(cbSensorAble);
        //设置是否开启wifi扫描，如果设置为false时同时会停止主动刷新，停止以后完全依赖于系统刷新，定位位置可能存在误差
//        String strInterval = etInterval.getText().toString();
        if (!TextUtils.isEmpty(String.valueOf(strInterval))) {
            try {
                // 设置发送定位请求的时间间隔,最小值为1000，如果小于1000，按照1000算
                locationOption.setInterval(Long.valueOf(strInterval));
            } catch (Throwable e) {
                e.printStackTrace();
            }
        }

//        String strTimeout = etHttpTimeout.getText().toString();
        if (!TextUtils.isEmpty(String.valueOf(strTimeout))) {
            try {
                // 设置网络请求超时时间
                locationOption.setHttpTimeOut(Long.valueOf(strTimeout));
            } catch (Throwable e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 开始定位
     * @param activity
     * @param cbAddress       设置是否需要显示地址信息
     * @param cbGpsFirst      设置是否优先返回GPS定位结果，如果30秒内GPS没有返回定位结果则进行网络定位,注意：只有在高精度模式下的单次定位有效，其他方式无效
     * @param cbCacheAble     设置是否开启缓存
     * @param cbOnceLocation  设置是否单次定位
     * @param cbOnceLastest   设置是否等待设备wifi刷新，如果设置为true,会自动变为单次定位，持续定位时不要使用
     * @param cbSensorAble    设置是否使用传感器
     * @param strInterval     设置发送定位请求的时间间隔,最小值为1000，如果小于1000，按照1000算
     * @param strTimeout      设置网络请求超时时间
     * @param channelCallback
     */
    public static void startLocation(Activity activity, boolean cbAddress, boolean cbGpsFirst, boolean cbCacheAble, boolean cbOnceLocation, boolean cbOnceLastest,
                                     boolean cbSensorAble, long strInterval, long strTimeout, RXStringCallback channelCallback) {
        mchannelCallback = channelCallback;
       /* if (Build.VERSION.SDK_INT > 28
                && activity.getApplicationInfo().targetSdkVersion > 28) {
            needPermissions = new String[]{
                    Manifest.permission.ACCESS_COARSE_LOCATION,
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.READ_PHONE_STATE,
                    BACKGROUND_LOCATION_PERMISSION
            };
        }*/
       /* PermissionHelper.request(activity,new PermissionXCallback() {
            @Override
            public void onForwardToSettings() {
                Toast.makeText(activity, "系统检测到未开启GPS定位服务,请开启", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onResult(boolean allGranted, List<String> grantedList, List<String> deniedList) {
                if (allGranted) {

                } else {
                    channelCallback.fail(RXErrorCode.PERMISSIONERROR.getValue(),  RXErrorResult.resultJson(RXErrorCode.PERMISSIONERROR));

//                    channelCallback.fail(ErrCode.PERMISSIONERROR, "请先申请读写权限");
                }

            }
        },needPermissions);*/
        //根据控件的选择，重新设置定位参数
        resetOption(cbAddress, cbGpsFirst, cbCacheAble, cbOnceLocation, cbOnceLastest,
                cbSensorAble, strInterval, strTimeout);
        // 设置定位参数
        locationClient.setLocationOption(locationOption);
        // 启动定位
        locationClient.startLocation();

//        PermissionsUtil.requestPermission(activity, new PermissionListener() {
//            @Override
//            public void permissionGranted(@NonNull String[] permissions) {
//                //根据控件的选择，重新设置定位参数
//                resetOption(cbAddress, cbGpsFirst, cbCacheAble, cbOnceLocation, cbOnceLastest,
//                        cbSensorAble, strInterval, strTimeout);
//                // 设置定位参数
//                locationClient.setLocationOption(locationOption);
//                // 启动定位
//                locationClient.startLocation();
//            }
//
//            @Override
//            public void permissionDenied(@NonNull String[] permissions) {
//
//            }
//        }, needPermissions, false, null);

    }

    public static void startLocation(Activity activity, boolean cbAddress, boolean cbGpsFirst, boolean cbCacheAble, boolean cbOnceLocation, boolean cbOnceLastest,
                                     boolean cbSensorAble, long strInterval, long strTimeout, UnityConvertRXStringCallback channelCallback) {
        startLocation(activity, cbAddress, cbGpsFirst, cbCacheAble, cbOnceLocation, cbOnceLastest,
                cbSensorAble, strInterval, strTimeout,
                UnityBaseCommonFun.convertCallback(channelCallback));
    }


    public static Runnable r = new Runnable() {
        @Override
        public void run() {
            if (null != locationClient) {
                // 设置定位参数
                locationClient.setLocationOption(locationOption);
                // 启动定位
                locationClient.startLocation();
                flagSucess = true;
                handler.postDelayed(r, duration * 1000L);

                Logger.i(duration + "s上报");
            }
        }
    };

    /**
     * 开始定位
     * 默认配置定位
     * @param activity
     * @param _types          坐标分组，由 CP 自定义。
     * @param _duration       单位秒，需要传入大于30秒以上的秒数
     * @param channelCallback
     */
    public static void startLocation(Activity activity, String[] _types, int _duration, RXStringCallback channelCallback) {
        duration = _duration;
        mchannelCallback = channelCallback;
        types = _types;
       /* if (Build.VERSION.SDK_INT > 28
                && activity.getApplicationInfo().targetSdkVersion > 28) {
            needPermissions = new String[]{
                    Manifest.permission.ACCESS_COARSE_LOCATION,
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.READ_PHONE_STATE,
                    BACKGROUND_LOCATION_PERMISSION
            };
        }

        PermissionHelper.request(activity,new PermissionXCallback() {
            @Override
            public void onForwardToSettings() {
//                PermissionHelper.gotoSetting(activity);
            }

            @Override
            public void onResult(boolean allGranted, List<String> grantedList, List<String> deniedList) {
                if (allGranted) {

                    // 设置定位参数
//                    locationClient.setLocationOption(locationOption);
//                    // 启动定位
//                    locationClient.startLocation();
                } else {
                    if(deniedList.contains(BACKGROUND_LOCATION_PERMISSION)){
                        channelCallback.fail(RXErrorCode.PERMISSIONERROR.getValue(),  RXErrorResult.resultJson(RXErrorCode.PERMISSIONERROR.getValue(),"请选择始终允许这个选择框"));
                    }else{
                        channelCallback.fail(RXErrorCode.PERMISSIONERROR.getValue(),  RXErrorResult.resultJson(RXErrorCode.PERMISSIONERROR));
                    }

//                    channelCallback.fail(ErrCode.PERMISSIONERROR, "请先申请读写权限");
                }

            }
        },needPermissions);*/
        handler.removeCallbacksAndMessages(null);
        handler.postDelayed(r, 0);
    }

    public static void startLocation(Activity activity, String[] _types, int _duration, UnityConvertRXStringCallback channelCallback) {
        startLocation(activity, _types, _duration, UnityBaseCommonFun.convertCallback(channelCallback));
    }

    /**
     * 停止定位 销毁定位
     * @author hongming.wang
     * @since 2.8.0
     */
    public static void stopLocation() {
        handler.removeCallbacksAndMessages(null);
        // 停止定位
        if (null != locationClient) {
            locationClient.stopLocation();
        }

    }


    /**
     * 销毁定位
     * @author hongming.wang
     * @since 2.8.0
     */
    public static void destroyLocation() {
        if (null != locationClient) {
            locationClient.onDestroy();
            locationClient = null;
            locationOption = null;
        }
    }

//    使用自带的Location 自动跑点经纬度, 发现一个问题
//    安卓自带的Location是 WGS84 的经纬度 而高德却是GCJ-02
//    有了以下代码:

    /**
     * 输入GCJ-02经纬度 转WGS纬度
     * @param lat 纬度
     * @param lon 经度
     * @return WGS纬度
     */
    public static double WGSLat(double lat, double lon) {
        double PI = 3.14159265358979324;//圆周率

        double a = 6378245.0;//克拉索夫斯基椭球参数长半轴a

        double ee = 0.00669342162296594323;//克拉索夫斯基椭球参数第一偏心率平方

        double dLat = transformLat(lon - 105.0, lat - 35.0);

        double radLat = lat / 180.0 * PI;

        double magic = Math.sin(radLat);

        magic = 1 - ee * magic * magic;

        double sqrtMagic = Math.sqrt(magic);

        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);

        return (lat - dLat);

    }

    /**
     * 输入GCJ经纬度 转WGS经度
     * @param lat 纬度
     * @param lon 经度
     * @return WGS经度
     */
    public static double WGSLon(double lat, double lon) {
        double PI = 3.14159265358979324;//圆周率

        double a = 6378245.0;//克拉索夫斯基椭球参数长半轴a

        double ee = 0.00669342162296594323;//克拉索夫斯基椭球参数第一偏心率平方

        double dLon = transformLon(lon - 105.0, lat - 35.0);

        double radLat = lat / 180.0 * PI;

        double magic = Math.sin(radLat);

        magic = 1 - ee * magic * magic;

        double sqrtMagic = Math.sqrt(magic);

        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);

        return (lon - dLon);

    }

    /**
     * 坐标转换算法 转换经度所需
     * @param x longitude
     * @param y latitude
     * @return longitude
     */
    public static double transformLon(double x, double y) {
        double PI = 3.14159265358979324;//圆周率

        double ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));

        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;

        ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;

        ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;

        return ret;

    }

    /**
     * 坐标转换算法 转换纬度所需
     * @param x longitude
     * @param y latitude
     * @return latitude
     */
    public static double transformLat(double x, double y) {
        double PI = 3.14159265358979324;//圆周率

        double ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));

        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;

        ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;

        ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;

        return ret;

    }
}
