using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace RXSDK
{
    public class Toast : MonoBehaviour
    {
        public Text toastText;  // 引用 Text 组件来显示吐司信息
        public float displayTime = 2f;  // 显示时间，单位：秒

        void Start()
        {
            // 初始时隐藏吐司
            toastText.gameObject.SetActive(false);
        }

        // 显示吐司
        public void ShowToast(string message)
        {
            StartCoroutine(ShowToastCoroutine(message));
        }

        // 吐司显示协程，显示并自动隐藏
        private IEnumerator ShowToastCoroutine(string message)
        {
            toastText.text = message;  // 设置吐司内容
            toastText.gameObject.SetActive(true);  // 显示吐司
            yield return new WaitForSeconds(displayTime);  // 等待指定时间
            toastText.gameObject.SetActive(false);  // 隐藏吐司
        }
    }
}