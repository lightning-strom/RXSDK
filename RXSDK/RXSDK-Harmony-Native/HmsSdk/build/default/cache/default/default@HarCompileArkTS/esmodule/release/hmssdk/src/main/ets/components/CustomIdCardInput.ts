// @keepTs
// @ts-nocheck
if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CustomIdCardInput_Params {
    controller?: CustomDialogController;
    textInputCont?: TextInputController;
    showFlag?: Visibility;
}
import { IdCardKeyboard } from "@normalized:N&&&hmssdk/src/main/ets/components/IdCardKeyboard&4.0.0";
import { EKeyType } from "@normalized:N&&&hmssdk/src/main/ets/components/KeyboardDefine&4.0.0";
import type { IKeyAttribute } from "@normalized:N&&&hmssdk/src/main/ets/components/KeyboardDefine&4.0.0";
export class CustomIdCardInput extends ViewPU {
    constructor(y27, z27, a28, b28 = -1, c28 = undefined, d28) {
        super(y27, a28, b28, d28);
        if (typeof c28 === "function") {
            this.paramsGenerator_ = c28;
        }
        this.controller = undefined;
        this.textInputCont = new TextInputController();
        this.__showFlag = new ObservedPropertySimplePU(Visibility.Visible, this, "showFlag");
        this.setInitiallyProvidedValue(z27);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(x27: CustomIdCardInput_Params) {
        if (x27.controller !== undefined) {
            this.controller = x27.controller;
        }
        if (x27.textInputCont !== undefined) {
            this.textInputCont = x27.textInputCont;
        }
        if (x27.showFlag !== undefined) {
            this.showFlag = x27.showFlag;
        }
    }
    updateStateVars(w27: CustomIdCardInput_Params) {
    }
    purgeVariableDependenciesOnElmtId(v27) {
        this.__showFlag.purgeDependencyOnElmtId(v27);
    }
    aboutToBeDeleted() {
        this.__showFlag.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private controller: CustomDialogController;
    setController(u27: CustomDialogController) {
        this.controller = u27;
    }
    private textInputCont: TextInputController;
    private __showFlag: ObservedPropertySimplePU<Visibility>;
    get showFlag() {
        return this.__showFlag.get();
    }
    set showFlag(t27: Visibility) {
        this.__showFlag.set(t27);
    }
    cancel() {
        this.showFlag = Visibility.Hidden;
        setTimeout(() => {
            this.controller.close();
        }, 300);
    }
    initialRender() {
        this.observeComponentCreation2((r27, s27) => {
            Column.create();
            Column.visibility(this.showFlag);
            Column.transition(TransitionEffect
                .move(TransitionEdge.BOTTOM)
                .animation({ duration: 300, curve: Curve.FastOutSlowIn }));
        }, Column);
        {
            this.observeComponentCreation2((l27, m27) => {
                if (m27) {
                    let n27 = new IdCardKeyboard(this, {
                        inputValue: "",
                        onKeyboardEvent: (q27: IKeyAttribute) => {
                            switch (q27.type) {
                                case EKeyType.COMPLETE:
                                    this.cancel();
                                    break;
                                case EKeyType.CANCEL:
                                    this.cancel();
                                    break;
                                case EKeyType.INPUT:
                                    console.log(JSON.stringify(q27));
                                    break;
                            }
                        },
                        placeholder: "请输入...",
                        controller: this.textInputCont
                    }, undefined, l27, () => { }, { page: "HmsSdk/src/main/ets/components/CustomIdCardInput.ets", line: 21, col: 7 });
                    ViewPU.create(n27);
                    let o27 = () => {
                        return {
                            inputValue: "",
                            onKeyboardEvent: (p27: IKeyAttribute) => {
                                switch (p27.type) {
                                    case EKeyType.COMPLETE:
                                        this.cancel();
                                        break;
                                    case EKeyType.CANCEL:
                                        this.cancel();
                                        break;
                                    case EKeyType.INPUT:
                                        console.log(JSON.stringify(p27));
                                        break;
                                }
                            },
                            placeholder: "请输入...",
                            controller: this.textInputCont
                        };
                    };
                    n27.paramsGenerator_ = o27;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(l27, {});
                }
            }, { name: "IdCardKeyboard" });
        }
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
