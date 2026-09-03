import { RXApi, Purpose, RXResult, SendCaptchaParams } from 'hmssdk';
import { Logger } from 'hmssdk/src/main/ets/utils/Logger';

type BindPhoneResp = Record<string, Object>
type BindPhoneMigrateArgs = Record<string, Object>


@CustomDialog
export struct BindPhoneDialog {
  controller?: CustomDialogController
  uiContext?: UIContext
  onResult: (text: string) => void = () => {
  }
  @State phone: string = ''
  @State password: string = ''
  @State captcha: string = ''
  @State sending: boolean = false
  @State binding: boolean = false

  private toast(msg: string) {
    this.uiContext?.getPromptAction().showToast({ message: msg })
  }

  private async sendCaptcha() {
    if (this.phone.length === 0) {
      this.toast('请输入手机号')
      return
    }
    this.sending = true
    try {
      const params: SendCaptchaParams = {
        phone: this.phone,
        purpose: Purpose.BindPhone,
      }
      const ret = await RXApi.getInstance().sendCaptcha(this.uiContext as UIContext, params)
      Logger.d(`sendCaptcha: ${JSON.stringify(ret)}`)
      this.onResult(`sendCaptcha: ${JSON.stringify(ret)}`)
      this.toast(`验证码发送：${ret?.code}`)
    } catch (e) {
      Logger.e(`sendCaptcha error: ${JSON.stringify(e)}`)
      this.onResult(`sendCaptcha error: ${JSON.stringify(e)}`)
      this.toast('验证码发送失败')
    } finally {
      this.sending = false
    }
  }

  private async bindPhone() {
    if (this.phone.length === 0 || this.password.length === 0 || this.captcha.length === 0) {
      this.toast('请输入手机号、密码和验证码')
      return
    }
    this.binding = true
    try {
      const migrateArgs: BindPhoneMigrateArgs = {}
      const ret: RXResult<BindPhoneResp> = await RXApi.getInstance().passport().bindPhone<BindPhoneResp>(
        this.phone, this.password, this.captcha, migrateArgs, (resp: RXResult<BindPhoneResp>) => {
          Logger.d(`bindPhone callback: ${JSON.stringify(resp)}`)
        })
      Logger.d(`bindPhone: ${JSON.stringify(ret)}`)
      this.onResult(`bindPhone: ${JSON.stringify(ret)}`)
      this.toast(`绑定结果：${ret?.code}`)
      if (ret?.code === 0) {
        this.controller?.close()
      }
    } catch (e) {
      Logger.e(`bindPhone error: ${JSON.stringify(e)}`)
      this.onResult(`bindPhone error: ${JSON.stringify(e)}`)
      this.toast('绑定失败')
    } finally {
      this.binding = false
    }
  }

  build() {
    RelativeContainer() {
      Column() {
        Text('绑定手机号')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .margin({ top: 16, bottom: 12 })

        TextInput({ placeholder: '手机号', text: this.phone })
          .type(InputType.PhoneNumber)
          .width('80%')
          .height(44)
          .margin({ bottom: 10 })
          .onChange((value: string) => {
            this.phone = value
          })

        TextInput({ placeholder: '密码', text: this.password })
          .type(InputType.Password)
          .width('80%')
          .height(44)
          .margin({ bottom: 10 })
          .onChange((value: string) => {
            this.password = value
          })

        Row() {
          TextInput({ placeholder: '短信验证码', text: this.captcha })
            .type(InputType.Number)
            .layoutWeight(1)
            .height(44)
            .onChange((value: string) => {
              this.captcha = value
            })

          Button(this.sending ? '发送中' : '发送验证码')
            .margin({ left: 8 })
            .enabled(!this.sending)
            .onClick(() => this.sendCaptcha())
        }
        .width('80%')
        .margin({ bottom: 16 })

        Row() {
          Button('取消')
            .layoutWeight(1)
            .margin({ right: 8 })
            .onClick(() => {
              this.controller?.close()
            })

          Button(this.binding ? '绑定中' : '绑定')
            .layoutWeight(1)
            .type(ButtonType.Capsule)
            .enabled(!this.binding)
            .onClick(() => this.bindPhone())
        }
        .width('80%')
        .margin({ bottom: 16 })
      }
      .alignRules({
        center: { anchor: '__container__', align: VerticalAlign.Center },
        middle: { anchor: '__container__', align: HorizontalAlign.Center }
      })
      .constraintSize({ maxWidth: 500 })
      .backgroundColor(Color.White)
      .borderRadius(8)
      .padding({ left: 12, right: 12 })
    }
  }
}
