package com.ruixue.emulatordetect;

import static android.content.Context.SENSOR_SERVICE;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.net.Uri;
import android.os.Build;
import android.text.TextUtils;

import com.ruixue.utils.JSONUtil;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;


class DeviceInfoRequireUtil {
    private DeviceInfoRequireUtil() {

    }

    private static class SingletonHolder {
        private static final DeviceInfoRequireUtil INSTANCE = new DeviceInfoRequireUtil();
    }

    public static DeviceInfoRequireUtil getSingleInstance() {
        return SingletonHolder.INSTANCE;
    }

    public Map<String, Object> readSysProperty(Context context) {
        if (context == null) {
            return null;
        }

        HashMap<String, Object> infoMap = new HashMap<>();

        //检测硬件名称
        String hardware = getFeaturesByHardware();
        if (hardware != null) {
            hardware = hardware.toLowerCase();
        }
        infoMap.put("hardware", hardware);

        //检测渠道
        String flavor = getFeaturesByFlavor();
        if (flavor != null) {
            flavor = flavor.toLowerCase();
        }
        infoMap.put("flavor", flavor);

        //检测设备型号
        String model = getFeaturesByModel();
        if (model != null) {
            model = model.toLowerCase();
        }
        infoMap.put("model", model);

        //检测硬件制造商
        String manufacturer = getFeaturesByManufacturer();
        if (manufacturer != null) {
            manufacturer = manufacturer.toLowerCase();
        }
        infoMap.put("manufacturer", manufacturer);

        //检测主板名称
        String board = getFeaturesByBoard();
        if (board != null) {
            board = board.toLowerCase();
        }
        infoMap.put("board", board);

        //检测主板平台
        String platform = getFeaturesByPlatform();
        if (platform != null) {
            platform = platform.toLowerCase();
        }
        infoMap.put("platform", platform);

        //检测基带信息
        String base_band = checkFeaturesByBaseBand();
        if (base_band != null) {
            base_band = base_band.toLowerCase();
        }
        infoMap.put("base_band", base_band);

        //检测传感器数量
        int sensor_number = getSensorNumber(context);
        infoMap.put("sensor_number", sensor_number);

        //检测是否支持闪光灯
        boolean support_camera_flash = supportCameraFlash(context);
        infoMap.put("support_camera_flash", support_camera_flash);

        //检测是否支持相机
        boolean support_camera = supportCamera(context);
        infoMap.put("support_camera", support_camera);

        //检测是否支持蓝牙
        boolean support_bluetooth = supportBluetooth(context);
        infoMap.put("support_bluetooth", support_bluetooth);

        //检测光线传感器
        boolean has_light_sensor = hasLightSensor(context);
        infoMap.put("has_light_sensor", has_light_sensor);

        //检测进程组信息
        String cgroup_result = getFeaturesByCgroup();
        infoMap.put("cgroup_result", cgroup_result);

        // 是否可以拨打电话
        boolean can_call = checkCallPhoneEnable(context);
        infoMap.put("can_call", can_call);

        // os_arch
        String os_arch = getOsArch().toLowerCase();
        infoMap.put("os_arch", os_arch);

        // cpu架构
        String cpu_info_result = getCpuInfo();
        if (cpu_info_result != null) {
            cpu_info_result = cpu_info_result.toLowerCase();
        }
        infoMap.put("cpu_info_result", cpu_info_result);

        return infoMap;
    }

    private int getUserAppNum(String userApps) {
        if (TextUtils.isEmpty(userApps)) return 0;
        String[] result = userApps.split("package:");
        return result.length;
    }

    private String getProperty(String propName) {
        String property = CommandUtil.getSingleInstance().getProperty(propName);
        return TextUtils.isEmpty(property) ? null : property;
    }

    /**
     * 特征参数-硬件名称
     *
     */
    private String getFeaturesByHardware() {
        return getProperty("ro.hardware");
    }

    /**
     * 特征参数-渠道
     *
     */
    private String getFeaturesByFlavor() {
        return getProperty("ro.build.flavor");
    }

    /**
     * 特征参数-设备型号
     *
     */
    private String getFeaturesByModel() {
        return getProperty("ro.product.model");
    }

    /**
     * 特征参数-硬件制造商
     *
     */
    private String getFeaturesByManufacturer() {
        return getProperty("ro.product.manufacturer");
    }

    /**
     * 特征参数-主板名称
     *
     */
    private String getFeaturesByBoard() {
        return getProperty("ro.product.board");
    }

    /**
     * 特征参数-主板平台
     *
     */
    private String getFeaturesByPlatform() {
        return getProperty("ro.board.platform");
    }

    /**
     * 特征参数-基带信息
     *
     */
    private String checkFeaturesByBaseBand() {
        return getProperty("gsm.version.baseband");
    }

    /**
     * 获取传感器数量
     */
    private int getSensorNumber(Context context) {
        SensorManager sm = (SensorManager) context.getSystemService(SENSOR_SERVICE);
        return sm.getSensorList(Sensor.TYPE_ALL).size();
    }

    /**
     * 获取已安装第三方应用数量
     */
    private int getUserAppNumber() {
        String userApps = CommandUtil.getSingleInstance().exec("pm list package -3");
        return getUserAppNum(userApps);
    }

    /**
     * 是否支持相机
     */
    private boolean supportCamera(Context context) {
        return context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA);
    }

    /**
     * 是否支持闪光灯
     */
    private boolean supportCameraFlash(Context context) {
        return context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_FLASH);
    }

    /**
     * 是否支持蓝牙
     */
    private boolean supportBluetooth(Context context) {
        return context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH);
    }

    /**
     * 判断是否存在光传感器来判断是否为模拟器
     * 部分真机也不存在温度和压力传感器。其余传感器模拟器也存在。
     *
     * @return false为模拟器
     */
    private boolean hasLightSensor(Context context) {
        SensorManager sensorManager = (SensorManager) context.getSystemService(SENSOR_SERVICE);
        Sensor sensor = sensorManager.getDefaultSensor(Sensor.TYPE_LIGHT); //光线传感器
        if (null == sensor) return false;
        else return true;
    }

    /**
     * 特征参数-进程组信息
     */
    private String getFeaturesByCgroup() {
        return CommandUtil.getSingleInstance().exec("cat /proc/self/cgroup");
    }

    private boolean checkCallPhoneEnable(Context context) {
        String url = "tel:" + "123456";
        Intent intent = new Intent();
        intent.setData(Uri.parse(url));
        intent.setAction(Intent.ACTION_DIAL);
        return intent.resolveActivity(context.getPackageManager()) != null;
    }

    private String getOsArch() {
        String[] arr = Build.SUPPORTED_ABIS;
        if (arr != null) {
            return Arrays.toString(arr);
        }
        return "";
    }

    private String getCpuInfo(){
        String result = null;
        try{
            String [] args = {"/system/bin/cat","/proc/cpuinfo"};
            ProcessBuilder processBuilder = new ProcessBuilder(args);
            Process process = processBuilder.start();
            StringBuffer stringBuffer = new StringBuffer();
            String readLine = "";
            BufferedReader responseReader = new BufferedReader(new InputStreamReader(process.getInputStream(), "utf-8"));
            while ((readLine = responseReader.readLine())!=null){
                stringBuffer.append(readLine);
            }
            responseReader.close();
            result = stringBuffer.toString().toLowerCase();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    }

}
