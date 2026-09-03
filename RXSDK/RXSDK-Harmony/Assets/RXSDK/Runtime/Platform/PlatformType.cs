namespace RXSDK.Platform
{
    /// <summary>
    /// 平台类型标识，用于多端扩展与运行时识别当前桥接实现。
    /// 新增平台时在此添加枚举值，并实现 IPlatformBridge、在 PlatformFactory 中注册。
    /// </summary>
    public enum PlatformType
    {
        /// <summary>未指定或默认空实现（编辑器、未适配平台）</summary>
        None = 0,

        /// <summary>鸿蒙 / OpenHarmony（团结引擎）</summary>
        OpenHarmony = 1,

        /// <summary>Android（可按需扩展）</summary>
        Android = 2,

        /// <summary>iOS（可按需扩展）</summary>
        iOS = 3,

        /// <summary>Steam 等（可按需扩展）</summary>
        Steam = 4,

        /// <summary>自定义 / 测试用</summary>
        Custom = 127
    }
}
