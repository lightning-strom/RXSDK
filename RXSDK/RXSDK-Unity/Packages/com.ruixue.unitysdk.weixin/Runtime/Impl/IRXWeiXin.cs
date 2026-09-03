using System.Collections.Generic;

namespace RuiXue.WeiXin.Impl
{
    internal interface IRXWeiXin
    {
        /// <summary>
        /// 是否安装有微信
        /// </summary>
        /// <returns></returns>
        public bool IsWXAppInstalled();

        /// <summary>
        /// 打开微信
        /// </summary>
        /// <returns></returns>
        public bool OpenWXApp();

        /// <summary>
        /// 打开小程序
        /// </summary>
        /// <param name="hashMap"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        /// <returns></returns>
        public bool OpenMiniProgram(Dictionary<string, object> hashMap, 
            RequestResponseDelegate onResponse,RequestErrorDelegate onError);
    }
}
