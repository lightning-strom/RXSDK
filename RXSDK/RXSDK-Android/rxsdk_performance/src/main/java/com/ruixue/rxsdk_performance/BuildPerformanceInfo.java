package com.ruixue.rxsdk_performance;

import android.content.Context;
import android.util.Log;

import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.emulatordetect.SimulatorDetectTool;
import com.ruixue.performancereport.PerformanceCallBack;

import org.json.JSONObject;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;

public class BuildPerformanceInfo {

    public static final String TAG = BuildPerformanceInfo.class.getName();
    private static final HashMap<String, Object> infoMap = new HashMap<>();
    private static boolean isSimulator = false;


    static {
        SimulatorDetectTool.getSingleInstance().simulatorDetection(RuiXueSdk.getContext(), 2, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                try {
                    Log.d(TAG, jsonObject.toString());
                    String device = jsonObject.optJSONObject("data").optString("device");
                    isSimulator = !"phone".equals(device);
                }catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private BuildPerformanceInfo() { }

    public static void buildInfo(PerformanceCallBack callBack) {
        PerformanceManager.getInstance().getFPS(new FpsMonitor.FPSCallBack() {
            @Override
            public void onValue(double fps, double jank) {
                PerformanceManager performanceManager = PerformanceManager.getInstance();
                Context context = RuiXueSdk.getContext();
//                infoMap.put("DEVICE_ID", performanceManager.getDeviceID(context));
                infoMap.put("DEVICE_MODEL", performanceManager.getDeviceModel());
                infoMap.put("SYSTEM", performanceManager.getSystemVersion());
                infoMap.put("RESOLUTION", performanceManager.getResolution(context));
                infoMap.put("GRAPHIC_API", performanceManager.getGraphicApi());
                infoMap.put("ROOT", performanceManager.isDeviceRooted());
                infoMap.put("CPU_CORE", performanceManager.getCpuCoreNumber());
                infoMap.put("GPU_MODEL", performanceManager.getGpuModel());
                infoMap.put("RAM_MB", performanceManager.getRamSizeInMB());
                infoMap.put("ROM_GB", performanceManager.getRomTotalSpace());
                infoMap.put("EMULATOR", isSimulator);
                infoMap.put("gpm_fps", (int) fps);
                infoMap.put("gpm_jank", (int) jank);
                double process_memory_mb = performanceManager.getProcessMemory(context);
                infoMap.put("gpm_process_memory_mb", round(process_memory_mb, 4));
                BatteryHelper.BatteryBean batteryBean = performanceManager.getBatteryBean(context);
                infoMap.put("gpm_battery_level", batteryBean.level);
                infoMap.put("gpm_battery_capacity", batteryBean.capacity);
                infoMap.put("gpm_power", round(batteryBean.power, 4));
                infoMap.put("gpm_current", batteryBean.current);
                infoMap.put("gpm_battery_temp", batteryBean.temperature);
                infoMap.put("gpm_cpu_temp",  performanceManager.getCpuTemperature());
                infoMap.put("gpm_gpu_temp",  performanceManager.getGpuTemperature());
                infoMap.put("gpm_cpu_usage",  performanceManager.getCpuUsage(context));

                if (callBack != null) {
                    callBack.onPerformanceMap(infoMap);
                }

            }
        });
    }

    public static double round(double value, int scale) {
        double result = value;
        try {
            BigDecimal bd = new BigDecimal(Double.toString(value));
            result = bd.setScale(scale, RoundingMode.HALF_UP).doubleValue();
        }catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }



}
