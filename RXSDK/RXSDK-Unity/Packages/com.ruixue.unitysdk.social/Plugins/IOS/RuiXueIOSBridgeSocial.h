#ifndef __RuiXue__IOSBridge__Social__
#define __RuiXue__IOSBridge__Social__

extern "C"
{
// 获取指定半径内的其他用户信息
void ios_social_getRadiusAccountWithLon(double lon,
                                        double lat,
                                        int radius,
                                        int count,
                                        int page,
                                        int page_size,
                                        const char* type,
                                        RequestResponseCallBack onSuccess,
                                        RequestErrorCallBack onError);

// 设置用户自定义信息
void ios_social_setUserCustomWithCustom(const char* custom,
                                        RequestResponseCallBack onSuccess,
                                        RequestErrorCallBack onError);

// 上报/更新经纬度坐标
void ios_social_lbsUpdateWithLon(double lon,
                                 double lat,
                                 const char* typesArryJson,
                                 RequestResponseCallBack onSuccess,
                                 RequestErrorCallBack onError);

// 删除经纬度坐标
void ios_social_deleteLocationWithTypes(const char* typesArryJson,
                                        RequestResponseCallBack onSuccess,
                                        RequestErrorCallBack onError);



// 添加自定义关系
void ios_social_addRelationWithTarget(const char* target,
                                      const char* typesDicJson,
                                      const char* target_remarks,
                                      const char* user_remarks,
                                      RequestResponseCallBack onSuccess,
                                      RequestErrorCallBack onError);

 // 删除自定义关系
void ios_social_deleteRelationWithTarget(const char* target,
                                         const char* typesDicJson,
                                         RequestResponseCallBack onSuccess,
                                         RequestErrorCallBack onError);


// 更新用户自定义关系备注
void ios_social_updateRemarksWithTarget(const char* target,
                                        const char* target_reamks,
                                        const char* type,
                                        RequestResponseCallBack onSuccess,
                                        RequestErrorCallBack onError);

// 获取自定义关系列表
void ios_social_getRelationListWithType(const char* type,
                                        RequestResponseCallBack onSuccess,
                                        RequestErrorCallBack onError);

// 判断两用户是否存在某自定关系
void ios_social_requestHasRelationWithTarget(const char* target,
                                             const char* type,
                                             RequestResponseCallBack onSuccess,
                                             RequestErrorCallBack onError);


// 添加好友
void ios_social_addFriendWithTarget(const char* target,
                                    const char* target_remarks,
                                    const char* user_remarks,
                                    RequestResponseCallBack onSuccess,
                                    RequestErrorCallBack onError);

// 删除好友
void ios_social_deleteFriendWithTarget(const char* target,
                                       RequestResponseCallBack onSuccess,
                                       RequestErrorCallBack onError);

// 更新好友备注
void ios_social_updateFriendRemarkWithTarget(const char* target,
                                             const char* target_remarks,
                                             RequestResponseCallBack onSuccess,
                                             RequestErrorCallBack onError);

// 获取好友列表
void ios_social_getFriendListWithComplete(RequestResponseCallBack onSuccess,
                                          RequestErrorCallBack onError);

// 判断两用户是否为好友
void ios_social_requestIsFriendWithTarget(const char* target,
                                          RequestResponseCallBack onSuccess,
                                          RequestErrorCallBack onError);
}

#endif
