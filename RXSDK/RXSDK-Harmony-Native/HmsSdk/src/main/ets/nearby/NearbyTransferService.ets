import { common, abilityAccessCtrl, Want } from "@kit.AbilityKit";
import { GlobalData } from "./common/GlobalData";
import { gameNearbyTransfer } from "@kit.GameServiceKit";
import { BusinessError, deviceInfo } from "@kit.BasicServicesKit"

import { compareVersion, parseVersionNameFromUri } from "./common/VersionCompare";

import { TransferDialogManager } from "./dialog/TransferDialogManager";
import { NearbyLog } from "./common/NearbyLog";
import Objects from "../utils/Objects";
import { ErrorReport } from "../base/ErrorReport";
import Devices from "../utils/Devices";

/**
 * 附近传输服务事件类型枚举
 * 定义了所有可能触发的事件类型，覆盖初始化、连接、发现、传输、错误等场景
 */
export enum NearbyEventType {
  /** 初始化事件：服务初始化完成/失败时触发 */
  init = "init",
  /** 连接通知事件：设备连接状态变化时触发（如连接成功、断开等） */
  connectNotify = "connectNotify",
  /** 发现事件：发送端执行附近设备发现操作时触发 */
  discovery = "discovery",
  /** 错误事件：服务运行过程中出现错误时触发 */
  error = "error",
  /** 传输通知事件：数据传输状态变化时触发（如开始传输、传输完成等） */
  transferNotify = "transferNotify",
  /** 传输数据包事件：接收到或发送数据包时触发 */
  transferPackageData = "transferPackageData",
  /** 接收包信息事件：收到其他设备发送的包信息时触发 */
  receivePackageInfo = "receivePackageInfo",
  /** 回复包信息结果事件：回复包信息后的结果回调 */
  replyPackageInfoResult = "replyPackageInfoResult",
  /** 发送包信息事件：发送包信息操作触发 */
  sendPackageInfo = "sendPackageInfo",
  /** 销毁事件：服务销毁时触发 */
  destroy = "destroy",
  /** 自动绑定附近游戏事件：触发自动绑定附近游戏逻辑时回调 */
  autoBindNearbyGame = "autoBindNearbyGame",
  /** 发布附近游戏事件：发布游戏到附近设备时触发 */
  publishNearbyGame = "publishNearbyGame",
  /** 绑定附近游戏事件：主动绑定附近游戏时触发 */
  bindNearbyGame = "bindNearbyGame",

}

/**
 * 事件回调参数接口
 * 所有 NearbyEventType 事件触发时传递的参数结构
 */
interface EventArgs {

  /** 事件类型，对应 NearbyEventType 枚举值 */
  type: NearbyEventType;

  /** 事件附带数据，可选，根据不同事件类型携带不同业务数据 */
  data?: ESObject;

  /** 状态码：0 表示成功，非 0 表示错误码 */
  code: number;

  /** 事件描述信息：错误时为错误提示，成功时可为空 */
  message?: string;
}

type NearbyEvent = (params: EventArgs) => void;


export class NearbyTransferService {
  private static instance: NearbyTransferService;
  private static _isSender: boolean;
  private uiContext?: UIContext;
  private _isNearbyServiceInitted: boolean = false;
  private _isConnected: boolean = false;
  private _initParam?: gameNearbyTransfer.CreateParameters;
  private static _connectionId: string = "";

  public get isConnected(): boolean {
    return this._isConnected;
  }

  public get isNearbyServiceInitted(): boolean {
    return this._isNearbyServiceInitted;
  }

  public static get isServer(): boolean {
    return !NearbyTransferService._isSender;
  }

  public static get isSender(): boolean {
    return NearbyTransferService._isSender;
  }

  public constructor() {
  }

  public static getInstance(): NearbyTransferService {
    if (!NearbyTransferService.instance) {
      NearbyTransferService.instance = new NearbyTransferService()
    }
    return NearbyTransferService.instance;
  }

