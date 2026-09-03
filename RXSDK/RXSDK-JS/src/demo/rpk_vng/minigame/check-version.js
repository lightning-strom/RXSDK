/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/naming-convention */
let { version, SDKVersion } = wx.getAppBaseInfo();
const { platform, system } = wx.getDeviceInfo();
const isTCSAS = typeof __wxConfig?.nativeSDKVersion !== 'undefined';
const accountInfo = wx.getAccountInfoSync();
const envVersion = accountInfo?.miniProgram?.envVersion;

function compareVersion(a, b) {
  // Returns true if a >= b, otherwise false.
  if (a == null) return b == null;
  if (b == null) return true;

  a = String(a);
  b = String(b);

  const split = (v) => {
    const idx = v.indexOf('-');
    return {
      main: idx === -1 ? v : v.substring(0, idx),
      build: idx === -1 ? null : v.substring(idx + 1)
    };
  };

  const verA = split(a);
  const verB = split(b);

  const numsA = verA.main.split('.').map(n => parseInt(n, 10) || 0);
  const numsB = verB.main.split('.').map(n => parseInt(n, 10) || 0);

  for (let i = 0; i < Math.max(numsA.length, numsB.length); i++) {
    const numA = numsA[i] || 0;
    const numB = numsB[i] || 0;
    if (numA > numB) return true;
    if (numA < numB) return false;
  }

  if (verA.build === null && verB.build !== null) return false;
  if (verA.build !== null && verB.build === null) return true;

  if (verA.build && verB.build) {
    const getBuildNumber = (build) => {
      const match = build.match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };

    const buildNumA = getBuildNumber(verA.build);
    const buildNumB = getBuildNumber(verB.build);

    if (buildNumA > buildNumB) return true;
    if (buildNumA < buildNumB) return false;

    const isSnapshotA = verA.build.toUpperCase().includes('SNAPSHOT');
    const isSnapshotB = verB.build.toUpperCase().includes('SNAPSHOT');

    if (!isSnapshotA && isSnapshotB) return true;
    if (isSnapshotA && !isSnapshotB) return false;

    return verA.build >= verB.build;
  }

  return true; // Versions are equal or both builds are null
}

export const isPc = platform === 'windows' || platform === 'mac';
export const isIOS = platform === 'ios';
export const isAndroid = platform === 'android';
export const isDevtools = platform === 'devtools';
export const isMobile = !isPc && !isDevtools;
export const isDevelop = envVersion === 'develop';

version = (isTCSAS && isMobile) ? __wxConfig.nativeSDKVersion : version;
const gameSDKVersion = (isTCSAS && isMobile) && __wxConfig.gameSDKVersion;

// 是否禁止**开通了高性能模式**的小游戏在不支持的iOS设备上回退成普通模式，回退可能导致无法正常体验游戏
// @ts-ignore
const disableHighPerformanceFallback = false && isIOS;
// 是否iOS高性能模式
export const isH5Renderer = GameGlobal.isIOSHighPerformanceMode;
// 操作系统版本号
const systemVersionArr = system ? system.split(' ') : [];
const systemVersion = systemVersionArr.length ? systemVersionArr[systemVersionArr.length - 1] : '';
// pc微信版本号不一致，需要>=3.3
const isPcWeChatVersionValid = compareVersion(version, '3.3');
// 支持unity小游戏，需要基础库>=2.14.0，但低版本基础库iOS存在诸多问题，将版本最低版本提高到2.17.0
// tcsas 支持unity小游戏，需要基础库>=2.2.15
const isLibVersionValid = isTCSAS ? compareVersion(SDKVersion, '2.3.2') : compareVersion(SDKVersion, '2.17.0');
// 如果是iOS高性能模式，基础库需要>=2.23.1
// tcsas 支持iOS高性能模式，需要基础库>=2.2.10
const isH5LibVersionValid = isTCSAS ? compareVersion(SDKVersion, '2.2.10') : compareVersion(SDKVersion, '2.23.1');
// 压缩纹理需要iOS系统版本>=14.0，检测到不支持压缩纹理时会提示升级系统
const isIOSH5SystemVersionValid = compareVersion(systemVersion, '14.0');
// iOS系统版本>=15支持webgl2，高性能模式+无此系统要求
const isIOSWebgl2SystemVersionValid = compareVersion(systemVersion, '15.0') || GameGlobal.isIOSHighPerformanceModePlus;
// Android客户端版本>=8.0.19支持webgl2
// tcsas Android sdk版本>=2.2.0支持webgl2
const isAndroidWebGL2ClientVersionValid = isTCSAS ? compareVersion(version, '2.2.0') : compareVersion(version, '8.0.19');
// 是否用了webgl2
const isWebgl2 = () => GameGlobal.managerConfig.contextConfig.contextType === 2;
// 是否支持BufferURL
// tcsas 支持BufferURL，需要基础库>=2.2.14
export const isSupportBufferURL = !isPc
    && (isH5Renderer
        ? (isTCSAS ? (compareVersion(SDKVersion, '2.2.14') && typeof wx.createBufferURL === 'function') : compareVersion(SDKVersion, '2.29.1') && compareVersion(version, '8.0.30'))
        : typeof wx.createBufferURL === 'function');
