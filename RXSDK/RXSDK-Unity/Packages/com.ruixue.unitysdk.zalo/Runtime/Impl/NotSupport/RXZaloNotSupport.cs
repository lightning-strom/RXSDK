namespace RuiXue.Zalo.Impl
{
    internal class RXZaloNotSupport : IRZalo
    {
        /// <summary>
        /// zalo初始化appID
        /// </summary>
        /// <param name="appID"></param>
        /// <returns></returns>
        public void init(string appID)
        {
            LogUtil.WarningNotSupport("init");
        }
    }
}