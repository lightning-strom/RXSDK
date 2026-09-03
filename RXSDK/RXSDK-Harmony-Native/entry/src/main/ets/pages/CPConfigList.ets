import { webview } from '@kit.ArkWeb';
import { RXApi } from 'hmssdk';
import { LoginData, RXConfig, RXResult, SDKEventType,Logger } from 'hmssdk';
import { BusinessError } from '@kit.BasicServicesKit';
import { promptAction } from '@kit.ArkUI';
import { ConfigList } from './ConfigList';

interface CpBean extends RXConfig {
  desc: string
}


@Entry
@Component
struct Page {
  @State message: string = 'cp config list';
  @State text: string = 'log';
  @State data: CpBean[] = ConfigList

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
        Text(this.message)
          .id('PageHelloWorld')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .alignRules({
            center: { anchor: '__container__', align: VerticalAlign.Center },
            middle: { anchor: '__container__', align: HorizontalAlign.Center }
          })
        List() {
          ForEach(this.data, (item: CpBean, index: number) => {
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
              this.initSdk(item);
            }).height(60)
          })
        }.divider({ strokeWidth: 1 })
        .margin({
          left: 15,
          right: 15,
          top: 15,
          bottom: 15
        })
        .height("40%")

        Scroll() {
          Column() {
            Text(this.text).width("100%")
          }
        }.width("100%").margin(10).layoutWeight(1)
      }
    }
    .height('100%')
    .width('100%')
  }

  private initSdk(item: RXConfig) {
    RXApi.getInstance()
      .init(item, this.getUIContext())
      .then((resp: RXResult<object>) => {
        Logger.d("init result:  " + JSON.stringify(resp));
        promptAction.showToast({ message: JSON.stringify(resp) });
        this.setText(resp)

      })
      .catch((e: BusinessError) => {
        Logger.d("init failed:" + e.message);
        Logger.e(e);
        this.setText(e)
        promptAction.showToast({ message: JSON.stringify(e) });
      })
      .then(() => {
        RXApi.getInstance().registerSdkEvent<LoginData>(SDKEventType.OnPlayerDataChanged, (data) => {
          Logger.d("OnPlayerDataChanged:" + JSON.stringify(data));

        });
      });
  }
}