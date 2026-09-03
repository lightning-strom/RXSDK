#ifndef __RuiXue__IOSBridge__LBS__
#define __RuiXue__IOSBridge__LBS__


extern "C"
{
typedef void (*RequestLocationAuthoriaztionCallBack)(bool authorization);

// 注册高德key
void ios_lbs_registeAMWithAppkey(const char* appkey);

// 判断定位权限
bool ios_lbs_enableLocationAuthorizationStatus();

// 请求定位权限
void ios_lbs_requestLocationAuthorization(RequestLocationAuthoriaztionCallBack requestCallBack);

// 获取位置信息
void ios_lbs_getLocationInfo(RequestResponseCallBack onSuccess, RequestErrorCallBack onError);

// 是否允许后台定位  默认为NO不开启后台定位
void ios_lbs_setAllowsBackgroundLocationUpdates(bool allow);

// 设置定位超时时间  默认为2秒
void ios_lbs_setLocationTimeout(int timeout);
}

#endif
