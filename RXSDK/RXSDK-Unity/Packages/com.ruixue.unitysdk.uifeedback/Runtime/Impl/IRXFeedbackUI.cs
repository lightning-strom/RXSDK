using System.Collections.Generic;

namespace RuiXue.FeedbackUI.Impl
{
    internal interface IRXFeedbackUI
    {
        /// <summary>
        /// 显示创建意见反馈UI
        /// </summary>
        public void ShowCreateFeedbackView();

        /// <summary>
        /// 显示意见反馈列表UI
        /// </summary>
        public void ShowFeedbackListView();
    }
}