package com.ruixue.emulatordetect;

import android.content.Context;
import com.ruixue.RXRequestCallback;
import com.ruixue.net.RXRequest;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;


public class SimulatorDetectTool {

    public JSONObject customSimulatorDetectionParams;

    private SimulatorDetectTool() {

    }

    private static class SingletonHolder {
        private static final SimulatorDetectTool INSTANCE = new SimulatorDetectTool();
    }

    public static SimulatorDetectTool getSingleInstance() {
        return SimulatorDetectTool.SingletonHolder.INSTANCE;
    }

    public void setCustomSimulatorDetectionParams(Map<String, Object> map) {
        customSimulatorDetectionParams = JSONUtil.toJSONObject(map);
    }

    public void simulatorDetection(Context context, int type, RXRequestCallback callBack) {

        Map<String, Object> bodyMap = new HashMap<>();

        if (customSimulatorDetectionParams != null) {
            bodyMap.put("cp_rules", customSimulatorDetectionParams);
        }

        if (getDeviceInfo(context) != null) {
            bodyMap.put("rx_rules", getDeviceInfo(context));
        }

        bodyMap.put("type", type);

        RXRequest.create("/v1/safety/simulator_detection").setNeedLoggedIn(false).setBody(bodyMap).postAsync(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                if (callBack != null) {
                    callBack.onResponse(jsonObject);
                }
            }
        });
    }

    public JSONObject getDeviceInfo(Context context) {
        try {
            Map<String, Object> deviceInfo = DeviceInfoRequireUtil.
                    getSingleInstance().readSysProperty(context);
            if (deviceInfo != null) {
                return JSONUtil.toJSONObject(deviceInfo);
            }
        }catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


}
