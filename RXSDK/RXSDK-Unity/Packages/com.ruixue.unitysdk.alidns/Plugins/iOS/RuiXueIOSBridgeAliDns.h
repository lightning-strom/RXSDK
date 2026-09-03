#ifndef __RuiXue__IOSBridge__AliDns__
#define __RuiXue__IOSBridge__AliDns__


extern "C"
{
//阿里DNS初始化
void ios_AliDns_initWithAppID(const char* accountID, const char* secretKey, bool debug);

}

#endif
