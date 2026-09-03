using System.Collections.Generic;
using System.Runtime.InteropServices;

#if UNITY_IOS
namespace RuiXue.FeedbackUI.Impl
{
    internal class RXFeedbackUIIOS : IRXFeedbackUI
    {
        public void ShowCreateFeedbackView()
        {
            ios_showCreateFeedbackView();
        }

        public void ShowFeedbackListView()
        {
            ios_showFeedbackListView();
        }
        
        [DllImport("__Internal")]
        private static extern void ios_showCreateFeedbackView();
        
        [DllImport("__Internal")]
        private static extern void ios_showFeedbackListView();
       
    }
}
#endif