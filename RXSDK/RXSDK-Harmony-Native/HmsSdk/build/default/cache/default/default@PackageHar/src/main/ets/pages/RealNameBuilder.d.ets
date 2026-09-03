// @keepTs
// @ts-nocheck
import { Reward } from '../types/Index';
export declare class RealNameParams {
    onCommitClick?: (realName: string, idCard: string, isFastAuth: boolean) => void;
    onAlipayAuthClick?: () => void;
    onCloseClick?: (event?: ClickEvent) => void;
    props?: Reward[];
    isFastAuth?: boolean;
    realName?: string;
    idCard?: string;
    canCloseRealAuth?: boolean;
    useAlipayAuth?: boolean;
    constructor(l124?: (realName: string, idCard: string, isFastAuth: boolean) => void, m124?: (event?: ClickEvent) => void, n124?: Reward[]);
}
@Builder
export declare function realNameBuilder(d124: RealNameParams): void;
