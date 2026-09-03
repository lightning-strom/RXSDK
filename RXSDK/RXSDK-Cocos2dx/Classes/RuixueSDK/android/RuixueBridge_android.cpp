/**
 * RuixueBridge_android.cpp
 * 瑞雪 SDK Android 平台实现 - JNI 桥接
 * 
 * 模块化设计：
 * - 核心方法调用 com/ruixue/sdk/RuixueSDK（必选）
 * - UI 方法调用 com/ruixue/sdk/RuixueSDKUI（可选，需引入 rxsdk_base_ui）
 * - 支付方法调用 com/ruixue/sdk/RuixueSDKPay（可选，需引入支付库）
 * - 分享方法调用 com/ruixue/sdk/RuixueSDKShare（可选，需引入分享库）
 * 
 * 如果可选模块的 Java 类不存在，getStaticMethodInfo 返回 false，
 * 会通过 callback 返回模块不可用的错误 JSON，不会崩溃。
 */

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

#include "../RuixueBridge.h"
#include "platform/android/jni/JniHelper.h"
#include "cocos2d.h"
#include <jni.h>

USING_NS_CC;

// Java 类路径
static const char* JAVA_CLASS = "com/ruixue/sdk/RuixueSDK";
static const char* JAVA_UI_CLASS = "com/ruixue/sdk/RuixueSDKUI";
static const char* JAVA_PAY_CLASS = "com/ruixue/sdk/RuixueSDKPay";
static const char* JAVA_SHARE_CLASS = "com/ruixue/sdk/RuixueSDKShare";

// 模块不可用时的错误响应模板
static const char* MODULE_NOT_AVAILABLE_UI = R"({"code":-2,"msg":"UI module not available. Please add rxsdk_base_ui dependency and include RuixueSDKUI.java.","data":{}})";
static const char* MODULE_NOT_AVAILABLE_PAY = R"({"code":-2,"msg":"Pay module not available. Please add payment dependency and include RuixueSDKPay.java.","data":{}})";
static const char* MODULE_NOT_AVAILABLE_SHARE = R"({"code":-2,"msg":"Share module not available. Please add share dependency and include RuixueSDKShare.java.","data":{}})";

namespace ruixue {

// ==================== 核心模块（com/ruixue/sdk/RuixueSDK） ====================

void RuixueBridge::init(const std::string& paramsJson, ResultCallback callback) {
    _initCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    CCLOG("RuixueBridge::init with paramsJson");
    
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_CLASS, "init", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        CCLOG("RuixueBridge::init: getStaticMethodInfo failed");
        callback(R"({"code":-1,"msg":"Core SDK module not found. Check RuixueSDK.java.","data":{}})");
    }
}

void RuixueBridge::initThirdSdk(const std::string& paramsJson, ResultCallback callback) {
    _initThirdSdkCallback = callback;
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_CLASS,
            "initThirdSdk", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(
            methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        callback(R"({"code":-1,"msg":"Core SDK module not found.","data":{}})");
    }
}

void RuixueBridge::login(const std::string& paramsJson, ResultCallback callback) {
    _loginCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_CLASS, "login", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        callback(R"({"code":-1,"msg":"Core SDK module not found.","data":{}})");
    }
}

void RuixueBridge::logout(ResultCallback callback) {
    _logoutCallback = callback;
    _loggedIn = false;
    _userId = "";
    _token = "";
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_CLASS, "logout", "()V")) {
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    }
}

void RuixueBridge::exitApp(ResultCallback callback) {
    _exitAppCallback = callback;

    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(
            methodInfo, JAVA_CLASS, "exitApp", "()V")) {
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else if (callback) {
        callback(R"({"code":-1,"msg":"Core SDK exitApp method not found.","data":{}})");
    }
}

void RuixueBridge::getUserInfo(ResultCallback callback) {
    _userInfoCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_CLASS, "getUserInfo", "()V")) {
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    }
}

void RuixueBridge::getUserInfoByField(const std::string& paramsJson, ResultCallback callback) {
    _userInfoByFieldCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_CLASS, "getUserInfoByField", "(Ljava/lang/String;)V")) {
        jstring jParams = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParams);
        methodInfo.env->DeleteLocalRef(jParams);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    }
}

