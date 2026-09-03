using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using RXSDK.Net;
using RXSDK.Platform;
using UnityEngine;

namespace RXSDK
{
    public class BillingManager : Singleton<BillingManager>
    {
        const int CALLBACK_FROM_CLIENT = 1;

        private int callbackFrom = 0;

        // string pur = "{\"code\":0,\"data\":{\"inAppPurchaseData\":\"{\\\"autoRenewing\\\":false,\\\"orderId\\\":\\\"2024030411012408248ad33751.5765880207853762109\\\",\\\"packageName\\\":\\\"com.ruixue.hardemo\\\",\\\"applicationId\\\":5765880207853762109,\\\"applicationIdString\\\":\\\"5765880207853762109\\\",\\\"kind\\\":0,\\\"productId\\\":\\\"consumeProduct001\\\",\\\"productName\\\":\\\"consumeProduct001\\\",\\\"purchaseTime\\\":1709521295000,\\\"purchaseTimeMillis\\\":1709521295000,\\\"purchaseState\\\":0,\\\"purchaseToken\\\":\\\"0000018e0768d804732a560378bee66c643f64d3ddbc8d2ca4220b8d8b3c732c69237ad7fe10cc83x434e.1.5765880207853762109\\\",\\\"consumptionState\\\":0,\\\"confirmed\\\":0,\\\"currency\\\":\\\"CNY\\\",\\\"price\\\":1,\\\"country\\\":\\\"CN\\\",\\\"payOrderId\\\":\\\"Pe202403041101270534EDE0A09\\\",\\\"payType\\\":\\\"94\\\",\\\"sdkChannel\\\":\\\"1\\\"}\",\"signature\":\"DjnRVfPT2VFucmO28EbJIcJ1wXgHI2Pg4WSm63PGE5fHUy6M5zZ865iBnj0abQPNRY/fiNYcmjegopgrJiRdQIhiwVYmXgzQ5Hmhq8c/P5FHI+7N6RV7L/sSnoCQlzq3ccow5QU+qYjONXQ1k3wA7Y/l48oQreuymEoIGVxF6At9xl1gRA9wV3QNETm+2BI4ZQQWuKPrqMZ5fTE9ck8uzTNH7PF2JN7yz6/dDuDk8uQrcNg1LSBSxW3EEviDzVYKXXALvMZ/4cuxdLfMjgBU6bp2XmoBfjzneHjrdV2XGPB9s7cDVYnxGBMETOKHSZyP4GYp4xjwv7bjyJobo/0NKLcS3bieNhLpmkF95qYLhim7JvJ7lV30M+TkMC5aUHCoGEP0VnCPCMaEt32qrJz9QBRW2iSCFBRF4MDpGRQRYLE8xIhkRUIOW9V9JYCG0kU8CdCwn6IqJvkj8BuNifAcz5at/z9+YgfRFiSUBff4lvz39vXRJw5W3xflYY7CtY5d\",\"signatureAlgorithm\":\"SHA256WithRSA/PSS\"}}";

        public void Order(MonoBehaviour mono, PayArgs args, RXCallback<OrderData> callback)
        {
            Order(mono, args.ToDictionary(), callback);
        }


        public void Order(MonoBehaviour mono, Dictionary<string, object> keyValuePairs, RXCallback<OrderData> callback)
        {
            keyValuePairs ??= new Dictionary<string, object>();
            if (!keyValuePairs.ContainsKey("pay_type") && !keyValuePairs.ContainsKey("hq_type"))
            {
                keyValuePairs.Add("pay_type", "harmony");
            }
            string currency = "CNY";
            keyValuePairs.TryAdd("currency", currency);
            string openid = PassportManager.Instance.CurrentLoginData?.openid;
            keyValuePairs.TryAdd("openid", openid);

            keyValuePairs.TryAdd("age", PassportManager.Instance.CurrentLoginData?.age);

            this.callbackFrom = ObjectUtility.ToInt(keyValuePairs["callback_from"]);


            RXWebRequest rXWebRequest = RXWebRequest.Create(APIPath.ORDER);
            rXWebRequest.SetPostData(keyValuePairs);
            rXWebRequest.PostAsync(mono, callback);
        }