// 安卓innerAudio支持playbackRate
// todo: tcsas Android sdk版本>=2.2.15 innerAudio支持playbackRate（暂未支持）
export const isSupportPlayBackRate = !isAndroid || (isTCSAS ? compareVersion(version, '3.1.1') : compareVersion(version, '8.0.23'));
// IOS innerAudio支持复用时再次触发onCanplay
// tcsas iOS sdk版本>=2.2.0 innerAudio支持复用innerAudio
export const isSupportCacheAudio = !isIOS || (isTCSAS ? compareVersion(version, '2.2.0') : compareVersion(version, '8.0.31'));
// 安卓旧客户端版本innerAudio偶现会导致闪退，大于等于8.0.38才使用innerAudio减少内存
// tcsas Android sdk版本>=2.2.0 支持innerAudio
export const isSupportInnerAudio = isTCSAS ? compareVersion(version, '2.2.0') : compareVersion(version, '8.0.38');
// 检查是否支持brotli压缩，pc基础库>=2.29.2，真机基础库>=2.21.1
// tcsas 支持brotli压缩,基础库>=2.2.12
// @ts-ignore
const isPcBrotliInvalid = isPc && !compareVersion(SDKVersion, true ? '2.29.2' : '2.32.3');
const isMobileBrotliInvalid = isTCSAS ? !compareVersion(SDKVersion, '2.2.12') : !compareVersion(SDKVersion, '2.21.1');
// @ts-ignore
const isBrotliInvalid = false && (isPcBrotliInvalid || isMobileBrotliInvalid);
// iOS系统版本>=17.5时，小游戏退后台会导致异常
export const isIOS175 = compareVersion(systemVersion, '17.5') || isH5Renderer;
// 是否能以iOS高性能模式运行
// 请勿修改GameGlobal.canUseH5Renderer赋值！！！
GameGlobal.canUseH5Renderer = isH5Renderer && isH5LibVersionValid;
// iOS高性能模式定期GC
GameGlobal.canUseiOSAutoGC = isH5Renderer && compareVersion(SDKVersion, '2.32.1') && !isTCSAS;
// pc微信版本不满足要求
const isPcInvalid = isPc && !isPcWeChatVersionValid;
// 移动设备基础库版本或客户端版本不支持运行unity小游戏
const isMobileInvalid = isMobile && !isLibVersionValid;
// 基础库/客户端不支持iOS高性能模式
const isIOSH5Invalid = (isH5Renderer && !isH5LibVersionValid) || (!isH5Renderer && disableHighPerformanceFallback);
// 是否支持VideoPlayer组件，注意：开发者工具需要1.06.2310312以上版本
// todo 更新支持videoPlayer 的基础库版本
export const isSupportVideoPlayer = (isIOS && compareVersion(SDKVersion, '3.1.1')) || (isAndroid && compareVersion(SDKVersion, '3.0.0')) || ((isPc || isDevtools) && compareVersion(SDKVersion, '3.2.1'));
// 视情况添加，没用到对应能力就不需要判断
// 是否支持webgl2
const isWebgl2SystemVersionInvalid = () => isWebgl2() && ((!isIOSWebgl2SystemVersionValid && isIOS) || (isAndroid && !isAndroidWebGL2ClientVersionValid));
// IOS高性能模式2.25.3以上基础库需要手动启动webAudio
// todo 更新支持webAudio的基础库版本
export const webAudioNeedResume = compareVersion(SDKVersion, '3.3.0') && isH5Renderer;
// 满足iOS高性能条件，但未开通高性能模式
const needToastEnableHpMode = isDevelop && isIOS && isH5LibVersionValid && isIOSH5SystemVersionValid && !isH5Renderer;
// 判断游戏扩展库SDK版本，是否支持 Unity
const isUnityInvalid = (isTCSAS && isMobile) ? !compareVersion(gameSDKVersion, '2.3.3') || !compareVersion(version, '2.3.3') : true;
/**
 * 判断环境是否可使用coverview
 * coverview实际需要基础库版本>=2.16.1，但因为移动端要>=2.17.0才能运行，所以移动端基本都支持coverview
 *
 * @export
 * @returns
 */
