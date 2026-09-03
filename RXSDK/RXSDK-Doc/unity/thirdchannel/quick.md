## SDK 集成
```
implementation 'com.ruixue:rxsdk_quick:${version}'
```

## 配置说明

:::tip
需要将 Unity 工程导出为 Android Studio 工程进行配置
:::

- 在 `src/main/AndroidManifest.xml` 中配置 application 节点下增加 `android:networkSecurityConfig` 属性
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="@your 游戏包名">
    ...
    <application android:networkSecurityConfig="@xml/network_security_config">
    
    </application>
</manifest>    
```
- 在`src/main/res/xml` 中添加 `network_security_config.xml`, 内容如下
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
</network-security-config>
```

- Application 配置 参考 [这里](https://doc.ruixueyun.com/main/#/view?viewPath=a80d466b-39f6-40b1-b3a1-8289ceff1c8c&title=%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F&tab=&index=1)
并在 游戏的 Application继承 QuickSdkApplication，根据上面文档，采用如下配置
```java

public class GameApplication extends QuickSdkApplication {
   
    @Override
    public void onCreate() {
        super.onCreate();
        RuiXueSdk.onApplicationCreate(this);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        RuiXueSdk.attachBaseContext(base);
    }
}

```
## 添加闪屏
- 新建游戏闪屏 Activity，继承自 `QuickSdkSplashActivity`，参考如下代码

```java
public class SplashActivity extends QuickSdkSplashActivity {

    @Override
    public int getBackgroundColor() {
        return Color.WHITE;
    }

    @Override
    public void onSplashStop() {
        // QuickDemoActivity 替换为游戏主界面 Activity
        Intent intent = new Intent(SplashActivity.this, QuickDemoActivity.class);
        startActivity(intent);
        finish(); // 关闭闪屏界面
    }
}
```
- 并将闪屏 Activity 添加到 AndroidManifest.xml 中，并设置为`游戏启动 Activity`
```java
<activity android:name="com.quicksdk.test.SplashActivity" android:label="@string/app_name">
    <intent-filter>
    <action android:name="android.intent.action.MAIN">
                 
        <category android:name="android.intent.category.LAUNCHER">
    </category></action></intent-filter>
</activity>
```
- android:name属性，其值为游戏自定义的闪屏Activity全路径
- android:screenOrientation属性，其值根据游戏需求决定是横屏还是竖屏 (landscape 或者 portrait)

## 初始化 SDK(切勿重复调用初始化)
首先，您需要在程序开始的地方初始化，一般在游戏主界面 onCreate 方法中调用（也就是UnityActivity中 onCreate），通过调用initThirdSdk方法初始化游戏SDK。`调取前应检查权限`
在初始化失败的状态下，此方法必须在UI线程中调用。代码参考如下

```java
private static final int REQUEST_CODE = 10011; // 这个 CP 根据自己的情况定义，这里只是一个例子
(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
private void checkPermissionPreInit() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED
                    || (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED)) {
            //没有,申请权限  权限数组
            ActivityCompat.requestPermissions(this, new String[] { Manifest.permission.READ_PHONE_STATE ,Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_CODE);
        } else {
            init();
        }
    } else {
        init();
    }
}
private void init() {
    Map<String,Object> thirdSdkParams=new HashMap<>();
    thirdSdkParams.put("quick_product_code", "@your quick product code");
    thirdSdkParams.put("quick_product_key", "@your  自己的 quick product key");
    RuiXueSdk.getApi().initThirdSdk(activity, thirdSdkParams, new RXRequestCallback() {
                @Override
                public void onResponse(JSONObject jsonObject) {
                    int code = jsonObject.optInt("code", -1);
                    if (code == 0) {
                        //todo 成功
                    }else {
                        //todo 失败
                    }
                }
            });
}


@Override
public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    RuiXueSdk.onRequestPermissionsResult(this, requestCode, permissions, grantResults);
    if (requestCode != REQUEST_CODE) {
        return;
    }

    if (grantResults.length == 2 && grantResults[0] == PackageManager.PERMISSION_GRANTED && grantResults[1] == PackageManager.PERMISSION_GRANTED) {
        //申请成功
        init();
    } else {
        //失败  这里逻辑以游戏为准 这里只是模拟申请失败 cp方可改为继续正常初始化调登录然后进游戏 或者继续申请权限 或者退出游戏 或者其他逻辑
    }
}
```

## 生命周期接入
在 UnityActivity 的中接入 瑞雪生命周期回调

```java
public class UnityPlayerActivity extends Activity implements IUnityPlayerLifecycleEvents {
    @Override protected void onCreate(Bundle savedInstanceState){
        RuiXueSdk.onCreate(this);
    }
    
        @Override
    protected void onRestart() {
        super.onRestart();
        RuiXueSdk.onRestart(this);
    }
    
    ...
    
    
}
```
:::tip
以下API可在 Unity 中进行接入
:::
## 登录 (必须接入) 请一定确保要初始化成功再调用登录
请参考 [Unity 端登录API](https://doc.ruixueyun.com/main/#/view?viewPath=deaadc5f-8b51-4f6c-8590-3c7a074cf1ad&title=%E7%99%BB%E5%BD%95&tab=&index=1)
参考代码
```csharp
    private void Login()
    {
        
        LogUtil.Log("EventManager", "发起Quick登录");
        
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.QUICK;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);

    }
```

## 支付 (必须接入)
请参考 [Android端支付API](https://doc.ruixueyun.com/main/#/view?viewPath=708d6f55-e7f8-4c32-9aa7-d5beabfdcdee&title=%E6%94%AF%E4%BB%98&tab=&index=1)

## 退出 (必须接入)
参考代码
```csharp
    public void ExitApp()
    {
        RuiXueSdk.ExitApp(ExitConfirm, ExitCancel);
    }
    
    private void ExitConfirm(string res)
    {
        LogUtil.Log("EventManager", $" ExitApp res: {res}");
    }

    private void ExitCancel()
    {
        LogUtil.Log("EventManager", $" ExitCancel");
    }
```

## 游戏角色上报(必须接入)
<span style="color:#ff0000; ">1) 在创建游戏角色、进入游戏和角色升级3个地方调用此接口，当创建角色时createRole值为true，其他两种情况为false。true & false  均需要调用一遍</span>
<span style="color:#ff0000;">2) GameRoleInfo所有字段均需上传，不能传null，游戏没有的字段可以传一个默认值（比如 default 或者 1 之类的）。</span>
<span style="color:#ff0000;">3) 关于360渠道上传角色信息的具体说明，请参考：https://www.quicksdk.com/doc-190.html?cid=15</span>

