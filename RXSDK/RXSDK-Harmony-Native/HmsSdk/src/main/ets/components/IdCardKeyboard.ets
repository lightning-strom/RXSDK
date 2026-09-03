import { EKeyType, EKeyboardType, IKeyAttribute } from './KeyboardDefine';
import { display } from '@kit.ArkUI';

const FONT_SIZE = 16
const BG_COLOR = Color.White
const FONT_COLOR = Color.Black

/**
 *  身份证键盘数据
 */
const idCardKeyData: IKeyAttribute[] = [
  {
    label: '1',
    value: '1',
    fontSize: FONT_SIZE,
    fontColor: FONT_COLOR,
    type: EKeyType.INPUT,
    backgroundColor: BG_COLOR,
    position: [0, 0, 0, 0],
  },
  {
    label: '2',
    value: '2',
    fontSize: FONT_SIZE,
    fontColor: FONT_COLOR,
    type: EKeyType.INPUT,
    backgroundColor: BG_COLOR,
    position: [0, 0, 1, 1],
  },
  {
    label: '3',
    value: '3',
    fontSize: FONT_SIZE,
    fontColor: FONT_COLOR,
    type: EKeyType.INPUT,
    backgroundColor: BG_COLOR,
    position: [0, 0, 2, 2],
  },
  {
    label: '4',
    value: '4',
    fontSize: FONT_SIZE,
    fontColor: FONT_COLOR,
    type: EKeyType.INPUT,
    backgroundColor: BG_COLOR,
    position: [1, 1, 0, 0],
  },
  {
    label: '5',
    value: '5',
    fontSize: FONT_SIZE,
    fontColor: FONT_COLOR,
    type: EKeyType.INPUT,
    backgroundColor: BG_COLOR,
    position: [1, 1, 1, 1],
  },
  {
    label: '6',
    value: '6',
    fontSize: FONT_SIZE,
    fontColor: FONT_COLOR,
    type: EKeyType.INPUT,
    backgroundColor: BG_COLOR,
    position: [1, 1, 2, 2],
  },
  {
    label: '7',
    value: '7',
    fontSize: FONT_SIZE,
    fontColor: FONT_COLOR,
    type: EKeyType.INPUT,
    backgroundColor: BG_COLOR,
    position: [2, 2, 0, 0],
  },
  {
    label: '8',
    value: '8',
    fontSize: FONT_SIZE,
    fontColor: FONT_COLOR,
    type: EKeyType.INPUT,
    backgroundColor: BG_COLOR,
    position: [2, 2, 1, 1],
  },
  {
    label: '9',
    value: '9',
    fontSize: FONT_SIZE,
    fontColor: FONT_COLOR,
    type: EKeyType.INPUT,
    backgroundColor: BG_COLOR,
    position: [2, 2, 2, 2],
  },
  {
    label: 'X',
    value: 'X',
    fontSize: FONT_SIZE,
    fontColor: FONT_COLOR,
    type: EKeyType.INPUT,
    backgroundColor: BG_COLOR,
    position: [3, 3, 0, 0],
  },
  {
    label: '0',
    value: '0',
    fontSize: FONT_SIZE,
    fontColor: FONT_COLOR,
    type: EKeyType.INPUT,
    backgroundColor: BG_COLOR,
    position: [3, 3, 1, 1],
  },
  {
    label: $r("app.media.rx_key_del"),
    fontSize: FONT_SIZE,
    fontColor: FONT_COLOR,
    type: EKeyType.DELETE,
    backgroundColor: BG_COLOR,
    position: [3, 3, 2, 2],
  },
]

export interface ColorConfig {
  bgColor: ResourceColor;
  hdColor: ResourceColor;
  pressColor: ResourceColor;
  fontColor?: string | Color;
  disableColor?: string | Color;
}

const defaultCfg: ColorConfig = {
  bgColor: "#F1F1F1",
  fontColor: Color.Black,
  disableColor: "#ADADAD",
  hdColor: "#E4E4E4",
  pressColor: "#F9F9F9",
};

export const rxCardKeyCfg: ColorConfig = {
  bgColor: "#E3F4F7",
  fontColor: "#05403B",
  // placeHloderColor: "#9CB2B0",
  disableColor: "#ADADAD",
  hdColor: "#D2F0F6",
  pressColor: "#EDF8FA",
};

@Preview
@Component
export struct IdCardKeyboard {
  @State items: IKeyAttribute[] = idCardKeyData;
  @State curKeyboardType: EKeyboardType = EKeyboardType.NUMERIC;
  @State inputValue: string = '';
  @State placeholder: string = '';
  controller: TextInputController = new TextInputController();
  onKeyboardEvent: Function | null = null;
  private rowSpace: number = 1;
  private columnSpace: number = 1;
  private rowCount: number = 4;
  @State itemHeight: number = 48;
  @State theme: ColorConfig = defaultCfg
  @State bottomHeight: number = 10;
  @State inputShow: boolean = true;
  maxWidth: number = 594;
  @State orientation: display.Orientation = 0;

