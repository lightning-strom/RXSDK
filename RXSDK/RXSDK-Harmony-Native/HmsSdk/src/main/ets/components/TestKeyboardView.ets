/*
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * 使用自定义安全键盘组件的样例
 *
 * 核心组件:
 * 1. CustomKeyboard
 *
 * 实现步骤：
 *  1. 通过TextInput.customKeyboard绑定自定义键盘
 *  2. 自定义键盘使用网格布局，定义数组保存每个按键的值、UI属性和位置，并循环渲染数组完成键盘布局
 *  3. 在字母和特殊字符键盘中将网格拆分为4 * 20布局，保证每个按键都要占用整数单元
 *  4. 在父组件定义按键响应函数onKeyboardEvent，可根据不同的按键类型实现数据更新，然后子组件按键时调用父组件传递过来的onKeyboardEvent即可
 *  5. 在子组件中，必须定义inputValue且使用@Link装饰器，这样能保证子组件调用时onKeyboardEvent时inputValue不为空，父子组件数据双向更新
 */

import { CustomKeyboard } from '../components/CustomKeyboard';
import { Logger } from '../utils/Logger';
import { CustomIdCardInput } from './CustomIdCardInput';
import { IdCardKeyboard } from './IdCardKeyboard';
import { EKeyboardType, EKeyType, idCardKeyData, IKeyAttribute } from './KeyboardDefine';

const TEXT_INPUT_ID: string = 'textInput';

@Entry
@Component
export struct TestKeyboardView {
  // TextInput输入的值
  @State inputValue: string = '';
  @State inputValue1: string = '';
  @State placeholder: string = "请输入身份证号";
  // 当前键盘类型，默认为数字键盘
  @State curKeyboardType: EKeyboardType = EKeyboardType.NUMERIC;
  // 键盘按键数组
  @State items: IKeyAttribute[] = idCardKeyData;
  private controller: TextInputController = new TextInputController();
  private controller1: TextInputController = new TextInputController();

  // /**
  //  * 键盘按键事件响应函数
  //  * @param item 键盘按键数据项
  //  */
  onKeyboardEvent(item: IKeyAttribute) {

    // this.inputValue = "test"
    switch (item.type) {
      // 输入类型，更新输入内容
      case EKeyType.COMPLETE:
        this.inputValue = item.value + "";
        console.log("rxsdk:" + this.inputValue)
      case EKeyType.INPUT:
        console.log(JSON.stringify(item))
        // this.inputValue += item.value;
        break;
      //   // 删除一个已输入的末尾字符
      //     case EKeyType.DELETE:
      //       this.inputValue = this.inputValue.slice(0, -1);
      //       break;
      //   // 切换数字字符键盘
      //     case EKeyType.NUMERIC:
      //       if (this.curKeyboardType !== EKeyboardType.NUMERIC) {
      //         this.curKeyboardType = EKeyboardType.NUMERIC;
      //         this.items = numericKeyData;
      //       }
      //       break;
      //   // 切换大小写
      //     case EKeyType.CAPSLOCK:
      //       if (this.curKeyboardType === EKeyboardType.LOWERCASE) {
      //         // 切换大写字母键盘
      //         this.curKeyboardType = EKeyboardType.UPPERCASE;
      //         this.items = upperCaseKeyData;
      //       } else {
      //         // 切换小写字母键盘
      //         this.curKeyboardType = EKeyboardType.LOWERCASE;
      //         this.items = lowerCaseKeyData;
      //       }
      //       break;
      //   // 切换特殊字符键盘
      //     case EKeyType.SPECIAL:
      //       if (this.curKeyboardType !== EKeyboardType.SPECIAL) {
      //         this.curKeyboardType = EKeyboardType.SPECIAL;
      //         this.items = specialKeyData;
      //       }
      //       break;
      //     default:
      //     // logger.info('Sorry, we are out of input type.')
    }
  }

  /**
   * 自定义键盘组件Builder
   */
  @Builder
  customKeyboardBuilder() {
    CustomKeyboard({
      items: this.items,
      inputValue: this.inputValue1,
      curKeyboardType: this.curKeyboardType,
      placeholder: this.placeholder,
      controller: this.controller
    })
  }

  @Builder
  customKeyboardBuilder1() {
    IdCardKeyboard({
      inputValue: "",
      onKeyboardEvent: this.onKeyboardEvent.bind(this),
      placeholder: "请输入...",
      controller: this.controller1
    })
  }

  build() {
    Column() {
      TextInput({
        text: $$this.inputValue1,
        placeholder: this.placeholder,
        controller: this.controller
      })
        .id(TEXT_INPUT_ID)
        .type(InputType.Normal)
        .customKeyboard(this.customKeyboardBuilder(), { supportAvoidance: true })
        .height(48)
        .margin({ top: 24 })

      TextInput({
        text: this.inputValue,
        placeholder: "请输入...",
        controller: this.controller1
      })
        .id(TEXT_INPUT_ID)
        .type(InputType.Normal)
        .customKeyboard(this.customKeyboardBuilder1(), { supportAvoidance: true })
        .height(48)
        .margin({ top: 24 })
      Row() {

        Button("显示键盘")
          .type(ButtonType.Capsule)// .grayscale(0.3)
            // .contrast(0.6)
          .fontSize(20)
          .width(160)
          .height(48)
          .margin({ top: 15 })
          .onClick(() => {
            this.controller.stopEditing();
            this.controller1.stopEditing();

            let dialogController: CustomDialogController
            dialogController = new CustomDialogController({
              builder: CustomIdCardInput(),
              autoCancel: false,
              alignment: DialogAlignment.Bottom,
              customStyle: true,
            })
            dialogController.open()


          })
        Blank().width(10)
        Button("隐藏键盘")
          .type(ButtonType.Capsule)// .grayscale(0.3)
            // .contrast(0.6)
          .fontSize(20)
          .width(160)
          .height(48)
          .margin({ top: 15 })
          .onClick(() => {
            this.controller.stopEditing();
            this.controller1.stopEditing();
            // this.getUIContext().getFocusController().clearFocus();
          })
      }
    }
    .onClick(() => {
      this.controller.stopEditing();
      this.controller1.stopEditing();
      // this.getUIContext().getFocusController().clearFocus();
    })
    .focusOnTouch(true)
    .width("100%")
    .height("100%")
    .padding(24)
  }
}