参考代码
```csharp
    public void SetRoleInfo()
    {
        RXGameRoleInfo rxGameRoleInfo = new RXGameRoleInfo();
        rxGameRoleInfo.serverID = "1";// 服务器ID
        rxGameRoleInfo.serverName = "火星服务器";// 服务器名称
        rxGameRoleInfo.gameRoleName = "裁决之剑";// 角色名称
        rxGameRoleInfo.gameRoleID = "1121121";// 角色ID
        rxGameRoleInfo.gameUserLevel = "12";// 等级
        rxGameRoleInfo.vipLevel = "9"; // 设置当前用户vip等级，必须为整型字符串
        rxGameRoleInfo.gameBalance = "5000"; // 角色现有金额
        rxGameRoleInfo.gameUserLevel = "12"; // 设置游戏角色等级
        rxGameRoleInfo.partyName = "无敌联盟"; // 设置帮派，公会名称
        rxGameRoleInfo.roleCreateTime = "1473141432"; // UC与1881渠道必传，值为10位数时间戳
        rxGameRoleInfo.partyId = "1100"; // 360渠道参数，设置帮派id，必须为整型字符串
        rxGameRoleInfo.gameRoleGender = "男"; // 360渠道参数
        rxGameRoleInfo.gameRolePower = "38"; // 360渠道参数，设置角色战力，必须为整型字符串
        rxGameRoleInfo.partyRoleId = "11"; // 360渠道参数，设置角色在帮派中的id
        rxGameRoleInfo.partyRoleName = "帮主"; // 360渠道参数，设置角色在帮派中的名称
        rxGameRoleInfo.professionId = "38"; // 360渠道参数，设置角色职业id，必须为整型字符串
        rxGameRoleInfo.profession = "法师"; // 360渠道参数，设置角色职业名称
        rxGameRoleInfo.friendlist = "无"; // 360渠道参数，设置好友关系列表，格式请参考：http://open.quicksdk.net/help/detail/aid/190
        RXQuickWrapper.SetGameRoleInfo(rxGameRoleInfo, true);
    }
```

## 登出
- 在游戏需要登出的地方调用如下代码
```csharp
    public void OnLogout()
    {
        RXLogin.Logout(LogOutResponseDelegate, LogOutErrorDelegate);
    }

    private void LogOutResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"LogOutResponseDelegate: data: {data}");
    }
    
    private void  LogOutErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"LogOutErrorDelegate : {error}");
    }
```

## 游戏账号切换 和 logout 全局监听
参考代码 
```csharp 
    private void SetRuiXueSdkCallback()
    {
        RuiXueSdk.SetSdkCallback(PublicDelegate, LogOut, SwitchAccountDelegate);
    }

    public void PublicDelegate(int type, string jsonDicData)
    {
        LogUtil.Log("EventManager", $"type: {type}, jsonDicData: {jsonDicData}");
    }

    private void LogOut(int code, string msg)
    {
        LogUtil.Log("EventManager", $"code: {code}, msg: {msg}");
    }

    public bool SwitchAccountDelegate(int code, string data)
    {
        LogUtil.Log("EventManager", $"code: {code}, data: {data}");
        return true;
    }
```

## 实名认证（登录成功后进行调用，目前渠道基本都做了实名跟防沉迷，游戏可以不用调此接口获取实名信息来做防沉迷限制）
说明：ResponseDelegate将返回封装的json实体；uid (表示用户id)，age (表示年龄, 如果渠道没返回默认为-1)，realName (是否已实名： true表示已实名， false表示未实名；如果渠道没返回默认为 false)，resumeGame (渠道实名认证失败之后是否可以继续游戏 ：true表示可以， false表示不可以；如果渠道没返回默认为 true)，other (预留字段，如果渠道没返回默认为""的字符串)
```csharp
    public void RealName()
    {
        RXQuickWrapper.VerifyRealName(RealNameResponseDelegate, RealNameErrorDelegate);
    }
    
    private void RealNameResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"LogOutResponseDelegate: data: {data}");
    }
    
    private void RealNameErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"LogOutErrorDelegate : {error}");
    }
```