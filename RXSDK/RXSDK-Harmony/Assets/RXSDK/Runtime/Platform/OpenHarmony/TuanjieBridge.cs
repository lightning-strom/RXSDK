using System;
using UnityEngine;

namespace RXSDK.Platform.OpenHarmony
{

    class TuanjieBridge : OpenHarmonyClass
    {
        private static TuanjieBridge _instance;
        private static readonly object _lock = new();
        public static TuanjieBridge Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (_lock)
                    {
                        _instance ??= new TuanjieBridge();
                    }
                }
                return _instance;
            }
        }

        public override string ClassName => "TuanjieBridge";
        public override OpenHarmonyJSObject GetObject(OpenHarmonyJSClass jsClass)
        {
            return jsClass.CallStatic<OpenHarmonyJSObject>("getInstance");
        }

        public string TestFunc(string str, Action<RXResult<object>> callback)
        {
            return Call<string>(nameof(TestFunc), str, GetHarmonyCallback(callback));

        }

    }

}
