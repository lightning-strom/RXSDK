#define USE_UNITY_SCENE_CHANGED_CALLBACK
// #define ENABLE_LEGACY_COMPATIBILITY_1_3

using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using UnityEngine;
using UWA;
using Object = UnityEngine.Object;

#if ENABLE_INPUT_SYSTEM
// IF error : The type or namespace name 'InputSystem' does not exist in the namespace 'UnityEngine'
// Add Unity.InputSystem to the Assembly Definition References of UWA/UWA_GPM/Runtime/com.youhu.unity_uwa_gpm.asmdef
using UwaInputSystemMouse = UnityEngine.InputSystem.Mouse;
using UwaInputSystemTouchPhase = UnityEngine.InputSystem.TouchPhase;
using UwaInputSystemTouchscreen = UnityEngine.InputSystem.Touchscreen;
#endif

#if UNITY_5_3_OR_NEWER
using UnityEngine.SceneManagement;
using UnityEngine.Profiling;
#endif

class UWAGPM_Launcher : MonoBehaviour
{
#if UNITY_WEBGL
    // WebGL runs native GPM work on Unity's main thread. For a 30 FPS target
    // (33.33 ms/frame), pass about 3% of one frame as the native tick budget.
    // Current native implementation gives half of this value to the collect worker.
    private const uint WEBGL_TICK_TOTAL_BUDGET_US = 1000;
    private const uint WEBGL_SCREENSHOT_PRERENDER_BUDGET_US = 1000;
#endif

    public static event Action<string> onStaticInit;
    public static event Action<bool> onRegisterFinish;
    public static event Action<string> onUserIdChanged;
    public static event Action<bool> onInitDone;

    private static UWAGPM_Launcher _instance = null;
    private int registerState = -1;
    private readonly WaitForEndOfFrame _endOfFrame = new WaitForEndOfFrame();
    private delegate void OnEndOfFrame();
    private OnEndOfFrame onEndOfFrame;
    private Coroutine debugCoroutine = null;
    private string debugInfo = "";
    private string apidebugInfo = "";
    private bool logEventRegistered = false;
    private bool showDebugOverlay = false;
    private Vector2 debugScrollPosition = Vector2.zero;
#if UNITY_WEBGL && !UNITY_EDITOR
    private int _lastWebGLPreRenderFrame = -1;
#if UNITY_5_3_OR_NEWER
    private bool _webglPreRenderHookRegistered = false;
#endif
#endif

#if !UNITY_EDITOR
    // action 映射：与 native 侧约定保持一致
    private const int INPUT_DOWN = 0;
    private const int INPUT_DRAG = 1;
    private const int INPUT_UP = 2;
    private const int INPUT_CANCEL = 3;
    private InputCollector _inputCollector;
#endif
    public static UWAGPM_Launcher Get()
    {
        return _instance;
    }
    /// <summary>
    /// 注册Unity Log事件监听器
    /// </summary>
    public void RegisterLogEventHandler()
    {
        if (!logEventRegistered)
        {
#if UNITY_5_3_OR_NEWER
            Application.logMessageReceived += OnLogMessageReceived;
#else
            Application.RegisterLogCallback(OnLogMessageReceived);
#endif
            logEventRegistered = true;
            Debug.Log("UWA GPM: Unity Log event handler registered");
        }
    }
    /// <summary>
    /// 取消注册Unity Log事件监听器
    /// </summary>
    public void UnregisterLogEventHandler()
    {
        if (logEventRegistered)
        {
#if UNITY_5_3_OR_NEWER
            Application.logMessageReceived -= OnLogMessageReceived;
            logEventRegistered = false;
            Debug.Log("UWA GPM: Unity Log event handler unregistered");
#else
            //Application.RegisterLogCallback(null);
            Debug.Log("UWA GPM: Unity Log event handler unregistration is not supported in Unity 5.0 or below");
#endif
        }
    }

    /// <summary>
    /// Unity Log事件处理器
    /// </summary>
    /// <param name="logString">日志消息</param>
    /// <param name="stackTrace">堆栈跟踪</param>
    /// <param name="type">日志类型</param>
    private void OnLogMessageReceived(string logString, string stackTrace, LogType type)
    {
        // 调用UWAGPMInternal的OnReceivedLog接口
        UWAGPMInternal.OnReceivedLog(logString, stackTrace, type);
    }
    public void EnableDebug(bool enable)
    {
        if (enable)
        {
            if (debugCoroutine == null)
            {
#if UNITY_5_3_OR_NEWER
                debugCoroutine = StartCoroutine(DebugInfo());
#else
                debugCoroutine = StartCoroutine("DebugInfo");
#endif
            }
        }
        else
        {
            if (debugCoroutine != null)
            {
#if UNITY_5_3_OR_NEWER
                StopCoroutine(debugCoroutine);
#else
                StopCoroutine("DebugInfo");
#endif
                debugCoroutine = null;
            }
        }
    }
    public void Register(string url, string appID, string appVersion, string channel)
    {
        StartCoroutine(TryRegister(url, appID, appVersion, channel));
    }
    public int GetRegisterState()
    {
        return registerState;
    }
    void Awake()
    {
        if (_instance != null)
        {
            Destroy(this);
            return;
        }
        _instance = this;
        DontDestroyOnLoad(this.gameObject);
        onEndOfFrame = UWAGPMInternal.OnEndOfFrame;
        if (UWAGPMInternal.IsRegistered() == 1)
            StartCoroutine(EndOfFrame());
    }

#if UNITY_WEBGL && !UNITY_EDITOR && UNITY_5_3_OR_NEWER
    private void OnEnable()
    {
        RegisterWebGLPreRenderHook();
    }

    private void OnDisable()
    {
        UnregisterWebGLPreRenderHook();
    }

    private void RegisterWebGLPreRenderHook()
    {
        if (_webglPreRenderHookRegistered) return;
        Camera.onPreRender += OnCameraPreRender;
        _webglPreRenderHookRegistered = true;
        UWAGPMInternal.NotifyWebGLPreRenderHookInstalled();
    }

    private void UnregisterWebGLPreRenderHook()
    {
        if (!_webglPreRenderHookRegistered) return;
        Camera.onPreRender -= OnCameraPreRender;
        _webglPreRenderHookRegistered = false;
    }

