/* eslint-disable no-console */
let sdkInstance = null;
let initPayload = null;
const STRICT_LOGIN_OPENID_COMPAT = true;

function getGlobal() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof window !== 'undefined') return window;
  if (typeof GameGlobal !== 'undefined') return GameGlobal;
  return {};
}

function getUnityInstance() {
  const g = getGlobal();
  return g.unityInstance || g.GameGlobal?.unityInstance || g.window?.unityInstance || null;
}

function parseJsonSafe(input, fallback = {}) {
  if (!input || typeof input !== 'string') return fallback;
  try {
    return JSON.parse(input);
  } catch (err) {
    console.warn('[AUTOCHK] parse json failed:', err);
    return fallback;
  }
}

function normalizeCallbackKey(callback, fallbackKey) {
  if (typeof callback === 'string' && callback.length > 0) return callback;
  if (typeof callback === 'number' && typeof UTF8ToString === 'function') {
    try {
      const key = UTF8ToString(callback);
      if (typeof key === 'string' && key.length > 0) return key;
    } catch (err) {
      console.warn('[AUTOCHK] decode callback ptr failed:', err);
    }
  }
  return fallbackKey;
}

function sendUnity(key, data) {
  const ui = getUnityInstance();
  if (!ui) {
    console.warn('[AUTOCHK] unityInstance missing, callback dropped:', key, data);
    return;
  }

  const payload = {
    key,
    rslt: JSON.stringify(data ?? {}),
  };
  const payloadStr = JSON.stringify(payload);

  try {
    if (ui.Module && typeof ui.Module.SendMessage === 'function') {
      ui.Module.SendMessage('GameApp', 'CallBack', payloadStr);
      return;
    }
    if (typeof ui.SendMessage === 'function') {
      ui.SendMessage('GameApp', 'CallBack', payloadStr);
      return;
    }
  } catch (err) {
    console.error('[AUTOCHK] send unity callback failed:', err);
  }
}

function sendCallback(callback, fallbackKey, data) {
  const key = normalizeCallbackKey(callback, fallbackKey);
  sendUnity(key, data);
}

function getLegacyCtor() {
  const g = getGlobal();
  return g.channelSDK || g.window?.channelSDK || null;
}

function ensureLegacySdkReady() {
  if (sdkInstance) return sdkInstance;
  if (!initPayload) return null;

  const LegacyCtor = getLegacyCtor();
  if (typeof LegacyCtor !== 'function') return null;

  try {
    sdkInstance = new LegacyCtor({
      productId: initPayload.app_id,
      channelId: initPayload.channel_id,
      cpid: initPayload.cp_id,
      baseUrlList: initPayload.base_url,
      logSwitch: initPayload.log_switch,
      gameImplType: 'unity',
      complete: () => {},
    });
    return sdkInstance;
  } catch (err) {
    console.warn('[AUTOCHK] build legacy sdk failed:', err);
    sdkInstance = null;
    return null;
  }
}

function getV4Sdk() {
  const g = getGlobal();
  return g.VNGGamesSDK || g.window?.VNGGamesSDK || null;
}

function callLegacy(method, args = [], callback, fallbackKey, failMessage) {
  const sdk = ensureLegacySdkReady();
  if (!sdk || typeof sdk[method] !== 'function') {
    sendCallback(callback, fallbackKey, { code: -1, msg: failMessage || `${method} unavailable` });
    return;
  }

  try {
    sdk[method](...args, {
      complete: (data) => sendCallback(callback, fallbackKey, data),
    });
  } catch (err) {
    sendCallback(callback, fallbackKey, { code: -1, msg: err?.message || String(err) });
  }
}

