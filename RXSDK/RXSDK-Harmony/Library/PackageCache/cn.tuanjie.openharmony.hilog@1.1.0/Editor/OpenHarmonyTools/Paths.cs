using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal static class Paths
    {
        public static string Combine(params string[] components)
        {
            var path = components.Where(_ => !string.IsNullOrEmpty(_)).Aggregate(Path.Combine);
            if (string.IsNullOrEmpty(path))
                throw new ArgumentException("At least one component must be provided!");
            return path;
        }

        public static string[] Split(string path)
        {
            return Split(path, Path.DirectorySeparatorChar);
        }

        public static string[] Split(string path, char separator)
        {
            var result = new List<string>(path.Split(separator));

            for (var i = 0; i < result.Count;)
            {
                result[i] = result[i].Trim();
                if (result[i].Equals(""))
                {
                    result.RemoveAt(i);
                }
                else
                {
                    i++;
                }
            }

            return result.ToArray();
        }
    }
}
