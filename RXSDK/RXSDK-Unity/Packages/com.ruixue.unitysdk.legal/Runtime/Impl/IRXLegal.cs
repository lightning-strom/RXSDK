namespace RuiXue.Legal.Impl
{
    internal interface IRXLegal
    {
        /// <summary>
        /// 获取法务配置
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void Legal(RequestResponseDelegate onResponse,
            RequestErrorDelegate onError);

    }
}
