using System;
using System.Collections.Generic;
using RuiXueLitJson;

namespace RuiXue.LoginUI
{
    [Serializable]
    public class UserCenterUIConfig
    {
        /// <summary>
        ///     用户的游戏id
        /// </summary>
        public int game_user_id;

        /// <summary>
        ///     用户头像
        /// </summary>
        public string head_img_url;

        /// <summary>
        ///     用户昵称
        /// </summary>
        public string nickname;

        /// <summary>
        ///     在瑞雪客服系统设置的接入点名称 不填写默认为default
        /// </summary>
        public string queue_name="default";

        /// <summary>
        ///     账号注销透传数据，使用jsonString形式
        /// </summary>
        public string transmit_args;

        /// <summary>
        ///     按钮配置
        /// </summary>
        public Dictionary<string, string[]> setConfigParams;

        /// <summary>
        ///     WebView关闭回调
        /// </summary>
        public WebViewCloseDelegate webViewOnCloseDeletage;

        public UserCenterUIConfig()
        {
            JsonMapper.RegisterExporter<UserCenterUIConfig>((obj, writer) => {
       
                writer.WriteObjectStart();
                writer.WritePropertyName("game_user_id");
                writer.Write(obj.game_user_id);
                writer.WritePropertyName("head_img_url");
                writer.Write(obj.head_img_url);
                writer.WritePropertyName("nickname");
                writer.Write(obj.nickname);
                writer.WritePropertyName("queue_name");
                writer.Write(obj.queue_name);
                writer.WritePropertyName("transmit_args");
                writer.Write(obj.transmit_args);
                writer.WritePropertyName("setConfigParams");
                JsonMapper.ToJson(obj.setConfigParams, writer);
                writer.WriteObjectEnd();
            });
        }
    }
}