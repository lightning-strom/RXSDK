using System;
using System.Collections;
using System.Collections.Generic;
using RXSDK.Data;
using UnityEngine;
using UnityEngine.Networking;

namespace RXSDK
{
    public interface IRXRequest
    {
        public string Url { get; }
        public bool NeedLogin { get; set; }
        public string Data { get; }
        public IRXRequest SetQueryParams(IDictionary<string, object> queryParams);
        public IRXRequest SetPostData(object jsonObj);
        public IRXRequest SetPostData(DataBean jsonObj);

        public int Timeout { get; set; }
        public IDictionary<string, string> Headers { get; set; }
        public bool Compress { get; set; }
        public int DelaySeconds { get; set; }
        public Coroutine CurCoroutine { get; }
        public void RequestAsync<T>(MonoBehaviour mono, RXCallback<T> callback, string method = null, IDictionary<string, object> data = null);
        public void PostAsync<T>(MonoBehaviour mono, RXCallback<T> callback);
        public void GetAsync<T>(MonoBehaviour mono, RXCallback<T> callback, IDictionary<string, object> queryParams = null);

    }
}