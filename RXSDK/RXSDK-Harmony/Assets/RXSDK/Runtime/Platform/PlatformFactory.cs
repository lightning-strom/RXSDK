using System;
using UnityEngine;

namespace RXSDK.Platform
{
    /// <summary>
    /// 平台桥接工厂，为解耦的唯一切入点：仅此处通过 #if UNITY_XXX 引用具体平台实现并 new XXXPlatformBridge。
    /// 业务层按 IPlatformBridge 的能力属性（SupportsNativeXxx）分支，不依赖 PlatformType 具体枚举，便于多引擎兼容。
    /// 新增平台：1) PlatformType 加枚举 2) 新建 IPlatformBridge 实现 3) 本类 CreateForCurrentPlatform/Create 增加 #if 与 case。
    /// </summary>
    public static class PlatformFactory
    {
        /// <summary>
        /// 根据当前编译/运行环境创建平台桥接实例。
        /// 业务层通过 PlatformProvider.Set(PlatformFactory.CreateForCurrentPlatform()) 注册，无需直接引用具体实现。
        /// </summary>
        public static IPlatformBridge CreateForCurrentPlatform()
        {
#if UNITY_OPENHARMONY && !UNITY_EDITOR
            return new OpenHarmony.OpenHarmonyPlatformBridge();
#elif UNITY_ANDROID && !UNITY_EDITOR
            // 可在此返回 AndroidPlatformBridge 等
            return NullPlatformBridge.Instance;
#elif UNITY_IOS && !UNITY_EDITOR
            // 可在此返回 IOSPlatformBridge 等
            return NullPlatformBridge.Instance;
#else
            return NullPlatformBridge.Instance;
#endif
        }

        /// <summary>
        /// 根据平台类型创建桥接（用于测试或手动指定）。未实现的类型返回 NullPlatformBridge。
        /// </summary>
        public static IPlatformBridge Create(PlatformType platformType)
        {
            switch (platformType)
            {
#if UNITY_OPENHARMONY
                case PlatformType.OpenHarmony:
                    return new OpenHarmony.OpenHarmonyPlatformBridge();
#endif
                case PlatformType.None:
                default:
                    return NullPlatformBridge.Instance;
            }
        }
    }
}
