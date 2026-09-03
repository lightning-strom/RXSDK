// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HeaderComponent_Params {
    title?: ResourceStr;
    backVisible?: boolean;
    closeVisible?: boolean;
    isImage?: boolean;
    marginTop?: number;
    fontSize?: number;
    onClose?: (event: ClickEvent) => void;
    onBack?: (event: ClickEvent) => void;
}
export class HeaderComponent extends ViewPU {
    constructor(p91, q91, r91, s91 = -1, t91 = undefined, u91) {
        super(p91, r91, s91, u91);
        if (typeof t91 === "function") {
            this.paramsGenerator_ = t91;
        }
        this.__title = new SynchedPropertyObjectOneWayPU(q91.title, this, "title");
        this.__backVisible = new SynchedPropertySimpleOneWayPU(q91.backVisible, this, "backVisible");
        this.__closeVisible = new SynchedPropertySimpleOneWayPU(q91.closeVisible, this, "closeVisible");
        this.__isImage = new ObservedPropertySimplePU(false, this, "isImage");
        this.__marginTop = new ObservedPropertySimplePU(5, this, "marginTop");
        this.fontSize = 18;
        this.onClose = undefined;
        this.onBack = undefined;
        this.setInitiallyProvidedValue(q91);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(o91: HeaderComponent_Params) {
        if (o91.title === undefined) {
            this.__title.set("");
        }
        if (o91.backVisible === undefined) {
            this.__backVisible.set(false);
        }
        if (o91.closeVisible === undefined) {
            this.__closeVisible.set(true);
        }
        if (o91.isImage !== undefined) {
            this.isImage = o91.isImage;
        }
        if (o91.marginTop !== undefined) {
            this.marginTop = o91.marginTop;
        }
        if (o91.fontSize !== undefined) {
            this.fontSize = o91.fontSize;
        }
        if (o91.onClose !== undefined) {
            this.onClose = o91.onClose;
        }
        if (o91.onBack !== undefined) {
            this.onBack = o91.onBack;
        }
    }
    updateStateVars(n91: HeaderComponent_Params) {
        this.__title.reset(n91.title);
        this.__backVisible.reset(n91.backVisible);
        this.__closeVisible.reset(n91.closeVisible);
    }
    purgeVariableDependenciesOnElmtId(m91) {
        this.__title.purgeDependencyOnElmtId(m91);
        this.__backVisible.purgeDependencyOnElmtId(m91);
        this.__closeVisible.purgeDependencyOnElmtId(m91);
        this.__isImage.purgeDependencyOnElmtId(m91);
        this.__marginTop.purgeDependencyOnElmtId(m91);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__backVisible.aboutToBeDeleted();
        this.__closeVisible.aboutToBeDeleted();
        this.__isImage.aboutToBeDeleted();
        this.__marginTop.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: SynchedPropertySimpleOneWayPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(l91: ResourceStr) {
        this.__title.set(l91);
    }
    private __backVisible: SynchedPropertySimpleOneWayPU<boolean>;
    get backVisible() {
        return this.__backVisible.get();
    }
    set backVisible(k91: boolean) {
        this.__backVisible.set(k91);
    }
    private __closeVisible: SynchedPropertySimpleOneWayPU<boolean>;
    get closeVisible() {
        return this.__closeVisible.get();
    }
    set closeVisible(j91: boolean) {
        this.__closeVisible.set(j91);
    }
    private __isImage: ObservedPropertySimplePU<boolean>;
    get isImage() {
        return this.__isImage.get();
    }
    set isImage(i91: boolean) {
        this.__isImage.set(i91);
    }
    private __marginTop: ObservedPropertySimplePU<number>;
    get marginTop() {
        return this.__marginTop.get();
    }
    set marginTop(h91: number) {
        this.__marginTop.set(h91);
    }
    private fontSize: number;
    private onClose?: (event: ClickEvent) => void;
    private onBack?: (event: ClickEvent) => void;
    initialRender() {
        this.observeComponentCreation2((f91, g91) => {
            RelativeContainer.create();
            RelativeContainer.height('46vp');
        }, RelativeContainer);
        this.observeComponentCreation2((b91, c91) => {
            If.create();
            if (this.backVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    if (!If.canRetake("back")) {
                        this.observeComponentCreation2((d91, e91) => {
                            Image.create({ "id": -1, "type": 20000, params: ["app.media.rx_back"], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                            Image.objectFit(ImageFit.Contain);
                            Image.width('24vp');
                            Image.padding(2);
                            Image.margin({ left: '18vp' });
                            Image.alignRules({
                                left: { anchor: '__container__', align: HorizontalAlign.Start },
                                center: { anchor: '__container__', align: VerticalAlign.Center }
                            });
                            Image.onClick(this.onBack || this.onClose);
                            Image.id("back");
                        }, Image);
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((x90, y90) => {
            If.create();
            if (this.closeVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    if (!If.canRetake("close")) {
                        this.observeComponentCreation2((z90, a91) => {
                            Image.create({ "id": -1, "type": 20000, params: ["app.media.rx_close"], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                            Image.objectFit(ImageFit.Contain);
                            Image.padding(2);
                            Image.width('24vp');
                            Image.margin({ right: '18vp' });
                            Image.alignRules({
                                right: { anchor: '__container__', align: HorizontalAlign.End },
                                center: { anchor: '__container__', align: VerticalAlign.Center }
                            });
                            Image.onClick(this.onClose);
                            Image.id("close");
                        }, Image);
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((v90, w90) => {
            Stack.create();
            Stack.alignRules({
                middle: { anchor: '__container__', align: HorizontalAlign.Center },
                center: { anchor: '__container__', align: VerticalAlign.Center }
            });
            Stack.id("content");
        }, Stack);
        this.observeComponentCreation2((p90, q90) => {
            If.create();
            if (this.isImage || (("object" == typeof this.title) && this.title?.["type"] == 20000)) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((t90, u90) => {
                        Image.create(this.title);
                        Image.height('24vp');
                        Image.margin({ top: this.marginTop });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((r90, s90) => {
                        Text.create(this.title);
                        Text.fontSize(this.fontSize);
                        Text.margin({ top: this.marginTop });
                        Text.fontColor(Color.Black);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Stack.pop();
        RelativeContainer.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
