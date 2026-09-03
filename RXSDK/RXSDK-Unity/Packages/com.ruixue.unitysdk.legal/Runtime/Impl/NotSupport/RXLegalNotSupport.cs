namespace RuiXue.Legal.Impl
{
    internal class RXLegalNotSupport : IRXLegal
    {
        public void Legal(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("Legal");
        }
    }
}