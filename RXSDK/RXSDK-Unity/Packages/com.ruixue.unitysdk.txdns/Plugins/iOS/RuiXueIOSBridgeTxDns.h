#ifndef __RuiXue__IOSBridge__TxDns__
#define __RuiXue__IOSBridge__TxDns__


extern "C"
{
//腾讯DNS初始化
void ios_TxDns_initWithAppID(const char* appID, const char* dnsID, const char* dnsKey, bool debug);

}

#endif
