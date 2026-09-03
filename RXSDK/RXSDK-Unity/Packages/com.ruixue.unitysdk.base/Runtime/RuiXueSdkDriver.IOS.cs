using System.Collections.Generic;

namespace RuiXue
{
    public delegate void IOSCallBackCommonDelegate(string func, string data);
    
    public struct IOSCallBackWrapper
    {
        public RequestResponseDelegate onResponse;
        public RequestErrorDelegate onError;
    }
    
    public partial class RuiXueSdkDriver
    {
        private Dictionary<string, IOSCallBackWrapper> _mapIOSCallBacks = new (); 
        
        public static void RegisterIOSCallBack(string func, IOSCallBackWrapper wrapper)
        {
            Instance._mapIOSCallBacks[func] = wrapper;
        }
        
        [AOT.MonoPInvokeCallback(typeof(IOSCallBackCommonDelegate))]
        public static void  IOSCallBackOnResponse(string func, string data)
        {
            if(Instance._mapIOSCallBacks.TryGetValue(func, out var callBack))
            {
                callBack.onResponse?.Invoke(data);
            }
        }
        
        [AOT.MonoPInvokeCallback(typeof(IOSCallBackCommonDelegate))]
        public static void  IOSCallBackOnError(string func, string data)
        {
            if(Instance._mapIOSCallBacks.TryGetValue(func, out var callBack))
            {
                callBack.onError?.Invoke(data);
            }
        }
    }
}