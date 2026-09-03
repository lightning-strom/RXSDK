// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginAccountListComponent_Params {
    title?: ResourceStr;
    list?: Account[];
    onCloseClick?: (event?: ClickEvent) => void;
    onItemClick?: (item: Account, index: number) => void;
    onDelClick?: (item: Account, index: number) => void;
}
import type { Account } from '../types/Index';
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
import { HeaderComponent } from "@normalized:N&&&hmssdk/src/main/ets/pages/HeaderComponent&4.0.0";
import { TipsDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/TipsDialog&4.0.0";
export class LoginAccountListComponent extends ViewPU {
    constructor(j95, k95, l95, m95 = -1, n95 = undefined, o95) {
        super(j95, l95, m95, o95);
        if (typeof n95 === "function") {
            this.paramsGenerator_ = n95;
        }
        this.__title = new ObservedPropertyObjectPU("切换账号", this, "title");
        this.__list = new SynchedPropertyObjectOneWayPU(k95.list, this, "list");
        this.onCloseClick = undefined;
        this.onItemClick = undefined;
        this.onDelClick = undefined;
        this.setInitiallyProvidedValue(k95);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(i95: LoginAccountListComponent_Params) {
        if (i95.title !== undefined) {
            this.title = i95.title;
        }
        if (i95.list === undefined) {
            this.__list.set([
                {
                    username: "username1",
                    openid: "id",
                    method: "phone"
                },
                {
                    username: "username2",
                    openid: "id",
                    method: "username"
                },
            ]);
        }
        if (i95.onCloseClick !== undefined) {
            this.onCloseClick = i95.onCloseClick;
        }
        if (i95.onItemClick !== undefined) {
            this.onItemClick = i95.onItemClick;
        }
        if (i95.onDelClick !== undefined) {
            this.onDelClick = i95.onDelClick;
        }
    }
    updateStateVars(h95: LoginAccountListComponent_Params) {
        this.__list.reset(h95.list);
    }
    purgeVariableDependenciesOnElmtId(g95) {
        this.__title.purgeDependencyOnElmtId(g95);
        this.__list.purgeDependencyOnElmtId(g95);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__list.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: ObservedPropertyObjectPU<ResourceStr>;
    get title() {
        return this.__title.get();
    }
    set title(f95: ResourceStr) {
        this.__title.set(f95);
    }
    private __list: SynchedPropertySimpleOneWayPU<Account[]>;
    get list() {
        return this.__list.get();
    }
    set list(e95: Account[]) {
        this.__list.set(e95);
    }
    private onCloseClick?: (event?: ClickEvent) => void;
    private onItemClick?: (item: Account, index: number) => void;
    private onDelClick?: (item: Account, index: number) => void;
    aboutToAppear() {
    }
    close(d95?: ClickEvent) {
        this.onCloseClick?.(d95);
    }
    initialRender() {
        this.observeComponentCreation2((b95, c95) => {
            Stack.create({ alignContent: Alignment.Center });
        }, Stack);
        this.observeComponentCreation2((z94, a95) => {
            Column.create();
            Column.width({ "id": -1, "type": 10002, params: ['app.float.dialog_width'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
            Column.height(260);
            Column.backgroundColor(Color.White);
            Column.borderRadius(6);
        }, Column);
        this.observeComponentCreation2((x94, y94) => {
            __Common__.create();
            __Common__.margin({ top: 4 });
        }, __Common__);
        {
            this.observeComponentCreation2((r94, s94) => {
                if (s94) {
                    let t94 = new HeaderComponent(this, {
                        title: this.title,
                        onClose: (w94) => {
                            this.close(w94);
                        },
                        backVisible: true,
                        closeVisible: false
                    }, undefined, r94, () => { }, { page: "HmsSdk/src/main/ets/pages/LoginAccountListComponent.ets", line: 51, col: 9 });
                    ViewPU.create(t94);
                    let u94 = () => {
                        return {
                            title: this.title,
                            onClose: (v94) => {
                                this.close(v94);
                            },
                            backVisible: true,
                            closeVisible: false
                        };
                    };
                    t94.paramsGenerator_ = u94;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(r94, {
                        title: this.title,
                        backVisible: true,
                        closeVisible: false
                    });
                }
            }, { name: "HeaderComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((p94, q94) => {
            List.create({ space: 8 });
            List.height(-1);
            List.width(-1);
            List.friction(0.7);
            List.padding(8);
            List.scrollBar(BarState.Off);
            List.margin({ left: 15, right: 15, bottom: 10 });
            List.layoutWeight(1);
        }, List);
        this.observeComponentCreation2((r93, s93) => {
            ForEach.create();
            const t93 = (u93, v93: number) => {
                const w93 = u93;
                {
                    const x93 = (n94, o94) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(n94);
                        ListItem.create(z93, true);
                        if (!o94) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const y93 = (l94, m94) => {
                        ListItem.create(z93, true);
                        ListItem.onClick(() => {
                            this.onItemClick?.(w93, v93);
                        });
                    };
                    const z93 = (a94, b94) => {
                        x93(a94, b94);
                        this.observeComponentCreation2((j94, k94) => {
                            Row.create();
                            Row.borderColor("#E2F2F1");
                            Row.borderRadius(4);
                            Row.borderWidth(1);
                        }, Row);
                        this.observeComponentCreation2((h94, i94) => {
                            Image.create(this.getIcon(w93));
                            Image.objectFit(ImageFit.Contain);
                            Image.height(22);
                            Image.margin({ left: 10, right: 8 });
                        }, Image);
                        this.observeComponentCreation2((f94, g94) => {
                            Text.create(Devices.getPhone(w93.username));
                            Text.fontColor({ "id": -1, "type": 10001, params: ['app.color.col_315e5a'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                            Text.layoutWeight(1);
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((c94, d94) => {
                            Image.create({ "id": -1, "type": 20000, params: ['app.media.rx_account_item_del'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                            Image.objectFit(ImageFit.None);
                            Image.width(36);
                            Image.margin({ right: 2 });
                            Image.onClick((e94) => {
                                TipsDialog.getInstance(this.getUIContext()).setConfig({
                                    content: "确定删除该账号？",
                                    onConfirm: () => {
                                        this.onDelClick?.(w93, v93);
                                        this.list.splice(v93, 1);
                                    }
                                }).show();
                            });
                        }, Image);
                        Row.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(y93, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(r93, this.list, t93, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        Column.pop();
        Stack.pop();
    }
    private getIcon(q93: Account) {
        if (Devices.isValidEmail(q93.username)) {
            return { "id": -1, "type": 20000, params: ['app.media.rx_ico_captchacode3'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ };
        }
        else if (Devices.isValidPhoneNumber(q93.username)) {
            return { "id": -1, "type": 20000, params: ['app.media.rx_ico_captchacode'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ };
        }
        else {
            return { "id": -1, "type": 20000, params: ['app.media.rx_ico_username'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ };
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "LoginAccountListComponent";
    }
}
registerNamedRoute(() => new LoginAccountListComponent(undefined, {}), "", { bundleName: __BUNDLE_NAME__, moduleName: __MODULE_NAME__, pagePath: "HmsSdk/src/main/ets/pages/LoginAccountListComponent", pageFullPath: "", integratedHsp: "__harDefaultIntegratedHspType__", moduleType: "byteCodeHar" });
