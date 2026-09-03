import * as wxopensdk from '@tencent/wechat_open_sdk';
import { Logger } from '../utils/Logger';
import SDKConfig from '../sdk/SDKConfig';
import { common, Want } from '@kit.AbilityKit';
import { RXError, RXErrorCode, RXResult } from '../types/Index';

import Devices from '../utils/Devices';
import { ShareMediaTypes } from '../types/ShareTypes';
import { fileUri } from '@kit.CoreFileKit';
import { buffer } from '@kit.ArkTS';
import { ShareObject } from '../share/ShareObject';
import { WXEventHandler } from './WXApiEventHandler';
import { RXUtil } from '../sdk/RXIndex';

export interface WXAuthParams {
  isOption1?: boolean;
  nonAutomatic?: boolean;
  scope?: string[];
  state?: string;
  extData?: string;
  transaction?: string;
}

export interface WXBusinessParams {
  businessType?: string
  query: string
  extInfo?: string
}


class MockWXResp extends wxopensdk.BaseResp {
  private _type: number

  constructor(type: number, errCode: number, errMsg: string) {
    super();
    this._type = type;
    this.errCode = errCode
    this.errStr = `${errMsg} ${type}`
  }

  get type(): number {
    return this._type
  }
}


export class WXApi {
  private _appId?: string | undefined;
  private _wxInstance?: wxopensdk.WXApi;
  private static instance: WXApi | null = null;

  public get appId(): string | undefined {
    return this._appId || SDKConfig.WX_APP_ID;
  }

  public get wxInstance(): wxopensdk.WXApi {
    if (!this._wxInstance) {
      this._wxInstance = wxopensdk.WXAPIFactory.createWXAPI(this.appId);
    }
    return this._wxInstance;
  }

  protected constructor(appId?: string) {
    this._appId = appId;
    wxopensdk.WXAPIFactory
  }

  public static getInstance(wxAppId: string = SDKConfig.WX_APP_ID): WXApi {
    if (!WXApi.instance || WXApi.instance.appId !== wxAppId) {
      if (WXApi.instance) {
        WXApi.instance.unregister()
        WXApi.instance = null;
      }
      WXApi.instance = new WXApi(wxAppId);
      if (!wxAppId) {
        Logger.w('metadata: wx_appid 未配置，请先初始化 wx_appid,如未使用微信功能请忽略。');
      }
    }
    return WXApi.instance;
  }

  public handleWant(want: Want) {
    this.wxInstance?.handleWant(want, WXEventHandler)
  }

  public openWechat(context: common.UIAbilityContext) {
    return this.wxInstance?.openWechat(context)
  }

  public isWXAppInstalled() {
    return this.wxInstance?.isWXAppInstalled()
  }

  register() {
    WXEventHandler.registerOnWXRespCallback(this.onWXResp)
    WXEventHandler.registerOnWXReqCallback(this.onWXReq)
  }

  unregister() {
    WXEventHandler.unregisterOnWXRespCallback(this.onWXResp)
    WXEventHandler.unregisterOnWXReqCallback(this.onWXReq)
  }

  onWXResp(resp: wxopensdk.BaseResp): void {

  }

  onWXReq(req: wxopensdk.BaseReq) {

  }

  static toRXShareError(errorCode: number): number {
    // 处理不存在的错误码，返回默认值
    if (errorCode == wxopensdk.ErrCode.ERR_USER_CANCEL) {
      return RXErrorCode.SHARE_CANCEL
    } else {
      return RXErrorCode.SHARE_PARAMS_ERROR
    }
  }

  createMediaMessage(params: ShareObject): wxopensdk.WXMediaMessage {
    if (!params) {
      throw new RXError("share params null", RXErrorCode.SHARE_PARAMS_ERROR)
    }
    let mediaMessage = new wxopensdk.WXMediaMessage()
    if (params.material_type == ShareMediaTypes.WEBPAGE) {
      if (!params.url) {
        throw new RXError("share url is null error", RXErrorCode.SHARE_PARAMS_ERROR)
      }
      let webpageObject = new wxopensdk.WXWebpageObject()
      webpageObject.webpageUrl = params.url
      mediaMessage.mediaObject = webpageObject
      mediaMessage.title = params.title
      mediaMessage.description = params.content

    } else if (params.material_type == ShareMediaTypes.IMAGE) {
      if (!params.image) {
        throw new RXError("share image is null error", RXErrorCode.SHARE_PARAMS_ERROR)
      }
      let imageObject = new wxopensdk.WXImageObject
      if (typeof params.image == 'string') {
        imageObject.uri = fileUri.getUriFromPath(params.image);
      } else if (params.image instanceof ArrayBuffer) {
        let buf: buffer.Buffer = buffer.from(params.image);
        imageObject.imageData = buf.toString('base64', 0, buf.length);
      }
      mediaMessage.mediaObject = imageObject
    } else if (params.material_type == ShareMediaTypes.TEXT) {
      if (!params.title) {
        throw new RXError("share title is null error", RXErrorCode.SHARE_PARAMS_ERROR)
      }
      let textObject = new wxopensdk.WXTextObject
      textObject.text = params.title
      mediaMessage.mediaObject = textObject
    } else if (params.material_type == ShareMediaTypes.CARD) {
      if (!params.username) {
        throw new RXError("share username is null error", RXErrorCode.SHARE_PARAMS_ERROR)
      } else if (!params.path) {
        throw new RXError("share path is null error", RXErrorCode.SHARE_PARAMS_ERROR)
      }
      const miniProgramObject = new wxopensdk.WXMiniProgramObject()
      miniProgramObject.userName = params.username
      miniProgramObject.path = params.path
      miniProgramObject.miniprogramType = params.mini_type
      mediaMessage.mediaObject = miniProgramObject
      mediaMessage.title = params.title
      mediaMessage.description = params.content
    }
    return mediaMessage
  }