  public static isSupport(): boolean {
    if (deviceInfo.sdkApiVersion < 18) {
      let msg = `API is supported since SDK version 5.1.0(18). However, the current compatible SDK version is ${deviceInfo.sdkApiVersion}`
      NearbyLog.error(msg)
      return false
    } else {
      return true
    }
  }

  static report(event: string, e: BusinessError | gameNearbyTransfer.ReturnResult, req?: object, ext?: object) {
    NearbyLog.error(event, JSON.stringify(e), req, ext)
    ErrorReport.report(Objects.assign({
      error_code: e.code,
      error_msg: e.message,
      request_body: req,
      trace_id: NearbyTransferService._connectionId,
      error_action: "rxlog_error_nearby_" + event,
    }, e, ext))
  }

  private _toCallback(event: EventArgs): Array<ESObject> {
    return [JSON.stringify(event)]
  }

  // 创建游戏近场快传服务
  public async create(uiContext: UIContext, initParam?: gameNearbyTransfer.CreateParameters, event?: NearbyEvent): Promise<Array<ESObject>> {
    this.uiContext = uiContext;
    if (!NearbyTransferService.isSupport()) {
      let msg = `API is supported since SDK version 5.1.0(18). However, the current compatible SDK version is ${deviceInfo.sdkApiVersion}`
      let ea: EventArgs = { type: NearbyEventType.init, code: -1, message: msg }
      event?.(ea)
      NearbyTransferService.report(NearbyEventType.init, ea, initParam)
      return Promise.reject(ea)
    }
    if (!uiContext) {
      let ea: EventArgs = { type: NearbyEventType.init, code: -1, message: "uicontext is null" }
      event?.(ea)
      NearbyTransferService.report(NearbyEventType.init, ea, initParam)
      return Promise.reject(ea)
    }
    let uiAbilityContext = uiContext?.getHostContext() as common.UIAbilityContext;
    initParam ??= this._initParam || {
      abilityName: uiAbilityContext.abilityInfo.name,
      moduleName: uiAbilityContext.abilityInfo.moduleName,
      // needShowSystemUI: true,
      // mode: gameNearbyTransfer.Mode.KNOCK
    };
    this._initParam = initParam
    NearbyLog.info("init nearby service ", initParam)
    if (initParam.needShowSystemUI) {
      initParam.context = uiAbilityContext;
    }

    try {
      const createResult = await gameNearbyTransfer.create(initParam);
      NearbyLog.info("init success:", createResult);
      this._isNearbyServiceInitted = true;
      NearbyTransferService._connectionId = Devices.genUUID()
      let ea: EventArgs = { type: NearbyEventType.init, code: 0, data: createResult }
      event?.(ea);
      return this._toCallback(ea);

    } catch (err) {
      const businessError = err as BusinessError;
      NearbyTransferService.report(NearbyEventType.init, err, initParam)
      let ea: EventArgs = {
        type: NearbyEventType.init,
        code: businessError.code ?? -1,
        message: businessError.message
      }
      event?.(ea);
      return Promise.reject(ea);
    }
  }


