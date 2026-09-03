// @keepTs
// @ts-nocheck
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoadingComponent_Params {
    isLoading?: boolean;
    timeout?: number;
    text?: string;
    bgColor?: ResourceColor;
    onCloseClick?: () => void;
}
export class LoadingComponent extends ViewPU {
    constructor(v92, w92, x92, y92 = -1, z92 = undefined, a93) {
        super(v92, x92, y92, a93);
        if (typeof z92 === "function") {
            this.paramsGenerator_ = z92;
        }
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__timeout = new ObservedPropertySimplePU(5000, this, "timeout");
        this.__text = new ObservedPropertySimplePU('', this, "text");
        this.__bgColor = new ObservedPropertyObjectPU(Color.Transparent, this, "bgColor");
        this.onCloseClick = undefined;
        this.setInitiallyProvidedValue(w92);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(u92: LoadingComponent_Params) {
        if (u92.isLoading !== undefined) {
            this.isLoading = u92.isLoading;
        }
        if (u92.timeout !== undefined) {
            this.timeout = u92.timeout;
        }
        if (u92.text !== undefined) {
            this.text = u92.text;
        }
        if (u92.bgColor !== undefined) {
            this.bgColor = u92.bgColor;
        }
        if (u92.onCloseClick !== undefined) {
            this.onCloseClick = u92.onCloseClick;
        }
    }
    updateStateVars(t92: LoadingComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(s92) {
        this.__isLoading.purgeDependencyOnElmtId(s92);
        this.__timeout.purgeDependencyOnElmtId(s92);
        this.__text.purgeDependencyOnElmtId(s92);
        this.__bgColor.purgeDependencyOnElmtId(s92);
    }
    aboutToBeDeleted() {
        this.__isLoading.aboutToBeDeleted();
        this.__timeout.aboutToBeDeleted();
        this.__text.aboutToBeDeleted();
        this.__bgColor.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(r92: boolean) {
        this.__isLoading.set(r92);
    }
    private __timeout: ObservedPropertySimplePU<number>;
    get timeout() {
        return this.__timeout.get();
    }
    set timeout(q92: number) {
        this.__timeout.set(q92);
    }
    private __text: ObservedPropertySimplePU<string>;
    get text() {
        return this.__text.get();
    }
    set text(p92: string) {
        this.__text.set(p92);
    }
    private __bgColor?: ObservedPropertyObjectPU<ResourceColor>;
    get bgColor() {
        return this.__bgColor.get();
    }
    set bgColor(o92: ResourceColor) {
        this.__bgColor.set(o92);
    }
    private onCloseClick?: () => void;
    aboutToAppear() {
        this.isLoading = true;
        if (this.timeout > 0) {
            setTimeout(() => {
                this.isLoading = false;
                this.close();
            }, this.timeout);
        }
    }
    close() {
        this.onCloseClick?.();
    }
    initialRender() {
        this.observeComponentCreation2((m92, n92) => {
            Stack.create({ alignContent: Alignment.Center });
            Stack.height("100%");
            Stack.width("100%");
            Stack.backgroundColor(0x22000000);
        }, Stack);
        this.observeComponentCreation2((k92, l92) => {
            Column.create();
            Column.backgroundColor(ObservedObject.GetRawObject(this.bgColor));
            Column.borderRadius(10);
        }, Column);
        this.observeComponentCreation2((i92, j92) => {
            LoadingProgress.create();
            LoadingProgress.color('#20c0b3');
            LoadingProgress.enableLoading(this.isLoading);
            LoadingProgress.visibility(this.isLoading ? Visibility.Visible : Visibility.None);
            LoadingProgress.width(90);
        }, LoadingProgress);
        this.observeComponentCreation2((e92, f92) => {
            If.create();
            if (this.text) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((g92, h92) => {
                        Text.create(this.text);
                        Text.maxLines(3);
                        Text.constraintSize({ maxWidth: 200 });
                        Text.fontColor(Color.White);
                        Text.margin({ bottom: 15, left: 20, right: 20 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
