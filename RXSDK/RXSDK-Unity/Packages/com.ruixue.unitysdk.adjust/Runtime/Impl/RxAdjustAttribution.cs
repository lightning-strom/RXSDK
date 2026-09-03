using System;

namespace RuiXue.Adjust
{
    [Serializable]
    public class RxAdjustAttribution
    {
        public string trackerToken;
        public string trackerName;
        public string network;
        public string campaign;
        public string adgroup;
        public string creative;
        public string clickLabel;
        public string adid;
        public string costType;
        public double costAmount;
        public string costCurrency;
        public string fbInstallReferrer;
    }
}