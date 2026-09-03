// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
import type { TransferParams } from './TransferParams';
import { NearbyLog } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/NearbyLog&4.0.0";
import app from "@normalized:N&&&hmssdk/src/main/ets/utils/App&4.0.0";
import type common from "@ohos:app.ability.common";
export function buildText(c51: TransferParams, d51 = null) {
    const e51 = c51;
    (d51 ? d51 : this).observeComponentCreation2((j52, k52, l52 = e51) => {
        Row.create();
        Row.height('100%');
        Row.width('100%');
        Row.justifyContent(FlexAlign.Center);
    }, Row);
    (d51 ? d51 : this).observeComponentCreation2((g52, h52, i52 = e51) => {
        Row.create();
        Row.focusable(false);
        Row.justifyContent(FlexAlign.Center);
        Row.backgroundColor(Color.White);
        Row.padding({ left: 10, right: 10 });
        Row.height(50);
        Row.borderRadius(24);
        Row.zIndex(99);
    }, Row);
    (d51 ? d51 : this).observeComponentCreation2((u51, v51, w51 = e51) => {
        If.create();
        if (!w51.isTransferred) {
            (d51 ? d51 : this).ifElseBranchUpdateFunction(0, () => {
                (d51 ? d51 : this).observeComponentCreation2((d52, e52, f52 = e51) => {
                    Progress.create({ value: f52.transferredData, total: f52.totalData, type: ProgressType.Ring });
                    Progress.width(20);
                    Progress.height(20);
                    Progress.color(Color.Blue);
                    Progress.style({ strokeWidth: 3 });
                    Progress.margin({ left: 0, right: 10 });
                }, Progress);
            });
        }
        else if (w51.isTransferred) {
            (d51 ? d51 : this).ifElseBranchUpdateFunction(1, () => {
                (d51 ? d51 : this).observeComponentCreation2((a52, b52, c52 = e51) => {
                    Column.create();
                    Column.borderRadius('100%');
                    Column.margin({ left: 10, right: 10 });
                    Column.alignItems(HorizontalAlign.Center);
                    Column.justifyContent(FlexAlign.Center);
                    Column.width(20);
                    Column.height(20);
                }, Column);
                (d51 ? d51 : this).observeComponentCreation2((x51, y51, z51 = e51) => {
                    SymbolGlyph.create({ "id": -1, "type": 40000, params: ['sys.symbol.checkmark_circle'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                    SymbolGlyph.fontSize(20);
                    SymbolGlyph.renderingStrategy(SymbolRenderingStrategy.SINGLE);
                    SymbolGlyph.fontColor([Color.Green]);
                }, SymbolGlyph);
                Column.pop();
            });
        }
        else {
            this.ifElseBranchUpdateFunction(2, () => {
            });
        }
    }, If);
    If.pop();
    (d51 ? d51 : this).observeComponentCreation2((r51, s51, t51 = e51) => {
        Text.create(t51.text);
        Text.fontSize(14);
    }, Text);
    Text.pop();
    (d51 ? d51 : this).observeComponentCreation2((f51, g51, h51 = e51) => {
        If.create();
        if (!h51.isTransferred) {
            (d51 ? d51 : this).ifElseBranchUpdateFunction(0, () => {
                (d51 ? d51 : this).observeComponentCreation2((o51, p51, q51 = e51) => {
                    Column.create();
                    Column.borderRadius('100%');
                    Column.backgroundColor('#5b808081');
                    Column.margin({ left: 10 });
                    Column.onClick(() => {
                        NearbyLog.info(" 关闭按钮已点击");
                        q51.closeCallback?.();
                    });
                    Column.alignItems(HorizontalAlign.Center);
                    Column.justifyContent(FlexAlign.Center);
                    Column.width(20);
                    Column.height(20);
                }, Column);
                (d51 ? d51 : this).observeComponentCreation2((l51, m51, n51 = e51) => {
                    SymbolGlyph.create({ "id": -1, "type": 40000, params: ['sys.symbol.xmark'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ });
                    SymbolGlyph.fontSize(12);
                    SymbolGlyph.renderingStrategy(SymbolRenderingStrategy.SINGLE);
                    SymbolGlyph.fontColor([Color.White, Color.Green, Color.White]);
                }, SymbolGlyph);
                Column.pop();
            });
        }
        else {
            (d51 ? d51 : this).ifElseBranchUpdateFunction(1, () => {
                (d51 ? d51 : this).observeComponentCreation2((i51, j51, k51 = e51) => {
                    Button.createWithLabel("重启");
                    Button.fontSize(12);
                    Button.onClick(() => {
                        NearbyLog.info(" 用户点击了重启");
                        app.reboot(getContext() as common.UIAbilityContext);
                    });
                    Button.margin({ left: 10, right: 10 });
                    Button.width(60);
                    Button.height(30);
                }, Button);
                Button.pop();
            });
        }
    }, If);
    If.pop();
    Row.pop();
    Row.pop();
}
