import { Account } from '../types/Index';
import Devices from '../utils/Devices';
import { HeaderComponent } from './HeaderComponent';
import { TipsDialog } from './TipsDialog';

@Entry
@Preview
@Component
  // @CustomDialog
export struct LoginAccountListComponent {
  @State title: ResourceStr = "切换账号";
  @Prop list: Account[] = [
    {
      username: "username1",
      openid: "id",
      method: "phone"
    },
    {
      username: "username2",
      openid: "id",
      method: "username"
    },

  ]
  onCloseClick?: (event?: ClickEvent) => void;
  onItemClick?: (item: Account, index: number) => void;
  onDelClick?: (item: Account, index: number) => void;

  // private controller: CustomDialogController

  aboutToAppear() {
    // this.isLoading = true
    // setTimeout(() => {
    //   this.isLoading = false
    // }, 5000)
  }

  /**
   * Closes the custom pop-up window. If the window is closed, the window does not take effect.
   * @since 7
   */
  close(event?: ClickEvent) {
    // this?.controller?.close()
    this.onCloseClick?.(event);
  }

  build() {
    // RelativeContainer() {
    Stack({ alignContent: Alignment.Center }) {
      Column() {
        HeaderComponent({
          title: this.title,
          onClose: (e) => {
            this.close(e)
          },
          backVisible: true,
          closeVisible: false
        }).margin({ top: 4 })

        List({ space: 8 }) {
          ForEach(this.list, (item: Account, index: number) => {
            ListItem() {
              Row() {
                Image(this.getIcon(item)).objectFit(ImageFit.Contain).height(22).margin({ left: 10, right: 8 })
                Text(Devices.getPhone(item.username)).fontColor($r('app.color.col_315e5a')).layoutWeight(1)
                Image($r('app.media.rx_account_item_del')).objectFit(ImageFit.None).width(36).margin({ right: 2 }).onClick((e) => {
                  TipsDialog.getInstance(this.getUIContext()).setConfig({
                    content: "确定删除该账号？", onConfirm: () => {
                      this.onDelClick?.(item, index)
                      this.list.splice(index, 1)
                    }
                  }).show()
                })

              }.borderColor("#E2F2F1")
              .borderRadius(4)
              .borderWidth(1)
            }
            .onClick(() => {
              this.onItemClick?.(item, index)
            })
          })
        }
        .height(-1)
        .width(-1)
        .friction(0.7)
        .padding(8)
        // .backgroundColor(Color.Blue)
        .scrollBar(BarState.Off)
        .margin({ left: 15, right: 15, bottom: 10 })
        .layoutWeight(1)
      }
      .width($r('app.float.dialog_width'))
      .height(260)
      // .constraintSize({ maxHeight: 260 })
      // .margin({ top: 20, bottom: 2 })
      .backgroundColor(Color.White)
      .borderRadius(6)
    }
  }

  private getIcon(item: Account) {
    if (Devices.isValidEmail(item.username)) {
      return $r('app.media.rx_ico_captchacode3')
    } else if (Devices.isValidPhoneNumber(item.username)) {
      return $r('app.media.rx_ico_captchacode')
    } else {
      return $r('app.media.rx_ico_username')
    }
  }
}