        public void Pay(MonoBehaviour mono, PayArgs args, RXCallback<object> callback)
        {
            Pay(mono, args.ToDictionary(), callback);
        }

        public void Pay(MonoBehaviour mono, string payType, string goodsTag, Dictionary<string, object> keyValuePairs, RXCallback<object> callback)
        {
            keyValuePairs ??= new Dictionary<string, object>();
            keyValuePairs.TryAdd("pay_type", payType);
            keyValuePairs.TryAdd("goods_tag", goodsTag);
            Pay(mono, keyValuePairs, callback);
        }

        public void Pay(MonoBehaviour mono, Dictionary<string, object> keyValuePairs, RXCallback<object> callback)
        {
            Order(mono, keyValuePairs, (ret, e) =>
            {
                var code = ret.code;
                var orderData = ret.data;
                var msg = ret.msg;
                if (code != 0)
                {
                    // callback?.Invoke(new RXResult<object> { code = code, data = orderData?.ToJson(), msg = msg });
                    RXUtility.InvokeCallback(callback, code, orderData?.ToJson(), msg);
                }
                else if (DeviceUtility.IsHarmony())
                {
                    InvokeHMSPurchase(mono, callback, orderData);
                }
                else
                {
                    Log.D("Application.platform:" + Application.platform);
                    // callback?.Invoke(new RXResult<object> { code = code, data = orderData?.ToJson(), msg = msg });
                    RXUtility.InvokeCallback(callback, code, orderData?.ToJson(), msg);

                }
            });
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
            PlatformProvider.Current.StartPurchaseUI(0, third_tag, orderData.GetDeveloperPayload(), orderData.transmit_args, (json) =>
            {
                JObject jsonData = JObject.Parse(json);
                int codep = (int)jsonData["code"];

                if (codep == (int)ErrorCode.ALREADY_OWNS_PRODUCT || codep == (int)ErrorCode.SYSTEM_INTERNAL_ERROR)
                {
                    RestorePurchase(mono, orderData.notify_url, callback);
                }
                else if (callbackFrom != CALLBACK_FROM_CLIENT)
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


        protected void VerifyPayment(MonoBehaviour mono, string notifyUrl, Dictionary<string, object> keyValuePairs, RXCallback<object> callback)
        {
            if (string.IsNullOrEmpty(notifyUrl))
            {
                RXUtility.InvokeCallback(callback, (int)RXErrorCode.PayError, null, "notify url null error");
                return;
            }
            if (keyValuePairs == null)
            {
                RXUtility.InvokeCallback(callback, (int)RXErrorCode.PayError, null, "inAppPurchaseData null error");
                return;
            }
            keyValuePairs ??= new Dictionary<string, object>();

            keyValuePairs["iap_version"] = keyValuePairs["iap_version"] ?? "12";
            RXWebRequest rXWebRequest = RXWebRequest.Create(notifyUrl);
            rXWebRequest.SetPostData(keyValuePairs);
            // rXWebRequest.Headers = SDKConfig.Instance.GetDefaultHeader();
            rXWebRequest.PostAsync<object>(mono, (ret, e) =>
            {
                var code = ret.code;
                var data = ret.data;
                var msg = ret.msg;
                if (code == 302402 || code == 302408 || code == 302409 || code == 302414)
                {
                    code = 0;
                }
                RXUtility.InvokeCallback(callback, code, data, msg);
            });
        }

        public void RestorePurchase(MonoBehaviour mono, string notifyUrl = null, RXCallback<object> callback = null)
        {
            PlatformProvider.Current.CheckOwnedPurchasesOnUI("CONSUMABLE", (ownedPurchases) =>
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
}