// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RXDialog_Params {
    okText?: string;
    cancelText?: string;
    title?: string;
    controller?: CustomDialogController;
    cancel?: () => void;
}
export class RXDialog extends ViewPU {
    constructor(z132, a133, b133, c133 = -1, d133 = undefined, e133) {
        super(z132, b133, c133, e133);
        if (typeof d133 === "function") {
            this.paramsGenerator_ = d133;
        }
        this.__okText = new ObservedPropertySimplePU("ok", this, "okText");
        this.__cancelText = new ObservedPropertySimplePU("cancel", this, "cancelText");
        this.__title = new ObservedPropertySimplePU("提示", this, "title");
        this.controller = undefined;
        this.cancel = () => { };
        this.setInitiallyProvidedValue(a133);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(y132: RXDialog_Params) {
        if (y132.okText !== undefined) {
            this.okText = y132.okText;
        }
        if (y132.cancelText !== undefined) {
            this.cancelText = y132.cancelText;
        }
        if (y132.title !== undefined) {
            this.title = y132.title;
        }
        if (y132.controller !== undefined) {
            this.controller = y132.controller;
        }
        if (y132.cancel !== undefined) {
            this.cancel = y132.cancel;
        }
    }
    updateStateVars(x132: RXDialog_Params) {
    }
    purgeVariableDependenciesOnElmtId(w132) {
        this.__okText.purgeDependencyOnElmtId(w132);
        this.__cancelText.purgeDependencyOnElmtId(w132);
        this.__title.purgeDependencyOnElmtId(w132);
    }
    aboutToBeDeleted() {
        this.__okText.aboutToBeDeleted();
        this.__cancelText.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __okText: ObservedPropertySimplePU<string>;
    get okText() {
        return this.__okText.get();
    }
    set okText(v132: string) {
        this.__okText.set(v132);
    }
    private __cancelText: ObservedPropertySimplePU<string>;
    get cancelText() {
        return this.__cancelText.get();
    }
    set cancelText(u132: string) {
        this.__cancelText.set(u132);
    }
    private __title: ObservedPropertySimplePU<string>;
    get title() {
        return this.__title.get();
    }
    set title(t132: string) {
        this.__title.set(t132);
    }
    private controller: CustomDialogController;
    setController(s132: CustomDialogController) {
        this.controller = s132;
    }
    private cancel: () => void;
    open() {
        if (this.controller) {
            this.controller.open();
        }
    }
    close() {
        if (this.controller) {
            this.controller.close();
        }
    }
    initialRender() {
        this.observeComponentCreation2((q132, r132) => {
            Column.create();
            Column.backgroundColor({ "id": -1, "type": 10001, params: ["app.color.col_f0f0f0"], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Column.width('334vp');
            Column.height('265vp');
        }, Column);
        this.observeComponentCreation2((o132, p132) => {
            Row.create();
            Row.height('55%');
        }, Row);
        Row.pop();
        this.observeComponentCreation2((m132, n132) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((k132, l132) => {
            Row.create({ space: '20vp' });
        }, Row);
        this.observeComponentCreation2((i132, j132) => {
            Button.createWithLabel(this.okText);
            Button.width('30%');
            Button.onClick(() => {
                this.close();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((g132, h132) => {
            Button.createWithLabel(this.cancelText);
            Button.width('30%');
            Button.onClick(() => {
                this.close();
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((e132, f132) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
