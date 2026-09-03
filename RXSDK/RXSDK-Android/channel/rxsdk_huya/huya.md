 虎牙游戏联运SDK接入文档
一 概述

虎牙游戏联运SDK主要提供一套游戏登录lo，支付等接口，接入方只需要调用少数几个接口就可以实现复杂的游戏登录，注册，认证，支付，防沉迷等功能，并有很高的可重用性。

二 接入流程
2.1 向虎牙申请接入

向虎牙提供相关的信息后，会提供相关的键值以供接入：
参数使用场景 参数名 说明
基础参数 gameid
支付相关 payappId
payappKey 正式/测试环境不同
说明：业务方在测试环境完成支付相关功能接入后才可分配正式环境参数
登录相关 loginclientId
loginclientSecret 正式/测试环境相同

详情数据使用见初始化流程（3.2）。

2.2 接入sdk

2.2.1 引入aar文件
将虎牙提供的libs 目录下的aar文件复制到项目app/libs中

2.2.2 gradle中引用aar文件
1、在 ./build.gradle中allprojects  repositories 后插入[dirs 'libs']  如下：

allprojects{
  ....
  repositories{
....
 flatDir {
   dirs 'libs'   // aar目录
  }
...
  }
  ...
}

2、在gradle 的依赖中加入对aar的依赖和其他额外依赖

implementation (name: 'berry-xxx', ext: 'aar')

implementation 'com.github.bumptech.glide:glide:4.8.0'
implementation 'com.nostra13.universalimageloader:universal-image-loader:1.9.5'
implementation ('com.jakewharton:disklrucache:2.0.2')
implementation ('android.arch.lifecycle:extensions:1.1.1')
implementation ('com.google.code.gson:gson:2.8.5')
implementation ('com.alibaba:fastjson:1.1.34.android')
implementation ('com.squareup.okhttp3:okhttp:3.10.0')
implementation ('com.squareup.okio:okio:1.14.0')

implementation ('org.jetbrains.kotlin:kotlin-android-extensions-runtime:1.3.72')
implementation ('org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.3.50')
implementation ('org.jetbrains:annotations:13.0')

3、1.3.7以上版本：
//在allprojects的repositories中添加maven仓库
allprojects {
    repositories {
        maven {
            url '<https://artifact.bytedance.com/repository/Volcengine/>'
        }
        // 其他仓库
    }
}

// 在build.gradle文件的dependencies中引入以下SDK
implementation 'com.bytedance.applog:RangersAppLog-Lite-cn:6.16.9'
implementation 'com.bytedance.ads:AppConvert:1.3.2.1'

2.2.3 manifest中添加权限
<uses-permission android:name="android.permission.RECORD_AUDIO"/>
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
<uses-permission android:name="android.permission.CAMERA"/>

2.3 兼容性问题

支持平台：

Android 5.0及以上（5.0以下请屏蔽）

支持开发环境：

Android Studio 1.4及以上

Android版本配置要求

目标版本targetSdkVersion 29以上

最小版本 minSdkVersion 21（Android 5.0）

ndk配置：
支持v7a 和 v8a，主流模拟器已测试支持
ndk {
    abiFilters "armeabi-v7a","arm64-v8a"
}

 2.4 注意事项

1.请到debug模式下完成测试，之后再向虎牙工作人员申请正式id

2.debug模式账号体系是独立的，debug模式下手机验证码为123456

3.签名参数获取，建议运营同学询问开发同学，下面提供简单获取方式：
通过cmd命令和签名文件获取

keytool -list -keystore D:\Desktop\app_key

取其中md5的即可

2.5 包名规范
游戏客户端的游戏包名 需要以com.huya.berry开头即可。

三 sdk接口使用

3.1 接口概述

包含接口：

初始化，反初始化，修改横竖屏配置，设置sdk事件监听，登录，登出，查询登录状态，获取实名信息，支付。

 3.2 初始化（必须调用，只需一次，有回调）

初始化Berry SDK，所有功能的基础。

调用时机：用户同意了游戏隐私协议以后