export function installCallJsRXBridge() {
  const ui = getUnityInstance();
  if (!ui) {
    console.error('[AUTOCHK-10] installCallJsRXBridge failed: unityInstance missing');
    return;
  }
  if (ui.CallJsRX) {
    console.log('[AUTOCHK-10] CallJsRX already installed');
    return;
  }

  console.log('[AUTOCHK-10] installCallJsRXBridge start');

  ui.CallJsRX = {
    _logEnabled: false,

    _callBackToUnity(funcName, data) {
      sendUnity(funcName, data);
    },

    jsrx_init(jsonStr, callback) {
      console.warn('[AUTOCHK][RX-INIT] start', { jsonStr, callback });
      initPayload = parseJsonSafe(jsonStr, {});
      console.warn('[AUTOCHK][RX-INIT] parsed payload', initPayload);
      const LegacyCtor = getLegacyCtor();
      console.warn('[AUTOCHK][RX-INIT] legacy ctor resolved', {
        ctorType: typeof LegacyCtor,
        ctorName: LegacyCtor?.name || '',
        hasLogin: !!LegacyCtor?.prototype?.login,
      });

      if (typeof LegacyCtor === 'function') {
        try {
          console.warn('[AUTOCHK][RX-INIT] legacy new start', {
            productId: initPayload.app_id,
            channelId: initPayload.channel_id,
            cpid: initPayload.cp_id,
            baseUrlList: initPayload.base_url,
            logSwitch: initPayload.log_switch,
            gameImplType: 'unity',
          });
          sdkInstance = new LegacyCtor({
            productId: initPayload.app_id,
            channelId: initPayload.channel_id,
            cpid: initPayload.cp_id,
            baseUrlList: initPayload.base_url,
            logSwitch: initPayload.log_switch,
            gameImplType: 'unity',
            complete: (data) => {
              console.warn('[AUTOCHK][RX-INIT] legacy complete', data);
              sendCallback(callback, 'onRxInited', data);
            },
          });
          console.warn('[AUTOCHK][RX-INIT] legacy new success', {
            sdkInstanceType: typeof sdkInstance,
            hasLogin: !!sdkInstance?.login,
          });
          return;
        } catch (err) {
          console.warn('[AUTOCHK][RX-INIT] legacy init failed:', err);
          sdkInstance = null;
        }
      }

      const v4 = getV4Sdk();
      if (v4?.init) {
        Promise.resolve(v4.init())
          .then(() => sendCallback(callback, 'onRxInited', { code: 0, msg: 'v4 inited' }))
          .catch((err) => sendCallback(callback, 'onRxInited', { code: -1, msg: err?.message || String(err) }));
        return;
      }
      sendCallback(callback, 'onRxInited', { code: -1, msg: 'channelSDK/VNGGamesSDK not ready' });
    },

    jsrx_login_ui(jsonStr, callback) {
      console.log('[AUTOCHK-11] jsrx_login_ui called payload=', jsonStr);
      const payload = parseJsonSafe(jsonStr, {});
      const sdk = ensureLegacySdkReady();

      if (sdk && typeof sdk.login === 'function') {
        try {
          sdk.login(payload, {
            complete: (data) => sendCallback(callback, 'onLoginUIResult', data),
          });
        } catch (err) {
          sendCallback(callback, 'onLoginUIResult', { code: -1, msg: err?.message || String(err) });
        }
        return;
      }
      if (STRICT_LOGIN_OPENID_COMPAT) {
        sendCallback(callback, 'onLoginUIResult', {
          code: -2,
          msg: 'legacy channelSDK.login not ready, strict openid compatibility enabled',
        });
        return;
      }
    },

    jsrx_login_openid(jsonStr, callback) {
      this.jsrx_login_ui(jsonStr, callback);
    },

    jsrx_update_userinfo(jsonStr, callback) {
      const payload = parseJsonSafe(jsonStr, {});
      callLegacy('updateInfo', [payload], callback, 'onUpdateUserInfo');
    },

    jsrx_logoff(callback) {
      callLegacy('logoff', [], callback, 'onLogoff');
    },

    jsrx_realauth(_jsonStr, callback) {
      callLegacy('realName', [], callback, 'onCertificationResult');
    },

    jsrx_openHelpCenter(jsonStr) {
      const payload = parseJsonSafe(jsonStr, {});
      const sdk = ensureLegacySdkReady();
      if (sdk?.openHelpCenter) sdk.openHelpCenter(payload);
    },

    jsrx_openService(jsonStr) {
      const payload = parseJsonSafe(jsonStr, {});
      const sdk = ensureLegacySdkReady();
      if (sdk?.openService) sdk.openService(payload);
    },

    jsrx_pay(jsonStr, callback) {
      const payload = parseJsonSafe(jsonStr, {});
      callLegacy('pay', [payload], callback, 'onZhifuResult');
    },

    jsrx_show_privacy(jsonStr, callback) {
      const payload = parseJsonSafe(jsonStr, {});
      const sdk = ensureLegacySdkReady();
      if (!sdk?.openProtocol) {
        sendCallback(callback, 'onShowRxPolicy', { code: -1, msg: 'openProtocol unavailable' });
        return;
      }
      sdk.openProtocol({
        protocol: {
          key: payload.key,
          key_list: payload.keys,
        },
      });
      sendCallback(callback, 'onShowRxPolicy', { code: 0 });
    },

    jsrx_get_devicecode() {
      const sdk = ensureLegacySdkReady();
      if (sdk?.getDeviceCode) return sdk.getDeviceCode();
      return '';
    },

    jsrx_track(jsonStr) {
      const payload = parseJsonSafe(jsonStr, {});
      const sdk = ensureLegacySdkReady();
      if (sdk?.track) sdk.track(payload, { complete: () => {} });
    },

    jsrx_role_report(jsonStr) {
      const payload = parseJsonSafe(jsonStr, {});
      const sdk = ensureLegacySdkReady();
      if (sdk?.roleReport) sdk.roleReport(payload, { complete: () => {} });
    },

    jsrx_get_tempNotice(callback) {
      callLegacy('getTempNotice', [], callback, 'onGetTempNotice');
    },

    jsrx_get_loginConfig(callback) {
      callLegacy('getH5LoginConfig', [], callback, 'onGetLoginConfig');
    },

    jsrx_get_platform(callback) {
      callLegacy('getPlatform', [], callback, 'onGetPlatform');
    },

    jsrx_get_product_list(jsonStr, callback) {
      const payload = parseJsonSafe(jsonStr, {});
      callLegacy('getProductList', [payload], callback, 'onGetProductList');
    },

    jsrx_set_language(jsonStr) {
      const sdk = ensureLegacySdkReady();
      if (sdk?.setLanguage) sdk.setLanguage(jsonStr);
    },

    jsrx_close_pay() {},

    jsrx_event_report(_jsonStr) {},

    jsrx_get_channel_info(callback) {
      sendCallback(callback, 'onGetchannelInfo', { code: 0 });
    },

    jsrx_get_env(callback) {
      sendCallback(callback, 'onGetEnv', { code: 0 });
    },

    jsrx_report_data(_jsonStr, callback) {
      sendCallback(callback, 'onReportData', { code: 0 });
    },

    jsrx_set_gameinfo(jsonStr) {
      const payload = parseJsonSafe(jsonStr, {});
      const sdk = ensureLegacySdkReady();
      if (sdk?.setGameInfo) sdk.setGameInfo(payload.roleId, payload.region_tag);
    },

    jsrx_get_third_data(callback) {
      sendCallback(callback, 'onGetThirdChannelData', { code: 0 });
    },

    jsrx_vng_analytics(jsonStr) {
      const payload = parseJsonSafe(jsonStr, {});
      const sdk = ensureLegacySdkReady();
      if (sdk?.analyticsTrack) {
        sdk.analyticsTrack({
          type: payload.type,
          params: payload.params,
        });
      }
    },

    jsrx_version_check(_jsonStr, callback) {
      sendCallback(callback, 'onCheckAppResult', { code: 0 });
    },
  };

  console.log('[AUTOCHK-10] installCallJsRXBridge done');
}
