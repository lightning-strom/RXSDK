namespace RuiXue.Quick.Impl
{
    public class RXQuickWrapperNotSupport:IRXQuick
    {
        public void SetGameRoleInfo(RXGameRoleInfo rxGameRoleInfo, bool createRole)
        {
            throw new System.NotImplementedException();
        }

        public void VerifyRealName(RequestResponseDelegate responseDelegate, 
            RequestErrorDelegate errorDelegate)
        {
            throw new System.NotImplementedException();
        }
    }
}