using System.Collections.Generic;
using Newtonsoft.Json;
using RXSDK.Data;
using UnityEngine;

namespace RXSDK
{
    public enum LoginMethod
    {
        Guest,
        UserName,
        CaptchaCode,
        Harmony,
        HuaWei,

    }

    public static class LoginMethodExtensions
    {
        public static string GetString(this LoginMethod me)
        {
            return me switch
            {
                _ => me.ToString().ToLower(),
            };
        }
        // public static LoginMethod ToEnum( string me)
        // {
        //     return me switch
        //     {
        //         "4399" => LoginMethod.M4399,
        //         _ => (LoginMethod)Enum.Parse(typeof(LoginMethod), me),
        //     };
        // }
    }

    // {
    //     "password_set": false,
    //     "token": {
    //       "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDUElEIjoxMjAsIkFjY291bnRJRCI6MTIsIlVzZXJJRCI6MTIsIlByb2R1Y3RJRCI6IjEwMDIiLCJPcGVuSUQiOiJyeHVDd01rNkJxOVBXcnk0TFpER0h3MVMxSWRKcDc1eG1fUS1sUmoyIiwiU3RhbmRhcmRDbGFpbXMiOnsiZXhwIjoxNjk5MTc0NzM5fSwiVG9rZW5JRCI6IjcyNzI5YTlkLWEzYTYtNDIxZS04MTg4LWFhMWU1NDFlMjFlYyJ9.ge5Rn9w4mbLjHBealh7OxWGCal44XY-o160bDdlEtiI",
    //       "access_expire": 86400,
    //       "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDUElEIjoxMjAsIkFjY291bnRJRCI6MTIsIlVzZXJJRCI6MTIsIlByb2R1Y3RJRCI6IjEwMDIiLCJPcGVuSUQiOiJyeHVDd01rNkJxOVBXcnk0TFpER0h3MVMxSWRKcDc1eG1fUS1sUmoyIiwiU3RhbmRhcmRDbGFpbXMiOnsiZXhwIjoxNjk5NjkzMTM5fSwiVG9rZW5JRCI6IjYwOWM0M2NkLWJhZDYtNDBjZi04MzE2LTNiY2JkNzEzYzU4MiJ9.K9sjmB0vQOH4xBX0vuE63tlhvfLwITS1uZqlN20Ljfo",
    //       "refresh_expire": 604800
    //     },
    //     "nickname": "18b7d108ad85351c33afe241b80a3799",
    //     "ts": 1699088339,
    //     "attr": 0,
    //     "flag": 3,
    //     "aas": 0,
    //     "method": "guest",
    //     "sex": -1,
    //     "openid": "rxuCwMk6Bq9PWry4LZDGHw1S1IdJp75xm_Q-lRj2",
    //     "oldopenid": "",
    //     "devicecode": "d559a9f5-629b-407f-87cd-9e72a0334782",
    //     "cp_user_id": "0",
    //     "login_openid": "SzQBSxLRr9AxxNYU71qml5wLhRoM30qEHk50Z4eFl/aADvp+gQ6Hf3G6S45t6QzQSYxBsYOo3IobA0GDPkHegiJetAwPiPxOGTCf9b+eNKLXrZstw/+LMP6iRgnpOcW5not2r9ejzSoclQdgNm3P9Q2q3OZgIB3V7qkYfpTSdixxY6ePVP0r/+IMdygEM1Mdlaes8NMwjUgJHaT0D6XAehnrAdwqBKMZqT/pVccFXSqa2GTiB59i5toXo+H9eOjLbGqW6m6FHjxRTDg4v/WdH0z2dZx4xI72YckLtkZojYdIUZy2Wrr0ZBzez36/zosmHTgqakoM+knB9ji1kJ/r+wLN5qGcrvVDxxl7zS8eHBEDRcmCprI+JB9B4ZKKKZWkc2srURMJwTrppXu8PkN/53SCk206EOI4Il2PVdeBjWECsIGaZuT3DX5PvBDcBx3rPNfDBsb4hKxMYwDF6jRH6Du9GuUCLAbVANrIm5DyOsKNchurcu793t3dA0POKZuZm6tZUJyjAAACxCyT9MVQbfmJdMVNBIq45NnL7I16Z9qZCszE5vYuUfvFFGwJdvOV2PxDyk+Xur4ZZuCyT4k/0pimRxp3BcUZzk0Qz3nr1ck2hMVtDrs28axOEbiIfBw2fX6TUY0eMgWPPu+wWUtkR08PsjZUAzrEMNMZ0VoXQzAy/6miPa9aejTEv8ZKvwMy8YIhIp7DNCj4goBlNpcgKotEwMFjOm/mR4X+7GcPP/B4vAG5wOrkDsATLOjQVNVMfa8o+EAFRYlfv1+gYnMLCFEPXNhQbiUyjGQszgA2GvAX7jQJ0FwflxpcQ/yRUXseSVcXG18a3qbDxAR0b0JlqNfv59UQ5XkMG8EP2sfw5WwFzXJCMgwfUE9fzIglj8NL",
    //     "fields_sign": "8e5108cb0b118ab935fe1d5373378d3e6e9dce15"
    // }


    public class LoginData : DataBean
    {
        public AccessToken token;
        public string username;
        public string method;
        public bool password_set;
        public string nickname;
        public int ts;
        public int attr;
        public int flag;
        /**
        * （1 - 是达人）
        */

