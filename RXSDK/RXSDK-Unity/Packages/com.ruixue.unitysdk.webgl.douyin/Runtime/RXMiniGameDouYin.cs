#if UNITY_WEBGL
using System.Collections.Generic;
using RuiXue.Pay;
using RuiXue.Share;
using TTSDK;
using TTSDK.UNBridgeLib.LitJson;
using System.Runtime.InteropServices;
using RuiXue.Impl;

namespace RuiXue.MiniGame.DouYin
{
    public static class RXMiniGameDouYin
    {
        private static TTGameRecorder m_TTGameRecorder = TT.GetGameRecorder();
        private static JsCallBackHelper _jsCallBackHelper = new JsCallBackHelper();

        public static void OpenCustomerServiceConversation(Dictionary<string, string> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string json = RXJsonUtil.ToJson(dic);
            _jsCallBackHelper.RegisterJsCallBack("rx_openCustomerServiceConversation", onResponse, onError);
            rx_openCustomerServiceConversation(json);
        }
        
        /// <summary>
        /// 开始录像
        /// </summary>
        /// <param name="isRecordAudio"></param>
        /// <param name="maxRecordTimeSec"></param>
        /// <param name="startCallback"></param>
        /// <param name="errorCallback"></param>
        /// <param name="timeoutCallback"></param>
        public static void StartRecord(
            bool isRecordAudio = true,
            int maxRecordTimeSec = 600,
            TTGameRecorder.OnRecordStartCallback startCallback = null,
            TTGameRecorder.OnRecordErrorCallback errorCallback = null,
            TTGameRecorder.OnRecordCompleteCallback timeoutCallback = null)
        {
            m_TTGameRecorder.Start(isRecordAudio, maxRecordTimeSec, startCallback,
                errorCallback, timeoutCallback);
        }

        /// <summary>
        /// 停止录像
        /// </summary>
        /// <param name="completeCallback"></param>
        /// <param name="errorCallback"></param>
        /// <param name="clipRanges"></param>
        /// <param name="autoMerge"></param>
        public static void StopRecord(
            TTGameRecorder.OnRecordCompleteCallback completeCallback = null,
            TTGameRecorder.OnRecordErrorCallback errorCallback = null,
            List<TTGameRecorder.TimeRange> clipRanges = null,
            bool autoMerge = true)
        {
            m_TTGameRecorder.Stop(completeCallback, errorCallback, clipRanges, autoMerge);
        }

        /// <summary>
        /// 抖音支付扩展
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void Pay(Dictionary<string, object> dic, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            if (dic["pay_type"].Equals("douyinh5") && isOnlyOrder(dic))
            {
                LogUtil.Log("DouyinPay", "Unity Pay");
                RXPay.Pay(dic, (data) =>
                {
                    JsonData orderData = JsonMapper.ToObject(data);
                    int buyQuantity = (int)orderData["data"]["data"]["ext"]["mini_game_amount"];
                    string customId = orderData["data"]["data"]["order_no"].ToString();
                    bool micro = orderData["data"]["data"]["ext"].OptGetBoolean("micro");
                    if (dic["platform"].Equals("ios"))
                    {
                        string zoneId = "1";
                        if (dic.ContainsKey("zoneId"))
                        {
                            zoneId = dic["zoneId"].ToString();
                        }

                        var payData = new JsonData();
                        payData["currencyType"] = micro ? "DIAMOND_PROP" : "DIAMOND";
                        payData["buyQuantity"] = buyQuantity;
                        payData["zoneId"] = zoneId;
                        payData["customId"] = customId;
                        payData["extraInfo"] = orderData["data"]["data"]["transmit_args"];
                        TT.OpenAwemeCustomerService(payData, () => { onResponse?.Invoke(customId + ""); },
                            (errCode, errMsg) =>
                            {
                                LogUtil.Log("DouyinPay", "Unity IOS Pay error code:" + errCode + " msg:" + errMsg);
                                JsonData errorData = new JsonData
                                {
                                    ["code"] = errCode,
                                    ["msg"] = errMsg
                                };
                                onError?.Invoke(errorData.ToJson());
                            });
                    }
                    else
                    {
                        StartDouYinAndroidPay(buyQuantity, customId, micro, onResponse, onError);
                    }
                }, onError);
            }
            else
            {
                LogUtil.Log("DouyinPay", "Web Pay");
                RXPay.Pay(dic, onResponse, onError);
            }
        }

