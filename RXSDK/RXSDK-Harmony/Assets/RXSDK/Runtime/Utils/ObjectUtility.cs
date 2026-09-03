using System.Collections;
using System;
using System.Collections.Generic;
using System.Globalization;
using UnityEngine;

namespace RXSDK
{

    public class ObjectUtility
    {
        public static T MergeDic<T, TValue>(T source, T dest) where T : IDictionary<string, TValue>
        {
            if (null == source) return dest;
            if (dest != null)
            {
                foreach (KeyValuePair<string, TValue> kv in source)
                {
                    if (dest.ContainsKey(kv.Key))
                    {
                        dest[kv.Key] = kv.Value;
                    }
                    else
                    {
                        dest.Add(kv.Key, kv.Value);
                    }
                }
            }
            return dest;
        }

        /// <summary>
        /// 尝试将一个对象转换为整数类型。
        /// 如果转换成功，返回转换后的整数值；如果转换失败，返回指定的默认值。
        /// </summary>
        /// <param name="obj">要转换的对象。</param>
        /// <param name="def">转换失败时返回的默认值，默认为 0。</param>
        /// <returns>转换后的整数值或默认值。</returns>
        public static int ToInt(object obj, int def = 0)
        {
            if (obj is int intValue)
            {
                return intValue;
            }

            if (obj is string stringValue && int.TryParse(stringValue, out int parsedValue))
            {
                return parsedValue;
            }

            return def;
        }


    }
}