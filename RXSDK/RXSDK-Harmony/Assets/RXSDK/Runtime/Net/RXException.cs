using System;

namespace RXSDK
{
    public class RXException : Exception
    {

        public RXErrorCode Code { get; }

        public RXException(string message, RXErrorCode code) : base(message)
        {
            Code = code;
        }

        public RXException(string message, RXErrorCode code, Exception innerException) : base(message, innerException)
        {
            Code = code;
        }

    }

}
