
using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using RXSDK.Net;
using UnityEngine;

namespace RXSDK
{
#if UNITY_OPENHARMONY
    class HMSIapImpl : BillingClient
    {
        public override string BrandName => "harmony";

        public override void DoPay(OrderData orderData, RXCallback<object> callback, MonoBehaviour mono)
        {
            InvokeHMSPurchase(mono, callback, orderData);
        }

        public override void VerifyPayment(MonoBehaviour mono, string notifyUrl, Dictionary<string, object> keyValuePairs, RXCallback<object> callback)
        {
            keyValuePairs ??= new Dictionary<string, object>();
            keyValuePairs["iap_version"] = keyValuePairs["iap_version"] ?? "12";
            base.VerifyPayment(mono, notifyUrl, keyValuePairs, callback);
        }

        private void InvokeHMSPurchase(MonoBehaviour mono, RXCallback<object> callback, OrderData orderData)
        {
            string third_tag = orderData?.ext?["third_tag"] as string;

            if (string.IsNullOrEmpty(third_tag))
            {
                // callback?.Invoke((int)RXErrorCode.PayError, null, "third_tag null error");
                RXUtility.InvokeCallback(callback, (int)RXErrorCode.PayError, null, "third_tag null error");
                return;
            }
            HMSAPI.StartPurchaseUI(0, third_tag, orderData.GetDeveloperPayload(), orderData.transmit_args, (json) =>
            {
                JObject jsonData = JObject.Parse(json);
                int codep = (int)jsonData["code"];

                if (codep == (int)ErrorCode.ALREADY_OWNS_PRODUCT || codep == (int)ErrorCode.SYSTEM_INTERNAL_ERROR)
                {
                    RestorePurchase(mono, orderData.notify_url, callback);
                }
                else if (CallbackFrom != BillingCallbackType.Client)
                {
                    RXUtility.InvokeCallback(callback, Error.GetRXCode(codep), null, Error.GetMessage(codep, jsonData));
                }
                else if (codep == 0 && jsonData.ContainsKey("data"))
                {
                    var data = (JObject)jsonData["data"];
                    var iap_version = data.ContainsKey("iap_version") ? data["iap_version"].ToString() : "12";
                    Dictionary<string, object> purchaseDic;
                    if (iap_version == "12")
                    {
                        purchaseDic = data.ToObject<Dictionary<string, object>>() ?? new();
                    }
                    else
                    {
                        if (!data.ContainsKey("inAppPurchaseData"))
                        {
                            RXUtility.InvokeCallback(callback, -2, null, "inAppPurchaseData null error");
                            return;
                        }
                        string inAppPurchaseData = data["inAppPurchaseData"].ToString();
                        string signature = data["signature"].ToString();
                        string signatureAlgorithm = data["signatureAlgorithm"].ToString();
                        purchaseDic = new()
                        {
                            { "purchase_data", inAppPurchaseData },
                            { "purchase_signature", signature },
                            { "signature_lgorithm", signatureAlgorithm }
                        };
                    }
                    VerifyPayment(mono, orderData.notify_url, purchaseDic, callback);
                }
                else
                {
                    RXUtility.InvokeCallback(callback, Error.GetRXCode(codep), jsonData["data"], Error.GetMessage(codep, jsonData));
                }
            });
        }
        public override void RestorePurchase(MonoBehaviour mono, string notifyUrl = null, RXCallback<object> callback = null)
        {
            HMSAPI.CheckOwnedPurchasesOnUI("CONSUMABLE", (ownedPurchases) =>
            {
                // JsonData jsonData1 = JsonMapper.ToObject(ownedPurchases);
                // JsonData datap = jsonData1.ContainsKey("data") ? jsonData1["data"] : null;
                JObject jsonData1 = JObject.Parse(ownedPurchases);
                // 检查 "data" 键是否存在  
                if (jsonData1["data"] is JObject datap && datap.Type == JTokenType.Object)
                {
                    var iap_version = datap.ContainsKey("iap_version") ? datap["iap_version"].ToString() : "12";
                    if (iap_version == "12")
                    {
                        Dictionary<string, object> purchaseDic = datap.ToObject<Dictionary<string, object>>() ?? new();
                        if (string.IsNullOrEmpty(notifyUrl))
                        {
                            OrderData orderData = OrderData.FromDeveloperPayload(purchaseDic["developerPayload"]?.ToString());
                            notifyUrl = orderData?.notify_url;
                        }
                        purchaseDic.Remove("developerPayload");
                        VerifyPayment(mono, notifyUrl, purchaseDic, callback);
                    }
                    else
                    {
                        if (!datap.ContainsKey("inAppPurchaseDataList"))
                        {
                            RXUtility.InvokeCallback(callback, (int)RXErrorCode.PayError, jsonData1["data"], "inAppPurchaseDataList null error");
                            return;
                        }
                        var inAppPurchaseData = datap["inAppPurchaseDataList"];
                        var inAppSignatureList = datap["inAppSignatureList"];
                        // var productList = datap["productList"];
                        string signatureAlgorithm = datap["signatureAlgorithm"].ToString();
                        // if (inAppPurchaseData?.Count > 0 && inAppPurchaseData.IsArray)
                        if (inAppPurchaseData != null && inAppPurchaseData.Type == JTokenType.Array && inAppPurchaseData.Count() > 0)
                        {
                            for (int i = 0; i < inAppPurchaseData.Count(); ++i)
                            {
                                string inAppPurchaseDataStr = inAppPurchaseData[i].ToString();
                                // JsonData inAppPurchaseDataObj = JsonMapper.ToObject(inAppPurchaseDataStr);
                                var inAppPurchaseDataObj = JObject.Parse(inAppPurchaseDataStr);
                                string developerPayload = inAppPurchaseDataObj.ContainsKey("developerPayload") ? inAppPurchaseDataObj["developerPayload"].ToString() : null;

                                OrderData orderData = OrderData.FromDeveloperPayload(developerPayload);
                                Dictionary<string, object> purchaseDic = new()
                                {
                                    { "purchase_data", inAppPurchaseDataStr },
                                    { "purchase_signature", inAppSignatureList[i].ToString() },
                                    { "signature_lgorithm", signatureAlgorithm }
                                };
                                VerifyPayment(mono, orderData?.notify_url, purchaseDic, callback);
                            }
                        }
                        else
                        {
                            RXUtility.InvokeCallback(callback, (int)RXErrorCode.PayError, jsonData1["data"], "inAppPurchaseData error");
                        }
                    }
                }
                else
                {
                    Log.D("CheckOwnedPurchases finish");
                    RXUtility.InvokeCallback(callback, (int)RXErrorCode.Success, null, "CheckOwnedPurchases finish");
                }
            });
        }

    }
#endif
}