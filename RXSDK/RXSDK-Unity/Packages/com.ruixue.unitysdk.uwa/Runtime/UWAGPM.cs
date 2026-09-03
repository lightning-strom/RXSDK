using System;
using System.Runtime.InteropServices;
using UnityEngine;

#if UNITY_5_3_OR_NEWER
using UnityEngine.SceneManagement;
using UnityEngine.Profiling;
#endif

namespace UWA
{
    public static partial class UWAGPMInternal
    {
#if UNITY_WEBGL
        const string UWA_DLL = "__Internal";
#elif UNITY_IOS
        const string UWA_DLL = "__Internal";
#else
        const string UWA_DLL = "uwa_gpm";
#endif
        const CallingConvention UWA_CALL = CallingConvention.Cdecl;

#if UNITY_IOS
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        private static extern void UwaGpmUnityShotGlue_Register();
#endif

        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static int UwaGpmCheckIsRegistered();
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmRegister(string url, string appID, string appVersion, string channel);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmSetup(int engineIndex, bool debug);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmSetupCore();
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmStart();
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmAddScene(string sceneName);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmStop();
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmShutdown();
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmEndOfFrame();
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmNetworkLatency(uint valueMs);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaOnApplicationPause(bool pauseStatus);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmSetUserId(string userId);

        // 日志级别控制API
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmSetLogLevel(int level);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static int UwaGpmGetLogLevel();

        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmInputRecord(int fingerId, int action, float x, float y);

        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static float UwaGpmGetSDKData(int type);

#if UNITY_WEBGL
        // WebGL平台特有API
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static int UwaGpmVersionCode();

        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmTickWebGL(uint budgetUs);

        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmWebGLPreRenderTick(uint budgetUs);

        // [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        // internal extern static IntPtr UwaGpmGetSDKInfo(int infoType);
#endif

        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        [return: MarshalAs(UnmanagedType.LPWStr)]
        internal extern static System.IntPtr UwaGpmGetString(string functin_name);

        enum GpmEventParamType
        {
            Int32,
            UInt32,
            Int64,
            UInt64,
            Float,
            Double,
            String,
            Unknown
        };
        [StructLayout(LayoutKind.Sequential)]
        internal struct GpmCatEventParamRaw
        {
            public System.IntPtr key;
            public int type;
            public System.IntPtr value;
        }
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal static extern void UwaGpmAddCatEvent(string name, string category, int paramCount, GpmCatEventParamRaw[] param);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal static extern void UwaGpmAddCatStatus(string name, string category, int paramCount, GpmCatEventParamRaw[] param);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal static extern void UwaGpmNativeCmd(string name, int paramCount, GpmCatEventParamRaw[] param);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal static extern void UwaGpmSetCustomData(string key, System.IntPtr value);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal static extern bool UwaGpmIsLogLevelRecord(int logLevel);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal static extern void UwaGpmAddLog(string category, string msg, string stacks);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static IntPtr UwaGpmGetSamplePtr(string name);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmPushSample(IntPtr ptr);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal extern static void UwaGpmPopSample(IntPtr ptr);

        // ===================== Profiler Bridge =====================
#if UNITY_PROFILER_DEBUG
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        internal delegate void ProfilerCallback(string sampleName);

        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal static extern void UwaGpmSetProfilerCallbacks(ProfilerCallback beginSample, ProfilerCallback endSample);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal static extern void UwaGpmClearProfilerCallbacks();

        // 保持委托引用防止GC回收
        private static ProfilerCallback s_beginSampleCallback;
        private static ProfilerCallback s_endSampleCallback;
        private static bool s_profilerCallbacksRegistered = false;

        [AOT.MonoPInvokeCallback(typeof(ProfilerCallback))]
        private static void OnNativeBeginSample(string sampleName)
        {
#if UNITY_5_3_OR_NEWER
            Profiler.BeginSample(sampleName);
#endif
        }

        [AOT.MonoPInvokeCallback(typeof(ProfilerCallback))]
        private static void OnNativeEndSample(string sampleName)
        {
#if UNITY_5_3_OR_NEWER
            Profiler.EndSample();
#endif
        }