        private static bool isOnlyOrder(Dictionary<string, object> dic)
        {
            if (dic.ContainsKey("onlyGetOrder") && dic["onlyGetOrder"] is bool value && value)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        private static void StartDouYinAndroidPay(int buyQuantity, string customId, bool micro,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.Log("StartDouYinPay", $"buyQuantity: {buyQuantity}, customId: {customId} micro: {micro}");

            Dictionary<string, object> orderInfoParams = new Dictionary<string, object>();
            orderInfoParams["mode"] = "game"; //支付的类型, 目前仅为"game"
            orderInfoParams["env"] = "0"; //环境配置，目前合法值仅为"0"
            orderInfoParams["currencyType"] = "CNY"; // 固定值: CNY。币种
            orderInfoParams["platform"] = "android"; //申请接入时的平台，目前仅为"android"
            //游戏开发者自定义的唯一订单号，订单支付成功后通过服务端支付结果回调回传
            orderInfoParams["customId"] = customId;

            if (micro && CanIUse.RequestGamePaymentParams.GoodType)
            {
                orderInfoParams["goodType"] = 2;
                orderInfoParams["orderAmount"] = buyQuantity * 10;
            }
            else
            {
                //金币购买数量，金币数量必须满足：金币数量*金币单价 = 限定价格等级（详见下方 buyQuantity 限制说明。开发者可以在抖音小游戏平台的“支付”tab 设置游戏币单价）
                orderInfoParams["buyQuantity"] = buyQuantity;
            }

            TT.RequestGamePayment(
                orderInfoParams,
                () =>
                {
                    LogUtil.Log("Pay Success", orderInfoParams["customId"] + "");

                    onResponse?.Invoke(orderInfoParams["customId"] + "");

                },
                (errCode, errMsg) =>
                {
                    LogUtil.Log("Pay failed", "errCode: " + errCode + ", errMsg: " + errMsg);

                    JsonData errorData = new JsonData
                    {
                        ["code"] = errCode,
                        ["msg"] = errMsg
                    };
                    onError?.Invoke(errorData.ToJson());
                }
            );
        }

        public static LaunchOption GetLaunchOptionsSync()
        {
            return TT.GetLaunchOptionsSync();
        }
        
        /// <summary>
        /// 拉起分享
        /// </summary>
        /// <param name="shareConfig"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void Share(RXShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            if (shareConfig.platform.Equals("douyinh5"))
            {
                DouYinShare(shareConfig, onResponse, onError);
            }
            else
            {
               RXShare.Share(shareConfig, onResponse, onError);
            }
        }

        private static void DouYinShare(RXShareConfig shareConfig, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RXShare.GetShareData(shareConfig, (data) =>
            {
                LogUtil.Log("getsharedata", $"success: {data}");
                JsonData shareData = JsonMapper.ToObject(data);
                JsonData content = shareData["data"]["content"];
                string materialType = "";
                if (content.ContainsKey("material_type"))
                {
                    materialType = content["material_type"].ToString();
                }
                if (shareConfig.channel.Equals("video") || "video".Equals(materialType))
                {
                    DouYinVideoShare(shareConfig, shareData, onResponse, onError);
                }else
                {
                    DouYinInviteShare(shareConfig.channel, shareData, onResponse, onError);
                }
            }, (error) =>
            {
                onError.Invoke(BuildDouYinShareCallback(3, error));
            });
        }

