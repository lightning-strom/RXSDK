
using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;
public class HttpUtils
{

    private IEnumerator SendRequest(string url, string dataStr, Action<string> callback = null)
    {
        using (UnityWebRequest request = new UnityWebRequest(url, UnityWebRequest.kHttpVerbPOST))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(dataStr);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Steam Purchase Fail: " + request.error);
            }
            else
            {
                string content = request.downloadHandler.text;
                Debug.Log("Steam Purchase back: " + content);
                callback?.Invoke(content);
            }
        }
    }
}