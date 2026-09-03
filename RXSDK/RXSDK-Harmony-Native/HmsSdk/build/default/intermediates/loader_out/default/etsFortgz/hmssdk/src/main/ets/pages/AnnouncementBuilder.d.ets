// @keepTs
// @ts-nocheck
import { Announcement } from '../types/Index';
export declare class AnnouncementParams {
    announcement: Announcement[];
    onCloseClick?: (event?: ClickEvent) => void;
    _onLinkClick?: ((link?: string) => void);
    setOnLinkClick(l66: ((link?: string) => void)): this;
    constructor(j66: Announcement[], k66?: (event?: ClickEvent) => void);
}
@Builder
export declare function announcementBuilder(b66: AnnouncementParams): void;
