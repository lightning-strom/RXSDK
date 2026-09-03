import ApiPath from '../constants/ApiPath';
import { WebViewComponent } from './WebViewComponent';

export class ForgotPasswordParams {
  onCloseClick?: (event?: ClickEvent) => void;
  url?: string;

  constructor(onCloseClick?: (event?: ClickEvent) => void) {
    this.onCloseClick = onCloseClick
  }
}


@Builder
export function forgotPasswordBuilder(params: ForgotPasswordParams) {
  WebViewComponent({ url: params.url || ApiPath.getUrl(ApiPath.STATIC_FORGET_PASSWORD), onCloseClick: params.onCloseClick })
}