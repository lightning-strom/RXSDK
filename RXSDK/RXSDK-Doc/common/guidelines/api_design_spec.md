# 新接口设计规范（多端通用）

> 用于 AI 重构的接口设计规范，确保新接口符合 SDK 设计原则和最佳实践  
> 适用于：Android、iOS、Unity、微信小游戏等多端 SDK

## ⚠️ 重要：重构策略

**推荐策略**：**接口函数名不变，优化新接口结构**

- ✅ **保持方法名不变**：新接口使用相同的方法名（如 `getUserInfo`、`login`、`lbsUpdate`）
- ✅ **优化参数结构**：将多个参数封装为参数对象（Params/Request），提高类型安全和可维护性
- ✅ **优化回调类型**：使用 `RXRequestCallback` 替代 `RXJSONCallback`，统一错误处理
- ✅ **优化类型安全**：使用强类型参数对象，避免过度使用 `Map<String, Object>`
- ✅ **使用 `RXSDK` 作为新的统一入口类**（如 `RXSDK.getInstance()`）
- ✅ **旧接口和旧实现类保持不变**，确保向后兼容

**优化示例**：

```java
// 旧接口（保持不变）
public interface IPassportApi {
    void login(Activity activity, String loginType, String username, String password, 
              String captchaCode, String loginOpenId, Map<String, Object> ext, 
              String[] signFields, Object migrateArgs, RXJSONCallback callback);
}

// 新接口（方法名不变，优化结构）
public class RXSDK {
    // ✅ 方法名不变：login
    // ✅ 优化：使用 LoginParams 参数对象替代多个参数
    // ✅ 优化：使用 RXRequestCallback 替代 RXJSONCallback
    public void login(LoginParams params, RXRequestCallback callback) {
        // 新实现
    }
}
```