std::string RuixueBridge::getDeviceInfo() {
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_CLASS, "getDeviceInfo", "()Ljava/lang/String;")) {
        jstring jResult = (jstring)methodInfo.env->CallStaticObjectMethod(methodInfo.classID, methodInfo.methodID);
        std::string result = cocos2d::JniHelper::jstring2string(jResult);
        methodInfo.env->DeleteLocalRef(jResult);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
        return result;
    }
    return "{}";
}

float RuixueBridge::getTopSafeArea() {
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_CLASS, "getTopSafeArea", "()F")) {
        jfloat result = methodInfo.env->CallStaticFloatMethod(methodInfo.classID, methodInfo.methodID);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
        return (float)result;
    }
    return 0.0f;
}

// ==================== 账号扩展（注册/验证码/实名/绑定查询） ====================

#define JNI_CALL_CORE_STRING(method, action, callbackField) \
    callbackField = callback; \
    cocos2d::JniMethodInfo mi; \
    if (cocos2d::JniHelper::getStaticMethodInfo(mi, JAVA_CLASS, method, "(Ljava/lang/String;)V")) { \
        jstring js = mi.env->NewStringUTF(paramsJson.c_str()); \
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID, js); \
        mi.env->DeleteLocalRef(js); mi.env->DeleteLocalRef(mi.classID); \
    } else { callback(R"({"code":-1,"msg":"Method not found","data":{}})"); }

#define JNI_CALL_CORE_VOID(method, action, callbackField) \
    callbackField = callback; \
    cocos2d::JniMethodInfo mi; \
    if (cocos2d::JniHelper::getStaticMethodInfo(mi, JAVA_CLASS, method, "()V")) { \
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID); \
        mi.env->DeleteLocalRef(mi.classID); \
    } else { callback(R"({"code":-1,"msg":"Method not found","data":{}})"); }

void RuixueBridge::registerAccount(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("registerAccount", "register", _registerCallback)
}

void RuixueBridge::sendCaptcha(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("sendCaptcha", "sendCaptcha", _sendCaptchaCallback)
}

void RuixueBridge::realAuth(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("realAuth", "realAuth", _realAuthCallback)
}

void RuixueBridge::getIIFAARedirectURL(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("getIIFAARedirectURL", "getIIFAARedirectURL", _getIIFAARedirectURLCallback)
}

void RuixueBridge::searchBindingAccounts(ResultCallback callback) {
    JNI_CALL_CORE_VOID("searchBindingAccounts", "searchBindingAccounts", _searchBindingCallback)
}

void RuixueBridge::updateGameVersion(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("updateGameVersion", "updateGameVersion", _updateGameVersionCallback)
}

// ==================== 游戏区服/角色 ====================

void RuixueBridge::createGameArea(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("createGameArea", "createGameArea", _createGameAreaCallback)
}

void RuixueBridge::searchGameAreaList(ResultCallback callback) {
    JNI_CALL_CORE_VOID("searchGameAreaList", "searchGameAreaList", _searchGameAreaListCallback)
}

void RuixueBridge::searchGameAreaInfo(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("searchGameAreaInfo", "searchGameAreaInfo", _searchGameAreaInfoCallback)
}

void RuixueBridge::createGameCharacter(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("createGameCharacter", "createGameCharacter", _createGameCharacterCallback)
}

void RuixueBridge::searchGameCharacterList(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("searchGameCharacterList", "searchGameCharacterList", _searchCharacterListCallback)
}

void RuixueBridge::searchGameCharacterInfo(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("searchGameCharacterInfo", "searchGameCharacterInfo", _searchCharacterInfoCallback)
}

void RuixueBridge::updateGameCharacter(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("updateGameCharacter", "updateGameCharacter", _updateCharacterCallback)
}

void RuixueBridge::deleteGameCharacter(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("deleteGameCharacter", "deleteGameCharacter", _deleteCharacterCallback)
}

void RuixueBridge::setGameInfo(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("setGameInfo", "setGameInfo", _setGameInfoCallback)
}

