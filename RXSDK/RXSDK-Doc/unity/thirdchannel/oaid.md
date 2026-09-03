### 接入方式
* Package Manager 导入 RuiXue.Oaidv2

## SDK集成

信通院MSA SDK [参考链接](https://www.msa-alliance.cn/col.jsp?id=120)

```json
  implementation 'com.ruixue:rxsdk_oaidv2:${version}'
```

## 接口说明

```
     /// <summary>
     /// 带回调初始化
     /// </summary>
     /// <param name="certString"></param>
     /// <param name="onResponse"></param>
     public void InitOaidSdk(string certString, AppOaidCallbackJavaProxy onResponse);

     /// <summary>
     /// 初始化
     /// </summary>
     /// <param name="certString"></param>
     public void InitOaidSdk(string certString);

     /// <summary>
     /// 当前设备是否支持
     /// </summary>
     /// <returns></returns>
     public bool IsSupport();

     /// <summary>
     /// 设备oaid
     /// </summary>
     /// <returns></returns>
     public string GetOAID();
```

## 参数说明

| 参数  | 类型   | 说明                  |
| ----- | ------ | --------------------- |
| certString | String | [MSA官方](https://www.msa-alliance.cn/col.jsp?id=120) 申请的pem 证书 |

## 调用示例

```
    public void Init()
    {
        RXOaidv2.InitOaidSdk("@your 证书内容", ReAppOaidCallbackJavaProxy);
    }
    
    public void ReAppOaidCallbackJavaProxy(string data)
    {
        LogUtil.Log("EventManager",$"ReAppOaidCallbackJavaProxy: {data}");
    }

    public void IsSupport()
    {
        LogUtil.Log("EventManager",$"isSupport: {RXOaidv2.IsSupport()}");
    }

    public void GetOAID()
    {
        LogUtil.Log("EventManager",$"GetOAID: {RXOaidv2.GetOAID()}");
    }

```

## 配置说明

- 需要在 `Assets/Plugins/Android` 目录将 `supplierconfig.json` 放在当中
  appid 只与 vaid 的获取有关，用于判断是否为同一开发者，如不需获取 vaid 可不填写。目前只需设置 vivo 品牌的 appid。
  修改 `supplierconfig.json` 文件里的 **appid**（去对应⼚商注册获取，vivo 渠道为必填项），如图所示：

```json
{
  "supplier":{
    "vivo":{
      "appid":"@your vivo appid"
    },
    "xiaomi":{
    },
    "huawei":{
    },
    "oppo":{
    }
  }
}
```

## 混淆配置

在应用级根目录下打开混淆配置文件`proguard-user.txt`，加入排除SDK的混淆配置

```
# sdk
-keep class com.bun.miitmdid.** { *; }
-keep interface com.bun.supplier.** { *; }

# asus
-keep class com.asus.msa.SupplementaryDID.** { *; }
-keep class com.asus.msa.sdid.** { *; }
# freeme
-keep class com.android.creator.** { *; }
-keep class com.android.msasdk.** { *; }
# huawei
-keep class com.huawei.hms.** {*;}
-keep interface com.huawei.hms.** {*;}
# lenovo
-keep class com.zui.deviceidservice.** { *; }
-keep class com.zui.opendeviceidlibrary.** { *; }
# meizu
-keep class com.meizu.flyme.openidsdk.** { *; }
# nubia
-keep class com.bun.miitmdid.provider.nubia.NubiaIdentityImpl
# oppo
-keep class com.heytap.openid.** { *; }
# samsung
-keep class com.samsung.android.deviceidservice.** { *; }
# vivo
-keep class com.vivo.identifier.** { *; }
# xiaomi
-keep class com.bun.miitmdid.provider.xiaomi.IdentifierManager
# zte
-keep class com.bun.lib.** { *; }
# coolpad
-keep class com.coolpad.deviceidsupport.** { *; }
# EEBBK
#None
# honor
-keep class com.hihonor.ads.** {*; }
```

## 覆盖范围

| **厂商名称**                             | **支持版本**                                                 |
| ---------------------------------------- | ------------------------------------------------------------ |
| 华为                                     | HMS 2.6.2 及以上                                             |
| 小米                                     | MIUI 10.2 及以上                                             |
| vivo                                     | Android 6 及以上                                             |
| OPPO                                     | colorOS 3 及以上                                             |
| 联想                                     | ZUI 11.4 及以上                                              |
| 三星                                     | Android 10 版本及以上                                        |
| 魅族                                     | Android 10 版本及以上                                        |
| 努比亚                                   | Android 10 版本及以上                                        |
| 中兴                                     | Android 10 版本及以上                                        |
| 华硕                                     | Android 10 版本及以上                                        |
| 一加                                     | Android 10 版本及以上                                        |
| 黑鲨                                     | Android 10 版本及以上                                        |
| 摩托罗拉                                 | Android 10 版本及以上                                        |
| Freeme OS                                | Android 10 版本及以上                                        |
| 酷赛（铂睿智恒）                         | Android 10 版本及以上                                        |
| Realme                                   | Android 10 版本及以上                                        |
| 荣耀（仅供参考，具体以荣耀官方解释为准） | HMS 2.6.2 及以上或MagicUI4 及以上且荣耀账号 6.0.5.300 及以上 |
| 酷派                                     | Android 10 版本及以上                                        |
| 小天才                                   | Android 10 版本及以上                                        |
| 360 OS                                   | Android 6 版本及以上                                         |

## 常见问题

1. 如何申请证书
   证书需要填写 [example_batch.csv](https://file.ruixuecloud.com/public/csv/example_batch.csv) 后发送到 <msa@caict.ac.cn> 申请，注意每
   个包名对应一个签名，申请时要将所需的全部包名填写到表格中。默认证书有效
   期一年，快过期时请及时发送邮件申请更新。
2. 证书更新
   证书具有有效期，证书过期会返回 INIT_ERROR_CERT_ERROR，证书不具备热
   更新和在线续期功能，为避免直接将证书集成到 APP 中之后需要更新 APP 才能更
   新证书情况，建议证书放在应用后台调用，从自己后台获取证书信息，或者当调
   用 oaid SDK 接口提示证书无效时，可以调用后台接口及时更新证书信息。
   请记录证书有效期，快到期时提前申请证书，申请新证书之后，如原证书没
   有到期，则不会失效，两个证书可以同时上线使用。
3. 证书有效期如何查看
   如是 Windows 电脑，在证书文件后缀添加.der，再双击，即可查看证书有效
   期。
4. 同一公司多 APP
   如果同一家公司有有多个 APP 需要集成 SDK，只需申请注册一个账号，多个
   APP 都可以使用 sdk，但对于不同包名的不同 APP，需要申请多个证书
