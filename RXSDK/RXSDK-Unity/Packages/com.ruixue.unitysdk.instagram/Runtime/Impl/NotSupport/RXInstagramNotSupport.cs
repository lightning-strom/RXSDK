namespace RuiXue.Instagram.Impl
{
    internal class RXInstagramNotSupport : IRInstagram
    {
        public void init(string clientID, string redirectURI)
        {
            LogUtil.WarningNotSupport("init");
        }
    }
}