void RuixueBridge::invokeChannelAction(const std::string& action,
                                       const std::string& paramsJson,
                                       ResultCallback callback) {
    _channelActionCallback = callback;
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(
            methodInfo, JAVA_CLASS, "invokeChannelAction",
            "(Ljava/lang/String;Ljava/lang/String;)V")) {
        jstring jAction = methodInfo.env->NewStringUTF(action.c_str());
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(
            methodInfo.classID, methodInfo.methodID, jAction, jParamsJson);
        methodInfo.env->DeleteLocalRef(jAction);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        CCLOG("RuixueBridge::invokeChannelAction: method not found");
        if (callback) {
            callback(R"({"code":-1,"msg":"Method not found","data":{}})");
        }
    }
}

// ==================== GDT 转化归因 ====================

void RuixueBridge::gdtRegisterSdk() {
    cocos2d::JniMethodInfo mi;
    if (cocos2d::JniHelper::getStaticMethodInfo(mi, JAVA_CLASS, "gdtRegisterSdk", "()V")) {
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID);
        mi.env->DeleteLocalRef(mi.classID);
    }
}

void RuixueBridge::gdtInitialize(const std::string& actionSetId, const std::string& secretKey,
                                 const std::string& channel, const std::string& channelId) {
    cocos2d::JniMethodInfo mi;
    const char* signature =
        "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
    if (cocos2d::JniHelper::getStaticMethodInfo(mi, JAVA_CLASS, "gdtInitialize", signature)) {
        jstring sid = mi.env->NewStringUTF(actionSetId.c_str());
        jstring sk = mi.env->NewStringUTF(secretKey.c_str());
        jstring ch = mi.env->NewStringUTF(channel.c_str());
        jstring chid = mi.env->NewStringUTF(channelId.c_str());
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID, sid, sk, ch, chid);
        mi.env->DeleteLocalRef(sid);
        mi.env->DeleteLocalRef(sk);
        mi.env->DeleteLocalRef(ch);
        mi.env->DeleteLocalRef(chid);
        mi.env->DeleteLocalRef(mi.classID);
    }
}

void RuixueBridge::gdtReportRegister(const std::string& method, bool success) {
    cocos2d::JniMethodInfo mi;
    if (cocos2d::JniHelper::getStaticMethodInfo(
            mi, JAVA_CLASS, "gdtReportRegister", "(Ljava/lang/String;Z)V")) {
        jstring value = mi.env->NewStringUTF(method.c_str());
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID, value, (jboolean)success);
        mi.env->DeleteLocalRef(value);
        mi.env->DeleteLocalRef(mi.classID);
    }
}

void RuixueBridge::gdtReportLogin(const std::string& method, bool success) {
    cocos2d::JniMethodInfo mi;
    if (cocos2d::JniHelper::getStaticMethodInfo(
            mi, JAVA_CLASS, "gdtReportLogin", "(Ljava/lang/String;Z)V")) {
        jstring value = mi.env->NewStringUTF(method.c_str());
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID, value, (jboolean)success);
        mi.env->DeleteLocalRef(value);
        mi.env->DeleteLocalRef(mi.classID);
    }
}

void RuixueBridge::gdtReportCreateRole(const std::string& role) {
    cocos2d::JniMethodInfo mi;
    if (cocos2d::JniHelper::getStaticMethodInfo(
            mi, JAVA_CLASS, "gdtReportCreateRole", "(Ljava/lang/String;)V")) {
        jstring value = mi.env->NewStringUTF(role.c_str());
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID, value);
        mi.env->DeleteLocalRef(value);
        mi.env->DeleteLocalRef(mi.classID);
    }
}

