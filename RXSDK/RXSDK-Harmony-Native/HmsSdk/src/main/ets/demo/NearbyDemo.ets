import { gameNearbyTransfer, gamePlayer } from '@kit.GameServiceKit';
import { display, LengthMetrics, promptAction, router } from '@kit.ArkUI';
import { BusinessError, deviceInfo, pasteboard } from '@kit.BasicServicesKit';
import { Logger } from '../utils/Logger';

import { common } from '@kit.AbilityKit';
import { NearbyEventType, NearbyTransferService } from '../nearby/NearbyTransferService';
import { FileUtil } from '../utils/FileUtil';
import Devices from '../utils/Devices';


@Entry({ routeName: 'NearbyDemo' })
@Component
struct NearbyDemo {
  @State title: Resource = $r('app.media.rx_logo');
  @State text: string = 'log';
  scroller: Scroller = new Scroller()
  nearbyGameDevices?: Array<gameNearbyTransfer.NearbyGameDevice>;

  showText(text: string | object, args?: ESObject) {
    if (typeof text == 'object') {
      this.text = JSON.stringify(text, null, 2) + (args ? JSON.stringify(args, null, 2) : "")
    } else {
      this.text = text + (args ? JSON.stringify(args, null, 2) : "")
    }
    Logger.debug(text, args)
  }

  aboutToAppear(): void {
    this.init()

  }

  aboutToDisappear(): void {


  }

  init() {
    let uiAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext
    let initParam: gameNearbyTransfer.CreateParameters = {
      abilityName: uiAbilityContext.abilityInfo.name,
      // abilityName: "TuanjiePlayerAbility",
      moduleName: uiAbilityContext.abilityInfo.moduleName,
      needShowSystemUI: true, // 是否展示系统UI，true为展示，false为不展示，默认为false
      mode: gameNearbyTransfer.Mode.API
    };

    NearbyTransferService.getInstance().create(this.getUIContext(), initParam, (ret) => {
      if (ret.code == 0) {
        // data 示例： {"localDeviceName":"Lee156的Mate 60 Pro"}
        let data: ESObject = ret.data
        //todo 成功逻辑
      } else {
        let msg = ret.message
        //todo 失败
      }
    })
    NearbyTransferService.getInstance().registerCallback((result) => {
      // this.showText("连接事件 ", result)
      if (result.type == NearbyEventType.connectNotify) {
        let data = result.data as gameNearbyTransfer.ConnectNotification

        if (result.code == 0) {
          let p = result.data.isSender ? "客户端" : "服务端"
          if (result.data.isSender) {
            this.showText(`连接服务成功，,当前为${p} `, result);
          } else {
            this.showText(`收到连接，当前为${p} `, result);
            this.sendPackage()
          }
        } else {
          this.showText(`连接状态异常， code= ${result.code},message=` + result.message);

        }
      } else if (result.type == NearbyEventType.receivePackageInfo) {
        let pi = result.data as gameNearbyTransfer.PackageInfo
        this.showText(`收到包信息`, result.data);
        // this.replaySendPackage()


      } else if (result.type == NearbyEventType.transferNotify) {
        let data = result.data as gameNearbyTransfer.TransferNotification
        if (data.transferState == 6) {
          // todo文件接收完成，拷贝接收文件到游戏脚本目录
          const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
          let fl = FileUtil.getFileList(result.data.fileStoragePath)
          Logger.d("fileStoragePath:" + result.data.fileStoragePath,)
          this.showText("接收到文件：", fl)
          FileUtil.copyDir(result.data.fileStoragePath, context.filesDir)

        } else {
          Logger.d("传输状态：", result)
        }
      } else {
        Logger.d("状态监听：", result)
      }

    })
  }

  replaySendPackage(packageInfoResultCode?: gameNearbyTransfer.PackageInfoResultCode) {
    let packageInfoResult: gameNearbyTransfer.PackageInfoResult = {
      packageInfoResultCode: packageInfoResultCode ?? gameNearbyTransfer.PackageInfoResultCode.PACKAGE_AVAILABLE_COMPARED,
      message: `包信息比对结果 code:${packageInfoResultCode}}`
    };
    NearbyTransferService.getInstance().replyPackageInfoResult(packageInfoResult, (ret) => {
      if (ret.code == 0) {
        //todo 成功逻辑
      } else {
        let msg = ret.message
        //todo 失败
      }
      Logger.d("replyPackageInfoResult:", ret)
    })

  }

