using System.Collections.Generic;

namespace RuiXue.FeedbackUI.Impl
{
    internal class RXFeedbackUINotSupport : IRXFeedbackUI
    {
        public void ShowCreateFeedbackView()
        {
            throw new System.NotImplementedException();
        }

        public void ShowFeedbackListView()
        {
            throw new System.NotImplementedException();
        }
    }
}