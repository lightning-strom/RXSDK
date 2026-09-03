//import {sdkmanager} from
import { App, display, LengthMetrics, promptAction } from '@kit.ArkUI';
import { BusinessError, pasteboard } from '@kit.BasicServicesKit';
import { RXApi } from '../sdk/RXApi';
import { LoginData, LoginMethod, LoginParams, RXConfig, RXResult, SDKEventType, ShareScenes } from '../types/Index';
import { Logger } from '../utils/Logger';
import Devices from '../utils/Devices';
import DateTime from '../utils/DateTime';
import ShareProvider from '../share/ShareProvider';
import Downloader from '../net/Downloader';
import { bundleManager, common } from '@kit.AbilityKit';
import app from '../utils/App';
import { RXRequest } from '../net/RXRequest';
import ZlibUtil from '../utils/ZlibUtil';
import { BufferUtil } from '../utils/BufferUtil';
import { InitConfig } from '../types/InitConfig';
import AESUtil from '../utils/AESUtil';
import { FileUtil } from '../sdk/RXIndex';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import { fileIo } from '@kit.CoreFileKit';


class Params {
  data1: string
  nums: number[]

  constructor(str: string, nums: number[]) {
    this.data1 = str
    this.nums = nums;
  }
}


@Entry({ routeName: 'Demo' })
@Component
struct Demo {
  @State message: string = 'Hello World';
  @State title: Resource = $r('app.media.rx_logo');
  @State userName: string = '';
  @State password: string = '';
  @State text: string = 'log';
  // @State config: string = '';
  @State cdkey: string = '';
  @State image: ResourceStr = '';
  @State knockFunc: string = 'peng-test';
  @State shareScene: ShareScenes = 2;
  scroller: Scroller = new Scroller()
  cpuserid: string = "442099939"
  agreement = `<a href='https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00001'>《用户协议》</a>` +
    `、<a href='https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00002'>《隐私政策》</a>`;
  privacy =
    `    在您使用我们（微乐）服务前，请您务必审慎阅读、充分理解${this.agreement}的各条款。同时，您应特别注意前述协议中免除或者限制我们责任的条款、对您权利进行限制的条款、约定争议解决方式和司法管辖的条款。如您已详细阅读并同意${this.agreement}请点击“同意”开始使用我们的服务。`;
  config: RXConfig = {
    cpId: "114",
    productId: "1002",
    channelId: "214",
    baseUrls: ["https://cn-api-test.ruixueyun.com"],
    privacyEnable: true,
    // privacy: this.privacy
  };

  showText(text: string | object, preview: string = "") {
    Logger.debug(text)
    if (typeof text == 'object') {
      this.text = preview + JSON.stringify(text, null, 2)
    } else {
      this.text = preview + text
    }
  }

  // showDialog() {
  //   let dialogController: CustomDialogController
  //   dialogController = new CustomDialogController({
  //     builder: AnnouncementComponent(),
  //     autoCancel: false,
  //     alignment: DialogAlignment.Center,
  //     offset: { dx: 0, dy: -20 },
  //     gridCount: 4,
  //     customStyle: true,
  //   })
  //   dialogController.open()
  // }

  aboutToAppear(): void {

    let displayClass: display.Display | null = null;
    displayClass = display.getDefaultDisplaySync();
    console.info('rxsdk display getDefaultDisplaySync: ' + JSON.stringify(displayClass));

    displayClass.getCutoutInfo((err: BusinessError, data: display.CutoutInfo) => {
      const errCode: number = err.code;
      if (errCode) {
        console.error(`rxsdk display Failed to get cutoutInfo. Code: ${err.code}, message: ${err.message}`);
        return;
      }
      console.info('rxsdk display getCutoutInfo: ' + JSON.stringify(data));
    });


    ShareProvider.onKnockShare(() => {
      this.invokeKnockShare();
    })

    //  RXApi.getInstance().setLogoRes("微乐通行证")
  }

