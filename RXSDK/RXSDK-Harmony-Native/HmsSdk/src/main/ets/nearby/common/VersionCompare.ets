import { bundleManager, common } from "@kit.AbilityKit";
import { getSandboxFileContent } from "./FileUtils";
import { GlobalData } from "./GlobalData";
import { NearbyLog } from "./NearbyLog";

export function compareVersion(inputVersion: string): number {
  let currentVersion = getVersionName();

  if (currentVersion === "" ) {
    return -1;
  }

  // 分割版本号为数字数组
  const currentParts = currentVersion.split('.').map(part => parseInt(part));
  const inputParts = inputVersion.split('.').map(part => parseInt(part));

  // 校验前三位是否存在且一致
  if (currentParts.length < 3 || inputParts.length < 3) return -1;
  for (let i = 0; i < 3; i++) {
    if (currentParts[i] !== inputParts[i]) return -1;
  }

  // 比较后续版本分段
  const maxLength = Math.max(currentParts.length, inputParts.length);
  for (let i = 3; i < maxLength; i++) {
    const currVal = i < currentParts.length ? currentParts[i] : 0;
    const inputVal = i < inputParts.length ? inputParts[i] : 0;

    if (currVal > inputVal) return -1;
    else if (currVal < inputVal) return 1;
  }
  return 0;
}

interface VersionInfo {
  MajorVersion: string;
  MinorVersion:string;
  FixVersion:string;
  BuildVersion:string;
}

export function getVersionName() : string {
  try {
    let versionContent = getSandboxFileContent(GlobalData.versionFilePath);
    let versionInfo: VersionInfo = JSON.parse(versionContent);
    let versionStr =
      `${versionInfo.MajorVersion}.${versionInfo.MinorVersion}.${versionInfo.FixVersion}.${versionInfo.BuildVersion}`;
    NearbyLog.info(" 获取本机资源版本号=" + versionStr);
    return versionStr;
  } catch(err) {
    NearbyLog.info(" 获取版本名称错误" + err);
  }
  return "";
}

export function parseVersionNameFromUri(uri: string): string | null {
  const queryStartIndex = uri.indexOf('?');
  if (queryStartIndex === -1) return null;

  const querySegment = uri.substring(queryStartIndex + 1);
  const params = querySegment.split('&');

  for (const param of params) {
    const pairs = param.split('=');
    if (pairs[0] === 'versionName') {
      return pairs[1];
    }
  }
  return null;
}
