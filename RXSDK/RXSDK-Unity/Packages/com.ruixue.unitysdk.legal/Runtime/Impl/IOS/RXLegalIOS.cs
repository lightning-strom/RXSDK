using System.Runtime.InteropServices;
#if UNITY_IOS
namespace RuiXue.Legal.Impl
{
    internal class RXLegalIOS: IRXLegal
    {
        public void Legal(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("getLegalInfo", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            getLegalInfo(RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }
        
        // 获取法务配置信息
        [DllImport("__Internal")]
        private static extern void  getLegalInfo(IOSCallBackCommonDelegate onSuccess, IOSCallBackCommonDelegate onError);
    }
}
#endif