using System.Collections.Generic;
using RuiXue;
using RuiXue.Oaidv2;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueOaidv2Demo : MonoBehaviour
{
    
    [SerializeField] public Button _Button_init;
    [SerializeField] public Button _isSupport;
    [SerializeField] public Button _getOAID;

    private void Awake()
    {
        SDkInit();
        OnSetPrivacyAgree();
    }

    void Start()
    {
        _Button_init.onClick.AddListener(Init);
        _isSupport.onClick.AddListener(IsSupport);
        _getOAID.onClick.AddListener(GetOAID);
    }
    
    private void SDkInit()
    {
        
        string cpId = "119";
        string channelId = "iOSOS";
        string productId = "SDKOS";
        List<string> list = new()
        {
            "http://os-api-test.ruixuecloud.com/"
        };
        
        RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
    }
    
    public void InitResponseDelegate(string data)
    {
        LogUtil.Log("EventManager",$"RequestResponseDelegate: {data}");
    }
    public void InitErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {data}");
    }
    
    private void OnSetPrivacyAgree()
    {
        RuiXueSdk.SetPrivacyAgree(OnPrivacyAgree);
    }
    
    public void OnPrivacyAgree(bool userClick)
    {
        LogUtil.Log("EventManager", $"userClick: {userClick}");
    }

    public void Init()
    {
#if UNITY_ANDROID
        RXOaidv2.InitOaidSdk("-----BEGIN CERTIFICATE-----\nMIIFljCCA36gAwIBAgIDAJjZMA0GCSqGSIb3DQEBCwUAMIGAMQswCQYDVQQGEwJD\nTjEQMA4GA1UECAwHQmVpamluZzEMMAoGA1UECgwDTVNBMREwDwYDVQQLDAhPQUlE\nX1NESzEeMBwGA1UEAwwVY29tLmJ1bi5taWl0bWRpZC5zaWduMR4wHAYJKoZIhvcN\nAQkBFg9tc2FAY2FpY3QuYWMuY24wHhcNMjQwMTE2MTAwMDUwWhcNMjUwMTE2MTAw\nMDUwWjCBhzELMAkGA1UEBhMCQ04xEDAOBgNVBAgMB0JlaWppbmcxEDAOBgNVBAcM\nB0JlaWppbmcxEjAQBgNVBAoMCXh6bmV0d29yazEeMBwGA1UEAwwVY29tLndlaWxl\nLmJvbWJjaGlja2VuMSAwHgYJKoZIhvcNAQkBFhFsaXBlbmdAaml4aWFuZy5jbjCC\nAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBALIYL1PcZbgFKy+dU2pvz4eW\neMkBC9M93sfXebV/3jm5SxRhgxppm4gJiNvip59lTJCDLEFRNh8E5OkTtxx1w2hm\nAKnTlFOeDfTO+RzimNrAkiQ14gLY0aU3tGq47gpr/TotK6rk35t8vvwTQzBkCKej\nFKzB//I1jlHUsnZvcjsGdbutVJvspsHRDjPkqa4nTiE9WXsG1J19We+dFVMENGb9\nwyDK6kSX4IIZbwdR6PM8d0d4dErWvHt+7BAj7mOAyYNhE1dkPgCYnS8KW6tBHlq8\n3bE67EHwdu0H6VCK2w2dAK9hjVenizsW1+ZPonMM1D/+9GBfFis5pUV+hj+6Cs75\nJ9m2p6P6Z0pHcqA5oADvm3zNwl8zpYats8mXfEdzZuEPiQbBGRMBwcntZA4itbPz\nkI8J8ihiHydmUGWwI1qYkmHo+XacC2ad8y0O5hkmj/ZAron8oW3LCxgh6RTp+JGw\nlpq6cF/mwP0jFu8lxFEH4dEKzJIpgSDzPteWH3R8eKZ9SBPQa3jj+j6fM+HsKr0D\nLp1a0zFgXHvxnV6lqk4l1Q2llYgRPzBAeuImZsnXxOWJ0ZEBbzmRbaRrZyvi7oR3\nrwlBr6c36RtLR0N6684EY6yKqoLLlp4DSjPzwdFZYiBrTY8tNlsSzg91is3MdYIh\nKOeTfgqnDDFglSfpmnLXAgMBAAGjEDAOMAwGA1UdEwEB/wQCMAAwDQYJKoZIhvcN\nAQELBQADggIBAFjayfFQs8auvdzCeE/mAlKYL2Q3RtS7INrjxNIxXG5b2didvhBk\nyrTdJtTzm8gFvmD40GEUxVyC7+15BKA7HZhC+tIllSysE4Mrwv1yxEnqObbdI8Iv\ntatFRrOCA/SwLiEJcZ/tdpSIjB3P9itNMIoKg9nDMRq3se1SAtnByicX05Y4sGII\nsXp0dkN8ZL1xmdezV0F+lMAV8z52eEzntRp5pJb3PoNVtPiWcxybaS+BNPyD7Hh0\nhw2LFm+gW4aZ//GN4ow9PjQcGC5G3LiI2MLsp0M8wUBsT8YJwCwE1A0/taxCBSqw\nLNLCoUyfFaodwWWcviA6mfqYiDdlrblOtOlHw60V+dmqaFAh44L7HBIcAVOCtCP6\nIax3bE/cyO3wBEJuLt2ZU7gTxZXeuxbp/hGSGbabzz3rApr8P7OBvTT97EoeLUak\nwQ/vlrHyIORnd0bE3IHwk755+Pg2sWiHr6Pfn0DdPGj+geOHlCrpmr+OpZfwfbJl\npyLYH2gaZRvs4+7oCAO5wNaDMKCyA5STn8uXA/yy9vmI1BhpQyChYpHZ1IvHuaXb\nyn/iTzEXl9STqAf+lH9qNu+UfbqT2KAgbgL9MA8/KK5MMzd13YjGfIfFekC4cI9v\n19JTauFV6PPfnCFKNPBZB5nd4/GxFp30ybVKcNITrO7pDOR6Gm5Mt7Gs\n-----END CERTIFICATE-----", ReAppOaidCallbackJavaProxy);
#endif    
    }
    
    public void ReAppOaidCallbackJavaProxy(string data)
    {
        LogUtil.Log("EventManager",$"ReAppOaidCallbackJavaProxy: {data}");
    }

    public void IsSupport()
    {
        LogUtil.Log("EventManager",$"isSupport: {RXOaidv2.IsSupport()}");
    }

    public void GetOAID()
    {
        LogUtil.Log("EventManager",$"GetOAID: {RXOaidv2.GetOAID()}");
    }

}
