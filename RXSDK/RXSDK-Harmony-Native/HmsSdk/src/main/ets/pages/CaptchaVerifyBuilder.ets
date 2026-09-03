import ApiPath from '../constants/ApiPath';
import UrlUtil from '../utils/UrlUtil';
import { CaptchaVerifyComponent } from './CaptchaVerifyComponent';

export class CaptchaVerifyParams {
  onCloseClick?: (event?: ClickEvent) => void;
  onSliderCaptchaCallback?: (data: object) => void;
  _url: string;

  constructor(appid: string, onCloseClick?: (event?: ClickEvent) => void) {
    this.onCloseClick = onCloseClick
    this._url = UrlUtil.joinQuery(ApiPath.getUrl(ApiPath.STATIC_CAPTCHA), { captcha_app_id: appid })
  }
}

@Builder
export function captchaVerifyBuilder(params: CaptchaVerifyParams) {
  CaptchaVerifyComponent({ url: params._url, onCloseClick: params.onCloseClick, onSliderCaptchaCallback: params.onSliderCaptchaCallback })
}