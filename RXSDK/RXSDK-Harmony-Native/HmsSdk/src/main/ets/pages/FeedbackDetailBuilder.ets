import { FeedbackDetailBean } from '../api/Feedback';
import { FeedbackDetailComponent } from './FeedbackDetailComponent';

export class FeedbackDetailParams {
  content?: FeedbackDetailBean;
  onCloseClick?: (event?: ClickEvent) => void;
  onReceiveClick?: (event?: ClickEvent) => void;

  public setContent(value: FeedbackDetailBean) {
    this.content = value;
    return this
  }

  constructor(onCloseClick?: (event?: ClickEvent) => void) {
    this.onCloseClick = onCloseClick
  }
}

@Builder
export function feedbackDetailBuilder(params: FeedbackDetailParams) {
  FeedbackDetailComponent({
    content: params.content,
    onReceiveClick: params.onReceiveClick,
    onCloseClick: params.onCloseClick,
  })
}