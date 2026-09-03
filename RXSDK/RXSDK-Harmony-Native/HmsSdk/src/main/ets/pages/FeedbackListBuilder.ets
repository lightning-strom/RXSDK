import { FeedbackItemBean } from '../types/Index';
import { FeedbackListComponent } from './FeedbackListComponent';

export class FeedbackListParams {
  page: number = 1
  size: number = 20
  resList?: FeedbackItemBean[]
  onCloseClick?: (event?: ClickEvent) => void;
  onItemClick?: (item: FeedbackItemBean) => void;

  constructor(onCloseClick?: (event?: ClickEvent) => void) {
    this.onCloseClick = onCloseClick
  }
}

@Builder
export function feedbackListBuilder(params: FeedbackListParams) {
  FeedbackListComponent({
    pageSize: params.size,
    currentPage: params.page,
    resList: params.resList,
    onItemClick: params.onItemClick,
    onCloseClick: params.onCloseClick,
  })
}