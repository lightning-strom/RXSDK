using System;

namespace RuiXue.GDT
{
    [Serializable]
    public sealed class RXGDTConfig
    {
        public string actionSetId;
        public string secretKey;
        public string channel = "tencent";
        public string channelId = "tencent";

        public RXGDTConfig(string actionSetId, string secretKey, string channel = "tencent",
            string channelId = "tencent")
        {
            this.actionSetId = actionSetId;
            this.secretKey = secretKey;
            this.channel = channel;
            this.channelId = channelId;
        }
    }
}