  aboutToAppear(): void {
    this.orientation = display.getDefaultDisplaySync().orientation
    console.log("this.orientation " + this.orientation)
    if (this.orientation % 2 == 0) {
      this.itemHeight = 48
    } else {
      this.itemHeight = 32
    }
  }

  @Builder
  myGridItem(item: IKeyAttribute) {
    if (typeof item.label === 'object') {
      Image(item.label)
        .width(24)
        .height(24)
        .objectFit(ImageFit.Contain)
    } else {
      Text(item.label)
        .fontSize(item.fontSize)
        .fontColor(item.fontColor)
        .fontWeight(FontWeight.Medium)
    }
  }

  @Builder
  titleBar() {
    Row() {
      Blank().layoutWeight(1)
      Row() {
        Stack() {
          TextInput({ placeholder: this.placeholder, text: $$this.inputValue })
            .backgroundColor(Color.White)
            .defaultFocus(true)
            .height(38)
            .fontColor(this.theme.fontColor)
            .padding({ right: 50 })
            .border({
              radius: 4
            })
            .margin({ left: 8 })
          Text("清空")
            .height(38)
            .fontColor(this.theme.disableColor)
            .margin({ left: 8, right: 8 })
            .onClick((e) => {
              this.inputValue = "";
            })
        }.layoutWeight(1).alignContent(Alignment.End)

        Image($r("app.media.rx_key_complete"))
          .height(38)
          .backgroundColor(Color.White)
          .padding(7)
          .fillColor(this.inputValue ? this.theme.fontColor : this.theme.disableColor)
          .enabled(!!this.inputValue)
          .borderRadius(4)
          .margin({ left: 8, right: 8 })
          .onClick((e) => {
            this.onKeyboardEvent?.({ type: EKeyType.COMPLETE, value: this.inputValue });
            this.controller.stopEditing();
          })

      }.constraintSize({ maxWidth: this.maxWidth })
      .padding({ top: 8, bottom: 8 })

      Blank().layoutWeight(1)
    }.backgroundColor(this.theme.hdColor)
  }

  @Styles
  pressedStyles(): void {
    .backgroundColor(this.theme.pressColor)
  }

  build() {
    Column() {
      this.titleBar();
      Column() {
        Grid() {
          ForEach(this.items, (item: IKeyAttribute) => {
            if (item.type === EKeyType.DELETE) {
              GridItem() {
                this.myGridItem(item)
              }
              .width("100%")
              .height(this.itemHeight)
              .rowStart(item?.position?.[0])
              .rowEnd(item?.position?.[1])
              .columnStart(item?.position?.[2])
              .columnEnd(item?.position?.[3])
              .backgroundColor(item.backgroundColor)
              .stateStyles({
                pressed: this.pressedStyles
              })
              // .borderRadius(4)
              .gesture(
                LongPressGesture({ repeat: true, duration: 150 })
                  .onAction((event: GestureEvent) => {
                    if (event && event.repeat && item.type === EKeyType.DELETE) {
                      this.onKeyClickEvent(item);
                    }
                  })
              )
              .onClick(() => {
                console.log("rxsdk onKeyClickEvent " + item.value);
                this.onKeyClickEvent(item);
              })
            } else {
              GridItem() {
                this.myGridItem(item)
              }
              .width("100%")
              .height(this.itemHeight)
              .rowStart(item?.position?.[0])
              .rowEnd(item?.position?.[1])
              .columnStart(item?.position?.[2])
              .columnEnd(item?.position?.[3])
              .backgroundColor(item.backgroundColor)
              .stateStyles({
                pressed: this.pressedStyles
              })
              // .borderRadius(4)
              .onClick(() => {
                console.log("rxsdk onKeyClickEvent " + item.value);
                this.onKeyClickEvent(item);
              })
            }

          }, (item: IKeyAttribute, index: number) => JSON.stringify(item) + index)
        }
        .columnsTemplate(this.curKeyboardType === EKeyboardType.NUMERIC ? "1fr 1fr 1fr" :
          "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr")
        .rowsTemplate("1fr 1fr 1fr 1fr")
        .rowsGap(this.rowSpace) // 设置行间距
        .columnsGap(this.columnSpace) // 设置列间距
        .margin({
          top: 8,
          bottom: this.bottomHeight + 8,
          left: 8,
          right: 8
        })
        .borderRadius(4)
        .height(this.itemHeight * this.rowCount + this.rowSpace * (this.rowCount - 1))
      }.constraintSize({ maxWidth: this.maxWidth })
    }
    .padding({ left: this.columnSpace, right: this.columnSpace })
    .backgroundColor(this.theme.bgColor)
  }

  private onKeyClickEvent(item: IKeyAttribute) {

    if (item.type === EKeyType.INPUT) {
      this.inputValue += item.value;
    } else if (item.type === EKeyType.DELETE) {
      this.inputValue = this.inputValue?.slice(0, -1);
    } else if (item.type === EKeyType.CAPSLOCK && typeof item.label === 'object') {
      if (this.curKeyboardType === EKeyboardType.LOWERCASE) {
        item.label = $r("app.media.rx_key_capslock_white");
      } else {
        item.label = $r("app.media.rx_key_capslock_black");
      }
    }

    this.onKeyboardEvent?.(item);
  }
}