import { Announcement } from '../types/Index';
import { AnnouncementComponent } from './AnnouncementComponent';

export class AnnouncementParams {
  announcement: Announcement[]
  onCloseClick?: (event?: ClickEvent) => void;
  _onLinkClick?: ((link?: string) => void);

  public setOnLinkClick(value: ((link?: string) => void)) {
    this._onLinkClick = value;
    return this;
  }

  constructor(announcement: Announcement[], onCloseClick?: (event?: ClickEvent) => void) {
    this.announcement = announcement;
    this.onCloseClick = onCloseClick
  }
}

@Builder
export function announcementBuilder(params: AnnouncementParams) {
  AnnouncementComponent({ announcementList: params.announcement, onCloseClick: params.onCloseClick, onLinkClick: params._onLinkClick })
}