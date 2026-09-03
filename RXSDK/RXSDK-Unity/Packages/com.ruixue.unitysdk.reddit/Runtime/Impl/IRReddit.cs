namespace RuiXue.Reddit.Impl
{
    internal interface IRReddit
    {
        /// <summary>
        /// reddit初始化客户端id与重定向网址
        /// </summary>
        /// <param name="clientID"></param>
        /// <param name="redirectURI"></param>
        /// <returns></returns>
        public void init(string clientID, string redirectURI);

    }
}
