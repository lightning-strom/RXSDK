using System.Runtime.InteropServices;
using RuiXue.Impl;
using RuiXueLitJson;

#if UNITY_WEBGL
namespace RuiXue.LBS
{
    public static class RXLBSWebGL
    {
        private static JsCallBackHelper _jsCallBackHelper = new JsCallBackHelper();
        
        /// <summary>
        /// 授权定位
        /// 注：微信小游戏需要在game.json中配置权限
        ///    "permission":{
        ///         "scope.userFuzzyLocation":{
        ///         "desc":"你的位置信息将用于小游戏位置接口的效果展示"
        ///         }
        ///     },
        ///     "requiredPrivateInfos":[
        ///         "getFuzzyLocation"
        ///    ],
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void AuthorizeLocation(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_authorizeLocation", onResponse, onError);
            
            rx_authorizeLocation();
        }

        /// <summary>
        /// 开启定位上报
        /// </summary>
        /// <param name="types"></param>
        /// <param name="reportSpace"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void StartReportLocation(string[] types, float reportSpace, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["types"] = JsonMapper.ToObject(JsonMapper.ToJson(types)),
                ["reportSpace"] = reportSpace
            };
            
            _jsCallBackHelper.RegisterJsCallBack("rx_startReportLocation", onResponse, onError);
            rx_startReportLocation(data.ToJson());
        }

        /// <summary>
        /// 关闭定位上报
        /// </summary>
        public static void StopReportLocation()
        {
            rx_stopReportLocation();
        }
        
        /// <summary>
        /// TODO: 定位更新
        /// </summary>
        public static void ReportLocationUpdate()
        {
            rx_reportLocationUpdate();
        }
        
        [DllImport("__Internal")]
        private static extern void rx_authorizeLocation();
        
        [DllImport("__Internal")]
        private static extern void rx_startReportLocation(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_stopReportLocation();

        [DllImport("__Internal")]
        private static extern void rx_reportLocationUpdate();
    }
}
#endif