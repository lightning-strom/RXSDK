var RxJsBridgeLib = {
    $CallJsRX: function () {
        if (typeof globalUnityInstance !== 'undefined') {
            return globalUnityInstance.CallJsRX;
        } else if (typeof GameGlobal !== 'undefined') {
            return GameGlobal.CallJsRX;
        }
        return null;
    },

    rx_jsLogEnable: function (enable) {
        CallJsRX().jsrx_setLogEnable(enable);
    },

    rx_jsLog: function (tag, log_str) {
        CallJsRX().jsrx_log(UTF8ToString(tag), UTF8ToString(log_str));
    },

    rx_init: function (json_str) {
        CallJsRX().jsrx_init(UTF8ToString(json_str));
    },

    rx_setSubChannelId: function (strId) {
        CallJsRX().jsrx_setSubChannelId(UTF8ToString(strId));
    },

    rx_infoSync: function () {
        CallJsRX().jsrx_infoSync();
    },

    rx_userInfoSilentSync: function () {
        CallJsRX().jsrx_userInfoSilentSync();
    },

    rx_login: function (json_str) {
        CallJsRX().jsrx_login(UTF8ToString(json_str));
    },

    rx_deregister: function (json_str) {
        CallJsRX().jsrx_deregister(UTF8ToString(json_str));
    },

    rx_deregisterCancel: function () {
        CallJsRX().jsrx_deregisterCancel();
    },

    rx_sendCaptcha: function (json_str) {
        CallJsRX().jsrx_sendCaptcha(UTF8ToString(json_str));
    },

    rx_bindEmail: function (json_str) {
        CallJsRX().jsrx_bindEmail(UTF8ToString(json_str));
    },

    rx_unbindEmail: function (json_str) {
        CallJsRX().jsrx_unbindEmail(UTF8ToString(json_str));
    },

    rx_bindPhone: function (json_str) {
        CallJsRX().jsrx_bindPhone(UTF8ToString(json_str));
    },

    rx_unbindPhone: function (json_str) {
        CallJsRX().jsrx_unbindPhone(UTF8ToString(json_str));
    },

    rx_getUserInfo: function () {
        CallJsRX().jsrx_getUserInfo();
    },

    rx_updateUserInfo: function (json_str) {
        CallJsRX().jsrx_updateUserInfo(UTF8ToString(json_str));
    },

    rx_pay: function (json_str) {
        CallJsRX().jsrx_pay(UTF8ToString(json_str));
    },

    rx_getShareData: function (json_str) {
        CallJsRX().jsrx_getShareData(UTF8ToString(json_str));
    },

    rx_share: function (json_str) {
        CallJsRX().jsrx_share(UTF8ToString(json_str));
    },

    rx_shareSchedulingInit: function (json_str) {
        CallJsRX().jsrx_shareSchedulingInit(UTF8ToString(json_str));
    },

    rx_getShareScheduling: function (json_str) {
        var str = CallJsRX().jsrx_getShareScheduling(UTF8ToString(json_str));
        var buffer = _malloc(lengthBytesUTF8(str) + 1);
        stringToUTF8(str, buffer, str.length + 1);
        return buffer;
    },

    rx_shareSchedulingReport: function (json_str) {
        CallJsRX().jsrx_shareSchedulingReport(UTF8ToString(json_str));
    },

    rx_getNearlyPersonByRadius: function (json_str) {
        CallJsRX().jsrx_getNearlyPersonByRadius(UTF8ToString(json_str));
    },

    rx_userSetCustom: function (str) {
        CallJsRX().jsrx_userSetCustom(UTF8ToString(str));
    },

    rx_authorizeLocation: function () {
        CallJsRX().jsrx_authorizeLocation();
    },

    rx_startReportLocation: function (json_str) {
        CallJsRX().jsrx_startReportLocation(UTF8ToString(json_str));
    },

    rx_stopReportLocation: function () {
        CallJsRX().jsrx_stopReportLocation();
    },

    rx_reportLocationUpdate: function (json_str) {
        CallJsRX().jsrx_reportLocationUpdate(UTF8ToString(json_str));
    },

    rx_deleteReportLocation: function (json_str) {
        CallJsRX().jsrx_deleteReportLocation(UTF8ToString(json_str));
    },

    rx_addRelation: function (json_str) {
        CallJsRX().jsrx_addRelation(UTF8ToString(json_str));
    },

    rx_deleteRelation: function (json_str) {
        CallJsRX().jsrx_deleteRelation(UTF8ToString(json_str));
    },

    rx_updateRemarks: function (json_str) {
        CallJsRX().jsrx_updateRemarks(UTF8ToString(json_str));
    },

    rx_relationList: function (json_str) {
        CallJsRX().jsrx_relationList(UTF8ToString(json_str));
    },

    rx_hasRelation: function (json_str) {
        CallJsRX().jsrx_hasRelation(UTF8ToString(json_str));
    },

    rx_addFriend: function (json_str) {
        CallJsRX().jsrx_addFriend(UTF8ToString(json_str));
    },

    rx_deleteFriend: function (json_str) {
        CallJsRX().jsrx_deleteFriend(UTF8ToString(json_str));
    },

    rx_updateFriendRemarks: function (json_str) {
        CallJsRX().jsrx_updateFriendRemarks(UTF8ToString(json_str));
    },

    rx_isFriend: function (json_str) {
        CallJsRX().jsrx_isFriend(UTF8ToString(json_str));
    },

    rx_friends: function () {
        CallJsRX().jsrx_friends();
    },

    rx_addScore: function (json_str) {
        CallJsRX().jsrx_addScore(UTF8ToString(json_str));
    },

    rx_setScore: function (json_str) {
        CallJsRX().jsrx_setScore(UTF8ToString(json_str));
    },

    rx_queryUserRank: function (json_str) {
        CallJsRX().jsrx_queryUserRank(UTF8ToString(json_str));
    },

    rx_getRankList: function (json_str) {
        CallJsRX().jsrx_getRankList(UTF8ToString(json_str));
    },

    rx_friendsRank: function (json_str) {
        CallJsRX().jsrx_friendsRank(UTF8ToString(json_str));
    },

    rx_getBusinessData: function (json_str) {
        CallJsRX().jsrx_getBusinessData(UTF8ToString(json_str));
    },

    rx_getAllBusinessData: function () {
        CallJsRX().jsrx_getAllBusinessData();
    },

    rx_requestBusinessOrder: function (json_str) {
        CallJsRX().jsrx_requestBusinessOrder(UTF8ToString(json_str));
    },

    rx_refreshBusinessData: function () {
        CallJsRX().jsrx_refreshBusinessData();
    },

    rx_track: function (json_str) {
        CallJsRX().jsrx_track(UTF8ToString(json_str));
    },

    rx_setPublicProperties: function (json_str) {
        CallJsRX().jsrx_setPublicProperties(UTF8ToString(json_str));
    },

    rx_updatePublicProperties: function (json_str) {
        CallJsRX().jsrx_updatePublicProperties(UTF8ToString(json_str));
    },

    rx_deletePublicProperties: function (json_str) {
        CallJsRX().jsrx_deletePublicProperties(UTF8ToString(json_str));
    },

    rx_createFeedback: function (json_str) {
        CallJsRX().jsrx_createFeedback(UTF8ToString(json_str));
    },

    rx_getFeedbackKindList: function () {
        CallJsRX().jsrx_getFeedbackKindList();
    },

    rx_satisfactionEvaluation: function (json_str) {
        CallJsRX().jsrx_satisfactionEvaluation(UTF8ToString(json_str));
    },

    rx_checkAppVersion: function (json_str) {
        CallJsRX().jsrx_checkAppVersion(UTF8ToString(json_str));
    },

    rx_checkVersion: function (json_str) {
        CallJsRX().jsrx_checkVersion(UTF8ToString(json_str));
    },

    rx_checkGameVersion: function (json_str) {
        CallJsRX().jsrx_checkGameVersion(UTF8ToString(json_str));
    },

    rx_updateGameVersion: function (json_str) {
        CallJsRX().jsrx_updateGameVersion(UTF8ToString(json_str));
    },

    rx_checkActivityVersion: function (json_str) {
        CallJsRX().jsrx_checkActivityVersion(UTF8ToString(json_str));
    },

    rx_interstitialAd: function (json_str) {
        CallJsRX().jsrx_interstitialAd(UTF8ToString(json_str));
    },

    rx_bannerAd: function (json_str) {
        CallJsRX().jsrx_bannerAd(UTF8ToString(json_str));
    },

    rx_rewardedVideoAd: function (json_str) {
        CallJsRX().jsrx_rewardedVideoAd(UTF8ToString(json_str));
    },

    rx_getUserInteractiveStorage: function (json_str) {
        CallJsRX().jsrx_getUserInteractiveStorage(UTF8ToString(json_str));
    },

    rx_getGameClubData: function (json_str) {
        CallJsRX().jsrx_getGameClubData(UTF8ToString(json_str));
    },

    rx_setUserCloudStorage: function (json_str) {
        CallJsRX().jsrx_setUserCloudStorage(UTF8ToString(json_str));
    },

    rx_getUserCloudStorage: function (json_str) {
        CallJsRX().jsrx_getUserCloudStorage(UTF8ToString(json_str));
    },

    rx_removeUserCloudStorage: function (json_str) {
        CallJsRX().jsrx_removeUserCloudStorage(UTF8ToString(json_str));
    },

    rx_getUserCloudStorageKeys: function () {
        CallJsRX().jsrx_getUserCloudStorageKeys();
    },

    rx_getFriendCloudStorage: function (json_str) {
        CallJsRX().jsrx_getFriendCloudStorage(UTF8ToString(json_str));
    },

    rx_getPotentialFriendList: function () {
        CallJsRX().jsrx_getPotentialFriendList();
    },

    rx_getRelationFriendList: function (json_str) {
        CallJsRX().jsrx_getRelationFriendList(UTF8ToString(json_str));
    },

    rx_openCustomerServiceConversation: function (json_str) {
        CallJsRX().jsrx_openCustomerServiceConversation(UTF8ToString(json_str));
    },

    rx_msgSecCheck: function (json_str) {
        CallJsRX().jsrx_msgSecCheck(UTF8ToString(json_str));
    },

    rx_mediaCheckAsync: function (json_str) {
        CallJsRX().jsrx_mediaCheckAsync(UTF8ToString(json_str));
    },

    rx_compensatePayOrder: function (json_str) {
        CallJsRX().jsrx_compensatePayOrder(UTF8ToString(json_str));
    },

    rx_checkHasCompensatePayOrder: function () {
        CallJsRX().jsrx_checkHasCompensatePayOrder();
    },

    rx_getUserDeviceCode: function () {
        CallJsRX().jsrx_getUserDeviceCode();
    },
     
    rx_validateUnbindCode: function (json_str) {
        CallJsRX().jsrx_validateUnbindCode(UTF8ToString(json_str));
    },
    
    rx_changePhone: function (json_str) {
        CallJsRX().jsrx_changePhone(UTF8ToString(json_str));
    },
    
    rx_getPhoneNumber: function (json_str) {
        CallJsRX().jsrx_getPhoneNumber(UTF8ToString(json_str));
    },
    
    rx_changePhoneNumber: function (json_str) {
        CallJsRX().jsrx_changePhoneNumber(UTF8ToString(json_str));
    },
    
    rx_schedulingAction: function (json_str) {
        CallJsRX().jsrx_schedulingAction(UTF8ToString(json_str));
    },
    
    rx_showShareImageMenu: function (json_str) {
        CallJsRX().jsrx_showShareImageMenu(UTF8ToString(json_str));
    },
    
    rx_shareMessageToFriend: function (json_str) {
        CallJsRX().jsrx_shareMessageToFriend(UTF8ToString(json_str));
    },
    
    rx_fetchMessageToFriendQuery: function (json_str) {
        CallJsRX().jsrx_fetchMessageToFriendQuery(UTF8ToString(json_str));
    },
    
    rx_createActivityId: function (json_str) {
        CallJsRX().jsrx_createActivityId(UTF8ToString(json_str));
    },
    
    rx_dynamicShare: function (json_str) {
        CallJsRX().jsrx_dynamicShare(UTF8ToString(json_str));
    },
    
    rx_getDynamicShareActivityId: function () {
        CallJsRX().jsrx_getDynamicShareActivityId();
    },
    
    rx_setDynamicShareMsg: function () {
        CallJsRX().jsrx_setDynamicShareMsg();
    },
    
    rx_requestSubscribeMessage: function (json_str) {
        CallJsRX().jsrx_requestSubscribeMessage(UTF8ToString(json_str));
    },
    
    rx_getAnnouncement: function (limit) {
         CallJsRX().jsrx_getAnnouncement(limit);
    },
    
    rx_createCustomAd: function (json_str) {
         CallJsRX().jsrx_createCustomAd(UTF8ToString(json_str));
    },
    
    rx_getEmailList: function (json_str) {
         CallJsRX().jsrx_getEmailList(UTF8ToString(json_str));
    },
    
    rx_getEmailDetail: function (json_str) {
         CallJsRX().jsrx_getEmailDetail(UTF8ToString(json_str));
    },
    
    rx_receiveEmail: function (json_str) {
         CallJsRX().jsrx_receiveEmail(UTF8ToString(json_str));
    },
    
    rx_delEmail: function (json_str) {
         CallJsRX().jsrx_delEmail(UTF8ToString(json_str));
    },
    
    rx_addFeedback: function (json_str) {
         CallJsRX().jsrx_addFeedback(UTF8ToString(json_str));
    },
    
    rx_getFeedbackList: function (json_str) {
         CallJsRX().jsrx_getFeedbackList(UTF8ToString(json_str));
    },
    
    rx_getFeedbackDetail: function (json_str) {
         CallJsRX().jsrx_getFeedbackDetail(UTF8ToString(json_str));
    },
    
    rx_collectProps: function (json_str) {
         CallJsRX().jsrx_collectProps(UTF8ToString(json_str));
    },
    
    rx_getPromoDisplayKEY: function () {
         CallJsRX().jsrx_getPromoDisplayKEY();
    },
    
    rx_exchangePromoCDKEY: function (cdkey) {
         CallJsRX().jsrx_exchangePromoCDKEY(UTF8ToString(cdkey));
    },
    
     rx_reportCreateRole: function (roleid) {
             CallJsRX().jsrx_reportCreateRole(UTF8ToString(roleid));
     },
        
     rx_reportPurchase: function (amount, needReportMidas) {
             CallJsRX().jsrx_reportPurchase(amount, needReportMidas);
     },
     
     rx_reportUpdateLevel: function (json_str) {
             CallJsRX().jsrx_reportUpdateLevel(UTF8ToString(json_str));
     },
     
     rx_reportTutorialFinish: function () {
              CallJsRX().jsrx_reportTutorialFinish();
     },
          
     rx_reportViewContent: function (item) {
              CallJsRX().jsrx_reportViewContent(UTF8ToString(item));
     },

     rx_reportGdt: function (action_type, action_param_json) {
              CallJsRX().jsrx_reportGdt(
                  UTF8ToString(action_type),
                  UTF8ToString(action_param_json)
              );
     },

     rx_registerGdtMenuEventListeners: function () {
              CallJsRX().jsrx_registerGdtMenuEventListeners();
     },
     
     rx_setGameInfo: function (role_id, region_tag) {
              CallJsRX().jsrx_setGameInfo(UTF8ToString(role_id), UTF8ToString(region_tag));
     },
     
     rx_searchGameAccount: function () {
              CallJsRX().jsrx_searchGameAccount();
     },

     rx_getDirectAdStatusSync: function () {
              var str = CallJsRX().jsrx_getDirectAdStatusSync();
              var size = lengthBytesUTF8(str) + 1;
              var buffer = _malloc(size);
              stringToUTF8(str, buffer, size);
              return buffer;
     },

     rx_onDirectAdStatusChange: function () {
              CallJsRX().jsrx_onDirectAdStatusChange();
     },
};

autoAddDeps(RxJsBridgeLib, '$CallJsRX');
mergeInto(LibraryManager.library, RxJsBridgeLib);