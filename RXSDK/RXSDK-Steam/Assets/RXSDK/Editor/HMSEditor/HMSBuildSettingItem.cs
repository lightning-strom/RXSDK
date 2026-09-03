using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HMSBuildSettingItem : ScriptableObject
{
    public string client_id = "";
    public string app_id = "";
    public string bundle_name = "";

    public string storePassword = "";
    public string certpath = "";
    public string keyAlias = "";
    public string keyPassword = "";
    public string profile = "";
    public string signAlg = "SHA256withECDSA";
    public string storeFile = "";

    public HMSBuildSettingItem()
    {
        signAlg = "SHA256withECDSA";

    }
}
