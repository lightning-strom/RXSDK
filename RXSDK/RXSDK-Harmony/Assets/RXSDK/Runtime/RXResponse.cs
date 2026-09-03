

using System;

namespace RXSDK
{
    public interface IRXResponse<T>
    {
        void OnResopnse(int code, T data, string msg = "");
        void OnError(Exception data);
    }
}