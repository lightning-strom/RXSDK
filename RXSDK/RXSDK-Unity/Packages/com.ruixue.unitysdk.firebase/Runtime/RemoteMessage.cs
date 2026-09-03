using System.Collections.Generic;

namespace RuiXue.Firebase
{
    public class RemoteMessage
    {
        public Dictionary<string, string> data;

        public string messageId;

        public string messageType;

        public string title;

        public string body;
        
        public string icon;

        public long eventTime;
        
    }
}