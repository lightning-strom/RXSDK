export declare function createFeedbackApi(data: any): Promise<any>;
export declare function getFeedbackListApi(params: any): Promise<any>;
export declare function getFeedbackDetailApi(params: any): Promise<any>;
export declare function collectPropsApi(data: any): Promise<any>;
export declare function getNoticeApi(params: any): Promise<any>;
export declare function getPromoterCodeApi(game_id: any): Promise<any>;
export declare function exchangePromoterCodeApi(cdkey: any): Promise<any>;
export declare function loginByCredentialApi(data: any): Promise<any>;
export declare function loginByTokenApi(data: any): Promise<any>;
export declare function getShareDataApi(data: any): Promise<any>;
export declare function getAdShareDataApi(data: any): Promise<any>;
export declare function orderApi(data: any): any;
export declare const sendCaptcha: (data: any) => Promise<any>;
export declare const sendCaptchaWithCode: (data: any) => Promise<any>;
export declare const bindPhone: (data: any) => Promise<any>;
export declare const unBindPhone: (data: any) => Promise<any>;
export declare const uploadGameInteractionInfoApi: (data: any) => Promise<any>;
export declare function validateUnbindCodeApi(data: any): Promise<any>;
export declare function changePhone(data: any): Promise<any>;
export declare const bindEmail: (data: any) => Promise<any>;
export declare const UnbindEmail: (data: any) => Promise<any>;
export declare const payCallback: (url: string, data: any) => Promise<any>;
export declare const refreshTokenReq: () => Promise<any>;
export declare function deregister(data: any): Promise<any>;
export declare function deregisterCancel(): Promise<any>;
export declare function refreshUserInfo(data: any): Promise<any>;
export declare function updateInfoApi(data: any): Promise<any>;
export declare function reportLocationUpdata(data: any): Promise<any>;
export declare function deleteReportLocation(data: any): Promise<any>;
export declare function getNearlyPeasonByRadius(data: any): Promise<any>;
/**
export function getOpenID(data: any) {
  return request({
      url: '/Social/User/GetOpenID',
      method: 'POST',
      data,
  })
}
 */
export declare const trackApi: (data: any) => Promise<any>;
export declare const trackCompressedApi: (data: any) => Promise<any>;
export declare const getInfoApi: () => Promise<any>;
export declare const getUserInfoByFieldApi: (data?: any) => Promise<any>;
export declare const msgSecCheckApi: (data: any) => Promise<any>;
export declare const mediaCheckAsyncApi: (data: any) => Promise<any>;
export declare const activated: (data: any) => Promise<any>;
export declare const getBusinessRules: (version: string) => Promise<any>;
export declare const businessOrderApi: (data: any) => any;
export declare const updateGameVersionApi: (data: any) => Promise<any>;
export declare const checkVersionGameLobbyByGet: (data: any) => Promise<any>;
export declare const checkVersionGameLobbyByPost: (data: any) => Promise<any>;
export declare const checkGameVersion: (data: any) => Promise<any>;
export declare const checkActivityVersion: (data: any) => Promise<any>;
export declare const schedulingReportApi: (data: any) => Promise<any>;
export declare const schedulingInitApi: (data: any) => Promise<any>;
export declare const getInitConf: (data: any) => Promise<IResponseSdkInitConfig>;
export declare const getServerTime: (data?: any) => Promise<any>;
export declare const getPublicProps: (version: string) => Promise<any>;
export declare const getPhoneNumberApi: (code: any) => Promise<any>;
export declare const changePhoneNumberApi: (code: any) => Promise<any>;
export declare const getAdSourceApi: () => Promise<any>;
export declare const getThirdToken: (data: any) => Promise<any>;
export declare const requestSubscribeMessageApi: (data: any) => Promise<any>;
export declare function getOperationSceneApi(): Promise<any>;
export declare function getGameAreaApi(area_id: string): Promise<any>;
export declare function putGameAreaApi(data: any): Promise<any>;
export declare function createGameAreaApi(data: any): Promise<any>;
export declare function delGameAreaApi(data: string): Promise<any>;
export declare function getGameAreaListApi(): Promise<any>;
export declare function createGameCharacterApi(data: any): Promise<any>;
export declare function putGameCharacterApi(data: any): Promise<any>;
export declare function delGameCharacterApi(data: any): Promise<any>;
export declare function getGameCharacterAccountApi(params: any): Promise<any>;
export declare function getGameCharacterApi(params: any): Promise<any>;
export declare function getGameAccountAreaCharacterApi(params: any): Promise<any>;
export declare function itemRedemptionApi(data: any): Promise<any>;
export declare function getEmailListApi(data: any): Promise<any>;
export declare function getEmailDetailApi(data: any): Promise<any>;
export declare function receiveEmailApi(data: any): Promise<any>;
export declare function delEmailApi(data: any): Promise<any>;
export declare function getShortUrlApi(data: any): Promise<any>;
export declare function createActivityIdApi(data: any): Promise<any>;
export declare function setDynamicMsgApi(data: any): Promise<any>;
export declare function getShortTextApi(short_name: any): Promise<any>;
export declare function getUrlParseApi(params: any): Promise<any>;
export declare function setShortTextApi(text: any): Promise<any>;
export declare function _getInfoApi(): Promise<any>;
export declare function searchGameAccountApi(): Promise<any>;
export declare function setChatToolMsgApi(data: any): Promise<any>;
export declare const getIpApi: () => Promise<any>;
export declare const getOrderStatusApi: (order_no: string) => Promise<any>;
export declare const getTempNoticeApi: (product_id: string, channel_id: string) => Promise<any>;
export declare const getH5LoginConfigApi: (product_id: string, channel_id: string) => Promise<any>;
export declare const tradeQueryApi: (order_no: string) => Promise<any>;
