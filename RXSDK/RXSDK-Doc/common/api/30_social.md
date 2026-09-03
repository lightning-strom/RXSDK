## 社交（Social）

### 接口清单（后端 path）

| 功能 | path | 默认需登录 | SDK 调用点 |
|---|---|---:|---|
| 上报/更新经纬度 | `v1/social/lbs/update` | 是 | `RXApiHelper.Social.lbsUpdate(...)` |
| 获取附近用户 | `v1/social/lbs/radius` | 是 | `RXApiHelper.Social.lbsRadius(...)` |
| 删除经纬度 | `v1/social/lbs/delete` | 是 | `RXApiHelper.Social.lbsDelete(...)` |
| 设置 CP 自定义信息 | `v1/social/user/setcustom` | 是 | `RXApiHelper.Social.userSetCustom(...)` |
| 添加自定关系 | `v1/social/relation/add` | 是 | `RXApiHelper.Social.relationAdd(...)` |
| 删除自定关系 | `v1/social/relation/delete` | 是 | `RXApiHelper.Social.relationDelete(...)` |
| 更新自定关系备注 | `v1/social/relation/updateremarks` | 是 | `RXApiHelper.Social.updateRemarks(...)` |
| 判断是否存在关系 | `v1/social/relation/hasrelation` | 是 | `RXApiHelper.Social.hasRelation(...)` |
| 获取关系列表 | `v1/social/relation/list` | 是 | `RXApiHelper.Social.relationList(...)` |
| 添加好友 | `v1/social/relation/addfriend` | 是 | `RXApiHelper.Social.addFriends(...)` |
| 删除好友 | `v1/social/relation/delfriend` | 是 | `RXApiHelper.Social.removeFriends(...)` |
| 更新好友备注 | `v1/social/relation/updatefriendremarks` | 是 | `RXApiHelper.Social.updateFriendRemarks(...)` |
| 是否好友 | `v1/social/relation/isfriend` | 是 | `RXApiHelper.Social.isFriend(...)` |
| 好友列表 | `v1/social/relation/friends` | 是 | `RXApiHelper.Social.relationFriends(...)` |
| 排行榜-加分 | `v1/social/rank/addscore` | 是 | `RXApiHelper.Social.addScore(...)` |
| 排行榜-设置分 | `v1/social/rank/setscore` | 是 | `RXApiHelper.Social.setScore(...)` |
| 查询用户排名 | `v1/social/rank/queryuserrank` | 是 | `RXApiHelper.Social.queryUserRank(...)` |
| 获取排行榜 | `v1/social/rank/getranklist` | 是 | `RXApiHelper.Social.getRankList(...)` |
| 获取好友排行榜 | `v1/social/rank/friendsrank` | 是 | `RXApiHelper.Social.friendsRank(...)` |

### 约定（SDK 行为）

- **restfulData**：上述接口在 SDK 内部统一 `restfulData=false`（后端返回结构可能非标准 `{code,msg,data}`，重构时保持透传能力）。
- **回调线程**：网络回调切回主线程（UI 线程）。