具体初始化代码和参数如下：
1、在manifest中配置loginClientID
sdk 1.3.8以上版本不再需要此配置
<!--"HYNXsL84f4xTuLa6qX"替换为申请的loginclientId-->
<meta-data
android:name="HY_OPENAPPID"
android:value="HYNXsL84f4xTuLa6qX" />  

2、初始化
HuyaBerryConfig huyaBerryConfig = new HuyaBerryConfig.Builder()
     // 申请的gameid
    .gameId("311135")
    //申请的loginclientId（正式/测试环境相同）
    .loginClientID("HYNXsL84f4xTuLa6qX")
    //申请的loginclientSecret（正式/测试环境相同）
    .loginClientSecret("5cb111d4a1b111bbb86505babdf4c4f7")  
    // 申请的支付模块的payappId（正式/测试环境不同）
    .payAppId("916")  
    // 是否用测试环境（正式环境为false）
 .debugMode(true)
    //横竖屏设置（默认为竖屏）
 .landscapeMode(false)  
    //是否在悬浮球里展示切换账号入口（默认不展示）
    .isShowSwitchCountInGameCenter(false)
 .build();
HuyaBerry.instance().init(getApplication(), huyaBerryConfig);

3.3 反初始化（必须调用，可多次）

退出应用并完成虎牙Berry SDK的资源回收工作。

调用时机：在应用结束的地方调用。

HuyaBerry.instance().uninit();

3.4 修改横竖屏配置（可选，可多次）

可修改横竖屏配置，会影响之后显示的界面。

调用时机：任意。
//横竖屏设置，true为横屏，false竖屏
HuyaBerry.instance().changeLandscapeMode(false);

 3.5 设置sdk事件监听（只需1次）

设置SDK相关事件的回调，回调的事件为<key,value>形式，定义及相关键值在HuyaBerry.BerryEvent类中。

调用时机：在初始化方法之前（可以收到所有的事件回调）。

HuyaBerry.instance().setBerryEventDelegate(new HuyaBerry. BerryEvent() {
@Override
public void onEventCallback(Map<String, String> params) {
    if (params == null) {
        return;
    }
    String eventType = params.get (HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE);
switch (eventType) {
    // 下面所有回调中resultCode为0代表成功
    case HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_INIT:
    // 表示sdk初始化完成，可以做后续的登录，支付等操作
    // eg:{eventType=init, resultCode=0, msg=}
    break;
    case HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_LOGIN:
    // 表示登录回调，返回的msg数据里resultCode为0代表登录成功，取
    //key为msg数据里的unionid和accessToken信息跟游戏服务器校验进行游戏登录操作，msg数据为json格式
//eg:{eventType=login, resultCode=0, msg={“unionid”:”xxx”，“accessToken”：“”}
    break;

    case HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_SWITCH_ACCOUNT:
    // TODO: 表示切换账号成功，返回的msg数据里resultCode为0代表切换帐号成功，取key为msg的value里的
    // unionid和accessToken信息跟游戏服务器校验进行游戏登录操作，msg数据为json格式
    //eg:{eventType=switch_account, resultCode=0, msg={“unionid”:”xxx”，“accessToken”：“”}
    break;
    case HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_LOGOUT:
    // 表示成功退出登录，可以进行游戏退出操作
   // eg:{eventType=logout, resultCode=0,msg=xxx}
    break;
    case HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_PAY:
    // 支付结果，成功返回0，失败返回-1，用户取消返回-2，成功会返回orderid
 // 注意⚠️，这里的支付结果仅仅指sdk完成唤醒支付对应的客户端，具体用户支付结果需要根据服务器回调确认
 // eg:{eventType=pay, resultCode=0, msg={“orderId”:”xxx”}}
    break;
     case HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_QUIT:
     // TODO: 表示已经被未成年限制了，需要退出游戏或者重新拉起登录页面
    // 1.3.8新增逻辑
    break;
    default:
    break;
    }
}
});

