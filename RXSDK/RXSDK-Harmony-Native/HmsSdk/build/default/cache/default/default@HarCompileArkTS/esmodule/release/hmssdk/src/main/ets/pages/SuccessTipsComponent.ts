// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SuccessTipsComponent_Params {
    title?: ResourceStr;
    icon?: ResourceStr;
    description?: ResourceStr;
    closeVisible?: boolean;
    onCloseClick?: (event?: ClickEvent) => void;
}
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
export class SuccessTipsComponent extends ViewPU {
    constructor(w134, x134, y134, z134 = -1, a135 = undefined, b135) {
        super(w134, y134, z134, b135);
        if (typeof a135 === "function") {
            this.paramsGenerator_ = a135;
        }
        this.__title = new ObservedPropertyObjectPU("实名认证", this, "title");
        this.__icon = new ObservedPropertyObjectPU({ "id": -1, "type": 20000, params: ['app.media.rx_tips_ico_success'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ }, this, "icon");
        this.__description = new ObservedPropertyObjectPU("实名认证成功", this, "description");
        this.__closeVisible = new ObservedPropertySimplePU(false, this, "closeVisible");
        this.onCloseClick = undefined;
        this.setInitiallyProvidedValue(x134);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(v134: SuccessTipsComponent_Params) {
        if (v134.title !== undefined) {
            this.title = v134.title;
        }
        if (v134.icon !== undefined) {
            this.icon = v134.icon;
        }
        if (v134.description !== undefined) {
            this.description = v134.description;
        }
        if (v134.closeVisible !== undefined) {
            this.closeVisible = v134.closeVisible;
        }
        if (v134.onCloseClick !== undefined) {
            this.onCloseClick = v134.onCloseClick;
        }
    }
    updateStateVars(u134: SuccessTipsComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(t134) {
        this.__title.purgeDependencyOnElmtId(t134);
        this.__icon.purgeDependencyOnElmtId(t134);
        this.__description.purgeDependencyOnElmtId(t134);
        this.__closeVisible.purgeDependencyOnElmtId(t134);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__icon.aboutToBeDeleted();
        this.__description.aboutToBeDeleted();
        this.__closeVisible.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: ObservedPropertyObjectPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(s134: ResourceStr) {
        this.__title.set(s134);
    }
    private __icon: ObservedPropertyObjectPU<ResourceStr>;
    get icon() {
        return this.__icon.get();
    }
    set icon(r134: ResourceStr) {
        this.__icon.set(r134);
    }
    private __description: ObservedPropertyObjectPU<ResourceStr>;
    get description() {
        return this.__description.get();
    }
    set description(q134: ResourceStr) {
        this.__description.set(q134);
    }
    private __closeVisible: ObservedPropertySimplePU<boolean>;
    get closeVisible() {
        return this.__closeVisible.get();
    }
    set closeVisible(p134: boolean) {
        this.__closeVisible.set(p134);
    }
    private onCloseClick?: (event?: ClickEvent) => void;
    close(o134?: ClickEvent) {
        this?.onCloseClick?.(o134);
    }
    initialRender() {
        this.observeComponentCreation2((m134, n134) => {
            Column.create();
            Column.constraintSize({ maxWidth: { "id": -1, "type": 10002, params: ['app.float.dialog_width'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ } });
            Column.margin({ left: 20, right: 20 });
            Column.backgroundColor(Color.White);
            Column.borderRadius(6);
        }, Column);
        this.observeComponentCreation2((k134, l134) => {
            __Common__.create();
            __Common__.margin({ top: 1 });
        }, __Common__);
        {
            this.observeComponentCreation2((e134, f134) => {
                if (f134) {
                    let g134 = new HeaderComponent(this, {
                        title: this.title,
                        onClose: (j134) => {
                            this.close(j134);
                        },
                        closeVisible: this.closeVisible
                    }, undefined, e134, () => { }, { page: "HmsSdk/src/main/ets/pages/SuccessTipsComponent.ets", line: 30, col: 7 });
                    ViewPU.create(g134);
                    let h134 = () => {
                        return {
                            title: this.title,
                            onClose: (i134) => {
                                this.close(i134);
                            },
                            closeVisible: this.closeVisible
                        };
                    };
                    g134.paramsGenerator_ = h134;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(e134, {
                        title: this.title,
                        closeVisible: this.closeVisible
                    });
                }
            }, { name: "HeaderComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((c134, d134) => {
            Column.create();
            Column.padding({ left: 20, right: 20 });
        }, Column);
        this.Body.bind(this)();
        Column.pop();
        Column.pop();
    }
    Body(o133 = null) {
        this.observeComponentCreation2((a134, b134) => {
            Scroll.create();
        }, Scroll);
        this.observeComponentCreation2((y133, z133) => {
            Column.create();
            Column.margin({ top: 27 });
        }, Column);
        this.observeComponentCreation2((w133, x133) => {
            Image.create(this.icon);
            Image.objectFit(ImageFit.None);
            Image.width(70);
            Image.margin({ bottom: 15 });
        }, Image);
        this.observeComponentCreation2((u133, v133) => {
            Text.create(this.description);
            Text.fontColor("#626262");
        }, Text);
        Text.pop();
        Column.pop();
        Scroll.pop();
        this.observeComponentCreation2((s133, t133) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((p133, q133) => {
            Button.createWithLabel('进入游戏', { type: ButtonType.Normal, stateEffect: true });
            Button.height({ "id": -1, "type": 10002, params: ['app.float.button_height'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.borderRadius(4);
            Button.layoutWeight(1);
            Button.fontSize({ "id": -1, "type": 10002, params: ['app.float.button_font_size'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.margin({ top: 27, bottom: 28 });
            Button.fontWeight(500);
            Button.fontColor(Color.White);
            Button.backgroundColor({ "id": -1, "type": 10001, params: ['app.color.col_20c0b3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Button.onClick((r133) => {
                this.close(r133);
            });
        }, Button);
        Button.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
