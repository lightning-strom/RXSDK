using RuiXue.GDT;
using UnityEngine;

public sealed class RuiXueGDTDemo : MonoBehaviour
{
    [SerializeField] private string actionSetId;
    [SerializeField] private string secretKey;

    public void RegisterSdk()
    {
        RXGDT.RegisterSdk();
    }

    public void Initialize()
    {
        RXGDT.Initialize(actionSetId, secretKey, "tencent", "tencent");
    }

    public void ReportConversionEvents()
    {
        RXGDT.ReportRegister("guest", true);
        RXGDT.ReportLogin("guest", true);
        RXGDT.ReportCreateRole("role-id");
        RXGDT.ReportCheckout("item", "礼包", "sku-1", 1, false, "", "CNY", true);
        RXGDT.ReportPurchase("item", "礼包", "sku-1", 1, "wechat", "CNY", 600, true);
        RXGDT.ReportQuestFinish("tutorial-1", "tutorial", "新手教学", 1, "", true);
        RXGDT.ReportShare("wechat", true);
        RXGDT.ReportUpdateLevel(10);
        RXGDT.ReportRateApp(5.0f);
        RXGDT.ReportViewContent("item", "礼包", "sku-1");
        RXGDT.ReportAddToCart("item", "礼包", "sku-1", 1, true);
    }
}
