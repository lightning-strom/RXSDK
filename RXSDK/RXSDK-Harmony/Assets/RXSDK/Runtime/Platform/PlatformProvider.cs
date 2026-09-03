using System;

namespace RXSDK.Platform
{
    /// <summary>
    /// 全局平台桥接提供者。Init 时通过 PlatformFactory.CreateForCurrentPlatform() 注册，
    /// 业务模块通过 Current 获取 IPlatformBridge，支持多端扩展与测试注入。
    /// </summary>
    public static class PlatformProvider
    {
        private static IPlatformBridge _bridge = NullPlatformBridge.Instance;

        public static IPlatformBridge Current => _bridge;

        /// <summary>当前桥接的平台类型（只读）。</summary>
        public static PlatformType CurrentPlatform => _bridge.PlatformId;

        public static void Set(IPlatformBridge bridge)
        {
            _bridge = bridge ?? NullPlatformBridge.Instance;
        }

        public static void Reset()
        {
            _bridge = NullPlatformBridge.Instance;
        }
    }
}