  private invokeKnockShare() {
    ShareProvider.share(getContext(), {
      platform: 'hw_knock',
      func: this.knockFunc,
      // url: 'https://rxfile-test.ruixueyun.com/sdk?style=' + this.knockFunc,
      protocol_android: 'huawei',
      protocol_ios: 'huawei'
    }, (ret) => {
      this.showText(ret)
    });
  }

  aboutToDisappear(): void {
    ShareProvider.offKnockShare()
  }

  private init() {
    RXApi.getInstance()
      .init(this.config, this.getUIContext())
      .then((resp: RXResult<InitConfig>) => {
        Logger.d("init result:  " + JSON.stringify(resp));
        this.showText(resp)
        // promptAction.showToast({ message: JSON.stringify(resp) });
      })
      .catch((e: BusinessError) => {
        Logger.d("init failed:" + e.message);
        Logger.e(e)
        this.showText(e)
        promptAction.showToast({ message: JSON.stringify(e) });
      })
      .then(() => {
        RXApi.getInstance().registerSdkEvent<LoginData>(SDKEventType.OnPlayerDataChanged, (data) => {
          Logger.d("OnPlayerDataChanged:" + JSON.stringify(data))
          this.showText(data)
        })
      })

  }

  //
  // dialogControllerTwo: CustomDialogController | null = new CustomDialogController({
  //   builder: LoginComponent(),
  //   alignment: DialogAlignment.Bottom,
  //   onWillDismiss: (dismissDialogAction: DismissDialogAction) => {
  //     console.info("reason=" + JSON.stringify(dismissDialogAction.reason))
  //     console.log("dialog onWillDismiss")
  //     if (dismissDialogAction.reason == DismissReason.PRESS_BACK) {
  //       dismissDialogAction.dismiss()
  //     }
  //     if (dismissDialogAction.reason == DismissReason.TOUCH_OUTSIDE) {
  //       dismissDialogAction.dismiss()
  //     }
  //   },
  //   offset: { dx: 0, dy: -25 }
  // })

  // controller?: CustomDialogController
  // // 若尝试在CustomDialog中传入多个其他的Controller，以实现在CustomDialog中打开另一个或另一些CustomDialog，那么此处需要将指向自己的controller放在所有controller的后面
  // cancel: () => void = () => {
  // }
  // confirm: () => void = () => {
  // }

