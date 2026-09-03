#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Firebase.Impl
{
    public class MessageServiceProxy : AndroidJavaProxy
    {

        private IRXFirebase.MessageReceivedDelegate _messageReceivedDelegate;
        private IRXFirebase.NewTokenDelegate _newTokenDelegate;

        public MessageServiceProxy(IRXFirebase.MessageReceivedDelegate messageReceived,
            IRXFirebase.NewTokenDelegate newTokenDelegate) : base("com.ruixue.sdk.google.unity.MessageServiceCallback")
        {
            _messageReceivedDelegate = messageReceived;
            _newTokenDelegate = newTokenDelegate;
        }

        /// <summary>
        /// app处于后台触发通知
        /// qpp处于前台回调此方法
        /// </summary>
        /// <param name="message"></param>
        public void onMessageReceived(AndroidJavaObject message)
        {
            
            LogUtil.Log("EventManager", "onMessageReceived 用户进行了点击");
            
            RemoteMessage remoteMessage = new();
            
            AndroidJavaObject map = message.Call<AndroidJavaObject>("getData");
            AndroidJavaClass jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
            string jsonStr = jSONUtil.CallStatic<string>("toJSONString", map);
            Dictionary<string, string> data = JsonMapper.ToObject<Dictionary<string, string>>(jsonStr);
            
            remoteMessage.data = data;
            remoteMessage.messageId = message.Call<string>("getMessageId");
            remoteMessage.messageType = message.Call<string>("getMessageType");
            remoteMessage.title = message.Call<AndroidJavaObject>("getNotification")
                .Call<string>("getTitle");
            remoteMessage.body = message.Call<AndroidJavaObject>("getNotification")
                .Call<string>("getBody");
            remoteMessage.icon = message.Call<AndroidJavaObject>("getNotification")
                .Call<string>("getIcon");
            AndroidJavaObject eventTimeLongValue = message.Call<AndroidJavaObject>("getNotification")
                .Call<AndroidJavaObject>("getEventTime");
            if (eventTimeLongValue != null)
            {
                remoteMessage.eventTime = eventTimeLongValue.Call<long>("intValue");
            }

            _messageReceivedDelegate?.Invoke(remoteMessage);
        }

        public void onNewToken(string token)
        {
            _newTokenDelegate?.Invoke(token);
        }

    }
}
#endif