    private void OnCameraPreRender(Camera camera)
    {
        TickWebGLScreenshotPreRender();
    }
#endif

#if UNITY_WEBGL && !UNITY_EDITOR && !UNITY_5_3_OR_NEWER
    private void LateUpdate()
    {
        TickWebGLScreenshotPreRender();
    }
#endif

#if UNITY_WEBGL && !UNITY_EDITOR
    private void TickWebGLScreenshotPreRender()
    {
        if (!UWAGPMInternal.s_isRecording) return;
        int frame = Time.frameCount;
        if (_lastWebGLPreRenderFrame == frame) return;
        _lastWebGLPreRenderFrame = frame;
        UWAGPMInternal.OnWebGLPreRender(WEBGL_SCREENSHOT_PRERENDER_BUDGET_US);
    }

#endif

#if !UNITY_EDITOR
    private void Start()
    {
        _inputCollector = CreateInputCollector();
        _inputCollector.Initialize();
    }
    private void Update()
    {
#if UNITY_WEBGL
        // WebGL 平台需要每帧驱动协程系统；注册等待本地FS ready时也需要推进pending register。
        if (registerState == 1 || registerState == 2)
        {
            UWAGPMInternal.UwaGpmTickWebGL(WEBGL_TICK_TOTAL_BUDGET_US);
        }
#endif

        // 仅在录制中上报；兼容 legacy / 缺少符号的情况由 UWAGPMInternal.InputRecord 内部处理
        if (!UWAGPMInternal.s_isRecording) return;
        float w = Screen.width;
        float h = Screen.height;
        if (w <= 0f || h <= 0f) return;
        if (_inputCollector == null)
        {
            _inputCollector = CreateInputCollector();
            _inputCollector.Initialize();
        }
        _inputCollector.Collect(w, h);
    }

    private InputCollector CreateInputCollector()
    {
#if ENABLE_INPUT_SYSTEM
        return new NewInputSystemCollector();
#else
        return new LegacyInputCollector();
#endif
    }

    private abstract class InputCollector
    {
        public virtual void Initialize() { }
        public abstract void Collect(float w, float h);
    }

#if ENABLE_INPUT_SYSTEM
    private class NewInputSystemCollector : InputCollector
    {
        private readonly HashSet<int> _activeTouchIds = new HashSet<int>();
        private bool _mousePressed = false;
        private Vector3 _lastMousePos = Vector3.zero;

        public override void Initialize()
        {
            UwaInputSystemMouse mouse = UwaInputSystemMouse.current;
            if (mouse != null)
            {
                Vector2 pos = mouse.position.ReadValue();
                _lastMousePos = new Vector3(pos.x, pos.y, 0f);
            }
            else
            {
                _lastMousePos = Vector3.zero;
            }
        }

        public override void Collect(float w, float h)
        {
            if (CollectTouches(w, h)) return;
            CollectMouse(w, h);
        }

        private bool CollectTouches(float w, float h)
        {
            UwaInputSystemTouchscreen touchscreen = UwaInputSystemTouchscreen.current;
            if (touchscreen == null) return false;

            bool hasTouchInput = false;
            foreach (var touch in touchscreen.touches)
            {
                UwaInputSystemTouchPhase phase = touch.phase.ReadValue();
                if (phase == UwaInputSystemTouchPhase.None) continue;

                hasTouchInput = true;
                if (phase == UwaInputSystemTouchPhase.Stationary) continue;

                int fingerId = touch.touchId.ReadValue();
                Vector2 p = touch.position.ReadValue();
                float x = p.x / w;
                float y = p.y / h;

                switch (phase)
                {
                    case UwaInputSystemTouchPhase.Began:
                        _activeTouchIds.Add(fingerId);
                        UWAGPMInternal.InputRecord(fingerId, INPUT_DOWN, x, y);
                        break;
                    case UwaInputSystemTouchPhase.Moved:
                        if (_activeTouchIds.Contains(fingerId))
                        {
                            UWAGPMInternal.InputRecord(fingerId, INPUT_DRAG, x, y);
                        }
                        break;
                    case UwaInputSystemTouchPhase.Ended:
                        if (_activeTouchIds.Remove(fingerId))
                        {
                            UWAGPMInternal.InputRecord(fingerId, INPUT_UP, x, y);
                        }
                        break;
                    case UwaInputSystemTouchPhase.Canceled:
                        if (_activeTouchIds.Remove(fingerId))
                        {
                            UWAGPMInternal.InputRecord(fingerId, INPUT_CANCEL, x, y);
                        }
                        break;
                    default:
                        break;
                }
            }

            return hasTouchInput || _activeTouchIds.Count > 0;
        }

        private void CollectMouse(float w, float h)
        {
            UwaInputSystemMouse mouse = UwaInputSystemMouse.current;
            if (mouse == null) return;

            Vector2 pos = mouse.position.ReadValue();
            Vector3 mp = new Vector3(pos.x, pos.y, 0f);
            float mx = mp.x / w;
            float my = mp.y / h;

            if (mouse.leftButton.wasPressedThisFrame)
            {
                _mousePressed = true;
                _lastMousePos = mp;
                UWAGPMInternal.InputRecord(0, INPUT_DOWN, mx, my);
            }
            if (_mousePressed && mouse.leftButton.isPressed)
            {
                Vector3 delta = mp - _lastMousePos;
                if (delta.sqrMagnitude > 0.01f)
                {
                    _lastMousePos = mp;
                    UWAGPMInternal.InputRecord(0, INPUT_DRAG, mx, my);
                }
            }
            if (mouse.leftButton.wasReleasedThisFrame)
            {
                _mousePressed = false;
                UWAGPMInternal.InputRecord(0, INPUT_UP, mx, my);
            }
        }
    }
#else
    private class LegacyInputCollector : InputCollector
    {
        private bool _mousePressed = false;
        private Vector3 _lastMousePos = Vector3.zero;

        public override void Initialize()
        {
            _lastMousePos = Input.mousePosition;
        }