        /// <summary>
        /// 注册Native Profiler回调，使Native层关键步骤在Unity Profiler中可见
        /// 应在UwaGpmSetup之前调用
        /// </summary>
        internal static void RegisterProfilerCallbacks()
        {
            if (s_profilerCallbacksRegistered) return;
            try
            {
                s_beginSampleCallback = OnNativeBeginSample;
                s_endSampleCallback = OnNativeEndSample;
                UwaGpmSetProfilerCallbacks(s_beginSampleCallback, s_endSampleCallback);
                s_profilerCallbacksRegistered = true;
            }
            catch (System.Exception e) { Debug.Log("UWA GPM Profiler: " + e.Message); }
        }

        /// <summary>
        /// 注销Native Profiler回调
        /// </summary>
        internal static void UnregisterProfilerCallbacks()
        {
            if (!s_profilerCallbacksRegistered) return;
            try
            {
                UwaGpmClearProfilerCallbacks();
                s_profilerCallbacksRegistered = false;
            }
            catch (System.Exception e) { Debug.Log("UWA GPM Profiler: " + e.Message); }
        }
#else
        internal static void RegisterProfilerCallbacks() { }
        internal static void UnregisterProfilerCallbacks() { }
#endif

        // 1.3.0.1
        [StructLayout(LayoutKind.Sequential)]
        internal struct GpmEventParamRaw
        {
            public int type;
            public System.IntPtr value;
        }
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal static extern void UwaGpmAddEvent(string name, int paramCount, GpmEventParamRaw[] param);
        [DllImport(UWA_DLL, CallingConvention = UWA_CALL)]
        internal static extern void UwaGpmAddStatus(string name, int paramCount, GpmEventParamRaw[] param);

        internal static bool s_isSetup = false;
        internal static bool s_isRecording = false;
        // string cache to avoid GC
        internal static string s_sceneNameCache;
        internal static string s_userIdCache;

        internal static bool? s_enableCrashReport;

        // 1.3.0.1
        internal static bool s_legacySdk = false;
        internal static bool s_noInputRecord = false;

#if UNITY_IOS && !UNITY_EDITOR
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void Install()
        {
            try { UwaGpmUnityShotGlue_Register(); }
            catch { }
        }
#endif

        public static void Register(string url, string appID, string appVersion, string channel)
        {
            try { UwaGpmRegister(url, appID, appVersion, channel); }
            catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }
        }

