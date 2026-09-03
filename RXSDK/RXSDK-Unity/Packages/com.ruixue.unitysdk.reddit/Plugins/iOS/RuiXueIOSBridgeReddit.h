#ifndef __RuiXue__IOSBridge__Reddit__
#define __RuiXue__IOSBridge__Reddit__


extern "C"
{

// reddit初始化设置应用id与重定向网址
void iOS_reddit_init(const char* clientID, const char* redirectURI);

}

#endif
