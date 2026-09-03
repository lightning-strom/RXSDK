#if UNITY_ANDROID
using UnityEngine;
namespace RuiXue.Quick.Impl
{
    internal class RXQuickWrapperAndroid:IRXQuick
    {
        
        private static AndroidJavaClass _quickSdkHelper;
        private static AndroidJavaObject _sInstanceObj;
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _contextObj;

        public RXQuickWrapperAndroid()
        {
            _quickSdkHelper = new AndroidJavaClass("com.ruixue.openapi.QuickSdkHelper");
            _sInstanceObj = _quickSdkHelper.CallStatic<AndroidJavaObject>("getInstance");
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
        }

        public void SetGameRoleInfo(RXGameRoleInfo rxGameRoleInfo, bool createRole)
        {
            AndroidJavaObject javaGameRole = new AndroidJavaObject("com.ruixue.sdk.RXGameRoleInfo");
            javaGameRole.Call("setServerID", rxGameRoleInfo.serverID);
            javaGameRole.Call("setServerName", rxGameRoleInfo.serverName);
            javaGameRole.Call("setGameRoleName", rxGameRoleInfo.gameRoleName);
            javaGameRole.Call("setGameRoleID", rxGameRoleInfo.gameRoleID);
            javaGameRole.Call("setGameUserLevel", rxGameRoleInfo.gameUserLevel);
            javaGameRole.Call("setVipLevel", rxGameRoleInfo.vipLevel);
            javaGameRole.Call("setGameBalance", rxGameRoleInfo.gameBalance);
            javaGameRole.Call("setPartyName", rxGameRoleInfo.partyName);
            javaGameRole.Call("setRoleCreateTime", rxGameRoleInfo.roleCreateTime);
            javaGameRole.Call("setPartyId", rxGameRoleInfo.partyId);
            javaGameRole.Call("setGameRoleGender", rxGameRoleInfo.gameRoleGender);
            javaGameRole.Call("setGameRolePower", rxGameRoleInfo.gameRolePower);
            javaGameRole.Call("setPartyRoleId", rxGameRoleInfo.partyRoleId);
            javaGameRole.Call("setPartyRoleName", rxGameRoleInfo.partyRoleName);
            javaGameRole.Call("setProfessionId", rxGameRoleInfo.professionId);
            javaGameRole.Call("setProfession", rxGameRoleInfo.profession);
            javaGameRole.Call("setFriendlist", rxGameRoleInfo.friendlist);
            _sInstanceObj.Call("setGameRoleInfo", _contextObj, javaGameRole, createRole);
        }

        public void VerifyRealName(RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sInstanceObj.Call("UnityVerifyRealName", _contextObj, 
                new JsonCallbackJavaProxy(responseDelegate, errorDelegate));
            
        }
    }
}
#endif