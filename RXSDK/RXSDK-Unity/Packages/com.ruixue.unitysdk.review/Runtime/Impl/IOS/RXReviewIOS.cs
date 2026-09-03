using System;
using System.Collections;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using UnityEngine;
using UnityEngine.Networking;

#if UNITY_IOS
namespace RuiXue.Review.Impl
{
    internal class RXReviewIOS: IRXReview
    {
        public bool JumpToAppStore()
        {
            RuiXueSdkDriver.Instance.StartCoroutine(JumpToAppStoreCoroutine());
            return true;
        }

        private IEnumerator JumpToAppStoreCoroutine()
        {
            var request = UnityWebRequest.Get($"https://itunes.apple.com/lookup?bundleId={Application.identifier}");
            yield return request.SendWebRequest();
   
            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError($"获取appId 失败： {request.url}， error{request.error}");
                yield break;
            }
   
            var json = request.downloadHandler.text;
            string appid = "";
            
            // 使用正则表达式提取所有 "trackId":数字, 格式的数字部分
            string pattern = "\"trackId\":(\\d+),";
            MatchCollection matches = Regex.Matches(json, pattern);

            foreach (Match match in matches)
            {
                GroupCollection groups = match.Groups;
                if (groups.Count > 1)
                {
                    appid = groups[1].Value;
                }
            }
            
            Debug.Log("获取appid的结果： " + appid);
            if (string.IsNullOrEmpty(appid))
            {
                Debug.LogError($"获取appId失败：appid为空, {request.url}");
                yield break;
            }
            
            ios_inAppStoreReview(appid);
        }
        
        
        [DllImport("__Internal")]
        public static extern void ios_inAppStoreReview(string appid);
    }
}
#endif