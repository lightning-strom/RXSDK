## SDK 使用到的后端接口清单（从源码自动提取）

- **来源**：`RXApiPath`（SDK 真实调用的后端 path）
- **说明**：`needLoggedIn` 的默认值来自 `RXApiPath.needVerifyToken(apiPath)`（即：不在 IGNORE_TOKEN_ARRAY 列表里则默认需要登录）

### Root

| 常量 | path | 默认需登录 | 说明 |
|---|---|---:|---|
| `GET_IP` | `getip` | 否 |  |
| `CHAT_SERVICE` | `static/service#/welcome` | 是 |  |
| `BIND_ADID` | `v1/attribution/user/bind_adid` | 是 |  |
| `OSS_STS` | `/v1/thirdparty/api/oss_sts` | 是 |  |
| `EVENT_ATTRS` | `v1/sdkconfig/sync/event_attrs` | 否 |  |
| `SDKCONFIG_INIT` | `v1/sdkconfig/init` | 否 |  |
| `FEEDBACKAPI_KIND_LIST` | `v1/feedbackapi/kind/list` | 是 |  |
| `FEEDBACKAPI_PLAYER_CREATE` | `v1/feedbackapi/player/create` | 是 |  |
| `FEEDBACKAPI_PLEASED_UPDATE` | `v1/feedbackapi/pleased/update` | 是 |  |
| `REPORT_USERLOG` | `v1/feedbackapi/report/userlog` | 否 |  |
| `USER_REPORT` | `/v1/passport/user/report` | 是 |  |
| `PROMO_GET_API` | `v1/operationtoolsapi/exchange/game_display` | 是 |  |
| `PROMO_EXCHANGE` | `v1/operationtoolsapi/exchange/exchange` | 是 |  |
| `QUICK_AP_CHECK` | `v1/ke/ap/quick_ap_check` | 是 |  |
| `DATA_OPERATION_SCENE` | `v1/operationtoolsapi/user_data_operation_platform/scene/all` | 是 |  |
| `LEGAL` | `v1/operationapi/legal` | 否 | 法务数据 |
| `LEGAL_TERMS` | `v1/operationapi/legal/terms` | 是 |  |

### Data

| 常量 | path | 默认需登录 | 说明 |
|---|---|---:|---|
| `Data.TRACK_DATA_API` | `v1/data/api/track` | 是 | 埋点数据上报 |

### Passport

| 常量 | path | 默认需登录 | 说明 |
|---|---|---:|---|
| `Passport.FIRST_ACTIVATED` | `v1/attribution/user/activated` | 否 | 在用户首次打开应用注册账号前，需要调用本接口，每个用户仅需调用一次。此接口不只是用于采集广告投放效果，如果想要分析是否有用户打开了应用但最终没有注册账号，也需要接入此接口。 |
| `Passport.ACCOUNT_QUERY` | `v1/passport/user/query` | 否 | 查询用户拥有的账号 |
| `Passport.ACCOUNT_BOUND_QUERY` | `v1/passport/user/bound_accounts` | 是 |  |
| `Passport.REGISTER` | `v1/passport/account/register` | 否 | 注册 |
| `Passport.LOGIN` | `v1/passport/account/login_by_credential` | 否 | SDK登录 |
| `Passport.LOGIN_TOKEN` | `v1/passport/account/login_by_token` | 否 |  |
| `Passport.SEND_CAPTCHA` | `v1/passport/captcha/send` | 否 | 发送验证码 |
| `Passport.SEND_CAPTCHA_AUTH` | `v1/passport/captcha/send_auth` | 是 |  |
| `Passport.VERIFY_CAPTCHA` | `v1/passport/captcha/verify` | 是 | 校验验证码 |
| `Passport.REFRESH_TOKEN` | `v1/passport/token/refresh` | 否 | 刷新令牌 |
| `Passport.USER_INFO` | `v1/passport/user/get_info` | 是 | 获取用户信息 |
| `Passport.USER_INFO_BY_FIELD` | `v1/passport/user/info_by_field` | 是 | 获取指定用户信息 |
| `Passport.SYNC_INFO` | `v1/passport/user/sync_info` | 是 |  |
| `Passport.SYNC_APP_INFO` | `v1/passport/user/sync_app_info` | 是 |  |
| `Passport.UPDATE_USER` | `v1/passport/user/update_info` | 是 | 修改用户信息 |
| `Passport.BIND_PHONE` | `v1/passport/user/bind_phone` | 是 | 绑定手机号 |
| `Passport.UNBIND_PHONE` | `v1/passport/user/unbind_phone` | 是 | 解绑手机号 |
| `Passport.CHANGE_PHONE` | `v1/passport/user/change_phone` | 是 | 修改手机账号 |
| `Passport.CHANGE_EMAIL` | `v1/passport/user/change_email` | 是 |  |
| `Passport.BIND_EMAIL` | `v1/passport/user/bind_email` | 是 | 绑定邮箱 |
| `Passport.UNBIND_EMAIL` | `v1/passport/user/unbind_email` | 是 | 解绑邮箱 |
| `Passport.CHANGE_PWD` | `v1/passport/user/change_password` | 是 | 修改密码 |
| `Passport.RESET_PWD` | `v1/passport/user/reset_password` | 否 | 密码重置 |
| `Passport.CERTIFICATION` | `v1/passport/user/realauth` | 是 | 实名认证 |
| `Passport.USER_DEREGISTER` | `v1/passport/user/deregister` | 是 | 注销账号 |
| `Passport.USER_DEREGISTER_CANCEL` | `v1/passport/user/cancel_deregister` | 是 | 撤销账号注销申请 |
| `Passport.ACCOUNTGETSTATE` | `Landing/Account/GetState` | 是 | 查询游戏注销状态 |
| `Passport.ACCOUNTREVOKE` | `Landing/Account/Revoke` | 是 | 撤销注销申请 |

