using System.Collections.Generic;

namespace RXSDK
{

    class ObjectUtility
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
        public static T To<T>(object obj, T def = default)
        {
            if (obj is int intValue)
            {
                if (typeof(T).IsEnum)
                {
                    return (T)(object)intValue;
                }
                else
                {
                    return (T)(object)intValue;
                }
            }

            if (obj is string stringValue && int.TryParse(stringValue, out int parsedValue))
            {
                if (typeof(T).IsEnum)
                {
                    return (T)(object)parsedValue;
                }
                else
                {
                    return (T)(object)parsedValue;
                }
            }

            return def;
        }

    }
}