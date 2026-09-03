using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.RegularExpressions;
using UnityEngine;

namespace RXSDK
{

    public class TypeUtility
    {
        private static readonly Regex keyPattern = new(@"^[a-zA-Z][a-zA-Z\d_#]{0,49}$");
        private static readonly List<string> propertyNameWhitelist = new List<string>() { };

        public static bool IsNumeric(object obj)
        {
            return obj is sbyte
                || obj is byte
                || obj is short
                || obj is ushort
                || obj is int
                || obj is uint
                || obj is long
                || obj is ulong
                || obj is double
                || obj is decimal
                || obj is float;
        }
        public static bool IsString(object obj)
        {
            if (obj == null)
                return false;
            return obj is string;
        }
        public static bool IsDictionary(object obj)
        {
            if (obj == null)
                return false;
            return obj.GetType().IsGenericType && obj.GetType().GetGenericTypeDefinition() == typeof(Dictionary<,>);
        }
        public static bool IsList(object obj)
        {
            if (obj == null)
                return false;
            return (obj.GetType().IsGenericType && obj.GetType().GetGenericTypeDefinition() == typeof(List<>)) || obj is Array;
        }
        public static bool CheckString(string str)
        {
            if (string.IsNullOrEmpty(str))
            {
                return false;
            }
            if (keyPattern.IsMatch(str))
            {
                return true;
            }
            else
            {
                if (propertyNameWhitelist.Contains(str))
                {
                    return true;
                }
                return false;
            }
        }
    }
}