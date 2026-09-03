import { TransferParams } from './TransferParams'
import { NearbyLog } from '../common/NearbyLog'
import app from '../../utils/App'
import { common } from '@kit.AbilityKit'

@Builder
export function buildText(params: TransferParams) {
  Row() {
    Row() {
      if (!params.isTransferred) {
        Progress({ value: params.transferredData, total: params.totalData, type: ProgressType.Ring })
          .width(20)
          .height(20)
          .color(Color.Blue)    // 进度条前景色为灰色
          .style({ strokeWidth: 3 })    // 设置strokeWidth进度条宽度为15.0vp
          .margin({ left: 0, right: 10 })
      } else if (params.isTransferred) {
        Column() {
          SymbolGlyph($r('sys.symbol.checkmark_circle'))
            .fontSize(20)
            .renderingStrategy(SymbolRenderingStrategy.SINGLE)
            .fontColor([Color.Green])
        }
        .borderRadius('100%')
        .margin({ left: 10, right: 10 })
        .alignItems(HorizontalAlign.Center)
        .justifyContent(FlexAlign.Center)
        .width(20)
        .height(20)
      }
      // Text("传输中：50MB/s, 20MB/11100MB")
      Text(params.text)
        .fontSize(14)
      if (!params.isTransferred) {
        Column() {
          SymbolGlyph($r('sys.symbol.xmark'))
            .fontSize(12)
            .renderingStrategy(SymbolRenderingStrategy.SINGLE)
            .fontColor([Color.White, Color.Green, Color.White])
        }
        .borderRadius('100%')
        .backgroundColor('#5b808081')
        .margin({ left: 10 })
        .onClick(() => {
          NearbyLog.info(" 关闭按钮已点击")
          // this.getUIContext()
          params.closeCallback?.()

        })
        .alignItems(HorizontalAlign.Center)
        .justifyContent(FlexAlign.Center)
        .width(20)
        .height(20)
      } else {
        Button("重启")
          .fontSize(12)
          .onClick(() => {
            NearbyLog.info(" 用户点击了重启")
            app.reboot(getContext() as common.UIAbilityContext)
          })
          .margin({ left: 10, right: 10 })
          .width(60)
          .height(30)
      }

    }
    .focusable(false)
    .justifyContent(FlexAlign.Center)
    .backgroundColor(Color.White)
    .padding({ left: 10, right: 10 })
    .height(50)
    .borderRadius(24)
    .zIndex(99)
  }
  .height('100%')
  .width('100%')
  // .backgroundColor("#4D000000")//黑色背景 透明度约为 30%
  .justifyContent(FlexAlign.Center)
}