  async share(params: ShareObject, context?: common.UIAbilityContext): Promise<wxopensdk.SendMessageToWXResp> {
    try {
      let mediaMessage = this.createMediaMessage(params)
      let scene = params.share_scene - 1
      if (scene < 0) {
        throw new RXError(`share scene code error ${scene}`, RXErrorCode.SHARE_PARAMS_ERROR)
      }
      let req = new wxopensdk.SendMessageToWXReq()
      //0 friend， 1 friend cricle
      req.scene = scene
      req.message = mediaMessage
      let resp = await this.sendReq(req, context)
      return resp
    } catch (e) {
      Logger.e(e)
      if (e instanceof Error) {
        throw e;
      } else {
        throw new RXError(`wx share error code: ${e}`, RXErrorCode.SHARE_PARAMS_ERROR);
      }
    }
  }

  async login(params: WXAuthParams, callback?: (resp: wxopensdk.SendAuthResp) => void): Promise<wxopensdk.SendAuthResp> {
    try {
      const req = new wxopensdk.SendAuthReq();
      req.isOption1 = params.isOption1 ?? false
      req.nonAutomatic = params.nonAutomatic ?? true
      req.scope = params.scope?.join(',') || 'snsapi_userinfo'
      req.state = params.state ?? 'wx_login'
      req.extData = params.extData
      req.transaction = params.transaction ?? Devices.genUUID()
      let resp = (await this.sendReq(req)) as wxopensdk.SendAuthResp
      callback?.(resp )
      return resp
    } catch (e) {
      Logger.e(e)
      if (e instanceof Error) {
        throw e;
      } else {
        throw new RXError(`wx login error: ${e}`);
      }
    }
  }


  async openBusinessView(params: WXBusinessParams, callback?: (resp: wxopensdk.OpenBusinessViewResp) => void): Promise<wxopensdk.OpenBusinessViewResp> {
    try {
      const req = new wxopensdk.OpenBusinessViewReq();
      req.businessType = params.businessType ?? "requestMerchantTransfer"
      req.query = params.query
      req.extInfo = params.extInfo
      let resp = (await this.sendReq(req)) as wxopensdk.OpenBusinessViewResp
      callback?.(resp )
      return resp
    } catch (e) {
      Logger.e(e)
      if (e instanceof Error) {
        throw e;
      } else {
        throw new RXError(`wx open business error: ${e}`, RXErrorCode.SHARE_PARAMS_ERROR);
      }
    }
  }

  async sendReq(req: wxopensdk.BaseReq, context?: common.UIAbilityContext): Promise<wxopensdk.BaseResp> {
    Logger.d(`senReq:type:${req.type} data: ${JSON.stringify(req)}`)
    return new Promise<wxopensdk.BaseResp>(async (resolve, reject) => {
      const wxResp = (resp: wxopensdk.BaseResp) => {
        try {
          if (resp.type === req.type) {
            resolve(resp as wxopensdk.SendAuthResp);
          } else {
            let msg = `Response type mismatch: received=${resp.type}, expected=${req.type}`
            Logger.w(msg);
            resolve(resp)
          }
        } finally {
          WXEventHandler.unregisterOnWXRespCallback(wxResp);
        }
      };
      WXEventHandler.registerOnWXRespCallback(wxResp);
      const success = await this.wxInstance.sendReq(context || getContext() as common.UIAbilityContext, req)
      if (!success) {
        WXEventHandler.unregisterOnWXRespCallback(wxResp);
        resolve(new MockWXResp(req.type, wxopensdk.ErrCode.ERR_COMM, "send wx req failed. type:" + req.type))
      }
    });
  }
}



