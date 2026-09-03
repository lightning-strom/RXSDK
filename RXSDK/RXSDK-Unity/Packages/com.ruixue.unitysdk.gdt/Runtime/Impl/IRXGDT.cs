namespace RuiXue.GDT.Impl
{
    internal interface IRXGDT
    {
        void RegisterSdk();
        void Initialize(string actionSetId, string secretKey, string channel, string channelId);
        void ReportRegister(string method, bool success);
        void ReportLogin(string method, bool success);
        void ReportCreateRole(string role);
        void ReportCheckout(string type, string name, string id, int number, bool isVirtualCurrency,
            string virtualCurrencyType, string currency, bool success);
        void ReportPurchase(string goodsType, string goodsName, string goodsId, int number,
            string goodsChannel, string currency, int valueInCents, bool success);
        void ReportQuestFinish(string id, string type, string name, int number, string description,
            bool success);
        void ReportShare(string channel, bool success);
        void ReportUpdateLevel(int level);
        void ReportRateApp(float value);
        void ReportViewContent(string type, string name, string id);
        void ReportAddToCart(string type, string name, string id, int number, bool success);
    }
}
