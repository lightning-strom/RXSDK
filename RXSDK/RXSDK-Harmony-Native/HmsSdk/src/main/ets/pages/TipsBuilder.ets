import { TipsComponent } from './TipsComponent';

export class TipsParams {
  title: ResourceStr = '提示';
  confirmText: ResourceStr = '确定';
  content: ResourceStr = '';
  cancelText: ResourceStr = '取消';
  cancelVisible: boolean = true;
  onConfirm?: (event?: ClickEvent) => void;
  onCancel?: (event?: ClickEvent) => void;

  constructor(onConfirm?: (event?: ClickEvent) => void, onCancel?: (event?: ClickEvent) => void) {
    this.onConfirm = onConfirm
    this.onCancel = onCancel
  }

}

@Builder
export function tipsBuilder(params: TipsParams) {
  TipsComponent({
    onConfirm: params.onConfirm,
    onCancel: params.onCancel,
    title: params.title,
    confirmText: params.confirmText,
    cancelText: params.cancelText,
    content: params.content
  })
}