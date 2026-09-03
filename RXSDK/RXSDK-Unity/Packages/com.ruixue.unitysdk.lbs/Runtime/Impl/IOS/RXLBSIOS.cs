using System.Runtime.InteropServices;
using AOT;
#if UNITY_IOS
namespace RuiXue.LBS
{
    public static class RXLBSIOS
    {
        public delegate void RequestLocationAuthorizationDelegate(bool authorized);
        
        private static RequestLocationAuthorizationDelegate _onRequestAuthorization;
        
        /// <summary>
        /// 初始化，注册高德key
        /// </summary>
        /// <param name="appKey"></param>
        public static void Init(string appKey)
        {
            ios_lbs_registeAMWithAppkey(appKey);
        }

        /// <summary>
        /// 获取位置信息
        /// </summary>
        /// <param name="onGet"></param>
        /// <param name="onError"></param>
        public static void GetLocationInfo(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_lbs_getLocationInfo", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_lbs_getLocationInfo(RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        /// <summary>
        /// 判断定位权限
        /// </summary>
        /// <returns></returns>
        public static bool IsEnableLocation()
        {
            return ios_lbs_enableLocationAuthorizationStatus();
        }

        public static void RequestLocationAuthorization(RequestLocationAuthorizationDelegate requestCallBack)
        {
            _onRequestAuthorization = requestCallBack;
            ios_lbs_requestLocationAuthorization(UnityBridgeRequestAuthorization);
        }
        
        /// <summary>
        /// 设置是否允许后台定位
        /// </summary>
        /// <param name="allow"></param>
        public static void SetAllowsBackgroundLocationUpdates(bool allow)
        {
            ios_lbs_setAllowsBackgroundLocationUpdates(allow);
        }

        /// <summary>
        /// 设置定位超时时间
        /// </summary>
        /// <param name="timeout"></param>
        public static void SetLocationTimeout(int timeout)
        {
            ios_lbs_setLocationTimeout(timeout);
        }
        
        [MonoPInvokeCallback(typeof(RequestLocationAuthorizationDelegate))]
        private static void UnityBridgeRequestAuthorization(bool authorized)
        {
            if (_onRequestAuthorization != null)
                _onRequestAuthorization.Invoke(authorized);
        }

        // 注册高德key
        [DllImport("__Internal")]
        private static extern void ios_lbs_registeAMWithAppkey(string appkey);

// 判断定位权限
        [DllImport("__Internal")]
        private static extern bool ios_lbs_enableLocationAuthorizationStatus();

// 请求定位权限
        [DllImport("__Internal")]
        private static extern void ios_lbs_requestLocationAuthorization(RequestLocationAuthorizationDelegate requestCallBack);

// 获取位置信息
        [DllImport("__Internal")]
        private static extern void ios_lbs_getLocationInfo(IOSCallBackCommonDelegate onSuccess, IOSCallBackCommonDelegate onError);

// 是否允许后台定位  默认为NO不开启后台定位
        [DllImport("__Internal")]
        private static extern void  ios_lbs_setAllowsBackgroundLocationUpdates(bool allow);

// 设置定位超时时间  默认为2秒
        [DllImport("__Internal")]
        private static extern void  ios_lbs_setLocationTimeout(int timeout);
    }
}
#endif