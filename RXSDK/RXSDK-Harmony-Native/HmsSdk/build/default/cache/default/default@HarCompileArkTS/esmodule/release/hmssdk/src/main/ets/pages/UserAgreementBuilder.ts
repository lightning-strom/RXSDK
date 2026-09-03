// @keepTs
// @ts-nocheck
import { UserAgreementComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/UserAgreementComponent&4.0.0";
export class UserAgreementParams {
    title: ResourceStr = '用户协议和隐私政策';
    confirmText: ResourceStr = '同意';
    cancelText: ResourceStr = '不同意';
    content: string = '';
    onConfirm?: (event?: ClickEvent) => void;
    onCancel?: (event?: ClickEvent) => void;
    constructor(d141: string, e141?: (event?: ClickEvent) => void, f141?: (event?: ClickEvent) => void) {
        this.content = d141;
        this.onConfirm = e141;
        this.onCancel = f141;
    }
}
export function userAgreementBuilder(v140: UserAgreementParams, w140 = null) {
    const x140 = v140;
    {
        (w140 ? w140 : this).observeComponentCreation2((y140, z140, a141 = x140) => {
            if (z140) {
                let b141 = new UserAgreementComponent(w140 ? w140 : this, {
                    onConfirm: a141.onConfirm,
                    onCancel: a141.onCancel,
                    title: a141.title,
                    confirmText: a141.confirmText,
                    cancelText: a141.cancelText,
                    content: a141.content
                }, undefined, y140, () => { }, { page: "HmsSdk/src/main/ets/pages/UserAgreementBuilder.ets", line: 20, col: 3 });
                ViewPU.create(b141);
                let c141 = () => {
                    return {
                        onConfirm: a141.onConfirm,
                        onCancel: a141.onCancel,
                        title: a141.title,
                        confirmText: a141.confirmText,
                        cancelText: a141.cancelText,
                        content: a141.content
                    };
                };
                b141.paramsGenerator_ = c141;
            }
            else {
                (w140 ? w140 : this).updateStateVarsOfChildByElmtId(y140, {});
            }
        }, { name: "UserAgreementComponent" });
    }
}
