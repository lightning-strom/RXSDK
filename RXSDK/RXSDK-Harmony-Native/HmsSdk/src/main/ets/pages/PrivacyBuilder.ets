import ApiPath from '../constants/ApiPath';
import { WebViewComponent } from './WebViewComponent';

interface Protocol {
  key?: string;
  key_list?: string[];
}

export class PrivacyParams {
  onCloseClick?: (event?: ClickEvent) => void;
  protocol?: Protocol

  constructor(protocol:Protocol,onCloseClick?: (event?: ClickEvent) => void) {
    this.protocol=protocol
    this.onCloseClick = onCloseClick
  }
}

@Builder
export function privacyBuilder(params: PrivacyParams) {
  WebViewComponent({ url: ApiPath.getUrl(ApiPath.STATIC_PROTOCOL_LIST), webParams: { "protocol": params.protocol ? JSON.stringify(params.protocol) : "" }, onCloseClick: params.onCloseClick })
}