  async sendPackage() {
    const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
    let packageInfo: gameNearbyTransfer.PackageInfo = {
      name: "device-" + Devices.deviceCode,
      version: "1.1.0",
      files: await FileUtil.getFileListWithHash(context.filesDir)
    }

    NearbyTransferService.getInstance().sendPackageInfo(packageInfo, (ret) => {
      if (ret.code == 0) {
        this.showText("sendPackageInfo data=" + JSON.stringify(packageInfo));
      } else {
        Logger.e("sendPackageInfo:" + JSON.stringify(packageInfo) + ",error:" + JSON.stringify(ret))
        this.showText("sendPackageInfo failed:" + JSON.stringify(ret));
      }
    })

  }

  build() {
    Column() {
      // this.Header()

      Scroll(this.scroller) {
        Column() {

          Flex({
            wrap: FlexWrap.Wrap,
            justifyContent: FlexAlign.SpaceBetween,
            space: { main: LengthMetrics.vp(10), cross: LengthMetrics.vp(10) }

          }) {
            Button("初始化")
              .btnStyle()
              .onClick(async () => {
                this.init()
              })
            Button("destroy")
              .btnStyle()
              .onClick(async () => {
                NearbyTransferService.getInstance().destroy((d) => {
                  this.showText(" destroy data = " + JSON.stringify(d));

                })
              })

            Button("自动连接服务")
              .btnStyle()
              .onClick(async () => {
                NearbyTransferService.getInstance().autoBindNearbyGame((ret) => {
                  //返回数据示例：{"event":"autoBindNearbyGame","code":0}
                  if (ret.code == 0) {
                    //todo 成功逻辑
                    this.showText("自动连接服务中...")
                  } else {
                    let msg = ret.message
                    //todo 失败
                    this.showText("自动连接失败 :", ret)
                  }
                })
              })
            Button("开启服务")
              .btnStyle()
              .onClick(async () => {
                NearbyTransferService.getInstance().publishNearbyGame((ret) => {
                  // 返回数据示例：{"event":"publishNearbyGame","code":0}
                  if (ret.code == 0) {
                    //todo 成功逻辑
                    this.showText("服务开启，等待连接。。。")
                  } else {
                    let msg = ret.message
                    //todo 失败
                    this.showText("服务开启失败:", ret)
                  }
                })
              })
            Button("手动发现服务")
              .btnStyle()
              .onClick(async () => {
                NearbyTransferService.getInstance().discovery((ret) => {
                  //返回数据示例：{"event":"discovery","code":0,"data":{"nearbyGameDevices":[{"deviceName":"SDK Dev的Mate X5 典藏","deviceId":"4b411a84","networkId":"4b411a84"}]}}
                  let data = ret.data as gameNearbyTransfer.DiscoveryResult
                  this.nearbyGameDevices = ret.data.nearbyGameDevices
                  if (ret.code == 0) {
                    //todo 成功逻辑
                  } else {
                    let msg = ret.message
                    //todo 失败
                  }
                  this.showText(ret)
                })
              })
            Button("手动连接服务")
              .btnStyle()
              .onClick(async () => {
                this.nearbyGameDevices?.forEach((device) => {
                  NearbyTransferService.getInstance().bindNearbyGame(device, (ret) => {
                    if (ret.code == 0) {
                      //todo 成功逻辑
                    } else {
                      let msg = ret.message
                      //todo 失败
                    }
                    this.showText("连接服务中...:", ret)
                  })
                })

              })

            Button("发送包信息")
              .btnStyle()
              .onClick(async () => {
                this.sendPackage()
              })
            Button("响应发送包 AVAILABLE")
              .btnStyle()
              .onClick(async () => {
                this.replaySendPackage(gameNearbyTransfer.PackageInfoResultCode.PACKAGE_AVAILABLE_COMPARED)
              })
            Button("响应发送包  UNAVAILABLE")
              .btnStyle()
              .onClick(async () => {
                this.replaySendPackage(gameNearbyTransfer.PackageInfoResultCode.PACKAGE_UNAVAILABLE_COMPARED)
              })
            Button("响应发送包  Error")
              .btnStyle()
              .onClick(async () => {
                this.replaySendPackage(gameNearbyTransfer.PackageInfoResultCode.ERROR)
              })
            Button("发送文件")
              .btnStyle()
              .onClick(async () => {
                //传输更新 patch 文件
                const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
                let packageData: gameNearbyTransfer.PackageData = {
                  files: FileUtil.getFileList(context.filesDir).map((p) => ({
                    srcPath: context.filesDir + p,
                    destPath: p,
                  } as gameNearbyTransfer.PackageFile))
                }
                NearbyTransferService.getInstance().transferPackageData(packageData, (ret) => {
                  // 返回数据示例：{"event":"transferPackageData","code":0}
                  if (ret.code == 0) {
                    //todo 成功逻辑
                    this.showText("发送数据：" + JSON.stringify(packageData));
                  } else {
                    let msg = ret.message
                    //todo 失败
                    this.showText("发送数据  failed：" + JSON.stringify(ret));
                  }
                })

              })
            Button("文件列表")
              .btnStyle()
              .onClick(async () => {
                const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
                let fl = FileUtil.getFileList(context.filesDir)
                this.showText(fl)
              })
            Button("文件列表信息")
              .btnStyle()
              .onClick(async () => {
                const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
                let fl = await FileUtil.getFileListWithHash(context.filesDir)
                this.showText(fl)
              })


            Button("copyRaw")
              .btnStyle()
              .onClick(async () => {
                const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
                let b = context.resourceManager.isRawDir("media")
                let b1 = context.resourceManager.isRawDir("test")
                let rawFileDirs: Array<string> = context.resourceManager.getRawFileListSync("");
                Logger.d(rawFileDirs)
                FileUtil.extractRawFiles(context, "")
              })

            Button("copy")
              .btnStyle()
              .onClick(async () => {

                const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
                FileUtil.copyDir(context.filesDir + "/media", context.filesDir + "/media_copy", 0)
                let fl = FileUtil.getFileList(context.filesDir + "/media_copy")
                this.showText(fl)

              })

          } //flex end


          Divider().strokeWidth(2).color('#F1F3F5').margin({ top: 10 })
          // Scroll() {
          //   Column() {
          Text(this.text).fontSize(10).onClick(() => {
            copyText(this.text)
          }).alignSelf(ItemAlign.Start)
        }
      }
      // .alignRules({ center: { anchor: "__container__", align: HorizontalAlign.Center } })
      // .width($r('app.float.dialog_width'))
      .layoutWeight(1)
      .align(Alignment.TopStart)
      .margin({ left: 20, right: 20, bottom: 10 })
      // .height('90%')
      // .backgroundColor(Color.Green)
      .scrollable(ScrollDirection.Vertical) // 滚动方向纵向
      .scrollBar(BarState.Off) // 滚动条常驻显示
      // .scrollBarColor(Color.Gray) // 滚动条颜色
      // .scrollBarWidth(2) // 滚动条宽度
      .friction(0.6)
    }
  }

