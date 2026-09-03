#if UNITY_ANDROID && !UNITY_EDITOR
using UnityEngine;

namespace RuiXue.GDT.Impl
{
    internal sealed class RXGDTAndroid : IRXGDT
    {
        private const string WrapperClassName = "com.ruixue.sdk.gdt.GDTSdkWrapper";

        private static AndroidJavaObject GetWrapper()
        {
            using (AndroidJavaClass wrapperClass = new AndroidJavaClass(WrapperClassName))
            {
                return wrapperClass.CallStatic<AndroidJavaObject>("getInstance");
            }
        }

        public void RegisterSdk()
        {
            // Android 无需在瑞雪 SDK 初始化前注册。
        }

        public void Initialize(string actionSetId, string secretKey, string channel, string channelId)
        {
            using (AndroidJavaClass unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
            using (AndroidJavaObject activity =
                   unityPlayer.GetStatic<AndroidJavaObject>("currentActivity"))
            using (AndroidJavaObject wrapper = GetWrapper())
            {
                wrapper.Call("init", activity, actionSetId, secretKey, channel, channelId);
            }
        }

        public void ReportRegister(string method, bool success)
        {
            using (AndroidJavaObject wrapper = GetWrapper())
                wrapper.Call("reportRegister", method, success);
        }

        public void ReportLogin(string method, bool success)
        {
            using (AndroidJavaObject wrapper = GetWrapper())
                wrapper.Call("reportLogin", method, success);
        }

        public void ReportCreateRole(string role)
        {
            using (AndroidJavaObject wrapper = GetWrapper())
                wrapper.Call("reportCreateRole", role);
        }

        public void ReportCheckout(string type, string name, string id, int number,
            bool isVirtualCurrency, string virtualCurrencyType, string currency, bool success)
        {
            using (AndroidJavaObject wrapper = GetWrapper())
                wrapper.Call("reportCheckout", type, name, id, number, isVirtualCurrency,
                    virtualCurrencyType, currency, success);
        }

        public void ReportPurchase(string goodsType, string goodsName, string goodsId, int number,
            string goodsChannel, string currency, int valueInCents, bool success)
        {
            using (AndroidJavaObject wrapper = GetWrapper())
                wrapper.Call("reportPurchase", goodsType, goodsName, goodsId, number, goodsChannel,
                    currency, valueInCents, success);
        }

        public void ReportQuestFinish(string id, string type, string name, int number,
            string description, bool success)
        {
            using (AndroidJavaObject wrapper = GetWrapper())
                wrapper.Call("reportQuestFinish", id, type, name, number, description, success);
        }

        public void ReportShare(string channel, bool success)
        {
            using (AndroidJavaObject wrapper = GetWrapper())
                wrapper.Call("reportShare", channel, success);
        }

        public void ReportUpdateLevel(int level)
        {
            using (AndroidJavaObject wrapper = GetWrapper())
                wrapper.Call("reportUpdateLevel", level);
        }

        public void ReportRateApp(float value)
        {
            using (AndroidJavaObject wrapper = GetWrapper())
                wrapper.Call("reportRateApp", value);
        }

        public void ReportViewContent(string type, string name, string id)
        {
            using (AndroidJavaObject wrapper = GetWrapper())
                wrapper.Call("reportViewContent", type, name, id);
        }

        public void ReportAddToCart(string type, string name, string id, int number, bool success)
        {
            using (AndroidJavaObject wrapper = GetWrapper())
                wrapper.Call("reportAddToCart", type, name, id, number, success);
        }
    }
}
#endif
