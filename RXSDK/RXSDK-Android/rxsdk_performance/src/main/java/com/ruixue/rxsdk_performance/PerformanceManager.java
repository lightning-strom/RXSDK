package com.ruixue.rxsdk_performance;

import android.app.ActivityManager;
import android.content.Context;
import android.graphics.Point;
import android.opengl.GLES20;
import android.os.Build;
import android.os.Debug;
import android.os.Environment;
import android.os.Looper;
import android.os.StatFs;
import android.provider.Settings;
import android.util.Log;
import android.view.Display;
import android.view.WindowManager;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.RandomAccessFile;
import java.util.Objects;

import android.opengl.EGL14;
import android.opengl.EGLConfig;
import android.opengl.EGLContext;
import android.opengl.EGLDisplay;
import android.opengl.EGLSurface;


public class PerformanceManager {

    public static final String TAG = PerformanceManager.class.getName();

    private PerformanceManager() {
    }

    public static PerformanceManager getInstance() {
        return PerformanceManager.SingletonInternalClassHolder.INSTANCE;
    }

    private static class SingletonInternalClassHolder {
        private static final PerformanceManager INSTANCE = new PerformanceManager();
    }

    public void getFPS(FpsMonitor.FPSCallBack callBack) {
        FpsMonitor fpsMonitor = new FpsMonitor();
        fpsMonitor.start(new FpsMonitor.FPSCallBack() {
            @Override
            public void onValue(double fps, double jank) {
                Log.d(TAG, "Current FPS: " + fps + ", Current JANK: " + jank);
                if (callBack != null) {
                    callBack.onValue(fps, jank);
                }
            }
        });
    }

    public int getProcessMemory(Context context) {

        try {
            ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
            // 该设备整体内存情况
            ActivityManager.MemoryInfo systemMemoryInfo = new ActivityManager.MemoryInfo();
            activityManager.getMemoryInfo(systemMemoryInfo);
            int pid = android.os.Process.myPid();
            int[] pids = new int[]{pid};
            Debug.MemoryInfo[] memoryInfoArray = activityManager.getProcessMemoryInfo(pids);
            Debug.MemoryInfo memoryInfo = memoryInfoArray[0];

            int totalPss = memoryInfo.getTotalPss() / 1024;
            int totalPrivateDirty = memoryInfo.getTotalPrivateDirty() / 1024;
            int totalSharedDirty = memoryInfo.getTotalSharedDirty() / 1024;

            int total = totalPss + totalPrivateDirty + totalSharedDirty;

            Log.d(TAG, "PROCESS_MEMORY_MB: " + total);


            return total;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return 0;


    }

    private static long getDirSize(File dir) {
        long size = 0;
        File[] files = dir.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    size += getDirSize(file);
                } else {
                    size += file.length();
                }
            }
        }
        return size;
    }

