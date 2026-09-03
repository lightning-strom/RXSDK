using System;

namespace RXSDK
{

    public class RXResult<T> : Data.DataBean
    {
        public int code = -1;
        public object thirdcode;
        public string thirdmsg;
        public string msg = string.Empty;
        public string message = string.Empty;
        public string trace_id = string.Empty;
        public string type;

        public T data;

        public int Code { get { return code; } protected set { code = value; } }
        public string Msg { get { return msg ?? message; } protected set { msg = value; } }
        public T Data { get { return data; } protected set { data = value; } }
        public bool IsSuccess => ((RXErrorCode)code) == RXErrorCode.Success;

        // 构造函数
        public RXResult() { }

        public static RXResult<T> CreateSuccess(T data)
        {
            return new RXResult<T> { code = (int)RXErrorCode.Success, data = data };
        }

        public static RXResult<T> CreateError(int code, string msg)
        {
            return new RXResult<T> { code = code, msg = msg };
        }
    }

    public delegate void RXCallback<T1>(RXResult<T1> arg1, Exception exception = null);

    public abstract class Singleton<T> where T : class, new()
    {
        private static readonly object _lock = new();
        private static T _instance;

        public static T Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (_lock)
                    {
                        _instance ??= new T();
                    }
                }
                return _instance;
            }
        }


        public static void DestroyInstance()
        {
            lock (_lock)
            {
                if (_instance is IDisposable disposable)
                {
                    disposable.Dispose();
                }
                _instance = null;
            }
        }


        protected Singleton() { }
    }


    public interface IDisposableSingleton : IDisposable
    {
        void OnDestroy();
    }

}