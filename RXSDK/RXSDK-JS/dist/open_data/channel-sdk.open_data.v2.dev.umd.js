;;;console.warn("%cchannelSDK: Your are using Dev version!!!", "font-size: 20px;");;;
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.channelSDK = factory());
})(this, (function () { 'use strict';

  class SdkOpenDataContext {
    constructor(data) {
      switch (data.event) {
        case 'rx_shareMessageToFriend':
          wx.getFriendCloudStorage({
            keyList: [],
            success: (res) => {
              console.log('getFriendCloudStorage', res);
            }
          });
          wx.shareMessageToFriend({
            openId: data.openid,
            imageUrl: data.imageUrl,
            title: data.title,
            success(res) {
              console.log(res);
            },
            fail(err) {
              console.log(err);
            }
          });
          break
      }
    }
  }

  return SdkOpenDataContext;

}));
//# sourceMappingURL=channel-sdk.open_data.v2.dev.umd.js.map
