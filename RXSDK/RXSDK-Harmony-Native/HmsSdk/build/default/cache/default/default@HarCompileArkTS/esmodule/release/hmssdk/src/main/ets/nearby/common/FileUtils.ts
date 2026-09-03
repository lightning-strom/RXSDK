// @keepTs
// @ts-nocheck
import fs from "@ohos:file.fs";
import type { ListFileOptions } from "@ohos:file.fs";
import type common from "@ohos:app.ability.common";
import { GlobalData } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/GlobalData&4.0.0";
import { NearbyLog } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/NearbyLog&4.0.0";
import { TransferDialogManager } from "@normalized:N&&&hmssdk/src/main/ets/nearby/dialog/TransferDialogManager&4.0.0";
import taskpool from "@ohos:taskpool";
import { NearbyTransferService } from "@normalized:N&&&hmssdk/src/main/ets/nearby/NearbyTransferService&4.0.0";
export function copyStorageDir(l49?: string) {
    if (!l49) {
        return;
    }
    let m49: any = globalThis.AbilityContext;
    let n49 = m49 as common.UIAbilityContext;
    let o49: ListFileOptions = {
        recursion: false,
        listNum: 0,
    };
    let p49 = fs.listFileSync(l49, o49);
    NearbyLog.info(" 接收到文件夹有=" + JSON.stringify(p49));
    for (let q49 = 0; q49 < p49.length; q49++) {
        let r49: string = `${l49}/${p49[q49]}`;
        let s49: string = `${n49.filesDir}/${p49[q49]}`;
        NearbyLog.info(`从${r49} 拷贝到${s49}`);
        if (!fs.accessSync(s49)) {
            NearbyLog.info(`${s49} 无法访问,需要创建该目录`);
            fs.mkdirSync(s49, true);
        }
        fs.copyDir(r49, s49, 0).then(() => {
            NearbyLog.info(`文件夹${s49}拷贝完成`);
        });
    }
}
export function copyStoragePath(g49?: string) {
    if (!g49) {
        return;
    }
    let h49: ListFileOptions = {
        recursion: true,
        listNum: 0,
    };
    let i49 = fs.listFileSync(g49, h49);
    NearbyLog.info(" 接收到文件数量有=" + i49.length);
    let j49: any = globalThis.AbilityContext;
    let k49 = j49 as common.UIAbilityContext;
    GlobalData.progressValue = 0;
    GlobalData.progressTotal = i49.length;
    copyFilesWithSingleBatch(g49, i49, k49.filesDir);
}
async function copyFilesWithSingleBatch(v48: string, w48: string[], x48: string) {
    let y48: string[] = w48.map(f49 => `${v48}${f49}`);
    let z48: string[] = w48.map(e49 => `${x48}${e49}`);
    GlobalData.progressTotal = y48.length;
    let a49: taskpool.Task = new taskpool.Task(copyFileBatchTask, y48, z48);
    a49.onReceiveData((b49: number) => {
        if (b49 != GlobalData.progressTotal && b49 % 1024 != 0) {
            return;
        }
        let c49 = Math.trunc(b49 / GlobalData.progressTotal * 100);
        let d49 = ` 文件搬迁中, ${b49}/${GlobalData.progressTotal}`;
        TransferDialogManager.getInstance()?.updateDialogInfo(d49, false, c49, 100);
    });
    taskpool.execute(a49).then(() => {
        NearbyLog.info("全部拷贝完成");
        NearbyTransferService.getInstance().destroy().then(() => {
            TransferDialogManager.getInstance()?.updateDialogInfo("传输完成，请重启", true, 0, 0);
        });
    });
}
function copyFileBatchTask(m48: string[], n48: string[]) {
    "use concurrent";
    let o48 = 0;
    for (let p48 = 0; p48 < m48.length; p48++) {
        const q48 = m48[p48];
        const r48 = n48[p48];
        try {
            let u48 = r48.substring(0, r48.lastIndexOf('/'));
            if (u48 && !fs.accessSync(u48)) {
                fs.mkdirSync(u48, true);
            }
            fs.copyFileSync(q48, r48, 0);
            o48++;
            taskpool.Task.sendData(o48);
        }
        catch (s48) {
            let t48 = `文件复制失败 ${q48}-> ${r48} err=${s48}`;
            NearbyLog.error(t48);
        }
    }
}
export function getListFile(f48: string) {
    let g48: ListFileOptions = {
        recursion: true,
        listNum: 0,
        filter: {
            fileSizeOver: 0
        }
    };
    let h48 = fs.listFileSync(f48, g48);
    let i48: string = ``;
    let j48: string[] = [];
    for (let l48 = 0; l48 < h48.length; l48++) {
        i48 = i48 + `${f48}${h48[l48]}` + "\n";
        j48[l48] = `${f48}${h48[l48]}`;
    }
    let k48 = GlobalData.version;
    GlobalData.versionMap.set(k48, (GlobalData.versionMap.get(k48) || []).concat(j48));
    NearbyLog.info("获取文件列表，总文件数=" + JSON.stringify(j48.length));
}
export function getTotalSize() {
    let b48 = 0;
    let c48 = GlobalData.versionMap.get(GlobalData.version);
    c48.forEach((d48: string) => {
        const e48 = fs.statSync(d48);
        b48 += e48.size;
    });
    return b48;
}
export function getSandboxFileContent(v47: string): string {
    let w47: any = globalThis.AbilityContext;
    let x47 = w47 as common.UIAbilityContext;
    let y47 = x47.filesDir + v47;
    try {
        let a48 = fs.readTextSync(y47);
        return a48;
    }
    catch (z47) {
        NearbyLog.info("读取失败=" + z47 + "filePath=" + y47);
    }
    return "";
}
