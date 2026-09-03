import { EKeyType, EKeyboardType, IKeyAttribute } from './KeyboardDefine';


@Component
export struct CustomKeyboard {
  @Prop items: IKeyAttribute[];
  @Prop curKeyboardType: EKeyboardType;
  @Link inputValue: string ;
  @State placeholder: string = '';
  controller: TextInputController = new TextInputController();
  onKeyboardEvent: Function | null = null;
  private rowSpace: number = 5;
  private rowCount: number = 4;
  private columnSpace: number = 5;
  private itemHeight: number = 42;
  private bgColor: ResourceColor = Color.Black;
  @StorageLink('bottomHeight') bottomHeight: number = 20;
  @State inputShow: boolean = false;

  aboutToAppear(): void {

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
        .fontWeight(FontWeight.Bold)
    }
  }

  @Builder
  titleBar() {
    Row() {
      if (this.inputShow) {
        // TextInput({ placeholder: this.placeholder, text: $$this.inputValue })
        //   .backgroundColor(Color.White).layoutWeight(1)
        //   .border({
        //     width: 1,
        //     color: $r('app.color.col_e2f2f1'),
        //     radius: 4
        //   })
        Text(this.inputValue)
          .backgroundColor(Color.White)
          .height(this.itemHeight - 5)
          .layoutWeight(1)
          .border({
            width: 1,
            color: $r('app.color.col_e2f2f1'),
            radius: 4
          })
      } else {
        Text("安全键盘")
          .fontSize(20)
          .fontColor(Color.Grey).layoutWeight(1).margin({ left: 12 })
      }

      // Row() {
      Text("完成")
        .fontSize(20)
        .fontColor("#4590DB")
        .margin({ left: 12 })
        .onClick((e) => {
          this.onKeyboardEvent?.({ type: EKeyType.COMPLETE, value: this.inputValue });
          this.controller.stopEditing();
        })
      Text("取消")
        .fontSize(20)
        .fontColor("#4590DB")
        .margin({ left: 12, right: 12 })
        .onClick((e) => {
          this.inputValue = "";
          this.controller.stopEditing();
          this.onKeyboardEvent?.({ type: EKeyType.CANCEL });
        })
      // }
      // // .width("100%")
      // .justifyContent(FlexAlign.End)
    }
    .width("100%")
    .margin({ top: 12, bottom: 10 })
  }

  build() {
    Column() {
      this.titleBar();

      Grid() {
        ForEach(this.items, (item: IKeyAttribute) => {
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
          .borderRadius(4)
          .gesture(
            LongPressGesture({ repeat: true,duration:100 })
              .onAction((event: GestureEvent) => {
                if (event && event.repeat&&item.type === EKeyType.DELETE) {
                  this.onKeyClickEvent(item);
                }
              })
          )
          .onClick(() => {
            this.onKeyClickEvent(item);
          })
        }, (item: IKeyAttribute, index: number) => JSON.stringify(item) + index)
      }
      .margin({ bottom: this.bottomHeight + 'px' })
      .columnsTemplate(this.curKeyboardType === EKeyboardType.NUMERIC ? "1fr 1fr 1fr" :
        "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr")
      .rowsTemplate("1fr 1fr 1fr 1fr")
      .rowsGap(this.rowSpace) // 设置行间距
      .columnsGap(this.columnSpace) // 设置列间距
      .width("100%")
      .height(this.itemHeight * this.rowCount + this.rowSpace * (this.rowCount - 1))
    }
    .width("100%")
    .padding({ left: this.columnSpace, right: this.columnSpace })
    .backgroundColor(this.bgColor)
  }

  private onKeyClickEvent(item: IKeyAttribute) {
    console.log(JSON.stringify(item));
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