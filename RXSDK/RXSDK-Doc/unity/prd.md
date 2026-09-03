mcp 添加功能：
1. unity Android google 登录和支付需要引入 google-services.json 文件， 将其放入 Assets/Plugins/Android目录下

2 unity ios google 登录需要打开Assets/RuiXueSettings/RuiXueSDK_GoogleXcodeSetting.asset 文件，在文件中填写
```
  GIDClientID: Google GIDClientID
  REVERSED_CLIENT_ID: Google REVERSED_CLIENT_ID
```
2.1 初始化
```
RXGoogle.Regist("your clientID");
```

3. unity Android facebook 登录需要打开 AndroidManifest.xml 文件， 在 application 标签下新增：
```
<application>
    <meta-data
        android:name="com.facebook.sdk.ApplicationId"
        android:value="@string/facebook_app_id" />
    <meta-data
        android:name="com.facebook.sdk.ClientToken"
        android:value="@string/facebook_client_token" />
</application>
```
3.1 打开 launcherTemplate.gradle 文件，在 defaultConfig 下新增
```
    resValue "string", "facebook_app_id", "your facebook appid"
    resValue "string", "facebook_client_token", "your facebook client token"
```
3.2 打开 launcherTemplate.gradle 文件，在 defaultConfig 下新增
```
manifestPlaceholders = [
           FACEBOOK_APP_ID : "your facebook appid"
       ] 
```

4. unit ios facebook 登录需要打开Assets/RuiXueSettings/RuiXueSDK_FacebookXcodeSetting.asset 文件，在文件中填写
```
  FbId: fb+您的FacebookAppID。例如fb111111111
  FacebookAppID: 您的FacebookAppID
  FacebookClientToken: 您的FacebookClientToken
```