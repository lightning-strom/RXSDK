
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Newtonsoft.Json;
using RXSDK.Data;
using UnityEngine;
using UnityEngine.Networking;

namespace RXSDK.Net
{
    class RXWebRequest : IRXRequest
    {
        public static readonly string RUIXUE_ENCIPHER = "ruixue-encipher";
        public static readonly string TEXT_PLAIN = "text/plain";
        public static readonly string CONTENT_TYPE_JSON = "application/json; charset=UTF-8";
        public static readonly string CONTENT_TYPE = "Content-Type";
        public static readonly HashSet<int> RetryCodes = new()
        {
            305503,
            302015,
            302016
        };
        public string Url { get; private set; }

        RXWebRequest(string url, int encipher, bool withRXHeader)
        {
            Url = url;
            NeedLogin = APIPath.NeedVerifyToken(Url);
            Encipher = encipher == -1 ? SDKConfig.Instance.Encipher : encipher;
            if (withRXHeader)
            {
                Headers = GetHeader();
            }

        }
        public static RXWebRequest Create(string url, int encipher = -1, bool withRXHeader = true)
        {
            return new RXWebRequest(url, encipher, withRXHeader);
        }

        public bool NeedLogin { get; set; }
        public string Data { get; private set; }

        public string Method { get; set; }

        public IRXRequest SetNeedLogin(bool needLogin)
        {
            NeedLogin = needLogin;
            return this;
        }
        public IRXRequest SetQueryParams(IDictionary<string, object> queryParams)
        {
            Data = RXUtility.BuildQueryString(queryParams);
            return this;
        }

        public IRXRequest SetPostData(object jsonObj)
        {
            Data = RXUtility.ObjectToJson(jsonObj);
            return this;
        }
        public IRXRequest SetPostData(DataBean jsonObj)
        {
            Data = jsonObj?.ToJson();
            return this;
        }

        public int Timeout { get; set; } = 30;
        public IDictionary<string, string> Headers { get; set; }


        public IDictionary<string, string> GetHeader()
        {
            SDKConfig config = SDKConfig.Instance;
            Dictionary<string, string> dic = new()
            {
                // {"Connection", "Keep-Alive"},
                {"Charset", "UTF-8"},
                {"accept", "application/json"},
                {"ruixue-language", config.Language},
                { "ruixue-tzoffset",TimeUtility.GetLocalTimeOffsetString()},
                { "ruixue-traceid", DeviceUtility.GetNewUUID()},
                { "ruixue-cpid", config.CpId},
                { "ruixue-productid", config.ProductId},
                { "ruixue-channelid", config.ChannelId},
                { "ruixue-platformid", DeviceUtility.GetPlatformID().ToString()},
                { "ruixue-version",config.SDK_VERSION},
                {"Content-Type", Encipher==1? TEXT_PLAIN : CONTENT_TYPE_JSON},
                { RUIXUE_ENCIPHER, Encipher.ToString()},
                { "ruixue-devicecode", DeviceUtility.GetDeviceCode()}
            };
            var regionTag = config.RegionTag;
            if (!string.IsNullOrEmpty(regionTag))
            {
                dic["ruixue-region"] = regionTag;
            }

            if (!string.IsNullOrEmpty(config.CpRoleId))
            {
                dic["ruixue-cp-role-id"] = config.CpRoleId;
            }
            return dic;
        }

        public bool Compress { get; set; }

        public int DelaySeconds { get; set; }
        public Coroutine CurCoroutine { get; private set; }
        public MonoBehaviour Mono { get; set; }

        public int Encipher { get; private set; }

        public void PostAsync<T>(RXCallback<T> callback)
        {
            RequestAsync(CoroutineRunner.Instance, callback, UnityWebRequest.kHttpVerbPOST);
        }

        public void GetAsync<T>(RXCallback<T> callback, IDictionary<string, object> queryParams = null)
        {
            RequestAsync(CoroutineRunner.Instance, callback, UnityWebRequest.kHttpVerbGET, queryParams);
        }

