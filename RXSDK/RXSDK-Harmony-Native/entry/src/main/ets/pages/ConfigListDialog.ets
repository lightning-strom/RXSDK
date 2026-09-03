import { RXApi } from 'hmssdk';
import { LoginData, RXConfig, RXResult, SDKEventType } from 'hmssdk/src/main/ets/types/Index';
import { Logger } from 'hmssdk/src/main/ets/utils/Logger';
import { BusinessError } from '@kit.BasicServicesKit';
import { Colors, promptAction } from '@kit.ArkUI';
import { CpBean } from '../common/Types';
import { ConfigList } from './ConfigList';


@Entry
  // @Preview
@Component
@CustomDialog
export struct ConfigListDialog {
  controller?: CustomDialogController = new CustomDialogController({
    builder: ConfigListDialog({}),
  })
  cancel: () => void = () => {

  }
  confirm: (data: CpBean) => void = (data: CpBean) => {

  }
  @State message: string = 'switch config';
  @State text: string = 'log';
  @State config: CpBean[] = ConfigList

  onPageShow() {
    const params = this.getUIContext().getRouter().getParams() as Record<string, string>; // 获取传递过来的参数对象
    if (params) {
      const info: string = params.info as string; // 获取info属性的值
    }
  }

  setText(text: string | object) {
    Logger.debug(text)
    if (typeof text == 'object') {
      this.text = JSON.stringify(text, null, 2)
    } else {
      this.text = text
    }
  }

  build() {

    RelativeContainer() {
      Column() {
        RelativeContainer() {
          Text(this.message)
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .alignRules({

              top: { anchor: '__container__', align: VerticalAlign.Top },
              middle: { anchor: '__container__', align: HorizontalAlign.Center }
            })

          Image($r("app.media.rx_close"))
            .objectFit(ImageFit.Contain)
            .padding(2)
            .width('24vp')
            .margin({ right: '18vp' })
            .alignRules({
              right: { anchor: '__container__', align: HorizontalAlign.End },
              top: { anchor: '__container__', align: VerticalAlign.Top }
            })// .backgroundColor(Color.Green)
            .onClick(() => {
              this.controller?.close()
            })
            .id("close")
        }.height("30vp").margin({ top: 10 })

        // .backgroundColor(Color.Gray)

        List() {
          ForEach(this.config, (item: CpBean, index: number) => {
            ListItem() {
              Column() {
                Row() {
                  Text(item.desc)
                  Text(item.cpId).margin({ left: 15 })
                  Text(item.productId).margin({ left: 15 })
                  Text(item.channelId).margin({ left: 15 })
                }

                Text(item.baseUrls.toString())
              }.alignItems(HorizontalAlign.Start)

              // .alignItems(VerticalAlign.Center)
            }
            .onClick(() => {
              this.confirm(item)
            }).height(60)
          })
        }
        .height(350)
        .divider({ strokeWidth: 1 })
        .margin({
          left: 15,
          right: 15,
        })
      }.alignRules({
        center: { anchor: '__container__', align: VerticalAlign.Center },
        middle: { anchor: '__container__', align: HorizontalAlign.Center }
      })
      .margin({
        left: 15,
        right: 15,
        top: 25,
        bottom: 25
      })
      .constraintSize({maxWidth: 500, maxHeight: 500})
      .backgroundColor(Color.White)
      .borderRadius(4)

    }

    // .height(200)
    // .backgroundColor(Color.Gray)

  }


}