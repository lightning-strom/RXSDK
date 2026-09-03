using System.Collections.Generic;
using RuiXue.Help.Impl;

namespace RuiXue.Help
{
    public class RXHelp
    {
#if UNITY_ANDROID
        private static readonly IRXHelp _sdk = new RXHelpAndroid();
#elif UNITY_IOS
        private static readonly IRXHelp _sdk = new RXHelpIOS();
#else
        private static readonly IRXHelp _sdk = new RXHelpNotSupport();
#endif
        /// <summary>
        /// 展示帮助中心
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        public static void HelperCenterUI(Dictionary<string, object> dic,
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sdk.HelperCenterUI(dic, responseDelegate, errorDelegate);
        }

        /// <summary>
        /// 客服会话
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        public static void ChatServiceUI(Dictionary<string, object> dic,
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sdk.ChatServiceUI(dic, responseDelegate, errorDelegate);
        }

        /// <summary>
        /// 关闭UI
        /// </summary>
        public static void CloseLoginUI()
        {
            _sdk.CloseLoginUI();
        }

    }
}
