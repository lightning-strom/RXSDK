
using RuiXue.FeedbackUI.Impl;

namespace RuiXue.FeedbackUI
{
    public static class RXFeedbackUI
    {
#if UNITY_ANDROID
        private static readonly IRXFeedbackUI _sdk = new RXFeedbackUIAndroid();
#elif UNITY_IOS
        private static readonly IRXFeedbackUI _sdk = new RXFeedbackUIIOS();
#else
        private static readonly IRXFeedbackUI _sdk = new RXFeedbackUINotSupport();
#endif

            /// <summary>
            /// 显示创建意见反馈UI
            /// </summary>
            public static void ShowCreateFeedbackView()
            {
                    _sdk.ShowCreateFeedbackView();
            }

            /// <summary>
            /// 显示意见反馈列表UI
            /// </summary>
            public static void ShowFeedbackListView()
            {
                _sdk.ShowFeedbackListView();
            }

    }
}