void RuixueBridge::gdtReportCheckout(const std::string& type, const std::string& name,
                                     const std::string& contentId, int number,
                                     bool isVirtualCurrency,
                                     const std::string& virtualCurrencyType,
                                     const std::string& currency, bool success) {
    cocos2d::JniMethodInfo mi;
    const char* signature =
        "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;IZ"
        "Ljava/lang/String;Ljava/lang/String;Z)V";
    if (cocos2d::JniHelper::getStaticMethodInfo(
            mi, JAVA_CLASS, "gdtReportCheckout", signature)) {
        jstring jType = mi.env->NewStringUTF(type.c_str());
        jstring jName = mi.env->NewStringUTF(name.c_str());
        jstring jId = mi.env->NewStringUTF(contentId.c_str());
        jstring jVirtualType = mi.env->NewStringUTF(virtualCurrencyType.c_str());
        jstring jCurrency = mi.env->NewStringUTF(currency.c_str());
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID, jType, jName, jId, (jint)number,
                                     (jboolean)isVirtualCurrency, jVirtualType, jCurrency,
                                     (jboolean)success);
        mi.env->DeleteLocalRef(jType);
        mi.env->DeleteLocalRef(jName);
        mi.env->DeleteLocalRef(jId);
        mi.env->DeleteLocalRef(jVirtualType);
        mi.env->DeleteLocalRef(jCurrency);
        mi.env->DeleteLocalRef(mi.classID);
    }
}

void RuixueBridge::gdtReportPurchase(const std::string& goodsType,
                                     const std::string& goodsName,
                                     const std::string& goodsId, int number,
                                     const std::string& goodsChannel,
                                     const std::string& currency,
                                     int valueInCents, bool success) {
    cocos2d::JniMethodInfo mi;
    const char* signature =
        "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I"
        "Ljava/lang/String;Ljava/lang/String;IZ)V";
    if (cocos2d::JniHelper::getStaticMethodInfo(
            mi, JAVA_CLASS, "gdtReportPurchase", signature)) {
        jstring jType = mi.env->NewStringUTF(goodsType.c_str());
        jstring jName = mi.env->NewStringUTF(goodsName.c_str());
        jstring jId = mi.env->NewStringUTF(goodsId.c_str());
        jstring jChannel = mi.env->NewStringUTF(goodsChannel.c_str());
        jstring jCurrency = mi.env->NewStringUTF(currency.c_str());
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID, jType, jName, jId, (jint)number,
                                     jChannel, jCurrency, (jint)valueInCents,
                                     (jboolean)success);
        mi.env->DeleteLocalRef(jType);
        mi.env->DeleteLocalRef(jName);
        mi.env->DeleteLocalRef(jId);
        mi.env->DeleteLocalRef(jChannel);
        mi.env->DeleteLocalRef(jCurrency);
        mi.env->DeleteLocalRef(mi.classID);
    }
}

void RuixueBridge::gdtReportQuestFinish(const std::string& id, const std::string& type,
                                        const std::string& name, int number,
                                        const std::string& description, bool success) {
    cocos2d::JniMethodInfo mi;
    const char* signature =
        "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I"
        "Ljava/lang/String;Z)V";
    if (cocos2d::JniHelper::getStaticMethodInfo(
            mi, JAVA_CLASS, "gdtReportQuestFinish", signature)) {
        jstring jId = mi.env->NewStringUTF(id.c_str());
        jstring jType = mi.env->NewStringUTF(type.c_str());
        jstring jName = mi.env->NewStringUTF(name.c_str());
        jstring jDescription = mi.env->NewStringUTF(description.c_str());
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID, jId, jType, jName, (jint)number,
                                     jDescription, (jboolean)success);
        mi.env->DeleteLocalRef(jId);
        mi.env->DeleteLocalRef(jType);
        mi.env->DeleteLocalRef(jName);
        mi.env->DeleteLocalRef(jDescription);
        mi.env->DeleteLocalRef(mi.classID);
    }
}

void RuixueBridge::gdtReportShare(const std::string& channel, bool success) {
    cocos2d::JniMethodInfo mi;
    if (cocos2d::JniHelper::getStaticMethodInfo(
            mi, JAVA_CLASS, "gdtReportShare", "(Ljava/lang/String;Z)V")) {
        jstring value = mi.env->NewStringUTF(channel.c_str());
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID, value, (jboolean)success);
        mi.env->DeleteLocalRef(value);
        mi.env->DeleteLocalRef(mi.classID);
    }
}

void RuixueBridge::gdtReportUpdateLevel(int level) {
    cocos2d::JniMethodInfo mi;
    if (cocos2d::JniHelper::getStaticMethodInfo(mi, JAVA_CLASS, "gdtReportUpdateLevel", "(I)V")) {
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID, (jint)level);
        mi.env->DeleteLocalRef(mi.classID);
    }
}

