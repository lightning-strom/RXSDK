using System.Collections.Generic;
using RuiXue;
using RuiXue.Google;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueGoogleDemo : MonoBehaviour
{

    [SerializeField] public Button _Button_QueryProductDetailsAsync;
    
    private void Awake()
    {
        Dictionary<string, object> map = new()
        {
            { "clientId", "681389341105-1gjar2pgmg0vvlik0in4job178l0bamc.apps.googleusercontent.com" },
        };

        RuiXueSdk.InitThirdSdk(map, InitThirdSdkResponseDelegate, InitThirdSdkErrorDelegate);
    }

    public void InitThirdSdkResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestResponseDelegate: {data}");
    }
    public void InitThirdSdkErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {data}");
    }
    
    void Start()
    {
        _Button_QueryProductDetailsAsync.onClick.AddListener(OnQueryProductDetailsAsync);
    }

    public void OnQueryProductDetailsAsync()
    {
        List<string> productIdList = new();
        productIdList.Add("com.weile.bombchicken.1001");
        productIdList.Add("com.weile.bombchicken.1002");
        productIdList.Add("com.weile.bombchicken.1003");
        productIdList.Add("com.weile.bombchicken.1004");
        productIdList.Add("com.weile.bombchicken.1005");
        productIdList.Add("com.weile.bombchicken.1006");
        productIdList.Add("com.weile.bombchicken.1007");
        
        RXGoogle.QueryProductDetailsAsync(productIdList, GoogleResponseDelegate, GoogleErrorDelegate);
    }
    
    private void GoogleResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"GoogleResponseDelegate: {data}");
    }
    
    private void GoogleErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Pay Error : {error}");
    }
    
    
    public void GoogleStringFailForAndroid(int code, string msg, string traceId)
    {
        LogUtil.Log("EventManager", $"GoogleResponseDelegate: {code} - {msg} = {traceId}");
    }

}
