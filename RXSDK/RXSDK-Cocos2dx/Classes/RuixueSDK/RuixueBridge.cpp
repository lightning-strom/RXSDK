/**
 * RuixueBridge.cpp
 * 瑞雪 SDK C++ 桥接层 - 通用实现
 */

#include "RuixueBridge.h"
#include "cocos2d.h"

namespace ruixue {

// ==================== RuixueBridge 实现 ====================

RuixueBridge* RuixueBridge::_instance = nullptr;

RuixueBridge* RuixueBridge::getInstance() {
    if (_instance == nullptr) {
        _instance = new RuixueBridge();
    }
    return _instance;
}

void RuixueBridge::destroyInstance() {
    if (_instance != nullptr) {
        delete _instance;
        _instance = nullptr;
    }
}

RuixueBridge::RuixueBridge()
    : _initialized(false)
    , _loggedIn(false)
    , _userId("")
    , _token("")
    , _initCallback(nullptr)
    , _initThirdSdkCallback(nullptr)
    , _loginCallback(nullptr)
    , _userCenterCallback(nullptr)
    , _resetPasswordCallback(nullptr)
    , _realNameAuthCallback(nullptr)
    , _bindPhoneCallback(nullptr)
    , _deleteAccountCallback(nullptr)
    , _cancelDeleteCallback(nullptr)
    , _antiAddictionCallback(nullptr)
    , _mailCenterCallback(nullptr)
    , _announcementCallback(nullptr)
    , _versionUpdateCallback(nullptr)
    , _updateGameVersionCallback(nullptr)
    , _helpCenterCallback(nullptr)
    , _logoutCallback(nullptr)
    , _exitAppCallback(nullptr)
    , _userInfoCallback(nullptr)
    , _userInfoByFieldCallback(nullptr)
    , _payCallback(nullptr)
    , _shareCallback(nullptr)
    , _shareCustomCallback(nullptr)
    , _registerCallback(nullptr)
    , _sendCaptchaCallback(nullptr)
    , _realAuthCallback(nullptr)
    , _getIIFAARedirectURLCallback(nullptr)
    , _searchBindingCallback(nullptr)
    , _createGameAreaCallback(nullptr)
    , _searchGameAreaListCallback(nullptr)
    , _searchGameAreaInfoCallback(nullptr)
    , _createGameCharacterCallback(nullptr)
    , _searchCharacterListCallback(nullptr)
    , _searchCharacterInfoCallback(nullptr)
    , _updateCharacterCallback(nullptr)
    , _deleteCharacterCallback(nullptr)
    , _setGameInfoCallback(nullptr)
    , _channelActionCallback(nullptr)
    , _getDistinctIdCallback(nullptr)
    , _dataTrackCallback(nullptr)
    , _trackUserActionCallback(nullptr)
    , _createFeedbackCallback(nullptr)
    , _tempNoticeCallback(nullptr)
    , _unreadMsgCountCallback(nullptr)
    , _promoDisplayKeyCallback(nullptr)
{
}

RuixueBridge::~RuixueBridge() {
}

bool RuixueBridge::isInitialized() const {
    return _initialized;
}

bool RuixueBridge::isLoggedIn() const {
    return _loggedIn;
}

std::string RuixueBridge::getUserId() const {
    return _userId;
}

// ==================== 平台相关方法 ====================
// init, showLoginUI, login, pay, share 等方法的实现在平台特定文件中：
// - iOS: RuixueBridge_ios.mm
// - Android: RuixueBridge_android.cpp

// ==================== 统一回调处理 ====================

void RuixueBridge::onResult(const std::string& action, const std::string& responseJson) {
    CCLOG("RuixueBridge::onResult action=%s, response=%s", action.c_str(), responseJson.c_str());
    
    ResultCallback callback = nullptr;
    
    if (action == "init") {
        callback = _initCallback;
        // 简单解析 code 来判断是否成功（用于内部状态）
        // 这里只是简单检查，实际业务逻辑由调用方处理
        _initialized = (responseJson.find("\"code\":0") != std::string::npos || 
                       responseJson.find("\"code\": 0") != std::string::npos);
    } else if (action == "initThirdSdk") {
        callback = _initThirdSdkCallback;
    } else if (action == "login" || action == "showLoginUI") {
        callback = _loginCallback;
        bool success = (responseJson.find("\"code\":0") != std::string::npos || 
                       responseJson.find("\"code\": 0") != std::string::npos);
        _loggedIn = success;
        // TODO: 可以解析 openid 和 token 保存到 _userId 和 _token
    } else if (action == "userCenter") {
        callback = _userCenterCallback;
    } else if (action == "resetPassword") {
        callback = _resetPasswordCallback;
    } else if (action == "realNameAuth") {
        callback = _realNameAuthCallback;
    } else if (action == "bindPhone") {
        callback = _bindPhoneCallback;
    } else if (action == "deleteAccount") {
        callback = _deleteAccountCallback;
    } else if (action == "cancelDelete") {
        callback = _cancelDeleteCallback;
    } else if (action == "antiAddiction") {
        callback = _antiAddictionCallback;
    } else if (action == "mailCenter") {
        callback = _mailCenterCallback;
    } else if (action == "announcement") {
        callback = _announcementCallback;
    } else if (action == "versionUpdate") {
        callback = _versionUpdateCallback;
    } else if (action == "updateGameVersion") {
        callback = _updateGameVersionCallback;
    } else if (action == "helpCenter") {
        callback = _helpCenterCallback;
    } else if (action == "logout") {
        callback = _logoutCallback;
    } else if (action == "exitApp") {
        callback = _exitAppCallback;
    } else if (action == "userInfo") {
        callback = _userInfoCallback;
    } else if (action == "userInfoByField") {
        callback = _userInfoByFieldCallback;
    } else if (action == "pay") {
        callback = _payCallback;
    } else if (action == "share") {
        callback = _shareCallback;
    } else if (action == "shareCustom") {
        callback = _shareCustomCallback;
    } else if (action == "register") {
        callback = _registerCallback;
    } else if (action == "sendCaptcha") {
        callback = _sendCaptchaCallback;
    } else if (action == "realAuth") {
        callback = _realAuthCallback;
    } else if (action == "getIIFAARedirectURL") {
        callback = _getIIFAARedirectURLCallback;
    } else if (action == "searchBindingAccounts") {
        callback = _searchBindingCallback;
    } else if (action == "createGameArea") {
        callback = _createGameAreaCallback;
    } else if (action == "searchGameAreaList") {
        callback = _searchGameAreaListCallback;
    } else if (action == "searchGameAreaInfo") {
        callback = _searchGameAreaInfoCallback;
    } else if (action == "createGameCharacter") {
        callback = _createGameCharacterCallback;
    } else if (action == "searchGameCharacterList") {
        callback = _searchCharacterListCallback;
    } else if (action == "searchGameCharacterInfo") {
        callback = _searchCharacterInfoCallback;
    } else if (action == "updateGameCharacter") {
        callback = _updateCharacterCallback;
    } else if (action == "deleteGameCharacter") {
        callback = _deleteCharacterCallback;
    } else if (action == "setGameInfo") {
        callback = _setGameInfoCallback;
    } else if (action == "channelAction") {
        callback = _channelActionCallback;
    } else if (action == "getDistinctId") {
        callback = _getDistinctIdCallback;
    } else if (action == "dataTrack") {
        callback = _dataTrackCallback;
    } else if (action == "trackUserAction") {
        callback = _trackUserActionCallback;
    } else if (action == "createFeedback") {
        callback = _createFeedbackCallback;
    } else if (action == "getTempNotice") {
        callback = _tempNoticeCallback;
    } else if (action == "getUnreadMsgCount") {
        callback = _unreadMsgCountCallback;
    } else if (action == "getPromoDisplayKey") {
        callback = _promoDisplayKeyCallback;
    }
    
    if (callback) {
        // 确保在主线程执行回调
        cocos2d::Director::getInstance()->getScheduler()->performFunctionInCocosThread([callback, responseJson]() {
            callback(responseJson);
        });
    } else {
        CCLOG("RuixueBridge::onResult NO callback for action=%s", action.c_str());
    }
}

} // namespace ruixue