  /**
   * 注册附近传输服务的全局事件回调函数
   * @description 统一监听所有 NearbyEventType 类型的事件通知，包括服务初始化、设备连接、数据传输、错误等场景；
   *              注册后底层原生事件（如 connectNotify、transferNotify、receivePackageInfo、error）会转换为统一的 EventArgs 格式回调，简化事件处理逻辑
   * @param event - 全局事件回调函数（可选），若不传则停止接收事件通知
   *                回调参数为 EventArgs 类型，包含：
   *                - event: 事件类型（NearbyEventType 枚举值）
   *                - code: 状态码（0 表示成功，非 0 为错误码）
   *                - data: 事件附加数据（根据事件类型不同，可能为 DiscoveryResult、ConnectNotification 等类型）
   *                - message: 事件描述信息（错误时为具体原因，成功时可为空）
   * @note  建议仅注册一次；若需移除回调，调用 unregisterCallback
   */
  public registerCallback(event?: NearbyEvent): Promise<Array<ESObject>> {
    return new Promise((resolve) => {
      gameNearbyTransfer.on('connectNotify', async (connection: gameNearbyTransfer.ConnectNotification) => {
        connection["isSender"] = NearbyTransferService.isSender
        NearbyLog.info("connectNotify=" + JSON.stringify(connection))
        this._isConnected = connection.connectState == gameNearbyTransfer.ConnectState.CONNECTED
        if (!this._isConnected) {
          NearbyTransferService.report(NearbyEventType.connectNotify, { code: connection.connectState, message: connection.message }, connection)
        }
        let ea: EventArgs = {
          code: connection.connectState,
          type: NearbyEventType.connectNotify,
          data: { remoteDeviceName: connection.remoteDeviceName, isSender: NearbyTransferService.isSender },
          message: connection.message
        }
        event?.( ea)
        resolve(this._toCallback(ea))
      });
      //2
      gameNearbyTransfer.on('receivePackageInfo', (packageData: gameNearbyTransfer.PackageInfo) => {

        NearbyLog.info("receivePackageInfo=" + JSON.stringify(packageData))
        let ea: EventArgs = { code: 0, type: NearbyEventType.receivePackageInfo, data: packageData }
        event?.( ea)

        resolve(this._toCallback(ea))
      })

      gameNearbyTransfer.on('transferNotify', (packageData: gameNearbyTransfer.TransferNotification) => {
        let ea: EventArgs = { code: 0, type: NearbyEventType.transferNotify, data: packageData }
        event?.(ea)
        resolve(this._toCallback(ea))
      });

      //3
      gameNearbyTransfer.on('error', (err: gameNearbyTransfer.ReturnResult) => {
        NearbyTransferService.report("error", err)
        let ea: EventArgs = { code: err.code ?? -1, message: err.message, type: NearbyEventType.error }
        event?.(ea)
        resolve(this._toCallback(ea))
      });
      NearbyLog.info("registerCallback called")
    })
  }

  /**
   * 注销附近传输服务的所有事件监听
   * @description 移除底层 `gameNearbyTransfer` 相关原生事件（如连接通知、传输通知、错误等）的监听函数，
   *              停止接收各类事件回调，避免内存泄漏或无效的事件处理
   * @note 该方法会注销所有已注册的原生事件监听，调用后 `registerCallback` 注册的全局回调将不再生效；
   *       若需重新接收事件，需再次调用 `registerCallback`
   * @throws 内部捕获事件注销过程中的异常并记录日志，不会向外抛出错误
   */
  public unregisterCallback() {
    try {
      gameNearbyTransfer.off('connectNotify');
      gameNearbyTransfer.off('receivePackageInfo');
      gameNearbyTransfer.off('transferNotify');
      gameNearbyTransfer.off('discovery');
      gameNearbyTransfer.off('error');
    } catch (error) {
      NearbyTransferService.report("error", error)
      NearbyLog.error(error)
    }
  }