        public static int IsRegistered()
        {
            try { return UwaGpmCheckIsRegistered(); }
            catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }
            return 0;
        }

        private static void SetCustomData()
        {
            System.IntPtr model_ptr = Marshal.StringToHGlobalAnsi(SystemInfo.graphicsDeviceName);
            System.IntPtr gpu_version_ptr = Marshal.StringToHGlobalAnsi(SystemInfo.graphicsDeviceVersion);
            System.IntPtr engine_version_ptr = Marshal.AllocHGlobal(sizeof(uint));
            uint base_v = 0;
#if UNITY_2023_1_OR_NEWER
            base_v = 20230000;
#elif UNITY_2022_1_OR_NEWER
            base_v = 20220000;
#elif UNITY_2021_1_OR_NEWER
            base_v = 20210000;
#elif UNITY_2020_1_OR_NEWER
            base_v = 20200000;
#elif UNITY_2019_1_OR_NEWER
            base_v = 20190000;
#elif UNITY_2018_1_OR_NEWER
            base_v = 20180000;
#elif UNITY_2017_1_OR_NEWER
            base_v = 20170000;
#endif
            Marshal.StructureToPtr(base_v, engine_version_ptr, false);

            try
            {
                UwaGpmSetCustomData("gpu_model", model_ptr);
                UwaGpmSetCustomData("gapi_version", gpu_version_ptr);
                UwaGpmSetCustomData("engine_version", engine_version_ptr);
            }
            catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }
            finally
            {
                Marshal.FreeHGlobal(model_ptr);
                Marshal.FreeHGlobal(gpu_version_ptr);
                Marshal.FreeHGlobal(engine_version_ptr);
            }
        }

        public static void Setup(bool debug)
        {
            if (s_isSetup) return;

            // 在Setup之前注册Profiler回调，使后续Native调用在Unity Profiler中可见
#if UNITY_PROFILER_DEBUG
            RegisterProfilerCallbacks();
#endif

            try
            {
                UwaGpmNativeCmd("test", 0, null);
            }
            catch (System.Exception e)
            {
                s_legacySdk = true;
            }

            try
            {
                SetCustomData();
                // Unity must be initialized with engineIndex = 0
                UwaGpmSetup(0, debug);
                s_isSetup = true;
            }
            catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }
        }

        public static void SetupCore()
        {
            if (!s_isSetup) return;

            try {
                if (s_enableCrashReport.HasValue)
                    NativeCmd("crashreport", s_enableCrashReport.Value ? 1 : 0);

                UwaGpmSetupCore();
            }
            catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }
        }

        public static void Start()
        {
            if (!s_isSetup || s_isRecording) return;

            UwaGpmStart();
            s_isRecording = true;
        }

        public static void Stop()
        {
            if (!s_isRecording) return;

            UwaGpmStop();
            s_isRecording = false;
        }

        public static void Shutdown()
        {
            if (!s_isSetup) return;

            if (s_isRecording)
            {
                UwaGpmStop();
                s_isRecording = false;
            }

            UwaGpmShutdown();
            UnregisterProfilerCallbacks();
            s_isSetup = false;
        }

        /// <summary>
        /// 设置GPM日志输出级别
        /// </summary>
        /// <param name="level">日志级别：0=关闭, 1=Fatal, 2=Error, 3=Warning, 4=Info, 5=Debug</param>
        public static void SetLogLevel(int level)
        {
            try { UwaGpmSetLogLevel(level); }
            catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }
        }

        /// <summary>
        /// 获取当前GPM日志输出级别
        /// </summary>
        /// <returns>日志级别：0=关闭, 1=Fatal, 2=Error, 3=Warning, 4=Info, 5=Debug</returns>
        public static int GetLogLevel()
        {
            try { return UwaGpmGetLogLevel(); }
            catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }
            return 5; // 默认返回Debug级别
        }

        /// <summary>
        /// 启用GPM日志输出（设置为Debug级别）
        /// </summary>
        public static void EnableLog()
        {
            SetLogLevel(5);
        }

        /// <summary>
        /// 禁用GPM日志输出（设置为None级别）
        /// </summary>
        public static void DisableLog()
        {
            SetLogLevel(0);
        }

        public static void OnReceivedLog(string logString, string stackTrace, LogType type)
        {
            if (!s_isSetup || s_legacySdk) return;

            string category = "default";
            int level = 1;
            switch (type)
            {
                case LogType.Error:
                    category = "error";
                    level = 3;
                    break;
                case LogType.Exception:
                    category = "exception";
                    level = 4;
                    break;
                case LogType.Log:
                    category = "log";
                    level = 1;
                    break;
                case LogType.Warning:
                    category = "warning";
                    level = 2;
                    break;
            }

            AddLog(level, category, logString, stackTrace);
        }

#if UNITY_5_3_OR_NEWER
        public static void OnSceneChanged(Scene current, Scene next)
        {
            if (!s_isSetup) return;
            ChangeScene(next.name);
        }
#endif

        public static void OnApplicationPause(bool pause)
        {
            if (!s_isSetup) return;

            // try { UwaOnApplicationPause(pause); }
            // catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }

            try { NativeCmd("background", pause); }
            catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }
        }

        public static void OnEndOfFrame()
        {
            if (!s_isRecording) return;
            UwaGpmEndOfFrame();
        }

#if UNITY_WEBGL && !UNITY_EDITOR
        public static void OnWebGLPreRender(uint budgetUs)
        {
            if (!s_isRecording) return;
            UwaGpmWebGLPreRenderTick(budgetUs);
        }

        public static void NotifyWebGLPreRenderHookInstalled()
        {
            try { UwaGpmWebGLPreRenderTick(0); }
            catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }
        }
#endif

        public static void OnApplicationQuit()
        {
            Shutdown();
        }

        public static void InputRecord(int fingerId, int action, float xNorm, float yNorm)
        {
            if (!s_isSetup || !s_isRecording) return;
            if (s_legacySdk || s_noInputRecord) return;

            // normalize clamp to [0,1] to match native expectations
            if (xNorm < 0f) xNorm = 0f;
            else if (xNorm > 1f) xNorm = 1f;
            if (yNorm < 0f) yNorm = 0f;
            else if (yNorm > 1f) yNorm = 1f;

            try
            {
                UwaGpmInputRecord(fingerId, action, xNorm, yNorm);
            }
            catch (System.Exception)
            {
                // EntryPointNotFoundException / DllNotFoundException, etc.
                s_noInputRecord = true;
            }
        }

        public static IntPtr GetSamplePtr(string name)
        {
            if (s_legacySdk) return System.IntPtr.Zero;

            try
            {
                return UwaGpmGetSamplePtr(name);
            }
            catch (System.Exception e)
            {
                s_legacySdk = true;
                Debug.Log("UWA GPM: " + e.Message);
            }

            return System.IntPtr.Zero;
        }

        public static void PushSample(IntPtr ptr)
        {
            if (s_legacySdk) return;

            UwaGpmPushSample(ptr);
        }

        public static void PopSample(IntPtr ptr)
        {
            if (s_legacySdk) return;

            UwaGpmPopSample(ptr);
        }