        private static void DouYinVideoShare(RXShareConfig shareConfig, JsonData shareData, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            JsonData content = shareData["data"]["content"];
            string title = "";
            if (content.ContainsKey("title"))
            {
                title = content["title"].ToString();
            }
            
            JsonData shareJson = new JsonData();
            shareJson["title"] = title;
            shareJson["channel"] = "video";
            
            shareJson["extra"] = new JsonData();
            JsonData videoTopics = new JsonData();
            videoTopics.SetJsonType(JsonType.Array);
            if (content.ContainsKey("video_contents"))
            {
                JsonData topicJson = content["video_contents"];
                if (topicJson != null && topicJson.Count > 0)
                {
                    foreach (var topicItem in topicJson)
                    {
                        videoTopics.Add(topicItem.ToString());
                    }
                }
            }
            shareJson["extra"]["videoTopics"] = videoTopics;
            shareJson["extra"]["hashtag_list"] = videoTopics;

            string cutTemplateId = "";
            if (shareConfig.extra != null)
            {
                if (shareConfig.extra.ContainsKey("videoTag"))
                {
                    shareJson["extra"]["videoTag"] = shareConfig.extra["videoTag"].ToString();
                }

                if (shareConfig.extra.ContainsKey("videoPath"))
                {
                    shareJson["extra"]["videoPath"] = shareConfig.extra["videoPath"].ToString();
                }

                if (shareConfig.extra.ContainsKey("withVideoId"))
                {
                    shareJson["extra"]["withVideoId"] = (bool) shareConfig.extra["withVideoId"];
                }

                if (shareConfig.extra.ContainsKey("defaultBgm"))
                {
                    shareJson["extra"]["defaultBgm"] = shareConfig.extra["defaultBgm"].ToString();
                }
                if (shareConfig.extra.ContainsKey("video_title"))
                {
                    shareJson["extra"]["video_title"] = shareConfig.extra["video_title"].ToString();
                }
                if (shareConfig.extra.ContainsKey("cutTemplateId"))
                {
                    cutTemplateId = shareConfig.extra["cutTemplateId"].ToString();
                    if ((cutTemplateId == null || cutTemplateId.Equals("")) && content.ContainsKey("share_id"))
                    {
                        cutTemplateId = content["share_id"].ToString();
                    }
                }
            }
            
            shareJson["extra"]["cutTemplateId"] = cutTemplateId;
            
            TT.ShareAppMessage(shareData, (data) =>
            {
                onResponse.Invoke(BuildDouYinShareCallback(0, "share success"));
            }, (errMsg) =>
            {
                onError.Invoke(BuildDouYinShareCallback(1, errMsg));
            }, () =>
            {
                onError.Invoke(BuildDouYinShareCallback(2, "cancel"));
            });
            
            // TT.ShareVideoWithTitleTopics((data) =>
            //     {
            //         onResponse.Invoke(BuildDouYinShareCallback(0, "share success"));
            //     },
            //     (errMsg) =>
            //     {
            //         onError.Invoke(BuildDouYinShareCallback(1, errMsg));
            //     },
            //     () =>
            //     {
            //         onError.Invoke(BuildDouYinShareCallback(2, "cancel"));
            //     }, title, topicList);
        }

        private static void DouYinInviteShare(string channel, JsonData shareData, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            JsonData shareJson = new JsonData();
            if ("invite".Equals(channel))
            {
                shareJson["channel"] = "invite";
            }
            
            JsonData content = shareData["data"]["content"];
            if (content.ContainsKey("title"))
            {
                shareJson["title"] = content["title"].ToString();
            }
            if (content.ContainsKey("content"))
            {
                shareJson["desc"] = content["content"].ToString();
            }
            if (content.ContainsKey("image"))
            {
                shareJson["imageUrl"] = content["image"].ToString();
            }
            if (content.ContainsKey("share_id"))
            {
                shareJson["templateId"] = content["share_id"].ToString();
            } 
            
            TT.ShareAppMessage(shareJson, (data) =>
            {
                onResponse.Invoke(BuildDouYinShareCallback(0, "share success"));
            }, (errMsg) =>
            {
                onError.Invoke(BuildDouYinShareCallback(1, errMsg));
            }, () =>
            {
                onError.Invoke(BuildDouYinShareCallback(2, "cancel"));
            });
        }
        
        private static string BuildDouYinShareCallback(int code, string msg)
        {
            JsonData jsonData = new JsonData
            {
                ["code"] = code,
            };
            JsonData dataJson = new JsonData();
            dataJson["msg"] = msg;
            jsonData["data"] = dataJson;
            return jsonData.ToJson();
        }
        
        [DllImport("__Internal")]
        private static extern void rx_openCustomerServiceConversation(string json);
    }
}
#endif