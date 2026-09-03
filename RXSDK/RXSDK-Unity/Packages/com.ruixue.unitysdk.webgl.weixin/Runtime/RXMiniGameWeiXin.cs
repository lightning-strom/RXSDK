#if UNITY_WEBGL
using System;
using System.Runtime.InteropServices;
using System.Collections.Generic;
using RuiXue.Impl;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.MiniGame.WeiXin
{
    public static class RXMiniGameWeiXin
    {
        private static JsCallBackHelper _jsCallBackHelper = new JsCallBackHelper();
        
        /// <summary>
        /// 文本内容安全识别
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>

        public static void MsgSecCheck(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_msgSecCheck", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_msgSecCheck(json);
        }
        
        /// <summary>
        /// 异步校验图片
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>

        public static void MediaCheckAsync(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_mediaCheckAsync", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_mediaCheckAsync(json);
        }
        
        /// <summary>
        /// 客服
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>

        public static void OpenCustomerServiceConversation(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_openCustomerServiceConversation", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_openCustomerServiceConversation(json);
        }
            
        /// <summary>
        /// 设备码
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>

        public static void GetUserDeviceCode(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_getUserDeviceCode", onResponse, onError);
            rx_getUserDeviceCode();
        }
        
        /// <summary>
        /// 查询是否需要补单
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>

        public static void CheckHasCompensatePayOrder(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_checkHasCompensatePayOrder", onResponse, onError);
            rx_checkHasCompensatePayOrder();
        }
            
        /// <summary>
        /// 补单
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>

        public static void CompensatePayOrder(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_compensatePayOrder", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_compensatePayOrder(json);
        }
        
        /// <summary>
        /// 获取当前用户互动型托管数据对应 key 的数据
        /// </summary>
        /// <param name="keyList"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>

        public static void GetUserInteractiveStorage(string[] keyList, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_getUserInteractiveStorage", onResponse, onError);
            
            var data = new JsonData
            {
                ["keyList"] = JsonMapper.ToObject(JsonMapper.ToJson(keyList))
            };
            
            string json = RXJsonUtil.ToJson(data);
            rx_getUserInteractiveStorage(json);
        }

        [Serializable]
        public class GameClubDataType
        {
            public int type;
            public string subKey;
        }
        
        /// <summary>
        /// 获取游戏圈数据
        /// </summary>
        /// <param name="dataTypeList"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetGameClubData(GameClubDataType[] dataTypeList, RequestResponseDelegate onResponse, RequestErrorDelegate onError )
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_getGameClubData", onResponse, onError);
            var data = new JsonData
            {
                ["dataTypeList"] = JsonMapper.ToObject(JsonMapper.ToJson(dataTypeList))
            };
            
            string json = RXJsonUtil.ToJson(data);
            rx_getGameClubData(json);
        }

        [Serializable]
        public class CloudStorageKVData
        {
            public string key;
            public string value;
        }

        /// <summary>
        /// 对用户托管数据进行写数据操作
        /// </summary>
        /// <param name="kvDataList"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void SetUserCloudStorage(CloudStorageKVData[] kvDataList, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_setUserCloudStorage", onResponse, onError);
            var data = new JsonData
            {
                ["KVDataList"] = JsonMapper.ToObject(JsonMapper.ToJson(kvDataList))
            };
            string json = RXJsonUtil.ToJson(data);
            
            rx_setUserCloudStorage(json);
        }
        
        /// <summary>
        /// 获取当前用户托管数据当中对应 key 的数据
        /// </summary>
        /// <param name="keyList"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        [Obsolete("目前有问题，此接口只能在开放域调用")]
        public static void GetUserCloudStorage(string[] keyList, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            Debug.LogError("TODO: 目前有问题，此接口只能在开放域调用");
            _jsCallBackHelper.RegisterJsCallBack("rx_getUserCloudStorage", onResponse, onError);
            var data = new JsonData
            {
                ["keyList"] = JsonMapper.ToObject(JsonMapper.ToJson(keyList))
            };
            string json = RXJsonUtil.ToJson(data);
            rx_getUserCloudStorage(json);
        }

        /// <summary>
        /// 删除用户托管数据当中对应 key 的数据
        /// </summary>
        /// <param name="keyList"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void RemoveUserCloudStorage(string[] keyList, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_removeUserCloudStorage", onResponse, onError);
            var data = new JsonData
            {
                ["keyList"] = JsonMapper.ToObject(JsonMapper.ToJson(keyList))
            };
            string json = RXJsonUtil.ToJson(data);
            rx_removeUserCloudStorage(json);
        }
        
        /// <summary>
        /// 获取当前用户托管数据当中所有的 key
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        [Obsolete("目前有问题，此接口只能在开放域调用")]
        public static void GetUserCloudStorageKeys(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            Debug.LogError("TODO: 目前有问题，此接口只能在开放域调用");
            _jsCallBackHelper.RegisterJsCallBack("rx_getUserCloudStorageKeys", onResponse, onError);
            rx_getUserCloudStorageKeys();
        }

        /// <summary>
        /// 拉取当前用户所有同玩好友的托管数据
        /// </summary>
        /// <param name="keyList"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        [Obsolete("目前有问题，此接口只能在开放域调用")]
        public static void GetFriendCloudStorage(string[] keyList, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            Debug.LogError("TODO: 目前有问题，此接口只能在开放域调用");
            _jsCallBackHelper.RegisterJsCallBack("rx_getFriendCloudStorage", onResponse, onError);
            var data = new JsonData
            {
                ["keyList"] = JsonMapper.ToObject(JsonMapper.ToJson(keyList))
            };
            string json = RXJsonUtil.ToJson(data);
            rx_getFriendCloudStorage(json);
        }
        
    
        /// <summary>
        /// 获取可能对游戏感兴趣的未注册的好友名单
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        [Obsolete("目前有问题，此接口只能在开放域调用")]
        public static void GetPotentialFriendList(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            Debug.LogError("TODO: 目前有问题，此接口只能在开放域调用");
            _jsCallBackHelper.RegisterJsCallBack("rx_getPotentialFriendList", onResponse, onError);
            rx_getPotentialFriendList();
        }

        /// <summary>
        /// 获取同玩游戏好友列表
        /// </summary>
        /// <param name="dic">可选参数（guideAuthWhenDeny/authModalTitle/authModalContent），无参数时传入空字典</param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetRelationFriendList(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_getRelationFriendList", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic ?? new Dictionary<string, object>());
            rx_getRelationFriendList(json);
        }
        
        /// <summary>
        /// 校验解绑验证码
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ValidateUnbindCode(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_validateUnbindCode", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_validateUnbindCode(json);
        }
        
        /// <summary>
        /// 换绑手机号
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ChangePhone(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_changePhone", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_changePhone(json);
        }
        
        /// <summary>
        /// 绑定手机号（ios）
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetPhoneNumber(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_getPhoneNumber", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_getPhoneNumber(json);
        }
        
        /// <summary>
        /// 换绑手机号（ios）
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ChangePhoneNumber(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_changePhoneNumber", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_changePhoneNumber(json);
        }
        
        /// <summary>
        /// 拉起分享
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void Share(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_share", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_share(json);
        }
        
        /// <summary>
        /// 调度分享（分享、广告）
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void SchedulingAction(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_schedulingAction", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_schedulingAction(json);
        }
        
        /// <summary>
        /// 打开分享图片弹窗
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ShowShareImageMenu(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_showShareImageMenu", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_showShareImageMenu(json);
        }
        
        /// <summary>
        /// 给指定的好友分享
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ShareMessageToFriend(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_shareMessageToFriend", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_shareMessageToFriend(json);
        }
        
        /// <summary>
        /// 创建 activity_id
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void CreateActivityId(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_createActivityId", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_createActivityId(json);
        }
        
        /// <summary>
        /// 分享动态消息
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void DynamicShare(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_dynamicShare", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_dynamicShare(json);
        }
        
        /// <summary>
        /// 分享动态消息
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetDynamicShareActivityId(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_getDynamicShareActivityId", onResponse, onError);
            rx_getDynamicShareActivityId();
        }
        
        /// <summary>
        /// 订阅消息
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void RequestSubscribeMessage(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_requestSubscribeMessage", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_requestSubscribeMessage(json);
        }
        
        /// <summary>
        /// 获取公告列表
        /// </summary>
        /// <param name="limit"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetAnnouncement(int limit, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_getAnnouncement", onResponse, onError);
            rx_getAnnouncement(limit);
        }
        
        /// <summary>
        /// 激励广告
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void RewardedVideoAd(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_rewardedVideoAd", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_rewardedVideoAd(json);
        }
        
        /// <summary>
        /// 原生模板广告
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void CreateCustomAd(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_createCustomAd", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_createCustomAd(json);
        }
        
        /// <summary>
        /// 获取邮件列表
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetEmailList(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_getEmailList", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_getEmailList(json);
        }
        
        /// <summary>
        /// 获取邮件详情
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetEmailDetail(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_getEmailDetail", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_getEmailDetail(json);
        }
        
        /// <summary>
        /// 邮件领取
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ReceiveEmail(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_receiveEmail", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_getEmailDetail(json);
        }
        
        /// <summary>
        /// 邮件删除
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void DelEmail(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_delEmail", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_delEmail(json);
        }
        
        /// <summary>
        /// 创建玩家反馈
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void AddFeedback(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_addFeedback", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_addFeedback(json);
        }
        
        /// <summary>
        /// 玩家反馈列表
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetFeedbackList(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_getFeedbackList", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_getFeedbackList(json);
        }
        
        /// <summary>
        /// 玩家反馈详情
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetFeedbackDetail(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_getFeedbackDetail", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_getFeedbackDetail(json);
        }
        
        /// <summary>
        /// 领取道具
        /// </summary>
        /// <param name="dic"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void CollectProps(Dictionary<string, dynamic> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_collectProps", onResponse, onError);
            string json = RXJsonUtil.ToJson(dic);
            rx_collectProps(json);
        }
        
        /// <summary>
        /// 获取福利码
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetPromoDisplayKey(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_getPromoDisplayKEY", onResponse, onError);
            rx_getPromoDisplayKEY();
        }
        
        /// <summary>
        /// 兑换福利码
        /// </summary>
        /// <param name="cdkey"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ExchangePromoCdKey(string cdkey, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_exchangePromoCDKEY", onResponse, onError);
            rx_exchangePromoCDKEY(cdkey);
        }
        
        /// <summary>
        /// 上报创角
        /// </summary>
        /// <param name="roleid"></param>
        public static void ReportCreateRole(string roleid)
        {
            rx_reportCreateRole(roleid);
        }
        
        /// <summary>
        /// 上报付费（已废弃）
        /// </summary>
        /// <remarks>JSSDK 4.0.2 会自动查询缓存订单并补报，手动调用会造成重复上报。</remarks>
        [Obsolete("JSSDK 4.0.2 已自动补报支付，请勿手动调用。")]
        public static void ReportPurchase(int amount, bool needReportMidas)
        {
            Debug.LogWarning("RXMiniGameWeiXin.ReportPurchase 已停用：JSSDK 4.0.2 会自动补报支付。");
        }
        
        /// <summary>
        /// 上报等级提升
        /// </summary>
        /// <param name="dic"></param>
        public static void ReportUpdateLevel(Dictionary<string, dynamic> dic)
        {
            string json = RXJsonUtil.ToJson(dic);
            rx_reportUpdateLevel(json);
        }
        
        /// <summary>
        /// 上报完成指引
        /// </summary>
        public static void ReportTutorialFinish()
        {
            rx_reportTutorialFinish();
        }
        
        /// <summary>
        /// 上报浏览
        /// </summary>
        /// <param name="item"></param>
        public static void ReportViewContent(string item)
        {
            rx_reportViewContent(item);
        }

        /// <summary>
        /// 广点通通用事件上报。
        /// </summary>
        public static void ReportGdt(string actionType, Dictionary<string, object> actionParam = null)
        {
            string json = RXJsonUtil.ToJson(actionParam ?? new Dictionary<string, object>());
            rx_reportGdt(actionType, json);
        }

        /// <summary>
        /// 注册收藏和右上角分享的 GDT 上报监听。
        /// </summary>
        /// <remarks>必须由 CP 在瑞雪 SDK 初始化成功后显式调用；重复调用不会重复注册。</remarks>
        public static void RegisterGdtMenuEventListeners()
        {
            rx_registerGdtMenuEventListeners();
        }

        /// <summary>loading 页面完成并进入游戏第一帧时上报。</summary>
        public static void LoadFinish()
        {
            ReportGdt("LOAD_FINISH");
        }

        /// <summary>玩家完成订阅操作后上报。</summary>
        public static void Subscribe()
        {
            ReportGdt("SUBSCRIBE");
        }

        /// <summary>玩家首次进入第 1 关新手引导时上报。</summary>
        public static void TutorialStart()
        {
            ReportGdt("TUTORIAL_START");
        }
        
        /// <summary>
        /// 设置区服角色
        /// </summary>
        /// <param name="roleId"></param>
        /// <param name="regionTag"></param>
        public static void SetGameInfo(string roleId, string regionTag)
        {
            rx_setGameInfo(roleId, regionTag);
        }
        
        /// <summary>
        /// 查询区服角色
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void SearchGameAccount(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _jsCallBackHelper.RegisterJsCallBack("rx_searchGameAccount", onResponse, onError);
            rx_searchGameAccount();
        }

        [Serializable]
        public class DirectAdStatusInfo
        {
            public bool isInMask;
            public bool isInDirectGameAd;
            public bool isEndByAbnormal;
        }

        private static Action<DirectAdStatusInfo> _directAdStatusChange;
        private static bool _directAdStatusChangeRegistered;

        /// <summary>
        /// 获取直玩广告组件展示状态
        /// </summary>
        public static DirectAdStatusInfo GetDirectAdStatusSync()
        {
            return RXJsonUtil.FromJson<DirectAdStatusInfo>(rx_getDirectAdStatusSync());
        }

        /// <summary>
        /// 监听直玩广告状态变化
        /// </summary>
        /// <param name="listener">状态变化回调</param>
        public static void OnDirectAdStatusChange(Action<DirectAdStatusInfo> listener)
        {
            if (listener == null)
                return;

            _directAdStatusChange += listener;
            if (_directAdStatusChangeRegistered)
                return;

            RuiXueSdkDriver.RegisterJsCallBack("rx_onDirectAdStatusChange", (_, jsonData) =>
            {
                var statusInfo = RXJsonUtil.FromJson<DirectAdStatusInfo>(jsonData);
                if (statusInfo != null)
                    _directAdStatusChange?.Invoke(statusInfo);
            });
            rx_onDirectAdStatusChange();
            _directAdStatusChangeRegistered = true;
        }
        
        [DllImport("__Internal")]
        static extern void rx_getUserInteractiveStorage(string json);

        [DllImport("__Internal")]
        static extern void rx_getGameClubData(string json);

        [DllImport("__Internal")]
        static extern void rx_setUserCloudStorage(string json);

        [DllImport("__Internal")]
        static extern void rx_getUserCloudStorage(string json);

        [DllImport("__Internal")]
        static extern void rx_removeUserCloudStorage(string json);

        [DllImport("__Internal")]
        static extern void rx_getUserCloudStorageKeys();

        [DllImport("__Internal")]
        static extern void rx_getFriendCloudStorage(string json);
     
        [DllImport("__Internal")]
        static extern void rx_getPotentialFriendList();
        
        [DllImport("__Internal")]
        static extern void rx_getRelationFriendList(string json);
        
        
        [DllImport("__Internal")]
        static extern void rx_compensatePayOrder(string json);
        
        [DllImport("__Internal")]
        static extern void rx_checkHasCompensatePayOrder();
        
        [DllImport("__Internal")]
        static extern void rx_openCustomerServiceConversation(string json);
        
        [DllImport("__Internal")]
        static extern void rx_msgSecCheck(string json);
        
        [DllImport("__Internal")]
        static extern void rx_mediaCheckAsync(string json);
        
        [DllImport("__Internal")]
        static extern void rx_getUserDeviceCode();
        
        [DllImport("__Internal")]
        static extern void rx_validateUnbindCode(string json);
        
        [DllImport("__Internal")]
        static extern void rx_changePhone(string json);
        
        [DllImport("__Internal")]
        static extern void rx_getPhoneNumber(string json);
        
        [DllImport("__Internal")]
        static extern void rx_changePhoneNumber(string json);
        
        [DllImport("__Internal")]
        static extern void rx_share(string json);
        
        [DllImport("__Internal")]
        static extern void rx_schedulingAction(string json);
        
        [DllImport("__Internal")]
        static extern void rx_showShareImageMenu(string json);
        
        [DllImport("__Internal")]
        static extern void rx_shareMessageToFriend(string json);
        
        [DllImport("__Internal")]
        static extern void rx_createActivityId(string json);
        
        [DllImport("__Internal")]
        static extern void rx_dynamicShare(string json);
        
        [DllImport("__Internal")]
        static extern void rx_getDynamicShareActivityId();
        
        [DllImport("__Internal")]
        static extern void rx_requestSubscribeMessage(string json);
        
        [DllImport("__Internal")]
        static extern void rx_getAnnouncement(int limit);
        
        [DllImport("__Internal")]
        static extern void rx_rewardedVideoAd(string json);
        
        [DllImport("__Internal")]
        static extern void rx_createCustomAd(string json);
        
        [DllImport("__Internal")]
        static extern void rx_getEmailList(string json);
        
        [DllImport("__Internal")]
        static extern void rx_getEmailDetail(string json);
        
        [DllImport("__Internal")]
        static extern void rx_delEmail(string json);
        
        [DllImport("__Internal")]
        static extern void rx_addFeedback(string json);
        
        [DllImport("__Internal")]
        static extern void rx_getFeedbackList(string json);
        
        [DllImport("__Internal")]
        static extern void rx_getFeedbackDetail(string json);
        
        [DllImport("__Internal")]
        static extern void rx_collectProps(string json);
        
        [DllImport("__Internal")]
        static extern void rx_getPromoDisplayKEY();
        
        [DllImport("__Internal")]
        static extern void rx_exchangePromoCDKEY(string cdkey);
        
        [DllImport("__Internal")]
        static extern void rx_reportCreateRole(string roleid);
        
        
        [DllImport("__Internal")]
        static extern void rx_reportPurchase(int amount, bool needReportMidas);
        
        [DllImport("__Internal")]
        static extern void rx_reportUpdateLevel(string json);
        
        [DllImport("__Internal")]
        static extern void rx_reportTutorialFinish();
        
        [DllImport("__Internal")]
        static extern void rx_reportViewContent(string item);

        [DllImport("__Internal")]
        static extern void rx_reportGdt(string actionType, string actionParamJson);

        [DllImport("__Internal")]
        static extern void rx_registerGdtMenuEventListeners();
        
        [DllImport("__Internal")]
        static extern void rx_setGameInfo(string roleId, string regionTag);
        
        [DllImport("__Internal")]
        static extern void rx_searchGameAccount();

        [DllImport("__Internal")]
        static extern string rx_getDirectAdStatusSync();

        [DllImport("__Internal")]
        static extern void rx_onDirectAdStatusChange();
    }
}
#endif

