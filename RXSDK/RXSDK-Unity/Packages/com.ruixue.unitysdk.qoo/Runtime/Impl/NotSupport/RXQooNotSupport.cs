namespace RuiXue.Qoo.Impl
{
    public class RXQooNotSupport:IRXQoo
    {
        public void CheckLicense(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("CheckLicense");
        }

        public void RestorePurchases(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("RestorePurchases");
        }

        public void Consume(string purchase_id, string token, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("purchase_id");
        }

        public void QueryProducts(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("QueryProducts");
        }

        public void QueryProductInfo(string productIds, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("QueryProductInfo");
        }

        public void QueryProducts(int page, int size, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("QueryProducts");
        }

        public void OpenGameDetail()
        {
            LogUtil.WarningNotSupport("OpenGameDetail");
        }

        public void LatestVersionCode(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("LatestVersionCode");
        }

        public bool SetLocale(string eng)
        {
            LogUtil.WarningNotSupport("SetLocale");
            return false;
        }

        public string GetDataFromResponse(string response)
        {
            LogUtil.WarningNotSupport("GetDataFromResponse");
            return "";
        }
    }
}