  /**
   * 发布近场快传服务，使当前设备可被附近设备发现并建立连接
   * @param event - 事件回调函数，用于接收发布过程中的状态通知（如发布成功/失败、设备发现等事件）
   *                回调参数为 EventArgs 类型，包含事件类型、状态码、数据及错误信息等
   * @returns Promise<void> - 异步发布操作的结果，无返回值（失败时会抛出异常或通过event回调错误）
   * @description 该方法会启动设备的可发现性，允许附近设备搜索并连接当前设备的近场快传服务，
   *              通常在作为服务端/发送端时调用，发布成功后会触发 `NearbyEventType.publishNearbyGame` 事件
   */
  public async publishNearbyGame(event?: NearbyEvent): Promise<Array<ESObject>> {
    try {
      if (!this._isNearbyServiceInitted) {
        // 务必保证初始化与后续的 publish 的次序，create 同步结束后才可以发布服务
        NearbyLog.info("NearbyTransferService未初始化，正在初始化。。。");
        await this.create(this.uiContext!);
      }
      let uiAbilityContext: common.UIAbilityContext = this.uiContext?.getHostContext() as common.UIAbilityContext
      let atManager = abilityAccessCtrl.createAtManager();
      await atManager.requestPermissionsFromUser(uiAbilityContext, ['ohos.permission.DISTRIBUTED_DATASYNC'])
      await gameNearbyTransfer.publishNearbyGame()
      NearbyTransferService._isSender = false;
      NearbyLog.info("publishNearbyGame success ")
      let ea: EventArgs = { type: NearbyEventType.publishNearbyGame, code: 0 }
      event?.(ea)
      return this._toCallback(ea)

    } catch (e) {
      NearbyTransferService.report(NearbyEventType.publishNearbyGame, e)
      let ea: EventArgs = { type: NearbyEventType.publishNearbyGame, code: e.code ?? -1, message: e.message }
      event?.(ea)
      return this._toCallback(ea)
    }
  }

  /**
   * 自动绑定已发现的附近设备
   * @param event - 事件回调函数，用于接收自动绑定过程中的状态通知（如绑定成功/失败、设备信息等事件）
   *                回调参数为 EventArgs 类型，包含事件类型（autoBindNearbyGame）、状态码、设备数据及错误信息等
   * @returns Promise<void> - 异步绑定操作的结果，无返回值（失败时会通过event回调错误或抛出异常）
   * @description 该方法会自动筛选已发现的附近设备列表，选择匹配的设备完成绑定流程，无需手动指定设备ID；
   *              绑定成功后会触发 `NearbyEventType.autoBindNearbyGame` 事件，携带绑定设备的详细信息；
   *              若未发现可绑定设备或绑定失败，会通过事件回调返回错误码及原因
   */
  public async autoBindNearbyGame(event?: NearbyEvent): Promise<Array<ESObject>> {
    try {
      if (!this._isNearbyServiceInitted) {
        // 务必保证初始化与后续的 publish 的次序，create 同步结束后才可以发布服务
        NearbyLog.info("NearbyTransferService未初始化，正在初始化。。。");
        await this.create(this.uiContext!);
      }


      let atManager = abilityAccessCtrl.createAtManager();
      let uiAbilityContext = this.uiContext?.getHostContext() as common.UIAbilityContext;
      await atManager.requestPermissionsFromUser(uiAbilityContext, ['ohos.permission.DISTRIBUTED_DATASYNC'])
      await gameNearbyTransfer.autoBindNearbyGame()
      let ea: EventArgs = { type: NearbyEventType.autoBindNearbyGame, code: 0 }
      event?.(ea)
      return this._toCallback(ea)

    } catch (e) {
      NearbyTransferService.report(NearbyEventType.autoBindNearbyGame, e)
      let ea: EventArgs = { type: NearbyEventType.autoBindNearbyGame, code: e.code ?? -1, message: e.message }
      event?.(ea)
      return this._toCallback(ea)
    }
  }

