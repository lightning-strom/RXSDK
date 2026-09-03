using System.Collections.Generic;

namespace RuiXue.Help.Impl
{
    public interface IRXHelp
    {
        /// <summary>
        /// 展示帮助中心
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        public void HelperCenterUI(Dictionary<string, object> dic, 
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate);

        /// <summary>
        /// 客服会话
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        public void ChatServiceUI(Dictionary<string, object> dic, 
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate);

        /// <summary>
        /// 关闭UI
        /// </summary>
        public void CloseLoginUI();
    }
}
