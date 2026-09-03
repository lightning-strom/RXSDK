# RXSDK Android 版本记录

> 本文件记录 RXSDK Android SDK 的版本变更历史。

---

## 版本历史

<!-- 按时间倒序记录版本变更 -->

### v4.0.17 (2026-07-31)

**修改内容：**
- 新增 `rxsdk_huya` 虎牙联运渠道，支持初始化、登录、支付和角色信息上报
- 修复虎牙支付服务端字段 `biz_order_id`、`biz_sign`、`prod_name` 的解析映射
- 补充虎牙订单模型单元测试

**涉及文件：**
- `RXSDK-Android/channel/rxsdk_huya/**`
- `RXSDK-Android/version.properties`
- `RXSDK-Doc/thirdchannel/huya/android/start.md`

**备注：**
- 本记录为计划发布版本，当前未执行 Maven 发布。

---

### v4.x.x (2026-07-06)

**修改内容：**
- [支付宝 IIFAA 实名] 查询认证结果接口新增 `source` 请求参数（`deregister` 表示注销场景，传空表示正常认证逻辑），`retryCount` 逻辑与原接口保持一致；原有 `getIIFAAResultWithRetryCount` 行为不变（内部以空 `source` 调用）
- [公共 API] `RXSDK`、`PassportModule`、`IPassportApi`、`RXSdkApi`、`RXApiHelper`、`PassportManager` 新增 `getIIFAAResultWithSource(source, retryCount, callback)`
- [Unity 调用支持] `RXSdkApi` 新增 `getIIFAAResultWithSource(String source, int retryCount, UnityRXRequestCallback callback)` 重载，供 Unity 侧 `getIIFAAResultWithSource` 反射调用
- [自动校验] `RXSdkApi` 的 IIFAA 前后台自动校验机制支持携带 `source`（新增 `setIifaaAutoValidateCallback(source, callback)`）
- [webview jsbridge] `RXWebView` 新增 JS 调用原生方法 `openIIFAAAuth`：跳转支付宝 → 监听前后台切换查询认证结果（`source=deregister`）→ 通过原生调用 JS 方法 `iifaaResult` 回传实名认证结果

**涉及文件：**
- `RXSDK-Android/rxsdk_base/src/main/java/com/ruixue/passport/PassportManager.java`
- `RXSDK-Android/rxsdk_base/src/main/java/com/ruixue/openapi/IPassportApi.java`
- `RXSDK-Android/rxsdk_base/src/main/java/com/ruixue/openapi/RXApiHelper.java`
- `RXSDK-Android/rxsdk_base/src/main/java/com/ruixue/openapi/RXSdkApi.java`
- `RXSDK-Android/rxsdk_base/src/main/java/com/ruixue/openapi/RXSDK.java`
- `RXSDK-Android/rxsdk_base/src/main/java/com/ruixue/openapi/module/PassportModule.java`
- `RXSDK-Android/rxsdk_base_ui/src/main/java/com/ruixue/view/RXWebView.java`

**备注：**
- 与 iOS 同步：iOS 侧对应 `RXApiService`/`RXSDK` 新增 `getIIFAAResultWithSource:retryCount:complete:`，`RXWebViewManager` jsbridge 新增 `openIIFAAAuth` 与 `iifaaResult` 回传

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