  @Builder
  Header() {
    RelativeContainer() {
      // .backgroundColor("#FF3333")
      Row() {
        Image($r('app.media.rx_logo'))
          .width("143vp")
          .height("33vp")
          .objectFit(ImageFit.None)
          .align(Alignment.Center)
      }
      .alignRules({
        middle: { anchor: "__container__", align: HorizontalAlign.Center },
      })

      // Row() {
      //   Image($r("app.media.rx_close"))
      //     .width(30)
      //     .height(30)
      //     .onClick(() => {
      //       hilog.debug(0x0001, "rxsdk", "close click")
      //     })
      // }.alignRules({
      //   top: { anchor: "__container__", align: VerticalAlign.Top },
      //   right: { anchor: "__container__", align: HorizontalAlign.End }
      // }).margin({ right: 10 })
    }
    // .width(CommonConstants.FULL_WIDTH_PERCENT)
    // .margin({ top: 10 })
    .height(30)

    // .backgroundColor("#FF3333")
  }
}

@Extend(Button)
function btnStyle() {
  // .constraintSize({ minHeight: 40 })
  .width(140)
  .type(ButtonType.Normal)
  .labelStyle({
    maxLines: 2
  })
  .fontColor("#FF007DFF")
  .backgroundColor("#0D000000")
  // .height($r('app.float.login_btn_height'))
  // .buttonStyle(ButtonStyleMode.NORMAL)
  .fontSize(14)
  // .fontWeight(CommonConstants.BUTTON_FONT_WEIGHT)

}


function copyText(text: string) {
  const pasteboardData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
  const systemPasteboard = pasteboard.getSystemPasteboard();
  systemPasteboard.setData(pasteboardData);
  systemPasteboard.getData().then((data) => {
    if (data) {
      promptAction.showToast({ message: '复制成功' });
    } else {
      promptAction.showToast({ message: '复制失败' });
    }
  })
}

