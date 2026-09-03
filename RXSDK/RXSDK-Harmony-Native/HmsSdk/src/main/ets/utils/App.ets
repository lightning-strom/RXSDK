import { bundleManager, common, OpenLinkOptions, Want } from "@kit.AbilityKit";
import { BusinessError } from "@kit.BasicServicesKit";
import { url } from "@kit.ArkTS";
import { Logger } from "./Logger";
import { PushManager } from "../base/PushManager";

export class App {
  private _want?: Want = undefined;

  public get want(): Want | undefined {
    return this._want;
  }

  get bundleInfo(): bundleManager.BundleInfo {
    return bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION)
  }

  get info(): bundleManager.ApplicationInfo {
    return this.bundleInfo.appInfo;
  }

  get signInfo() {
    const data: bundleManager.BundleInfo = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_SIGNATURE_INFO);
    return data.signatureInfo
  }

  get name() {
    return getContext().resourceManager.getStringSync(this.info.labelId)
  }

  get bundleName() {
    return this.info.name
  }

  get versionName() {
    return this.bundleInfo.versionName
  }

  get versionCode() {
    return this.bundleInfo.versionCode
  }

  get uiAbilityContext(): common.UIAbilityContext {
    return getContext() as common.UIAbilityContext
  }

  // const RESULT_CODE: number = 1001;
  //        let abilityResult: common.AbilityResult = {
  //          resultCode: RESULT_CODE,
  //          want: {
  //            bundleName: 'com.samples.stagemodelabilitydevelop',
  //            moduleName: 'entry', // moduleName非必选
  //            abilityName: 'FuncAbilityB',
  //            parameters: {
  //              info: '来自FuncAbility Index页面'
  //            },
  //          },
  //        };
  terminateSelf(abilityResult?: common.AbilityResult): Promise<void> {
    // try {
    if (abilityResult) {
      return this.uiAbilityContext?.terminateSelfWithResult(abilityResult);
    } else {
      return this.uiAbilityContext?.terminateSelf();
    }

    // } catch (err) {
    //   // 捕获同步的参数错误
    //   let code = (err as BusinessError).code;
    //   let message = (err as BusinessError).message;
    //   console.error(`terminateSelf failed, code is ${code}, message is ${message}`);
    // }
  }

  reboot(context: common.UIAbilityContext) {
    try {
      const bundleName: string = this.bundleName;
      const abilityName: string = context.abilityInfo.name;
      let want: Want = {
        bundleName: bundleName,
        abilityName: abilityName,
        parameters: {
          '__app_restart': true
        }
      };

      context.terminateSelf(() => {
        // 在终止回调中重新启动
        context.startAbility(want).catch((err: BusinessError) => {
          console.error(`Restart failed: ${err.code}, ${err.message}`);
        });
      });
    } catch (error) {
      console.error(`Restart failed: ${error.code}, ${error.message}`);
    }
  }

  // let wantInfo: Want = {
  //   // uncomment line below if wish to implicitly query only in the specific bundle.
  //   // bundleName: 'com.example.myapplication',
  //   action: 'ohos.want.action.viewData',
  //   // entities can be omitted.
  //   entities: ['entity.system.browsable'],
  //   uri: 'https://www.test.com:8080/query/student'
  // }
  // let wantInfo: Want = {
  //         deviceId: '', // deviceId为空表示本设备
  //         bundleName: 'com.samples.myapplication',
  //         moduleName: 'entry', // moduleName非必选
  //         abilityName: 'FuncAbilityA',
  //         parameters: { // 自定义信息
  //           info: '来自EntryAbility Page_UIAbilityComponentsInteractive页面'
  //         },
  //       }
  startAbility(want: Want): Promise<void> {
    return this.uiAbilityContext.startAbility(want).then(() => {
      console.error('startAbility successfully.');
    }).catch((err: BusinessError) => {
      console.error(`Failed to startAbility. Code: ${err.code}, message: ${err.message}`);
    })
  }

  tryStartAbility(want: Want): Promise<boolean> {
    return this.uiAbilityContext.startAbility(want).then(() => {
      console.error('startAbility successfully.');
      return true;
    }).catch((err: BusinessError) => {
      console.error(`Failed to startAbility. Code: ${err.code}, message: ${err.message}`);
      return false;
    })
  }

  startBrowser(url: string): Promise<void> {
    let want: Want = {
      action: 'ohos.want.action.viewData',
      entities: ['entity.system.browsable'],
      uri: url
    };
    return this.startAbility(want)
  }

  tryStartBrowser(url: string): Promise<boolean> {
    let want: Want = {
      action: 'ohos.want.action.viewData',
      entities: ['entity.system.browsable'],
      uri: url
    };
    return this.tryStartAbility(want)
  }


  // const link = 'https://appgallery.huawei.com/app/detail?id=com.huawei.hmsapp.books';
  openLink(link: string, appLinkingOnly?: boolean, parameters?: Record<string, Object>, context?: common.UIAbilityContext): Promise<number> {
    const openLinkOptions: OpenLinkOptions = {
      appLinkingOnly: appLinkingOnly,
      parameters: parameters
    };
    // try {
    context ??= this.uiAbilityContext

    return new Promise<number>((resolve, reject) => {
      context?.openLink(link, openLinkOptions, (err: BusinessError, result: common.AbilityResult) => {
        resolve(err?.code || result.resultCode)
        // if (result.resultCode === 200) {
        // }
      })
    })

    //
    // .then(() => {
    //   console.info('openlink success.');
    // })
    // .catch((error: BusinessError) => {
    //   console.error(`openlink failed. error:${JSON.stringify(error)}`);
    // });

    // } catch (e) {
    //   console.log(`exception occured, errCode ${JSON.stringify(e.code)}`);
    // }

  }

  canOpenLink(link: string) {
    // let link = 'ruixue://sdk';
    let canOpen = bundleManager.canOpenLink(link);
    return canOpen;
  }

  handleWant(want: Want) {
    this._want = want
    try {
      let uri = want.uri;
      if (uri) {
        Logger.d("want.uri:" + uri); // Print "https://appgallery.huawei.com/app/detail?id=com.huawei.hmsapp.books"
        const urlObject = url.URL.parseURL(uri); // Parse the urlObject from the uri for convenient parameter acquisition.
        const params = urlObject.params; // Obtain parameters from the urlObject.
        const id = params.get('id'); // Obtain the parameter id in the uri. After execution, the id is com.huawei.hmsapp.books.
        Logger.d("want.url.params:" + JSON.stringify(params));
      }
      if (want?.parameters) {
        Logger.d("want.parameters:" + JSON.stringify((want.parameters)));
        if (want.parameters.debug_enable) {
          Logger.logEnable = Boolean(want.parameters.debug_enable)
        }
        if (want.parameters.task_id) {
          PushManager.getInstance().reportNotifyStatus(want.parameters["task_id"] as string, 3)
        }
      }
    } catch (e) {
      Logger.e(e)
    }
  }
}

const app = new App();

export default app;

// export { appInstance as AppAlias };
