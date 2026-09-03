using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading;
using Newtonsoft.Json;
using RXSDK.Data;
using UnityEngine;

namespace RXSDK
{

    public class RXUtility
    {

        public static void InvokeCallback<T>(RXCallback<T> callback, int code, T data = default, string msg = null)
        {
            callback?.Invoke(new RXResult<T> { code = code, data = data, msg = msg });
        }

        public static void InvokeCallback<T>(RXCallback<T> callback, RXResult<T> ret, Exception e)
        {
            callback?.Invoke(ret ?? GetRXResult<T>(e), e);
        }

        public static void InvokeErrorCallback<T>(RXCallback<T> callback, Exception e)
        {
            callback?.Invoke(GetRXResult<T>(e), e);
        }


        public static Action<string> ToActionCallback<T>(RXCallback<T> callback)
        {
            return (json) =>
            {
                try
                {
                    RXResult<T> ret = JsonToObject<RXResult<T>>(json);
                    callback?.Invoke(ret);
                }
                catch (Exception e)
                {
                    InvokeCallback(callback, null, e);
                }
            };
        }

        public static RXCallback<T> ToRXCallback<T>(Action<int, T, string> callback)
        {
            return (ret, e) =>
            {
                string message = !string.IsNullOrEmpty(ret.msg) ? ret.msg : e?.Message;
                callback?.Invoke(ret.code, ret.data, message);
            };
        }
        public static RXResult<T> GetRXResult<T>(Exception e, int code = -1, string msg = null)
        {
            return new RXResult<T>
            {
                code = code, // 使用-1表示通用错误代码，可以根据需要调整
                msg = msg ?? e.Message, // 从 Exception 提取错误消息
                thirdcode = null, // 可选字段，根据需求设置
                thirdmsg = null, // 可选字段，根据需求设置
                data = default // 默认值为 null
            };
        }
        public static void AddValueIfNotNull(Dictionary<string, object> dict, string key, object value)
        {
            if (value != null)
            {
                dict[key] = value;
            }
        }
        public static string ObjectToJson(object obj)
        {
            if (obj == null) return null;
            return JsonConvert.SerializeObject(obj, Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
        }

        public static T JsonToObject<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json);
        }
        public static object JsonToObject(string json)
        {
            return JsonConvert.DeserializeObject(json);
        }

        public static Dictionary<string, object> JsonToDictionary(string json)
        {
            return JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
        }

        public static void LogRequest(string url, IDictionary<string, string> headerDic, string data)
        {
            string d = "";
            if (!string.IsNullOrEmpty(data))
            {
                if (headerDic != null && headerDic.TryGetValue("content-encoding", out string encoding) && encoding == "gzip")
                {
                    d = $" --data-binary @<(echo '{Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(data))}' | base64 --decode)";
                }
                else
                {
                    d = " -d '" + data + "'";
                }
            }
            Log.D(url + ConverToHeaderStr(headerDic) + d);
        }
        public static string ConverToHeaderStr(IDictionary<string, string> headers)
        {
            if (headers == null || headers.Count == 0)
            {
                return string.Empty;
            }

            var headerLines = headers.Select(kvp => $" -H \"{kvp.Key}: {kvp.Value}\"");
            return string.Join(" ", headerLines);
        }

        /// <summary>
        /// 字典类型转化为对象
        /// </summary>
        /// <param name="dic"></param>
        /// <returns></returns>
        public T DicToObject<T>(Dictionary<string, object> dic) where T : new()
        {
            var md = new T();
            CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
            TextInfo textInfo = cultureInfo.TextInfo;
            foreach (var d in dic)
            {
                var filed = textInfo.ToTitleCase(d.Key);
                try
                {
                    var value = d.Value;
                    md.GetType().GetProperty(filed).SetValue(md, value);
                }
                catch
                {

                }
            }
            return md;
        }

        public static string BuildQueryString(IDictionary<string, object> queryParams)
        {
            return UrlUtility.BuildQueryString(queryParams);
        }
        public static Dictionary<string, object> ConvertToDictionary(LoginArgs obj)
        {
            if (obj == null)
            {
                throw new ArgumentNullException(nameof(obj), "Object cannot be null.");
            }

            // var dictionary = new Dictionary<string, object>();
            // var properties = obj.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);

            // foreach (var property in properties)
            // {
            //     var value = property.GetValue(obj);
            //     dictionary.Add(property.Name, value);
            // }
            // return dictionary;

            var d = obj.GetType().GetProperties()//这一步获取匿名类的公共属性，返回一个数组
            //   .OrderBy(q => q.Name)//这一步排序，需要引入System.Linq，当然可以省略
              .Where(q => q.Name != null)
              .ToDictionary(q => q.Name, q => q.GetValue(obj));//这一步将数组转换为字典
            return d;
            // var d = obj.GetType().GetProperties()
            //                 .ToDictionary(q => q.Name, q => q.GetValue(obj));
            // return d;

        }
        public static T ConvertDic<T>(Dictionary<string, object> dic)
        {
            T model = Activator.CreateInstance<T>();
            PropertyInfo[] modelPro = model.GetType().GetProperties();
            if (modelPro.Length > 0 && dic.Count() > 0)
            {
                for (int i = 0; i < modelPro.Length; i++)
                {
                    PropertyInfo proInfo = modelPro[i];
                    if (dic.ContainsKey(proInfo.Name))
                    {
                        object value = dic[proInfo.Name];
                        if (!proInfo.PropertyType.IsGenericType)
                        {
                            //非泛型
                            proInfo.SetValue(model, value == null ? null
                                : string.IsNullOrWhiteSpace(value.ToString()) ? null
                                : Convert.ChangeType(value, proInfo.PropertyType), null);
                        }
                        else
                        {
                            //泛型Nullable<>
                            Type genericTypeDefinition = proInfo.PropertyType.GetGenericTypeDefinition();
                            if (genericTypeDefinition == typeof(Nullable<>))
                            {
                                proInfo.SetValue(model, value == null ? null
                                    : string.IsNullOrWhiteSpace(value.ToString()) ? null
                                    : Convert.ChangeType(value, Nullable.GetUnderlyingType(proInfo.PropertyType)), null);
                            }
                        }
                    }
                }
            }
            return model;
        }

        public static Dictionary<string, object> MergeDictionary(Dictionary<string, object> source, ref Dictionary<string, object> dest, bool cover = true, string keyPrefix = null)
        {
            if (null == source) return dest;
            if (dest != null)
            {
                foreach (KeyValuePair<string, object> kv in source)
                {
                    string key = string.IsNullOrEmpty(keyPrefix) ? kv.Key : $"{keyPrefix}{kv.Key}";
                    if (dest.ContainsKey(key))
                    {
                        if (cover)
                        {
                            dest[key] = kv.Value;
                        }
                    }
                    else
                    {
                        dest.Add(key, kv.Value);
                    }
                }
            }
            return dest;
        }

        /// <summary>
        /// 将数组转换为字符串
        /// </summary>
        public static string ArrayToString<T>(T[] array, string separator = ",")
        {
            if (array == null || array.Length == 0)
            {
                return string.Empty;
            }
            return string.Join(separator, array);
        }
    }
}
