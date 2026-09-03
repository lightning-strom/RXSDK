import { SuccessTipsComponent } from './SuccessTipsComponent';

export class SuccessTipsParams {
  title: ResourceStr = "实名认证";
  icon: ResourceStr = $r('app.media.rx_tips_ico_success');
  description: ResourceStr = "实名认证成功";
  onConfirm?: (event?: ClickEvent) => void;

  constructor(onConfirm?: (event?: ClickEvent) => void) {
    this.onConfirm = onConfirm
  }
}

@Builder
export function successTipsBuilder(params: SuccessTipsParams) {
  SuccessTipsComponent({
    title: params.title,
    icon: params.icon,
    description: params.description,
    onCloseClick: params.onConfirm,
  })
}