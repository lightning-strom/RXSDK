// @keepTs
// @ts-nocheck
import { Announcement, RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { AnnouncementParams } from './AnnouncementBuilder';
export declare class AnnouncementDialog extends BaseDialog<AnnouncementParams, string> {
    private _announcementList;
    private _limit;
    static getInstance(g70: UIContext): AnnouncementDialog;
    setLimit(f70?: number): this;
    setAnnouncementList(e70?: Announcement[]): this;
    show(a70?: RCallback<string>): Promise<this>;
    close(): void;
}
