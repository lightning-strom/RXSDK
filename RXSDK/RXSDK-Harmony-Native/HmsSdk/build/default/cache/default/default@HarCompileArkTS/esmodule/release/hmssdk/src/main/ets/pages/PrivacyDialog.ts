// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { privacyBuilder, PrivacyParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/PrivacyBuilder&4.0.0";
let Instance: PrivacyDialog;
export class PrivacyDialog extends BaseDialog<PrivacyParams> {
    private _key?: string;
    private _key_list?: string[];
    public setKeyData(b124: string[], c124: string) {
        this._key_list = b124;
        this._key = c124;
        return this;
    }
    public static getInstance(a124: UIContext) {
        if (Instance == null) {
            Instance = new PrivacyDialog(a124);
        }
        return Instance;
    }
    show(y123?: RCallback | undefined) {
        let z123 = new PrivacyParams({ key: this._key, key_list: this._key_list }, () => {
            this.close();
            y123?.({ code: RXErrorCode.UI_CLOSE } as RXResult);
        });
        if (this.contentNode) {
            this.contentNode.update(z123);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(privacyBuilder), z123);
        }
        this._show(this.contentNode);
        return this;
    }
}
