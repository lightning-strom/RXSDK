// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { Announcement, RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { announcementBuilder, AnnouncementParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/AnnouncementBuilder&4.0.0";
import Operation from "@normalized:N&&&hmssdk/src/main/ets/api/Operation&4.0.0";
let Instance: AnnouncementDialog;
export class AnnouncementDialog extends BaseDialog<AnnouncementParams, string> {
    private _announcementList: Announcement[] = [];
    private _limit: number = 100;
    public static getInstance(g70: UIContext) {
        if (Instance == null) {
            Instance = new AnnouncementDialog(g70);
        }
        return Instance;
    }
    public setLimit(f70?: number) {
        if (f70) {
            this._limit = f70;
        }
        return this;
    }
    public setAnnouncementList(e70?: Announcement[]) {
        this._announcementList = e70 || [];
        return this;
    }
    async show(a70?: RCallback<string>) {
        if (!this._announcementList || this._announcementList.length <= 0) {
            let d70: RXResult<Announcement[]> = await Operation.getAnnouncement(this._limit);
            if (d70.code == 0 && d70.data) {
                this._announcementList = d70.data;
            }
            Logger.d(d70);
        }
        let b70 = new AnnouncementParams(this._announcementList, () => {
            this.close();
            a70?.({ code: RXErrorCode.UI_CLOSE } as RXResult<string>);
        });
        b70.setOnLinkClick((c70) => {
            if (a70) {
                a70?.({ code: RXErrorCode.OK, data: c70 } as RXResult<string>);
            }
            else {
                this.onCallback?.({
                    name: 'link',
                    code: 0,
                    data: c70,
                    message: ""
                });
            }
        });
        if (this.contentNode) {
            this.contentNode.update(b70);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(announcementBuilder), b70);
        }
        this._show(this.contentNode);
        return this;
    }
    close(): void {
        super.close();
        this._announcementList = [];
    }
}
