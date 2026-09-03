// @keepTs
// @ts-nocheck
import { LoadingComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoadingComponent&4.0.0";
export class LoadingParams {
    timeout: number = 5000;
    text?: string;
    bgColor: ResourceColor = Color.Transparent;
    onCloseClick?: () => void;
    constructor(d92?: () => void) {
        this.onCloseClick = d92;
    }
}
export function loadingBuilder(v91: LoadingParams, w91 = null) {
    const x91 = v91;
    {
        (w91 ? w91 : this).observeComponentCreation2((y91, z91, a92 = x91) => {
            if (z91) {
                let b92 = new LoadingComponent(w91 ? w91 : this, {
                    onCloseClick: a92.onCloseClick,
                    timeout: a92.timeout,
                    text: a92.text,
                    bgColor: a92.bgColor
                }, undefined, y91, () => { }, { page: "HmsSdk/src/main/ets/pages/LoadingBuilder.ets", line: 17, col: 3 });
                ViewPU.create(b92);
                let c92 = () => {
                    return {
                        onCloseClick: a92.onCloseClick,
                        timeout: a92.timeout,
                        text: a92.text,
                        bgColor: a92.bgColor
                    };
                };
                b92.paramsGenerator_ = c92;
            }
            else {
                (w91 ? w91 : this).updateStateVarsOfChildByElmtId(y91, {});
            }
        }, { name: "LoadingComponent" });
    }
}
