
using System;
using System.Collections.Generic;
using RXSDK.Data;
using RXSDK.Net;

namespace RXSDK
{

    // ShareScene 类型等同于枚举，支持 -1, 1, 2
    public enum ShareScene
    {
        Undefined = -1,
        Friend = 1,
        FriendCircle = 2
    }



    // Platforms 信息
    public class SharePlatforms
    {
        public int wechat;
        public int qq;
        public int system;
    }

    // 定义 ShareMediaTypes 常量
    public static class ShareMediaTypes
    {
        public const string WEBPAGE = "link";       // 分享链接
        public const string IMAGE = "image";       // 分享图片
        public const string LANDING = "landing";   // 分享图片并增加二维码
        public const string A2M = "a2m";           // App 分享至小游戏
        public const string CARD = "card";         // 小程序卡片
        public const string TEXT = "text";         // 分享文本
        public const string TEXT_IMAGE = "text_image"; // 图文分享
        public const string VIDEO = "video";       // 视频分享
        public const string MUSIC = "music";       // 音乐分享
        public const string ATLAS = "atlas";       // 多图分享
        public const string HW_KNOCK = "hw_knock";
    }
    public class ShareParams
    {
        public string platform; // 平台
        public ShareScene share_scene; // 分享场景
        public string material_type; // 素材类型
        public string title; // 标题 (可选)
        public string content; // 描述 (可选)
        public string image; // 图片地址 (可选)
        public string url; // 链接地址 (可选)
        public int? x; // 二维码左上角 X 坐标 (可选)
        public int? y; // 二维码左上角 Y 坐标 (可选)
        public int? width; // 二维码宽度 (可选)
        public int? height; // 二维码高度 (可选)
        public int? wh; // 宽高统一值 (可选)
        public string package_name; // 包名 (可选)
        public string class_name; // 类名 (可选)
        public bool? force_user_system_chooser; // 是否强制使用系统选择器 (可选)
        public int? border_size; // 边框大小 (可选)
    }

    public class RXShareConfig : DataBean
    {
        public string func; // 功能名称
        public string region; // 区域 (可选)
        public string platform; // 平台
        public string transmits; // 传输方式 (可选)
        public string protocol_android; // Android 协议
        public string protocol_ios; // iOS 协议
        public string use_scheme; // 自定义 Scheme (可选)
        public bool use_short_url;

        //使用自动分享上报时可以写入自定义数据，手动上报时该属性不生效
        public Dictionary<string, object> properties;
        public Dictionary<string, object> custom_ext; // 自定义扩展字段 (可选)
    }
    public class Trigger
    {
        public int id;
        public string tag;
        public string title;
        public string failed_msg;
        public int type;
        public int time_interval;
    }

    // Strategy 信息
    public class Strategy
    {
        public int id;
        public string platform;
        public int share_type;
        public int type;
        public string name;
        public string region;
        public string product_id;
        public string channel_id;
        public int status;
    }

    // Content 信息
    public class Content : ShareParams
    {
        public int material_id;
        public int landing_id; // 落地页ID，主要用于大数据上报
        public int meta_source; // 1 使用瑞雪后台配置，2 落地页需为动态页，客户端传参
    }


    // 根对象
    public class ShareData
    {
        public Trigger trigger;
        public Strategy strategy;
        public Content content;
        public SharePlatforms platforms;
        public string platform;
        public string identity;
        public string browser_language;
        public Dictionary<string, object> ad_content;
    }

    public interface IShare
    {
        void GetShareData(Dictionary<string, object> keyValuePairs, RXCallback<ShareData> callback);

        /// <summary>
        /// 进行分享操作。
        /// </summary>
        /// <param name="rXShareConfig">分享配置参数，包含分享内容和相关设置。</param>
        /// <param name="callback">分享操作的回调函数，返回分享结果。</param>
        void Share(RXShareConfig rXShareConfig, RXCallback<object> callback);

        /// <summary>
        /// 注册“碰一碰分享”的事件监听器。
        /// </summary>
        /// <param name="callback">
        /// 回调函数，当用户触发“碰一碰分享”时调用，传递分享事件标识或数据。
        /// </param>
        void OnKnockShare(Action<string> callback);

        /// <summary>
        /// 取消“碰一碰分享”的事件监听器。
        /// </summary>
        /// 
        void OffKnockShare();
    }

    class ShareAPI : Singleton<ShareAPI>, IShare
    {
        private Dictionary<string, object> GetDefaultParams()
        {
            var defaultParams = new Dictionary<string, object>
            {
                { "type", "app" },
                { "product_id", SDKConfig.Instance.ProductId },
                { "channel_id", SDKConfig.Instance.ChannelId },
                { "open_id", PassportManager.Instance.OpenId },
                { "sub_channel_id", PassportManager.Instance.CurrentLoginData?.sub_channel_id }
            };

            return defaultParams;
        }
        private RXCallback<ShareData> HandleShareData(Dictionary<string, object> parameters, RXCallback<ShareData> callback)
        {
            return (result, err) =>
            {
                var shareData = result.data;
                if (shareData?.content?.url != null)
                {
                    try
                    {
                        string url = shareData.content?.url;

                        if (parameters.TryGetValue("protocol_android", out var protocolAndroid))
                        {
                            url += $"&protocol_android={Uri.EscapeDataString(protocolAndroid.ToString())}";
                        }

                        if (parameters.TryGetValue("protocol_ios", out var protocolIos))
                        {
                            url += $"&protocol_ios={Uri.EscapeDataString(protocolIos.ToString())}";
                        }

                        if (parameters.TryGetValue("use_scheme", out var useScheme))
                        {
                            url += $"&use_scheme={useScheme}";
                        }

                        url += $"&api={Uri.EscapeDataString(SDKConfig.Instance.FirstBaseUrl)}";
                        shareData.content.url = url;

                        result.data = shareData;
                    }
                    catch (Exception e)
                    {
                        var code = (int)RXErrorCode.ShareParamsError;
                        var msg = e?.Message ?? "Unknown error";
                        Log.E("An error occurred : " + e?.ToString());
                        RXUtility.InvokeCallback(callback, code, shareData, msg);
                        return;
                    }
                }
                callback?.Invoke(result, err);
            };

        }

        public void GetShareData(Dictionary<string, object> keyValuePairs, RXCallback<ShareData> callback)
        {
            keyValuePairs ??= new();

            RXUtility.MergeDictionary(this.GetDefaultParams(), ref keyValuePairs, false);
            RXWebRequest rXWebRequest = RXWebRequest.Create(APIPath.GET_DATA);
            rXWebRequest.SetPostData(keyValuePairs);
            rXWebRequest.PostAsync(RuiXueSdk.Instance, HandleShareData(keyValuePairs, callback));
        }

        public void OffKnockShare()
        {
#if UNITY_OPENHARMONY
            HMSAPI.OffKnockShare();
#endif
        }

        public void OnKnockShare(Action<string> callback)
        {
#if UNITY_OPENHARMONY
            HMSAPI.OnKnockShare("", callback);
#endif
        }


        public void Share(RXShareConfig rXShareConfig, RXCallback<object> callback)
        {
#if UNITY_OPENHARMONY
            HMSAPI.Share(rXShareConfig.ToJson(), RXUtility.ToActionCallback(callback));
#endif
        }
    }
}