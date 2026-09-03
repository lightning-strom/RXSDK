// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TipsComponent_Params {
    title?: ResourceStr;
    confirmText?: ResourceStr;
    content?: ResourceStr;
    linkContent?: string[];
    cancelText?: ResourceStr;
    cancelVisible?: boolean;
    isPrivacyAgreed?: boolean;
    contentFontSize?: number;
    onConfirm?: (event: ClickEvent) => void;
    onCancel?: (event: ClickEvent) => void;
    onLinkClick?: (index: number) => void;
    controller?: CustomDialogController;
}
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import { LengthMetrics } from "@ohos:arkui.node";
export class TipsComponent extends ViewPU {
    constructor(x137, y137, z137, a138 = -1, b138 = undefined, c138) {
        super(x137, z137, a138, c138);
        if (typeof b138 === "function") {
            this.paramsGenerator_ = b138;
        }
        this.__title = new ObservedPropertyObjectPU('提示', this, "title");
        this.__confirmText = new ObservedPropertyObjectPU('确定', this, "confirmText");
        this.__content = new ObservedPropertyObjectPU('提示', this, "content");
        this.__linkContent = new ObservedPropertyObjectPU([], this, "linkContent");
        this.__cancelText = new ObservedPropertyObjectPU('取消', this, "cancelText");
        this.__cancelVisible = new ObservedPropertySimplePU(true, this, "cancelVisible");
        this.__isPrivacyAgreed = new ObservedPropertySimplePU(false, this, "isPrivacyAgreed");
        this.contentFontSize = 14;
        this.onConfirm = undefined;
        this.onCancel = undefined;
        this.onLinkClick = undefined;
        this.controller = undefined;
        this.setInitiallyProvidedValue(y137);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(w137: TipsComponent_Params) {
        if (w137.title !== undefined) {
            this.title = w137.title;
        }
        if (w137.confirmText !== undefined) {
            this.confirmText = w137.confirmText;
        }
        if (w137.content !== undefined) {
            this.content = w137.content;
        }
        if (w137.linkContent !== undefined) {
            this.linkContent = w137.linkContent;
        }
        if (w137.cancelText !== undefined) {
            this.cancelText = w137.cancelText;
        }
        if (w137.cancelVisible !== undefined) {
            this.cancelVisible = w137.cancelVisible;
        }
        if (w137.isPrivacyAgreed !== undefined) {
            this.isPrivacyAgreed = w137.isPrivacyAgreed;
        }
        if (w137.contentFontSize !== undefined) {
            this.contentFontSize = w137.contentFontSize;
        }
        if (w137.onConfirm !== undefined) {
            this.onConfirm = w137.onConfirm;
        }
        if (w137.onCancel !== undefined) {
            this.onCancel = w137.onCancel;
        }
        if (w137.onLinkClick !== undefined) {
            this.onLinkClick = w137.onLinkClick;
        }
        if (w137.controller !== undefined) {
            this.controller = w137.controller;
        }
    }
    updateStateVars(v137: TipsComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(u137) {
        this.__title.purgeDependencyOnElmtId(u137);
        this.__confirmText.purgeDependencyOnElmtId(u137);
        this.__content.purgeDependencyOnElmtId(u137);
        this.__linkContent.purgeDependencyOnElmtId(u137);
        this.__cancelText.purgeDependencyOnElmtId(u137);
        this.__cancelVisible.purgeDependencyOnElmtId(u137);
        this.__isPrivacyAgreed.purgeDependencyOnElmtId(u137);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__confirmText.aboutToBeDeleted();
        this.__content.aboutToBeDeleted();
        this.__linkContent.aboutToBeDeleted();
        this.__cancelText.aboutToBeDeleted();
        this.__cancelVisible.aboutToBeDeleted();
        this.__isPrivacyAgreed.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: ObservedPropertyObjectPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(t137: ResourceStr) {
        this.__title.set(t137);
    }
    private __confirmText: ObservedPropertyObjectPU<ResourceStr>;
    get confirmText() {
        return this.__confirmText.get();
    }
    set confirmText(s137: ResourceStr) {
        this.__confirmText.set(s137);
    }
    private __content: ObservedPropertyObjectPU<ResourceStr>;
    get content() {
        return this.__content.get();
    }
    set content(r137: ResourceStr) {
        this.__content.set(r137);
    }
    private __linkContent: ObservedPropertyObjectPU<string[]>;
    get linkContent() {
        return this.__linkContent.get();
    }
    set linkContent(q137: string[]) {
        this.__linkContent.set(q137);
    }
    private __cancelText: ObservedPropertyObjectPU<ResourceStr>;
    get cancelText() {
        return this.__cancelText.get();
    }
    set cancelText(p137: ResourceStr) {
        this.__cancelText.set(p137);
    }
    private __cancelVisible: ObservedPropertySimplePU<boolean>;
    get cancelVisible() {
        return this.__cancelVisible.get();
    }
    set cancelVisible(o137: boolean) {
        this.__cancelVisible.set(o137);
    }
    private __isPrivacyAgreed: ObservedPropertySimplePU<boolean>;
    get isPrivacyAgreed() {
        return this.__isPrivacyAgreed.get();
    }
    set isPrivacyAgreed(n137: boolean) {
        this.__isPrivacyAgreed.set(n137);
    }
    private contentFontSize: number;
    private onConfirm?: (event: ClickEvent) => void;
    private onCancel?: (event: ClickEvent) => void;
    private onLinkClick?: (index: number) => void;
    private controller: CustomDialogController;
    setController(m137: CustomDialogController) {
        this.controller = m137;
    }
    aboutToAppear() {
    }
    close(l137: ClickEvent) {
        this?.onCancel?.(l137);
        this?.controller?.close();
    }
    confirm(k137: ClickEvent) {
        this?.onConfirm?.(k137);
        this?.controller?.close();
    }
    initialRender() {
        this.observeComponentCreation2((i137, j137) => {
            Column.create();
            Column.constraintSize({ maxWidth: { "id": -1, "type": 10002, params: ['app.float.dialog_width'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            Column.margin({ left: 20, right: 20, top: 20, bottom: 20 });
            Column.backgroundColor(Color.White);
            Column.borderRadius(6);
        }, Column);
        {
            this.observeComponentCreation2((c137, d137) => {
                if (d137) {
                    let e137 = new HeaderComponent(this, {
                        title: this.title,
                        closeVisible: false,
                        onClose: (h137) => {
                            this.close(h137);
                        }
                    }, undefined, c137, () => { }, { page: "HmsSdk/src/main/ets/pages/TipsComponent.ets", line: 43, col: 7 });
                    ViewPU.create(e137);
                    let f137 = () => {
                        return {
                            title: this.title,
                            closeVisible: false,
                            onClose: (g137) => {
                                this.close(g137);
                            }
                        };
                    };
                    e137.paramsGenerator_ = f137;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(c137, {
                        title: this.title,
                        closeVisible: false
                    });
                }
            }, { name: "HeaderComponent" });
        }
        this.observeComponentCreation2((a137, b137) => {
            Flex.create({ wrap: FlexWrap.Wrap, space: { main: LengthMetrics.px(5), cross: LengthMetrics.px(5) } });
            Flex.margin({
                left: 2,
                right: 2,
                top: 10,
                bottom: 10
            });
            Flex.padding({ left: 20, right: 20 });
        }, Flex);
        this.observeComponentCreation2((y136, z136) => {
            Text.create();
            Text.fontSize(this.contentFontSize);
            Text.lineSpacing(LengthMetrics.vp(9));
        }, Text);
        this.observeComponentCreation2((w136, x136) => {
            Span.create(this.content);
        }, Span);
        this.observeComponentCreation2((i136, j136) => {
            ForEach.create();
            const k136 = (l136, m136: number) => {
                const n136 = l136;
                this.observeComponentCreation2((o136, p136) => {
                    If.create();
                    if (n136) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((s136, t136) => {
                                If.create();
                                if (n136 && n136 != '' && m136 > 0) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((u136, v136) => {
                                            Span.create("、");
                                        }, Span);
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                            this.observeComponentCreation2((q136, r136) => {
                                Span.create(n136);
                                Span.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                                Span.onClick(() => {
                                    this.onLinkClick?.(m136);
                                });
                            }, Span);
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
            };
            this.forEachUpdateFunction(i136, this.linkContent, k136, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Text.pop();
        Flex.pop();
        this.observeComponentCreation2((g136, h136) => {
            Row.create();
            Row.margin({ left: 10, right: 10 });
        }, Row);
        this.observeComponentCreation2((z135, a136) => {
            If.create();
            if (this.cancelVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((e136, f136) => {
                        Blank.create();
                        Blank.width(15);
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((b136, c136) => {
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
                        Button.onClick((d136) => {
                            this.close(d136);
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((x135, y135) => {
            Blank.create();
            Blank.width(20);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((u135, v135) => {
            Button.createWithLabel(this.confirmText, { type: ButtonType.Normal, stateEffect: true });
            Button.height({ "id": -1, "type": 10002, params: ['app.float.button_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.borderRadius(4);
            Button.fontSize({ "id": -1, "type": 10002, params: ['app.float.button_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.margin({ top: 12, bottom: 22 });
            Button.layoutWeight(0.5);
            Button.constraintSize({ maxWidth: 180 });
            Button.fontColor(Color.White);
            Button.backgroundColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.onClick((w135) => {
                this.confirm(w135);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((s135, t135) => {
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
