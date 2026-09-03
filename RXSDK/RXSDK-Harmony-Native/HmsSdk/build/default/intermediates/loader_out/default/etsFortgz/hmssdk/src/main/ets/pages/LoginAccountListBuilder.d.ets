// @keepTs
// @ts-nocheck
import { Account } from '../types/Index';
export declare class LoginAccountListParams {
    list: Account[];
    onCloseClick?: (event?: ClickEvent) => void;
    onItemClick?: (item: Account, index: number) => void;
    onDelClick?: (item: Account, index: number) => void;
    constructor(o93: Account[], p93?: (event?: ClickEvent) => void);
}
@Builder
export declare function loginAccountListBuilder(g93: LoginAccountListParams): void;
