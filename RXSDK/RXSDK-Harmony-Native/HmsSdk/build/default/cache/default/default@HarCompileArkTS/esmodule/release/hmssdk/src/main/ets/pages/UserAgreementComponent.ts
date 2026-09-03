// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface UserAgreementComponent_Params {
    title?: ResourceStr;
    confirmText?: ResourceStr;
    cancelText?: ResourceStr;
    contentFontSize?: number;
    onConfirm?: (event: ClickEvent) => void;
    onCancel?: (event: ClickEvent) => void;
    onLinkClick?: (index: number) => void;
    agreement?;
    content?: string;
}
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import { LengthMetrics } from "@ohos:arkui.node";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import UIApiImpl from "@normalized:N&&&hmssdk/src/main/ets/pages/UIApiImpl&4.0.0";
import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
import TextUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/TextUtil&4.0.0";
export class UserAgreementComponent extends ViewPU {
    constructor(d143, e143, f143, g143 = -1, h143 = undefined, i143) {
        super(d143, f143, g143, i143);
        if (typeof h143 === "function") {
            this.paramsGenerator_ = h143;
        }
        this.__title = new ObservedPropertyObjectPU('用户协议和隐私政策', this, "title");
        this.__confirmText = new ObservedPropertyObjectPU('同意', this, "confirmText");
        this.__cancelText = new ObservedPropertyObjectPU('不同意', this, "cancelText");
        this.contentFontSize = 15;
        this.onConfirm = undefined;
        this.onCancel = undefined;
        this.onLinkClick = undefined;
        this.agreement = `<a href='https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00001'>《用户协议》</a >` +
            `、<a href= 'https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00002'>《隐私政策》</a >`;
        this.__content = new ObservedPropertySimplePU(`       在您使用我们服务前，请您务必审慎阅读、充分理解${this.agreement}的各条款。同时，您应特别注意前述协议中免除或者限制我们责任的条款、对您权利进行限制的条款、约定争议解决方式和司法管辖的条款。如您已详细阅读并同意${this.agreement}请点击“同意”开始使用我们的服务。`, this, "content");
        this.setInitiallyProvidedValue(e143);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(c143: UserAgreementComponent_Params) {
        if (c143.title !== undefined) {
            this.title = c143.title;
        }
        if (c143.confirmText !== undefined) {
            this.confirmText = c143.confirmText;
        }
        if (c143.cancelText !== undefined) {
            this.cancelText = c143.cancelText;
        }
        if (c143.contentFontSize !== undefined) {
            this.contentFontSize = c143.contentFontSize;
        }
        if (c143.onConfirm !== undefined) {
            this.onConfirm = c143.onConfirm;
        }
        if (c143.onCancel !== undefined) {
            this.onCancel = c143.onCancel;
        }
        if (c143.onLinkClick !== undefined) {
            this.onLinkClick = c143.onLinkClick;
        }
        if (c143.agreement !== undefined) {
            this.agreement = c143.agreement;
        }
        if (c143.content !== undefined) {
            this.content = c143.content;
        }
    }
    updateStateVars(b143: UserAgreementComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(a143) {
        this.__title.purgeDependencyOnElmtId(a143);
        this.__confirmText.purgeDependencyOnElmtId(a143);
        this.__cancelText.purgeDependencyOnElmtId(a143);
        this.__content.purgeDependencyOnElmtId(a143);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__confirmText.aboutToBeDeleted();
        this.__cancelText.aboutToBeDeleted();
        this.__content.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: ObservedPropertyObjectPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(z142: ResourceStr) {
        this.__title.set(z142);
    }
    private __confirmText: ObservedPropertyObjectPU<ResourceStr>;
    get confirmText() {
        return this.__confirmText.get();
    }
    set confirmText(y142: ResourceStr) {
        this.__confirmText.set(y142);
    }
    private __cancelText: ObservedPropertyObjectPU<ResourceStr>;
    get cancelText() {
        return this.__cancelText.get();
    }
    set cancelText(x142: ResourceStr) {
        this.__cancelText.set(x142);
    }
    private contentFontSize: number;
    private onConfirm?: (event: ClickEvent) => void;
    private onCancel?: (event: ClickEvent) => void;
    private onLinkClick?: (index: number) => void;
    private agreement;
    private __content: ObservedPropertySimplePU<string>;
    get content() {
        return this.__content.get();
    }
    set content(w142: string) {
        this.__content.set(w142);
    }
    aboutToAppear(): void {
    }
    showPrivacyDetailDialog(u142: string, v142: string) {
        if (u142) {
            UIApiImpl.showWebView(this.getUIContext(), { url: u142.startsWith("http") ? u142 : ApiPath.getPrivacyUrl(u142), title: v142?.replace(/^《|》$/g, '') });
        }
        else {
            Logger.e("privacy url is null error");
        }
    }
    close(t142: ClickEvent) {
        this?.onCancel?.(t142);
    }
    confirm(s142: ClickEvent) {
        this?.onConfirm?.(s142);
    }
    initialRender() {
        this.observeComponentCreation2((q142, r142) => {
            Column.create();
            Column.constraintSize({ maxWidth: 450, maxHeight: 360 });
            Column.margin({
                left: 30,
                right: 30,
                top: 40,
                bottom: 40
            });
            Column.backgroundColor(Color.White);
            Column.borderRadius(6);
        }, Column);
        {
            this.observeComponentCreation2((k142, l142) => {
                if (l142) {
                    let m142 = new HeaderComponent(this, {
                        title: this.title,
                        closeVisible: false,
                        marginTop: 10,
                        onClose: (p142) => {
                            this.close(p142);
                        }
                    }, undefined, k142, () => { }, { page: "HmsSdk/src/main/ets/pages/UserAgreementComponent.ets", line: 55, col: 7 });
                    ViewPU.create(m142);
                    let n142 = () => {
                        return {
                            title: this.title,
                            closeVisible: false,
                            marginTop: 10,
                            onClose: (o142) => {
                                this.close(o142);
                            }
                        };
                    };
                    m142.paramsGenerator_ = n142;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(k142, {
                        title: this.title,
                        closeVisible: false
                    });
                }
            }, { name: "HeaderComponent" });
        }
        this.observeComponentCreation2((i142, j142) => {
            Scroll.create();
            Scroll.margin({
                left: 24,
                right: 24,
                top: 4,
                bottom: 4
            });
            Scroll.layoutWeight(1);
            Scroll.align(Alignment.Top);
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((g142, h142) => {
            Text.create();
            Text.fontSize(this.contentFontSize);
            Text.lineSpacing(LengthMetrics.vp(7));
        }, Text);
        this.observeComponentCreation2((u141, v141) => {
            ForEach.create();
            const w141 = (x141, y141: number) => {
                const z141 = x141;
                this.observeComponentCreation2((a142, b142) => {
                    If.create();
                    if (z141["type"] == "link") {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((e142, f142) => {
                                Span.create(z141["content"]);
                                Span.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                                Span.onClick(() => {
                                    console.log(z141["href"]);
                                    this.showPrivacyDetailDialog(z141["href"], z141["content"]);
                                });
                            }, Span);
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((c142, d142) => {
                                Span.create(z141["content"]);
                            }, Span);
                        });
                    }
                }, If);
                If.pop();
            };
            this.forEachUpdateFunction(u141, TextUtil.parseHrefHtml(this.content), w141, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Text.pop();
        Scroll.pop();
        this.observeComponentCreation2((s141, t141) => {
            Row.create();
            Row.margin({ left: 10, right: 10 });
        }, Row);
        this.observeComponentCreation2((q141, r141) => {
            Blank.create();
            Blank.width(15);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((n141, o141) => {
            Button.createWithLabel(this.cancelText, { type: ButtonType.Normal, stateEffect: true });
            Button.layoutWeight(0.5);
            Button.height({ "id": -1, "type": 10002, params: ['app.float.button_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.borderRadius(4);
            Button.fontSize({ "id": -1, "type": 10002, params: ['app.float.button_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.margin({ top: 12, bottom: 22 });
            Button.fontWeight(500);
            Button.borderColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.borderWidth(1);
            Button.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.backgroundColor(Color.White);
            Button.onClick((p141) => {
                this.close(p141);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((l141, m141) => {
            Blank.create();
            Blank.width("10%");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((i141, j141) => {
            Button.createWithLabel(this.confirmText, { type: ButtonType.Normal, stateEffect: true });
            Button.height({ "id": -1, "type": 10002, params: ['app.float.button_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.borderRadius(4);
            Button.fontSize({ "id": -1, "type": 10002, params: ['app.float.button_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.margin({ top: 12, bottom: 22 });
            Button.layoutWeight(0.5);
            Button.constraintSize({ maxWidth: 180 });
            Button.fontColor(Color.White);
            Button.backgroundColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.onClick((k141) => {
                this.confirm(k141);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((g141, h141) => {
            Blank.create();
            Blank.width(15);
        }, Blank);
        Blank.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
