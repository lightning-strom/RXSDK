
import { FeedbackComponent } from './FeedbackComponent';

export class FeedbackParams {
  resList?: string[]
  onCloseClick?: (event?: ClickEvent) => void;
  onCommitClick?: (content: string, resList: string[], phone: string) => void;
  onAddFileClick?: (event?: ClickEvent) => void;

  public setOnCommitClick(value: (content: string, resList: string[], phone: string) => void) {
    this.onCommitClick = value;
    return this;
  }

  constructor(onCloseClick?: (event?: ClickEvent) => void) {
    this.onCloseClick = onCloseClick
  }
}

@Builder
export function feedbackBuilder(params: FeedbackParams) {
  FeedbackComponent({
    resList: params.resList,
    onCommitClick: params.onCommitClick,
    onCloseClick: params.onCloseClick,
    onAddFileClick: params.onAddFileClick
  })
}