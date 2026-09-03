using RuiXue.Quick.Impl;

namespace RuiXue.Quick
{
    public static class RXQuickWrapper
    {
        #if UNITY_ANDROID
        private static readonly IRXQuick _sdk = new RXQuickWrapperAndroid();
        #else
        private static readonly IRXQuick _sdk = new RXQuickWrapperNotSupport();
        #endif

        /// <summary>
        /// 游戏角色上报
        /// </summary>
        /// <param name="rxGameRoleInfo"></param>
        /// <param name="createRole"></param>
        public static void SetGameRoleInfo(RXGameRoleInfo rxGameRoleInfo, bool createRole)
        {
            _sdk.SetGameRoleInfo(rxGameRoleInfo, createRole);
        }

        /// <summary>
        /// 实名认证
        /// </summary>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        public static void VerifyRealName(RequestResponseDelegate responseDelegate,
            RequestErrorDelegate errorDelegate)
        {
            _sdk.VerifyRealName(responseDelegate, errorDelegate);
        }
    }
}

