using System;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue
{
    public static class RXJsonUtil
    {
        public static string ToJson(object obj)
        {
            if (obj == null)
                return null;

            try
            {
                return JsonMapper.ToJson(obj);
            }
            catch (Exception e)
            {
                Debug.LogError(e.Message);
                return null;
            }
        }

        public static string ToJsonNotNull(object obj)
        {
            if (obj == null)
                return string.Empty;

            try
            {
                return JsonMapper.ToJson(obj);
            }
            catch (Exception e)
            {
                Debug.LogError(e.Message);
                return string.Empty;
            }
        }

        public static T FromJson<T>(string json)
        {
            if (string.IsNullOrEmpty(json))
                return default;

            try
            {
                return JsonMapper.ToObject<T>(json);
            }
            catch (Exception e)
            {
                Debug.LogError(e.Message);
                return default;
            }
        }
    }
}