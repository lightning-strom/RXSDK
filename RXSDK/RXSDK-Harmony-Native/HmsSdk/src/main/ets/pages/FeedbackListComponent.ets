import { HeaderComponent } from './HeaderComponent';

import { Logger } from '../utils/Logger';
import { FeedbackItemBean, RXResult } from '../types/Index';
import Feedback, { FeedbackListBean } from '../api/Feedback';

@Entry
@Component
  // @CustomDialog
export struct FeedbackListComponent {
  @State resList: FeedbackItemBean[] = [
    {
      "id": 213,
      "content": "说明",
      "created_at": "10-12 17:10:05",
      "status": 1,
      "recover_at": "10-15 11:14:58",
      "is_prop": 0
    },
    {
      "id": 212,
      "content": "说明",
      "created_at": "10-12 17:05:24",
      "status": 1,
      "recover_at": "10-15 11:10:00",
      "is_prop": 0
    },
    {
      "id": 214,
      "content": "说明",
      "created_at": "10-12 17:10:46",
      "status": 2,
      "recover_at": "10-15 10:32:15",
      "is_prop": 0
    },
    {
      "id": 215,
      "content": "说明",
      "created_at": "10-12 17:11:37",
      "status": 2,
      "recover_at": "10-15 10:17:05",
      "is_prop": 0
    },
    {
      "id": 222,
      "content": "玩家反馈内容文本展示",
      "created_at": "10-14 16:46:41",
      "status": 2,
      "recover_at": "10-15 10:14:52",
      "is_prop": 1
    },
    {
      "id": 223,
      "content": "玩家反馈内容文本展示",
      "created_at": "10-15 09:05:00",
      "status": 2,
      "recover_at": "10-15 09:59:48",
      "is_prop": 1
    },
    {
      "id": 221,
      "content": "玩家反馈内容文本展示",
      "created_at": "10-14 16:08:47",
      "status": 2,
      "recover_at": "10-14 16:09:58",
      "is_prop": 1
    },
    {
      "id": 220,
      "content": "玩家反馈内容文本展示",
      "created_at": "10-14 15:50:17",
      "status": 2,
      "recover_at": "10-14 15:56:21",
      "is_prop": 1
    },
    {
      "id": 219,
      "content": "说明",
      "created_at": "10-14 15:31:31",
      "status": 2,
      "recover_at": "10-14 15:44:40",
      "is_prop": 0
    },
    {
      "id": 218,
      "content": "说明",
      "created_at": "10-14 09:20:16",
      "status": 2,
      "recover_at": "10-14 13:14:51",
      "is_prop": 1
    }
  ];
  @State title: ResourceStr = "我的反馈";
  onCloseClick?: (event?: ClickEvent) => void;
  onItemClick?: (item: FeedbackItemBean) => void;
  currentPage: number = 1;
  pageSize: number = 20;

  // private controller: CustomDialogController

  async aboutToAppear() {
    this.getFeedbackList(this.currentPage)
  }

  async getFeedbackList(page: number) {
    let ret: RXResult<object> = await Feedback.getFeedbackList(page, this.pageSize)
    if (ret.code == 0 && ret.data) {
      let dat = ret.data as FeedbackListBean
      this.currentPage = dat.page
      this.resList = dat.list
    }
  }

  close(event: ClickEvent) {
    this.onCloseClick?.(event);
  }

  build() {
    RelativeContainer() {
      Column() {
        HeaderComponent({
          title: this.title, onClose: (e) => {
            this.close(e)
          }
        , backVisible: false
        }).margin({ top: 4 })

        List({ space: 10 }) {
          ForEach(this.resList, (item: FeedbackItemBean, index: number) => {
            ListItem() {
              Row() {
                Text(item.content)
                  .fontColor("#444444")
                  .fontWeight(item.status == 1 ? FontWeight.Medium : FontWeight.Normal)
                  .maxLines(1)
                  .fontSize(13)
                  .layoutWeight(1)
                  .textOverflow({ overflow: TextOverflow.Ellipsis })
                Text(item.status == 1 ? "待回复" : "已处理").fontColor(item.status == 1 ? "#DC6E6E" : "#20C0B3").maxLines(1).fontSize(13).margin({ left: 8 })
                Text(item.created_at).fontColor(item.status == 1 ? "#444444" : "#797979").margin({ left: 13 }).maxLines(1).fontSize(13)
              }.padding(4)
            }
            .onClick((e) => {
              this.onItemClick?.(item)
            })
          })
        }
        .width(-1)
        .height(-1)
        .divider({ strokeWidth: 1 })
        .friction(0.7)
        .padding(10)
        .layoutWeight(1)
        .borderRadius(4)
        .listDirection(Axis.Vertical)
        .backgroundColor("#F7F7F7")
        .scrollBar(BarState.Off)
        .onScrollIndex((start: number, end: number, center: number) => {
          let page = Math.ceil(end / this.pageSize)
          if (page > this.currentPage) {
            this.getFeedbackList(page)
          }
        })
        .margin({
          left: 12,
          right: 12
        })

        Row() {
          Blank().layoutWeight(1)
          Button('关闭', { type: ButtonType.Normal, stateEffect: true })
            .width(100)
            .height(30)
            .borderRadius(4)
            .fontSize(14)
            .fontWeight(500)
            .fontColor(Color.White)
            .backgroundColor("#DC6E6E")
            .onClick((e) => {
              this.onCloseClick?.(e)
            })
        }.margin({
          left: 12,
          right: 12,
          top: 8,
          bottom: 10
        })

      }

    }
    .backgroundColor(Color.White)
    .margin({
      left: 30,
      right: 30,
      top: 34,
      bottom: 34
    })
    .borderRadius(4)
    .constraintSize({ maxWidth: 550, minHeight: 100, maxHeight: 500 })
  }
}