详见：[接口结构优化策略](#-接口结构优化策略)

---

## 📋 规范目标

本规范用于指导 AI 在重构 SDK 接口时遵循统一的设计原则，确保：

- **一致性**：所有新接口遵循相同的设计模式，跨端行为一致
- **可维护性**：接口清晰、易于理解和维护
- **兼容性**：保持向后兼容，避免破坏性变更
- **可测试性**：接口设计便于单元测试和集成测试
- **跨端统一**：Android、iOS、Unity、小游戏等平台接口语义一致

---

## 🎯 核心设计原则

### 1. 只增不改（向后兼容）

**原则**：新增功能采用增量扩展，不修改已有接口。

**实践**：

- ✅ **允许**：新增方法、新增类、新增可选参数
- ❌ **禁止**：修改方法签名、修改参数类型、删除方法
- ✅ **允许**：新增重载方法（保留旧方法）
- ❌ **禁止**：修改已有方法的参数顺序或类型
- ✅ **推荐**：创建新的实现类作为新 API 调用入口（保持接口名称不变）

**重构策略：新类作为新入口**

**原则**：不改变现有接口名称，创建新的实现类作为新 API 调用入口。

**实践**：

- **保持方法名不变**：新接口使用与旧接口相同的方法名
- **优化参数结构**：将多个参数封装为参数对象（Params/Request）
- **优化回调类型**：使用 `RXRequestCallback` 替代 `RXJSONCallback`
- **优化类型安全**：使用强类型参数对象，避免 `Map<String, Object>`
- 使用 `RXSDK` 作为新的统一入口类（如 `RXSDK.getInstance()`）
- 旧接口和旧实现类保持不变，确保向后兼容

**多端示例**：

```java
// Android: ✅ 正确：新增方法
void getUserInfoV2(RXRequestCallback callback);

// Android: ✅ 推荐：新类作为新入口（保持接口名称不变）
// 旧接口保持不变
public interface IPassportApi {
    void getUserInfo(RXJSONCallback callback); // 保持不变
}

// 新实现类
public class PassportApiV2 implements IPassportApi {
    @Override
    public void getUserInfo(RXJSONCallback callback) {
        // 兼容旧接口，内部转换为新回调
        getUserInfo(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                int code = jsonObject.optInt("code");
                if (code == 0) {
                    callback.onSuccess(jsonObject.optJSONObject("data"));
                } else {
                    callback.onFailed(jsonObject);
                }
            }
            @Override
            public void onError(RXException e) {
                callback.onError(e);
            }
        });
    }
    
    // 新方法使用新回调
    public void getUserInfo(RXRequestCallback callback) {
        // 新实现
    }
}

// 新入口类
public class RXSDK {
    private PassportApiV2 passportApiV2 = new PassportApiV2();
    private SocialApiV2 socialApiV2 = new SocialApiV2();
    private GameAreaApiV2 gameAreaApiV2 = new GameAreaApiV2();
    
    private static RXSDK INSTANCE;
    
    public static RXSDK getInstance() {
        if (INSTANCE == null) {
            synchronized (RXSDK.class) {
                if (INSTANCE == null) {
                    INSTANCE = new RXSDK();
                }
            }
        }
        return INSTANCE;
    }
    
    // 新方法使用新回调（推荐）
    public void getUserInfo(RXRequestCallback callback) {
        passportApiV2.getUserInfo(callback);
    }
    
    // 其他新方法...
}

// 调用方式
// 旧方式（继续支持）
RuiXueSdk.getApi().getUserInfo(oldCallback);

// 新方式（推荐）
RXSDK.getInstance().getUserInfo(newCallback);
```

**iOS Objective-C 示例**：

```objective-c
// ✅ 推荐：新类作为新入口（保持协议名称不变）
// 旧协议保持不变
@protocol RXPassportAPI <NSObject>
- (void)getUserInfoWithCompletion:(RXSDKCompletion)completion; // 保持不变
@end

// 新实现类
@interface RXPassportAPIV2 : NSObject <RXPassportAPI>
// 兼容旧协议
- (void)getUserInfoWithCompletion:(RXSDKCompletion)completion {
    [self getUserInfoV2WithCompletion:^(NSDictionary * _Nullable data, NSError * _Nullable error) {
        // 转换为旧格式
        if (error) {
            completion(nil, error);
        } else {
            completion(data, nil);
        }
    }];
}

// 新方法使用统一错误结构
- (void)getUserInfoV2WithCompletion:(RXSDKCompletion)completion {
    // 新实现，使用统一错误结构
}
@end

// 新入口类
@interface RXSDK : NSObject
@property (nonatomic, strong, readonly) RXPassportAPIV2 *passportAPI;
@property (nonatomic, strong, readonly) RXSocialAPIV2 *socialAPI;
@property (nonatomic, strong, readonly) RXGameAreaAPIV2 *gameAreaAPI;

+ (instancetype)sharedInstance;

// 新方法使用统一错误结构（推荐）
- (void)getUserInfoWithCompletion:(RXSDKCompletion)completion;
@end

// 调用方式
// 旧方式（继续支持）
[[RXSDKAPI sharedInstance] getUserInfoWithCompletion:^(NSDictionary *data, NSError *error) {
    // 处理结果
}];

// 新方式（推荐）
[[RXSDK sharedInstance] getUserInfoWithCompletion:^(NSDictionary *data, NSError *error) {
    // 处理结果
}];
```

**Unity C# 示例**：

```csharp
// ✅ 推荐：新类作为新入口（保持接口名称不变）
// 旧接口保持不变
public interface IRXPassportAPI {
    void GetUserInfo(Action<string> onSuccess, Action<string> onError); // 保持不变
}

// 新实现类
public class RXPassportAPIV2: IRXPassportAPI {
    // 兼容旧接口
    public void GetUserInfo(Action<string> onSuccess, Action<string> onError) {
        GetUserInfoV2(onSuccess, onError); // 转发到新方法
    }
    
    // 新方法使用统一错误结构
    public void GetUserInfoV2(Action<string> onSuccess, Action<string> onError) {
        // 新实现，确保错误结构统一
    }
}

// 新入口类
public static class RXSDK {
    private static RXPassportAPIV2 passportAPI = new RXPassportAPIV2();
    private static RXSocialAPIV2 socialAPI = new RXSocialAPIV2();
    private static RXGameAreaAPIV2 gameAreaAPI = new RXGameAreaAPIV2();
    
    // 新方法使用统一错误结构（推荐）
    public static void GetUserInfo(Action<string> onSuccess, Action<string> onError) {
        passportAPI.GetUserInfoV2(onSuccess, onError);
    }
    
    // 其他新方法...
}

// 调用方式
// 旧方式（继续支持）
RXSDKAPI.GetUserInfo(onSuccess, onError);

// 新方式（推荐）
RXSDK.GetUserInfo(onSuccess, onError);
```

**微信小游戏 TS 示例**：

```typescript
// ✅ 推荐：新类作为新入口（保持接口名称不变）
// 旧接口保持不变
export interface IRXPassportAPI {
    getUserInfo(callback: (data: any, error: any) => void): void; // 保持不变
}

// 新实现类
export class RXPassportAPIV2 implements IRXPassportAPI {
    // 兼容旧接口
    getUserInfo(callback: (data: any, error: any) => void): void {
        this.getUserInfoV2().then(result => {
            if (result.ok) {
                callback(result.data, null);
            } else {
                callback(null, result.error);
            }
        });
    }
    
    // 新方法使用 Promise<RXResult>
    async getUserInfoV2(): Promise<RXResult<UserInfo>> {
        // 新实现
    }
}

// 新入口类
export class RXSDK {
    private passportAPI = new RXPassportAPIV2();
    private socialAPI = new RXSocialAPIV2();
    private gameAreaAPI = new RXGameAreaAPIV2();
    
    private static _instance: RXSDK;
    
    public static getInstance(): RXSDK {
        if (!RXSDK._instance) {
            RXSDK._instance = new RXSDK();
        }
        return RXSDK._instance;
    }
    
    // 新方法使用 Promise<RXResult>（推荐）
    async getUserInfo(): Promise<RXResult<UserInfo>> {
        return this.passportAPI.getUserInfoV2();
    }
    
    // 其他新方法...
}

// 调用方式
// 旧方式（继续支持）
RXSDKAPI.getUserInfo((data, error) => { ... });

// 新方式（推荐）
const result = await RXSDK.getInstance().getUserInfo();
```

### 2. 简洁可用

**原则**：接口设计简洁，易于调用。

**实践**：

- 单个方法参数**不超过 5 个**
- 超过 5 个参数时，必须封装为参数对象（DTO/Request）
- 提供便捷的重载方法（简化常用场景）

**多端示例**：

```java
// Android: ✅ 正确：参数封装
void updateUserInfo(UserInfoParams params, RXRequestCallback callback);

// iOS Objective-C: ✅ 正确：参数封装
- (void)updateUserInfoWithRequest:(RXUserInfoRequest *)request
                        completion:(RXSDKCompletion)completion;

// Unity C#: ✅ 正确：参数封装
public static void UpdateUserInfo(UserInfoParams params, 
                                 Action<string> onSuccess, Action<string> onError)

// 微信小游戏 TS: ✅ 正确：参数封装
static async updateUserInfo(params: UserInfoParams): Promise<RXResult<void>>
```

### 3. 类型安全

**原则**：优先使用强类型，避免过度使用 `Map/Dictionary/Object`。

**实践**：

- 优先定义参数对象类/结构体（如 `UserInfoParams`、`LoginParams`）
- 保留 `Map/Dictionary` 版本作为兼容性重载（标记为废弃）
- 使用枚举或字符串常量限制字符串参数

**多端示例**：

```java
// Android: ✅ 正确：强类型参数
public class LoginParams {
    @LoginType private String loginType;
    @Nullable private String username;
    // ...
}
void login(LoginParams params, RXRequestCallback callback);

// iOS Objective-C: ✅ 正确：强类型参数
@interface RXLoginRequest : NSObject
@property (nonatomic, strong) NSString *loginType;
@property (nonatomic, strong, nullable) NSString *username;
// ...
@end

- (void)loginWithRequest:(RXLoginRequest *)request
              completion:(RXSDKCompletion)completion;

// Unity C#: ✅ 正确：强类型参数
[Serializable]
public class LoginParams {
    public string loginType;
    public string username;
    // ...
}
public static void Login(LoginParams params, Action<string> onSuccess, Action<string> onError)

// 微信小游戏 TS: ✅ 正确：强类型参数
export interface LoginRequest {
    method: "wechat" | "guest" | string;
    username?: string;
    // ...
}
static async login(req: LoginRequest): Promise<RXResult<LoginResponse>>
```

### 4. 统一回调

**原则**：所有异步接口统一使用统一的回调机制。

**实践**：

- **Android**：新接口使用 `RXRequestCallback`（旧接口 `RXJSONCallback` 标记为 `@Deprecated`）
- **iOS**：使用 `RXSDKCompletion` block 回调（`typedef void (^RXSDKCompletion)(NSDictionary * _Nullable data, NSError * _Nullable error);`）
- **Unity**：使用 `Action<string>` 回调（JSON 字符串），错误通过统一错误结构返回
- **微信小游戏**：使用 `Promise<RXResult<T>>`，错误通过 `RXResult` 的 `error` 字段返回
- **回调线程**：所有平台回调必须在主线程（UI 线程）执行

**多端示例**：

```java
// Android: ✅ 正确：使用 RXRequestCallback
void getUserInfo(RXRequestCallback callback);

// iOS Objective-C: ✅ 正确：使用 RXSDKCompletion
- (void)getUserInfoWithCompletion:(RXSDKCompletion)completion;

// Unity C#: ✅ 正确：使用 Action<string>
public static void GetUserInfo(Action<string> onSuccess, Action<string> onError)

// 微信小游戏 TS: ✅ 正确：使用 Promise<RXResult>
static async getUserInfo(): Promise<RXResult<UserInfo>>
```

---

## 📝 命名规范

### 接口/协议命名

**规则**（跨端统一）：

- **Android**：`I + [模块名] + Api`（如 `IPassportApi`、`ISocialApi`）
- **iOS Objective-C**：`RX + [模块名] + API`（如 `RXPassportAPI`、`RXSocialAPI`）
- **iOS Objective-C**：`RX + [模块名] + API`（如 `RXPassportAPI`）
- **Unity C#**：`RX + [模块名] + API`（如 `RXPassportAPI`）
- **微信小游戏 TS**：`RX + [模块名] + API`（如 `RXPassportAPI`）

**格式**：

```
[平台前缀] + [模块名] + API
```

### 方法命名

**规则**（跨端统一）：

- 使用动词开头，驼峰命名
- 方法名清晰表达功能意图
- 避免缩写，除非是广泛认知的（如 `ID`、`URL`）

**多端示例**：

```java
// Android
void getUserInfo(RXRequestCallback callback);
void updateUserInfo(UserInfoParams params, RXRequestCallback callback);

// iOS Objective-C
- (void)getUserInfoWithCompletion:(RXSDKCompletion)completion;
- (void)updateUserInfoWithRequest:(RXUserInfoRequest *)request
                        completion:(RXSDKCompletion)completion;

// Unity C#
public static void GetUserInfo(Action<string> onSuccess, Action<string> onError)
public static void UpdateUserInfo(UserInfoParams params, Action<string> onSuccess, Action<string> onError)

// 微信小游戏 TS
static async getUserInfo(): Promise<RXResult<UserInfo>>
static async updateUserInfo(params: UserInfoParams): Promise<RXResult<void>>
```

### 参数对象命名

**规则**（跨端统一）：

- 以功能模块名开头，以 `Params`、`Request`、`Config` 结尾
- `Params`/`Request`：用于请求参数
- `Config`：用于配置对象

**多端示例**：

```java
// Android
LoginParams, RegisterParams, UserInfoParams, ShareConfig, PayConfig

// iOS Objective-C
RXLoginRequest, RXRegisterRequest, RXUserInfoRequest, RXShareConfig, RXPayConfig

// Unity C#
LoginParams, RegisterParams, UserInfoParams, ShareConfig, PayConfig

// 微信小游戏 TS
LoginRequest, RegisterRequest, UserInfoRequest, ShareConfig, PayConfig
```

### 常量命名

**规则**（跨端统一）：

- 全大写，下划线分隔
- 以接口名或模块名为前缀

**多端示例**：

```java
// Android
String KEY_LOGIN_METHOD = "method";
String KEY_LOGIN_OPENID = "login_openid";

// iOS Objective-C
FOUNDATION_EXPORT NSString * const KEY_LOGIN_METHOD; // @"method"
FOUNDATION_EXPORT NSString * const KEY_LOGIN_OPENID; // @"login_openid"

// Unity C#
public const string KEY_LOGIN_METHOD = "method";
public const string KEY_LOGIN_OPENID = "login_openid";

// 微信小游戏 TS
export const KEY_LOGIN_METHOD = "method";
export const KEY_LOGIN_OPENID = "login_openid";
```

---

## 🔧 参数设计规范

### 参数顺序

**规则**（跨端统一）：

1. Context/Activity/ViewController（如需要）
2. 核心业务参数（按重要性排序）
3. 可选参数/扩展参数
4. 回调参数（最后）

**多端示例**：

```java
// Android: ✅ 正确
void login(Activity activity, String loginType, String username, 
          String password, Map<String, Object> ext, RXRequestCallback callback);

// iOS Objective-C: ✅ 正确
- (void)loginWithViewController:(UIViewController * _Nullable)viewController
                       loginType:(NSString *)loginType
                        username:(NSString * _Nullable)username
                        password:(NSString * _Nullable)password
                             ext:(NSDictionary<NSString *, id> * _Nullable)ext
                      completion:(RXSDKCompletion)completion;

// Unity C#: ✅ 正确
public static void Login(string loginType, string username, string password,
                        Dictionary<string, object> ext,
                        Action<string> onSuccess, Action<string> onError)

// 微信小游戏 TS: ✅ 正确
static async login(loginType: string, username?: string, password?: string,
                  ext?: Record<string, any>): Promise<RXResult<LoginResponse>>
```

### 参数类型

**规则**（跨端统一）：

- 必填参数：使用基本类型或非空对象
- 可选参数：使用平台特定的可选类型标注
- 字符串参数：使用枚举或字符串常量限制可选值

**多端示例**：

```java
// Android: ✅ 使用 @Nullable 和 @StringDef
@StringDef({LoginMethod.GUEST, LoginMethod.WECHAT, LoginMethod.USERNAME})
@Retention(RetentionPolicy.SOURCE)
public @interface LoginType {}

void login(@LoginType String loginType, @Nullable String username, RXRequestCallback callback);

// iOS Objective-C: ✅ 使用 nullable 和字符串常量
typedef NSString * RXLoginType NS_STRING_ENUM;
FOUNDATION_EXPORT RXLoginType const RXLoginTypeGuest;    // @"guest"
FOUNDATION_EXPORT RXLoginType const RXLoginTypeWechat;   // @"wechat"
FOUNDATION_EXPORT RXLoginType const RXLoginTypeUsername; // @"username"

- (void)loginWithLoginType:(RXLoginType)loginType
                  username:(NSString * _Nullable)username
                completion:(RXSDKCompletion)completion;

// Unity C#: ✅ 使用可空类型和枚举
public enum LoginType {
    Guest, Wechat, Username
}

public static void Login(LoginType loginType, string? username, Action<string> onSuccess, Action<string> onError)

// 微信小游戏 TS: ✅ 使用可选属性和联合类型
export type LoginType = "guest" | "wechat" | "username";

export interface LoginRequest {
    method: LoginType;
    username?: string;
}
```

### 参数校验

**规则**（跨端统一）：

- 必填参数必须在接口层做非空校验
- 校验失败返回统一错误码（参考错误码规范）
- 格式校验（如手机号、邮箱）应在接口层完成

**多端示例**：

```java
// Android: ✅ 参数校验
void bindPhone(String phone, String captchaCode, RXRequestCallback callback) {
    if (TextUtils.isEmpty(phone)) {
        callback.onError(new RXException(RXErrorCode.PARAM_ERROR, "手机号不能为空"));
        return;
    }
    if (!isValidPhone(phone)) {
        callback.onError(new RXException(RXErrorCode.PARAM_ERROR, "手机号格式不正确"));
        return;
    }
    // 业务逻辑
}

// iOS Objective-C: ✅ 参数校验
- (void)bindPhoneWithPhone:(NSString *)phone
              captchaCode:(NSString *)captchaCode
               completion:(RXSDKCompletion)completion {
    if (!phone || phone.length == 0) {
        NSError *error = [NSError errorWithDomain:@"RXSDKErrorDomain"
                                             code:2000
                                         userInfo:@{NSLocalizedDescriptionKey: @"手机号不能为空"}];
        completion(nil, error);
        return;
    }
    if (![self isValidPhone:phone]) {
        NSError *error = [NSError errorWithDomain:@"RXSDKErrorDomain"
                                             code:2000
                                         userInfo:@{NSLocalizedDescriptionKey: @"手机号格式不正确"}];
        completion(nil, error);
        return;
    }
    // 业务逻辑
}

// Unity C#: ✅ 参数校验
public static void BindPhone(string phone, string captchaCode,
                            Action<string> onSuccess, Action<string> onError) {
    if (string.IsNullOrEmpty(phone)) {
        var error = new RXSDKError { code = 2000, msg = "手机号不能为空" };
        onError?.Invoke(JsonUtility.ToJson(error));
        return;
    }
    if (!IsValidPhone(phone)) {
        var error = new RXSDKError { code = 2000, msg = "手机号格式不正确" };
        onError?.Invoke(JsonUtility.ToJson(error));
        return;
    }
    // 业务逻辑
}

// 微信小游戏 TS: ✅ 参数校验
static async bindPhone(phone: string, captchaCode: string): Promise<RXResult<void>> {
    if (!phone || phone.trim() === "") {
        return { ok: false, error: { code: 2000, msg: "手机号不能为空" } };
    }
    if (!isValidPhone(phone)) {
        return { ok: false, error: { code: 2000, msg: "手机号格式不正确" } };
    }
    // 业务逻辑
}
```

---

## 🔄 回调规范

### 统一回调机制

**规则**（跨端统一）：

- **Android**：使用 `RXRequestCallback`（新接口），回调在主线程执行
- **iOS**：使用 `RXSDKCompletion` block 回调（`typedef void (^RXSDKCompletion)(NSDictionary * _Nullable data, NSError * _Nullable error);`），回调在主线程执行
- **Unity**：使用 `Action<string>` 回调（JSON 字符串），回调在主线程执行
- **微信小游戏**：使用 `Promise<RXResult<T>>`，回调在主线程执行

**响应格式**（跨端统一）：

```json
// 成功
{
  "code": 0,
  "data": { /* 实际数据 */ }
}

// 失败
{
  "code": 错误码,
  "msg": "错误信息",
  "trace_id": "追踪ID（可选）",
  "thirdcode": "三方错误码（可选）",
  "thirdmsg": "三方错误信息（可选）"
}
```

**实现要求**（跨端统一）：

- 所有平台回调必须在主线程（UI 线程）执行
- 通过 `code` 字段判断成功/失败（`code == 0` 为成功）
- 异常通过 `onError` 回调（Android）或 `NSError`（iOS）或 `RXResult.error`（TS）

**多端示例**：

```java
// Android: ✅ 确保回调在主线程
void getUserInfo(RXRequestCallback callback) {
    // 网络请求...
    ThreadUtils.runOnMainThread(() -> {
        callback.onResponse(responseJson);
    });
}

// iOS Objective-C: ✅ 确保回调在主线程
- (void)getUserInfoWithCompletion:(RXSDKCompletion)completion {
    // 网络请求...
    dispatch_async(dispatch_get_main_queue(), ^{
        completion(userInfo, nil);
    });
}

// Unity C#: ✅ 确保回调在主线程
public static void GetUserInfo(Action<string> onSuccess, Action<string> onError) {
    // 网络请求...
    UnityMainThreadDispatcher.Instance().Enqueue(() => {
        onSuccess?.Invoke(responseJson);
    });
}

// 微信小游戏 TS: ✅ Promise 自动在主线程
static async getUserInfo(): Promise<RXResult<UserInfo>> {
    // 网络请求...
    return { ok: true, data: userInfo };
}
```

### 异常处理

**规则**（跨端统一）：

- 网络错误、解析错误等异常通过异常回调返回
- 业务错误（如参数校验失败）通过统一错误结构返回，`code != 0`

**多端示例**：

```java
// Android: ✅ 区分异常和业务错误
try {
    JSONObject response = httpClient.post(url, params);
    callback.onResponse(response); // 业务成功/失败都通过 onResponse
} catch (IOException e) {
    callback.onError(new RXException(RXErrorCode.NETWORK_ERROR, e.getMessage()));
} catch (JSONException e) {
    callback.onError(new RXException(RXErrorCode.PARSE_ERROR, e.getMessage()));
}

// iOS Objective-C: ✅ 区分异常和业务错误
NSError *requestError = nil;
NSDictionary *response = [self.httpClient postWithURL:url params:params error:&requestError];

if (requestError) {
    NSInteger errorCode = 1000; // 默认网络错误
    if ([requestError.domain isEqualToString:NSURLErrorDomain]) {
        errorCode = 1000; // 网络错误
    } else if ([requestError.domain isEqualToString:NSCocoaErrorDomain]) {
        errorCode = 9030; // 解析错误
    }
    NSError *sdkError = [NSError errorWithDomain:@"RXSDKErrorDomain"
                                             code:errorCode
                                         userInfo:@{NSLocalizedDescriptionKey: requestError.localizedDescription}];
    completion(nil, sdkError);
} else {
    completion(response, nil);
}

// Unity C#: ✅ 区分异常和业务错误
try {
    string response = await httpClient.PostAsync(url, params);
    onSuccess?.Invoke(response);
} catch (HttpRequestException e) {
    var error = new RXSDKError { code = 1000, msg = $"网络请求失败: {e.Message}" };
    onError?.Invoke(JsonUtility.ToJson(error));
} catch (JsonException e) {
    var error = new RXSDKError { code = 9030, msg = $"数据解析失败: {e.Message}" };
    onError?.Invoke(JsonUtility.ToJson(error));
}

// 微信小游戏 TS: ✅ 区分异常和业务错误
try {
    const response = await wx.request({ url, data: params });
    return { ok: true, data: response.data };
} catch (error) {
    if (error instanceof NetworkError) {
        return { ok: false, error: { code: 1000, msg: `网络请求失败: ${error.message}` } };
    } else if (error instanceof SyntaxError) {
        return { ok: false, error: { code: 9030, msg: `数据解析失败: ${error.message}` } };
    }
}
```

---

## ⚠️ 错误处理规范

### 错误码规范

**规则**（跨端统一）：

- **服务端错误码**：6 位整数，必须原样透传，不改写位数、不复用语义
- **客户端错误码**：4 位整数，按区间区分场景：
  - 1000-1999：网络相关
  - 2000-2999：初始化相关
  - 3000-3999：登录相关
  - 4000-4999：支付相关
  - 5000-5999：分享相关
  - 6000-6999：权限与应用未安装相关

**多端示例**：

```java
// Android: ✅ 使用统一错误码
public class RXErrorCode {
    public static final int NETWORK_ERROR = 1000;
    public static final int INIT_ERROR = 2000;
    public static final int LOGIN_ERROR = 3000;
    public static final int PAY_ERROR = 4000;
}

// iOS Objective-C: ✅ 使用统一错误码
typedef NS_ENUM(NSInteger, RXErrorCode) {
    RXErrorCodeNetworkError = 1000,
    RXErrorCodeInitError = 2000,
    RXErrorCodeLoginError = 3000,
    RXErrorCodePayError = 4000
};

// Unity C#: ✅ 使用统一错误码
public static class RXErrorCode {
    public const int NETWORK_ERROR = 1000;
    public const int INIT_ERROR = 2000;
    public const int LOGIN_ERROR = 3000;
    public const int PAY_ERROR = 4000;
}

// 微信小游戏 TS: ✅ 使用统一错误码
export enum RXErrorCode {
    NETWORK_ERROR = 1000,
    INIT_ERROR = 2000,
    LOGIN_ERROR = 3000,
    PAY_ERROR = 4000
}
```

### 错误信息

**规则**（跨端统一）：

- 错误信息必须清晰、可读
- 禁止直接暴露底层异常信息给调用方
- 三方错误码和错误信息放在 `thirdcode` 和 `thirdmsg` 中

**多端示例**：

```java
// Android: ✅ 统一错误结构
JSONObject errorResponse = new JSONObject();
errorResponse.put("code", RXErrorCode.LOGIN_ERROR);
errorResponse.put("msg", "登录失败，请检查用户名和密码");
errorResponse.put("thirdcode", "WX_ERROR");
errorResponse.put("thirdmsg", "微信返回：用户取消");

// iOS Objective-C: ✅ 统一错误结构
NSError *error = [NSError errorWithDomain:@"RXSDKErrorDomain"
                                     code:RXErrorCodeLoginError
                                 userInfo:@{
    RXSDKErrorUserInfoKeyMessage: @"登录失败，请检查用户名和密码",
    RXSDKErrorUserInfoKeyThirdCode: @"WX_ERROR",
    RXSDKErrorUserInfoKeyThirdMsg: @"微信返回：用户取消"
}];

// Unity C#: ✅ 统一错误结构
var error = new RXSDKError {
    code = RXErrorCode.LOGIN_ERROR,
    msg = "登录失败，请检查用户名和密码",
    thirdcode = "WX_ERROR",
    thirdmsg = "微信返回：用户取消"
};

// 微信小游戏 TS: ✅ 统一错误结构
const error: RXSDKError = {
    code: RXErrorCode.LOGIN_ERROR,
    msg: "登录失败，请检查用户名和密码",
    thirdcode: "WX_ERROR",
    thirdmsg: "微信返回：用户取消"
};
```

---

## 📚 文档规范

### 接口文档要求

**规则**（跨端统一）：

- 所有 `public` 接口必须有完整的文档注释
- 必须包含：功能描述、参数说明、返回值说明、异常说明
- 明确声明回调线程（主线程/工作线程）

**多端示例**：

```java
// Android: ✅ Javadoc
/**
 * 获取用户信息
 * 
 * @param callback 回调接口，成功时返回用户信息，失败时返回错误码和错误信息
 *                 回调在主线程执行
 * @throws IllegalArgumentException 如果参数为空
 */
void getUserInfo(RXRequestCallback callback);

// iOS Objective-C: ✅ 文档注释
/// 获取用户信息
/// @param completion 回调接口，成功时返回用户信息（data），失败时返回错误（error）
///                   回调在主线程执行
- (void)getUserInfoWithCompletion:(RXSDKCompletion)completion;

// Unity C#: ✅ XML Documentation
/// <summary>
/// 获取用户信息
/// </summary>
/// <param name="onSuccess">成功回调，返回用户信息 JSON 字符串，回调在主线程执行</param>
/// <param name="onError">失败回调，返回错误 JSON 字符串，回调在主线程执行</param>
public static void GetUserInfo(Action<string> onSuccess, Action<string> onError)

// 微信小游戏 TS: ✅ JSDoc
/**
 * 获取用户信息
 * @returns Promise 成功时返回用户信息，失败时返回错误
 *          回调在主线程执行
 */
static async getUserInfo(): Promise<RXResult<UserInfo>>
```

### 参数说明

**规则**（跨端统一）：

- 参数表格必须包含：参数名、类型、必填、说明
- 说明中明确参数取值范围、格式要求、示例值

**示例**（Markdown 表格，跨端通用）：

```markdown
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `loginType` | `String` | 是 | 登录类型，可选值：`GUEST`、`WECHAT`、`USERNAME` 等 |
| `username` | `String` | 否 | 用户名，账号登录时必填 |
| `callback` | `RXRequestCallback` | 是 | 回调接口，详见[回调接口说明](../../android/api/callback.md) |
```

---

## 🔧 接口结构优化策略

### 优化原则

**核心原则**：**接口函数名不变，优化新接口结构**

1. **保持方法名不变**：新接口使用与旧接口相同的方法名
2. **优化参数结构**：将多个参数封装为参数对象
3. **优化回调类型**：使用统一的回调机制
4. **优化类型安全**：使用强类型，避免过度使用 `Map/Dictionary`

### 优化示例

#### 示例 1：登录接口优化

**旧接口**（保持不变）：

```java
public interface IPassportApi {
    void login(Activity activity, String loginType, String username, String password, 
              String captchaCode, String loginOpenId, Map<String, Object> ext, 
              String[] signFields, Object migrateArgs, RXJSONCallback callback);
}
```

**新接口**（方法名不变，优化结构）：

```java
// 参数对象
public class LoginParams {
    @Nullable private Activity activity;
    @LoginType private String loginType;
    @Nullable private String username;
    @Nullable private String password;
    @Nullable private String captchaCode;
    @Nullable private String loginOpenId;
    @Nullable private Map<String, Object> ext;
    @Nullable private String[] signFields;
    @Nullable private Object migrateArgs;
    
    // Builder 模式（可选）
    public static class Builder {
        private LoginParams params = new LoginParams();
        
        public Builder setActivity(Activity activity) { params.activity = activity; return this; }
        public Builder setLoginType(String loginType) { params.loginType = loginType; return this; }
        // ... 其他 setter
        
        public LoginParams build() { return params; }
    }
}

// 新接口（RXSDK）
public class RXSDK {
    // ✅ 方法名不变：login
    // ✅ 优化：使用 LoginParams 参数对象
    // ✅ 优化：使用 RXRequestCallback
    public void login(LoginParams params, RXRequestCallback callback) {
        // 新实现
    }
}

// 调用方式
LoginParams params = new LoginParams.Builder()
    .setActivity(activity)
    .setLoginType(LoginMethod.USERNAME)
    .setUsername("user")
    .setPassword("pass")
    .build();

RXSDK.getInstance().login(params, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        // 处理响应
    }
    
    @Override
    public void onError(RXException e) {
        // 处理错误
    }
});
```

#### 示例 2：LBS 接口优化

**旧接口**（保持不变）：

```java
public interface ISocialApi {
    void lbsRadius(String types, float lon, float lat, float radius, 
                   int count, int page, int page_size, RXJSONCallback callback);
}
```

**新接口**（方法名不变，优化结构）：

```java
// 参数对象
public class LBSRadiusParams {
    private String types;
    private float longitude;
    private float latitude;
    private float radius;
    private int count;
    private int page;
    private int pageSize;
    
    // getters and setters
}

// 新接口（RXSDK）
public class RXSDK {
    // ✅ 方法名不变：lbsRadius
    // ✅ 优化：使用 LBSRadiusParams 参数对象
    // ✅ 优化：使用 RXRequestCallback
    public void lbsRadius(LBSRadiusParams params, RXRequestCallback callback) {
        // 新实现
    }
}
```

#### 示例 3：埋点接口优化

**旧接口**（保持不变）：

```java
public interface IRXSdkApi {
    boolean dataTrack(String eventName, String distinctId, 
                     Map<String, Object> properties, 
                     int flushInterval, int maxCacheCount);
}
```

**新接口**（方法名不变，优化结构）：

```java
// 参数对象
public class DataTrackParams {
    private String eventName;
    private String distinctId;
    private Map<String, Object> properties;
    @Nullable private Integer flushInterval;  // 可选
    @Nullable private Integer maxCacheCount;  // 可选
    
    // getters and setters
}

// 新接口（RXSDK）
public class RXSDK {
    // ✅ 方法名不变：dataTrack
    // ✅ 优化：使用 DataTrackParams 参数对象
    // ✅ 优化：可选参数使用 @Nullable
    public boolean dataTrack(DataTrackParams params) {
        // 新实现
    }
}
```

### 多端优化示例

#### Android

```java
// ✅ 方法名不变，优化结构
public class RXSDK {
    public void login(LoginParams params, RXRequestCallback callback) { }
    public void lbsRadius(LBSRadiusParams params, RXRequestCallback callback) { }
    public boolean dataTrack(DataTrackParams params) { }
}
```

#### iOS Objective-C

```objective-c
// ✅ 方法名不变，优化结构
@interface RXSDK : NSObject
+ (instancetype)sharedInstance;

- (void)loginWithRequest:(RXLoginRequest *)request
              completion:(RXSDKCompletion)completion;
- (void)lbsRadiusWithRequest:(RXLBSRadiusRequest *)request
                   completion:(RXSDKCompletion)completion;
- (BOOL)dataTrackWithRequest:(RXDataTrackRequest *)request;
@end
```

#### Unity C #

```csharp
// ✅ 方法名不变，优化结构
public static class RXSDK {
    public static void Login(LoginParams @params, Action<string> onSuccess, Action<string> onError) { }
    public static void LBSRadius(LBSRadiusParams @params, Action<string> onSuccess, Action<string> onError) { }
    public static bool DataTrack(DataTrackParams @params) { }
}
```

#### 微信小游戏 TS

```typescript
// ✅ 方法名不变，优化结构
export class RXSDK {
    public static async login(request: LoginRequest): Promise<RXResult<LoginResponse>> { }
    public static async lbsRadius(request: LBSRadiusRequest): Promise<RXResult<LBSRadiusResponse>> { }
    public static dataTrack(request: DataTrackRequest): boolean { }
}
```

### 优化检查清单

在优化接口结构时，请检查：

- [ ] **方法名保持不变**：新接口使用与旧接口相同的方法名
- [ ] **参数封装**：超过 3 个参数的方法必须使用参数对象
- [ ] **类型安全**：使用强类型参数对象，避免 `Map/Dictionary`
- [ ] **回调统一**：使用统一的回调机制（`RXRequestCallback`/`Result`/`Promise`）
- [ ] **可选参数**：使用 `@Nullable`/`Optional`/`?` 标注可选参数
- [ ] **向后兼容**：旧接口和旧实现保持不变

---

## ✅ 重构检查清单

在重构接口时，AI 必须检查以下项：

### 接口设计

- [ ] **方法名保持不变**：新接口使用与旧接口相同的方法名
- [ ] 方法参数不超过 5 个（超过需封装为参数对象）
- [ ] 使用强类型参数对象（避免过度使用 `Map/Dictionary/Object`）
- [ ] 参数顺序符合规范（Context → 业务参数 → 回调）
- [ ] 使用平台特定的可选类型标注（`@Nullable`/`Optional`/`?`）

### 回调规范

- [ ] 使用统一的回调机制（Android: `RXRequestCallback`，iOS: `RXSDKCompletion`，Unity: `Action<string>`，TS: `Promise<RXResult>`）
- [ ] 回调在主线程执行（所有平台）
- [ ] 成功/失败通过 `code` 字段判断（`code == 0` 为成功）
- [ ] 异常通过异常回调返回

### 错误处理

- [ ] 使用统一错误码（4 位客户端错误码或 6 位服务端错误码）
- [ ] 错误信息清晰可读
- [ ] 三方错误放在 `thirdcode`/`thirdmsg` 中
- [ ] 参数校验失败返回统一错误码

### 接口结构优化

- [ ] **方法名保持不变**：新接口使用与旧接口相同的方法名
- [ ] **参数封装**：超过 3 个参数的方法必须使用参数对象
- [ ] **类型安全**：使用强类型参数对象，避免 `Map/Dictionary`
- [ ] **回调统一**：使用统一的回调机制（`RXRequestCallback`/`Result`/`Promise`）
- [ ] **可选参数**：使用 `@Nullable`/`Optional`/`?` 标注可选参数

### 兼容性

- [ ] 不修改已有方法签名
- [ ] 新增方法不破坏现有功能
- [ ] 旧接口标记为废弃（如需要）
- [ ] 提供向后兼容的重载方法
- [ ] **方法名保持不变**：新接口方法名与旧接口一致

### 文档

- [ ] 接口有完整的文档注释（Javadoc/Doc Comment/XML Documentation/JSDoc）
- [ ] 参数说明清晰完整
- [ ] 包含使用示例
- [ ] 更新接口文档（`*_api.md`）

### 测试

- [ ] 接口可单元测试
- [ ] 覆盖正常场景、异常场景、边界场景
- [ ] 验证回调线程正确性
- [ ] 验证错误处理正确性

### 跨端一致性

- [ ] 接口语义跨端一致（Android/iOS/Unity/小游戏）
- [ ] 错误结构字段跨端一致（`code/msg/trace_id/thirdcode/thirdmsg`）
- [ ] 回调线程约定跨端一致（主线程）
- [ ] 参数命名跨端一致（遵循平台命名规范）

---

## 💡 最佳实践示例

### 示例 1：用户登录接口（多端对比）

```java
// Android
/**
 * 用户登录
 * 
 * @param params 登录参数，包含登录类型、用户名、密码等
 * @param callback 回调接口，成功时返回登录信息，失败时返回错误码和错误信息
 *                 回调在主线程执行
 */
void login(LoginParams params, RXRequestCallback callback);

// iOS Objective-C
/// 用户登录
/// @param request 登录参数，包含登录类型、用户名、密码等
/// @param completion 回调接口，成功时返回登录信息（data），失败时返回错误（error）
///                   回调在主线程执行
- (void)loginWithRequest:(RXLoginRequest *)request
              completion:(RXSDKCompletion)completion;

// Unity C#
/// <summary>
/// 用户登录
/// </summary>
/// <param name="params">登录参数，包含登录类型、用户名、密码等</param>
/// <param name="onSuccess">成功回调，返回登录信息 JSON 字符串，回调在主线程执行</param>
/// <param name="onError">失败回调，返回错误 JSON 字符串，回调在主线程执行</param>
public static void Login(LoginParams @params, Action<string> onSuccess, Action<string> onError)

// 微信小游戏 TS
/**
 * 用户登录
 * @param request 登录参数，包含登录类型、用户名、密码等
 * @returns Promise 成功时返回登录信息，失败时返回错误
 *          回调在主线程执行
 */
static async login(request: LoginRequest): Promise<RXResult<LoginResponse>>
```

### 示例 2：错误处理实现（多端对比）

```java
// Android: ✅ 错误处理
void getUserInfo(RXRequestCallback callback) {
    if (callback == null) {
        throw new IllegalArgumentException("callback cannot be null");
    }
    
    try {
        JSONObject response = httpClient.get("/v1/passport/user/info");
        ThreadUtils.runOnMainThread(() -> {
            callback.onResponse(response);
        });
    } catch (IOException e) {
        ThreadUtils.runOnMainThread(() -> {
            callback.onError(new RXException(RXErrorCode.NETWORK_ERROR, 
                "网络请求失败: " + e.getMessage()));
        });
    }
}

// iOS Objective-C: ✅ 错误处理
- (void)getUserInfoWithCompletion:(RXSDKCompletion)completion {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSError *error = nil;
        NSDictionary *response = [self.httpClient get:@"/v1/passport/user/info" error:&error];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error) {
                NSError *sdkError = [NSError errorWithDomain:@"RXSDKErrorDomain"
                                                         code:1000
                                                     userInfo:@{NSLocalizedDescriptionKey: @"网络请求失败"}];
                completion(nil, sdkError);
            } else {
                completion(response, nil);
            }
        });
    });
}

// Unity C#: ✅ 错误处理
public static void GetUserInfo(Action<string> onSuccess, Action<string> onError) {
    Task.Run(async () => {
        try {
            string response = await httpClient.GetAsync("/v1/passport/user/info");
            UnityMainThreadDispatcher.Instance().Enqueue(() => {
                onSuccess?.Invoke(response);
            });
        } catch (Exception e) {
            var error = new RXSDKError { code = 1000, msg = $"网络请求失败: {e.Message}" };
            UnityMainThreadDispatcher.Instance().Enqueue(() => {
                onError?.Invoke(JsonUtility.ToJson(error));
            });
        }
    });
}

// 微信小游戏 TS: ✅ 错误处理
static async getUserInfo(): Promise<RXResult<UserInfo>> {
    try {
        const response = await wx.request({
            url: "/v1/passport/user/info",
            method: "GET"
        });
        return { ok: true, data: response.data };
    } catch (error) {
        return { 
            ok: false, 
            error: { 
                code: 1000, 
                msg: `网络请求失败: ${error.message}` 
            } 
        };
    }
}
```

---

## 🔗 相关文档

- [错误码规范](../specs/error_codes.md)
- [错误格式说明](../api/01_error_format.md)
- [API 模板](../../.cursor/rules/api_template.mdc)
- [SDK 结构标准](../../.cursor/rules/sdk_structure.mdc)
- [Android 回调接口说明](../../android/api/callback.md)
- [Android PassportApi 接口文档](../../android/api/passport_api.md)
- [Android SocialApi 接口文档](../../android/api/social_api.md)
- [Android GameAreaApi 接口文档](../../android/api/gamearea_api.md)
- [Android RXSdkApi 接口文档](../../android/api/rxsdk_api.md)

---

## 📌 AI 重构提示

当使用 AI 重构接口时，请：

1. **参考本规范**：确保新接口符合所有设计原则
2. **检查清单**：使用重构检查清单验证接口设计
3. **保持兼容**：不破坏已有接口，采用增量扩展
4. **统一回调**：新接口统一使用平台特定的回调机制
5. **完善文档**：更新接口文档和使用示例
6. **跨端一致**：确保多端接口语义和错误结构一致

**提示词示例**：

```
请按照 common/guidelines/api_design_spec.md 规范优化 login 接口：
1. 保持方法名不变：login
2. 创建 LoginParams 参数对象，封装所有登录参数
3. 使用 RXRequestCallback 替代 RXJSONCallback
4. 在 RXSDK 类中实现新接口（方法名不变）
5. 确保回调在主线程执行
6. 添加参数校验
7. 更新文档注释
8. 保持向后兼容（旧接口和旧实现保持不变）
9. 确保跨端接口语义一致
```

---

## 📋 平台特定注意事项

### Android

- 使用 `RXRequestCallback` 替代 `RXJSONCallback`（新接口）
- 使用 `@Nullable` 和 `@NonNull` 标注参数
- 使用 `@StringDef` 限制字符串参数
- 使用 `ThreadUtils.runOnMainThread()` 确保回调在主线程

### iOS

- 使用 `RXSDKCompletion` block 作为回调类型（`typedef void (^RXSDKCompletion)(NSDictionary * _Nullable data, NSError * _Nullable error);`）
- 使用 `_Nullable` 和 `_Nonnull` 表示可选参数
- 使用 `NS_STRING_ENUM` 或字符串常量限制字符串参数
- 使用 `dispatch_async(dispatch_get_main_queue(), ^{ ... })` 确保回调在主线程

### Unity

- 使用 `Action<string>` 回调（JSON 字符串）
- 使用可空类型（`string?`）表示可选参数
- 使用 `enum` 限制字符串参数
- 使用 `UnityMainThreadDispatcher` 确保回调在主线程

### 微信小游戏

- 使用 `Promise<RXResult<T>>` 作为返回类型
- 使用可选属性（`?`）表示可选参数
- 使用联合类型（`"a" | "b"`）限制字符串参数
- Promise 回调自动在主线程执行

---

**最后更新**：2025-12-10  
**版本**：v1.0（多端通用）
