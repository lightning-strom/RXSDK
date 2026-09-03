using System.Collections.Generic;
using UnityEngine;
using System.Globalization;
using System.Linq;

namespace RXSDK
{
    /// <summary>
    /// 语言代码转换工具类
    /// 用于在不同语言代码标准之间进行转换，特别是 ISO 639-1 和 Steam 使用的语言代码
    /// </summary>
    public static class SteamLangConverter
    {
        #region 语言代码映射

        /// <summary>
        /// ISO 639-1 语言代码到 Steam 语言代码的映射
        /// </summary>
        private static readonly Dictionary<string, string> IsoToSteamLanguageMap = new Dictionary<string, string>
        {
            // 简体中文
            { "zh-CN", "schinese" },
            { "zh-Hans", "schinese" },
            { "zh", "schinese" }, // 默认中文视为简体中文
            
            // 繁体中文
            { "zh-TW", "tchinese" },
            { "zh-HK", "tchinese" },
            { "zh-MO", "tchinese" },
            { "zh-Hant", "tchinese" },
            
            // 英语
            { "en", "english" },
            { "en-US", "english" },
            { "en-GB", "english" },
            
            // 日语
            { "ja", "japanese" },
            { "ja-JP", "japanese" },
            
            // 韩语
            { "ko", "koreana" },
            { "ko-KR", "koreana" },
            
            // 俄语
            { "ru", "russian" },
            { "ru-RU", "russian" },
            
            // 德语
            { "de", "german" },
            { "de-DE", "german" },
            
            // 法语
            { "fr", "french" },
            { "fr-FR", "french" },
            
            // 意大利语
            { "it", "italian" },
            { "it-IT", "italian" },
            
            // 西班牙语
            { "es", "spanish" },
            { "es-ES", "spanish" },
            
            // 葡萄牙语
            { "pt", "portuguese" },
            { "pt-PT", "portuguese" },
            { "pt-BR", "brazilian" }, // 巴西葡萄牙语
            
            // 土耳其语
            { "tr", "turkish" },
            { "tr-TR", "turkish" },
            
            // 泰语
            { "th", "thai" },
            { "th-TH", "thai" },
            
            // 波兰语
            { "pl", "polish" },
            { "pl-PL", "polish" },
            
            // 丹麦语
            { "da", "danish" },
            { "da-DK", "danish" },
            
            // 荷兰语
            { "nl", "dutch" },
            { "nl-NL", "dutch" },
            
            // 芬兰语
            { "fi", "finnish" },
            { "fi-FI", "finnish" },
            
            // 挪威语
            { "no", "norwegian" },
            { "nb", "norwegian" },
            { "nn", "norwegian" },
            
            // 瑞典语
            { "sv", "swedish" },
            { "sv-SE", "swedish" },
            
            // 匈牙利语
            { "hu", "hungarian" },
            { "hu-HU", "hungarian" },
            
            // 捷克语
            { "cs", "czech" },
            { "cs-CZ", "czech" },
            
            // 罗马尼亚语
            { "ro", "romanian" },
            { "ro-RO", "romanian" },
            
            // 乌克兰语
            { "uk", "ukrainian" },
            { "uk-UA", "ukrainian" },
            
            // 希腊语
            { "el", "greek" },
            { "el-GR", "greek" },
            
            // 保加利亚语
            { "bg", "bulgarian" },
            { "bg-BG", "bulgarian" },
            
            // 越南语
            { "vi", "vietnamese" },
            { "vi-VN", "vietnamese" },
            
            // 印尼语
            { "id", "indonesian" },
            { "id-ID", "indonesian" },
            
            // 阿拉伯语
            { "ar", "arabic" },
            
            // 拉丁美洲西班牙语
            { "es-MX", "latam" },
            { "es-AR", "latam" },
            { "es-CL", "latam" },
            { "es-CO", "latam" },
            { "es-PE", "latam" }
        };

