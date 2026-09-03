import window from '@ohos.window';
import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { SetToGlobalThis, TuanjiePlayer, TuanjieLog } from 'tuanjieLib';
import { launchAcceleration } from '@kit.GraphicsAccelerateKit';

export default class TuanjiePlayerAbility extends UIAbility {
  private defaultPageUri: string = "pages/Index"
  private tuanjiePlayer : TuanjiePlayer = TuanjiePlayer.getInstance()
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    this.setConfig();
    this.registerHmsAbility();
    this.tuanjiePlayer.onCreate(this.context, want, launchParam);
  }

  onDestroy(): void {
    this.tuanjiePlayer.onDestroy();
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    windowStage.loadContent(this.defaultPageUri, (err: ESObject, data: ESObject) => {
        if (err.code) {
          TuanjieLog.error('Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
          return;
        }
        TuanjieLog.info('Succeeded in loading the content. Data: %{public}s', JSON.stringify(data) ?? '');
      });
    this.tuanjiePlayer.onWindowStageCreate(windowStage)
  }

  onWindowStageWillDestroy(): void {
    this.tuanjiePlayer.onWindowStageWillDestroy();
  }
  
  onWindowStageDestroy(): void {
    this.tuanjiePlayer.onWindowStageDestroy()
  }

  onForeground(): void {
    this.tuanjiePlayer.onForeground()
  }

  onBackground(): void {
    this.tuanjiePlayer.onBackground()
  }

  onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    this.tuanjiePlayer.onNewWant(want,launchParam)
  }

  setConfig(): void {
    SetToGlobalThis("staticSplashScreenFit", $r('app.integer.StaticSplashScreenFit'));
    SetToGlobalThis("appSplash", $r('app.media.app_splash'));
    SetToGlobalThis("showStaticSplash",$r('app.integer.ShowStaticSplashScreen'));
  }

  private registerHmsAbility() {
    SetToGlobalThis("isLaunchSnapshotEnabled", this.isLaunchSnapshotEnabled);
  }

  private isLaunchSnapshotEnabled(): boolean {
    let enable = false;
    if (canIUse("SystemCapability.GraphicsGame.LaunchAcceleration")) {
      enable = launchAcceleration.isLaunchMirrorEnabled();
      TuanjieLog.info(`launchAcceleration isLaunchMirrorEnabled enable = ${enable}`);
    }
    return enable;
  }
}
