using System;
using Newtonsoft.Json;
using UnityEngine;

namespace RXSDK.Platform.OpenHarmony
{
    abstract class OpenHarmonyClass
    {
        private readonly OpenHarmonyJSClass _jsClass;
        private readonly OpenHarmonyJSObject _jsObject;
        protected readonly int _timeOutMs = 10000;

        public abstract string ClassName { get; }
        public abstract OpenHarmonyJSObject GetObject(OpenHarmonyJSClass jsClass);

        protected OpenHarmonyClass()
        {
            _jsClass = new OpenHarmonyJSClass(ClassName);
            _jsObject = GetObject(_jsClass);
        }

        public ReturnType Call<ReturnType>(string methodName, params object[] args)
        {
            return _jsObject.Call<ReturnType>(methodName, args);
        }

        public void Call(string methodName, params object[] args)
        {
            if (methodName == null)
            {
                throw new ArgumentNullException(nameof(methodName));
            }
            _jsObject.Call(methodName, args);
        }


        public void Invoke<T>(string methodName, string args = null, Action<RXResult<T>> callback = null, int timeoutMs = 10000, string modulePath = null)
        {
            _jsObject.Call(System.Reflection.MethodBase.GetCurrentMethod().Name, methodName, args, GetHarmonyCallback(callback), timeoutMs, modulePath);
        }

        protected string GetCallerMethodName()
        {
            try
            {
                System.Diagnostics.StackTrace stackTrace = new(1, false);
                System.Diagnostics.StackFrame stackFrame = stackTrace.GetFrame(1);
                if (stackFrame != null && stackFrame.GetMethod() != null)
                {
                    string name = stackFrame.GetMethod().Name;
                    UnityEngine.Debug.Log($"Caller Method Name: {name}");
                    return name;
                }
                return null;
            }
            catch
            {
                return null;
            }
        }
        protected OpenHarmonyJSCallback GetHarmonyCallback<T>(Action<RXResult<T>> callback)
        {
            if (callback == null)
            {
                return null;
            }
            return new OpenHarmonyJSCallback(args =>
            {
                try
                {
                    for (int i = 0; i < args.Length; i++)
                    {
                        var t = args[i].GetType();

                        UnityEngine.Debug.Log($"args[{i}] type: {t.Name} value: {args[i].As<string>()}");

                    }
                    if (args == null || args.Length == 0)
                    {
                        callback?.Invoke(RXUtility.GetRXResult<T>(new Exception("args is empty")));
                        return "error: args is empty";
                    }
                    else
                    {
                        var result = JsonConvert.DeserializeObject<RXResult<T>>(args[0].As<string>());
                        callback?.Invoke(result);
                    }
                    return null;
                }
                catch (Exception ex)
                {
                    UnityEngine.Debug.LogError($"OpenHarmonyCallback error: {ex.Message}");
                    callback?.Invoke(RXUtility.GetRXResult<T>(ex));
                    return ex.Message;
                }
            });
        }
    }
}