        public override void Collect(float w, float h)
        {
            // 移动端优先使用 Touch，避免同时触发 Mouse 事件导致重复上报
            if (Input.touchCount > 0)
            {
                for (int i = 0; i < Input.touchCount; ++i)
                {
                    Touch t = Input.GetTouch(i);
                    Vector2 p = t.position;
                    float x = p.x / w;
                    float y = p.y / h;
                    switch (t.phase)
                    {
                        case TouchPhase.Began:
                            UWAGPMInternal.InputRecord(t.fingerId, INPUT_DOWN, x, y);
                            break;
                        case TouchPhase.Moved:
                            UWAGPMInternal.InputRecord(t.fingerId, INPUT_DRAG, x, y);
                            break;
                        case TouchPhase.Ended:
                            UWAGPMInternal.InputRecord(t.fingerId, INPUT_UP, x, y);
                            break;
                        case TouchPhase.Canceled:
                            UWAGPMInternal.InputRecord(t.fingerId, INPUT_CANCEL, x, y);
                            break;
                        default:
                            // Stationary / Unknown：不处理
                            break;
                    }
                }
                return;
            }

            // PC：鼠标 fingerId 固定为 0
            Vector3 mp = Input.mousePosition;
            float mx = mp.x / w;
            float my = mp.y / h;
            if (Input.GetMouseButtonDown(0))
            {
                _mousePressed = true;
                _lastMousePos = mp;
                UWAGPMInternal.InputRecord(0, INPUT_DOWN, mx, my);
            }
            if (_mousePressed && Input.GetMouseButton(0))
            {
                Vector3 delta = mp - _lastMousePos;
                if (delta.sqrMagnitude > 0.01f)
                {
                    _lastMousePos = mp;
                    UWAGPMInternal.InputRecord(0, INPUT_DRAG, mx, my);
                }
            }
            if (Input.GetMouseButtonUp(0))
            {
                _mousePressed = false;
                UWAGPMInternal.InputRecord(0, INPUT_UP, mx, my);
            }
        }
    }
#endif
#endif

#if !UNITY_5_3_OR_NEWER && USE_UNITY_SCENE_CHANGED_CALLBACK
    void OnLevelWasLoaded(int level)
    {
        UWAGPMInternal.ChangeScene(Application.loadedLevelName);
    }
#endif

    private void OnApplicationPause(bool pauseStatus)
    {
        UWAGPMInternal.OnApplicationPause(pauseStatus);
    }
    private void OnApplicationQuit()
    {
        UWAGPMInternal.OnApplicationQuit();
        // 取消注册Log事件监听器
        UnregisterLogEventHandler();
    }
    IEnumerator TryRegister(string url, string appID, string appVersion, string channel)
    {
        registerState = UWAGPMInternal.IsRegistered();
        if (registerState == 1)
        {
            RegisterFinish(true);
        }
        // already registered or registering
        if (registerState == 1 || registerState == 2) yield break;
#if UNITY_5_3_OR_NEWER
        if (string.IsNullOrEmpty(appVersion))
            appVersion = Application.version;
#else
        if (string.IsNullOrEmpty(appVersion))
            appVersion = "--";
#endif

        if (string.IsNullOrEmpty(appID))
        {
            Debug.LogError("App ID not set.");
            yield break;
        }
        UWAGPMInternal.Register(url, appID, appVersion, channel);
        int waitForRegisterS = 15;
        while (waitForRegisterS > 0)
        {
            registerState = UWAGPMInternal.IsRegistered();
            // native not working
            if (registerState == 0) break;
            // success
            if (registerState == 1) break;
            // timeout in native
            if (registerState == 3) break;
            // 2: waiting for response
            yield return new WaitForSeconds(1.0f);
            waitForRegisterS--;
        }
        if (registerState != 1)
        {
            RegisterFinish(false);
            yield break;
        }

        Profiler.BeginSample("UWAGPM_Launcher.SetupCore");
        UWAGPMInternal.SetupCore();
        Profiler.EndSample();
        yield return null;

        Profiler.BeginSample("UWAGPM_Launcher.ChangeScene");

#if USE_UNITY_SCENE_CHANGED_CALLBACK && UNITY_5_3_OR_NEWER
        SceneManager.activeSceneChanged += UWAGPMInternal.OnSceneChanged;
        UWAGPMInternal.ChangeScene(SceneManager.GetActiveScene().name);
#else
        UWAGPMInternal.ChangeScene(Application.loadedLevelName);
#endif
        Profiler.EndSample();

        Profiler.BeginSample("UWAGPM_Launcher.Start");

        UWAGPMInternal.Start();

        Profiler.EndSample();

        Profiler.BeginSample("UWAGPM_Launcher.RegisterFinish");

        RegisterFinish(true);
        StartCoroutine(EndOfFrame());

        Profiler.EndSample();
    }