  /**
   * 手动触发附近设备发现操作
   * @param event - 事件回调函数，用于接收发现过程中的状态通知（如发现结果、错误信息等）
   *                回调参数为 EventArgs 类型：
   *                - 事件类型为 `NearbyEventType.discovery` 时，表示发现成功，`data` 字段为 `DiscoveryResult` 类型（包含已发现设备列表）；
   *                - 事件类型为 `NearbyEventType.error` 时，表示发现失败，`data` 字段包含错误详情。
   * @returns Promise<void> - 异步发现操作的结果，无返回值
   * @description 该方法会主动扫描附近开启近场快传服务的设备，扫描完成后通过事件回调返回发现结果：
   *              1. 发现成功：触发 `NearbyEventType.discovery` 事件，`data` 携带 `DiscoveryResult`（含 `nearbyGameDevices` 设备列表）；
   *              2. 发现失败：触发 `NearbyEventType.error` 事件，返回错误码及原因（如权限不足、设备不支持、服务未初始化等）。
   */
  public async discovery(event?: NearbyEvent): Promise<Array<ESObject>> {
    try {
      if (!this._isNearbyServiceInitted) {
        // 务必保证初始化与后续的 publish 的次序，create 同步结束后才可以发布服务
        NearbyLog.info("NearbyTransferService未初始化，正在初始化。。。");
        await this.create(this.uiContext!);
      }
      return new Promise((resolve) => {
        gameNearbyTransfer.off("discovery")
        gameNearbyTransfer.on("discovery", (device: gameNearbyTransfer.DiscoveryResult) => {
          NearbyLog.info("发现设备:", (device))
          let ea: EventArgs = { type: NearbyEventType.discovery, code: 0, data: device }
          event?.(ea)
          resolve(this._toCallback(ea))
        });
        gameNearbyTransfer.discoveryNearbyGame().catch((e: BusinessError) => {

          NearbyTransferService.report(NearbyEventType.discovery, e)
          let ea: EventArgs = { type: NearbyEventType.discovery, code: e.code ?? -1, message: e.message }
          event?.(ea)
          resolve(this._toCallback(ea))
        }).then(() => {
          NearbyLog.info("正在发现设备...");
        })
      })
    } catch (e) {
      event?.(e)
      return this._toCallback(e)
    }
  }

  /**
   * 绑定指定的近场快传服务设备
   * @description 与指定的附近游戏设备建立绑定关系，完成设备间的连接配对，
   *              绑定成功后可进行数据传输、协作等操作
   * @param deviceInfo - 待绑定的设备信息对象（类型为 gameNearbyTransfer.NearbyGameDevice）
   * @param deviceInfo.deviceId - 设备唯一标识ID
   *   - 类型：string
   *   - 约束：字符长度范围 [1, 128]，超出范围将导致绑定失败
   *   - 说明：由设备发现阶段（discovery）返回的唯一设备标识
   * @param deviceInfo.networkId - 设备网络标识ID
   *   - 类型：string
   *   - 约束：字符长度范围 [1, 128]，超出范围将导致绑定失败
   *   - 说明：设备在近场网络中的标识，与deviceId共同确保绑定设备的准确性
   * @param event - 事件回调函数，用于接收绑定过程中的状态通知
   *                回调参数为 EventArgs 类型：
   *                - 事件类型为 `NearbyEventType.bindNearbyGame` 时，表示绑定结果通知；
   *                - 事件类型为 `NearbyEventType.error` 时，表示绑定失败，包含错误码及原因
   * @returns Promise<void> - 异步绑定操作的结果，无返回值
   */
  public async bindNearbyGame(deviceInfo: gameNearbyTransfer.NearbyGameDevice, event?: NearbyEvent): Promise<Array<ESObject>> {
    try {
      if (!this._isNearbyServiceInitted) {
        // 务必保证初始化与后续的 publish 的次序，create 同步结束后才可以发布服务
        NearbyLog.info("NearbyTransferService未初始化，正在初始化。。。");
        await this.create(this.uiContext!);
      }
      let bindInfo: gameNearbyTransfer.BindParameters = {
        deviceId: deviceInfo.deviceId,
        networkId: deviceInfo.networkId
      }
      let atManager = abilityAccessCtrl.createAtManager();
      let uiAbilityContext = this.uiContext?.getHostContext() as common.UIAbilityContext;
      NearbyLog.info("bindNearbyGame:" + JSON.stringify(bindInfo));

      await atManager.requestPermissionsFromUser(uiAbilityContext, ['ohos.permission.DISTRIBUTED_DATASYNC'])

      await gameNearbyTransfer.bindNearbyGame(bindInfo)
      let ea: EventArgs = { type: NearbyEventType.bindNearbyGame, code: 0, data: deviceInfo }
      event?.(ea)
      return this._toCallback(ea)
    } catch (e) {
      let ea: EventArgs = { type: NearbyEventType.bindNearbyGame, code: e.code ?? -1, message: e.message }
      event?.(ea)

      NearbyTransferService.report(NearbyEventType.bindNearbyGame, e)
      return this._toCallback(ea)
    }
  }