        public void PostAsync<T>(MonoBehaviour mono, RXCallback<T> callback)
        {
            RequestAsync(mono, callback, UnityWebRequest.kHttpVerbPOST);
        }

        public void GetAsync<T>(MonoBehaviour mono, RXCallback<T> callback, IDictionary<string, object> queryParams = null)
        {
            RequestAsync(mono, callback, UnityWebRequest.kHttpVerbGET, queryParams);
        }

        public void RequestAsync<T>(MonoBehaviour mono, RXCallback<T> callback, string method = null, IDictionary<string, object> data = null)
        {
            method ??= Method;
            if (data != null)
            {
                if (method != null && method.Equals("POST"))
                {
                    SetPostData(data);
                }
                else
                {
                    SetQueryParams(data);
                }
            }
            DoRequestAsync(mono, ToActionCallback(callback), method);
        }

        private void SetNoEncipher()
        {
            Headers[RUIXUE_ENCIPHER] = "0";
            Headers[CONTENT_TYPE] = CONTENT_TYPE_JSON;
        }
        private RXWebRequest DoRequestAsync<T>(MonoBehaviour mono, Action<RXResult<T>, Exception> callback, string method)
        {
            Mono = mono != null ? mono : CoroutineRunner.Instance;
            CheckNull(mono, nameof(mono));
            CurCoroutine = mono.StartCoroutine(Request(callback, method));
            return this;
        }

        private void CheckNull(object obj, string name)
        {
            if (obj is null)
            {
                throw new ArgumentNullException(name + " params cannot be null");
            }
        }


        private Action<RXResult<T>, Exception> ToActionCallback<T>(RXCallback<T> callback)
        {
            return (resp, err) =>
            {
                callback?.Invoke(resp, err);
            };
        }

        public IEnumerator Request<T>(Action<RXResult<T>, Exception> callback, string method = null)
        {
            return SendRequest(method ?? Method, Url, (www) =>
            {
                try
                {
                    CheckNull(www, nameof(www));
                    if (www.result == UnityWebRequest.Result.Success)
                    {
                        try
                        {
                            var result = Decode(www.downloadHandler.text, www.GetResponseHeader(RUIXUE_ENCIPHER));
                            Log.D("result:" + result);
                            var jsonData = JsonConvert.DeserializeObject<RXResult<T>>(result);
                            if (RetryCodes.Contains(jsonData.Code) && IsEncipher(Headers))
                            {
                                SetNoEncipher();
                                Log.D("retry the no encipher request:" + Url);
                                DoRequestAsync(Mono, callback, method);
                                return;
                            }
                            if (Headers?.TryGetValue("ruixue-traceid", out string traceId) == true)
                            {
                                jsonData.trace_id = traceId;
                            }
                            callback?.Invoke(jsonData, null);
                        }
                        catch (RXException ex)
                        {
                            if (ex.Code == RXErrorCode.DecodeError)
                            {
                                DoRequestAsync(Mono, callback, method);
                            }
                            else
                            {
                                Log.Exception(ex);
                                callback?.Invoke(new RXResult<T> { code = -2, msg = ex.Message }, ex);
                            }
                        }
                        return;
                    }

                    // 处理请求失败情况
                    var errorResult = new RXResult<T>
                    {
                        code = (int)(www.responseCode == 0 ? -1 : www.responseCode),
                        msg = www.error
                    };
                    callback?.Invoke(errorResult, null);
                }
                catch (Exception e)
                {
                    callback?.Invoke(new RXResult<T>
                    {
                        code = -2,
                        msg = e.Message
                    }, e);
                    Log.Exception(e);
                }
            });
        }



