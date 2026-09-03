// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RXConfig, IBaseDialog, IFeedback, IHadoop, IPassport, IRXApi, LoginData, LoginParams, PayParams, RealNameResult, RXCallback, RXLoginConfig, RXResult, SDKEventType, RCallback, UIApi, WebViewConfig, HelperCenterArgs, UserCenterConfig, IOperation, AnnouncementConfig, Account, IGameAreaApi, IShare, PrivacyKeyArgs, Any, Reward, SendCaptchaParams, BindAccountParams } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { UIContext } from "@ohos:arkui.UIContext";
import RXApiImpl from "@normalized:N&&&hmssdk/src/main/ets/api/RXApiImpl&4.0.0";
import UIApiImpl from "@normalized:N&&&hmssdk/src/main/ets/pages/UIApiImpl&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
import SDKInfo from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKInfo&4.0.0";
import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import type common from "@ohos:app.ability.common";
import type Want from "@ohos:app.ability.Want";
import app from "@normalized:N&&&hmssdk/src/main/ets/utils/App&4.0.0";
import ShareProvider from "@normalized:N&&&hmssdk/src/main/ets/share/ShareProvider&4.0.0";
import { WXApi } from "@normalized:N&&&hmssdk/src/main/ets/wx/WXApi&4.0.0";
import type window from "@ohos:window";
import UserActionTracer from "@normalized:N&&&hmssdk/src/main/ets/base/UserActionTracer&4.0.0";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/sdk/RXIndex&4.0.0";
import { Singleton } from "@normalized:N&&&hmssdk/src/main/ets/types/Types&4.0.0";
import Update from "@normalized:N&&&hmssdk/src/main/ets/api/Update&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import Ranking from "@normalized:N&&&hmssdk/src/main/ets/api/Ranking&4.0.0";
import type { IRanking } from "@normalized:N&&&hmssdk/src/main/ets/api/Ranking&4.0.0";
import type { ISocial } from '../api/ISocial';
import Legal from "@normalized:N&&&hmssdk/src/main/ets/api/Legal&4.0.0";
import { PushManager } from "@normalized:N&&&hmssdk/src/main/ets/base/PushManager&4.0.0";
import type { IPush } from "@normalized:N&&&hmssdk/src/main/ets/base/PushManager&4.0.0";
import ServiceChat from "@normalized:N&&&hmssdk/src/main/ets/api/ServiceChat&4.0.0";
import { OpenInstall } from "@normalized:N&&&hmssdk/src/main/ets/plug/OpenInstall&4.0.0";
import { WXSdkWrapper } from "@normalized:N&&&hmssdk/src/main/ets/wx/WXSdkWrapper&4.0.0";
export interface TrackData {
    event_name: string;
    properties: Record<string, object>;
    distinct_id?: string;
}
export class RXApi extends Singleton<RXApi> implements IRXApi, UIApi {
    _instanceId: string;
    static instanceCount: number = 0;
    constructor() {
        super();
        this._instanceId = `RXApi_${Date.now()}_${RXApi.instanceCount}`;
        console.log("RXApi constructor " + this._instanceId);
    }
    get version(): string {
        return SDKInfo.VERSION;
    }
    get appName(): string {
        return app.name;
    }
    get rxapi(): IRXApi {
        return RXApiImpl;
    }
    get rxui(): UIApi {
        return UIApiImpl;
    }
    push(): IPush {
        return PushManager.getInstance();
    }
    operation(): IOperation {
        return this.rxapi.operation();
    }
    gameArea(): IGameAreaApi {
        return this.rxapi.gameArea();
    }
    wechat() {
        return WXSdkWrapper.getInstance();
    }
    rank(): IRanking {
        return Ranking;
    }
    share(): IShare {
        return ShareProvider;
    }
    onCreate(w156: common.UIAbilityContext, x156: Want, y156: AbilityConstant.LaunchParam): void {
        Logger.d("onCreate" + JSON.stringify(x156));
        app.handleWant(x156);
        Passport.handleIifaaCallbackUri(x156?.uri);
        this.handleWeChatCallIfNeed(x156);
        OpenInstall.getInstance().preInit(w156);
        this.rxapi.onCreate(w156, x156, y156);
    }
    onNewWant(t156: common.UIAbilityContext, u156: Want, v156: AbilityConstant.LaunchParam): void {
        Logger.d("onNewWant" + JSON.stringify(u156));
        app.handleWant(u156);
        Passport.handleIifaaCallbackUri(u156?.uri);
        this.handleWeChatCallIfNeed(u156);
        this.rxapi.onNewWant(t156, u156, v156);
    }
    onWindowStageCreate(s156: window.WindowStage): void {
        this.rxapi.onWindowStageCreate(s156);
    }
    private handleWeChatCallIfNeed(r156: Want) {
        WXApi.getInstance().handleWant(r156);
    }
    async sendCaptcha(i156: UIContext, j156: SendCaptchaParams, k156?: RCallback): Promise<RXResult> {
        try {
            j156.type ??= j156.phone ? 'phone' : 'email';
            j156.target ??= j156.phone || j156.email;
            let m156 = await this.rxapi.passport().sendCaptcha<object>(j156);
            if (m156.code == RXErrorCode.CAPTCHA_VERIFY) {
                m156 = await new Promise<RXResult>((n156, o156) => {
                    if (m156?.data) {
                        this.showCaptchaVerifyUI(i156, m156?.data["captcha_app_id"], async (p156) => {
                            if (p156?.code == 0) {
                                j156.tencent_captcha = p156 as object as Record<string, object>;
                                let q156 = await this.rxapi.passport().sendCaptcha<object>(j156);
                                n156(q156 as RXResult);
                            }
                            else {
                                n156(p156 as RXResult);
                            }
                        });
                    }
                    else {
                        n156(m156);
                    }
                });
            }
            k156?.(m156);
            return m156;
        }
        catch (l156) {
            Logger.e(l156);
            k156?.(RXUtil.formatResult(l156));
            return l156;
        }
    }
    showUserPrivacyPolicyUI(e156: UIContext, f156: string, g156: string, h156?: RCallback): IBaseDialog {
        return this.rxui.showUserPrivacyPolicyUI(e156, f156, g156, h156);
    }
    showCaptchaVerifyUI(b156: UIContext, c156: string, d156?: RCallback): Promise<IBaseDialog<object>> {
        return this.rxui.showCaptchaVerifyUI(b156, c156, d156);
    }
    showFeedbackUI(z155: UIContext, a156?: string[]): Promise<IBaseDialog<object>> {
        return this.rxui.showFeedbackUI(z155, a156);
    }
    showFeedbackListUI(y155: UIContext): Promise<IBaseDialog<object>> {
        return this.rxui.showFeedbackListUI(y155);
    }
    showMailUI(v155: UIContext, w155?: string, x155?: RCallback): Promise<IBaseDialog<object>> {
        return this.rxui.showMailUI(v155, w155, x155);
    }
    showAnnouncementUI(s155: UIContext, t155?: AnnouncementConfig, u155?: RCallback<string>): Promise<IBaseDialog<string>> {
        return this.rxui.showAnnouncementUI(s155, t155, u155);
    }
    showLoginUI(p155: UIContext, q155: RXLoginConfig, r155?: RXCallback<RXResult<LoginData>>): Promise<IBaseDialog<LoginData> | void> {
        this.setLogoRes(q155.logoResource);
        return this.rxui.showLoginUI(p155, q155, r155);
    }
    showDestroyAccountStatusView(m155: UIContext, n155: string, o155?: RCallback): IBaseDialog {
        return this.rxui.showDestroyAccountStatusView(m155, n155, o155);
    }
    showAccountListUI(j155: UIContext, k155?: RXLoginConfig, l155?: RXCallback<RXResult<Account>>): IBaseDialog<Account> {
        return this.rxui.showAccountListUI(j155, k155, l155);
    }
    showPrivacyUI(g155: UIContext, h155: PrivacyKeyArgs, i155?: RCallback<object>): IBaseDialog<object> {
        return this.rxui.showPrivacyUI(g155, h155, i155);
    }
    showForgotPasswordUI(e155: UIContext, f155?: RCallback): IBaseDialog {
        return this.rxui.showForgotPasswordUI(e155, f155);
    }
    showUserCenterUI(b155: UIContext, c155?: UserCenterConfig, d155?: RCallback): Promise<IBaseDialog> {
        return this.rxui.showUserCenterUI(b155, c155, d155);
    }
    applyForDeregisterUI(y154: UIContext, z154?: HelperCenterArgs, a155?: RCallback): IBaseDialog {
        return this.rxui.applyForDeregisterUI(y154, z154, a155);
    }
    showRealNameUI(u154: UIContext, v154?: RCallback<RealNameResult>, w154?: Reward[], x154?: boolean): IBaseDialog<RealNameResult> {
        return this.rxui.showRealNameUI(u154, v154, w154, x154);
    }
    showChangePasswordUI(s154: UIContext, t154?: RCallback): IBaseDialog {
        return this.rxui.showChangePasswordUI(s154, t154);
    }
    showHelperCenterUI(o154: UIContext, p154?: HelperCenterArgs, q154?: RCallback, r154?: string): IBaseDialog {
        return this.rxui.showHelperCenterUI(o154, p154, q154, r154);
    }
    showChatServicesUI(k154: UIContext, l154: Record<string, string>, m154?: RCallback, n154?: string): IBaseDialog {
        return this.rxui.showChatServicesUI(k154, l154, m154, n154);
    }
    showWebView(g154: UIContext, h154: WebViewConfig, i154?: RCallback, j154?: boolean): IBaseDialog {
        return this.rxui.showWebView(g154, h154, i154, j154);
    }
    distinctId(): string {
        return this.rxapi.distinctId();
    }
    deviceCode(): string {
        return this.rxapi.deviceCode();
    }
    subChannelId(): string {
        return this.rxapi.subChannelId();
    }
    domain(): string {
        return this.rxapi.domain();
    }
    feedback(): IFeedback {
        return this.rxapi.feedback();
    }
    social(): ISocial {
        return this.rxapi.social();
    }
    loginData(): LoginData | undefined {
        return this.rxapi.loginData();
    }
    passport(): IPassport {
        return this.rxapi.passport();
    }
    hadoop(): IHadoop {
        return this.rxapi.hadoop();
    }
    async RXInit(c154: RXConfig, d154: UIContext): Promise<string> {
        try {
            let f154 = await this.init(c154, d154);
            return JSON.stringify(f154);
        }
        catch (e154) {
            e154.code ??= RXErrorCode.INIT_ERROR;
            e154.msg ??= e154.message;
            return JSON.stringify(e154);
        }
    }
    async RXLogin(y153: RXLoginConfig, z153: UIContext): Promise<string> {
        try {
            let b154 = await this.rxapi.unionLogin(y153, z153);
            return JSON.stringify(b154);
        }
        catch (a154) {
            a154.msg ??= a154.message;
            return JSON.stringify(a154);
        }
    }
    trackData(x153: TrackData): boolean {
        return this.rxapi?.dataTrack(x153.event_name, x153.properties, x153.distinct_id);
    }
    trackUserAction(w153: Record<string, Any>) {
        UserActionTracer.trackUserAction(w153);
    }
    stopTrackUserAction() {
        UserActionTracer.stopTrackUserAction();
    }
    setPrivacyAgree() {
        Devices.setPrivacyAgree(getContext());
    }
    async init(p153: RXConfig, q153?: UIContext): Promise<RXResult> {
        try {
            Logger.log("RXSDK--Version: " + SDKInfo.VERSION);
            if (!this.rxapi) {
                throw new Error('RXApi not initialized properly');
            }
            q153 ??= globalThis?.UIContext;
            if (!q153) {
                Logger.e('Error:UIContext is null');
                throw new Error('Error:UIContext is null');
            }
            if (!p153) {
                Logger.e('Error:init params RXConfig is null');
                throw new Error('Error:RXConfig params is null');
            }
            if (p153.logoResource) {
                this.setLogoRes(p153.logoResource);
            }
            if (p153.privacyEnable) {
                if (!Devices.isPrivacyAgree(getContext())) {
                    let t153 = await new Promise<RXResult>((u153) => {
                        this.showUserPrivacyPolicyUI(q153!, RXUtil.getSDKPrivacy(p153), p153.privacyTitle || "用户协议和隐私政策", (v153) => {
                            Logger.d("showUserPrivacyPolicyUI result :" + JSON.stringify(v153));
                            u153(v153);
                        });
                    });
                    if (t153.code != RXErrorCode.OK) {
                        return t153 as object as RXResult;
                    }
                }
            }
            else {
                this.setPrivacyAgree();
            }
            return this.rxapi.init(p153, q153);
        }
        catch (r153) {
            let s153 = RXUtil.formatResult<RXResult>(r153, RXErrorCode.INIT_ERROR);
            Logger.e(s153);
            return s153;
        }
    }
    registerSdkEvent<m153 = object>(n153: SDKEventType, o153: (event: m153) => void): ((event: m153) => void) | undefined {
        return this.rxapi.registerSdkEvent(n153, o153);
    }
    unregisterSdkEvent<j153 = object>(k153: SDKEventType, l153: (event: j153) => void): void {
        return this.rxapi.unregisterSdkEvent(k153, l153);
    }
    initialize(h153: RXConfig, i153: UIContext): Promise<RXResult> {
        return this.rxapi.initialize(h153, i153);
    }
    pay(f153: PayParams, g153?: RCallback): Promise<RXResult> {
        return this.rxapi.pay(f153, g153);
    }
    queryPurchases(): Promise<RXResult> {
        return this.rxapi.queryPurchases();
    }
    login(d153: LoginParams, e153?: RXCallback<RXResult<LoginData>>): Promise<RXResult<LoginData>> {
        return this.rxapi.login(d153, e153);
    }
    syncInfo(b153: LoginParams, c153?: RCallback): Promise<RXResult> {
        return this.rxapi.syncInfo(b153, c153);
    }
    bindAccount(z152: BindAccountParams, a153?: RCallback<object>): Promise<RXResult<object>> {
        return this.rxapi.bindAccount(z152, a153);
    }
    unbindPlayer(): Promise<string> {
        return this.rxapi.unbindPlayer();
    }
    logout(): Promise<RXResult> {
        return this.rxapi.logout();
    }
    setLogoRes(y152: ResourceStr): void {
        return this.rxapi?.setLogoRes?.(y152);
    }
    setGameInfo(w152: string, x152: string) {
        SDKConfig.setGameInfo(w152, x152);
    }
    unionLogin(t152: RXLoginConfig, u152: UIContext, v152?: RXCallback<RXResult<LoginData>>): Promise<RXResult<LoginData>> {
        return this.rxapi?.unionLogin(t152, u152, v152);
    }
    dataTrack(q152: string, r152: Record<string, Any>, s152?: string): boolean {
        return this.rxapi?.dataTrack(q152, r152, s152);
    }
    uploadFile(n152: string, o152?: string, p152?: RCallback): Promise<RXResult> {
        return this.rxapi.uploadFile(n152, o152, p152);
    }
    updateGameVersion(l152: Record<string, Any>, m152: RCallback): Promise<RXResult> {
        return Update.updateGameVersion(l152, m152);
    }
    checkAppUpdate(e152: string, f152: string, g152?: Record<string, Any>, h152?: RCallback, i152?: string, j152?: string, k152?: string): Promise<RXResult> {
        return Update.checkAppUpdate(e152, f152, g152, h152, i152, { type: j152, format: k152 });
    }
    legal(d152?: RCallback): Promise<RXResult> {
        return Legal.legal(d152);
    }
    legalTerms(b152: Record<string, Any>, c152?: RCallback): Promise<RXResult> {
        return Legal.legalTerms(b152, c152);
    }
    getServiceChatUnreadCount(a152?: RCallback): Promise<RXResult> {
        return ServiceChat.getServiceChatUnreadCount(a152);
    }
    clearServiceChatUnreadCount(z151?: RCallback): Promise<RXResult> {
        return ServiceChat.clearServiceChatUnreadCount(z151);
    }
}
