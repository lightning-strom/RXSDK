import { LengthMetrics } from "@kit.ArkUI"

class MyDataSource implements IDataSource {
  private list: string[] = []

  constructor(list: string[]) {
    this.list = list
  }

  totalCount(): number {
    return this.list.length
  }

  getData(index: number): string {
    return this.list[index]
  }

  registerDataChangeListener(listener: DataChangeListener): void {
  }

  unregisterDataChangeListener() {
  }
}

@Entry
@Component
export struct PreviewComponent {
  @State title: ResourceStr = ""
  @State backVisible: boolean = false
  @State closeVisible: boolean = true
  onCloseClick?: (event: ClickEvent) => void
  onBack?: (event: ClickEvent) => void
  list: string[] = [
    "https://rxfile.fishinggamezone.com/2024/06/28/1719560491878.png",
    "https://rxfile.fishinggamezone.com/2024/06/25/1719309658818.jpg",
    "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "https://www.w3school.com.cn/example/html5/mov_bbb.mp4",
    "https://www.w3schools.com/html/movie.mp4",
    "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
  ]
  @State cursorIdx: number = 0
  @State clickClose: boolean = true
  private swiperController: SwiperController = new SwiperController()
  private data: MyDataSource = new MyDataSource([])

  aboutToAppear(): void {
    this.data = new MyDataSource(this.list)
  }

  close(event: ClickEvent) {
    this.onCloseClick?.(event);
  }

  build() {
    RelativeContainer() {
      Column({ space: 5 }) {
        Swiper(this.swiperController) {
          LazyForEach(this.data, (item: string) => {
            RelativeContainer() {
              if (item.endsWith(".mp4")) {
                Video({ src: item })
              } else {
                Image(item).objectFit(ImageFit.Contain)
              }
            }

          })
        }.onClick((e) => {
          if (this.clickClose) {
            this.close(e);
          }
        })
        .cachedCount(2)
        .index(this.cursorIdx)
        // .itemSpace(0)
        .indicator( // 设置圆点导航点样式
          new DotIndicator()
            .bottom(30)
            .color(Color.Gray)
          // .selectedColor(Color.Blue)
        )

      }.width('100%')
      .margin({ top: 5 })

      if (this.closeVisible) {
        Image($r('app.media.ic_close_x_mark_bg'))
          .width(45)
          .padding(10)
          .onClick((e) => {
            this.cursorIdx = -1
            this.close(e)
          })
          .margin({ left: 25, top: 30, right: 20 })
          .alignRules({
            top: { anchor: "__container__", align: VerticalAlign.Top },
            right: { anchor: "__container__", align: HorizontalAlign.End }
          })
      }
    }.backgroundColor(Color.Black)
  }
}