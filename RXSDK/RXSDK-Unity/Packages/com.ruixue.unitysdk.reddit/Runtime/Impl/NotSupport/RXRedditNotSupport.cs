namespace RuiXue.Reddit.Impl
{
    internal class RXRedditNotSupport : IRReddit
    {
        public void init(string clientID, string redirectURI)
        {
            LogUtil.WarningNotSupport("init");
        }
    }
}