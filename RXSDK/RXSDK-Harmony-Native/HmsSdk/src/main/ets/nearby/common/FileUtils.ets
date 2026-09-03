import fs, { ListFileOptions } from '@ohos.file.fs';

import { common } from '@kit.AbilityKit';
import { GlobalData } from './GlobalData';
import { BusinessError } from "@kit.BasicServicesKit"
import { NearbyLog } from './NearbyLog';
import { TransferDialogManager } from '../dialog/TransferDialogManager';
import { taskpool } from '@kit.ArkTS';
import { NearbyTransferService } from '../NearbyTransferService';

// export function copyRawDirToSandbox(context: common.UIAbilityContext) {
//   LogUtil.info("rawfile拷贝...")
//   ExtractRawFiles(context, "Data/StreamingAssets", context.filesDir);
//   LogUtil.info("rawfile拷贝成功")
// }



export function copyStorageDir(fileStoragePath?: string) {
  if (!fileStoragePath) {
    return;
  }
  let abilityContext: ESObject = globalThis.AbilityContext;
  let context = abilityContext as common.UIAbilityContext;

  let listFileOption: ListFileOptions = {
    recursion: false,
    listNum: 0,
  }
  let dir = fs.listFileSync(fileStoragePath, listFileOption);
  NearbyLog.info(" 接收到文件夹有=" + JSON.stringify(dir));
  for (let i = 0; i < dir.length; i++) {
    let srcPath: string = `${fileStoragePath}/${dir[i]}`
    let destPath: string = `${context.filesDir}/${dir[i]}`
    NearbyLog.info(`从${srcPath} 拷贝到${destPath}`)
    if (!fs.accessSync(destPath)) {
      NearbyLog.info(`${destPath} 无法访问,需要创建该目录`);
      fs.mkdirSync(destPath, true);
    }
    fs.copyDir(srcPath, destPath, 0).then(() => {
      NearbyLog.info(`文件夹${destPath}拷贝完成`);
    })
  }
}

/**
 * 传输成功后从storagePath传输到 context 路径
 *
 * @param fileStoragePath
 */
export function copyStoragePath(fileStoragePath?: string) {
  if (!fileStoragePath) {
    return;
  }

  let listFileOption: ListFileOptions = {
    recursion: true,
    listNum: 0,
  }

  let files = fs.listFileSync(fileStoragePath, listFileOption);
  NearbyLog.info(" 接收到文件数量有=" + files.length);

  let abilityContext: ESObject = globalThis.AbilityContext;
  let context = abilityContext as common.UIAbilityContext;

  GlobalData.progressValue = 0;
  GlobalData.progressTotal = files.length;
  copyFilesWithSingleBatch(fileStoragePath, files, context.filesDir)
}

async function copyFilesWithSingleBatch(fileStoragePath: string, files: string[], contextFileDir: string) {
  let srcPaths: string[] = files.map(file => `${fileStoragePath}${file}`)
  let destPaths: string[] = files.map(file => `${contextFileDir}${file}`)
  GlobalData.progressTotal = srcPaths.length;

  let task: taskpool.Task = new taskpool.Task(copyFileBatchTask, srcPaths, destPaths);


  task.onReceiveData((current: number) => {
    if (current != GlobalData.progressTotal && current % 1024 != 0) {
      return;
    }
    let res = Math.trunc(current / GlobalData.progressTotal * 100);
    let msg = ` 文件搬迁中, ${current}/${GlobalData.progressTotal}`

    TransferDialogManager.getInstance()?.updateDialogInfo(msg, false, res, 100);
    //接受回调结果
  })
  taskpool.execute(task).then(() => {
    NearbyLog.info("全部拷贝完成");
    // 对receive缓存中的文件进行清理
    NearbyTransferService.getInstance().destroy().then(() => {
      TransferDialogManager.getInstance()?.updateDialogInfo("传输完成，请重启", true, 0, 0);
    })
  })
}

@Concurrent
function copyFileBatchTask(srcFilesBatch: string[], destFilesBatch: string[]) {
  let value = 0;

  for (let i = 0; i < srcFilesBatch.length; i++) {
    const srcPath = srcFilesBatch[i];
    const destPath = destFilesBatch[i];
    try {
      let dirPath = destPath.substring(0, destPath.lastIndexOf('/'));
      if (dirPath && !fs.accessSync(dirPath)) {
        fs.mkdirSync(dirPath, true);
      }
      fs.copyFileSync(srcPath, destPath, 0);
      value++;
      taskpool.Task.sendData(value);
    } catch (error) {
      let errMsg = `文件复制失败 ${srcPath}-> ${destPath} err=${error}`
      NearbyLog.error(errMsg);
    }
  }
}


/**
 * 列举沙箱目录文件
 * @param filesDir
 */
export function getListFile(filesDir: string) {
  let listFileOption: ListFileOptions = {
    recursion: true,
    listNum: 0,
    filter: {
      fileSizeOver: 0
    }
  }
  let files = fs.listFileSync(filesDir, listFileOption);
  let str: string = ``;
  let array: string[] = [];
  for (let i = 0; i < files.length; i++) {
    str = str + `${filesDir}${files[i]}` + "\n";
    array[i] = `${filesDir}${files[i]}`;
    // LogUtil.info(" 文件： " + array[i])
  }
  let curVersion = GlobalData.version
  GlobalData.versionMap.set(curVersion,
    (GlobalData.versionMap.get(curVersion) || []).concat(array)
  )
  NearbyLog.info("获取文件列表，总文件数=" + JSON.stringify(array.length))
}


export function getTotalSize() {
  let totalSize = 0;
  let files = GlobalData.versionMap.get(GlobalData.version);
  files.forEach((file: string) => {
    const stat = fs.statSync(file);
    // 累加文件大小
    totalSize += stat.size;
  })
  return totalSize;
}

export function getSandboxFileContent(path: string): string {
  let abilityContext: ESObject = globalThis.AbilityContext;
  let context = abilityContext as common.UIAbilityContext;
  let filePath = context.filesDir + path;

  try {
    let content = fs.readTextSync(filePath);
    return content;
  } catch (err) {
    NearbyLog.info("读取失败=" + err + "filePath=" + filePath);
  }
  return "";
}