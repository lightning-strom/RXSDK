using UnityEngine;
using System;

namespace RuiXue.Performance.Impl
{
    public class PerformManceReportNotSupport : IPerformReport
    {
        public void PerformReport(OnPerformanceCallback callback)
        {
            throw new System.NotImplementedException();
        }

        public void IOSPerformReport(IOSOnPerformanceCallback callback)
        {
            throw new System.NotImplementedException();
        }

        public void IOSReportUwaInfo(string uwaInfo)
        {
            throw new System.NotImplementedException();
        }

        public void IOSInitUwaCallBack(IOSGetUwaInfoPostNotiToOC callback)
        {
            throw new System.NotImplementedException();
        }
        
        public void IOSPostUwaInfoNoti(string uwaInfo)
        {
            throw new System.NotImplementedException();
        }
        
        
    }
}