void RuixueBridge::gdtReportRateApp(float value) {
    cocos2d::JniMethodInfo mi;
    if (cocos2d::JniHelper::getStaticMethodInfo(mi, JAVA_CLASS, "gdtReportRateApp", "(F)V")) {
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID, (jfloat)value);
        mi.env->DeleteLocalRef(mi.classID);
    }
}

void RuixueBridge::gdtReportViewContent(const std::string& type, const std::string& name,
                                        const std::string& contentId) {
    cocos2d::JniMethodInfo mi;
    const char* signature =
        "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
    if (cocos2d::JniHelper::getStaticMethodInfo(
            mi, JAVA_CLASS, "gdtReportViewContent", signature)) {
        jstring jType = mi.env->NewStringUTF(type.c_str());
        jstring jName = mi.env->NewStringUTF(name.c_str());
        jstring jId = mi.env->NewStringUTF(contentId.c_str());
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID, jType, jName, jId);
        mi.env->DeleteLocalRef(jType);
        mi.env->DeleteLocalRef(jName);
        mi.env->DeleteLocalRef(jId);
        mi.env->DeleteLocalRef(mi.classID);
    }
}

void RuixueBridge::gdtReportAddToCart(const std::string& type, const std::string& name,
                                      const std::string& contentId, int number, bool success) {
    cocos2d::JniMethodInfo mi;
    const char* signature =
        "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;IZ)V";
    if (cocos2d::JniHelper::getStaticMethodInfo(
            mi, JAVA_CLASS, "gdtReportAddToCart", signature)) {
        jstring jType = mi.env->NewStringUTF(type.c_str());
        jstring jName = mi.env->NewStringUTF(name.c_str());
        jstring jId = mi.env->NewStringUTF(contentId.c_str());
        mi.env->CallStaticVoidMethod(mi.classID, mi.methodID, jType, jName, jId, (jint)number,
                                     (jboolean)success);
        mi.env->DeleteLocalRef(jType);
        mi.env->DeleteLocalRef(jName);
        mi.env->DeleteLocalRef(jId);
        mi.env->DeleteLocalRef(mi.classID);
    }
}

// ==================== 数据埋点 ====================

void RuixueBridge::getDistinctId(ResultCallback callback) {
    JNI_CALL_CORE_VOID("getDistinctId", "getDistinctId", _getDistinctIdCallback)
}

void RuixueBridge::dataTrack(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("dataTrack", "dataTrack", _dataTrackCallback)
}

void RuixueBridge::trackUserAction(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("trackUserAction", "trackUserAction", _trackUserActionCallback)
}

// ==================== 反馈/达人福利 ====================

void RuixueBridge::createFeedback(const std::string& paramsJson, ResultCallback callback) {
    JNI_CALL_CORE_STRING("createFeedback", "createFeedback", _createFeedbackCallback)
}

void RuixueBridge::getTempNotice(ResultCallback callback) {
    JNI_CALL_CORE_VOID("getTempNotice", "getTempNotice", _tempNoticeCallback)
}

void RuixueBridge::getUnreadMessageCount(ResultCallback callback) {
    JNI_CALL_CORE_VOID("getUnreadMessageCount", "getUnreadMsgCount", _unreadMsgCountCallback)
}

void RuixueBridge::getPromoDisplayKey(ResultCallback callback) {
    JNI_CALL_CORE_VOID("getPromoDisplayKey", "getPromoDisplayKey", _promoDisplayKeyCallback)
}

// ==================== UI 模块（com/ruixue/sdk/RuixueSDKUI） ====================

