import { Announcement, RCallback, RXCallback, RXErrorCode, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import { BaseDialog } from './BaseDialog';
import { Logger } from '../utils/Logger';
import { announcementBuilder, AnnouncementParams } from './AnnouncementBuilder';
import Operation from '../api/Operation';

let Instance: AnnouncementDialog;

export class AnnouncementDialog extends BaseDialog<AnnouncementParams, string> {
  private _announcementList: Announcement[] = [];
  private _limit: number = 100;

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new AnnouncementDialog(uiContext);
    }
    return Instance;
  }

  public setLimit(value?: number) {
    if (value) {
      this._limit = value;
    }
    return this;
  }

  public setAnnouncementList(value?: Announcement[]) {
    this._announcementList = value || [];
    return this;
  }

  async show(callback?: RCallback<string>) {
    if (!this._announcementList || this._announcementList.length <= 0) {
      let ret: RXResult<Announcement[]> = await Operation.getAnnouncement(this._limit)
      if (ret.code == 0 && ret.data) {
        this._announcementList = ret.data
      }
      Logger.d(ret)
    }

    let args = new AnnouncementParams(this._announcementList, () => {
      this.close()
      callback?.(  { code: RXErrorCode.UI_CLOSE } as RXResult<string>)
    })
    args.setOnLinkClick((link) => {
      if (callback) {
        callback?.( { code: RXErrorCode.OK, data: link } as RXResult<string>)
      } else {
        this.onCallback?.({
          name: 'link',
          code: 0,
          data: link,
          message: ""
        })
      }
    })
    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(announcementBuilder), args);
    }
    this._show(this.contentNode)
    return this

  }

  close(): void {
    super.close();
    this._announcementList = []
  }
}