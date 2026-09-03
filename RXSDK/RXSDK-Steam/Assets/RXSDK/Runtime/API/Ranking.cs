using System;
using System.Collections.Generic;
using RXSDK.Net;

namespace RXSDK
{

    public interface IRanking
    {

        /** 增加用户分数
         * @param hashMap  rank_id	string	是	字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）	0_100_168_weekly
         *                 score	int	是	增加的分数值	100
         * @param callback callback
         */
        void AddScore(Dictionary<string, object> args, RXCallback<object> callback);

        /** 增加用户分数
         * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）
         * @param score    增加的分数值
         * @param callback callback
         */
        void AddScore(string rank_id, int score, RXCallback<object> callback);

        /** 设置用户分数
         * @param hashMap  rank_id	string	是	字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）	0_100_168_weekly
         *                 score	int	是	增加的分数值	100
         * @param callback callback
         */
        void SetScore(Dictionary<string, object> args, RXCallback<object> callback);

        /** 设置用户分数
         * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）
         * @param score    增加的分数值
         * @param callback callback
         */
        void SetScore(string rank_id, int score, RXCallback<object> callback);

        /** 查询用户分数
         * @param hashMap  rank_id	string	是	字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）	0_100_168_weekly
         *                 open_id	string	是	目标用户 OpenID	rxuSl4QZoNk0G1HY2-Za6GlO7wO-p_ej
         * @param callback callback
         */
        void QueryUserRank(Dictionary<string, object> args, RXCallback<object> callback);

        /** 查询用户分数
         * @param open_id  目标用户 OpenID
         * @param callback callback
         */
        void QueryUserRank(string rank_id, string open_id, RXCallback<object> callback);

        /** 获取排行榜列表
         * @param hashMap  rank_id	string	是	字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）	0_100_168_weekly
         *                 start_rank	int	是	获取排行榜开始排名。取值[1,榜单容量)。可以用于分页加载	1
         *                 end_rank	int	是	获取排行榜结束排名。取值[1,榜单容量]。可以用于分页加载	2
         * @param callback callback
         */
        void GetRankList(Dictionary<string, object> args, RXCallback<object> callback);

        /** 获取排行榜列表
         * @param rank_id    字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）
         * @param start_rank 获取排行榜开始排名。取值[1,榜单容量)。可以用于分页加载	1
         * @param end_rank   获取排行榜结束排名。取值[1,榜单容量]。可以用于分页加载	2
         * @param callback   callback
         */
        void GetRankList(string rank_id, int start_rank, int end_rank, RXCallback<object> callback);

        /** 获取好友排行榜列表
         * @param hashMap  rank_id	string	是	字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）	0_100_168_weekly
         * @param callback callback
         */
        void FriendsRank(Dictionary<string, object> args, RXCallback<object> callback);

        /** 获取好友排行榜列表
         * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）
         * @param callback callback
         */
        void FriendsRank(string rank_id, RXCallback<object> callback);
    }
    class RankingAPI : Singleton<RankingAPI>, IRanking
    {

        public void AddScore(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RANK_ADDSCORE, args, callback);
        }


        public void AddScore(string rank_id, int score, RXCallback<object> callback)
        {

            Dictionary<string, object> args = new()
            {
                { "rank_id", rank_id },
                { "score", score }
            };
            API.Post(APIPath.RANK_ADDSCORE, args, callback);
        }

        public void FriendsRank(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RANK_FRIENDSRANK, args, callback);
        }

        public void FriendsRank(string rank_id, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "rank_id", rank_id }
            };

            API.Post(APIPath.RANK_FRIENDSRANK, args, callback);
        }

        public void GetRankList(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RANK_GETRANKLIST, args, callback);
        }

        public void GetRankList(string rank_id, int start_rank, int end_rank, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "rank_id", rank_id },
                { "start_rank", start_rank },
                { "end_rank", end_rank }
            };
            API.Post(APIPath.RANK_GETRANKLIST, args, callback);
        }

        public void QueryUserRank(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RANK_QUERYUSERRANK, args, callback);
        }

        public void QueryUserRank(string rank_id, string open_id, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "rank_id", rank_id },
                { "open_id", open_id }
            };

            API.Post(APIPath.RANK_QUERYUSERRANK, args, callback);
        }

        public void SetScore(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RANK_SETSCORE, args, callback);
        }

        public void SetScore(string rank_id, int score, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "rank_id", rank_id },
                { "score", score }
            };
            API.Post(APIPath.RANK_SETSCORE, args, callback);
        }
    }
}