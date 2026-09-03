using System.Collections.Generic;
using Newtonsoft.Json;

namespace RXSDK.Data
{
    public abstract class DataBean
    {
        private static readonly JsonSerializerSettings _jsonSettings = new()
        {
            NullValueHandling = NullValueHandling.Ignore
        };

        public string ToJson()
        {
            return JsonConvert.SerializeObject(this, Formatting.None, _jsonSettings);
        }

        public override string ToString()
        {
            return ToJson();
        }
    }

}