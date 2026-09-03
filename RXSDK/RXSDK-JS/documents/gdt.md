
1. Object wx.getDirectAdStatusSync()

基础库 3.11.2 开始支持，低版本需做兼容处理。

功能描述

获取直玩广告组件展示状态。

返回值

Object

直玩广告状态信息

属性	类型	说明
isInMask	boolean	当前是否处于蒙层阶段
isInDirectGameAd	boolean	当前是否处于直接广告中
示例代码

const statusInfo = wx.getDirectAdStatusSync();
console.log(statusInfo.isInMask) // 当前是否在蒙层阶段
console.log(statusInfo.isInDirectGameAd) // 当前是否在直玩广告中

2. wx.onDirectAdStatusChange(function listener)

基础库 3.11.2 开始支持，低版本需做兼容处理。

功能描述

监听监听直玩广告状态变化

参数

function listener

的监听函数

参数

Object res

属性	类型	说明
isInMask	boolean	当前是否处于蒙层阶段
isInDirectGameAd	boolean	当前是否处于直接广告中
isEndByAbnormal	boolean	当前直玩广告是否由于异常流程而结束（如 下拉/搜索 进入正在直玩广告流程中的游戏）
示例代码

wx.onDirectAdStatusChange(res => {
  // 会有如下的几种状态值组合
  // a) { isInMask: true, isInDirectGameAd: true } -> 表示当前正在直玩广告 且 未戳破蒙层
  // b) { isInMask: false, isInDirectGameAd: true } -> 表示当前正在直玩广告 且 戳破了蒙层
  // c) { isInMask: false, isInDirectGameAd: false, isEndByAbnormal: false }, -> 表示倒计时结束了，并且选择了继续玩
  // d) { isInMask: false, isInDirectGameAd: false, isEndByAbnormal: true }, -> 表示由于异常流程而结束
  console.log(res.isInMask)
  console.log(res.isInDirectGameAd)
  console.log(res.isEndByAbnormal)
})

3. 直玩逻辑调整

- `getDirectAdStatusSync` 中返回数据 `isInDirectGameAd: false` `isInMask: false`，表示正常用户未进入直玩，广点通上报逻辑保持不变
- `isInDirectGameAd` `isInMask` 首次通过 `getDirectAdStatusSync` 获取，之后通过 `onDirectAdStatusChange` 监听获取
- `isInMask: true` `isInDirectGameAd: true` 表示正在直玩广告且未戳破蒙层，将广点通 注册&登录&回流 事件保存，等玩家戳破蒙层进入游戏再上报，保存的事件不需要写入 storage 持久化，存变量即可
    - `isInMask: false` `isInDirectGameAd: true` 表示正在直玩广告且戳破蒙层，戳破蒙层上报数据后将保存的 注册&登录&回流 事件数据清除
- 将 `getDirectAdStatusSync` 和 `onDirectAdStatusChange` 产生的数据 `isInMask` `isInDirectGameAd` `isEndByAbnormal` 上报到瑞雪大数据 `sdk.track`，参数 `event: direct_ad`，三个数据放到 properties 中，类型 bool
