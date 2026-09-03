using System;

namespace RXSDK
{
    public static partial class HMSAPI
    {
        public static void InitIAPOnUI()
        {
            GetHMSIAPManager().Call("InitIAPOnUI", GetJSCallback());
        }

        public static void QueryIAPListOnUI(string storeType, string[] storeIDList)
        {
            GetHMSIAPManager().Call("QueryIAPListOnUI", storeType, storeIDList, GetJSCallback());
        }

        public static void StartPurchaseOnUI(string storeType, string storeID)
        {
            GetHMSIAPManager().Call("StartPurchaseOnUI", storeType, storeID, GetJSCallback());
        }

        public static void StartPurchaseUI(int storeType, string storeID, string developerPayload, string reservedInfo, Action<string> callback)
        {
            var param = new System.Collections.Generic.Dictionary<string, object>
            {
                { "productId", storeID },
                { "productType", storeType },
                { "developerPayload", developerPayload },
                { "reservedInfo", reservedInfo }
            };
            SetCallback("StartPurchase", callback);
            GetHMSIAPManager().Call("StartPurchaseUI", RXUtility.ObjectToJson(param), GetJSCallback());
        }

        public static void ConsumePurchaseOnUI(string purchaseToken, Action<string> callback)
        {
            SetCallback("ConsumePurchase", callback);
            GetHMSIAPManager().Call("ConsumePurchaseOnUI", purchaseToken, GetJSCallback());
        }

        public static void CheckOwnedPurchasesOnUI(string storeType, Action<string> callback)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            SetCallback("CheckOwnedPurchases", callback);
            GetHMSIAPManager().Call("CheckOwnedPurchasesOnUI", storeType, GetJSCallback());
#else
            callback?.Invoke("{\"code\":0}");
#endif
        }
    }
}
