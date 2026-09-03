namespace RuiXue.Instagram.Impl
{
    internal interface IRInstagram
    {
        /// <summary>
        /// instagram初始化客户端id与重定向网址
        /// </summary>
        /// <param name="clientID"></param>
        /// <param name="redirectURI"></param>
        /// <returns></returns>
        public void init(string clientID, string redirectURI);

    }
}
