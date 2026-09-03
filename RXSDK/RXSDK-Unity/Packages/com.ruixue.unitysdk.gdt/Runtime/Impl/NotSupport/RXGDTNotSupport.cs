namespace RuiXue.GDT.Impl
{
    internal sealed class RXGDTNotSupport : IRXGDT
    {
        private static void Warn(string api) => LogUtil.WarningNotSupport($"RXGDT.{api}");

        public void RegisterSdk() => Warn(nameof(RegisterSdk));
        public void Initialize(string actionSetId, string secretKey, string channel, string channelId) =>
            Warn(nameof(Initialize));
        public void ReportRegister(string method, bool success) => Warn(nameof(ReportRegister));
        public void ReportLogin(string method, bool success) => Warn(nameof(ReportLogin));
        public void ReportCreateRole(string role) => Warn(nameof(ReportCreateRole));
        public void ReportCheckout(string type, string name, string id, int number,
            bool isVirtualCurrency, string virtualCurrencyType, string currency, bool success) =>
            Warn(nameof(ReportCheckout));
        public void ReportPurchase(string goodsType, string goodsName, string goodsId, int number,
            string goodsChannel, string currency, int valueInCents, bool success) =>
            Warn(nameof(ReportPurchase));
        public void ReportQuestFinish(string id, string type, string name, int number,
            string description, bool success) => Warn(nameof(ReportQuestFinish));
        public void ReportShare(string channel, bool success) => Warn(nameof(ReportShare));
        public void ReportUpdateLevel(int level) => Warn(nameof(ReportUpdateLevel));
        public void ReportRateApp(float value) => Warn(nameof(ReportRateApp));
        public void ReportViewContent(string type, string name, string id) =>
            Warn(nameof(ReportViewContent));
        public void ReportAddToCart(string type, string name, string id, int number, bool success) =>
            Warn(nameof(ReportAddToCart));
    }
}
