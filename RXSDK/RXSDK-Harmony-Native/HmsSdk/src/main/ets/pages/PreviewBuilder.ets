import { PreviewComponent } from './PreviewComponent';


export class PreviewParams {
  list: string[]
  index: number = 0;
  onCloseClick?: (event?: ClickEvent) => void;

  public setIndex(value: number) {
    this.index = value;
    return this
  }

  constructor(list: string[], onCloseClick?: (event?: ClickEvent) => void, index?: number) {
    this.list = list
    this.onCloseClick = onCloseClick
    if (index) {
      this.index = index
    }
  }
}

@Builder
export function previewBuilder(params: PreviewParams) {
  PreviewComponent({
    list: params.list,
    cursorIdx: params.index,
    onCloseClick: params.onCloseClick,

  })
}