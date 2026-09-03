// @keepTs
// @ts-nocheck
import type { Announcement } from '../types/Index';
import { AnnouncementComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/AnnouncementComponent&4.0.0";
export class AnnouncementParams {
    announcement: Announcement[];
    onCloseClick?: (event?: ClickEvent) => void;
    _onLinkClick?: ((link?: string) => void);
    public setOnLinkClick(l66: ((link?: string) => void)) {
        this._onLinkClick = l66;
        return this;
    }
    constructor(j66: Announcement[], k66?: (event?: ClickEvent) => void) {
        this.announcement = j66;
        this.onCloseClick = k66;
    }
}
export function announcementBuilder(b66: AnnouncementParams, c66 = null) {
    const d66 = b66;
    {
        (c66 ? c66 : this).observeComponentCreation2((e66, f66, g66 = d66) => {
            if (f66) {
                let h66 = new AnnouncementComponent(c66 ? c66 : this, { announcementList: g66.announcement, onCloseClick: g66.onCloseClick, onLinkClick: g66._onLinkClick }, undefined, e66, () => { }, { page: "HmsSdk/src/main/ets/pages/AnnouncementBuilder.ets", line: 22, col: 3 });
                ViewPU.create(h66);
                let i66 = () => {
                    return {
                        announcementList: g66.announcement,
                        onCloseClick: g66.onCloseClick,
                        onLinkClick: g66._onLinkClick
                    };
                };
                h66.paramsGenerator_ = i66;
            }
            else {
                (c66 ? c66 : this).updateStateVarsOfChildByElmtId(e66, {});
            }
        }, { name: "AnnouncementComponent" });
    }
}
