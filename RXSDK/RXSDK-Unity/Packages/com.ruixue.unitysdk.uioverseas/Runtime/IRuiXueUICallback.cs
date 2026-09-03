using System.Collections.Generic;

namespace RuiXue.LoginUIOverSeas
{
    public interface IRuiXueUICallback
    {
        /// <summary>
        ///     点击按钮时回调，用于在发送请求时候可以添加cp自定义参数传给服务器。
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        public Dictionary<string, object> OnClickHandle(Dictionary<string, object> param);

        /// <summary>
        ///     成功
        /// </summary>
        /// <param name="data"></param>
        public void OnSuccess(string data);

        /// <summary>
        ///     失败
        /// </summary>
        /// <param name="cause"></param>
        public void OnFailed(string cause);
    }
}