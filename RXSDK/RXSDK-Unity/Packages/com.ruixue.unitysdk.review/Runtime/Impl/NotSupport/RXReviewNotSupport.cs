namespace RuiXue.Review.Impl
{
    internal class RXReviewNotSupport:IRXReview
    {
        public bool JumpToAppStore()
        {
            LogUtil.WarningNotSupport("JumpToAppStore");
            return false;
        }
    }
}