  build() {
    Column() {
      // this.Header()
      Scroll(this.scroller) {
        Column() {
          Text(JSON.stringify(this.config)).margin({ top: 5 }).onClick(() => {
            copyText(JSON.stringify(this.config))
          })
          Divider().strokeWidth(2).color('#F1F3F5').margin({ top: 10 })

          Flex({
            wrap: FlexWrap.Wrap,
            justifyContent: FlexAlign.SpaceBetween,
            space: { main: LengthMetrics.vp(10), cross: LengthMetrics.vp(10) }
          }) {
            Button("Init")
              .btnStyle()
              .onClick(async () => {
                this.init();
              })

            Button("test")
              .btnStyle()
              .onClick(async () => {


                // this.testAes()

              })
            Button("碰一碰大卡")
              .btnStyle()
              .onClick(async () => {
                this.knockFunc = 'peng-big'
                promptAction.showToast({ message: "已切换为碰一碰大卡模式" });
                this.showText(Devices.model)
              })

            Button("碰一碰小卡")
              .btnStyle()
              .onClick(async () => {
                this.knockFunc = 'peng-small'
                promptAction.showToast({ message: "已切换为碰一碰小卡模式" });
                Devices.getNetCapabilities()
              })

            Button("testDevice")
              .btnStyle()
              .onClick(async () => {
                let d = Devices.genUUID();
                Devices.setTestDevices(d)

                promptAction.showToast({ message: d });
              })
            Button("LaunchWant")
              .btnStyle()
              .onClick(async () => {
                this.showText(JSON.stringify(Devices.launchWant))

                RXRequest.get("https://cn-api-test.ruixueyun.com/v1/jump/1")
              })
            Button("getBundleInfo")
              .btnStyle()
              .onClick(async () => {
                this.showText(Devices.getBundleInfo(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION | bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_SIGNATURE_INFO))
              })
            Button("MetaData")
              .btnStyle()
              .onClick(async () => {
                this.showText(Devices.metaData)
              })

            Button("微信登录")
              .btnStyle()
              .onClick(async () => {
                let lo: LoginParams = {
                  method: LoginMethod.Wechat,
                }
                // lo["wx_app_id"] = "wx2634a4144ccbe556"
                RXApi.getInstance().login(lo, (err, resp) => {
                  this.showText(JSON.stringify(resp), "微信登录结果：")

                })

                // WXApi.getInstance("wx2634a4144ccbe556").login({}, (resp) => {
                //   this.setText(JSON.stringify(resp), "微信登录结果：")
                // })
              })

            Button("getShareData")
              .btnStyle()
              .onClick(async () => {
                let ret = await RXApi.getInstance().share().getShareData({
                  func: 'fish',
                  platform: 'wechat',
                  protocol_android: 'ruixue',
                  protocol_ios: 'ruixue'
                })

                this.showText(ret)

              })

            Button("SetPasteboard")
              .btnStyle()
              .onClick(async () => {
                Devices.setPasteboardData("type=rx&user_source=attrs&name=John%20Doe&id=12345&location=New%20York&date=" + DateTime.getRFC3339())
              })

            Button("RXPasteboard")
              .btnStyle()
              .onClick(async () => {
                this.showText(Devices.getRXPasteboardData(true))
              })
            Button("Pasteboard")
              .btnStyle()
              .onClick(async () => {
                this.showText(await Devices.getPasteboardData(getContext()))
              })


            Button("FuncShareLink")
              .btnStyle()
              .onClick(async () => {
                ShareProvider.share(getContext(), {
                  platform: 'system',
                  title: "系统分享卡片标题",
                  content: "系统分享卡片描述",
                  url: "https://rxfile-test.ruixueyun.com/sdk",
                  share_scene: 2,
                  func: 'fish',
                  protocol_android: 'ruixue',
                  protocol_ios: 'ruixue'
                })
              })

            Button("FuncShareImage")
              .btnStyle()
              .onClick(async () => {
                ShareProvider.share(getContext(), {
                  platform: 'system',
                  title: "系统分享卡片标题",
                  content: "系统分享卡片描述",
                  url: "https://rxfile-test.ruixueyun.com/sdk",
                  share_scene: 2,
                  func: ']image-test',
                  protocol_android: 'ruixue',
                  protocol_ios: 'ruixue'
                })
              })

            Button("ShareLink")
              .btnStyle()
              .onClick(async () => {
                ShareProvider.share(getContext(this) as common.UIAbilityContext, {
                  platform: 'system',
                  share_scene: this.shareScene,
                  material_type: 'link',
                  url: 'https://sharekitdemo.drcn.agconnect.link/ZB3p',
                  title: '系统分享标题',
                  content: '系统分享描述',
                })
              })
            Button("ShareImage")
              .btnStyle()
              .onClick(async () => {
                RXApi.getInstance().share().shareCustom(getContext(this) as common.UIAbilityContext, {
                  platform: 'system',
                  share_scene: this.shareScene,
                  material_type: 'image',
                  image: 'https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/docOnline/0900086000028175946.20241223180103.69023438101196047176677034043385-1736751147180.jpg',
                  title: '分享标题',
                  content: '分享描述',
                })
              })
            // Radio({ value: 'Radio3', group: 'radioGroup' })
            //   .height(50)
            //   .width(50)
            //   .onChange((isChecked: boolean) => {
            //     if (isChecked) {
            //       // 切换为静音模式
            //       this.getUIContext().getPromptAction().showToast(this.Sst);
            //     }
            //   })
            Button("微信分享文本")
              .btnStyle()
              .onClick(async () => {
                RXApi.getInstance().share().shareCustom(getContext(this) as common.UIAbilityContext, {
                  platform: 'wechat',
                  share_scene: this.shareScene,
                  material_type: 'text',
                  title: '分享标题',
                  content: '分享描述',
                })
              })
            Button("微信分享链接")
              .btnStyle()
              .onClick(async () => {
                RXApi.getInstance().share().shareCustom(getContext(this) as common.UIAbilityContext, {
                  platform: 'wechat',
                  share_scene: this.shareScene,
                  material_type: 'link',
                  url: 'https://developer.huawei.com/consumer/cn/doc/design-guides/radio-0000001929853288',
                  title: '分享链接标题',
                  content: '分享链接描述',
                })
              })

            Button("微信分享图片")
              .btnStyle()
              .onClick(async () => {
                RXApi.getInstance().share().shareCustom(getContext(this) as common.UIAbilityContext, {
                  platform: 'wechat',
                  share_scene: this.shareScene,
                  material_type: 'image',
                  url: 'https://developer.huawei.com/consumer/cn/doc/design-guides/radio-0000001929853288',
                  image: 'https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/docOnline/0900086000028175946.20241223180103.69023438101196047176677034043385-1736751147180.jpg',
                  title: '分享图片标题',
                  content: '分享图片描述',
                })
              })
            Button("OpenLink")
              .btnStyle()
              .onClick(async () => {
                app.openLink("https://rxfile-test.ruixueyun.com/home")
                // app.openLink("https://applink.dingtalk.com")
              })
            Button("OpenBrowser")
              .btnStyle()
              .onClick(async () => {
                app.startBrowser("https://rxfile-test.ruixueyun.com/home")
                // app.openLink("https://applink.dingtalk.com")
              })

            Button("Download")
              .btnStyle()
              .onClick(async () => {

                Downloader.create('https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/docOnline/0900086000028175946.20241223180103.69023438101196047176677034043385-1736751147180.jpg', getContext())
                  .startDownload((rest) => {

                    this.showText(JSON.stringify(rest))
                  })

              })
            // Image(this.image).width(100).height(100)
            Button('保存到相册')
              .btnStyle()
              .onClick(async () => {
                let url = "https://cgjcdn.chaogujieapp.com/2025/12/26/1766735704892.png"


                Downloader.create(url, getContext(this))
                  .startDownload(async (rest) => {
                    let fp = rest.filePath;
                    this.showText(JSON.stringify(rest))

                    try {
                      let photoCreationConfigs: Array<photoAccessHelper.PhotoCreationConfig> = [
                        {
                          // title: "瑞雪 sdk",
                          fileNameExtension: url.split('.').pop() || '',
                          photoType: photoAccessHelper.PhotoType.IMAGE,
                          subtype: photoAccessHelper.PhotoSubtype.DEFAULT, // 可选
                        }
                      ];
                      const srcFileUri = FileUtil.getUriFromPath(fp)
                      // 获取需要保存到媒体库的位于应用沙箱的图片/视频uri
                      let srcFileUris: Array<string> = [
                        srcFileUri
                      ];

                      const phAccessHelper = photoAccessHelper.getPhotoAccessHelper(getContext())
                      // 基于弹窗授权的方式获取媒体库的目标uri
                      let desFileUris: Array<string> = await phAccessHelper.showAssetsCreationDialog(srcFileUris, photoCreationConfigs);
                      // 将来源于应用沙箱的照片内容写入媒体库的目标uri
                      let desFile: fileIo.File = await fileIo.open(desFileUris[0], fileIo.OpenMode.WRITE_ONLY);
                      let srcFile: fileIo.File = await fileIo.open(srcFileUri, fileIo.OpenMode.READ_ONLY);
                      await fileIo.copyFile(srcFile.fd, desFile.fd);
                      fileIo.closeSync(srcFile);
                      fileIo.closeSync(desFile);
                      console.info('rxsdk create asset by dialog successfully');
                    } catch (err) {
                      console.error(`rxsdk failed to create asset by dialog successfully errCode is: ${err.code}, ${err.message}`);
                    }

                  })


              })

          }

          Divider().strokeWidth(2).color('#F1F3F5').margin({ top: 10 })
          Text(this.text).onClick(() => {
            copyText(this.text)
          }).alignSelf(ItemAlign.Start)

        }
      }
      .align(Alignment.TopStart)
      // .alignRules({ center: { anchor: "__container__", align: HorizontalAlign.Center } })
      // .width($r('app.float.dialog_width'))
      .layoutWeight(1)
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

  private async testAes() {

    // let a = "{\"data\": \"it is a test message\"}";
    let n = '{"device":{"oaid":"b32eac80-b45c-41f4-b799-fedb6429486f","package_name":"com.ruixue.sdk"},"method":"guest","ext":{}}';
    let a = "abc";
    let pk = '4ca7dacc9332d74e1292c83f0aa3b376';
    let data = 'zLG+lSVnj1RwX7C7j91BLFdICJWmHV8aBSNRZoHVRu9GpHb2s0MoZSHOkmDeCYFnmirmCd+SvrDTadYZQ3CET1ILzKKmOkGwzkE0JEugwJ2h3t9GDWPGNw+eNFJy2Paw5jaFr/PQPT0mOsxMNcvMAFerQ7ysHt/CrWi30BoR0PE=';
    let data1 = 'p4L8sU2stopNvY7As39BPlUmziDC0H1CSZdVfAQ7gFjyVjibRm12XoVN+dr2qNFoIUGyRt98aZDEgBng64uNx9bpJoCU5RKvLIWzrH8l5gQUG8OxyEGkeLzBpJ/rwOKovbUcC0XBltnBM/z5MTyqGKIxBQ8bXvx84kAvQyvZ8eg=';
    // let pk = 'Whh82GtW/EVjBkD8';

    // let en1 = AESUtil.encrypt(a, pk)
    // let deecb = AESUtil.decrypt(en1, pk)

    // console.log("ecb", en1, deecb)

    let en111 = AESUtil.encryptCBC(n)
    let de12 = AESUtil.decryptCBC(en111)
    console.log("解码 cbc ", de12)

    let de = AESUtil.decryptCBC(data1)
    // console.log("cbc",en, de)
    console.log("解码1 cbc", de)

    // let de1 = AESUtil.decryptCBC("+QzDyEMl7TIGfnRfhsMsWqbwklLyc9JsCSo/keLHacoANpO4ZYuBR8/ba4MREBhS", pk)
    // let de12 = AESUtil.decrypt("+QzDyEMl7TIGfnRfhsMsWqbwklLyc9JsCSo/keLHacoANpO4ZYuBR8/ba4MREBhS", pk)
    //
    // console.log("解码1：" + de1)
    // console.log("解码2：" + de12)

  }

  private async testCompress() {
    try {
      let maxLength = 100;
      let minLength = 0;
      const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
      let str = generateRandomString(length);

      str = 'hello'
      let comp = await ZlibUtil.compress(str)
      let comp2 = await ZlibUtil.inflate(str)
      await ZlibUtil.gzip(str)

      let byteArray = [31, -117, 8, 0, 0, 0, 0, 0, 0, -1, -53, 72, -51, -55, -55, 7, 0, -122, -90, 16, 54, 5, 0, 0, 0];
      let uint8Array = byteArray.map(byte => (byte < 0 ? byte + 256 : byte));


      // 打印输出转换后的 Uint8Array
      console.log("rxsdk hello:", new Uint8Array(uint8Array).toString());
      //解压

      let decompress = await ZlibUtil.deflate(comp)

      let destr = BufferUtil.arrayBufferToString(decompress)

      if (destr != str) {
        Logger.e(`compress failed: str:${str} destr: ${destr}`)
      } else {
        Logger.d(`compress success: str:${str} destr: ${destr}`)
      }

    } catch (e) {
      Logger.e(e);
    }
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


function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function copyText(text: string) {
  const pasteboardData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
  const systemPasteboard = pasteboard.getSystemPasteboard();
  systemPasteboard.setData(pasteboardData); // 将数据放入剪切板
  systemPasteboard.getData().then((data) => {
    if (data) {
      promptAction.showToast({ message: '复制成功' });
    } else {
      promptAction.showToast({ message: '复制失败' });
    }
  })
}