        public List<string> GetUrls(string urlOrPath)
        {
            List<string> u = new();
            if (string.IsNullOrEmpty(urlOrPath))
            {
                throw new ArgumentNullException(nameof(urlOrPath), "urlOrPath cannot be null");
            }
            if (!urlOrPath.StartsWith("http"))
            {
                List<string> urls = SDKConfig.Instance.BaseUrls;
                foreach (string url in urls)
                {
                    u.Add(UrlUtility.Join(url, urlOrPath));
                }
            }
            else
            {
                u.Add(urlOrPath);
            }
            return u;
        }


        public IEnumerator SendRequest(string method, string urlOrPath, Action<UnityWebRequest> callback)
        {

            return SendRequest(method, urlOrPath, Headers, Data, callback, NeedLogin);
        }


        public IEnumerator SendRequest(string method, string urlOrPath, IDictionary<string, string> headerDic, string data, Action<UnityWebRequest> callback, bool needLogin)
        {
            if (string.IsNullOrEmpty(urlOrPath))
            {
                throw new ArgumentNullException(nameof(urlOrPath), "urlOrPath cannot be null");
            }
            if (DelaySeconds > 0)
            {
                yield return new WaitForSeconds(DelaySeconds);
            }
            int cusor = 0;
            if (needLogin)
            {
                if (PassportManager.Instance.IsTokenExpired)
                {
                    var it = GetUrls(APIPath.REFRESH_TOKEN).GetEnumerator();
                    it.MoveNext();
                    while (true)
                    {
                        string url = it.Current;
                        IDictionary<string, string> header = GetHeader();
                        header["ruixue-refreshtoken"] = PassportManager.Instance.CurrentLoginData.token.refresh;
                        using UnityWebRequest uwr = CreateRequest(method, url, header, data);
                        yield return uwr.SendWebRequest();
                        if (uwr.responseCode == 200 || !it.MoveNext())
                        {
                            switch (uwr.result)
                            {
                                case UnityWebRequest.Result.Success:
                                    var result = uwr.downloadHandler.text;
                                    Log.D("refresh token:" + result);
                                    var jsonData = JsonConvert.DeserializeObject<RXResult<AccessToken>>(result);
                                    if (jsonData == null || jsonData.code != 0)
                                    {
                                        callback?.Invoke(uwr);
                                        yield break;
                                    }
                                    else
                                    {
                                        PassportManager.Instance.CurrentLoginData.token = jsonData.Data?.ConvertToLocal();
                                        headerDic["ruixue-accesstoken"] = jsonData.Data?.access;
                                        break;
                                    }
                                case UnityWebRequest.Result.ConnectionError:
                                case UnityWebRequest.Result.DataProcessingError:
                                case UnityWebRequest.Result.ProtocolError:
                                default:
                                    callback?.Invoke(uwr);
                                    yield break;
                            }
                            SDKConfig.Instance.MoveDomainToFirst(cusor);
                            break;
                        }
                        ++cusor;
                    }
                }
                else
                {
                    headerDic["ruixue-accesstoken"] = PassportManager.Instance.CurrentAccessToken;
                }
            }
            cusor = 0;
            var iter = GetUrls(urlOrPath).GetEnumerator();
            iter.MoveNext();
            while (true)
            {
                string url = iter.Current;
                using UnityWebRequest uwr = CreateRequest(method, url, headerDic, data);
                yield return uwr.SendWebRequest();
                if (uwr.responseCode == 200 || !iter.MoveNext())
                {
                    callback?.Invoke(uwr);
                    SDKConfig.Instance.MoveDomainToFirst(cusor);
                    break;
                }
                ++cusor;
            }
        }



