using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class LogToUI : MonoBehaviour
{
    [Header("绑定 UI Text (Legacy Text)")]
    public Text logText;

    [Header("最大日志字符数")]
    public int maxLogLength = 5000;

    private string fullLog = "";
    private ScrollRect scrollRect;
    private bool shouldScrollToBottom = true;
    private bool isScrolling = false;
    private float scrollStopTime;

    void Start()
    {
        // Get or add ScrollRect component
        scrollRect = GetComponentInParent<ScrollRect>();
        if (scrollRect == null)
        {
            return;
        }

        // Add scroll listener
        scrollRect.onValueChanged.AddListener((Vector2 value) =>
        {
            if (!isScrolling)
            {
                // shouldScrollToBottom = Mathf.Approximately(value.y, 0f);
                shouldScrollToBottom = true;
            }
            isScrolling = true;
            scrollStopTime = Time.time;
            StartCoroutine(DetectScrollStop());
        });
    }

    void OnEnable()
    {
        Application.logMessageReceived += HandleLog;
    }

    void OnDisable()
    {
        Application.logMessageReceived -= HandleLog;
    }

    void HandleLog(string message, string stackTrace, LogType type)
    {
        string prefix = $"[{type}] ";
        string logEntry = prefix + message + "\n";

        fullLog += logEntry;

        if (fullLog.Length > maxLogLength)
        {
            fullLog = fullLog.Substring(fullLog.Length - maxLogLength);
        }

        if (logText != null)
        {
            logText.text = fullLog;

            // Ensure layout is updated immediately
            Canvas.ForceUpdateCanvases();

            if (shouldScrollToBottom && scrollRect != null)
            {
                ScrollToBottom();
            }
        }
    }

    private IEnumerator DetectScrollStop()
    {
        while (Time.time - scrollStopTime < 0.05f)
        {
            yield return null;
        }
        isScrolling = false;
    }

    public void ScrollToBottom()
    {
        if (scrollRect != null)
        {
            // Ensure we execute this in the next frame to allow layout updates
            StartCoroutine(ScrollToBottomDeferred());
        }
    }

    private IEnumerator ScrollToBottomDeferred()
    {
        yield return new WaitForEndOfFrame();
        scrollRect.verticalNormalizedPosition = 0f;
        Canvas.ForceUpdateCanvases();
    }

    // Public method to manually toggle auto-scrolling
    public void SetAutoScroll(bool enable)
    {
        shouldScrollToBottom = enable;
        if (enable)
        {
            ScrollToBottom();
        }
    }
}
