using System;
namespace RuiXue.Performance.Impl
{
    public interface IPerformReport
    {
        public void PerformReport(OnPerformanceCallback callback);
        
        /// <summary>
        /// 获取iOS设备UWA信息开关与时间间隔
        /// </summary>
        /// <param name="callback"></param>
        public void IOSPerformReport(IOSOnPerformanceCallback callback);
        
        /// <summary>
        /// 上传iOS设备UWA信息
        /// </summary>
        /// <param name="callback"></param>
        public void IOSReportUwaInfo(string uwaInfo);

        /// <summary>
        /// C# 调用 Objective-C，传递回调函数，后续OC使用此回调方法，反向调用C#
        /// </summary>
        public void IOSInitUwaCallBack(IOSGetUwaInfoPostNotiToOC callback);

        /// <summary>
        /// iOS发送通知，将UWA数据传值给OC的RXLogService
        /// </summary>
        /// <param name="uwaInfo"></param>
        public void IOSPostUwaInfoNoti(string uwaInfo);
    }
}