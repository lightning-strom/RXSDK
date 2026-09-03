using RuiXue.GDT.Impl;

namespace RuiXue.GDT
{
    public static class RXGDT
    {
#if UNITY_ANDROID && !UNITY_EDITOR
        private static readonly IRXGDT Sdk = new RXGDTAndroid();
#elif UNITY_IOS && !UNITY_EDITOR
        private static readonly IRXGDT Sdk = new RXGDTIOS();
#else
        private static readonly IRXGDT Sdk = new RXGDTNotSupport();
#endif

        /// <summary>注册 GDT SDK。必须在瑞雪 SDK 初始化前调用；Android 无需处理。</summary>
        public static void RegisterSdk() => Sdk.RegisterSdk();

        /// <summary>
        /// 手动初始化 GDT。iOS 原生 SDK 不使用 channel 和 channelId。
        /// </summary>
        public static void Initialize(string actionSetId, string secretKey, string channel = "tencent",
            string channelId = "tencent") =>
            Sdk.Initialize(actionSetId, secretKey, channel, channelId);

        public static void Initialize(RXGDTConfig config) =>
            Initialize(config.actionSetId, config.secretKey, config.channel, config.channelId);

        public static void ReportRegister(string method, bool success) =>
            Sdk.ReportRegister(method, success);

        public static void ReportLogin(string method, bool success) =>
            Sdk.ReportLogin(method, success);

        public static void ReportCreateRole(string role) =>
            Sdk.ReportCreateRole(role);

        public static void ReportCheckout(string type, string name, string id, int number,
            bool isVirtualCurrency, string virtualCurrencyType, string currency, bool success) =>
            Sdk.ReportCheckout(type, name, id, number, isVirtualCurrency, virtualCurrencyType, currency,
                success);

        public static void ReportCheckout(RXGDTCheckoutEvent value) =>
            ReportCheckout(value.type, value.name, value.id, value.number, value.isVirtualCurrency,
                value.virtualCurrencyType, value.currency, value.success);

        /// <param name="valueInCents">真实货币金额，单位：分。</param>
        public static void ReportPurchase(string goodsType, string goodsName, string goodsId, int number,
            string goodsChannel, string currency, int valueInCents, bool success) =>
            Sdk.ReportPurchase(goodsType, goodsName, goodsId, number, goodsChannel, currency,
                valueInCents, success);

        public static void ReportPurchase(RXGDTPurchaseEvent value) =>
            ReportPurchase(value.goodsType, value.goodsName, value.goodsId, value.number,
                value.goodsChannel, value.currency, value.valueInCents, value.success);

        public static void ReportQuestFinish(string id, string type, string name, int number,
            string description, bool success) =>
            Sdk.ReportQuestFinish(id, type, name, number, description, success);

        public static void ReportQuestFinish(RXGDTQuestEvent value) =>
            ReportQuestFinish(value.id, value.type, value.name, value.number, value.description,
                value.success);

        public static void ReportShare(string channel, bool success) =>
            Sdk.ReportShare(channel, success);

        public static void ReportUpdateLevel(int level) =>
            Sdk.ReportUpdateLevel(level);

        public static void ReportRateApp(float value) =>
            Sdk.ReportRateApp(value);

        public static void ReportViewContent(string type, string name, string id) =>
            Sdk.ReportViewContent(type, name, id);

        public static void ReportAddToCart(string type, string name, string id, int number,
            bool success) =>
            Sdk.ReportAddToCart(type, name, id, number, success);

        public static void ReportAddToCart(RXGDTCartEvent value) =>
            ReportAddToCart(value.type, value.name, value.id, value.number, value.success);
    }
}
