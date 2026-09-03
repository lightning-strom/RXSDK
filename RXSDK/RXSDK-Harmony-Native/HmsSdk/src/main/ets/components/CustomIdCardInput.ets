import { IdCardKeyboard } from './IdCardKeyboard';
import { EKeyType, IKeyAttribute } from './KeyboardDefine';
import { display } from '@kit.ArkUI';

@CustomDialog
@Component
export struct CustomIdCardInput {
  controller: CustomDialogController;
  private textInputCont: TextInputController = new TextInputController();
  @State showFlag: Visibility = Visibility.Visible;

  cancel() {
    this.showFlag = Visibility.Hidden
    setTimeout(() => {
      this.controller.close();
    }, 300)
  }

  build() {
    Column() {
      IdCardKeyboard({
        inputValue: "",
        onKeyboardEvent: (item: IKeyAttribute) => {
          switch (item.type) {

            case EKeyType.COMPLETE:
              this.cancel()
              break;
            case EKeyType.CANCEL:
              // this.inputValue = item.value + "";
              // console.log("rxsdk:" + this.inputValue)
              this.cancel()
              break;
            case EKeyType.INPUT:
              console.log(JSON.stringify(item))
              // this.inputValue += item.value;
              break;
          }
        },
        placeholder: "请输入...",
        controller: this.textInputCont
      })
    }.visibility(this.showFlag)
    // .transition(TransitionEffect.OPACITY.animation({ duration: 200 }).combine(TransitionEffect.translate({ y: 100 })))
      .transition(
      TransitionEffect
        .move(TransitionEdge.BOTTOM)
        .animation({ duration: 300, curve: Curve.FastOutSlowIn }))
  }
}