    private void RegisterFinish(bool done)
    {
        if (UWAGPM_Launcher.onRegisterFinish != null)
            UWAGPM_Launcher.onRegisterFinish(done);
        if (UWAGPM_Launcher.onInitDone != null)
        {
            UWAGPM_Launcher.onInitDone(done);
            UWAGPM_Launcher.onInitDone = null;
        }
    }
    public static void SetInitDoneCallback(Action<bool> onInit)
    {
        onInitDone = onInit;
    }
    public static void NotifyStaticInit(string url, string appID, string appVersion, string channel)
    {
        if (onStaticInit != null)
            onStaticInit(url + "," + appID + "," + appVersion + "," + channel);
    }
    public static void NotifyUserIdChanged(string userId)
    {
        if (onUserIdChanged != null)
            onUserIdChanged(userId);
    }
    private IEnumerator EndOfFrame()
    {
        while (true)
        {
            yield return _endOfFrame;
            if (onEndOfFrame != null)
                onEndOfFrame.Invoke();
        }
    }
    private IEnumerator DebugInfo()
    {
        while (true)
        {
            yield return new WaitForSeconds(1.0f);
            debugInfo = UWAGPMInternal.GetDebugInfo();
        }
    }
    private void OnGUI()
    {
        if (debugCoroutine == null)
            return;

        GUIStyle titleStyle = new GUIStyle { fontSize = 28, wordWrap = true };
        titleStyle.normal.textColor = Color.white;

        GUIStyle contentStyle = new GUIStyle(GUI.skin.label) { fontSize = 24, wordWrap = true, richText = true };
        contentStyle.normal.textColor = Color.white;

        GUIStyle buttonStyle = new GUIStyle(GUI.skin.button) { fontSize = 24 };
        float toggleWidth = 220f;
        float toggleHeight = 60f;
        float margin = 20f;
        // Offset below the two top-left buttons from GPMEnterController (each 56px tall + 10px gap, starting at y=16)
        float toggleY = 16f + (56f + 10f) * 2f + 10f;
        string toggleText = showDebugOverlay ? "Hide GPM Debug" : "Show GPM Debug";

        if (GUI.Button(new Rect(margin, toggleY, toggleWidth, toggleHeight), toggleText, buttonStyle))
        {
            showDebugOverlay = !showDebugOverlay;
        }

        if (!showDebugOverlay)
            return;

        bool isPortrait = Screen.height > Screen.width;
        float panelWidth = Mathf.Min(Screen.width * 2f / 3f, Screen.width - margin * 2f);
        float panelHeight = isPortrait
            ? Mathf.Min(Screen.height * 0.65f, Screen.height - toggleHeight - margin * 3f)
            : Mathf.Min(700f, Screen.height - toggleHeight - margin * 3f);
        float panelX = margin;
        float panelY = Screen.height - panelHeight - margin;
        float contentWidth = panelWidth - 40f;

        string debugInfoDisplay = string.IsNullOrEmpty(debugInfo)
            ? "[TEST MODE - SDK not started]\nFPS: 60.0\nJank: 0\nMemory(PSS): 256 MB\nBattery: 85%\nCPU Temp: 38.5\u00b0C\nGPU Temp: 40.1\u00b0C\nPower: 1200 mW\nRegisterState: 0\nScene: TestScene"
            : debugInfo;

        string apidebugInfoDisplay = string.IsNullOrEmpty(apidebugInfo)
            ? "[TEST MODE - no API data]\nUpload: inactive\nInterval: N/A\nLastPack: N/A"
            : apidebugInfo;

        string debugText = "<b>UWA GPM DEBUG</b>\n\n"
            + debugInfoDisplay
            + "\n\n<b>API DEBUG</b>\n\n"
            + apidebugInfoDisplay;

        float contentHeight = Mathf.Max(panelHeight, contentStyle.CalcHeight(new GUIContent(debugText), contentWidth) + 20f);

        GUI.Box(new Rect(panelX, panelY, panelWidth, panelHeight), string.Empty);
        GUI.Label(new Rect(panelX + 15f, panelY + 10f, panelWidth - 30f, 36f), "UWA GPM DEBUG", titleStyle);

        Rect viewRect = new Rect(panelX + 10f, panelY + 50f, panelWidth - 20f, panelHeight - 60f);
        Rect contentRect = new Rect(0f, 0f, contentWidth, contentHeight);
        debugScrollPosition = GUI.BeginScrollView(viewRect, debugScrollPosition, contentRect);
        GUI.Label(new Rect(10f, 0f, contentWidth, contentHeight), debugText, contentStyle);
        GUI.EndScrollView();
    }
}



public static partial class UWAGPM
{
    private static IPlatformHandler _platformHandler = new EmptyHandler();
    /// <summary>
    /// Initializes the GPM SDK.
    /// </summary>
    /// <param name="url"></param>
    /// <param name="appID"></param>
    /// <param name="appVersion"></param>
    /// <param name="channel"></param>
    /// <param name="debug"></param>
    public static void StaticInit(string url, string appID, string appVersion, string channel = "", bool debug = false, Action<bool> onInit = null)
    {
        UWAGPM_Launcher.SetInitDoneCallback(onInit);
        UWAGPM_Launcher.NotifyStaticInit(url, appID, appVersion, channel);

#if !UNITY_EDITOR && (UNITY_ANDROID || UNITY_IOS || UNITY_OPENHARMONY || UNITY_STANDALONE_WIN || UNITY_WEBGL)
        _platformHandler = new DefaultHandler();
#endif
        _platformHandler.StaticInit(url, appID, appVersion, channel, debug);
    }


    public static void SetCrashReport(bool enable)
    {
        UWAGPMInternal.s_enableCrashReport = enable;
    }

    /// <summary>
    /// Sets a custom crash callback for collecting additional files during crash reporting.
    /// If not called, a default sample callback will be used.
    /// </summary>
    /// <param name="callback">Custom implementation of ICrashCallback interface</param>
    //public static void SetCrashCallback(ICrashCallback callback)
    //{
    //    try
    //    {
    //        if (callback != null)
    //        {
    //            // 重新初始化以使用新的回调
    //            CrashAttachAdapter.Uninit();
    //            CrashAttachAdapter.Init(callback);
    //            UnityEngine.Debug.Log("[UWAGPM] Custom crash callback set successfully");
    //        }
    //        else
    //        {
    //            UnityEngine.Debug.LogWarning("[UWAGPM] SetCrashCallback called with null callback");
    //        }
    //    }
    //    catch (System.Exception e)
    //    {
    //        UnityEngine.Debug.LogError("[UWAGPM] Failed to set crash callback: " + e.Message);
    //    }
    //}

    /// <summary>
    /// Gets the registration state of the SDK.
    /// </summary>
    /// <returns>0 if not registered, 1 if registered, otherwise if error.</returns>
    public static int GetRegisterState()
    {
        return _platformHandler.GetRegisterState();
    }
    /// <summary>
    /// Changes the current scene.
    /// </summary>
    /// <param name="sceneName"></param>
    public static void ChangeScene(string sceneName)
    {
        _platformHandler.ChangeScene(sceneName);
    }
    /// <summary>
    /// Sets the current user.
    /// </summary>
    /// <param name="userId"></param>
    public static void SetUser(string userId)
    {
        _platformHandler.SetUser(userId);
    }
    /// <summary>
    /// Sets the current user level.
    /// </summary>
    /// <param name="userLevel"></param>
    public static void SetUserLevel(string userLevel)
    {
        _platformHandler.SetUserLevel(userLevel);
    }
    /// <summary>
    /// Sets the current user, same as SetUser
    /// </summary>
    /// <param name="userId"></param>
    public static void SetUserId(string userId)
    {
        SetUser(userId);
    }
    /// <summary>
    /// Sets the quality level.
    /// </summary>
    /// <param name="quality"></param>
    public static void SetQuality(int quality)
    {
        _platformHandler.SetQuality(quality);
    }
    /// <summary>
    /// Marks for the beginning of a scene load.
    /// </summary>
    /// <param name="sceneName"></param>
    public static void BeginSceneLoad(string sceneName)
    {
        _platformHandler.BeginSceneLoad(sceneName);
    }
    /// <summary>
    /// Marks for the end of a scene load.
    /// </summary>
    public static void EndSceneLoad()
    {
        _platformHandler.EndSceneLoad();
    }
    /// <summary>
    /// Marks for the beginning of data ignoring
    /// </summary>
    public static void BeginIgnore()
    {
        _platformHandler.SetIgnore(true);
    }
    /// <summary>
    /// Marks for the end of data ignoring
    /// </summary>
    public static void EndIgnore()
    {
        _platformHandler.SetIgnore(false);
    }
    /// <summary>
    /// Marks for the beginning of data segment
    /// </summary>
    public static void BeginSegment(string name)
    {
        _platformHandler.SetSegment(true, name);
    }
    /// <summary>
    /// Marks for the end of data segment
    /// </summary>
    public static void EndSegment(string name)
    {
        _platformHandler.SetSegment(false, name);
    }

