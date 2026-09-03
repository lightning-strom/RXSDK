using System;

namespace RuiXue.GDT
{
    [Serializable]
    public sealed class RXGDTCheckoutEvent
    {
        public string type;
        public string name;
        public string id;
        public int number;
        public bool isVirtualCurrency;
        public string virtualCurrencyType;
        public string currency;
        public bool success;
    }

    [Serializable]
    public sealed class RXGDTPurchaseEvent
    {
        public string goodsType;
        public string goodsName;
        public string goodsId;
        public int number;
        public string goodsChannel;
        public string currency;
        /// <summary>真实货币金额，单位：分。</summary>
        public int valueInCents;
        public bool success;
    }

    [Serializable]
    public sealed class RXGDTQuestEvent
    {
        public string id;
        public string type;
        public string name;
        public int number;
        public string description;
        public bool success;
    }

    [Serializable]
    public sealed class RXGDTCartEvent
    {
        public string type;
        public string name;
        public string id;
        public int number;
        public bool success;
    }
}
