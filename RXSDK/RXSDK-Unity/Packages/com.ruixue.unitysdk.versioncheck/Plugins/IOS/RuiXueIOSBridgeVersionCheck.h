#ifndef __RuiXue__IOSBridge__VersionCheck__
#define __RuiXue__IOSBridge__VersionCheck__


extern "C"
{

// 大厅更新检查（GET版本，不返回下载地址）
void ios_checkUpdate_App(const char* region,
                                   const char* client_version,
                                   const char* type,
                                   RequestResponseCallBack onSuccess,
                                   RequestErrorCallBack onError);

// 大厅更新检查（POST版本，返回下载地址）
void ios_checkUpdate_AppCustom(const char* region,
                                   const char* client_version,
                                   const char* games,
                                   const char* activities,
                                   const char* type,
                                   RequestResponseCallBack onSuccess,
                                   RequestErrorCallBack onError);

// 活动更新检查
void ios_checkUpdate_Activity(const char* game_version,
                              const char* game_check_version,
                              const char* short_name,
                              const char* type,
                              RequestResponseCallBack onSuccess,
                              RequestErrorCallBack onError);

// 游戏更新检查
void ios_checkUpdate_Game(const char* game_id,
                             const char* game_version,
                             const char* game_check_version,
                             const char* type,
                             RequestResponseCallBack onSuccess,
                             RequestErrorCallBack onError);

// 游戏版本检查 v2
void ios_updateGameVersion(const char* body,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError);

}

#endif