#region api use
        public static float GetSDKData(int type)
        {
            if (!s_isSetup) return 0;
            try { return UwaGpmGetSDKData(type); }
            catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }
            return 0;
        }
        public static void SetThreshold(int id, int threshold)
        {
            if (!s_isSetup || s_legacySdk) return;
            try { NativeCmd("thresholds", id, threshold); }
            catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }
        }
        public static void ChangeScene(string sceneName)
        {
            s_sceneNameCache = sceneName;
            try { UwaGpmAddScene(s_sceneNameCache); }
            catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }
        }

        public static void SetNetworkLatecy(uint valueMs)
        {
            if (!s_isSetup) return;
            try { UwaGpmNetworkLatency(valueMs); }
            catch (System.Exception e) { Debug.Log("UWA GPM: " + e.Message); }
        }

        #endregion

        public static void AddEvent(string name, string category, params object[] param)
        {
            if (!s_isSetup) return;

            // no custom event for legacy sdk
            if (category != null && s_legacySdk) return;

            if (param.Length > 32 || param.Length % 2 != 0)  // 16 pairs
            {
                Debug.Log("UWA GPM: Too many or not even parameters for event");
                return;
            }

            GpmCatEventParamRaw[] rawParams = CreateRawParams(true, param);

            try
            {
                if (s_legacySdk)
                {
                    GpmEventParamRaw[]  cParams = new GpmEventParamRaw[rawParams.Length];
                    ConvertRawParams(ref cParams, ref rawParams);
                    UwaGpmAddEvent(name, cParams.Length, cParams);
                }
                else UwaGpmAddCatEvent(name, category, rawParams.Length, rawParams);
            }
            catch (System.Exception e)
            {
                Debug.Log("UWA GPM Event: " + e.Message);
            }
            finally
            {
                for (int i = 0; i < rawParams.Length; i++)
                {
                    Marshal.FreeHGlobal(rawParams[i].key);
                    Marshal.FreeHGlobal(rawParams[i].value);
                }
            }
        }

        public static void AddStatus(string name, string category, params object[] param)
        {
            if (!s_isSetup) return;

            // no custom status
            if (category != null) return;

            if (param.Length > 16)
            {
                Debug.Log("UWA GPM: Too many parameters for status");
                return;
            }

            GpmCatEventParamRaw[] rawParams = CreateRawParams(false, param);

            try
            {
                if (s_legacySdk)
                {
                    GpmEventParamRaw[] cParams = new GpmEventParamRaw[rawParams.Length];
                    ConvertRawParams(ref cParams, ref rawParams);
                    UwaGpmAddStatus(name, cParams.Length, cParams);
                }
                else UwaGpmAddCatStatus(name, category, rawParams.Length, rawParams);
            }
            catch (System.Exception e)
            {
                Debug.Log("UWA GPM Status: " + e.Message);
            }
            finally
            {
                for (int i = 0; i < rawParams.Length; i++)
                {
                    Marshal.FreeHGlobal(rawParams[i].value);
                }
            }
        }

        public static void NativeCmd(string name, params object[] param)
        {
            if (!s_isSetup || s_legacySdk) return;

            GpmCatEventParamRaw[] rawParams = CreateRawParams(false, param);

            try
            {
                UwaGpmNativeCmd(name, rawParams.Length, rawParams);
            }
            catch (System.Exception e)
            {
                Debug.Log("UWA GPM : " + e.Message);
            }
            finally
            {
                for (int i = 0; i < rawParams.Length; i++)
                {
                    Marshal.FreeHGlobal(rawParams[i].value);
                }
            }
        }

        /// <summary>
        /// 添加崩溃自定义日志路径列表（用于把自定义日志作为崩溃附件）
        /// </summary>
        /// <param name="filePaths">日志路径数组，最多支持10个路径</param>
        public static void AddCrashCustomLogPaths(params string[] filePaths)
        {
            if (!s_isSetup)
            {
                Debug.LogWarning("UWA GPM: AddCrashCustomLogPaths called but GPM not setup");
                return;
            }

            if (filePaths == null || filePaths.Length == 0)
            {
                Debug.LogWarning("UWA GPM: AddCrashCustomLogPaths called with no file paths");
                return;
            }

            int count = Mathf.Min(filePaths.Length, 10);
            if (filePaths.Length > 10)
            {
                Debug.LogWarning("UWA GPM: Too many crash custom log paths (" + filePaths.Length + "), only first 10 will be used");
            }

            var validPaths = new System.Collections.Generic.List<string>();
            for (int i = 0; i < count; i++)
            {
                if (!string.IsNullOrEmpty(filePaths[i]))
                {
                    validPaths.Add(filePaths[i]);
                }
            }

            if (validPaths.Count == 0)
            {
                Debug.LogWarning("UWA GPM: No valid file paths provided for crash custom logs");
                return;
            }

            try
            {
                Debug.Log("UWA GPM: Adding "+validPaths.Count+" crash custom log paths");
                NativeCmd("crash_customlogpaths", validPaths.ToArray());
            }
            catch (System.Exception e)
            {
                Debug.LogError("UWA GPM: Failed to add crash custom log paths: " + e.Message);
            }
        }

        /// <summary>
        /// 添加崩溃附件路径（支持指定附件类型，txt 或 binary，默认 binary）
        /// </summary>
        /// <param name="type">附件类型，传入 "txt" 或 "binary"，默认为 "binary"</param>
        /// <param name="filePaths">附件路径数组，最多支持10个路径</param>
        public static void AddCrashAttachmentPaths(string type, params string[] filePaths)
        {
            if (!s_isSetup)
            {
                Debug.LogWarning("UWA GPM: AddCrashAttachmentPaths called but GPM not setup");
                return;
            }

            if (string.IsNullOrEmpty(type)) type = "binary";

            if (filePaths == null || filePaths.Length == 0)
            {
                Debug.LogWarning("UWA GPM: AddCrashAttachmentPaths called with no file paths");
                return;
            }

            int count = Mathf.Min(filePaths.Length, 10);
            if (filePaths.Length > 10)
            {
                Debug.LogWarning("UWA GPM: Too many crash attachment paths (" + filePaths.Length + "), only first 10 will be used");
            }

            var validPaths = new System.Collections.Generic.List<string>();
            for (int i = 0; i < count; i++)
            {
                if (!string.IsNullOrEmpty(filePaths[i]))
                {
                    validPaths.Add(filePaths[i]);
                }
            }

            if (validPaths.Count == 0)
            {
                Debug.LogWarning("UWA GPM: No valid file paths provided for crash attachments");
                return;
            }

            try
            {
                Debug.Log("UWA GPM: Adding "+validPaths.Count+" crash attachment paths of type "+type);
                // first param: type string, then the paths
                var args = new System.Collections.Generic.List<object>();
                args.Add(type);
                foreach (var p in validPaths) args.Add(p);
                NativeCmd("crash_attachments", args.ToArray());
            }
            catch (System.Exception e)
            {
                Debug.LogError("UWA GPM: Failed to add crash attachment paths: " + e.Message);
            }
        }

        public static void AddLog(int level, string category, string msg, string stacks)
        {
            if (!s_isSetup || s_legacySdk) return;

            try
            {
                if (UwaGpmIsLogLevelRecord(level))
                    UwaGpmAddLog(category, msg, stacks);
            }
            catch (System.Exception e)
            {
                Debug.Log("UWA GPM : " + e.Message);
            }
        }