        /// <summary>
        /// Steam 语言代码到 ISO 639-1 语言代码的映射
        /// </summary>
        private static readonly Dictionary<string, string> SteamToIsoLanguageMap = new Dictionary<string, string>
        {
            { "schinese", "zh-CN" },
            { "tchinese", "zh-TW" },
            { "english", "en" },
            { "japanese", "ja" },
            { "koreana", "ko" },
            { "russian", "ru" },
            { "german", "de" },
            { "french", "fr" },
            { "italian", "it" },
            { "spanish", "es" },
            { "portuguese", "pt" },
            { "brazilian", "pt-BR" },
            { "turkish", "tr" },
            { "thai", "th" },
            { "polish", "pl" },
            { "danish", "da" },
            { "dutch", "nl" },
            { "finnish", "fi" },
            { "norwegian", "no" },
            { "swedish", "sv" },
            { "hungarian", "hu" },
            { "czech", "cs" },
            { "romanian", "ro" },
            { "ukrainian", "uk" },
            { "greek", "el" },
            { "bulgarian", "bg" },
            { "vietnamese", "vi" },
            { "indonesian", "id" },
            { "arabic", "ar" },
            { "latam", "es-MX" }
        };

        #endregion

        #region 公共方法

        /// <summary>
        /// 将 ISO 639-1 语言代码转换为 Steam 语言代码
        /// </summary>
        /// <param name="isoCode">ISO 639-1 语言代码，如 "zh-CN"</param>
        /// <returns>对应的 Steam 语言代码，如 "schinese"，如果找不到对应关系则返回 "english"</returns>
        public static string IsoToSteamLanguage(string isoCode)
        {
            if (string.IsNullOrEmpty(isoCode))
                return "english"; // 默认返回英语

            // 转换为小写并尝试查找
            string normalizedCode = isoCode.ToLowerInvariant();

            if (IsoToSteamLanguageMap.TryGetValue(normalizedCode, out string steamCode))
                return steamCode;

            // 如果找不到完整匹配，尝试只匹配语言部分（不包括国家/地区）
            if (normalizedCode.Contains("-"))
            {
                string languageOnly = normalizedCode.Split('-')[0];
                if (IsoToSteamLanguageMap.TryGetValue(languageOnly, out steamCode))
                    return steamCode;
            }

            // 默认返回英语
            return "english";
        }

        /// <summary>
        /// 将 Steam 语言代码转换为 ISO 639-1 语言代码
        /// </summary>
        /// <param name="steamCode">Steam 语言代码，如 "schinese"</param>
        /// <returns>对应的 ISO 639-1 语言代码，如 "zh-CN"，如果找不到对应关系则返回 "en"</returns>
        public static string SteamToIsoLanguage(string steamCode)
        {
            if (string.IsNullOrEmpty(steamCode))
                return "en"; // 默认返回英语

            // 转换为小写并尝试查找
            string normalizedCode = steamCode.ToLowerInvariant();

            if (SteamToIsoLanguageMap.TryGetValue(normalizedCode, out string isoCode))
                return isoCode;

            // 默认返回英语
            return "en";
        }

        /// <summary>
        /// 获取当前系统语言对应的 Steam 语言代码
        /// </summary>
        /// <returns>当前系统语言对应的 Steam 语言代码</returns>
        public static string GetCurrentSystemSteamLanguage()
        {
            // 获取当前系统语言
            SystemLanguage unityLanguage = Application.systemLanguage;

            // 将 Unity SystemLanguage 转换为 ISO 代码
            string isoCode = SystemLanguageToIsoCode(unityLanguage);

            // 转换为 Steam 语言代码
            return IsoToSteamLanguage(isoCode);
        }

        /// <summary>
        /// 获取当前系统语言对应的 ISO 639-1 语言代码
        /// </summary>
        /// <returns>当前系统语言对应的 ISO 639-1 语言代码</returns>
        public static string GetCurrentSystemIsoLanguage()
        {
            // 获取当前系统语言
            SystemLanguage unityLanguage = Application.systemLanguage;

            // 将 Unity SystemLanguage 转换为 ISO 代码
            return SystemLanguageToIsoCode(unityLanguage);
        }

