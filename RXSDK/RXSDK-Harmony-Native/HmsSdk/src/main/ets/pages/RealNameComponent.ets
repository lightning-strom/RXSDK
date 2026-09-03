import { UserAction, UserScene } from '../base/UserActionEnum';
import UserActionTracer from '../base/UserActionTracer';
import { CustomKeyboard } from '../components/CustomKeyboard';
import { IdCardKeyboard, rxCardKeyCfg } from '../components/IdCardKeyboard';
import { EKeyboardType, EKeyType, idCardKeyData, IKeyAttribute } from '../components/KeyboardDefine';
import SDKConfig from '../sdk/SDKConfig';
import { Obj, Reward } from '../types/Index';
import { HeaderComponent } from './HeaderComponent';


/**
 * Login page component.
 */
@Preview
@Component
@CustomDialog
export struct RealNameComponent {
  @State title: ResourceStr = "实名认证";
  @State description: ResourceStr = "根据国家最新法规规定，未实名认证的用户不能体验任何游戏内容，请尽快完成实名。";
  @State realName: string = '';
  @State idCard: string = '';
  @State isFastAuth: boolean = true;
  @State closeVisible: boolean = false
  @State useAlipayAuth: boolean = true;
  @State showManualForm: boolean = false;
  onCommitClick?: (realName: string, idCard: string, isFastAuth: boolean) => void;
  onAlipayAuthClick?: () => void;
  onCloseClick?: (event?: ClickEvent) => void;
  private controller: CustomDialogController
  // 当前键盘类型，默认为数字键盘
  @State curKeyboardType: EKeyboardType = EKeyboardType.NUMERIC;
  // 键盘按键数组
  @State items: IKeyAttribute[] = idCardKeyData;
  inputController: TextInputController = new TextInputController();
  @State props?: Reward[] = [
  //   {
  //     "name": "11",
  //     "icon": "https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/ruixue/profile/1722214999167_3_1_1_1@2x.png",
  //     "tag": "2",
  //     "num": 12,
  //     "num_format": "x12个",
  //   }, {
  //   "name": "11",
  //   "icon": "https://haiqi-ruixue-test.oss-cn-beijing.aliyuncs.com/ruixue/profile/1722214999167_3_1_1_1@2x.png",
  //   "tag": "2",
  //   "num": 1,
  //   "num_format": "x1个",
  // }
  ]

  aboutToAppear() {
    this.showManualForm = !this.useAlipayAuth
    this.onAction(UserAction.Show)
  }

  /**
   * Closes the custom pop-up window. If the window is closed, the window does not take effect.
   * @since 7
   */
  close(event?: ClickEvent) {
    this?.onCloseClick?.(event)
    this?.controller?.close()
    this.onAction(UserAction.Close)
  }

  onAction(action: string, data?: Obj) {
    UserActionTracer.traceAction(UserScene.RealAuth, action, data)
  }

  build() {
    Scroll() {
      Column() {
        HeaderComponent({
          title: this.title, onClose: () => {
            this.close()
          },
          onBack: () => {
            this.inputController?.stopEditing()
            this.showManualForm = false
          },
          backVisible: this.useAlipayAuth && this.showManualForm,
          closeVisible: this.closeVisible
        })
        Column() {
          this.Body()
        }
        .alignItems(HorizontalAlign.Start)
        .padding({ left: 20, right: 20 })
      }
      .constraintSize({ maxWidth: $r('app.float.dialog_width') })
      .margin({ left: 20, right: 20 })
      .backgroundColor(Color.White)
      .borderRadius(6)

    }
    .scrollBar(BarState.Off)
    .onClick(() => {
      this.inputController?.stopEditing()
    })
    .height("100%")
    .width("100%")

  }

  @Builder
  idCardboardBuilder() {

    IdCardKeyboard({
      inputValue: this.idCard?.includes('*') ? '' : this.idCard,
      placeholder: "请输入...",
      theme: rxCardKeyCfg,
      onKeyboardEvent: (item: IKeyAttribute) => {
        switch (item.type) {
          case EKeyType.COMPLETE:
            if (this.isFastAuth && !item.value) {
              return;
            } else {
              this.idCard = item.value ?? '';
              if (!this.idCard?.includes('*')) {
                this.isFastAuth = false;
              }
              console.log("rxsdk:  =====" + this.idCard)
            }
            break;
        }
      },
      controller: this.inputController
    })


  }

  @Builder
  Body() {

    if (this.showManualForm) {
      this.ManualAuthBody()
    } else {
      this.AlipayAuthBody()
    }
  }

  @Builder
  AlipayAuthBody() {
    Column() {
      Text(this.description).fontSize(13).margin({ top: 4, bottom: 10 })

      Row() {
        Image($r('app.media.rx_logo_alipay'))
          .width(28)
          .height(28)
          .objectFit(ImageFit.Contain)

        Text('支付宝实名认证')
          .fontSize(18)
          .fontColor(Color.White)
          .margin({ left: 10 })
      }
        .height($r('app.float.button_height'))
        .width('100%')
        .borderRadius(4)
        .justifyContent(FlexAlign.Center)
        .alignItems(VerticalAlign.Center)
        .padding({ left: 20, right: 20 })
        .backgroundColor('#3876F5')
        .margin({ top: 10 })
        .onClick(() => {
          this.onAction(UserAction.Confirm)
          this.onAlipayAuthClick?.()
        })

      Row() {
        Text('手动实名认证')
          .fontSize(16)
          .fontColor($r('app.color.col_a3a3a3'))
          .decoration({
            type: TextDecorationType.Underline,
            color: $r('app.color.col_a3a3a3')
          })
          .padding(6)
          .onClick(() => {
            this.showManualForm = true
          })
      }
        .width('100%')
        .justifyContent(FlexAlign.Center)
        .margin({ top: 24, bottom: 28 })
    }
  }

