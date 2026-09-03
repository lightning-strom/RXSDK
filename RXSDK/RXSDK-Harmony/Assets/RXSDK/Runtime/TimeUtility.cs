using System;
using UnityEngine.UIElements;

namespace RXSDK
{

    public sealed class TimeUtility
    {
        public static string GetLocalTimeOffsetString()
        {
            return string.Format("{0:f2}", GetLocalTimeOffset());
        }
        public static double GetLocalTimeOffset()
        {
            return TimeZoneInfo.Local.BaseUtcOffset.TotalHours;
        }

        public static string GetRFC3339Format()
        {
            return DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fffK");
        }
        /// <summary>
        /// 时间转化为13位时间戳
        /// </summary>
        /// <param name="_time"></param>
        /// <returns></returns>
        public static long ConvertDateTimeToUtc(DateTime _time)
        {
            DateTime time = TimeZoneInfo.ConvertTimeToUtc(new DateTime(1970, 1, 1, 0, 0, 0, 0));
            long t = (_time.Ticks - time.Ticks) / 10000;
            return t;
        }
        public static long GetTimeMillis()
        {
            //精确到毫秒
            return new DateTimeOffset(DateTime.UtcNow).ToUnixTimeMilliseconds();
        }
        public static long GetTimeSeconds()
        {
            //精确到秒
            return new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds();
        }

        // /// <summary>
        // /// 13位时间戳转化为时间
        // /// </summary>
        // /// <param name="_utcTime"></param>
        // /// <returns></returns>
        // public static DateTime ConvertUtcToDateTime(string _utcTime)
        // {
        //     DateTime dt = TimeZoneInfo.ConvertTimeToUtc(new DateTime(1970, 1, 1));
        //     long lTime = long.Parse(_utcTime + "0000");
        //     TimeSpan toNow = new TimeSpan(lTime);
        //     return dt.Add(toNow);
        // }
        // // 时间戳 转换为时间
        // public DateTime StampToDateTime(string timeStamp)
        // {
        //     DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));
        //     long mTime = long.Parse(timeStamp + "0000");
        //     TimeSpan toNow = new TimeSpan(mTime);
        //     // Log.D("\n 当前时间为：" + startTime.Add(toNow).ToString("yyyy/MM/dd HH:mm:ss:ffff"));
        //     return startTime.Add(toNow);
        // }





        // public static float Convert2Seconds(float v, TimeUnit tu)
        // {

        // }
        // public static double GetTimeStamp(DateTime dateTime)
        // {
        //     dateTime.
        //     dateTime.
        // }
    }
}