        private UnityWebRequest CreateRequest(string method, string url, IDictionary<string, string> headerDic, string data)
        {
            CheckNull(method, nameof(method));
            if (!url.StartsWith("http"))
            {
                throw new ArgumentException(nameof(url), "url must be a valid HTTP or HTTPS URL");
            }

            UnityWebRequest uwr;
            if (method.Equals(UnityWebRequest.kHttpVerbGET))
            {
                if (data != null && data.Length > 0)
                {
                    url += url.Contains("?") ? "&" : "?";
                    url += data;
                }
                uwr = UnityWebRequest.Get(url);
            }
            else
            {
                uwr = new UnityWebRequest(url, method)
                {
                    downloadHandler = new DownloadHandlerBuffer()
                };
                if (!string.IsNullOrEmpty(data))
                {
                    try
                    {
                        var encData = Endode(data, headerDic);
                        uwr.uploadHandler = new UploadHandlerRaw(encData);
                        data = Encoding.UTF8.GetString(encData);
                    }
                    catch (Exception ex)
                    {
                        Log.D($"Failed to encode data for request: {ex.Message}");
                        return null;
                    }
                }
            }
            if (Compress)
            {
                headerDic ??= new Dictionary<string, string>();
                headerDic["content-encoding"] = "gzip";
            }
            SetRequestHeader(uwr, headerDic);
            uwr.timeout = Timeout;
            RXUtility.LogRequest(url, headerDic, method.Equals(UnityWebRequest.kHttpVerbGET) ? null : data);

            return uwr;
        }

        private void SetRequestHeader(UnityWebRequest uwr, IDictionary<string, string> headerDic)
        {
            if (headerDic != null && headerDic.Count > 0)
            {
                foreach (var header in headerDic)
                {
                    if (!string.IsNullOrEmpty(header.Key) && !string.IsNullOrEmpty(header.Value))
                    {
                        uwr.SetRequestHeader(header.Key, header.Value);
                    }
                }
            }
        }


        private string Decode(string respData, string encipher)
        {
            if ("1".Equals(encipher) && !string.IsNullOrEmpty(respData))
            {
                var jsonData = JsonConvert.DeserializeObject<RXResult<object>>(respData);
                if (jsonData.Code == 0 && jsonData.Data != null)
                {
                    var decData = CryptoUtility.AesCbcDecrypt(jsonData.Data.ToString());
                    if (!string.IsNullOrEmpty(decData))
                    {
                        jsonData.data = JsonConvert.DeserializeObject(decData);
                    }
                    else
                    {
                        throw new RXException("Decryption failed", RXErrorCode.DecodeError);
                    }
                }
                return jsonData.ToJson();
            }
            else
            {
                return respData;
            }
        }
        private bool IsEncipher(IDictionary<string, string> headerDic)
        {
            bool shouldEncrypt = false;

            if (headerDic != null && headerDic.ContainsKey(RUIXUE_ENCIPHER) && headerDic[RUIXUE_ENCIPHER] == "1")
            {
                shouldEncrypt = true;
            }
            return shouldEncrypt;
        }

        private byte[] Endode(string postData, IDictionary<string, string> headerDic)
        {
            if (!string.IsNullOrEmpty(postData))
            {
                byte[] postBytes = Compress ? GZipCompress.Compress(postData) : Encoding.UTF8.GetBytes(postData);

                if (IsEncipher(headerDic))
                {
                    var encData = CryptoUtility.AesCbcEncrypt(postBytes);
                    if (encData == null || encData.Length == 0)
                    {
                        SetNoEncipher();
                    }
                    else
                    {
                        postBytes = encData;
                    }
                }

                return postBytes;
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// 供业务层使用的默认协程宿主，解耦对 RuiXueSdk.Instance 的依赖。
        /// </summary>
        public static MonoBehaviour DefaultCoroutineHost => CoroutineRunner.Instance;

    internal class CoroutineRunner : MonoBehaviour
    {
        private static CoroutineRunner _instance;

        public static CoroutineRunner Instance
        {
            get
            {
                if (_instance == null)
                {
                    GameObject runnerObject = new("CoroutineRunner");
                    _instance = runnerObject.AddComponent<CoroutineRunner>();
                    UnityEngine.Object.DontDestroyOnLoad(runnerObject);
                }
                return _instance;
            }
        }

        public static Coroutine RunCoroutine(IEnumerator coroutine)
        {
            return Instance.StartCoroutine(coroutine);
        }
    }
    }
}