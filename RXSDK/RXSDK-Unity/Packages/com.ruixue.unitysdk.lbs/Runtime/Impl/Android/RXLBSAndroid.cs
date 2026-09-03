#if UNITY_ANDROID
using UnityEngine;

namespace RuiXue.LBS
{
    public static class RXLBSAndroid
    {
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaClass _gpsUtil;

        /// <summary>
        /// 初始化定位
        /// </summary>
        public static void InitLocation()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _gpsUtil = new AndroidJavaClass("com.ruixue.gaoede.GpsUtil");
            
            _gpsUtil.CallStatic("initLocation", _contextObj);
        }

        /// <summary>
        /// 获取GPS状态的字符串
        /// </summary>
        /// <param name="statusCode"></param>
        /// <returns></returns>
        public static string GetGPSStatusString(int statusCode)
        {
            return _gpsUtil.CallStatic<string>("getGPSStatusString", statusCode);
        }

        /// <summary>
        /// 设置参数
        /// </summary>
        /// <param name="cbAddress"></param>
        /// <param name="cbGpsFirst"></param>
        /// <param name="cbCacheAble"></param>
        /// <param name="cbOnceLocation"></param>
        /// <param name="cbOnceLastest"></param>
        /// <param name="cbSensorAble"></param>
        /// <param name="strInterval"></param>
        /// <param name="strTimeout"></param>
        public static void ResetOption(bool cbAddress, bool cbGpsFirst, bool cbCacheAble, bool cbOnceLocation, bool cbOnceLastest,
            bool cbSensorAble, long strInterval, long strTimeout)
        {
            _gpsUtil.CallStatic("resetOption", cbAddress, cbGpsFirst, cbCacheAble, 
                cbOnceLocation, cbOnceLastest, cbSensorAble, strInterval, strTimeout);
        }

        /// <summary>
        /// 开始定位
        /// </summary>
        /// <param name="cbAddress"></param>
        /// <param name="cbGpsFirst"></param>
        /// <param name="cbCacheAble"></param>
        /// <param name="cbOnceLocation"></param>
        /// <param name="cbOnceLastest"></param>
        /// <param name="cbSensorAble"></param>
        /// <param name="strInterval"></param>
        /// <param name="strTimeout"></param>
        /// <param name="channelCallback"></param>
        public static void StartLocation(bool cbAddress, bool cbGpsFirst, bool cbCacheAble, bool cbOnceLocation, bool cbOnceLastest,
            bool cbSensorAble, long strInterval, long strTimeout, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _gpsUtil.CallStatic("startLocation", _contextObj, cbAddress, cbGpsFirst, cbCacheAble, cbOnceLocation,
                cbOnceLastest, cbSensorAble, strInterval, strTimeout, 
                new ConvertRXStringCallbackProxy(onResponse, onError));
        }

        /// <summary>
        /// 开始定位
        /// </summary>
        /// <param name="types"></param>
        /// <param name="duration"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        /// <param name="channelCallback"></param>
        public static void StartLocation(string[] types, int duration, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _gpsUtil.CallStatic("startLocation", _contextObj, types, duration, 
                new ConvertRXStringCallbackProxy(onResponse, onError));
        }

        /// <summary>
        /// 停止定位 销毁定位
        /// </summary>
        public static void StopLocation()
        {
            _gpsUtil.CallStatic("stopLocation");
        }

        /// <summary>
        /// 输入GCJ-02经纬度 转WGS纬度
        /// </summary>
        /// <param name="lat"></param>
        /// <param name="lon"></param>
        /// <returns></returns>
        public static double WGSLat(double lat, double lon)
        {
            return _gpsUtil.CallStatic<double>("WGSLat", lat, lon);
        }

        /// <summary>
        /// 输入GCJ经纬度 转WGS经度
        /// </summary>
        /// <param name="lat"></param>
        /// <param name="lon"></param>
        /// <returns></returns>
        public static double WGSLon(double lat, double lon)
        {
            return _gpsUtil.CallStatic<double>("WGSLon", lat, lon);
        }

        /// <summary>
        /// 坐标转换算法 转换经度所需
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <returns></returns>
        public static double TransformLon(double x, double y)
        {
            return _gpsUtil.CallStatic<double>("transformLon", x, y);
        }

        /// <summary>
        /// 坐标转换算法 转换纬度所需
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <returns></returns>
        public static double TransformLat(double x, double y)
        {
            return _gpsUtil.CallStatic<double>("transformLat", x, y);
        }
    }
}
#endif