export function canUseCoverview() {
    return isMobile || isDevtools;
}

const canUseI18n = isTCSAS && compareVersion(SDKVersion, '2.3.2');
if (needToastEnableHpMode) {
    const message = canUseI18n
        ? __SYSTEM_I18N_FN__('highPerformanceModeSuggestion')
        : '[开发版提示]建议: 此AppID未开启高性能模式\n高性能模式开通\n可大幅提升游戏运行性能';
    console.error(message);
    // setTimeout(() => {
    //   wx.showModal({
    //     title: '[开发版提示]建议',
    //     content: '此AppID未开通高性能模式\n请前往mp后台-能力地图-开发提效包-高性能模式开通\n可大幅提升游戏运行性能',
    //     showCancel: false,
    //   })
    // }, 10000);
}
// @ts-ignore
if (isIOS && typeof 0 === 'number' && 0 > 0) {
    // @ts-ignore
    window.devicePixelRatio = 0;
}
else if (isPc) {
    try {
        if (window.devicePixelRatio < 2) {
            window.devicePixelRatio = 2;
        }
    }
    catch (e) {
        console.warn(e);
    }
}
export default () => new Promise((resolve) => {
    if (!isDevtools) {
        if (isPcInvalid
            || isUnityInvalid
            || isMobileInvalid
            || isIOSH5Invalid
            || isWebgl2SystemVersionInvalid()
            || isBrotliInvalid) {
            const getTextSet = () => {
                if (canUseI18n) {
                    return {
                        updateAppContent: __SYSTEM_I18N_FN__('updateAppContent'),
                        updateSystemContent: __SYSTEM_I18N_FN__('updateSystemContent'),
                        title: __SYSTEM_I18N_FN__('title'),
                        updateButton: __SYSTEM_I18N_FN__('updateButton'),
                        confirmButton: __SYSTEM_I18N_FN__('confirmButton'),
                    };
                }
                if (isTCSAS) {
                    return {
                        updateAppContent: 'The current app version is too old.\nPlease update the app to continue.',
                        updateSystemContent: 'The current OS version is too old.\nPlease update your iOS system to continue.',
                        title: 'Tip',
                        updateButton: 'Update App',
                        confirmButton: 'OK',
                    };
                }
                return {
                    updateAppContent: '当前APP版本过低\n请更新APP后进行游戏',
                    updateSystemContent: '当前操作系统版本过低\n请更新iOS系统后进行游戏',
                    title: '提示',
                    updateButton: '更新APP',
                    confirmButton: '确定',
                };
            };
            const i18n = getTextSet();

            let updateWechat = true;
            let content = i18n.updateAppContent;
            if (isIOS) {
                if (!isIOSH5SystemVersionValid || (isWebgl2SystemVersionInvalid() && isIOS)) {
                    content = i18n.updateSystemContent;
                    updateWechat = false;
                }
            }
            wx.showModal({
                title: i18n.title,
                content,
                showCancel: false,
                confirmText: updateWechat ? i18n.updateButton : i18n.confirmButton,
                success(res) {
                    if (res.confirm) {
                        const showUpdateWechat = updateWechat && typeof wx.createBufferURL === 'function' && !isTCSAS;
                        if (showUpdateWechat) {
                            wx.updateWeChatApp();
                        }
                        else {
                            wx.exitMiniProgram({
                                success: () => { },
                            });
                        }
                    }
                },
            });
            return resolve(false);
        }
    }
    return resolve(true);
});
