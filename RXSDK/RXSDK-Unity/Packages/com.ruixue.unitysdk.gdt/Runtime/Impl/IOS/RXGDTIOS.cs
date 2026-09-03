#if UNITY_IOS && !UNITY_EDITOR
using System.Runtime.InteropServices;

namespace RuiXue.GDT.Impl
{
    internal sealed class RXGDTIOS : IRXGDT
    {
        public void RegisterSdk() => rx_gdt_register();

        public void Initialize(string actionSetId, string secretKey, string channel, string channelId) =>
            rx_gdt_initialize(actionSetId, secretKey);

        public void ReportRegister(string method, bool success) =>
            rx_gdt_report_register(method, success ? 1 : 0);

        public void ReportLogin(string method, bool success) =>
            rx_gdt_report_login(method, success ? 1 : 0);

        public void ReportCreateRole(string role) =>
            rx_gdt_report_create_role(role);

        public void ReportCheckout(string type, string name, string id, int number,
            bool isVirtualCurrency, string virtualCurrencyType, string currency, bool success) =>
            rx_gdt_report_checkout(type, name, id, number, isVirtualCurrency ? 1 : 0,
                virtualCurrencyType, currency, success ? 1 : 0);

        public void ReportPurchase(string goodsType, string goodsName, string goodsId, int number,
            string goodsChannel, string currency, int valueInCents, bool success) =>
            rx_gdt_report_purchase(goodsType, goodsName, goodsId, number, goodsChannel, currency,
                valueInCents, success ? 1 : 0);

        public void ReportQuestFinish(string id, string type, string name, int number,
            string description, bool success) =>
            rx_gdt_report_quest_finish(id, type, name, number, description, success ? 1 : 0);

        public void ReportShare(string channel, bool success) =>
            rx_gdt_report_share(channel, success ? 1 : 0);

        public void ReportUpdateLevel(int level) =>
            rx_gdt_report_update_level(level);

        public void ReportRateApp(float value) =>
            rx_gdt_report_rate_app(value);

        public void ReportViewContent(string type, string name, string id) =>
            rx_gdt_report_view_content(type, name, id);

        public void ReportAddToCart(string type, string name, string id, int number, bool success) =>
            rx_gdt_report_add_to_cart(type, name, id, number, success ? 1 : 0);

        [DllImport("__Internal")] private static extern void rx_gdt_register();
        [DllImport("__Internal")] private static extern void rx_gdt_initialize(string actionSetId,
            string secretKey);
        [DllImport("__Internal")] private static extern void rx_gdt_report_register(string method,
            int success);
        [DllImport("__Internal")] private static extern void rx_gdt_report_login(string method,
            int success);
        [DllImport("__Internal")] private static extern void rx_gdt_report_create_role(string role);
        [DllImport("__Internal")] private static extern void rx_gdt_report_checkout(string type,
            string name, string id, int number, int isVirtualCurrency, string virtualCurrencyType,
            string currency, int success);
        [DllImport("__Internal")] private static extern void rx_gdt_report_purchase(string goodsType,
            string goodsName, string goodsId, int number, string goodsChannel, string currency,
            int valueInCents, int success);
        [DllImport("__Internal")] private static extern void rx_gdt_report_quest_finish(string id,
            string type, string name, int number, string description, int success);
        [DllImport("__Internal")] private static extern void rx_gdt_report_share(string channel,
            int success);
        [DllImport("__Internal")] private static extern void rx_gdt_report_update_level(int level);
        [DllImport("__Internal")] private static extern void rx_gdt_report_rate_app(float value);
        [DllImport("__Internal")] private static extern void rx_gdt_report_view_content(string type,
            string name, string id);
        [DllImport("__Internal")] private static extern void rx_gdt_report_add_to_cart(string type,
            string name, string id, int number, int success);
    }
}
#endif