  @Builder
  ManualAuthBody() {
    Column() {
      Text(this.description).fontSize(13).margin({ top: 4, bottom: 10 })

      TextInput({ placeholder: "请输入真实姓名", text: $$this.realName })
        .height($r('app.float.edit_height'))
        .placeholderColor($r('app.color.col_a5caca'))
        .placeholderFont({ size: $r('app.float.edit_font_size') })
        .backgroundColor('#00FFFFFF')
        .fontSize($r('app.float.edit_font_size'))
        .type(InputType.USER_NAME)
        .onFocus(() => {
          this.onAction(UserAction.NameTF)
        })
        .border({
          width: 1,
          color: $r('app.color.col_e2f2f1'),
          radius: 4
        })

        .onDidDelete((info: DeleteValue) => {
          console.info('onDidDelete is triggering: ', info.deleteValue, info.deleteOffset);
          if (this.isFastAuth) {
            this.isFastAuth = false;
            setTimeout(() => {
              this.realName = ''
            }, 0)
          }
        })
        .onChange((value: string) => {
          if (this.isFastAuth && this.realName !== value) {
            this.isFastAuth = false;
          }
          this.realName = value;
        })

      if (SDKConfig.isCustomKeyboard) {
        TextInput({ placeholder: "请输入身份证号", text: this.idCard, controller: this.inputController })
          .height($r('app.float.edit_height'))
          .placeholderColor($r('app.color.col_a5caca'))
          .backgroundColor('#00FFFFFF')
          .placeholderFont({ size: $r('app.float.edit_font_size') })
          .fontSize($r('app.float.edit_font_size'))
          .type(InputType.Normal)
          .customKeyboard(this.idCardboardBuilder(), { supportAvoidance: true })
          .margin({ top: 10, bottom: 10 })
          .border({
            width: 1,
            color: $r('app.color.col_e2f2f1'),
            radius: 4
          })
          .onFocus(() => {
            this.onAction(UserAction.IDCardTF)
          })
      } else {
        TextInput({ placeholder: "请输入身份证号", text: $$this.idCard })
          .height($r('app.float.edit_height'))
          .placeholderColor($r('app.color.col_a5caca'))
          .backgroundColor('#00FFFFFF')
          .placeholderFont({ size: $r('app.float.edit_font_size') })
          .fontSize($r('app.float.edit_font_size'))
          .type(InputType.Normal)
          .margin({ top: 10, bottom: 10 })
          .border({
            width: 1,
            color: $r('app.color.col_e2f2f1'),
            radius: 4
          })
          .onFocus(() => {
            this.onAction(UserAction.IDCardTF)
          })
      }

      // .onChange((value: string) => {
      //   this.idCard = value;
      // })
      if (this.props && this.props.length > 0) {
        List({ space: 14 }) {
          ForEach(this.props, (item: Reward, index: number) => {
            ListItem() {
              RelativeContainer() {
                Image(item.icon)
                  .height(32)
                  .objectFit(ImageFit.Contain)
                  .autoResize(true)
                  .alignRules({
                    center: { anchor: "__container__", align: VerticalAlign.Center },
                    middle: { anchor: "__container__", align: HorizontalAlign.Center }
                  })

                if (item.num_format) {

                  Image($r('app.media.rx_reward_rect')).height(16).alignRules({
                    bottom: { anchor: "__container__", align: VerticalAlign.Bottom },
                    middle: { anchor: "__container__", align: HorizontalAlign.Center }
                  })
                  Text(`x${item.num}`)
                    .fontColor(Color.White)
                    .fontSize(10)
                    .margin({ left: 2 })
                    .maxLines(1)
                    .textAlign(TextAlign.End)
                    .maxLines(1)
                    .alignRules({
                      bottom: { anchor: "__container__", align: VerticalAlign.Bottom },
                      middle: { anchor: "__container__", align: HorizontalAlign.Center }
                    })
                }
              }
              .borderWidth(1)
              .borderColor("#BFE7E3")
              .borderStyle(BorderStyle.Dashed)
              .borderRadius(4)
              .height(42)
              .width(42)
            }
            .onClick(() => {

            })
          })
        }
        .width(-1)
        .constraintSize({ maxWidth: 330 })
        .height(42)
        .friction(0.7)
        .margin({ top: 3 })
        .borderRadius(4)
        .id('prop_list')
        .listDirection(Axis.Horizontal)
        .scrollBar(BarState.Off)
      }
      // .backgroundColor(Color.Yellow)
    }

    Row() {
      Button(this.props && this.props?.length > 0 ? "认证并领取奖励" : '确认提交', { type: ButtonType.Normal, stateEffect: true })
        .height($r('app.float.button_height'))
        .layoutWeight(1)
        .borderRadius(4)
        .fontSize($r('app.float.button_font_size'))
        .margin({ top: 15, bottom: this.props && this.props?.length > 0 ? 20 : 28 })
        .fontWeight(500)
        .enabled(isButtonClickable(this.realName, this.idCard))
        .fontColor(Color.White)
        .backgroundColor(isButtonClickable(this.realName, this.idCard) ? $r('app.color.col_20c0b3') : $r('app.color.col_b3e6e2'))
        .onClick(() => {
          console.log("click real name")
          this.onAction(UserAction.Confirm)
          this.onCommitClick?.(this.realName, this.idCard, this.isFastAuth)
        })
    }
  }
}

/**
 * Calculate login button clickable by the input of username and password.
 * @return {boolean} isLoginButtonClickable.
 */
function isButtonClickable(realName: string, idCard: string): boolean {
  return realName !== '' && idCard !== '';
}

