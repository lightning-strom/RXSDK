#if UNITY_IOS
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;

namespace RuiXue.Performance.Impl
{
    public class PerformManceReportIOS : IPerformReport
    {
        private static IOSOnPerformanceCallback _onPerformanceDelegate;
        private static IOSGetUwaInfoPostNotiToOC _getUwaInfoPostNotiToOCDelegate;
        
        [AOT.MonoPInvokeCallback(typeof(IOSOnPerformanceCallback))]
        static void IOSOnPerformanceCallbackBridge(string data)
        {
            if (_onPerformanceDelegate != null)
            {
                LogUtil.Log("_onPerformanceDelegate","invoke");
                _onPerformanceDelegate.Invoke(data);
            }
        }
        
        [AOT.MonoPInvokeCallback(typeof(IOSGetUwaInfoPostNotiToOC))]
        static void IOSGetUwaInfoPostNotiToOCBridge()
        {
            if (_getUwaInfoPostNotiToOCDelegate != null)
            {
                _getUwaInfoPostNotiToOCDelegate.Invoke();
            }
        }
        
        public void PerformReport(OnPerformanceCallback callback)
        {
            LogUtil.WarningNotSupport("PerformReport-OnPerformanceCallback");
        }

        public void IOSPerformReport(IOSOnPerformanceCallback callback)
        {
            _onPerformanceDelegate = callback;
            ios_uwaGetInfoWithFuncs(IOSOnPerformanceCallbackBridge);
        }

        public void IOSReportUwaInfo(string uwaInfo)
        {
            ios_uploadUwaInfoFunc(uwaInfo);
        }
        
        public void IOSInitUwaCallBack(IOSGetUwaInfoPostNotiToOC callback)
        {
            _getUwaInfoPostNotiToOCDelegate = callback;
            ios_registerCallback(IOSGetUwaInfoPostNotiToOCBridge);
        }

        public void IOSPostUwaInfoNoti(string uwaInfo)
        {
            ios_postNotiWithUwaInfoFunc(uwaInfo);
        }

        [DllImport("__Internal")]
        private static extern void ios_uwaGetInfoWithFuncs(IOSOnPerformanceCallback callBack);
        
        [DllImport("__Internal")]
        private static extern void ios_uploadUwaInfoFunc(string uwaInfo);

        [DllImport("__Internal")]
        private static extern void ios_postNotiWithUwaInfoFunc(string uwaInfo);
        
        [DllImport("__Internal")]
        private static extern void ios_registerCallback(IOSGetUwaInfoPostNotiToOC callback);
    }
}
#endif