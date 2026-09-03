import fs from '@ohos.file.fs';
import { NearbyLog } from './NearbyLog';


export class DataUtil {
  static toMB(size: number): string {
    return (size / 1024 / 1024).toFixed(2);
  }

  static getFolderSize(dirPath: string): number {
    let totalSize = 0;
    try {
      // 获取目录下所有文件项
      const files = fs.listFileSync(dirPath);
      files.forEach((file: string) => {
        const fullPath = `${dirPath}${dirPath.endsWith('/') ? '' : '/'}${file}`;
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // 递归计算子目录
          totalSize += DataUtil.getFolderSize(fullPath);
        } else {
          // 累加文件大小
          totalSize += stat.size;
        }
      });
    } catch (e) {
      NearbyLog.error(`Error calculating folder size: ${e.message}`);
    }
    return totalSize;
  }
}