#if UNITY_OPENHARMONY
using System;
using UnityEngine;

public class OpenHarmonyWebview
{
    private OpenHarmonyJSClass webviewControlBridgeClass;
    private OpenHarmonyJSObject webviewControlBridge;
    private bool attached = false;
    private string url;

    public OpenHarmonyWebview()
    {
        webviewControlBridgeClass = new OpenHarmonyJSClass("WebviewControlBridge");
        webviewControlBridge = webviewControlBridgeClass.CallStatic<OpenHarmonyJSObject>("getInstance");
    }

    public void CreateWebview(int ml, int mt, int mr, int mb, bool visible)
    {
        OpenHarmonyJSCallback webviewCallBack = new OpenHarmonyJSCallback(WebviewCallBack);
        webviewControlBridge.Call("CreateWebview", ml, mt, mr, mb, visible, webviewCallBack);
    }

    public object WebviewCallBack(params OpenHarmonyJSObject[] args)
    {
        Debug.Log(">receive WebControllerAttached message." + args.Length);
        attached = true;
        if (url != null)
            LoadURL(url);

        return null;
    }
    public void RemoveWebview()
    {
        webviewControlBridge.Call("RemoveWebview");
        attached = false;
    }

    public void LoadURL(string url)
    {
        if (attached && url != null)
        {
            webviewControlBridge.Call("LoadURL", url);
            this.url = null;
        }
        else
        {
            this.url = url;
        }
    }

    public void LoadHTMLString(string contents, string baseUrl)
    {
        webviewControlBridge.Call("LoadHTMLString", contents, baseUrl);
    }

    public void LoadData(string contents, string baseUrl)
    {
        webviewControlBridge.Call("LoadData", contents, baseUrl);
    }

    public void EvaluateJS(string jsContents)
    {
        webviewControlBridge.Call("EvaluateJS", jsContents);
    }

    public void SetVisibility(Boolean visible)
    {
        webviewControlBridge.Call("SetVisibility", visible);
    }

    public void SetMargins(int ml, int mt, int mr, int mb)
    {
        webviewControlBridge.Call("SetMargins", ml, mt, mr, mb);
    }

    public void Reload()
    {
        webviewControlBridge.Call("Reload");
    }

    public void StopLoading()
    {
        webviewControlBridge.Call("StopLoading");
    }

    public void GoForward()
    {
        webviewControlBridge.Call("GoForward");
    }

    public void GoBack()
    {
        webviewControlBridge.Call("GoBack");
    }
}
#endif