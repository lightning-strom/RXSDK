// @keepTs
// @ts-nocheck
import type { Reward } from '../types/Index';
import { RealNameComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/RealNameComponent&4.0.0";
export class RealNameParams {
    onCommitClick?: (realName: string, idCard: string, isFastAuth: boolean) => void;
    onAlipayAuthClick?: () => void;
    onCloseClick?: (event?: ClickEvent) => void;
    props?: Reward[];
    isFastAuth?: boolean;
    realName?: string;
    idCard?: string;
    canCloseRealAuth?: boolean;
    useAlipayAuth?: boolean;
    constructor(l124?: (realName: string, idCard: string, isFastAuth: boolean) => void, m124?: (event?: ClickEvent) => void, n124?: Reward[]) {
        this.onCloseClick = m124;
        this.onCommitClick = l124;
        this.props = n124;
    }
}
export function realNameBuilder(d124: RealNameParams, e124 = null) {
    const f124 = d124;
    {
        (e124 ? e124 : this).observeComponentCreation2((g124, h124, i124 = f124) => {
            if (h124) {
                let j124 = new RealNameComponent(e124 ? e124 : this, {
                    onCommitClick: i124.onCommitClick,
                    onAlipayAuthClick: i124.onAlipayAuthClick,
                    onCloseClick: i124.onCloseClick,
                    props: i124.props,
                    realName: i124.realName,
                    idCard: i124.idCard,
                    isFastAuth: i124.isFastAuth,
                    useAlipayAuth: i124.useAlipayAuth,
                    closeVisible: i124.canCloseRealAuth
                }, undefined, g124, () => { }, { page: "HmsSdk/src/main/ets/pages/RealNameBuilder.ets", line: 24, col: 3 });
                ViewPU.create(j124);
                let k124 = () => {
                    return {
                        onCommitClick: i124.onCommitClick,
                        onAlipayAuthClick: i124.onAlipayAuthClick,
                        onCloseClick: i124.onCloseClick,
                        props: i124.props,
                        realName: i124.realName,
                        idCard: i124.idCard,
                        isFastAuth: i124.isFastAuth,
                        useAlipayAuth: i124.useAlipayAuth,
                        closeVisible: i124.canCloseRealAuth
                    };
                };
                j124.paramsGenerator_ = k124;
            }
            else {
                (e124 ? e124 : this).updateStateVarsOfChildByElmtId(g124, {});
            }
        }, { name: "RealNameComponent" });
    }
}
