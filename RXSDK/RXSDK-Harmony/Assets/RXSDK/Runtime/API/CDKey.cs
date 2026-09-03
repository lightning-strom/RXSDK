

using System;
using System.Collections.Generic;
using RXSDK.Net;
using UnityEngine;

namespace RXSDK
{

    public class PromoCodeBean
    {
        public int refresh_period;
        public string promo_name;
        public string gift_name;
        public string promo_valid_start;
        public string promo_valid_end;
        public string promo_code;
        public int refresh_period_exp;
        public int polling;
    }

    public class CDKeyAPI : Singleton<CDKeyAPI>
    {
        static string PROMO_GET_API = "v1/operationtoolsapi/exchange/game_display";
        static string PROMO_EXCHANGE = "v1/operationtoolsapi/exchange/exchange";
        private string cpUserId;
        private bool autoRefresh;
        private int refreshInterval = 10;
        Action<int, PromoCodeBean, string> mCallback;

        private void Reset()
        {
            autoRefresh = false;
            refreshInterval = 10;
            mCallback = null;

        }
        public void Init(string cpUserId, bool isAnchor)
        {
            if (isAnchor)
            {
                this.cpUserId = cpUserId;
            }
            else
            {
                Reset();
            }
        }

        protected void Request(int delay = 0)
        {
            Dictionary<string, object> args = new()
            {
                { "game_id", cpUserId },
            };

            RXWebRequest rXWebRequest = RXWebRequest.Create(PROMO_GET_API);
            rXWebRequest.DelaySeconds = delay;
            rXWebRequest.GetAsync(RXWebRequest.DefaultCoroutineHost, HandlePormoCode(), args);
        }

        private RXCallback<PromoCodeBean> HandlePormoCode()
        {
            return (ret, e) =>
            {
                var code = ret.code;
                var data = ret.data;
                var msg = ret.msg;
                int delay = refreshInterval;
                if (code == 0)
                {
                    if (data?.polling > 0)
                    {
                        refreshInterval = data.polling;
                    }
                    refreshInterval = data.refresh_period_exp < 1 ? refreshInterval : data.refresh_period_exp;
                    delay = refreshInterval;
                }
                if (autoRefresh)
                {
                    Log.D("Request PromoCode delay:" + delay);
                    Request(delay);
                }
                mCallback?.Invoke(code, data, msg);
            };
        }


        public void GetPromoDisplayKEY(Action<int, PromoCodeBean, string> callback, bool autoRefresh = false)
        {
            this.autoRefresh = autoRefresh;
            mCallback = callback;
            Request();
        }


        public void ExchangePromoCDKEY(string cdKey, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "cdkey", cdKey },
            };
            API.Post(PROMO_EXCHANGE, args, callback);
        }
    }

}