        public int user_flag;
        public int aas;
        public int age;
        public sbyte sex;
        public string openid;
        public string oldopenid;
        public string devicecode;
        public string cp_user_id;
        public string login_openid;
        public string fields_sign;
        public string source;
        public string source_channel;
        public string topinviter_openid;
        public string tid;
        public string uid;
        public string sub_channel_id;
        public bool binding;
        public Dictionary<string, object> ext;

        private static readonly string LOGIN_COUNT_KEY = "rx_login_count";
        private int loginCount = -1;
        public int LoginCount
        {
            get
            {
                loginCount = loginCount < 0 ? PlayerPrefs.GetInt(LOGIN_COUNT_KEY, 0) : loginCount;
                return loginCount;
            }
            set
            {
                loginCount = value;
                PlayerPrefs.SetInt(LOGIN_COUNT_KEY, loginCount);
            }
        }
        protected static LoginData _instance;
        public static LoginData Instance
        {
            get
            {
                _instance ??= Load();
                return _instance;
            }
            internal set
            {
                _instance = value;
                if (_instance != null)
                {
                    _instance?.Save();
                }
                else
                {
                    Remove();
                }

            }
        }



        public AccessToken Token
        {
            get
            {
                return token;
            }
            internal set
            {
                token = value?.ConvertToLocal();
                Flush();
            }
        }
        public bool IsRealName
        {
            get
            {
                return (attr & 1) > 0;
            }
        }
        public bool IsAnchor
        {
            get
            {
                return (user_flag & 1) > 0;
            }
        }

        public bool IsBinding { get => binding; }

        LoginData Save()
        {
            ++LoginCount;
            token = token.ConvertToLocal();
            Flush();
            return this;
        }
        void Flush()
        {
            string json = ToJson();
            Log.D("save json:" + json);
            PlayerPrefs.SetString(Constants.LOGIN_DATA_KEY, json);
        }

        internal static void Remove()
        {
            PlayerPrefs.DeleteKey(Constants.LOGIN_DATA_KEY);
        }

        protected static LoginData Load()
        {
            string d = PlayerPrefs.GetString(Constants.LOGIN_DATA_KEY);
            // Log.D("load logindata:" + d);
            return FromJson(d);
        }

        public static LoginData FromJson(string json)
        {
            if (string.IsNullOrEmpty(json))
            {
                return null;
            }
            else
            {
                return JsonConvert.DeserializeObject<LoginData>(json);
            }
        }

        public static class LoginAttrMask
        {

            /**
             * 实名标识
             */
            public static int REAL_NAME = 1;

            /**
             * 用户当前是否有绑定手机号，1 表示有绑定。
             */
            public static int BIND_PHONE = 1 << 1;
            public static int BIND_email = 1 << 2;
            //        用户当前是否有已设置密码的登录凭证
            public static int SET_PASSWORD = 1 << 3;
            /**
             * 实名标识
             */
            public static int REAL_NAME_RX = 1 << 4;
        }

        public static class LoginFlagMask
        {
            /**
             * 1是否新用户
             */
            public static int FLAG_NEW_USER = 1;
            /**
             * 2是否进行防沉迷控制
             */
            public static int FLAG_SCREEN_TIME = 1 << 1;
            /**
             * 4-游客是否绑定了三方账号(仅在游客登录返回时有效)
             */
            public static int FLAG_GUEST_BIND_THIRD = 1 << 2;
            /**
             * 8-已完成首次绑定手机
             */
            public static int FLAG_FIRST_BIND_MOBILE = 1 << 3;
            /**
             * 16-已完成首次绑定 Email
             */
            public static int FLAG_FIRST_BIND_MAIL = 1 << 4;
            /**
             * 32注销申请中
             */
            public static int FLAG_DEREGISTER = 1 << 5;
        }

        public void SetDeregister(bool isRequest)
        {
            if (isRequest)
            {
                flag |= LoginFlagMask.FLAG_DEREGISTER;
            }
            else
            {
                flag &= ~LoginFlagMask.FLAG_DEREGISTER;
            }
        }

        public void SetFlag(int mask)
        {
            flag |= mask;
        }

        public void SetAttr(int mask)
        {
            attr |= mask;
        }

        public void SetRealName(int? age = null, int? aas = null)
        {
            if (age.HasValue)
                this.age = age.Value;
            if (aas.HasValue)
                this.aas = aas.Value;
            SetAttr(LoginAttrMask.REAL_NAME);
            SetAttr(LoginAttrMask.REAL_NAME_RX);
            Flush();
        }

        public void SetExtPhone(string phone)
        {
            if (string.IsNullOrEmpty(phone))
                return;

            ext["phone"] = phone;
        }

        public void SetExtEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
                return;

            ext["email"] = email;
        }
    }

    public class AccessToken : DataBean
    {
        public string access;
        public int access_expire;
        public string refresh;
        public int refresh_expire;
        public bool is_local_time = false;

        internal AccessToken ConvertToLocal()
        {
            if (!is_local_time)
            {
                is_local_time = true;
                access_expire = access_expire > 0 ? (int)(TimeUtility.GetTimeSeconds() + access_expire) : access_expire;
                refresh_expire = refresh_expire > 0 ? (int)(TimeUtility.GetTimeSeconds() + refresh_expire) : refresh_expire;
            }
            return this;
        }

        public bool IsRefreshExpired(int nearly = 0)
        {
            long currentTime = TimeUtility.GetTimeSeconds();
            return currentTime >= refresh_expire - nearly;
        }
        public bool IsExpired(int nearly = 0)
        {
            long currentTime = TimeUtility.GetTimeSeconds();
            return currentTime >= access_expire - nearly;
        }
    }
}