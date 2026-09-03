// @keepTs
// @ts-nocheck
import { Announcement } from '../types/Index';
@Component
export declare struct AnnouncementComponent {
    private controller;
    useWeb: boolean;
    @State
    isControllerAttached: boolean;
    @State
    announcementList: Announcement[];
    @State
    content?: string;
    @State
    selectIndex: number;
    onCloseClick?: (event?: ClickEvent) => void;
    onLinkClick?: (link?: string) => void;
    aboutToAppear(): void;
    build(): void;
    private getRichText;
}
