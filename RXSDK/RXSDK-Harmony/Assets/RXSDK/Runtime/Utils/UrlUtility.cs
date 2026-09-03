
using System.Collections.Generic;
using System.Net;

namespace RXSDK
{
    public static class UrlUtility
    {

        // 拼接多个 URL 片段
        public static string Join(params string[] parts)
        {
            if (parts == null || parts.Length == 0)
            {
                return string.Empty;
            }

            var result = parts[0].TrimEnd('/');

            for (int i = 1; i < parts.Length; i++)
            {
                result = Combine(result, parts[i]);
            }

            return result;
        }

        // 拼接两个 URL 片段
        private static string Combine(string baseUrl, string relativeUrl)
        {
            baseUrl = baseUrl.TrimEnd('/');
            relativeUrl = relativeUrl.TrimStart('/');

            if (string.IsNullOrEmpty(baseUrl))
            {
                return relativeUrl;
            }

            if (string.IsNullOrEmpty(relativeUrl))
            {
                return baseUrl;
            }

            return $"{baseUrl}/{relativeUrl}";
        }

        // public static string BuildQueryString(IDictionary<string, object> queryParams)
        // {
        //     if (queryParams == null || queryParams.Count == 0)
        //     {
        //         return string.Empty;
        //     }

        //     var encodedParams = new List<string>();
        //     foreach (var kvp in queryParams)
        //     {
        //         encodedParams.Add(kvp.Key + "=" + WebUtility.UrlEncode(kvp.Value?.ToString()));
        //     }

        //     // 使用 '&' 符号连接编码后的键值对  
        //     return string.Join("&", encodedParams);
        // }

        public static string BuildQueryString(IDictionary<string, object> queryParams, bool ignoreNull = true)
        {
            if (queryParams == null || queryParams.Count == 0)
            {
                return string.Empty;
            }

            var encodedParams = new List<string>();
            foreach (var kvp in queryParams)
            {
                if (kvp.Value == null && ignoreNull)
                {
                    continue;
                }

                if (kvp.Value is IEnumerable<object> array)
                {
                    foreach (var item in array)
                    {
                        if (item != null || !ignoreNull)
                        {
                            encodedParams.Add($"{WebUtility.UrlEncode(kvp.Key)}={WebUtility.UrlEncode(item?.ToString())}");
                        }
                    }
                }
                else
                {
                    encodedParams.Add($"{WebUtility.UrlEncode(kvp.Key)}={WebUtility.UrlEncode(kvp.Value?.ToString())}");
                }
            }

            return string.Join("&", encodedParams);
        }

        // 解析查询字符串为字典
        public static IDictionary<string, object> ParseQueryString(string queryString)
        {
            var result = new Dictionary<string, object>();
            if (string.IsNullOrEmpty(queryString))
            {
                return result;
            }

            if (queryString.StartsWith("?"))
            {
                queryString = queryString.Substring(1);
            }

            var keyValuePairs = queryString.Split('&');
            foreach (var pair in keyValuePairs)
            {
                var parts = pair.Split('=');
                if (parts.Length == 2)
                {
                    var key = WebUtility.UrlDecode(parts[0]);
                    var value = WebUtility.UrlDecode(parts[1]);
                    if (result.ContainsKey(key))
                    {
                        if (result[key] is List<object> list)
                        {
                            list.Add(value);
                        }
                        else
                        {
                            result[key] = new List<object> { result[key], value };
                        }
                    }
                    else
                    {
                        result[key] = value;
                    }
                }
            }

            return result;
        }

        // 向 URL 添加查询字符串
        public static string AddQueryStringToUrl(string url, IDictionary<string, object> queryParams, bool ignoreNull = true)
        {
            var query = BuildQueryString(queryParams, ignoreNull);
            if (string.IsNullOrEmpty(query))
            {
                return url;
            }

            if (url.Contains("?"))
            {
                return url + "&" + query;
            }
            else
            {
                return url + "?" + query;
            }
        }
    }
}