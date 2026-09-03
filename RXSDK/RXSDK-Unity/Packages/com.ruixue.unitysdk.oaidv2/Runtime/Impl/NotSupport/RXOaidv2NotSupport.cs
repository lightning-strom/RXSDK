namespace RuiXue.Oaidv2.Impl.NotSupport
{
    public class RXOaidv2NotSupport : IRXOaidv2
    {
        #if UNITY_ANDROID   
        public void InitOaidSdk(string certString, AppOaidCallbackJavaProxy onResponse)
        {
            throw new System.NotImplementedException();
        }
        #endif

        public void InitOaidSdk(string certString)
        {
            throw new System.NotImplementedException();
        }

        public bool IsSupport()
        {
            throw new System.NotImplementedException();
        }

        public string GetOAID()
        {
            throw new System.NotImplementedException();
        }
    }
}