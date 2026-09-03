# 瑞雪 Javascript SDK

瑞雪 SDK 通过封装抹平不同渠道的接口差异化, 以方便游戏接入不同渠道的登录/支付/分享等其他功能.

SDK 目前主要有微信小游戏类型以及 H5 类型. 其中微信小游戏类型包括微信/QQ/美团, 其余现有渠道都是 H5 类型.

## 开发

### 构建

每次发版前需要更新 `build/common.config.ts` 文件下的 `SDK_VERSION` 版本，SDK_VERSION 为瑞雪 sdk 版本，跟更新日志最新版本保持一致

### 小游戏类型

有单独的 `script` 启动开发环境, 需要平台对应的开发者工具来调试, 比如微信开发者工具. 微信/QQ/美团启动命令分别为 `yarn start:wegame`, `yarn start:qq`, `yarn start:meituan`.

### H5 类型

H5 类型的渠道的启动命令都是 `yarn start:h5 --type CHANNEL_TYPE`, 参数 `CHANNEL_TYPE` 对应 `src/index.CHANNEL_TYPE.ts` 文件的中间部分. 比如微乐为 `yarn start:h5 --type weile`.

H5 类型的调试环境一般为对应的渠道 APP, 比如微乐游戏, 需要下载对应的微乐游戏应用(或者有渠道方提供开发版 APP)来调试开发页面. 目前通常是域名解析开发地址(如: <https://h5demo.xxx.com/iqiyi>)到局域网内开发电脑上(如: 192.168.18.18), 然后在 APP 内打开对应地址开发调试.

### 开发/配置文件

开发配置文件位于 [src/demo](src/demo).

| 配置项     | 小游戏                                 | H5                     |
| ---------- | -------------------------------------- | ---------------------- |
| appid      | `src/demo/CHANNEL/project.config.json` | -                      |
| 微乐 APPID | `src/demo/CHANNEL/index.ts > new Demo` | -                      |
| 功能按钮   | `src/demo/CHANNEL/game.js`             | `src/demo/web.ts`      |
| 添加新渠道 | -                                      | `src/demo/h5/index.ts` |

## 部署

### 正式环境

项目已经集成 CI/CD, 但是目前不支持针对性部署, 只能统一批量部署. 通过 gitlab 的 CI/CD 运行流水线即可完成部署(目前无特殊变量参数需要填写).

部署完成后, 会生成所有的渠道 SDK 在线地址和[对接文档](https://res.weileapp.com/file/documents/index.html) / [变更记录文档](https://res.weileapp.com/file/documents/CHANGELOG.html).

渠道 SDK 地址形如 `https://res.weileapp.com/file/CHANNEL/?version=2&dev=1`, 比如微信 SDK 地址是 `https://res.weileapp.com/file/wegame/?version=2`. 其中 `version` 对应 SDK 大版本, `dev` 对应是否为开发版.

对接文档目前主要针对微信小游戏, 因为这个渠道的功能是最全面的, 功能点也是最新的, 对应源文件位于 [documents/index.md](documents/index.md), 需要在后端接口或者 SDK 功能有变化调整时及时更新. **注意修改 SDK 下载地址中的版本号**.

变更文档目前主要也是针对微信小游戏, 位于 [documents/CHANGELOG.md](documents/CHANGELOG.md), 除了在发布新版本时需要更新, 诸如修复 BUG, 优化等相关变化也需要记录.

### 本地临时打包

可通过 `yarn build --modules CHANNEL_TYPE` 打包对应渠道的文件, `CHANNEL_TYPE` 规则同上.

### 生成文件说明

打包产物位于 [dist](dist), 不同渠道对应单独渠道名称文件夹, 如 `wegame`.

文档生成目录为 [dist/documents](dist/documents).

#### .dev 文件说明

打包产物中除了 `channel-sdk.CHANNEL.vN.umd.js` 的正式文件外, 还会生成 `channel-sdk.CHANNEL.vN.dev.umd.js`, 此文件主要用于接入游戏方开发阶段使用.

| 描述             | 正式版 | 开发版 |
| ---------------- | ------ | ------ |
| 移除 console.log | ✔️     | ❌     |
| 压缩混淆         | ✔️     | ❌     |

## 文件说明

| 文件                                                                                               | 说明                                           |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [build/fix-minigame-api-typings.js](build/fix-minigame-api-typings.js)                             | 修复 `minigame-api-typings` 定义类型冲突的问题 |
| [build/build-document.js](build/build-document.js)                                                 | 打包时转换 markdown 并创建文档                 |
| [build/rollup-pulgin-set-axios-browser-env.ts.js](build/rollup-pulgin-set-axios-browser-env.ts.js) | 修复 `axios` 微信浏览器环境判断错误            |

## 支持渠道

`src` 下的 `index.CHANNEL.ts` 分别对应一个渠道, 比如爱奇艺就是 [src/index.iqiyi.ts](src/index.iqiyi.ts). 其中 [src/index.common.d.ts](src/index.common.ts) 是公共类, 非渠道 SDK.

| 渠道名称  | 渠道标识   | SDK 位置                                           | 备注              |
| --------- | ---------- | -------------------------------------------------- | ----------------- |
| 小游戏    |
| 微信      | wegame     | [src/index.wegame.ts](src/index.wegame.ts)         | -                 |
| QQ        | qq         | [src/index.qq.ts](src/index.qq.ts)                 | -                 |
| 美团      | meituan    | [src/index.meituan.ts](src/index.meituan.ts)       | -                 |
| H5        |
| 微乐      | weile      | [src/index.weile.ts](src/index.weile.ts)           | -                 |
| 吉祥      | jixiang    | [src/index.jixiang.ts](src/index.jixiang.ts)       | -                 |
| 心悦      | xinyue     | [src/index.xinyue.ts](src/index.xinyue.ts)         | -                 |
| 科乐      | kele       | [src/index.kele.ts](src/index.kele.ts)             | -                 |
| 一牛      | 1n         | [src/index.1n.ts](src/index.1n.ts)                 | -                 |
| 7k7k      | 7k7k       | [src/index.7k7k.ts](src/index.7k7k.ts)             | -                 |
| 7724      | 7724       | [src/index.7724.ts](src/index.7724.ts)             | -                 |
| 游戏狗    | gamedog    | [src/index.gamedog.ts](src/index.gamedog.ts)       | -                 |
| 华为 H5   | huaweih5   | [src/index.huaweih5.ts](src/index.huaweih5.ts)     | -                 |
| 爱奇艺    | iqiyi      | [src/index.iqiyi.ts](src/index.iqiyi.ts)           | -                 |
| 零境      | lingjing   | [src/index.lingjing.ts](src/index.lingjing.ts)     | -                 |
| 默往      | mowang     | [src/index.mowang.ts](src/index.mowang.ts)         | -                 |
| 千禧      | qianxi     | [src/index.qianxi.ts](src/index.qianxi.ts)         | 包含 oppo/uc/vivo |
| 44755     | qitianledi | [src/index.qitianledi.ts](src/index.qitianledi.ts) | -                 |
| 群黑      | qunhei     | [src/index.qunhei.ts](src/index.qunhei.ts)         | -                 |
| 趣头条    | qutoutiao  | [src/index.qutoutiao.ts](src/index.qutoutiao.ts)   | -                 |
| 闪电玩    | shandw     | [src/index.shandw.ts](src/index.shandw.ts)         | -                 |
| 沃灵      | woling     | [src/index.woling.ts](src/index.woling.ts)         | -                 |
| 小 7 游戏 | x7sy       | [src/index.x7sy.ts](src/index.x7sy.ts)             | -                 |
| 星界      | xingjie    | [src/index.xingjie.ts](src/index.xingjie.ts)       | -                 |
| 易乐玩    | yilewan    | [src/index.yilewan.ts](src/index.yilewan.ts)       | -                 |
