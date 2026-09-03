#if UNITY_ANDROID
using UnityEngine;
using System;

namespace RuiXue.Performance.Impl
{
    public class PerformManceReportAndroid : IPerformReport
    {
        private static AndroidJavaObject _rxSdkObj;
        private static AndroidJavaObject _sInstanceObj;

        public PerformManceReportAndroid()
        {
            _rxSdkObj = new AndroidJavaClass("com.ruixue.performancereport.PerformReportManager");
            _sInstanceObj = _rxSdkObj.CallStatic<AndroidJavaObject>("getInstance");
        }
        
        public void PerformReport(OnPerformanceCallback callback)
        {
            _sInstanceObj.Call("report", new PerformManceCallbackJavaProxy(callback));
        }
        
        public void IOSPerformReport(IOSOnPerformanceCallback callback)
        {
            LogUtil.WarningNotSupport("IOSPerformReport");
        }

        public void IOSReportUwaInfo(string uwaInfo)
        {
            LogUtil.WarningNotSupport("IOSReportUwaInfo");
        }

        public void IOSInitUwaCallBack(IOSGetUwaInfoPostNotiToOC callback)
        {
            LogUtil.WarningNotSupport("IOSInitUwaCallBack");
        }
        
        public void IOSPostUwaInfoNoti(string uwaInfo)
        {
            LogUtil.WarningNotSupport("IOSPostUwaInfoNoti");
        }
        
        
    }
}
#endif