import { promptAction } from '@kit.ArkUI';
import { RXApi } from '../sdk/RXApi';
import { CaptchaType, Purpose, RXResult } from '../types/Index';
import UIApiImpl from './UIApiImpl';

class RXTextTimerModifier implements ContentModifier<TextTimerConfiguration> {
  constructor() {
  }

  applyContent(): WrappedBuilder<[TextTimerConfiguration]> {
    return wrapBuilder(buildTextTimer)
  }
}

function getSurplusNum(config: TextTimerConfiguration): number {
  let surplus = Math.floor(((config.count - config.elapsedTime) / 1000))
  return surplus;
}

function getSurplusTime(config: TextTimerConfiguration): string {
  let surplus = Math.floor(((config.count - config.elapsedTime) / 1000))
  return (config.started && surplus > 0 ? "重新获取(" + surplus + ")" : "获取验证码")
}

@Builder
function buildTextTimer(config: TextTimerConfiguration) {
  // Column() {
  Text(getSurplusTime(config))
    .fontColor((config.started && getSurplusNum(config)) > 0 ? Color.Black : $r("app.color.col_20c0b3"))
    .maxLines(1)
  // }
}

/**
 * Login page component.
 */
@Component
export struct CountDownComponent {
  @State count: number = 60000;
  @Prop target: string;
  type: CaptchaType = 'phone';
  purpose: Purpose = Purpose.Login;
  // @StorageLink('clickEnable') clickEnableLink: boolean = true;
  @State clickEnableLink: boolean = true;
  @State myTimerModifier: RXTextTimerModifier = new RXTextTimerModifier()
  countUpTextTimerController: TextTimerController = new TextTimerController()

  aboutToAppear() {
    // this.clickEnableLink = true;
    // console.log("CountDownComponent aboutToAppear")
  }

  build() {
    TextTimer({ isCountDown: true, count: this.count, controller: this.countUpTextTimerController })
      .contentModifier(this.myTimerModifier)
      .onTimer((utc: number, elapsedTime: number) => {
        let surplus = Math.floor(((this.count - elapsedTime) / 1000))
        if (surplus < 0) {
          this.clickEnableLink = true
          console.info('textTimer onTimer surplus：' + surplus + ', elapsedTime: ' + elapsedTime)
        }
        // console.info('textTimer onTimer utc is：' + surplus + ', elapsedTime: ' + elapsedTime)
        // Logger.debug('textTimer onTimer utc is：' + utc + ', elapsedTime: ' + elapsedTime)

      }).enabled(this.clickEnableLink)
      .onClick(async () => {
        if (this.target !== '') {
          let ret: RXResult<object> = await RXApi.getInstance().sendCaptcha(this.getUIContext(), {
            type: this.type,
            target: this.target,
            purpose: this.purpose
          })
          if (ret.code == 0) {
            this.clickEnableLink = false;
            this.countUpTextTimerController.reset()
            this.countUpTextTimerController.start()
            promptAction.showToast({ message: "验证码已发送" })
          } else if (ret.message) {
            promptAction.showToast(ret)
          }
        } else {
          promptAction.showToast({ message: this.type == 'phone' ? "请输入手机号！" : "请输入您的账号" })
        }
      })
  }
}


