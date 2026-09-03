// @keepTs
// @ts-nocheck
import { ILogin } from '../types/ILogin';
declare class LoginProvider implements ILogin {
    private loginMap;
    doLogin(n15: Record<string, ESObject>): Promise<object>;
}
declare const _default: LoginProvider;
export default _default;
