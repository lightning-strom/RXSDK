## 简介
openinstall 可帮助应用精准地获取到每一次安装的来源；在应用安装或拉起后，直达指定场景，大大提高用户转化率和留存率。同时，openinstall 的跨平台渠道统计功能，能轻松创建与管理成千上万的渠道，实现线上线下全渠道覆盖。openinstall 统计数据完全独立于第三方平台，提供多维度的统计报表，实时客观地反映渠道效果。

## 下载安装
使用 `ohpm install` 命令将安装最新版本的 sdk
```shell
ohpm install @openinstall/sdk
```
如需更新，请使用 `ohpm update` 命令
```shell
ohpm update @openinstall/sdk
```

## 配置
在 `module.json5`配置文件中配置 appkey 和需要的权限
```json5
{
  "module": {
    // ...
    "metadata": [
      {
        "name": "com.openinstall.APP_KEY",
        "value": "openinstall为应用生成的appkey",
      }
    ],
    "requestPermissions": [
      {
        "name": "ohos.permission.INTERNET"
      },
      {
        "name": "ohos.permission.GET_WIFI_INFO"
      },
      {
        "name": "ohos.permission.GET_BUNDLE_INFO"
      },
      {
        "name": "ohos.permission.STORE_PERSISTENT_DATA"
      }
    ],
  }
}
```
## 初始化
在 AbilityStage 中的 `onCreate` 中调用 `preInit` 进行预初始化
```typescript
import AbilityStage from '@ohos.app.ability.AbilityStage';
import { OpenInstall, OpLogLevel } from '@openinstall/sdk';

export default class AppAbilityStage extends AbilityStage {
  onCreate() {
    OpenInstall.preInit(this.context)
  }
}
```
在`module.json5`配置文件中，通过配置`srcEntry`参数来指定模块对应的代码路径，以作为HAP加载的入口
```json5
{
  "module": {
    "name": "entry",
    "type": "entry",
    "srcEntry": "./ets/application/AppAbilityStage.ets",
    //...
  }
}
```
App 启动时，请调用 SDK 初始化接口进行初始化。首次启动时，确保在用户同意《隐私政策》之后初始化
```typescript
OpenInstall.init(uiAbility.context)
```
## 功能集成

#### 一键拉起

###### 集成scheme
在`module.json5`配置文件中，在需要打开的`Ability`中配置 scheme，用于浏览器中跳转到应用
```json5
{
  "module": {
    // ...
    "abilities": [
      {
        "name": "EntryAbility",
        "srcEntry": "./ets/entryability/EntryAbility.ets",
        // ...
        "exported": true,
        "skills": [
          {
            "entities": [
              "entity.system.home"
            ],
            "actions": [
              "action.system.home"
            ]
          },
          // setting scheme start 
          {
            "entities": [
              "entity.system.default",
              "entity.system.browsable",
            ],
            "actions": [
              "ohos.want.action.viewData",
            ],
            "uris": [
              {
                "scheme": "openinstall为应用生成的scheme",
              }
            ]
          }
          // setting scheme end 
        ]
      },
      // ...
    ],
  }
}
```
###### 集成App Linking
1、登录AppGallery Connect，点击“我的项目”，在项目列表中点击您的项目；  
2、在左侧导航栏中选择 __“增长 > App Linking”__ ，选择 __“应用链接（API>=12 适用）”__ 页签，点击“创建”；  
3、填写 openinstall 为应用生成的用于HarmonyOS应用关联的网址域名，设置完成后点击“发布”；  
4、在应用的`module.json5`文件中进行如下配置，以声明应用关联的域名地址，并开启域名校验开关。  
```json5
{
  "module": {
    //...
    "abilities": [
      {
        "name": "EntryAbility",
        "srcEntry": "./ets/entryability/EntryAbility.ets",
        //...
        "exported": true,
        "skills": [
          {
            "entities": [
              "entity.system.home"
            ],
            "actions": [
              "action.system.home"
            ]
          },
          // setting applinking start
          {
            "entities": [
              "entity.system.browsable"
            ],
            "actions": [
              "ohos.want.action.viewData"
            ],
            "uris": [
              {
                "scheme": "https",
                "host": "openinstall为应用生成的关联域名"
              }
            ],
            "domainVerify": true
          }
          // setting applinking end
        ]
      }
      //...
    ]
  }
}
```
###### 获取拉起参数
在 `EntryAbility` 的 `onCreate` 和 `onNewWant` 方法中调用`getWakeUp(want: Want)`
```typescript
    OpenInstall.getWakeUp(want).then(opData => {
      console.log('OpenInstall', 'getWakeUp result : ' + JSON.stringify(opData));
    })
```

#### App传参安装
在业务需要用到安装参数时，调用方法获取参数。
```typescript
    OpenInstall.getInstall({
      onResult: result => {
        console.log("OpenInstall", "getInstall onResult : " + JSON.stringify(result));
      },
      onError: err => {
        console.log("OpenInstall", "getInstall onError : " + JSON.stringify(err));
      }
    })
```
也支持 `Promise` 的方式调用
```typescript
    OpenInstall.getInstall().then((result: OpData) => {
      console.log("OpenInstall", "getInstallPromise resolve : " + JSON.stringify(result));
    }).catch((reason: OpError) => {
      console.log("OpenInstall", "getInstallPromise reject : " + JSON.stringify(reason));
    })
```
#### 渠道统计
###### 注册量统计
根据自身的业务规则，在确保用户成功注册后，立即调用接口统计注册量：
```typescript
    OpenInstall.reportRegister().then(_ => {
      console.log("OpenInstall", "reportRegister resolve");
    }).catch((reason: OpError) => {
      console.log("OpenInstall", "reportRegister reject : " + JSON.stringify(reason));
    })
```
###### 效果点统计
主要用来统计APP用户行为事件的效果统计，如充值金额、下单、购买、分享、打开次数等。
```typescript
    OpenInstall.reportEffectPoint("effect_test", 100).then(_ => {
      console.log("OpenInstall", "reportEffectPoint resolve");
    }).catch((reason: OpError) => {
      console.log("OpenInstall", "reportEffectPoint reject : " + JSON.stringify(reason));
    })
```
###### 效果点明细
【效果点明细】是建立在【效果点统计】功能的基础上额外加入了支持上报效果点时支持同时传入多组参数的功能，方便方便运营人员可以从更多维度进行数据分析（例如传入分享人id、用户类型、商品id、商品类型等）。
```typescript
    let extraMap = new Map<string, string>()
    extraMap.set("x", "1")
    extraMap.set("y", "z")
    console.log(JSON.stringify(extraMap));
    OpenInstall.reportEffectPoint("effect_detail", 30, extraMap).then(_ => {
      console.log("OpenInstall", "reportEffectPoint with params resolve");
    }).catch((reason: OpError) => {
      console.log("OpenInstall", "reportEffectPoint with params reject : " + JSON.stringify(reason));
    })
```
#### 裂变分享
此接口需在用户点击分享按钮或之前触发,才能统计分享激活或者回流数据。
```typescript
    OpenInstall.reportShare("c0011", "QQ", {
      onResult: v => {
        console.log("OpenInstall", "reportShare success");
      },
      onError: err => {
        console.log("OpenInstall", "reportShare error : " + JSON.stringify(err));
      }
    })
```