### Pay

| 常量 | path | 默认需登录 | 说明 |
|---|---|---:|---|
| `Pay.ORDER` | `v1/ke/order` | 是 | 支付下单 |
| `Pay.EXCHANGE` | `v1/operationtoolsapi/user_data_operation_platform/item_redemption` | 是 |  |

### Share

| 常量 | path | 默认需登录 | 说明 |
|---|---|---:|---|
| `Share.PLATFORMS` | `v1/operationapi/share/platforms` | 是 |  |
| `Share.GET_DATA` | `v1/operationapi/share/data` | 是 |  |
| `Share.SCHEDULING_REPORT` | `v1/operationapi/scheduling_report` | 是 |  |
| `Share.SCHEDULING_INIT` | `v1/operationapi/scheduling/init` | 是 |  |
| `Share.SCHEDULING_AD_REPORT` | `v1/operationapi/ad/scheduling_report` | 是 | 看广告完成上报 |

### Social

| 常量 | path | 默认需登录 | 说明 |
|---|---|---:|---|
| `Social.LBS_UPDATE` | `v1/social/lbs/update` | 是 | 上报/更新经纬度坐标 |
| `Social.USER_SET_CUSTOM` | `v1/social/user/setcustom` | 是 | 给用户设置CP的自定义信息 |
| `Social.LBS_RADIUS` | `v1/social/lbs/radius` | 是 | 获取指定半径内的其他用户信息 |
| `Social.LBS_DELETE` | `v1/social/lbs/delete` | 是 | 删除经纬度坐标 |
| `Social.RELATION_ADD` | `v1/social/relation/add` | 是 | 添加自定关系 |
| `Social.RELATION_DELETE` | `v1/social/relation/delete` | 是 | 删除自定关系 |
| `Social.RELATION_UPDATE_REMARKS` | `v1/social/relation/updateremarks` | 是 | 更新自定关系备注 |
| `Social.RELATION_HAS_RELATION` | `v1/social/relation/hasrelation` | 是 | 判断两用户是否存在某自定关系 |
| `Social.RELATION_LIST` | `v1/social/relation/list` | 是 | 获取自定关系列表 |
| `Social.RELATION_ADD_FRIEND` | `v1/social/relation/addfriend` | 是 | 添加好友列表 |
| `Social.RELATION_DEL_FRIEND` | `v1/social/relation/delfriend` | 是 | 删除好友列表 |
| `Social.RELATION_UPDATE_FRIEND_REMARKS` | `v1/social/relation/updatefriendremarks` | 是 | 更新好友关系备注 |
| `Social.RELATION_IS_FRIEND` | `v1/social/relation/isfriend` | 是 | 判断两用户是否为好友 |
| `Social.RELATION_FRIENDS` | `v1/social/relation/friends` | 是 | 获取好友列表 |
| `Social.RANK_ADDSCORE` | `v1/social/rank/addscore` | 是 | 排行榜 |
| `Social.RANK_SETSCORE` | `v1/social/rank/setscore` | 是 |  |
| `Social.RANK_QUERYUSERRANK` | `v1/social/rank/queryuserrank` | 是 |  |
| `Social.RANK_GETRANKLIST` | `v1/social/rank/getranklist` | 是 |  |
| `Social.RANK_FRIENDSRANK` | `v1/social/rank/friendsrank` | 是 |  |
