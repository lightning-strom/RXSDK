// @keepTs
// @ts-nocheck
import { RXConfig, RXResult, LoginParams, IRXApi, RXCallback, IFeedback, LoginData, RXLoginConfig, IPassport, IHadoop, SDKEventType, PayParams, IOperation, IGameAreaApi, RCallback, BindAccountParams } from '../types/Index';
import AbilityConstant from "@ohos.app.ability.AbilityConstant";
import common from "@ohos.app.ability.common";
import Want from "@ohos.app.ability.Want";
import window from "@ohos.window";
import { Singleton } from '../types/Types';
import { ISocial } from './ISocial';
declare class RXApiImpl extends Singleton<RXApiImpl> implements IRXApi {
    distinctId(): string;
    deviceCode(): string;
    subChannelId(): string;
    domain(): string;
    feedback(): IFeedback;
    social(): ISocial;
    loginData(): LoginData | undefined;
    passport(): IPassport;
    hadoop(): IHadoop;
    operation(): IOperation;
    gameArea(): IGameAreaApi;
    aboutToAppear(): void;
    aboutToDisappear(): void;
    init(m5: RXConfig, n5: UIContext): Promise<RXResult<object>>;
    private onRouterPageUpdate;
    onWindowStageCreate(h5: window.WindowStage): void;
    private registerRouterPageUpdate;
    registerSdkEvent<c5 = object>(d5: SDKEventType, e5: (event: c5) => void): void;
    unregisterSdkEvent<z4 = object>(a5: SDKEventType, b5: (event: z4) => void): void;
    initialize(x4: RXConfig, y4: UIContext): Promise<RXResult<object>>;
    onCreate(u4: common.UIAbilityContext, v4: Want, w4: AbilityConstant.LaunchParam): void;
    onNewWant(r4: common.UIAbilityContext, s4: Want, t4: AbilityConstant.LaunchParam): void;
    onPageShow(p4: string, q4?: string): void;
    onPageHide(n4: string, o4?: string): void;
    uploadData(k4: ArrayBuffer, l4: string, m4?: RCallback): Promise<RXResult<object>>;
    uploadFile(h4: string, i4?: string, j4?: RCallback): Promise<RXResult<object>>;
    pay(e4: PayParams, f4?: RCallback): Promise<RXResult<object>>;
    queryPurchases(): Promise<RXResult<object>>;
    unbindPlayer(b4?: string, c4?: string): Promise<string>;
    logout(): Promise<RXResult>;
    setLogoRes(a4: ResourceStr): void;
    login(y3: LoginParams, z3?: RXCallback<RXResult<LoginData>>): Promise<RXResult<LoginData>>;
    /**
     * @throws
     */
    unionLogin(f3: RXLoginConfig, g3: UIContext, h3?: RXCallback<RXResult<LoginData>>): Promise<RXResult<LoginData>>;
    private doLogin;
    syncInfo(z2: LoginParams, a3?: RCallback): Promise<RXResult>;
    bindAccount(w2: LoginParams | BindAccountParams, x2?: RCallback): Promise<RXResult>;
    dataTrack(t2: string, u2: Record<string, object>, v2?: string): boolean;
}
declare const _default: RXApiImpl;
export default _default;