        /// <summary>
        /// 检查给定的语言代码是否为简体中文
        /// </summary>
        /// <param name="languageCode">要检查的语言代码，可以是 ISO 或 Steam 格式</param>
        /// <returns>如果是简体中文则返回 true，否则返回 false</returns>
        public static bool IsSimplifiedChinese(string languageCode)
        {
            if (string.IsNullOrEmpty(languageCode))
                return false;

            string normalizedCode = languageCode.ToLowerInvariant();

            // 检查是否是 Steam 的简体中文代码
            if (normalizedCode == "schinese")
                return true;

            // 检查是否是 ISO 的简体中文代码
            return normalizedCode == "zh-cn" || normalizedCode == "zh-hans" || normalizedCode == "zh";
        }

        /// <summary>
        /// 获取所有支持的 Steam 语言代码
        /// </summary>
        /// <returns>所有支持的 Steam 语言代码列表</returns>
        public static List<string> GetAllSteamLanguages()
        {
            return SteamToIsoLanguageMap.Keys.ToList();
        }

        /// <summary>
        /// 获取语言的本地化名称
        /// </summary>
        /// <param name="languageCode">ISO 语言代码</param>
        /// <returns>语言的本地化名称</returns>
        public static string GetLanguageNativeName(string languageCode)
        {
            try
            {
                CultureInfo culture = CultureInfo.GetCultureInfo(languageCode);
                return culture.NativeName;
            }
            catch
            {
                // 如果无法获取文化信息，返回语言代码本身
                return languageCode;
            }
        }

        #endregion

        #region 私有辅助方法

        /// <summary>
        /// 将 Unity SystemLanguage 枚举转换为 ISO 639-1 语言代码
        /// </summary>
        /// <param name="language">Unity SystemLanguage 枚举值</param>
        /// <returns>对应的 ISO 639-1 语言代码</returns>
        private static string SystemLanguageToIsoCode(SystemLanguage language)
        {
            switch (language)
            {
                case SystemLanguage.Afrikaans: return "af";
                case SystemLanguage.Arabic: return "ar";
                case SystemLanguage.Basque: return "eu";
                case SystemLanguage.Belarusian: return "be";
                case SystemLanguage.Bulgarian: return "bg";
                case SystemLanguage.Catalan: return "ca";
                case SystemLanguage.Chinese: return "zh-CN"; // 默认简体中文
                case SystemLanguage.ChineseSimplified: return "zh-CN";
                case SystemLanguage.ChineseTraditional: return "zh-TW";
                case SystemLanguage.Czech: return "cs";
                case SystemLanguage.Danish: return "da";
                case SystemLanguage.Dutch: return "nl";
                case SystemLanguage.English: return "en";
                case SystemLanguage.Estonian: return "et";
                case SystemLanguage.Faroese: return "fo";
                case SystemLanguage.Finnish: return "fi";
                case SystemLanguage.French: return "fr";
                case SystemLanguage.German: return "de";
                case SystemLanguage.Greek: return "el";
                case SystemLanguage.Hebrew: return "he";
                case SystemLanguage.Hungarian: return "hu";
                case SystemLanguage.Icelandic: return "is";
                case SystemLanguage.Indonesian: return "id";
                case SystemLanguage.Italian: return "it";
                case SystemLanguage.Japanese: return "ja";
                case SystemLanguage.Korean: return "ko";
                case SystemLanguage.Latvian: return "lv";
                case SystemLanguage.Lithuanian: return "lt";
                case SystemLanguage.Norwegian: return "no";
                case SystemLanguage.Polish: return "pl";
                case SystemLanguage.Portuguese: return "pt";
                case SystemLanguage.Romanian: return "ro";
                case SystemLanguage.Russian: return "ru";
                case SystemLanguage.SerboCroatian: return "sh";
                case SystemLanguage.Slovak: return "sk";
                case SystemLanguage.Slovenian: return "sl";
                case SystemLanguage.Spanish: return "es";
                case SystemLanguage.Swedish: return "sv";
                case SystemLanguage.Thai: return "th";
                case SystemLanguage.Turkish: return "tr";
                case SystemLanguage.Ukrainian: return "uk";
                case SystemLanguage.Vietnamese: return "vi";
                default: return "en"; // 默认英语
            }
        }

        #endregion
    }
}