    /// <summary>
    /// Represents the different types of metrics that can be collected by the SDK.
    /// </summary>
    public enum SDKMetricType
    {
        FPS,                // Frames per second
        JANK,               // Jank per second
        PROCESS_MEMORY_MB,  // PSS (Android), Footprint (iOS) in MB
        BATTERYLEVEL,       // Battery level in percentage
        BATTERYCAPACITY,    // Battery capacity in mAh
        POWER,              // Power in mW
        CURRENT,            // Current in mA
        BATTERYTEMP,        // Battery temperature in degrees Celsius
        CPUTEMP,            // CPU temperature in degrees Celsius
        GPUTEMP,            // GPU temperature in degrees Celsius
        NUM,
    }

    /// <summary>
    /// Gets the value of the specified SDK metric type.
    /// </summary>
    /// <param name="type">The type of SDK metric to retrieve.</param>
    /// <returns>The value of the specified SDK metric, or -1 if the metric is not available.</returns>
    public static float GetSDKData(SDKMetricType type)
    {
        return _platformHandler.GetSDKData(type);
    }

    /// <summary>
    /// Represents the metrics whose threshold can be modified when detecting abnormal performance.
    /// </summary>
    public enum MetricThresholdID
    {
        FPS_LOW = 1,        // Frames per second
        FPS_JITTER = 2,     // Difference in FPS over two seconds
        PSS_RATIO = 3,      // Proportion (0-100) of PSS to the total memory
        PSS_MB = 4,         // PSS in MB (>= 128)
        NUM = 5
    };

    /// <summary>
    /// Sets the threshold of the specified metric id.
    /// </summary>
    /// <param name="id">The id of metric to modify.</param>
    /// <param name="threshold">The value of threshold to modify.</param>
    public static void SetThreshold(MetricThresholdID id, int threshold)
    {
        _platformHandler.SetThreshold(id, threshold);
    }

    /// <summary>
    /// Sets the interval (in seconds) of data packing for specified mode data.
    /// </summary>
    /// <param name="normal">normal data generated every second</param>
    /// <param name="special">screenshot or callstack data generated at low performance point</param>
    public static void SetDataPackInterval(int normal, int special)
    {
        _platformHandler.SetDataPackInterval(normal, special);
    }

    /// <summary>
    /// Sets the uploading activation of the specified mode data.
    /// </summary>
    /// <param name="normal">normal data generated every second</param>
    /// <param name="special">screenshot or callstack data generated at low performance point</param>
    public static void SetUploadActive(bool normal, bool special)
    {
        _platformHandler.SetUploadActive(normal, special);
    }

    /// <summary>
    /// Sets the minimal interval (second) of uploading for specified mode data.
    /// </summary>
    /// <param name="normalS">normal data generated every second</param>
    /// <param name="specialS">screenshot or callstack data generated at low performance point</param>
    public static void SetUploadMinInterval(int normalS, int specialS)
    {
        _platformHandler.SetUploadMinInterval(normalS, specialS);
    }

    /// <summary>
    /// Sets the max time (minite) of data remains on device for specified mode.
    /// </summary>
    /// <param name="normalM">normal data generated every second</param>
    /// <param name="specialM">screenshot or callstack data generated at low performance point</param>
    public static void SetStorageTimeLimit(int normalM, int specialM)
    {
        _platformHandler.SetStorageTimeLimit(normalM, specialM);
    }

    /// <summary>
    /// [Only work in API mode] Sets the ratio of the resolution of ScreenShot (the default value is 0.3 : 0.3 x width & 0.3 x height).
    /// Valid range is [0.1, 0.6]
    /// </summary>
    /// <param name="ratio">The ratio of default resolution.</param>
    /// <param name="exTrigger">true to set screenshot triggered by performance exception.</param>
    public static void SetScreenShotRatio(float ratio, bool exTrigger = false)
    {
        _platformHandler.SetScreenShotRatio(ratio, exTrigger);
    }

    /// <summary>
    /// [Only work in API mode] Enable or disable the ScreenShot.
    /// </summary>
    /// <param name="enable">true to enable</param>
    /// <param name="exTrigger">true to set screenshot triggered by performance exception.</param>
    public static void SetScreenShotEnabled(bool enable, bool exTrigger = false)
    {
        _platformHandler.SetScreenShotEnabled(enable, exTrigger);
    }

    /// <summary>
    /// [Only work in API mode] Set the interval (in seconds) of ScreenShot.
    /// Valid range is [1, 60]
    /// </summary>
    /// <param name="interval">The interval of screenshot.</param>
    /// <param name="exTrigger">true to set screenshot triggered by performance exception.</param>
    public static void SetScreenShotInterval(int interval, bool exTrigger = false)
    {
        _platformHandler.SetScreenShotInterval(interval, exTrigger);
    }

    /// <summary>
    /// [Only work in API mode] Enable or disable the stack capture.
    /// </summary>
    /// <param name="enable">true to enable</param>
    public static void SetStackEnabled(bool enable)
    {
        _platformHandler.SetStackEnabled(enable);
    }

    /// <summary>
    /// [Only work in API mode] Set the max depth in stack capture.
    /// Valid range is [1, 100]
    /// </summary>
    /// <param name="depth">max depth</param>
    public static void SetStackDepthLimit(int depth)
    {
        _platformHandler.SetStackDepthLimit(depth);
    }

