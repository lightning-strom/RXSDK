#if UNITY_ANDROID
using UnityEngine;

namespace RuiXue.Impl
{
    internal class AntiAddictJavaProxy : AndroidJavaProxy
    {
        private IAntiAddictDelegate _antiAddictDelegate;

        public AntiAddictJavaProxy(IAntiAddictDelegate addictDelegate) : base("com.ruixue.legal.AntiAddictDelegate")
        {
            this._antiAddictDelegate = addictDelegate;
        }

        //是否正在游戏中
        public bool isGaming()
        {
            if (_antiAddictDelegate == null)
            {
                return false;
            }
            return _antiAddictDelegate.IsGaming();
        }

        // 自定义UI时处理此防沉迷状态变化接口,游戏根据用户防沉迷的状态回调自行处理弹窗、强制登出等逻辑
        public void didAddictInfoUpdate(string json)
        {
            _antiAddictDelegate?.AddictInfoUpdate(json);
        }

        // 防沉迷是否使用CP自定义UI
        // 如果需要自定义ui，则return true, 然后监听didAddictInfoUpdate的回调，做对应的ui处理
        public bool enableCustomUI()
        {
            if (_antiAddictDelegate == null)
            {
                return false;
            }
            return _antiAddictDelegate.EnableCustomUI();
        }
    } 
}
#endif