  /**
   * 处理协作请求（需在 UIAbility 的 onCollaborate 生命周期函数中调用）
   * @description 接收并处理外部设备发起的协作请求，完成协作参数解析、设备绑定及协作流程初始化，
   *              通常与系统协作机制联动，由 UIAbility 的 onCollaborate 生命周期触发调用
   * @param acceptParameters - 协作请求参数（来自系统传递的 wantParam）
   *                           包含协作所需的设备信息、请求类型等关键数据，结构为键值对形式
   * @returns Promise<void> - 异步协作处理结果，无返回值（处理结果通过事件回调反馈）
   * @example
  * // 在 UIAbility 中集成调用示例
   * onCollaborate(wantParam: Record<string, Object>): AbilityConstant.CollaborateResult {
   *   // 异步处理协作请求（不阻塞生命周期返回）
   *   NearbyTransferService.acceptCollaboration(wantParam).catch(err => {
   *     LogUtil.error("协作请求处理失败：", err);
   *   });
   *   // 同步返回接受协作的结果给系统
   *   return AbilityConstant.CollaborateResult.ACCEPT;
   * }
   */
  public static acceptCollaboration(acceptParameters: Record<string, object>) {
    if (NearbyTransferService.isSupport()) {
      gameNearbyTransfer.acceptCollaboration(acceptParameters).then(() => {
        NearbyLog.info("gameNearbyTransfer acceptCollaboration success");
        // event?.({ event: NearbyEventType.acceptCollaboration, code: 0 })
      }).catch((e: BusinessError) => {
        NearbyTransferService.report("acceptCollaboration", e)
        NearbyLog.error("gameNearbyTransfer acceptCollaboration failed:", e);
        // event?.({ event: NearbyEventType.acceptCollaboration, code: e.code, message: e.message })
      })
    }
  }


  /**
   * 接收端向发送端发送自身的文件包信息
   * @description 接收端主动将本地的文件包元信息（如名称、版本、文件列表等）发送给已连接的发送端，
   *              用于发送端确认接收端的文件状态，以便进行后续的文件传输或同步操作
   * @param packageInfo - 文件包信息对象（类型为 gameNearbyTransfer.PackageInfo），包含文件包的名称、版本、文件列表等元数据
   *                      具体字段包括：
   *                      - name?: string：文件包名称
   *                      - version?: string：文件包版本
   *                      - files?: Array<FileInfo>：文件列表（含文件路径、哈希值）
   *                      - extraData?: string：额外附加数据
   * @param event - 事件回调函数，用于接收发送结果通知
   *                回调参数为 EventArgs 类型：
   *                - 事件类型为 `NearbyEventType.sendPackageInfo` 时，表示发送结果；
   *                - 事件类型为 `NearbyEventType.error` 时，表示发送失败，包含错误码及原因
   * @returns Promise<void> - 异步发送操作的结果，无返回值
   * @note 需在设备成功连接（`isConnected` 为 true）后调用，否则会触发错误事件；
   */
  public async sendPackageInfo(packageInfo: gameNearbyTransfer.PackageInfo, event?: NearbyEvent): Promise<Array<ESObject>> {
    try {
      if (!this._isConnected) {
        NearbyLog.error("nearby service not connected ");
        NearbyTransferService.report(NearbyEventType.sendPackageInfo, { code: 1, message: "nearby service not connected" })
        let ea: EventArgs = { type: NearbyEventType.sendPackageInfo, code: 1, message: "nearby service not connected" }
        event?.(ea)
        return this._toCallback(ea)
      }
      NearbyLog.info("sendPackageInfo packageInfo = ", packageInfo);
      await gameNearbyTransfer.sendPackageInfo(packageInfo)
      let ea: EventArgs = { type: NearbyEventType.sendPackageInfo, code: 0 }
      event?.(ea)
      return this._toCallback(ea)
    } catch (e) {
      NearbyLog.error(JSON.stringify(e))
      NearbyTransferService.report(NearbyEventType.sendPackageInfo, e)
      let ea: EventArgs = { type: NearbyEventType.sendPackageInfo, code: e.code ?? -1, message: e.message }
      event?.(ea)
      return this._toCallback(ea)
    }
  }

