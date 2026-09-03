using System;

namespace RXSDK
{
    public static partial class HMSAPI
    {
        public static string GetData(string key, string value)
        {
            try
            {
                return GetHMSGetDataManager().Call<string>("GetData", key, value);
            }
            catch (SystemException e)
            {
                Log.E("Get js data error" + e.Message);
            }
            return "";
        }

        public static string GetSdkInfo()
        {
            try
            {
                return GetRXAPIManager().Call<string>("GetSdkInfo");
            }
            catch (SystemException e)
            {
                Log.E("Get js data error" + e.Message);
            }
            return "";
        }

        public static string RegisterToken(Action<string> callback)
        {
            try
            {
                SetCallback("RegisterToken", callback);
                return GetHMSPushManager().Call<string>("RegisterToken", GetJSCallback());
            }
            catch (SystemException e)
            {
                Log.E("Get js data error" + e.Message);
            }
            return "";
        }

        public static string UnRegisterToken(Action<string> callback)
        {
            try
            {
                SetCallback("UnRegisterToken", callback);
                return GetHMSPushManager().Call<string>("UnRegisterToken", GetJSCallback());
            }
            catch (SystemException e)
            {
                Log.E("Get js data error" + e.Message);
            }
            return "";
        }

        public static string BindAlias(string alias)
        {
            try
            {
                return GetHMSPushManager().Call<string>("BindAlias", alias, GetJSCallback());
            }
            catch (SystemException e)
            {
                Log.E("Get js data error" + e.Message);
            }
            return "";
        }

        public static string UnBindAlias(string alias)
        {
            try
            {
                return GetHMSPushManager().Call<string>("UnBindAlias", alias, GetJSCallback());
            }
            catch (SystemException e)
            {
                Log.E("Get js data error" + e.Message);
            }
            return "";
        }
    }
}
