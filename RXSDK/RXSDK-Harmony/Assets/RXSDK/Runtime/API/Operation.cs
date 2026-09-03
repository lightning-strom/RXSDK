
using System;
using System.Collections.Generic;

namespace RXSDK
{
    public interface IOperationAPI
    {
        void GetAnnouncement(int limit, RXCallback<object> callback);
        void GetEmailList(string userId, RXCallback<object> callback);
        void DeleteEmail(string userId, int type, int? mailId, RXCallback<object> callback);
        void GetEmailDetail(string userId, int mailId, RXCallback<object> callback);
        void GetEmailAward(string userId, int type, int? mailId, RXCallback<object> callback);
    }

    class OperationAPI : Singleton<OperationAPI>, IOperationAPI
    {
        public const string MAINTAIN = "v1/operationtoolsapi/maintain/get";
        public const string MAIL_LIST = "v1/operationtoolsapi/rxmail/cpuser/list";
        public const string MAIL_DELETE = "v1/operationtoolsapi/rxmail/cpuser/delete";
        public const string MAIL_DETAIL = "v1/operationtoolsapi/rxmail/cpuser/detail";
        public const string MAIL_RECEIVE = "v1/operationtoolsapi/rxmail/cpuser/receive";

        public void GetAnnouncement(int limit, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "limit", limit },
                { "product_id", SDKConfig.Instance.ProductId },
                { "channel_id", SDKConfig.Instance.ChannelId }
            };
            API.Post(MAINTAIN, args, callback);
        }
        public void GetEmailList(string userId, RXCallback<object> callback)
        {
            var args = new Dictionary<string, object>
            {
                { "cp_user_id", userId }
            };
            API.Post(MAIL_LIST, args, callback);
        }

        public void DeleteEmail(string userId, int type, int? mailId, RXCallback<object> callback)
        {
            var args = new Dictionary<string, object>
            {
                { "cp_user_id", userId },
                { "type", type }
            };

            if (mailId.HasValue)
            {
                args["rx_mail_id"] = mailId.Value;
            }

            API.Post(MAIL_DELETE, args, callback);
        }

        public void GetEmailDetail(string userId, int mailId, RXCallback<object> callback)
        {
            var args = new Dictionary<string, object>
            {
                { "cp_user_id", userId },
                { "rx_mail_id", mailId }
            };
            API.Post(MAIL_DETAIL, args, callback);
        }

        public void GetEmailAward(string userId, int type, int? mailId, RXCallback<object> callback)
        {
            var args = new Dictionary<string, object>
            {
                { "cp_user_id", userId },
                { "type", type }
            };

            if (mailId.HasValue)
            {
                args["rx_mail_id"] = mailId.Value;
            }

            API.Post(MAIL_RECEIVE, args, callback);
        }
    }

}