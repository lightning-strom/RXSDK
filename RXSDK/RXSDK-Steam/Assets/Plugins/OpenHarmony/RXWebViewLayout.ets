import display from '@ohos.display';

export default class RXWebViewLayout {
  public screenWidth:number = 0;
  public screenHeight:number = 0;
  public darkTheme: boolean = true;
  public closeBtnVisible: Boolean = true;
  public naviVisible: boolean = true;
  public naviHeight: number = 150;
  public naviTitle: string = "";
  public naviCloseVisible: boolean = true;
  public naviBackVisible: boolean = true;
  public naviBarPosX: number = 0;
  public naviBarPosY: number = 0;
  public naviBarWidth: number = 0;
  public naviBarHeight: number = 0;
  public naviBackPosX: number = 0;
  public naviBackPosY: number = 0;
  public naviBackWidth: number = 0;
  public naviBackHeight: number = 0;
  public naviTitlePosX: number = 0;
  public naviTitlePosY: number = 0;
  public naviTitleWidth: number = 0;
  public naviTitleHeight: number = 0;
  public naviClosePosX: number = 0;
  public naviClosePosY: number = 0;
  public naviCloseWidth: number = 0;
  public naviCloseHeight: number = 0;
  public webViewPosX: number = 0;
  public webViewPosY: number = 0;
  public webViewWidth: number = 0;
  public webViewHeight: number = 0;
  public naviLinePosX: number = 0;
  public naviLinePosY: number = 0;
  public naviLineWidth: number = 0;
  public naviBackIconPosX: number = 0;
  public naviBackIconPosY: number = 0;
  public naviBackIconWidth: number = 0;
  public naviBackIconHeight: number = 0;
  public naviCloseIconPosX: number = 0;
  public naviCloseIconPosY: number = 0;
  public naviCloseIconWidth: number = 0;
  public naviCloseIconHeight: number = 0;
  readonly naviLineHeight: number = 2;
  readonly naviBtnOffsetW: number = 50;
  readonly naviBtnSize: number = 60;
  readonly chatFloatBtnSize:number = 40;
  readonly chatTipSize:number = 20;
  public chatFloatVisible:boolean = false;
  public chatFloatTipVisible:boolean = false;
  public chatFloatPosX:number = 0;
  public chatFloatPosY:number = 0;

  constructor() {
    this.reset();
  }

  public reset(dark: boolean = true, closeBtn: boolean = true, naviVisible: boolean = false, naviHeight: number = 150, title: string = "客服", naviClose: boolean = true, naviBack: boolean = true) {
    this.darkTheme = dark;
    this.closeBtnVisible = closeBtn;
    this.naviVisible = naviVisible;
    this.naviHeight = naviHeight;
    this.naviTitle = title;
    this.naviCloseVisible = naviClose;
    this.naviBackVisible = naviBack;
    this.chatFloatVisible = false;
    this.chatFloatTipVisible = false;

    this.recalculateLayout();
  }

  public forceRefresh() {
    AppStorage.set('RXWebViewLayout', this);
  }

  public setNaviBarVisible(visible: boolean) {
    this.naviVisible = visible;
    this.naviCloseVisible = visible;
    this.recalculateLayout();
    this.forceRefresh();
  }

  public setCloseBtnVisible(visible: boolean) {
    this.closeBtnVisible = visible;
    this.recalculateLayout();
    this.forceRefresh();
  }

  public setNaviBackVisible(visible: boolean) {
    this.naviBackVisible = visible;
    this.recalculateLayout();
    this.forceRefresh();
  }
  public setLight(light: boolean) {
    this.darkTheme = !light;
    this.recalculateLayout();
    this.forceRefresh();
  }

  public setNaviTitle(title: string) {
    this.naviTitle = title;
    this.recalculateLayout();
    this.forceRefresh();
  }

  public minimized()
  {
    this.chatFloatVisible = true;
    AppStorage.set("RXWebViewVisible", false);
    this.forceRefresh();
  }

  public showTip()
  {
    this.chatFloatTipVisible = true;
    this.forceRefresh();
  }

  public recalculateLayout() {
    this.naviBarPosX = 0;
    this.naviBarPosY = 0;

    this.screenWidth = px2vp(display.getDefaultDisplaySync().width);
    this.screenHeight = px2vp(display.getDefaultDisplaySync().height);

    this.chatFloatPosX = this.screenWidth  - 100;
    this.chatFloatPosY = this.screenHeight - 100;

    if (this.naviVisible) { // navibar
      this.naviBarWidth = this.screenWidth;
      this.naviBarHeight = px2vp(this.naviHeight);

      // webview
      this.webViewPosX = 0;
      this.webViewPosY = px2vp(this.naviHeight + this.naviLineHeight);
      this.webViewWidth = this.screenWidth;
      this.webViewHeight = this.screenHeight - this.webViewPosY;

      // naviback
      this.naviBackPosX = px2vp(this.naviBtnOffsetW);
      this.naviBackPosY = 0;
      this.naviBackWidth = this.naviBackVisible ? px2vp(this.naviHeight) : 0;
      this.naviBackHeight = this.naviBackVisible ? px2vp(this.naviHeight) : 0;

      this.naviBackIconWidth = px2vp(this.naviBtnSize);
      this.naviBackIconHeight = px2vp(this.naviBtnSize);

      // close
      this.naviClosePosX = this.screenWidth - px2vp(this.naviHeight + this.naviBtnOffsetW);
      this.naviClosePosY = 0;
      this.naviCloseWidth = this.naviCloseVisible ? px2vp(this.naviHeight) : 0;
      this.naviCloseHeight = this.naviCloseVisible ? px2vp(this.naviHeight) : 0;

      this.naviCloseIconWidth = px2vp(this.naviBtnSize);
      this.naviCloseIconHeight = px2vp(this.naviBtnSize);

      // title
      this.naviTitlePosX = this.naviBackPosX + this.naviBackWidth;
      this.naviTitlePosY = 0;
      this.naviTitleWidth = this.screenWidth - this.naviBackWidth - this.naviCloseWidth;
      this.naviTitleHeight = px2vp(this.naviHeight);

      this.naviLinePosX = 0;
      this.naviLinePosY = px2vp(this.naviHeight);
      this.naviLineWidth = this.screenWidth;
    } else { // navibar
      this.naviBarWidth = 0;
      this.naviBarHeight = 0;

      // webview
      this.webViewPosX = 0;
      this.webViewPosY = 0;
      this.webViewWidth = this.screenWidth;
      this.webViewHeight = this.screenHeight;

    }
  }

  public getViewBgColor() {
    if (this.darkTheme) {
      return 0X2E354B;
    }

    return Color.White;
  }

  public getTitleColor() {
    if (this.darkTheme) return Color.White;

    return Color.Black;
  }

  public getNaviBgColor() {
    if (this.darkTheme) {
      return 0X2E354B;
    }

    return Color.White;
  }
}