    /// <summary>
    /// [Only work in API mode] Set the interval (in seconds) of stack capture.
    /// Valid range is [1, 60]
    /// </summary>
    /// <param name="interval">The interval of stack capture.</param>
    /// <remarks>
    public static void SetStackInterval(int interval)
    {
        _platformHandler.SetStackInterval(interval);
    }

    /// <summary>
    /// 添加崩溃附件路径，在崩溃发生时自动上报这些文件
    /// </summary>
    /// <param name="filePaths">要添加的文件路径数组，最多支持10个路径</param>
    // void AddCrashCustomLogPaths(params string[] filePaths);
    // void AddCrashAttachmentPaths(string type, params string[] filePaths);

    public static void AddCrashCustomLogPaths(params string[] filePaths)
    {
        _platformHandler.AddCrashCustomLogPaths(filePaths);
    }

    public enum AttachmentType { Txt, Binary }

    public static void AddCrashAttachmentPaths(AttachmentType type, params string[] filePaths)
    {
        string t = (type == AttachmentType.Txt) ? "txt" : "binary";
        _platformHandler.AddCrashAttachmentPaths(t, filePaths);
    }

    /// <summary>
    /// [仅Debug版生效] 设置GPM日志输出级别
    /// </summary>
    /// <param name="level">日志级别：0=关闭, 1=Fatal, 2=Error, 3=Warning, 4=Info, 5=Debug</param>
    public static void SetLogLevel(int level)
    {
        _platformHandler.SetLogLevel(level);
    }

    /// <summary>
    /// 获取当前GPM日志输出级别
    /// </summary>
    /// <returns>日志级别：0=关闭, 1=Fatal, 2=Error, 3=Warning, 4=Info, 5=Debug</returns>
    public static int GetLogLevel()
    {
        return _platformHandler.GetLogLevel();
    }

    /// <summary>
    /// [仅Debug版生效] 启用GPM日志输出（设置为Debug级别）
    /// </summary>
    public static void EnableLog()
    {
        SetLogLevel(5);
    }

    /// <summary>
    /// [仅Debug版生效] 禁用GPM日志输出（设置为None级别）
    /// </summary>
    public static void DisableLog()
    {
        SetLogLevel(0);
    }

    /// <summary>
    /// [Only work in API mode] Enter deep mode, in which sdk reports more detailed data.
    /// </summary>
    public static void BeginDeepTracking()
    {
        _platformHandler.SetDeepTracking(true);
    }

    /// <summary>
    /// [Only work in API mode] Leave deep mode, in which sdk reports more detailed data.
    /// </summary>
    public static void EndDeepTracking()
    {
        _platformHandler.SetDeepTracking(false);
    }

    public static class Metric
    {
        /// <summary>
        /// The network latency (in milliseconds) needs to be explicitly set every second if needed.
        /// </summary>
        public static uint NetworkLatency
        {
            set
            {
                _platformHandler.SetNetworkLatecy(value);
            }
        }
    }