#region private
        private static GpmCatEventParamRaw[] CreateRawParams(bool key, params object[] param)
        {
            int param_cnt = key ? (param.Length / 2) : param.Length;
            GpmCatEventParamRaw[] rawParams = new GpmCatEventParamRaw[param_cnt];

            for (int i = 0, j = 0; i < param.Length;)
            {
                GpmCatEventParamRaw rawParam = new GpmCatEventParamRaw();
                rawParam.key = System.IntPtr.Zero;

                if (key)
                {
                    string k = "(null)";
                    if (param[i] is string && !string.IsNullOrEmpty((string)param[i]))
                    {
                        k = (string)param[i];
                    }

                    byte[] bytes = System.Text.Encoding.UTF8.GetBytes(k);
                    rawParam.key = Marshal.AllocHGlobal(bytes.Length + 1);
                    Marshal.Copy(bytes, 0, rawParam.key, bytes.Length);
                    Marshal.WriteByte(rawParam.key, bytes.Length, 0);
                    ++i;
                }

                if (param[i] is bool || param[i] is short || param[i] is ushort || param[i] is int)
                {
                    rawParam.type = (int)GpmEventParamType.Int32;
                    rawParam.value = Marshal.AllocHGlobal(sizeof(int));
                    Marshal.StructureToPtr((int)System.Convert.ChangeType(param[i], typeof(int)), rawParam.value, false);
                }
                else if (param[i] is uint)
                {
                    uint v = (uint)param[i];
                    rawParam.type = (int)GpmEventParamType.UInt32;
                    rawParam.value = Marshal.AllocHGlobal(sizeof(uint));
                    Marshal.StructureToPtr(v, rawParam.value, false);
                }
                else if (param[i] is long)
                {
                    long v1 = (long)param[i];
                    rawParam.type = (int)GpmEventParamType.Int64;
                    rawParam.value = Marshal.AllocHGlobal(sizeof(long));
                    Marshal.StructureToPtr(v1, rawParam.value, false);
                }
                else if (param[i] is ulong)
                {
                    ulong v2 = (ulong)param[i];
                    rawParam.type = (int)GpmEventParamType.UInt64;
                    rawParam.value = Marshal.AllocHGlobal(sizeof(ulong));
                    Marshal.StructureToPtr(v2, rawParam.value, false);
                }
                else if (param[i] is float)
                {
                    float v3 = (float)param[i];
                    rawParam.type = (int)GpmEventParamType.Float;
                    rawParam.value = Marshal.AllocHGlobal(sizeof(float));
                    Marshal.StructureToPtr(v3, rawParam.value, false);
                }
                else if (param[i] is double || param[i] is decimal)
                {
                    rawParam.type = (int)GpmEventParamType.Double;
                    rawParam.value = Marshal.AllocHGlobal(sizeof(double));
                    Marshal.StructureToPtr((double)System.Convert.ChangeType(param[i], typeof(double)), rawParam.value, false);
                }
                else if (param[i] is string)
                {
                    string v4 = (string)param[i];
                    if (string.IsNullOrEmpty(v4)) v4 = "(null)";
                    rawParam.type = (int)GpmEventParamType.String;
                    byte[] bytes = System.Text.Encoding.UTF8.GetBytes(v4);
                    rawParam.value = Marshal.AllocHGlobal(bytes.Length + 1);
                    Marshal.Copy(bytes, 0, rawParam.value, bytes.Length);
                    Marshal.WriteByte(rawParam.value, bytes.Length, 0);
                }
                else if (param[i] == null)
                {
                    rawParam.type = (int)GpmEventParamType.String;
                    string v5 = "(null)";
                    byte[] bytes = System.Text.Encoding.UTF8.GetBytes(v5);
                    rawParam.value = Marshal.AllocHGlobal(bytes.Length + 1);
                    Marshal.Copy(bytes, 0, rawParam.value, bytes.Length);
                    Marshal.WriteByte(rawParam.value, bytes.Length, 0);
                }
                else
                {
                    Debug.Log("UWA GPM: Unsupported type for event param");
                    rawParam.type = (int)GpmEventParamType.Unknown;
                    rawParam.value = Marshal.AllocHGlobal(0);
                }
                if (j < param_cnt)
                {
                    rawParams[j] = rawParam;
                }

                ++i;
                ++j;
            }

            return rawParams;
        }

        // 1.3.0.1
        private static bool ConvertRawParams(ref GpmEventParamRaw[] rawParams, ref GpmCatEventParamRaw[] param)
        {
            if (rawParams.Length != param.Length) return false;

            for (int i = 0; i < param.Length; ++i)
            {
                rawParams[i] = new GpmEventParamRaw()
                {
                    type = param[i].type,
                    value = param[i].value,
                };
            }

            return true;
        }

        #endregion

        // debug only
        public static string GetDebugInfo()
        {
            try
            {
                System.IntPtr ptr = UwaGpmGetString("GetCoreStatus");

                if (ptr == System.IntPtr.Zero) return null;

                int len = 0;
                while (Marshal.ReadByte(ptr, len) != 0) ++len; // Find the length of the string
                byte[] buffer = new byte[len];
                Marshal.Copy(ptr, buffer, 0, buffer.Length);
                return System.Text.Encoding.UTF8.GetString(buffer);
            }
            catch (System.Exception ex)
            {
                return "Error: Failed to get debug info.\n Exception details: " + ex.Message;
            }
        }
    }
}