//    public int getBatteryLevel(Context context) {
//        Log.d(TAG, "当前剩余电量百分比: " + BatteryHelper.getBatteryLevel(context));
//        return BatteryHelper.getBatteryLevel(context);
//    }
//
//    public double getBatteryCapacity(Context context) {
//        Log.d(TAG, "当前电池总容量: " + BatteryHelper.getBatteryCapacity(context));
//        return BatteryHelper.getBatteryCapacity(context);
//    }
//
//    public int getBatteryCurrent(Context context) {
//        Log.d(TAG, "当前耗电量: " +  BatteryHelper.getBatteryCurrent(context));
//        return BatteryHelper.getBatteryCurrent(context);
//    }

    public BatteryHelper.BatteryBean getBatteryBean(Context context) {
        BatteryHelper.BatteryBean batteryBean = BatteryHelper.getBatteryBean(context);
        batteryBean.capacity = BatteryHelper.getBatteryCapacity(context);
        if (batteryBean.voltage != 0) {
            double voltageV = batteryBean.voltage / 1000.0;
            batteryBean.power = voltageV * batteryBean.current;
        }
        return batteryBean;
    }

    String[] cpuFiles = new String[]{
            "/sys/devices/system/cpu/cpu0/cpufreq/cpu_temp",
            "/sys/devices/system/cpu/cpu0/cpufreq/FakeShmoo_cpu_temp",
            "/sys/class/thermal/thermal_zone1/temp",
            "/sys/class/i2c-adapter/i2c-4/4-004c/temperature",
            "/sys/devices/platform/tegra-i2c.3/i2c-4/4-004c/temperature",
            "/sys/devices/platform/omap/omap_temp_sensor.0/temperature",
            "/sys/devices/platform/tegra_tmon/temp1_input",
            "/sys/kernel/debug/tegra_thermal/temp_tj",
            "/sys/devices/platform/s5p-tmu/temperature",
            "/sys/class/thermal/thermal_zone0/temp",
            "/sys/devices/virtual/thermal/thermal_zone0/temp",
            "/sys/class/hwmon/hwmon0/device/temp1_input",
            "/sys/devices/virtual/thermal/thermal_zone1/temp",
            "/sys/devices/platform/s5p-tmu/curr_temp"
    };

    public int getCpuTemperature() {

        if (Looper.getMainLooper().getThread() == Thread.currentThread()) {
            Log.d(TAG, "当前调用在主线程，无法获取cpu温度");
            return 0;
        }

        int count = 10;

        File correctSensorFile = null;
        for (String file : cpuFiles) {
            File f = new File(file);
            if (f.exists()) {
                correctSensorFile = f;
                Log.d(TAG, "当前文件 ：" + correctSensorFile.getPath());
                break;
            }
        }
        if (correctSensorFile != null) {
            RandomAccessFile reader = null;
            try {
                reader = new RandomAccessFile(correctSensorFile, "r");
                int value = Integer.parseInt(reader.readLine());

                while ((value < 0 && count > 0)) {
                    Log.d(TAG, "等待最新cpu温度 循环次数： " + (10 - count));
                    reader.seek(0);
                    value = Integer.parseInt(reader.readLine());
                    count--;
                    Thread.sleep(500);
                }
                Log.d(TAG, "CPU 温度：" + value + ", 文件： " + correctSensorFile.getPath());
                return value / 1000;
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (reader != null) {
                    try {
                        reader.close();
                    } catch (IOException ioe) {
                        Log.w(TAG, "关闭文件流失败", ioe);
                    }
                }
            }
        }

        return 0;

    }

    String[] gpuFiles = new String[]{
            "/sys/class/thermal/thermal_zone45/temp",
            "/sys/class/thermal/thermal_zone33/temp",
            "/sys/devices/virtual/thermal/thermal_zone10/temp",
            "/sys/devices/virtual/thermal/thermal_zone9/temp"
    };

    public int getGpuTemperature() {
        File correctSensorFile = null;
        for (String file : gpuFiles) {
            File f = new File(file);
            if (f.exists()) {
                correctSensorFile = f;
                break;
            }
        }

        if (correctSensorFile != null) {
            RandomAccessFile reader = null;
            try {
                reader = new RandomAccessFile(correctSensorFile, "r");
                String value = reader.readLine();

                Log.d(TAG, "GPU 温度：" + value);
                return Integer.parseInt(value) / 1000;

            } catch (Exception e) {
                Log.w(TAG, Objects.requireNonNull(e.getMessage()));
            } finally {

                if (reader != null) {
                    try {
                        reader.close();
                    } catch (IOException ioe) {
                        Log.w(TAG, "关闭文件流失败", ioe);
                    }
                }
            }
        }
        return 0;
    }

    public String getDeviceID(Context context) {
        String deviceID = "";
        try {
            deviceID = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ANDROID_ID);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Log.d(TAG, "deviceid: " + deviceID);
        return deviceID;
    }

    public String getDeviceModel() {
        String deviceModel = Build.MODEL;
        Log.d(TAG, "deviceModel: " + deviceModel);
        return deviceModel;
    }

    public String getSystemVersion() {
        String version = Build.VERSION.RELEASE;
        Log.d(TAG, "version: " + version);
        return "Android " + version;
    }

    public String getResolution(Context context) {
        WindowManager windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
        Display display = windowManager.getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        int width = size.x;
        int height = size.y;
        String resolution = width + " x " + height;
        Log.d(TAG, "resolution: " + resolution);
        return resolution;

    }

    public String getGraphicApi() {
        int currentApiLevel = Build.VERSION.SDK_INT;
        if (currentApiLevel >= Build.VERSION_CODES.P) {
            return "Vulkan";
        } else {
            return "OpenGL";
        }
    }

    public boolean isDeviceRooted() {
        // 检查是否存在常见的root管理应用
        String[] paths = {
                "/system/app/Superuser.apk",
                "/sbin/su",
                "/system/bin/su",
                "/system/xbin/su",
                "/data/local/xbin/su",
                "/data/local/bin/su",
                "/system/sd/xbin/su",
                "/system/bin/failsafe/su",
                "/data/local/su",
                "/su/bin/su"
        };

        for (String path : paths) {
            if (new File(path).exists()) {
                return true;
            }
        }

        // 尝试执行root命令
        Process process = null;
        try {
            process = Runtime.getRuntime().exec(new String[]{"su"});
            process.waitFor();
            return process.exitValue() == 0;
        } catch (Exception e) {
            // 如果抛出异常，通常意味着设备没有root
            return false;
        } finally {
            if (process != null) {
                process.destroy();
            }
        }
    }

    public int getCpuCoreNumber() {
        try {
            // 读取系统文件/proc/cpuinfo来获取CPU信息
            String[] cpuInfo = readSystemFile("/proc/cpuinfo").split("\n");
            int cores = 0;
            for (String info : cpuInfo) {
                // 如果这一行包含"processor"，那么说明有一个CPU核心
                if (info.contains("processor")) {
                    cores++;
                }
            }
            return cores;
        } catch (Exception e) {
            e.printStackTrace();
            return 1; // 如果无法读取，默认返回1个核心
        }
    }

    private String readSystemFile(String filePath) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new FileReader(filePath));
        String line;
        StringBuilder stringBuilder = new StringBuilder();
        while ((line = bufferedReader.readLine()) != null) {
            stringBuilder.append(line).append("\n");
        }
        bufferedReader.close();
        return stringBuilder.toString();
    }

    public String getGpuModel() {
        String render = "";
        try {
            EGLDisplay dpy = EGL14.eglGetDisplay(EGL14.EGL_DEFAULT_DISPLAY);
            int[] vers = new int[2];
            EGL14.eglInitialize(dpy, vers, 0, vers, 1);

            int[] configAttr = {
                    EGL14.EGL_COLOR_BUFFER_TYPE, EGL14.EGL_RGB_BUFFER,
                    EGL14.EGL_LEVEL, 0,
                    EGL14.EGL_RENDERABLE_TYPE, EGL14.EGL_OPENGL_ES2_BIT,
                    EGL14.EGL_SURFACE_TYPE, EGL14.EGL_PBUFFER_BIT,
                    EGL14.EGL_NONE
            };
            EGLConfig[] configs = new EGLConfig[1];
            int[] numConfig = new int[1];
            EGL14.eglChooseConfig(dpy, configAttr, 0,
                    configs, 0, 1, numConfig, 0);
            if (numConfig[0] == 0) {
                // TROUBLE! No config found.
            }
            EGLConfig config = configs[0];

            int[] surfAttr = {
                    EGL14.EGL_WIDTH, 64,
                    EGL14.EGL_HEIGHT, 64,
                    EGL14.EGL_NONE
            };
            EGLSurface surf = EGL14.eglCreatePbufferSurface(dpy, config, surfAttr, 0);

            int[] ctxAttrib = {
                    EGL14.EGL_CONTEXT_CLIENT_VERSION, 2,
                    EGL14.EGL_NONE
            };
            EGLContext ctx = EGL14.eglCreateContext(dpy, config, EGL14.EGL_NO_CONTEXT, ctxAttrib, 0);

            EGL14.eglMakeCurrent(dpy, surf, surf, ctx);
            render = GLES20.glGetString(GLES20.GL_RENDERER);
            Log.d(TAG, "GPU_MODEL: " + render);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return render;

    }

    public int getRamSizeInMB() {
        try {
            // 读取/proc/meminfo文件
            BufferedReader bufferedReader = new BufferedReader(new FileReader("/proc/meminfo"));
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                // 查找包含"MemTotal"的行
                if (line.startsWith("MemTotal:")) {
                    // 从行中提取RAM大小（单位：kB），并转换为MB
                    String ramSizeKb = line.split("\\s+")[1];
                    int ramSizeMb = Integer.parseInt(ramSizeKb) / 1024;
                    bufferedReader.close();

                    Log.d(TAG, "RamSize: " + ramSizeMb);

                    return ramSizeMb;
                }
            }
            bufferedReader.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    public long getRomTotalSpace() {

        StatFs internalStatFs = new StatFs(Environment.getRootDirectory().getAbsolutePath());
        long internalTotal;

        StatFs externalStatFs = new StatFs(Environment.getExternalStorageDirectory().getAbsolutePath());
        long externalTotal;

        internalTotal = (internalStatFs.getBlockCountLong() * internalStatFs.getBlockSizeLong()) / (1024 * 1024);
        externalTotal = (externalStatFs.getBlockCountLong() * externalStatFs.getBlockSizeLong()) / (1024 * 1024);
        ;

        long total = (internalTotal + externalTotal) / 1024;
        Log.d(TAG, "ROM_GB: " + total);
        return total;
    }

    public double getCpuUsage(Context context) {
        int rate = 0;
        try {
            String Result;
            Process p = Runtime.getRuntime().exec("top -n 1");
            BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while ((Result = br.readLine()) != null) {
                if (Result.contains(context.getPackageName())) {
                    String[] info = Result.trim().replaceAll(" +", " ").split(" ");
                    Log.d(TAG, "cpu rate: " + Double.parseDouble(info[9]));
                    return Double.parseDouble(info[9]);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return rate;

    }

}
