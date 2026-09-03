using System;
using System.Collections.Generic;
using System.Timers;
using RuiXue.Performance.Impl;
using RuiXue.UWA;
using RuiXueLitJson;

namespace RuiXue.Performance
{
    public class PerformManceReport
    {
            
        private static Timer timer;
            
#if UNITY_ANDROID
        private static readonly IPerformReport _sdk = new PerformManceReportAndroid();
#elif UNITY_IOS
        private static readonly IPerformReport _sdk = new PerformManceReportIOS();
#else
        private static IPerformReport _sdk = new PerformManceReportNotSupport();
#endif

            public static void PerformReport()
            {
#if UNITY_ANDROID
                _sdk.PerformReport(ReportCallback);
#elif UNITY_IOS
                 _sdk.IOSPerformReport(GetTypeAndTsInfo);
                 _sdk.IOSInitUwaCallBack(GetUwaInfoBackToOCFunction);
#else
                _sdk.PerformReport(ReportCallback);
#endif
            }

            public static string ReportCallback()
            {
                    Dictionary<string, object> info = new Dictionary<string, object>();
                    info.Add("DEVICE_ID", RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.DEVICE_ID));
                    // info.Add("DEVICE_MODEL", RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.DEVICE_MODEL));
                    // info.Add("SYSTEM", RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.SYSTEM));
                    info.Add("RESOLUTION", RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.RESOLUTION));
                    info.Add("GRAPHIC_API", RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.GRAPHIC_API));
                    
                    // LogUtil.Log("uwa_info", "session id: " + RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.SESSION_ID));
                    // LogUtil.Log("uwa_info", "user id: " + RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.USER_ID));
                    // LogUtil.Log("uwa_info", "app version: " + RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.APP_VERSION));
                    // LogUtil.Log("uwa_info", "app channel: " + RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.APP_CHANNEL));
                    
                    String emulator = RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.EMULATOR);
                    info.Add("EMULATOR", "true".Equals(emulator));
                    
                    String root = RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.ROOT);
                    info.Add("ROOT", "true".Equals(root));
                    
                    try
                    {
                            string cpuCore = RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.CPU_CORE);
                            info.Add("CPU_CORE", int.Parse(cpuCore));
                            string ramMb = RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.RAM_MB);
                            info.Add("RAM_MB", int.Parse(ramMb));
                            string romGB = RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.ROM_GB);
                            info.Add("ROM_GB", int.Parse(romGB));
                    }
                    catch (Exception e) {}
                    info.Add("GPU_MODEL", RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.GPU_MODEL));
                    
                    info.Add("gpm_fps", RuiXueUWAGPM.GetSDKData(UWAGPM.SDKMetricType.FPS));
                    info.Add("gpm_jank", RuiXueUWAGPM.GetSDKData(UWAGPM.SDKMetricType.JANK));
                    info.Add("gpm_process_memory_mb", RuiXueUWAGPM.GetSDKData(UWAGPM.SDKMetricType.PROCESS_MEMORY_MB));
                    info.Add("gpm_battery_level", RuiXueUWAGPM.GetSDKData(UWAGPM.SDKMetricType.BATTERYLEVEL));
                    info.Add("gpm_battery_capacity", RuiXueUWAGPM.GetSDKData(UWAGPM.SDKMetricType.BATTERYCAPACITY));
                    info.Add("gpm_power", RuiXueUWAGPM.GetSDKData(UWAGPM.SDKMetricType.POWER));
                    info.Add("gpm_current", RuiXueUWAGPM.GetSDKData(UWAGPM.SDKMetricType.CURRENT));
                    info.Add("gpm_battery_temp", RuiXueUWAGPM.GetSDKData(UWAGPM.SDKMetricType.BATTERYTEMP));
                    info.Add("gpm_cpu_temp", RuiXueUWAGPM.GetSDKData(UWAGPM.SDKMetricType.CPUTEMP));
                    info.Add("gpm_gpu_temp", RuiXueUWAGPM.GetSDKData(UWAGPM.SDKMetricType.GPUTEMP));
                    
                    // LogUtil.Log("rxuwa report", JsonMapper.ToJson(info));
                    return JsonMapper.ToJson(info);
            }
            
            
            /// <summary>
            /// 获取初始化上传uwa开关与时间间隔，时间间隔为0不上传，且类型需both、uwa方可上传
            /// </summary>
            /// <param name="data"></param>
            private static void GetTypeAndTsInfo(string data)
            {
                    if (data.Length == 0 || data == "**")
                    {
                            LogUtil.Log("获取上传开关与上传时间间隔失败","");
                            return;
                    }
                    string[] parts = data.Split(new string[] { "**" }, StringSplitOptions.None);
                    string type = "";
                    int ts = 0;
                    if (parts.Length == 2)
                    {
                            type = parts[0];
                            ts = int.Parse(parts[1]);
                    }else {
                            LogUtil.Log("获取上传开关与上传时间间隔失败","");
                            return;
                    }
                    //时间间隔为0，无需上传
                    if (ts == 0)
                    {
                         return;   
                    }

                    if (type == "both" || type == "uwa")//创建定时器并上传
                    {
                            //先调用一次上报方法，解决创建定时器后无法立即执行，需要等待时间间隔后方可执行的问题
                            
                            _sdk.IOSReportUwaInfo(ReportCallback());
                            if (timer == null)
                            {
                                    // 创建一个 Timer 实例，时间间隔单位为毫秒，所以需要乘1000
                                    timer = new Timer(ts * 1000);
                                    // 绑定定时器的事件处理方法
                                    timer.Elapsed += OnTimedEvent;
                                    // 设置定时器为自动重置，即每隔指定时间间隔重复调用
                                    timer.AutoReset = true;
                                    // 启动定时器
                                    timer.Enabled = true;     
                            }
                    }else { 
                         return;
                    }

            }
            
            /// <summary>
            /// 定时器事件处理方法
            /// </summary>
            /// <param name="source"></param>
            /// <param name="e"></param>
            private static void OnTimedEvent(Object source, ElapsedEventArgs e)
            {
                    _sdk.IOSReportUwaInfo(ReportCallback());
            }
            
            /// <summary>
            /// 埋点上报时，回调此方法出发C#，获取UWA数据并发送通知到RXLogService
            /// </summary>
            public static void GetUwaInfoBackToOCFunction()
            {
#if UNITY_ANDROID
                //iOS专用，其他平台无需实现
#elif UNITY_IOS
                    string uwaInfoStr = ReportCallback();
                    _sdk.IOSPostUwaInfoNoti(uwaInfoStr);
#else
                //iOS专用，其他平台无需实现
#endif
            }
        
    }
}