  /**
   * 发送端向近场快传服务上报文件包信息对比结果
   * @description 发送端接收接收端的文件包信息后，进行版本或内容对比，将对比结果上报给近场快传服务，
   *              服务根据该结果决定后续的文件传输策略（如是否需要发送差异文件、全量文件等）
   * @param packageInfoResult - 文件包信息对比结果对象（类型为 gameNearbyTransfer.PackageInfoResult），包含：
   *                            - packageInfoResultCode: PackageInfoResultCode 枚举值（对比结果码，如可用/不可用/错误）
   *                            - message?: string：对比结果描述信息（可选）
   * @param event - 事件回调函数，用于接收上报结果通知
   *                回调参数为 EventArgs 类型：
   *                - 事件类型为 `NearbyEventType.replyPackageInfoResult` 时，表示上报成功；
   *                - 事件类型为 `NearbyEventType.error` 时，表示上报失败，包含错误码及原因
   * @returns Promise<void> - 异步上报操作的结果，无返回值
   * @note 需在发送端角色（`isSender` 为 true）且已获取接收端文件包信息后调用；
   *       对比结果码（PackageInfoResultCode）包含：ERROR(-1)、PACKAGE_AVAILABLE_COMPARED(0)、PACKAGE_UNAVAILABLE_COMPARED(1)
   */
  public async replyPackageInfoResult(packageInfoResult: gameNearbyTransfer.PackageInfoResult, event?: NearbyEvent): Promise<Array<ESObject>> {
    try {
      await gameNearbyTransfer.replyPackageInfoResult(packageInfoResult)
      let ea: EventArgs = { type: NearbyEventType.replyPackageInfoResult, code: 0 }
      event?.(ea)
      return this._toCallback(ea)
    } catch (e) {
      NearbyTransferService.report(NearbyEventType.replyPackageInfoResult, e)
      let ea: EventArgs = { type: NearbyEventType.replyPackageInfoResult, code: e.code ?? -1, message: e.message }
      event?.(ea)
      return this._toCallback(ea)
    }
  }

  /**
   * 开始传输包数据
   * @description 用于启动近场包数据传输，可指定包名、版本号及传输文件列表，并通过回调监听传输事件
   * @param package - 传输的包数据信息对象
   * @param package.name - 包名（可选参数，但若使用则为必填项）
   *   - 类型：string
   *   - 约束：字符长度范围 [0, 2048]，超出范围可能导致传输失败
   *   - 说明：标识传输包的名称，为空字符串时表示不指定具体名称
   * @param package.version - 版本号（可选参数，但若使用则为必填项）
   *   - 类型：string
   *   - 约束：字符长度范围 [0, 256]，超出范围可能导致传输失败
   *   - 说明：传输包的版本标识，用于区分不同版本的包数据
   * @param package.files - 传输文件列表（可选参数）
   *   - 类型：Array<PackageFile>
   *   - 约束：最多包含10000条文件记录，超出数量限制会触发异常
   *   - 说明：需传输的文件集合，为空时表示仅传输包元数据（名称、版本号）
   * @param event - 传输事件回调（可选）
   *   - 类型：NearbyEvent
   *   - 说明：用于监听传输过程中的事件（如开始、进度、完成、失败等），可获取实时状态
   */
  public async transferPackageData(packageData: gameNearbyTransfer.PackageData, event?: NearbyEvent): Promise<Array<ESObject>> {
    try {
      if (!this._isConnected) {
        NearbyLog.error("nearby service not connected ");
        NearbyTransferService.report(NearbyEventType.transferPackageData, { code: 1, message: "nearby service not connected" })
        let ea: EventArgs = { type: NearbyEventType.transferPackageData, code: 1, message: "nearby service not connected" }
        event?.(ea)
        return this._toCallback(ea)
      }
      NearbyLog.info("transferPackageData data = " + JSON.stringify(packageData));
      await gameNearbyTransfer.transferPackageData(packageData)
      let ea: EventArgs = { type: NearbyEventType.transferPackageData, code: 0 }
      event?.(ea)
      return this._toCallback(ea)
    } catch (e) {
      NearbyTransferService.report(NearbyEventType.transferPackageData, e)
      let ea: EventArgs = { type: NearbyEventType.transferPackageData, code: e.code ?? -1, message: e.message }
      event?.(ea)
      NearbyLog.error(JSON.stringify(e))
      return this._toCallback(ea)
    }

  }