回调参数及时机：
事件名 eventType 回调触发时机 回调参数 说明
初始化 BERRYEVENT_EVENTTYPE_INIT 调用初始化接口 {eventType=init,resultCode=0,msg=""} 表示sdk初始化完成，可以做后续的登录，支付等操作。
登录 BERRYEVENT_EVENTTYPE_LOGIN 调用登录接口时 {eventType=login,resultCode=0,msg={"unionid":"xxx","accessToken":""} 表示登录回调，返回的msg数据里resultCode为0代表登录成功，取key为msg数据里的unionid和accessToken信息跟游戏服务器校验进行游戏登录操作，msg数据为json格式
退出登录 BERRYEVENT_EVENTTYPE_LOGOUT 1、调用退出登录接口时
2、悬浮球内点击退出登录按钮时
3、未成年防沉迷被踢下线时 {eventType=logout,resultCode=0，msg=“xxx”}

msg等于“kickout”标识未成年防沉迷的退出登录
msg等于“click”表示主动退出的登录 表示成功退出登录，可以进行游戏退出操作。
 <=1.3.7版本未成年防沉迷只会回调logout，>=1.3.8版本未成年防沉迷会回调quit和logout，logout中新增了msg区分是防沉迷的退出登录还是手动退出登录

切换帐号 BERRYEVENT_EVENTTYPE_SWITCH_ACCOUNT 1、调用切换帐号接口时
2、悬浮球内点击切换帐号按钮时 {eventType=switch_account,resultCode=0,msg={"unionid":"xxx","accessToken":""} 表示切换账号回调，返回的msg数据里resultCode为0代表切换帐号成功，取key为msg的value里的 unionid和accessToken信息跟游戏服务器校验进行游戏登录操作，msg数据为json格式
支付 BERRYEVENT_EVENTTYPE_PAY 调用支付接口时 {eventType=pay, resultCode=0, msg={"orderId":"xxx",ext:"xxx",tips:"xxx"}} 支付结果，成功返回0，失败返回-1，用户取消返回-2，成功会返回orderid。失败会返回tips（失败信息）
注意⚠️，这里的支付结果仅仅指sdk完成唤醒支付对应的客户端，具体用户支付结果需要根据服务器回调确认
未成年防沉迷 BERRYEVENT_EVENTTYPE_QUIT 1：未成年登录时不在可玩时间段内
2：未成年到达防沉迷时间被踢下线 {eventType=quit,resultCode=0} 表示已经被未成年限制了，需要退出app或者重新拉起登录页面。,resultCode 1表示防沉迷限制，resultcode 2表示其余，比如黑产等

3.6 登录
3.6.1 请求登录
游戏厂商直接调用SDK进行登录(登录接口已经包含了防沉迷功能)

调用时机：未登录。
HuyaBerry.instance().login(MyActivity.this);

//注意 需要在登录的Activity中监听ActivityResult并回传给sdk，用于授权结果处理
@Override
protected void onActivityResult(int requestCode, int resultCode , Intent data) {
    HuyaBerry.instance().onLoginActivityResult(requestCode,     resultCode,data);
    super.onActivityResult(requestCode, resultCode, data);
}

3.6.2 切换账号
⚠️1.2.5版本点击“悬浮球”进入“游戏中心”后可以在个人中心切换账号；切换账号成功后会回调HuyaBerry.BerryEvent.BERRYEVENT_EVENTTYPE_SWITCH_ACCOUNT 需要在回调中实现账号切换的逻辑。
3.6.3 服务端校验
登录回调参数说明：
unionid为唯一id，如果需要服务器校验id合法性可以保留accessToken 通过以下方式校验

**接口说明**

使用loginClientID+accessToken+unionId校验unionId的合法性

**请求说明**

HTTP请求方式：GET或POST

url：

测试环境：<https://udbapi-test.huya.com/open/verifyAccessTokenByUnionId>

正式环境：<https://udbapi.huya.com/open/verifyAccessTokenByUnionId>

**请求参数**
参数名 参数含义
appId 厂商向虎牙申请的开放平台id，即客户端sdk初始化时的loginClientID
accessToken 调用凭证，2小时内有效
unionId 用户唯一标识,请求时需要进行url编码 （utf8）
⚠️注意：请求方式为GET时，unionId需要进行url编码；请求方式为post时，content-type使用application/x-www-form-urlencoded，unionId不需要进行url编码。测试环境和正式环境的accessToken是隔离的，测试环境生成的accessToken只能在测试环境验证通过，正式环境同理。
**请求响应**
{
"errcode": 0,
"errmsg": "成功"
}

说明：响应数据：errcode = 0 代表成功，其他为校验失败

**常见错误**
1、aes decode err while verify open access token
参数与url环境（正式/测试）不匹配。正式环境的url需要使用正式环境返回的accessToken和unionId
2、unpack open id err while verify accesson token
      appId错误。appId为客户端初始化时的loginclientId
3、"errcode":50269,"errmsg":"invalid nonce while verify open access token"
  有生成新的accessToken，但是拿旧的来校验

3.7 登出
调用时机：已登录。
//登出并自动拉起登录弹窗
HuyaBerry.instance().logout(MyActivity.this);  

如果需要登录不自动拉起登录弹窗可以调用下面接口(1.4.0版本新增)//登出并自动拉起登录弹窗
HuyaBerry.instance().logout(MyActivity.this,false);  

3.8 查询登录信息接口

游戏厂商直接调用SDK进行查询
HuyaBerry.instance().queryLoginInfo(MyActivity.this, new CustomUICallback<LoginInfoCallback>() {
@Override
public void onResultCallback(int status, LoginInfoCallback loginInfoCallback) {
    if (status == Callback.SUCCESS) {
  //todo
    } else {
        //todo
    }
    }
});

3.9 获取实名信息

游戏厂商直接调用SDK进行查询

调用时机：已登录。
HuyaBerry.instance().queryCertifical(MyActivity.this,new CustomUICallback<CertificationInfoCallback>() {
@Override
public void onResultCallback(int status, CertificationInfoCallback certificationInfoCallback) {
 // 接口仅返回2项信息，是否登录和用户实名年龄
    if (status == BaseCallback.SUCCESS) {
        //"queryCertifical调用成功"
     } else {
       //"queryCertifical调用失败 是否登录？"
       }
    }
});

 3.10 上报（必须要接入）

请游戏厂商在用户注册角色和角色等级发生变化的时候调用下面的代码上报相关信息
ReportInfo.Builder builder = new ReportInfo.Builder();
builder.setRoleId("roleid");//游戏厂商角色id
builder.setRoleName("rolename");//角色名称
builder.setRealmId("realmid");//区服id
builder.setRealmName("realmName");//区服名称
builder.setChapter("chapter");//关卡，注册时为空可以传空
builder.setRoleLevel(0);//角色等级，注册时为空可以传0
builder.setCareer("career");//角色职业
builder.setServerId("serverid");//角色服务器id
builder.setServerName("servername");//角色服务器名称
HuyaBerry.instance().reportRegisterInfo(builder.build());

3.11 支付下单接口
游戏厂商传入的支付数据，可以实现支付宝支付，微信支付，qq支付功能。  详细的支付流程请看 4

调用时机：已登录。
PayShopData payShopData = new PayShopData();
payShopData.amount = 10*100;//价格，以分位单位，int值
payShopData.bizOrderId = "123123123";//订单id
payShopData.bizSign = "testsign";//订单签名，签名规则：SHA256(厂商订单号+游戏ID（gameID）+支付金额+payappKey)，说明：payappKey由虎牙充值中心分配，请妥善保管。
payShopData.prodName = "10元套餐";//订单描述
HuyaBerry.instance().pay(MyActivity.this,payShopData);

⚠️：SDK支付结果回调仅仅指sdk完成唤醒支付对应的客户端，具体用户支付结果需要根据服务器回调结果确认
四 支付
4.1 支付流程
+

支付流程如上图

申请支付时需要提供支付订单回调和查询地址。服务器间交互如下

4.2 支付接口回调

note: 此接口为业务方实现接口，虎牙审批通过后向业务方分配支付 专用的payappId，payappKey用于支付接口的加密签名，请业务方妥善保管不要对外泄露。业务在测试环境完成开发接入后才可正式上线。

1． 用户支付完成后，充值中心会根据业务方提供的 notifyUrl 使用 http post 进行回调，通知业务方支付结果。业务接收到回调后，需返回 code=200 的json格式数据成功处理标识（参考下面4.2.3 ）。如果返回其它值，充值中心将认为业务接收回调失败，将进行重试。

2． 回调通知一般都是支付成功的通知。

3． 业务实现此接口，应做幂等处理。在异常情况下，业务可能收到2次以上通知。

4． 建议业务方收到订单回调后再调用查询接口反查订单支付状态保证数据的准确性，订单查询接口参考下方（2 支付订单查询），此项建议主要为了防止避免一些签名被破解，或者秘钥泄露带来的安全隐患。

4.2.1 接口协议说明[post 方式]
参数名称 类型  参数值  说明
appId String  必填  由虎牙充值中心分配即payappid，例如：1001
 sign String 必填  签名串，SHA256(data=data&secret= payappKey)，说明payappKey由虎牙充值中心分配
data Json  必填  业务数据，json格式，具体见下表

data 属性说明：
字段 类型 参数值 说明
orderId String 必填 虎牙支付订单号
bizOrderId String 必填 业务请求订单号
amount  double 必填 订单金额:100.00，单位：元
realAmount  double 必填 实付金额:100.00 (注意如果使用了优惠券此为优惠后的金额)，单位：元
statusCode string 必填 支付结果： SUCCESS:支付成功
statusMsg string 必填 结果提示信息：PAY_SUCCESS
payTime Long 必填 请求时间
 timestamp Long 必填 请求时间
gameId Long  必填 虎牙游戏ID

4.2.2 业务回调接口处理逻辑

1．验证签名。

2．判断是否是重复回调,重复直接返回success。

3．请根据（amount）字段判断订单金额是否一致，不一致返回fail。

4．业务逻辑处理成功,返回success。失败返回fail。

4.2.3 接口处理返回结果示例

 1．业务处理成功返回json数据
{"code": 200,"msg": "success"}

2．业务处理失败返回json数据
{"code": 500,"msg": "fail"}

五 常见问题

5.1 接入相关

1.S:找不到HuyaBerry类

A:检查SDK版本和接入流程，是否跳过了某个流程

2:游客是否不能进行充值？

A:游客账号支付时，现在会toast提示“游客账号暂不支持支付”。

3.S:游戏绑定手机升级账号会回调到哪个接口？返回的接口都包含哪些参数？

A:游戏绑定手机升级账号回回调登录事件，事件类型login，详细数据可以看文档里的登录回调事件。

4.S:实名认证弹窗点击跳过会回调到哪个接口？返回的接口都包含哪些参数？

A:实名认证会回调实名认证接口。只有一个结果码，0代表成功，-1代表失败。

5.P:涉及支付相关加密验签的appId和appKey如何申请？

A:支付相关的appId和appkey由接入时统一申请分配，只能用于支付相关的业务接口，请妥善保管不要外泄。

6.P:支付相关接口的签名双方不一致？

A:目前签名使用sha256算法，生成时请严格按照文档中的参数格式拼接，注意大小写和字符串单双引号，参数类型等问题。

7.P:支付回调接口支持哪些协议，协议类型？

A:目前支持http/https协议，使用post发送数据，内容编码为Content-type=application/x-www-form-urlencoded

8.S.登录返回成功，但是unionid和accessToken返回空
返回以下信息（登录返回成功，但是unionid和accessToken返回空）时，请检查meta-data中的HY_OPENAPPID是否 设置正确
msg={"accessToken":"","unionid":""}, resultCode=0, eventType=login}

9.S.游客登录没有回调
A：（1）meta-data中appid填写有误 （2）loginClientId虎牙udb没有配置

10.S.找回密码测试环境 ：net::ERR_CLEARTEXT_NOT_PERMITTED
android 9在Manifest Application中添加 : android:usesCleartextTraffic="true"
11.S 授权登录完成后登录弹窗没有关闭
参考3.6.1。在登录时传入的Activity的onActivityResult中添加以下调用。
HuyaBerry.instance().onLoginActivityResult(requestCode,  resultCode,data);
@Override
protected void onActivityResult(int requestCode, int resultCode , Intent data) {
    HuyaBerry.instance().onLoginActivityResult(requestCode,     resultCode,data);
    super.onActivityResult(requestCode, resultCode, data);
}

12.U.aes decode err while verify open access token
可能原因一：参数与url的环境（正式/测试）不匹配。正式环境的url需要使用正式环境返回的accessToken和unionId
可能原因二：校验的clientId 与 获取accessToken和unionId的clientId 不是同一个
13.U.unpack open id err while verify accesson token
      appId错误。appId为客户端初始化时的loginclientId
      请检查manifest中的HY_OPENAPPID是否配置正确，校验接口的appId是否为loginclientId。

14.P.支付时，appid error
A:(1) 测试环境、正式环境的payAppId和payAppKey不同，回调地址也不同。测试环境支付调通时再切换为正式环境，切换为正式环境时需要重新申请payAppId、payAppKey，并配置正式环境的支付回调地址。
(2) 检查初始化时的 payDebugMode正式测试环境是否正确
15.测试环境收不到验证码
A:测试环境验证码为123456
16、虎牙App 授权登录 "签名异常"
请检查包名和md5签名，app的“签名”和“包名” 需要与获取参数时提供给运营的参数相同
17、测试环境授权登录失败
测试环境的sdk需要测试环境的虎牙App进行授权登录才可以成功。（由于游戏方没有测试环境的虎牙app，所以只能在正式环境进行授权登录）
18、虎牙App 授权登录 失败，没有提示
请先检查3.6中的回调接口是否有调用。
如果有调用，请打印onActivityResult中的resultCode，如果为-2时，请检查签名和包名是否与提供给虎牙运营的一致。
19、支付订单查询的url
支付订单查询通过回调返回，支付成功就会回调厂商。
20、获取验证码时手机号有前缀moc，无法获取验证码
账号未注册导致，先进行注册。
21、切换账号功能
需要先调用退出，再调用登录，即可实现账号切换功能。
22、查询实名认证上报数据
在登陆成功的回调里调用：
HuyaBerry.instance().queryCertifical(getActivity(), new       CustomUICallback<CertificationInfoCallback>()
23、位置权限是必须的吗？
不是必须的，可以取消权限申请。
24、账密登录提示使用版本过低，请安装最新版本后再试
SDK暂不支持人机弹窗验证，如账号短时间内更换设备频繁或存在历史异常记录等情况，都将触发人机验证弹窗提示版本过低，请尝试使用虎牙直播APP授权登录，或对接群内联系运营申请加白
25、拉起支付时提示未安装微信，qq，支付宝等，或点击无反应时
在targetSdk=30以上构建应用时，还需要在AndroidMainest里面添加
<queries>
        <package android:name="com.tencent.mm"/>
        <package android:name="com.tencent.mobileqq"/>
<package android:name="com.duowan.kiwi"/>
        <package android:name="com.eg.android.AlipayGphone"/>
    </queries>
才能正确地拉起已经安装的微信，qq，支付宝等应用。

5.2 回调相关

1.收不到初始化回调：回调只能在设置之后才生效，即设置之后才会接到后续事件的回调，要接到初始化的回调，需要在init方法之前就设置回调
六 更新记录
请使用最新版本sdk。请在用户统一了隐私协议以后再使用sdk相关功能。
SDK及Demo资源下载>>><https://dev.huya.com/docs/live-sdk/sdk-download/>
1.1.3
2020-10-14:有代码更改

1.修改了资源依赖方式，适配eclipse项目

2.修复了部分情况下 查询登录/实名信息没有回调的问题

3.修复了注册时候获取验证码触发验证的问题

1.1.4
2020-10-16:有代码更改

1.更新sdk修复 注册时请求短信验证码出现的bug和监听用户关闭登录框然后马上请求登录的bug

2.增加日志协助定位问题

3.修改部分参数名字，避免混淆，影响到初始化接口 详见文档2.1

4.监听登录activity的onActivityResult的描述从查询登录的介绍移到登录接口的介绍 详见文档3.6

5.代码更新涉及的aar有berry和huyaudbunify，ecplise项目从1.1.3升级可以只替换此2个，as项目建议替换所有aar

1.1.5
2020-11-06:有代码更改

1.新增上报接口

2020-10-14:无代码更改

1.修改文档 标注校验unionid合法性时unionid需要url编码

2020-11-26:有代码更改

1.新增防沉迷限制，详见文档3.12

1.1.7
2020-12-16:有代码更改
体验优化

1.1.8
2021-3-16: 有代码更改
1、登录页面布局优化与合规内容增加说明
2、增加游客防沉迷限制
3、接入优化

1.1.9
2021-05-06:有代码更改
1、实名认证接入国家统一认证平台
2、未实名认证用户禁止登陆游戏
3、修复部分bug

1.2.0
修复实名认证点击没反应的bug；分包渠道号上报bug等优化。

1.2.1
体验问题修复

1.2.2
2021-11-29
支持YOWA云自动登录

1.2.4
2022-3-18
1、添加游戏中心
2、优化部分体验
3、优化防沉迷机制
4、合规处理

1.2.5
2022-3-29：有代码改动，无接口改动
1、添加优惠券功能
2、添加一键开播功能

1.2.6
2022-6-2:有代码改动，无接口改动。依赖引入有改动（详见2.2.2）。
1、优化部分体验
2、完善优惠券功能

1.2.7
2022-9-7:有代码改动，无接口改动。
1、优化部分体验问题、修复部分已知bug
2、完善合规功能、更新隐私政策协议
3、修复部分接入兼容问题
4、添加切换账号功能
5、注册登陆支持191xxx手机号
6、添加消息推送弹窗、任务中心弹窗

1.2.8
2022-11-22:有代码改动，无接口改动。
1、优化部分体验问题、修复部分已知bug
2、完善合规功能

1.2.9
2023-7-21:有代码改动，无接口改动。
1、修复部分场景开播失败的bug
2、修复部分机型支付拉起微信失败的bug
3、完善合规功能

1.3.0
2023-10-7 ：有代码改动，无接口改动。
1、优化部分体验问题、修复部分已知bug
2、完善合规功能、更新隐私政策协议

1.3.1
2023-10-19：有代码改动，无接口改动。
1、添加使用手机号验证码登录功能
2、glide升级到4.8.0
3、修复在开播时切换帐号登录后悬浮球无法显示的问题

1.3.2
2024-8-15：有代码改动，无接口改动。
1、去除didsdk依赖
2、添加游戏金提醒弹窗

1.3.3
2024-12-13：有代码改动，无接口改动。
1、支持模拟器扫码登录、扫码支付
2、优化部分体验问题

1.3.4
2025-1-22：有代码改动，无接口改动。
1、优化弹窗管理及体验
2、优化部分文案
1.3.5
2025-2-10：有代码改动，无接口改动。
1、禁用手势关闭登录弹窗
1.3.6
2025-3-04：有代码改动，无接口改动。
1、优化悬浮球红点管理及体验
2、修复测试环境扫码支付失败bug
3、修复退后台再进入游戏悬浮球可能无法出现的bug
4、修复切换帐号登录回调不准确的bug
5、修复支付弹窗可能出现黑屏的bug
6、修复登录弹窗可能会被关闭的bug
1.3.7
2025-5-23：有代码改动，无接口改动，有依赖改动（祥见2.2.2）。
1、支持抖音投放。

1.3.8
2025-6-20 ：有代码改动，有接口改动
1、优化调用和回调接口
2、新增日志反馈功能
3、完善防沉迷功能
4、添加未成年监护人认证功能
5、优化部分UI
1.3.9
2025-8-22：有代码改动，无接口改动
1、添加支付防沉迷功能
2、添加支持虎牙币支付功能

1.4.0
2025-8-28：有代码改动，有新增接口
1、优化部分体验
2、新增 登出时不自动拉起登录弹窗的接口

1.4.1
2025-11-20：有代码改动，无接口改动
1、新增 虎牙币支付控制功能

1.4.2
2025-12-25：有代码改动，无接口改动
1、添加java崩溃检测
2、修复部分已知问题

1.4.3
2026-02-03：有代码改动，无接口改动1、 未成年监护人认证改为14周岁

1.4.4
2026-05-19：1、新增登录安全策略验证
2、优化部分体验

1.4.5
2026-06-10：1、新增买量渠道支持快捷登录方式
2、优化部分体验
