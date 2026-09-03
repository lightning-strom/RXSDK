package com.ruixue.rxsdk_performance;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;

public class BatteryHelper {

    public static int getBatteryLevel(Context context) {
        int batteryLevel = 0;
        try
        {
            BatteryManager batteryManager = (BatteryManager) context.getSystemService(Context.BATTERY_SERVICE);
            if (batteryManager != null) {
                batteryLevel = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY);
            }
        }catch (Exception e) {
            e.printStackTrace();
        }
        return batteryLevel;
    }

    public static double getBatteryCapacity(Context context) {
        double batteryCapacity = 0;
        Object mPowerProfile;
        final String POWER_PROFILE_CLASS = "com.android.internal.os.PowerProfile";
        try {
            mPowerProfile = Class.forName(POWER_PROFILE_CLASS).getConstructor(Context.class).newInstance(context);
            batteryCapacity = (double) Class.forName(POWER_PROFILE_CLASS).getMethod("getBatteryCapacity").invoke(mPowerProfile);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return batteryCapacity;
    }

    public static int getBatteryCurrent(Context context) {
        int batteryLevel = 0;
        try {
            BatteryManager batteryManager = (BatteryManager) context.getSystemService(Context.BATTERY_SERVICE);
            if (batteryManager != null) {
                batteryLevel = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CURRENT_NOW);
            }
        }catch (Exception e) {
            e.printStackTrace();
        }
        return batteryLevel;
    }

    public static BatteryBean getBatteryBean(Context context) {
        IntentFilter filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        Intent receiver = context.registerReceiver(null, filter);
        BatteryBean batteryBean = new BatteryBean();
        batteryBean.current = getBatteryCurrent(context);
        if (receiver == null) {
            return batteryBean;
        }
        int voltage = receiver.getIntExtra("voltage", 0); //获取电压(mv)
        int level = receiver.getIntExtra("level", 0); //获取当前电量
        double temperature = receiver.getIntExtra("temperature", 0)/10.0; //获取温度(数值)并转为电池摄氏温度
        batteryBean.voltage = voltage;
        batteryBean.level = level;
        batteryBean.temperature = temperature;

        return batteryBean;
    }

    public static class BatteryBean {
        public BatteryBean() {
        }

        public BatteryBean(int capacity, int voltage, int level, double temperature) {
            this.capacity = capacity;
            this.voltage = voltage;
            this.level = level;
            this.temperature = temperature;
        }

        public double capacity = 0;
        public int voltage = 0;
        public int level = 0;
        public double temperature = 0;
        public int current = 0;
        public double power = 0;

        @Override
        public String toString() {
            return "BatteryBean{" +
                    "capacity=" + capacity +
                    ", voltage=" + voltage +
                    ", level=" + level +
                    ", temperature=" + temperature +
                    ", current=" + current +
                    ", power=" + power +
                    '}';
        }
    }

}
