using UnityEngine;
using UnityEngine.UI;
using RXSDK.Platform.OpenHarmony;

public class TestWebviewUI : MonoBehaviour
{
    public Button createBtn;

    public Button removeBtn;

    public Button loadurlBtn;

    public Button loadhtmlstringBtn;

    public Button loaddataBtn;

    public Button evaluatejsBtn;

    public Button setvisibilityBtn;

    public Button setmarginsBtn;

    public Button reloadBtn;

    public Button stoploaddingBtn;

    public Button goforwardBtn;

    public Button gobackBtn;

    public Button loadUrlLocalBtn;
#if UNITY_OPENHARMONY
    private OpenHarmonyWebView _openHarmonyWebview;
#endif

    // Start is called before the first frame update
    void Start()
    {
#if UNITY_OPENHARMONY
        _openHarmonyWebview = new OpenHarmonyWebView();
        createBtn.onClick.AddListener(() => _openHarmonyWebview.CreateWebview(Screen.width / 8, Screen.height / 8, Screen.width / 8, Screen.height / 2, true));
        removeBtn.onClick.AddListener(_openHarmonyWebview.RemoveWebview);
        loadurlBtn.onClick.AddListener(() => _openHarmonyWebview.LoadURL("https://www.baidu.com/"));
        loadhtmlstringBtn.onClick.AddListener(() =>
            _openHarmonyWebview.LoadHTMLString("<html><body bgcolor=\"white\">Source:<pre>source</pre></body></html>",
                ""));
        loaddataBtn.onClick.AddListener(() =>
            _openHarmonyWebview.LoadData("<html><body bgcolor=\"white\">Source:<pre>source</pre></body></html>", ""));
        loadUrlLocalBtn.onClick.AddListener(() =>
            _openHarmonyWebview.LoadURL("resource://rawfile/Data/StreamingAssets/index.html"));
        evaluatejsBtn.onClick.AddListener(() => _openHarmonyWebview.EvaluateJS("test()"));
        setvisibilityBtn.onClick.AddListener(() => _openHarmonyWebview.SetVisibility(true));
        setmarginsBtn.onClick.AddListener(() =>
            _openHarmonyWebview.SetMargins(Screen.width / 8, Screen.height / 8, Screen.width / 8, Screen.height / 2));
        reloadBtn.onClick.AddListener(_openHarmonyWebview.Reload);
        stoploaddingBtn.onClick.AddListener(_openHarmonyWebview.StopLoading);
        goforwardBtn.onClick.AddListener(_openHarmonyWebview.GoForward);
        gobackBtn.onClick.AddListener(_openHarmonyWebview.GoBack);
#endif

    }



    // Update is called once per frame
    void Update()
    {

    }
}
