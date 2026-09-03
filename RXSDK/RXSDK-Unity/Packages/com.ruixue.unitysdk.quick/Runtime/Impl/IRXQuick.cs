using UnityEngine;
namespace RuiXue.Quick.Impl
{
    internal interface IRXQuick
    {
        /// <summary>
        /// 游戏角色上报
        /// </summary>
        /// <param name="rxGameRoleInfo"></param>
        /// <param name="createRole"></param>
        public void SetGameRoleInfo(RXGameRoleInfo rxGameRoleInfo, bool createRole);

        /// <summary>
        /// 实名认证
        /// </summary>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        public void VerifyRealName(RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate);
    }
}

