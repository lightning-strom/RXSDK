import AbilityConstant from '@ohos.app.ability.AbilityConstant';
import hilog from '@ohos.hilog';
import UIAbility from '@ohos.app.ability.UIAbility';
import Want from '@ohos.app.ability.Want';
import window from '@ohos.window';
import { NearbyTransferService, RXApi, OpenInstall } from 'hmssdk';
import { OpenInstallPlugin } from '@ruixue/rxsdk_openinstall'

OpenInstallPlugin.install();

let TAG = 'testTag'

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onCreate');
    // systemShare.getSharedData(want).then((data: systemShare.SharedData) => {
    //   data.getRecords().forEach((record: systemShare.SharedRecord) => {
    //     // 处理分享数据
    //     console.error(`getSharedData: ${JSON.stringify(record)} `);
    //   });
    // })
    //   .catch((error: BusinessError) => {
    //     console.error(`Failed to getSharedData. Code: ${error.code}, message: ${error.message}`);
    //     // this.context.terminateSelf();
    //   });

    RXApi.getInstance().onCreate(this.context, want, launchParam)

  }

  onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    super.onNewWant(want, launchParam);
    RXApi.getInstance().onNewWant(this.context, want, launchParam)

  }

  onCollaborate(wantParam: Record<string, Object>): AbilityConstant.CollaborateResult {
    NearbyTransferService.acceptCollaboration(wantParam);
    return AbilityConstant.CollaborateResult.ACCEPT;
  }

  onDestroy(): void {
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onDestroy');

  }

  onWindowStageCreate(windowStage: window.WindowStage): void {

    // Main window is created, set main page for this ability
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageCreate');
    windowStage.loadContent('pages/Main', (err, data) => {
      // windowStage.loadContent('pages/NearbyDemo', (err, data) => {
      if (err.code) {
        hilog.error(0x0000, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
        return;
      }
      hilog.info(0x0000, 'testTag', 'Succeeded in loading the content. Data: %{public}s', JSON.stringify(data) ?? '');
    });

    // RXApi.getInstance().onWindowStageCreate(windowStage)

  }


  onWindowStageDestroy(): void {
    // Main window is destroyed, release UI related resources
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
  }

  onForeground(): void {
    // Ability has brought to foreground
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onForeground');
  }

  onBackground(): void {
    // Ability has back to background
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onBackground');
  }
}