  /**
   * 销毁游戏近场快传服务实例
   * @description 释放近场快传服务占用的系统资源（如连接、监听、线程等），终止所有正在进行的传输或发现操作；
   *              服务销毁后无法再使用相关功能，需重新调用 `create` 方法初始化才能再次使用
   * @param event - 事件回调函数，用于接收销毁操作的状态通知
   *                回调参数为 EventArgs 类型：
   *                - 事件类型为 `NearbyEventType.destroy` 时，表示销毁成功；
   *                - 事件类型为 `NearbyEventType.error` 时，表示销毁失败，包含错误码及原因
   * @returns Promise<void> - 异步销毁操作的结果，无返回值
   * @note 建议在服务不再使用时（如页面退出、应用后台）调用，避免资源泄漏；
   *       销毁后 `isNearbyServiceInitted` 状态会置为 `false`，需重新初始化
   */
  public async destroy(event?: NearbyEvent): Promise<Array<ESObject>> {
    try {
      this.unregisterCallback()
      this._isNearbyServiceInitted = false;
      this._isConnected = false;
      NearbyTransferService._connectionId = ""
      GlobalData.reset()
      await gameNearbyTransfer.destroy()
      NearbyLog.info("gameNearbyTransfer destroy success");
      let ea: EventArgs = { type: NearbyEventType.destroy, code: 0 }
      event?.(ea)
      return this._toCallback(ea)
    } catch (err) {
      console.error(`gameNearbyTransfer destroy failed: ${err.message}`);
      NearbyTransferService.report(NearbyEventType.destroy, err)
      let ea: EventArgs = { type: NearbyEventType.destroy, code: err.code ?? -1, message: err.message }
      event?.(ea)
      return this._toCallback(ea)

    }
  }

  public async openDialog(want: Want, uiContext: UIContext) {
    // // Open the graphic and text prompts
    let uri = want?.uri;
    NearbyLog.info("want收到了 uri=" + uri);
    if (!uri) {
      return;
    }
    let inputVersionName = parseVersionNameFromUri(uri);
    if (inputVersionName == null) {
      return;
    }
    let compareResult = compareVersion(inputVersionName);
    if (compareResult < 0) {
      NearbyTransferService._isSender = true;
      NearbyLog.info("当前角色为发送方")
    } else if (compareResult > 0) {
      NearbyTransferService._isSender = false;
      NearbyLog.info("当前角色为接收方")
    } else {
      return;
    }
    if (!this._isNearbyServiceInitted) {
      // 务必保证初始化与后续的 publish 的次序，init 同步结束后才可以发布服务
      NearbyLog.info("NearbyTransferService未初始化，需要先完成初始化");
      await NearbyTransferService.getInstance().create(uiContext);
    }
    if (!NearbyTransferService._isSender) {
      NearbyLog.info("【接收端】准备发布服务")
      NearbyTransferService.getInstance().publishNearbyGame();
      TransferDialogManager.getInstance(uiContext)?.openDialog();
    }
  }
}