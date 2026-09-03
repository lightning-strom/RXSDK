# RXSDK JS/微信小游戏 版本记录

> 本文件记录 RXSDK JS SDK（含微信小游戏）的版本变更历史。

---

## 版本历史

<!-- 按时间倒序记录版本变更 -->

### v2.x.x (2026-05-29)

**修改内容：**
- 新增 `getUserInfoByField(params, callback)` 获取指定用户信息 public 接口
- 新增 `getUserInfoByFieldApi(data)`，请求 `POST /v1/passport/user/info_by_field`
- 同步小游戏、H5、H5 UI、华为和通用 JSSDK 基类入口

**涉及文件：**
- `RXSDK-JS/src/api/api.ts`
- `RXSDK-JS/src/h5/apis.ts`
- `RXSDK-JS/src/rpk/apis.ts`
- `RXSDK-JS/src/api/huawei/apiForHuawei.ts`
- `RXSDK-JS/src/index.common.ts`
- `RXSDK-JS/src/h5/SdkCommon.ts`
- `RXSDK-JS/src/h5/SdkCommomUI.ts`
- `RXSDK-JS/src/rpk/SdkCommon.ts`
- `RXSDK-JS/src/utils/huawei/index.common.ts`
- `RXSDK-Doc/common/api/20_passport.md`

**备注：**
- 请求参数按 map/object 透传。

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
