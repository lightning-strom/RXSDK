// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
import { LoginMethod, SDKEventType, RXErrorCode, } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RXConfig, RXResult, LoginParams, IRXApi, RXCallback, IFeedback, LoginData, RXLoginConfig, IPassport, IHadoop, RXError, PayParams, IOperation, IGameAreaApi, RCallback, BindAccountParams } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import Hadoop from "@normalized:N&&&hmssdk/src/main/ets/base/Hadoop&4.0.0";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import type common from "@ohos:app.ability.common";
import type Want from "@ohos:app.ability.Want";
import { SDKHandler } from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKHandler&4.0.0";
import gamePlayer from "@hms:core.gameservice.gameplayer";
import type authentication from "@hms:core.authentication";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
import uiObserver from "@ohos:arkui.observer";
import window from "@ohos:window";
import UIApiImpl from "@normalized:N&&&hmssdk/src/main/ets/pages/UIApiImpl&4.0.0";
import Operation from "@normalized:N&&&hmssdk/src/main/ets/api/Operation&4.0.0";
import Feedback from "@normalized:N&&&hmssdk/src/main/ets/api/Feedback&4.0.0";
import AccountManager from "@normalized:N&&&hmssdk/src/main/ets/base/AccountManager&4.0.0";
import Oss from "@normalized:N&&&hmssdk/src/main/ets/oss/Oss&4.0.0";
import GameArea from "@normalized:N&&&hmssdk/src/main/ets/api/GameArea&4.0.0";
import SDKInfo from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKInfo&4.0.0";
import LoginProvider from "@normalized:N&&&hmssdk/src/main/ets/base/LoginProvider&4.0.0";
import billingProvider from "@normalized:N&&&hmssdk/src/main/ets/base/BillingProvider&4.0.0";
import HmsPay from "@normalized:N&&&hmssdk/src/main/ets/base/HmsPay&4.0.0";
import EventBus from "@normalized:N&&&hmssdk/src/main/ets/base/EventBus&4.0.0";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/sdk/RXIndex&4.0.0";
import { Singleton } from "@normalized:N&&&hmssdk/src/main/ets/types/Types&4.0.0";
import type { ISocial } from './ISocial';
import Social from "@normalized:N&&&hmssdk/src/main/ets/api/Social&4.0.0";
import { OpenInstall } from "@normalized:N&&&hmssdk/src/main/ets/plug/OpenInstall&4.0.0";
import app from "@normalized:N&&&hmssdk/src/main/ets/utils/App&4.0.0";
import UserActivate from "@normalized:N&&&hmssdk/src/main/ets/base/UserActivate&4.0.0";
interface RXUnionLoginResult extends RXResult<LoginData>, gamePlayer.UnionLoginResult {
}
class RXApiImpl extends Singleton<RXApiImpl> implements IRXApi {
    distinctId(): string {
        return Devices.distinctId;
    }
    deviceCode(): string {
        return Devices.deviceCode;
    }
    subChannelId(): string {
        return SDKConfig.subChannelId;
    }
    domain(): string {
        return SDKConfig.domain;
    }
    feedback(): IFeedback {
        return Feedback;
    }
    social(): ISocial {
        return Social;
    }
    loginData(): LoginData | undefined {
        return Passport.loginData;
    }
    passport(): IPassport {
        return Passport;
    }
    hadoop(): IHadoop {
        return Hadoop;
    }
    operation(): IOperation {
        return Operation;
    }
    gameArea(): IGameAreaApi {
        return GameArea;
    }
    aboutToAppear(): void {
    }
    aboutToDisappear(): void {
    }
    async init(m5: RXConfig, n5: UIContext): Promise<RXResult<object>> {
        let o5 = n5.getHostContext() as common.UIAbilityContext;
        try {
            if (!n5) {
                Logger.e('Error:UIContext is null');
                throw new Error('Error:UIContext is null');
            }
            m5.debugEnable ??= SDKInfo.DEBUG;
            Logger.debug(`InitArgs: ${JSON.stringify(m5)}`);
            this.onWindowStageCreate(o5.windowStage);
            HmsPay.init();
            let q5 = SDKConfig.setConfig(m5, o5, n5, SDKInfo.VERSION);
            await Devices.initAsync(o5);
            let r5 = await q5.initAsync();
            if (r5.code == 0 && r5.data) {
                let s5 = r5.data;
                let t5: Record<string, any> = {};
                try {
                    OpenInstall.getInstance().init(o5, "");
                    t5["source_ad"] = {};
                    let v5: any = await OpenInstall.getInstance().getInstall();
                    if (v5) {
                        t5["source_ad"]["openinstall"] = { "channelCode": v5?.channelCode, "data": v5?.bindData };
                    }
                    let w5: any = await OpenInstall.getInstance().getWakeUp(app.want);
                    if (w5) {
                        t5["source_ad"]["openinstall"] = { "channelCode": w5?.channelCode, "data": w5?.bindData };
                    }
                }
                catch (u5) {
                    Logger.e("openinstall :", u5);
                }
                UserActivate.init(o5, t5);
            }
            await AccountManager.initAsync(o5);
            await Passport.initAsync(o5);
            Hadoop.init(o5);
            this.registerRouterPageUpdate(n5);
            return r5;
        }
        catch (p5) {
            p5.code ??= RXErrorCode.INIT_ERROR;
            p5.msg ??= p5.message;
            Logger.e(p5);
            throw p5 as Error;
        }
    }
    private onRouterPageUpdate: (info: uiObserver.RouterPageInfo) => void = (l5: uiObserver.RouterPageInfo) => {
        if (l5.state == uiObserver.RouterPageState.ON_PAGE_SHOW) {
            this.onPageShow(l5.pageId, l5.path);
        }
        else if (l5.state == uiObserver.RouterPageState.ON_PAGE_HIDE) {
            this.onPageHide(l5.pageId, l5.path);
        }
    };
    onWindowStageCreate(h5: window.WindowStage): void {
        try {
            h5.on('windowStageEvent', (j5) => {
                let k5: window.WindowStageEventType = j5;
                Logger.d(`windowStage ${k5}`);
                EventBus.getInstance().emit(k5);
                if (k5 == window.WindowStageEventType.ACTIVE ||
                    k5 == window.WindowStageEventType.RESUMED) {
                    Passport.tryCompensateIifaaAutoValidateOnResume();
                }
            });
        }
        catch (i5) {
            Logger.e(`Failed to enable the listener for window stage event changes. Cause: ${JSON.stringify(i5)}`);
        }
    }
    private registerRouterPageUpdate(f5: UIContext) {
        let g5 = f5.getUIObserver();
        g5.off('routerPageUpdate', this.onRouterPageUpdate);
        g5.on('routerPageUpdate', this.onRouterPageUpdate);
    }
    public registerSdkEvent<c5 = object>(d5: SDKEventType, e5: (event: c5) => void) {
        EventBus.getInstance().registerEvent(d5, e5);
    }
    unregisterSdkEvent<z4 = object>(a5: SDKEventType, b5: (event: z4) => void): void {
        return EventBus.getInstance().unregisterEvent(a5, b5);
    }
    async initialize(x4: RXConfig, y4: UIContext): Promise<RXResult<object>> {
        return this.init(x4, y4);
    }
    onCreate(u4: common.UIAbilityContext, v4: Want, w4: AbilityConstant.LaunchParam): void {
    }
    onNewWant(r4: common.UIAbilityContext, s4: Want, t4: AbilityConstant.LaunchParam): void {
        Logger.info('rxsdk onNewWant Get message data successfully: %{public}s', JSON.stringify(s4.parameters));
        EventBus.getInstance().dispatchEvent(SDKEventType.OnWant, t4);
    }
    onPageShow(p4: string, q4?: string) {
    }
    onPageHide(n4: string, o4?: string) {
    }
    uploadData(k4: ArrayBuffer, l4: string, m4?: RCallback): Promise<RXResult<object>> {
        return Oss.uploadData(k4, l4, m4);
    }
    uploadFile(h4: string, i4?: string, j4?: RCallback): Promise<RXResult<object>> {
        return Oss.uploadFile(getContext(), h4, i4, j4);
    }
    pay(e4: PayParams, f4?: RCallback): Promise<RXResult<object>> {
        try {
            return billingProvider.pay(e4, f4);
        }
        catch (g4) {
            return g4;
        }
    }
    queryPurchases(): Promise<RXResult<object>> {
        try {
            return billingProvider.queryPurchases(getContext());
        }
        catch (d4) {
            return d4;
        }
    }
    unbindPlayer(b4?: string, c4?: string): Promise<string> {
        return Passport.unbindPlayer(b4, c4);
    }
    logout(): Promise<RXResult> {
        return Passport.logout();
    }
    setLogoRes(a4: ResourceStr) {
        if (a4 && a4 !== "") {
            if (typeof a4 == 'string' && a4?.startsWith('app.')) {
                a4 = { "id": -1, "type": -1, params: [a4], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ };
            }
            AppStorage.setOrCreate('rx_logo', a4);
        }
    }
    login(y3: LoginParams, z3?: RXCallback<RXResult<LoginData>>): Promise<RXResult<LoginData>> {
        return this.doLogin(y3, z3);
    }
    async unionLogin(f3: RXLoginConfig, g3: UIContext, h3?: RXCallback<RXResult<LoginData>>): Promise<RXResult<LoginData>> {
        try {
            this.setLogoRes(f3.logoResource);
            if (f3.ext && f3.ext["method"] && f3.ext["login_openid"]) {
                let x3 = await this.passport().login(f3.ext);
                if (x3.code === 0) {
                    h3?.(null, x3);
                    return x3;
                }
                else {
                    Objects.deleteKey(f3.ext, "login_openid");
                    Logger.w("login by login_openid failed: " + JSON.stringify(x3));
                }
            }
            let j3 = await SDKHandler.getInstance().handleUnionLogin(f3, SDKConfig.context);
            Logger.d(j3);
            let k3: RXUnionLoginResult = RXUtil.formatResult((JSON.parse(j3) as RXUnionLoginResult));
            if (k3.code !== 0) {
                h3?.(null, k3);
                return k3;
            }
            if (k3?.accountName !== "hw_account") {
                let s3: RXResult<LoginData> = await new Promise<RXResult<LoginData>>((t3, u3) => {
                    f3.fromUnionLogin = true;
                    UIApiImpl.showLoginUI(g3, f3, (v3: RXError, w3) => {
                        if (v3 != null) {
                            u3(v3);
                        }
                        else {
                            t3(w3 as RXResult<LoginData>);
                        }
                    });
                });
                s3 = RXUtil.formatResult(s3);
                this.queryPurchases();
                h3?.(null, s3);
                return s3;
            }
            else {
                let l3: LoginParams = Objects.assign(f3.ext, { method: LoginMethod.Harmony });
                l3.ext = Objects.assign(l3.ext, k3.data);
                if (k3.needBinding && !k3.boundPlayerInfo?.thirdOpenId) {
                    let q3: authentication.AuthorizationWithHuaweiIDCredential = k3?.data as authentication.AuthorizationWithHuaweiIDCredential;
                    let r3: RXResult<object> = await this.passport().association<RXResult<object>>({
                        code: q3.authorizationCode,
                        scopes: q3.authorizedScopes
                    });
                    Logger.d(r3);
                    if (r3.code == 0) {
                        l3.ext = Objects.assign(l3.ext, r3.data);
                    }
                    else {
                        h3?.(null, r3 as RXResult<LoginData>);
                        return r3 as RXResult<LoginData>;
                    }
                }
                else if (f3.unbindPlayer && (k3.boundPlayerInfo?.thirdOpenId || k3.localPlayer?.teamPlayerId)) {
                    Logger.d(`unbindPlayer thirdOpenId:${k3.boundPlayerInfo?.thirdOpenId} teamPlayerId:${k3.localPlayer?.teamPlayerId} `);
                    gamePlayer.unbindPlayer(SDKConfig.context as common.UIAbilityContext, k3.boundPlayerInfo?.thirdOpenId, k3.localPlayer?.teamPlayerId);
                }
                return await this.doLogin(l3).then(async (m3) => {
                    Logger.d(`doLogin then`);
                    if (k3.needBinding && !k3.boundPlayerInfo?.thirdOpenId && m3?.code == 0 && m3.data && !m3.data['nobind']) {
                        Logger.log("bindPlayer: thirdOpenId:" + m3.data?.openid + ", teamPlayerId:" + m3.data?.tid);
                        await gamePlayer.bindPlayer(SDKConfig.context as common.UIAbilityContext, m3.data?.openid, m3.data?.tid);
                        Hadoop.trackData("#bind_player", { thirdOpenId: m3.data?.openid, teamPlayerId: m3.data?.tid });
                    }
                    if (m3?.code == 0 && m3.data) {
                        m3.data.binding = k3.needBinding;
                    }
                    await Passport.handleGamePlayer(true);
                    this.queryPurchases();
                    if (f3.isDeregisterShow !== false && m3?.code == 0 && Passport.isDeRegistering(m3.data)) {
                        await new Promise<RXResult>((n3, o3) => {
                            UIApiImpl.showDestroyAccountStatusView(g3, "继续登录", (p3) => {
                                if (p3.code == 0) {
                                    n3(p3);
                                }
                                else {
                                    o3(p3);
                                }
                            });
                        });
                    }
                    h3?.(null, m3);
                    return m3;
                });
            }
        }
        catch (i3) {
            i3.code ??= RXErrorCode.LOGIN_ERROR;
            i3 = RXUtil.formatResult(i3);
            h3?.(i3);
            Logger.e(i3);
            Hadoop.trackData("#login_error", Objects.toObject(i3));
            return i3;
        }
    }
    private async doLogin(c3: LoginParams, d3?: RXCallback<RXResult<LoginData>>): Promise<RXResult<LoginData>> {
        let e3 = await LoginProvider.doLogin(c3);
        c3.ext = Objects.assign(c3.ext, e3);
        Logger.d(`doLogin:${JSON.stringify(c3)}`);
        return await this.passport().login(c3, d3);
    }
    async syncInfo(z2: LoginParams, a3?: RCallback): Promise<RXResult> {
        z2.method ??= this.loginData()?.method;
        let b3 = await LoginProvider.doLogin(z2);
        z2.ext = Objects.assign(z2.ext, b3);
        Logger.d(`syncInfo:${JSON.stringify(z2)}`);
        return await this.passport().syncInfo(z2, a3);
    }
    async bindAccount(w2: LoginParams | BindAccountParams, x2?: RCallback): Promise<RXResult> {
        w2.method ??= this.loginData()?.method;
        let y2 = await LoginProvider.doLogin(w2);
        w2.ext = Objects.assign(w2.ext, y2);
        Logger.d(`bindAccount:${JSON.stringify(w2)}`);
        return await this.passport().bindAccount(w2, x2);
    }
    dataTrack(t2: string, u2: Record<string, object>, v2?: string): boolean {
        return Hadoop.trackData(t2, u2, v2);
    }
}
export default RXApiImpl.getInstance() as RXApiImpl;
