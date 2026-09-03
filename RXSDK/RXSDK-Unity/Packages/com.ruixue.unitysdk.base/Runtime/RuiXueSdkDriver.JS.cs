using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue
{
    public partial class RuiXueSdkDriver
    {
        private Dictionary<string, Action<string,string>> _mapJsCallBackHandler = new (); 
        public static void RegisterJsCallBack(string api, Action<string, string> handler)
        {
            Instance._mapJsCallBackHandler[api] = handler;
        }
        
        public void OnJsCallBack(string data)
        {
            JsonData jsonData = JsonMapper.ToObject(data);
            var api = (string)jsonData["func"];
            if (_mapJsCallBackHandler.TryGetValue(api, out var handler))
            {
                string dataJson = string.Empty;
                if (jsonData.ContainsKey("data"))
                {
                    dataJson = jsonData["data"].ToJson();
                }
                
                //dataJson = Regex.Unescape(dataJson);
                handler.Invoke(api, dataJson);
            }
        } 
    }
}