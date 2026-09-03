// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CountDownComponent_Params {
    count?: number;
    target?: string;
    type?: CaptchaType;
    purpose?: Purpose;
    clickEnableLink?: boolean;
    myTimerModifier?: RXTextTimerModifier;
    countUpTextTimerController?: TextTimerController;
}
import promptAction from "@ohos:promptAction";
import { RXApi } from "@normalized:N&&&hmssdk/src/main/ets/sdk/RXApi&4.0.0";
import { Purpose } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { CaptchaType, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
class RXTextTimerModifier implements ContentModifier<TextTimerConfiguration> {
    constructor() {
    }
    applyContent(): WrappedBuilder<[
        TextTimerConfiguration
    ]> {
        return wrapBuilder(buildTextTimer);
    }
}
function getSurplusNum(p76: TextTimerConfiguration): number {
    let q76 = Math.floor(((p76.count - p76.elapsedTime) / 1000));
    return q76;
}
function getSurplusTime(n76: TextTimerConfiguration): string {
    let o76 = Math.floor(((n76.count - n76.elapsedTime) / 1000));
    return (n76.started && o76 > 0 ? "重新获取(" + o76 + ")" : "获取验证码");
}
function buildTextTimer(h76: TextTimerConfiguration, i76 = null) {
    const j76 = h76;
    (i76 ? i76 : this).observeComponentCreation2((k76, l76, m76 = j76) => {
        Text.create(getSurplusTime(m76));
        Text.fontColor((m76.started && getSurplusNum(m76)) > 0 ? Color.Black : { "id": -1, "type": 10001, params: ["app.color.col_20c0b3"], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
        Text.maxLines(1);
    }, Text);
    Text.pop();
}
export class CountDownComponent extends ViewPU {
    constructor(b76, c76, d76, e76 = -1, f76 = undefined, g76) {
        super(b76, d76, e76, g76);
        if (typeof f76 === "function") {
            this.paramsGenerator_ = f76;
        }
        this.__count = new ObservedPropertySimplePU(60000, this, "count");
        this.__target = new SynchedPropertySimpleOneWayPU(c76.target, this, "target");
        this.type = 'phone';
        this.purpose = Purpose.Login;
        this.__clickEnableLink = new ObservedPropertySimplePU(true, this, "clickEnableLink");
        this.__myTimerModifier = new ObservedPropertyObjectPU(new RXTextTimerModifier(), this, "myTimerModifier");
        this.countUpTextTimerController = new TextTimerController();
        this.setInitiallyProvidedValue(c76);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(a76: CountDownComponent_Params) {
        if (a76.count !== undefined) {
            this.count = a76.count;
        }
        if (a76.type !== undefined) {
            this.type = a76.type;
        }
        if (a76.purpose !== undefined) {
            this.purpose = a76.purpose;
        }
        if (a76.clickEnableLink !== undefined) {
            this.clickEnableLink = a76.clickEnableLink;
        }
        if (a76.myTimerModifier !== undefined) {
            this.myTimerModifier = a76.myTimerModifier;
        }
        if (a76.countUpTextTimerController !== undefined) {
            this.countUpTextTimerController = a76.countUpTextTimerController;
        }
    }
    updateStateVars(z75: CountDownComponent_Params) {
        this.__target.reset(z75.target);
    }
    purgeVariableDependenciesOnElmtId(y75) {
        this.__count.purgeDependencyOnElmtId(y75);
        this.__target.purgeDependencyOnElmtId(y75);
        this.__clickEnableLink.purgeDependencyOnElmtId(y75);
        this.__myTimerModifier.purgeDependencyOnElmtId(y75);
    }
    aboutToBeDeleted() {
        this.__count.aboutToBeDeleted();
        this.__target.aboutToBeDeleted();
        this.__clickEnableLink.aboutToBeDeleted();
        this.__myTimerModifier.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __count: ObservedPropertySimplePU<number>;
    get count() {
        return this.__count.get();
    }
    set count(x75: number) {
        this.__count.set(x75);
    }
    private __target: SynchedPropertySimpleOneWayPU<string>;
    get target() {
        return this.__target.get();
    }
    set target(w75: string) {
        this.__target.set(w75);
    }
    private type: CaptchaType;
    private purpose: Purpose;
    private __clickEnableLink: ObservedPropertySimplePU<boolean>;
    get clickEnableLink() {
        return this.__clickEnableLink.get();
    }
    set clickEnableLink(v75: boolean) {
        this.__clickEnableLink.set(v75);
    }
    private __myTimerModifier: ObservedPropertyObjectPU<RXTextTimerModifier>;
    get myTimerModifier() {
        return this.__myTimerModifier.get();
    }
    set myTimerModifier(u75: RXTextTimerModifier) {
        this.__myTimerModifier.set(u75);
    }
    private countUpTextTimerController: TextTimerController;
    aboutToAppear() {
    }
    initialRender() {
        this.observeComponentCreation2((o75, p75) => {
            TextTimer.create({ isCountDown: true, count: this.count, controller: this.countUpTextTimerController });
            TextTimer.contentModifier.bind(this)(ObservedObject.GetRawObject(this.myTimerModifier));
            TextTimer.onTimer((r75: number, s75: number) => {
                let t75 = Math.floor(((this.count - s75) / 1000));
                if (t75 < 0) {
                    this.clickEnableLink = true;
                    console.info('textTimer onTimer surplus：' + t75 + ', elapsedTime: ' + s75);
                }
            });
            TextTimer.enabled(this.clickEnableLink);
            TextTimer.onClick(async () => {
                if (this.target !== '') {
                    let q75: RXResult<object> = await RXApi.getInstance().sendCaptcha(this.getUIContext(), {
                        type: this.type,
                        target: this.target,
                        purpose: this.purpose
                    });
                    if (q75.code == 0) {
                        this.clickEnableLink = false;
                        this.countUpTextTimerController.reset();
                        this.countUpTextTimerController.start();
                        promptAction.showToast({ message: "验证码已发送" });
                    }
                    else if (q75.message) {
                        promptAction.showToast(q75);
                    }
                }
                else {
                    promptAction.showToast({ message: this.type == 'phone' ? "请输入手机号！" : "请输入您的账号" });
                }
            });
        }, TextTimer);
        TextTimer.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