    public static void AddCustomEvent<T1, T2, T3>(string eventName, string eventCategory, string k1, T1 v1, string k2, T2 v2, string k3, T3 v3)
    {
        _platformHandler.AddCustomEvent(eventName, eventCategory, k1, v1, k2, v2, k3, v3);
    }
    public static void AddCustomEvent<T1, T2>(string eventName, string eventCategory, string k1, T1 v1, string k2, T2 v2)
    {
        _platformHandler.AddCustomEvent(eventName, eventCategory, k1, v1, k2, v2);
    }
    public static void AddCustomEvent<T1>(string eventName, string eventCategory, string k1, T1 v1)
    {
        _platformHandler.AddCustomEvent(eventName, eventCategory, k1, v1);
    }
    public static void AddCustomEvent(string eventName, string eventCategory)
    {
        _platformHandler.AddCustomEvent(eventName, eventCategory);
    }


#if UNITY_5_3_OR_NEWER

#if !UNITY_EDITOR && (UNITY_ANDROID || UNITY_IOS || UNITY_OPENHARMONY || UNITY_STANDALONE_WIN || UNITY_WEBGL)
    public struct GpmSample
    {
#if ENABLE_LEGACY_COMPATIBILITY_1_3
        // lost some performance when using custom api for stack trace recording, if legacy compatibility for 1.3 is required.
        public struct AutoScope : IDisposable
        {
            internal readonly IntPtr m_Ptr;

            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            internal AutoScope(IntPtr methodPtr)
            {
                m_Ptr = methodPtr;
                if (m_Ptr != IntPtr.Zero)
                {
                    UWAGPMInternal.PushSample(m_Ptr);
                }
            }

            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            public void Dispose()
            {
                if (m_Ptr != IntPtr.Zero)
                {
                    UWAGPMInternal.PopSample(m_Ptr);
                }
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public GpmSample(string name) { methodPtr = UWAGPMInternal.GetSamplePtr(name); }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Push() { UWAGPMInternal.PushSample(methodPtr); }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Pop() { UWAGPMInternal.PopSample(methodPtr); }
#else
        public struct AutoScope : IDisposable
        {
            internal readonly IntPtr m_Ptr;

            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            internal AutoScope(IntPtr methodPtr)
            {
                m_Ptr = methodPtr;
                if (m_Ptr != IntPtr.Zero)
                {
                    UWAGPMInternal.UwaGpmPushSample(m_Ptr);
                }
            }

            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            public void Dispose()
            {
                if (m_Ptr != IntPtr.Zero)
                {
                    UWAGPMInternal.UwaGpmPopSample(m_Ptr);
                }
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public GpmSample(string name) { methodPtr = UWAGPMInternal.UwaGpmGetSamplePtr(name); }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Push() { UWAGPMInternal.UwaGpmPushSample(methodPtr); }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Pop() { UWAGPMInternal.UwaGpmPopSample(methodPtr); }
#endif
        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public AutoScope Auto()
        {
            return new AutoScope(methodPtr);
        }

        internal readonly IntPtr methodPtr;
    }
#else
    public struct GpmSample
    {
        public struct AutoScope : IDisposable
        {
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            internal AutoScope(IntPtr methodPtr) { }

            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            public void Dispose() { }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public GpmSample(string name) { }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Push() { }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void Pop() { }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public AutoScope Auto()
        {
            return new AutoScope(IntPtr.Zero);
        }
    }
#endif


#else   // for Unity 5.0 and below, legacy compatibility with some performance cost, and no aggressive inlining


#if !UNITY_EDITOR && (UNITY_ANDROID || UNITY_IOS || UNITY_OPENHARMONY || UNITY_STANDALONE_WIN || UNITY_WEBGL)
    public struct GpmSample
    {
        public struct AutoScope : IDisposable
        {
            internal readonly IntPtr m_Ptr;
            internal AutoScope(IntPtr methodPtr)
            {
                m_Ptr = methodPtr;
                if (m_Ptr != IntPtr.Zero)
                {
                    UWAGPMInternal.UwaGpmPushSample(m_Ptr);
                }
            }

            public void Dispose()
            {
                if (m_Ptr != IntPtr.Zero)
                {
                    UWAGPMInternal.UwaGpmPopSample(m_Ptr);
                }
            }
        }

        public GpmSample(string name) { methodPtr = UWAGPMInternal.UwaGpmGetSamplePtr(name); }
        public void Push() { UWAGPMInternal.UwaGpmPushSample(methodPtr); }
        public void Pop() { UWAGPMInternal.UwaGpmPopSample(methodPtr); }

        public AutoScope Auto()
        {
            return new AutoScope(methodPtr);
        }

        internal readonly IntPtr methodPtr;
    }
#else
    public struct GpmSample
    {
        public struct AutoScope : IDisposable
        {
            internal AutoScope(IntPtr methodPtr) { }
            public void Dispose() { }
        }
        public GpmSample(string name) { }
        public void Push() { }
        public void Pop() { }
        public AutoScope Auto()
        {
            return new AutoScope(IntPtr.Zero);
        }
    }
#endif


#endif

    private partial interface IPlatformHandler
    {
        void StaticInit(string url, string appID, string appVersion, string channel, bool debug);
        int GetRegisterState();
        void ChangeScene(string sceneName);
        void SetUser(string userId);
        void SetUserLevel(string userLevel);
        void SetQuality(int quality);
        void BeginSceneLoad(string sceneName);
        void EndSceneLoad();
        void SetIgnore(bool enable);
        void SetSegment(bool enable, string segment);
        float GetSDKData(SDKMetricType type);
        void SetThreshold(MetricThresholdID id, int threshold);
        void SetDataPackInterval(int normalS, int specialS);
        void SetUploadActive(bool normal, bool detail);
        void SetUploadMinInterval(int normalS, int detailS);
        void SetStorageTimeLimit(int normalM, int detailM);
        void SetNetworkLatecy(uint valueMs);
        void SetScreenShotRatio(float ratio, bool exTrigger);
        void SetScreenShotEnabled(bool enable, bool exTrigger);
        void SetScreenShotInterval(int interval, bool exTrigger);
        void SetStackDepthLimit(int depth);
        void SetStackEnabled(bool enable);
        void SetStackInterval(int interval);
        void SetDeepTracking(bool enable);
        void AddCrashCustomLogPaths(params string[] filePaths);
        void AddCrashAttachmentPaths(string type, params string[] filePaths);
        void SetLogLevel(int level);
        int GetLogLevel();
        void AddCustomEvent<T1, T2, T3>(string eventName, string eventCategory, string k1, T1 v1, string k2, T2 v2, string k3, T3 v3);
        void AddCustomEvent<T1, T2>(string eventName, string eventCategory, string k1, T1 v1, string k2, T2 v2);
        void AddCustomEvent<T1>(string eventName, string eventCategory, string k1, T1 v1);
        void AddCustomEvent(string eventName, string eventCategory);
    }

    private partial class DefaultHandler : IPlatformHandler
    {
        private static GameObject _go = null;

        public void StaticInit(string url, string appID, string appVersion, string channel, bool debug)
        {
            if (_go == null)
            {
                _go = new GameObject("UWA_GPM_SERVICE");
                UnityEngine.Object.DontDestroyOnLoad(_go);
            }

            UWAGPMInternal.Setup(debug);

            var launcher = UWAGPM_Launcher.Get() != null ? UWAGPM_Launcher.Get() : _go.AddComponent<UWAGPM_Launcher>();
            launcher.EnableDebug(debug);

            // 注册Unity Log事件监听器
            launcher.RegisterLogEventHandler();

            launcher.Register(url, appID, appVersion, channel);

            // 初始化崩溃附件收集功能
            //InitializeCrashAttachment();
        }

        /// <summary>
        /// 初始化崩溃附件收集功能，使用默认的样例回调
        /// </summary>
        //private void InitializeCrashAttachment()
        //{
        //    try
        //    {
        //        var defaultCallback = new SampleCrashCallback();
        //        CrashAttachAdapter.Init(defaultCallback);
        //        UnityEngine.Debug.Log("[UWAGPM] Crash attachment collection initialized with default callback");
        //    }
        //    catch (System.Exception e)
        //    {
        //        UnityEngine.Debug.LogError("[UWAGPM] Failed to initialize crash attachment collection: " + e.Message);
        //    }
        //}
        public int GetRegisterState()
        {
            var launcher = UWAGPM_Launcher.Get();
            if (launcher == null)
            {
                return -1;
            }
            return launcher.GetRegisterState();
        }

        public void ChangeScene(string sceneName)
        {
            UWAGPMInternal.ChangeScene(sceneName);
        }

        public void SetUser(string userId)
        {
            UWAGPM_Launcher.NotifyUserIdChanged(userId);

            // UWAGPMInternal.UwaGpmSetUserId(userId);
            UWAGPMInternal.NativeCmd("user_id", userId);
        }

        public void SetUserLevel(string userLevel)
        {
            UWAGPMInternal.NativeCmd("user_lv", userLevel);
        }

        public void SetQuality(int quality)
        {
            UWAGPMInternal.AddStatus("quality", null, quality);
        }

        public void BeginSceneLoad(string sceneName)
        {
            UWAGPMInternal.AddEvent("scene_load_begin", null, "scene_name", sceneName);
        }

        public void EndSceneLoad()
        {
            UWAGPMInternal.AddEvent("scene_load_end", null);
        }

        public void SetIgnore(bool enable)
        {
            UWAGPMInternal.AddStatus("ignore", null, enable ? 1 : 0);
        }

        public void SetSegment(bool enable, string segment)
        {
            UWAGPMInternal.NativeCmd("segment", enable, segment);
        }

        public float GetSDKData(SDKMetricType type)
        {
            return UWAGPMInternal.GetSDKData((int)type);
        }

        public void SetThreshold(MetricThresholdID id, int threshold)
        {
            UWAGPMInternal.SetThreshold((int)id, threshold);
        }

        public void SetDataPackInterval(int normalS, int specialS)
        {
            UWAGPMInternal.NativeCmd("data_interval", normalS, specialS);
        }

        public void SetUploadActive(bool normal, bool special)
        {
            UWAGPMInternal.NativeCmd("upload_active", normal, special);
        }

        public void SetUploadMinInterval(int normalS, int specialS)
        {
            UWAGPMInternal.NativeCmd("upload_min_interval", normalS, specialS);
        }

        public void SetStorageTimeLimit(int normalM, int specialM)
        {
            UWAGPMInternal.NativeCmd("storage_max_pkg", normalM, specialM);
        }

        public void SetNetworkLatecy(uint valueMs)
        {
            UWAGPMInternal.SetNetworkLatecy(valueMs);
        }

        public void SetScreenShotRatio(float ratio, bool exTrigger)
        {
            UWAGPMInternal.NativeCmd("screenshot_ratio", ratio, exTrigger);
        }

        public void SetScreenShotEnabled(bool enable, bool exTrigger)
        {
            UWAGPMInternal.NativeCmd("screenshot_enable", enable, exTrigger);
        }

        public void SetScreenShotInterval(int interval, bool exTrigger)
        {
            UWAGPMInternal.NativeCmd("screenshot_interval", interval, exTrigger);
        }

        public void SetStackDepthLimit(int depth)
        {
            UWAGPMInternal.NativeCmd("stack_depth_limit", depth);
        }

        public void SetStackEnabled(bool enable)
        {
            UWAGPMInternal.NativeCmd("stack_enable", enable);
        }

        public void SetStackInterval(int interval)
        {
            UWAGPMInternal.NativeCmd("stack_interval", interval);
        }

        public void SetDeepTracking(bool enable)
        {
            UWAGPMInternal.NativeCmd("deep_tracking", enable);
        }

        public void AddCrashCustomLogPaths(params string[] filePaths)
        {
            UWAGPMInternal.AddCrashCustomLogPaths(filePaths);
        }

        public void AddCrashAttachmentPaths(string type, params string[] filePaths)
        {
            UWAGPMInternal.AddCrashAttachmentPaths(type, filePaths);
        }

        public void SetLogLevel(int level)
        {
            UWAGPMInternal.SetLogLevel(level);
        }

        public int GetLogLevel()
        {
            return UWAGPMInternal.GetLogLevel();
        }

        public void AddCustomEvent<T1, T2, T3>(string eventName, string eventCategory, string k1, T1 v1, string k2, T2 v2, string k3, T3 v3)
        {
            if (string.IsNullOrEmpty(eventName) || string.IsNullOrEmpty(eventCategory)) return;

            UWAGPMInternal.AddEvent(eventName, eventCategory, k1, v1, k2, v2, k3, v3);
        }
        public void AddCustomEvent<T1, T2>(string eventName, string eventCategory, string k1, T1 v1, string k2, T2 v2)
        {
            if (string.IsNullOrEmpty(eventName) || string.IsNullOrEmpty(eventCategory)) return;

            UWAGPMInternal.AddEvent(eventName, eventCategory, k1, v1, k2, v2);
        }
        public void AddCustomEvent<T1>(string eventName, string eventCategory, string k1, T1 v1)
        {
            if (string.IsNullOrEmpty(eventName) || string.IsNullOrEmpty(eventCategory)) return;

            UWAGPMInternal.AddEvent(eventName, eventCategory, k1, v1);
        }
        public void AddCustomEvent(string eventName, string eventCategory)
        {
            if (string.IsNullOrEmpty(eventName) || string.IsNullOrEmpty(eventCategory)) return;

            UWAGPMInternal.AddEvent(eventName, eventCategory);
        }


    }

    private partial class EmptyHandler : IPlatformHandler
    {
        public void StaticInit(string url, string appID, string appVersion, string channel, bool debug)
        {
            Debug.Log("UWA GPM: StaticInit on unsupported platform");
        }
        public int GetRegisterState() { return 0; }
        public void ChangeScene(string sceneName) { }
        public void SetUser(string userId) { }
        public void SetUserLevel(string userLevel) { }
        public void SetQuality(int quality) { }
        public void BeginSceneLoad(string sceneName) { }
        public void EndSceneLoad() { }
        public void SetIgnore(bool enable) { }
        public void SetSegment(bool enable, string segment) { }
        public float GetSDKData(SDKMetricType type) { return -1f; }
        public void SetThreshold(MetricThresholdID id, int threshold) { }
        public void SetDataPackInterval(int normalS, int specialS) { }
        public void SetUploadActive(bool normal, bool detail) { }
        public void SetUploadMinInterval(int normalS, int detailS) { }
        public void SetStorageTimeLimit(int normalM, int detailM) { }
        public void SetNetworkLatecy(uint valueMs) { }
        public void SetScreenShotRatio(float ratio, bool exTrigger) { }
        public void SetScreenShotEnabled(bool enable, bool exTrigger) { }
        public void SetScreenShotInterval(int interval, bool exTrigger) { }
        public void SetStackDepthLimit(int depth) { }
        public void SetStackEnabled(bool enable) { }
        public void SetStackInterval(int interval) { }
        public void SetDeepTracking(bool enable) { }
        // public void AddCrashAttachments(params string[] filePaths) { }
        public void AddCrashCustomLogPaths(params string[] filePaths) { }
        public void AddCrashAttachmentPaths(string type, params string[] filePaths) { }
        public void SetLogLevel(int level) { }
        public int GetLogLevel() { return 5; }
        public void AddCustomEvent<T1, T2, T3>(string eventName, string eventCategory, string k1, T1 v1, string k2, T2 v2, string k3, T3 v3) { }
        public void AddCustomEvent<T1, T2>(string eventName, string eventCategory, string k1, T1 v1, string k2, T2 v2) { }
        public void AddCustomEvent<T1>(string eventName, string eventCategory, string k1, T1 v1) { }
        public void AddCustomEvent(string eventName, string eventCategory) { }
    }
}