void RuixueBridge::showLoginUI(const std::string& paramsJson, ResultCallback callback) {
    _loginCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_UI_CLASS, "showLoginUI", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        CCLOG("RuixueBridge::showLoginUI: UI module not available");
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showUserCenter(const std::string& paramsJson, ResultCallback callback) {
    _userCenterCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_UI_CLASS, "showUserCenter", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showResetPasswordUI(const std::string& paramsJson, ResultCallback callback) {
    _resetPasswordCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_UI_CLASS, "showResetPasswordUI", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showRealNameAuthUI(const std::string& paramsJson, ResultCallback callback) {
    _realNameAuthCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_UI_CLASS, "showRealNameAuthUI", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showBindPhoneUI(ResultCallback callback) {
    _bindPhoneCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_UI_CLASS, "showBindPhoneUI", "()V")) {
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showDeleteAccountUI(const std::string& paramsJson, ResultCallback callback) {
    _deleteAccountCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_UI_CLASS, "showDeleteAccountUI", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showCancelDeleteUI(const std::string& paramsJson, ResultCallback callback) {
    _cancelDeleteCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_UI_CLASS, "showCancelDeleteUI", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showProtocolUI(const std::string& paramsJson) {
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_UI_CLASS, "showProtocolUI", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        CCLOG("RuixueBridge::showProtocolUI: UI module not available");
    }
}

void RuixueBridge::showAntiAddictionUI(const std::string& paramsJson, ResultCallback callback) {
    _antiAddictionCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_UI_CLASS, "showAntiAddictionUI", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showMailCenterUI(const std::string& paramsJson, ResultCallback callback) {
    _mailCenterCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_UI_CLASS, "showMailCenterUI", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showAnnouncementUI(const std::string& paramsJson, ResultCallback callback) {
    _announcementCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_UI_CLASS, "showAnnouncementUI", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showVersionUpdateUI(const std::string& paramsJson, ResultCallback callback) {
    _versionUpdateCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_UI_CLASS, "showVersionUpdateUI", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

void RuixueBridge::showHelpCenterUI(const std::string& paramsJson, ResultCallback callback) {
    _helpCenterCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_UI_CLASS, "showHelpCenterUI", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        callback(MODULE_NOT_AVAILABLE_UI);
    }
}

// ==================== 支付模块（com/ruixue/sdk/RuixueSDKPay） ====================

void RuixueBridge::pay(const std::string& paramsJson, ResultCallback callback) {
    _payCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_PAY_CLASS, "pay", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        CCLOG("RuixueBridge::pay: Pay module not available");
        callback(MODULE_NOT_AVAILABLE_PAY);
    }
}

// ==================== 分享模块（com/ruixue/sdk/RuixueSDKShare） ====================

void RuixueBridge::share(const std::string& paramsJson, ResultCallback callback) {
    _shareCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_SHARE_CLASS, "share", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        CCLOG("RuixueBridge::share: Share module not available");
        callback(MODULE_NOT_AVAILABLE_SHARE);
    }
}

void RuixueBridge::shareCustom(const std::string& paramsJson, ResultCallback callback) {
    _shareCustomCallback = callback;
    
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_SHARE_CLASS, "shareCustom", "(Ljava/lang/String;)V")) {
        jstring jParamsJson = methodInfo.env->NewStringUTF(paramsJson.c_str());
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, jParamsJson);
        methodInfo.env->DeleteLocalRef(jParamsJson);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        CCLOG("RuixueBridge::shareCustom: Share module not available");
        callback(MODULE_NOT_AVAILABLE_SHARE);
    }
}

void RuixueBridge::openCustomerService() {
    cocos2d::JniMethodInfo methodInfo;
    if (cocos2d::JniHelper::getStaticMethodInfo(methodInfo, JAVA_SHARE_CLASS, "openCustomerService", "()V")) {
        methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    } else {
        CCLOG("RuixueBridge::openCustomerService: Share module not available");
    }
}

} // namespace ruixue

// ==================== Java 调用 C++ (JNI 导出函数) ====================

extern "C" {

/**
 * 统一结果回调（由 RuixueSDK.java 核心类中的 nativeOnResult 触发）
 */
JNIEXPORT void JNICALL Java_com_ruixue_sdk_RuixueSDK_nativeOnResult(
    JNIEnv* env, jclass clazz, jstring action, jstring responseJson) {
    
    std::string strAction = cocos2d::JniHelper::jstring2string(action);
    std::string strResponseJson = cocos2d::JniHelper::jstring2string(responseJson);
    
    CCLOG("JNI nativeOnResult called, action=%s", strAction.c_str());
    ruixue::RuixueBridge::getInstance()->onResult(strAction, strResponseJson);
}

} // extern "C"

#endif // CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
