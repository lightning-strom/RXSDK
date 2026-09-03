# RXSDK iOS 版本记录

> 本文件记录 RXSDK iOS SDK 的版本变更历史。

---

## 版本历史

<!-- 按时间倒序记录版本变更 -->

### v4.x.x (2026-07-06)

**修改类型：** 新增

**修改内容：**
- [RXSDK] 新增 `getIIFAAResultWithSource:retryCount:complete:` 查询 IIFAA 认证结果（快速实名）
- [RXApiService] 新增 `getIIFAAResultWithSource:retryCount:complete:`，相比原查询接口新增 `source` 请求参数（`deregister` 表示注销场景，传空表示正常认证逻辑）；`retryCount` 逻辑与 `getIIFAAResultWithRetryCount:complete:` 保持一致
- 说明：`source` 会作为 `v1/cgosdk/sdk/auth/iifaa/validate_by_bizid` 的请求参数；原有 `getIIFAAResult:`、`getIIFAAResultWithRetryCount:complete:` 行为不变（内部以空 `source` 调用）

**涉及文件：**
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXSDK.h`
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXSDK.m`
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXApiService.h`
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXApiService.m`
- `RXSDK-Doc/ios/public_class_methods.md`

---

### v3.x.x (2026-05-29)

**修改类型：** 新增

**修改内容：**
- [RXSDK] 新增 `getUserInfoByFieldWithParams:complete:` 获取指定用户信息
- [RXApiService] 新增 `getUserInfoByFieldWithParams:complete:` 请求 `v1/passport/user/info_by_field`

**涉及文件：**
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXSDK.h`
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXSDK.m`
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXApiService.h`
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXApiService.m`
- `RXSDK-Doc/ios/public_class_methods.md`
- `RXSDK-Doc/ios/public_framework_methods.md`

---

### v3.x.x (2026-02-04)

**修改类型：** 新增

**修改内容：**
- [RXSDK] 新增 `getIIFAARedirectURLWithAppName:thirdPartSchema:complete:` 获取 IIFAA 支付宝授权跳转地址（快速实名）

**涉及文件：**
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXSDK.h`
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXSDK.m`
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXApiService.h`
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXApiService.m`
- `RXSDK-Doc/ios/public_class_methods.md`

---

### v3.x.x (2026-02-05)

**修改类型：** 新增

**修改内容：**
- [RXSDK] 新增 "社交联系服务（RXContactService）" 功能分类
- [RXSDK] 新增 `lbsUpdateWithLon:lat:types:complete:` 上报/更新经纬度坐标
- [RXSDK] 新增 `deleteLocationWithTypes:complete:` 删除经纬度坐标
- [RXSDK] 新增 `getRadiusAccountWithLon:lat:radius:count:page:page_size:type:complete:` 获取指定半径内的其他用户信息
- [RXSDK] 新增 `setUserCustomWithCustom:complete:` 设置用户自定义信息
- [RXSDK] 新增 `addRelationWithTarget:types:target_remarks:user_remarks:complete:` 添加自定义关系
- [RXSDK] 新增 `deleteRelationWithTarget:types:complete:` 删除自定义关系
- [RXSDK] 新增 `updateRemarksWithTarget:target_remarks:type:complete:` 更新用户自定义关系备注
- [RXSDK] 新增 `getRelationListWithType:complete:` 获取自定义关系列表
- [RXSDK] 新增 `addFriendWithTarget:target_remarks:user_remarks:complete:` 添加好友
- [RXSDK] 新增 `deleteFriendWithTarget:complete:` 删除好友
- [RXSDK] 新增 `updateFriendRemarkWithTarget:target_remarks:complete:` 更新好友备注
- [RXSDK] 新增 `getFriendListWithComplete:` 获取好友列表
- [RXSDK] 新增 `requestIsFriendWithTarget:complete:` 判断两用户是否为好友
- [RXSDK] 新增 `requestHasRelationWithTarget:type:complete:` 判断两用户是否存在某自定关系
- [RXSDK] 新增 `addscoreWithRank_id:score:complete:` 增加用户分数
- [RXSDK] 新增 `setScoreWithRank_id:score:complete:` 设置用户分数
- [RXSDK] 新增 `queryUserRankWithRank_id:target:complete:` 查询用户分数
- [RXSDK] 新增 `getRankListWithRank_id:start_rank:end_rank:complete:` 获取排行榜列表
- [RXSDK] 新增 `getFriendRankListWithRank_id:complete:` 获取好友排行榜列表

**涉及文件：**
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXSDK.h`
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXSDK.m`
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXContactService.h`
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXContactService.m`
- `RXSDK-Doc/ios/public_class_methods.md`

**备注：**
- 从 RXContactSDK 同步代码到 RXSDK 基础库
- 新增 18 个社交联系相关 API，包括 LBS 位置服务、好友关系、自定义关系、排行榜功能

---

### v3.x.x (2026-01-30)

**修改类型：** 新增

**修改内容：**
- [RXSDK] 新增 `application:openURL:options:` 方法，用于处理 URL Scheme 回调
- [RXSDK] 新增 `application:continueUserActivity:restorationHandler:` 方法，用于处理 Universal Link 回调
- 新增 "应用生命周期" 功能分类

**涉及文件：**
- `RXSDK-iOS/RXSDKCode/RXSDK/Common/RXSDK.h`
- `RXSDK-Doc/ios/public_class_methods.md`

**备注：**
- 这两个方法需要在 AppDelegate 对应的生命周期方法中调用，用于处理三方登录、分享等功能的回调

---

## 版本记录模板

```markdown
### vX.X.X (YYYY-MM-DD)

**修改内容：**
- 

**涉及文件：**
- 

**备注：**
```
