// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PreviewComponent_Params {
    title?: ResourceStr;
    backVisible?: boolean;
    closeVisible?: boolean;
    onCloseClick?: (event: ClickEvent) => void;
    onBack?: (event: ClickEvent) => void;
    list?: string[];
    cursorIdx?: number;
    clickClose?: boolean;
    swiperController?: SwiperController;
    data?: MyDataSource;
}
class MyDataSource implements IDataSource {
    private list: string[] = [];
    constructor(i123: string[]) {
        this.list = i123;
    }
    totalCount(): number {
        return this.list.length;
    }
    getData(h123: number): string {
        return this.list[h123];
    }
    registerDataChangeListener(g123: DataChangeListener): void {
    }
    unregisterDataChangeListener() {
    }
}
export class PreviewComponent extends ViewPU {
    constructor(a123, b123, c123, d123 = -1, e123 = undefined, f123) {
        super(a123, c123, d123, f123);
        if (typeof e123 === "function") {
            this.paramsGenerator_ = e123;
        }
        this.__title = new ObservedPropertyObjectPU("", this, "title");
        this.__backVisible = new ObservedPropertySimplePU(false, this, "backVisible");
        this.__closeVisible = new ObservedPropertySimplePU(true, this, "closeVisible");
        this.onCloseClick = undefined;
        this.onBack = undefined;
        this.list = [
            "https://rxfile.fishinggamezone.com/2024/06/28/1719560491878.png",
            "https://rxfile.fishinggamezone.com/2024/06/25/1719309658818.jpg",
            "https://media.w3.org/2010/05/sintel/trailer.mp4",
            "https://www.w3school.com.cn/example/html5/mov_bbb.mp4",
            "https://www.w3schools.com/html/movie.mp4",
            "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        ];
        this.__cursorIdx = new ObservedPropertySimplePU(0, this, "cursorIdx");
        this.__clickClose = new ObservedPropertySimplePU(true, this, "clickClose");
        this.swiperController = new SwiperController();
        this.data = new MyDataSource([]);
        this.setInitiallyProvidedValue(b123);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(z122: PreviewComponent_Params) {
        if (z122.title !== undefined) {
            this.title = z122.title;
        }
        if (z122.backVisible !== undefined) {
            this.backVisible = z122.backVisible;
        }
        if (z122.closeVisible !== undefined) {
            this.closeVisible = z122.closeVisible;
        }
        if (z122.onCloseClick !== undefined) {
            this.onCloseClick = z122.onCloseClick;
        }
        if (z122.onBack !== undefined) {
            this.onBack = z122.onBack;
        }
        if (z122.list !== undefined) {
            this.list = z122.list;
        }
        if (z122.cursorIdx !== undefined) {
            this.cursorIdx = z122.cursorIdx;
        }
        if (z122.clickClose !== undefined) {
            this.clickClose = z122.clickClose;
        }
        if (z122.swiperController !== undefined) {
            this.swiperController = z122.swiperController;
        }
        if (z122.data !== undefined) {
            this.data = z122.data;
        }
    }
    updateStateVars(y122: PreviewComponent_Params) {
    }
    purgeVariableDependenciesOnElmtId(x122) {
        this.__title.purgeDependencyOnElmtId(x122);
        this.__backVisible.purgeDependencyOnElmtId(x122);
        this.__closeVisible.purgeDependencyOnElmtId(x122);
        this.__cursorIdx.purgeDependencyOnElmtId(x122);
        this.__clickClose.purgeDependencyOnElmtId(x122);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__backVisible.aboutToBeDeleted();
        this.__closeVisible.aboutToBeDeleted();
        this.__cursorIdx.aboutToBeDeleted();
        this.__clickClose.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: ObservedPropertyObjectPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(w122: ResourceStr) {
        this.__title.set(w122);
    }
    private __backVisible: ObservedPropertySimplePU<boolean>;
    get backVisible() {
        return this.__backVisible.get();
    }
    set backVisible(v122: boolean) {
        this.__backVisible.set(v122);
    }
    private __closeVisible: ObservedPropertySimplePU<boolean>;
    get closeVisible() {
        return this.__closeVisible.get();
    }
    set closeVisible(u122: boolean) {
        this.__closeVisible.set(u122);
    }
    private onCloseClick?: (event: ClickEvent) => void;
    private onBack?: (event: ClickEvent) => void;
    private list: string[];
    private __cursorIdx: ObservedPropertySimplePU<number>;
    get cursorIdx() {
        return this.__cursorIdx.get();
    }
    set cursorIdx(t122: number) {
        this.__cursorIdx.set(t122);
    }
    private __clickClose: ObservedPropertySimplePU<boolean>;
    get clickClose() {
        return this.__clickClose.get();
    }
    set clickClose(s122: boolean) {
        this.__clickClose.set(s122);
    }
    private swiperController: SwiperController;
    private data: MyDataSource;
    aboutToAppear(): void {
        this.data = new MyDataSource(this.list);
    }
    close(r122: ClickEvent) {
        this.onCloseClick?.(r122);
    }
    initialRender() {
        this.observeComponentCreation2((p122, q122) => {
            RelativeContainer.create();
            RelativeContainer.backgroundColor(Color.Black);
        }, RelativeContainer);
        this.observeComponentCreation2((n122, o122) => {
            Column.create({ space: 5 });
            Column.width('100%');
            Column.margin({ top: 5 });
        }, Column);
        this.observeComponentCreation2((k122, l122) => {
            Swiper.create(this.swiperController);
            Swiper.onClick((m122) => {
                if (this.clickClose) {
                    this.close(m122);
                }
            });
            Swiper.cachedCount(2);
            Swiper.index(this.cursorIdx);
            Swiper.indicator(new DotIndicator()
                .bottom(30)
                .color(Color.Gray));
        }, Swiper);
        {
            const z121 = a122 => {
                const b122 = a122;
                this.observeComponentCreation2((i122, j122) => {
                    RelativeContainer.create();
                }, RelativeContainer);
                this.observeComponentCreation2((c122, d122) => {
                    If.create();
                    if (b122.endsWith(".mp4")) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((g122, h122) => {
                                Video.create({ src: b122 });
                            }, Video);
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((e122, f122) => {
                                Image.create(b122);
                                Image.objectFit(ImageFit.Contain);
                            }, Image);
                        });
                    }
                }, If);
                If.pop();
                RelativeContainer.pop();
            };
            LazyForEach.create("1", this, this.data, z121);
            LazyForEach.pop();
        }
        Swiper.pop();
        Column.pop();
        this.observeComponentCreation2((u121, v121) => {
            If.create();
            if (this.closeVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((w121, x121) => {
                        Image.create({ "id": -1, "type": 20000, params: ['app.media.ic_close_x_mark_bg'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                        Image.width(45);
                        Image.padding(10);
                        Image.onClick((y121) => {
                            this.cursorIdx = -1;
                            this.close(y121);
                        });
                        Image.margin({ left: 25, top: 30, right: 20 });
                        Image.alignRules({
                            top: { anchor: "__container__", align: VerticalAlign.Top },
                            right: { anchor: "__container__", align: HorizontalAlign.End }
                        });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        RelativeContainer.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "PreviewComponent";
    }
}
registerNamedRoute(() => new PreviewComponent(undefined, {}), "", { bundleName: __BUNDLE_NAME__, moduleName: __MODULE_NAME__, pagePath: "HmsSdk/src/main/ets/pages/PreviewComponent", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__", moduleType: "byteCodeHar" });
