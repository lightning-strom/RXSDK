
using System;
using System.Collections.Generic;

namespace RXSDK
{
    public interface ISocial
    {
        /**
        * 上报/更新经纬度坐标
        *
        * @param args  字典参数
        * @param callback 回调函数
        */
        void LbsUpdate(Dictionary<string, object> args, RXCallback<object> callback);

        /// <summary>
        /// 上报/更新经纬度坐标
        /// </summary>
        /// <param name="types">坐标分组，由 CP 自定义</param>
        /// <param name="lon"经度</param>
        /// <param name="lat">纬度</param>
        /// <param name="callback"></param>
        void LbsUpdate(string[] types, float lon, float lat, RXCallback<object> callback);

        /**
         * 获取指定半径内的其他用户信息
         *
         * @param args  字典参数
         * @param callback 回调函数
         */
        void LbsRadius(Dictionary<string, object> args, RXCallback<object> callback);

        /// <summary>
        /// 上报/更新经纬度坐标
        /// </summary>
        /// <param name="types">坐标分组，由 CP 自定义</param>
        /// <param name="lon">WGS84 经度</param>
        /// <param name="lat">WGS84 纬度</param>
        /// <param name="radius">限定半径距离，单位：米</param>
        /// <param name="count">获取数量，0 表示获取全部</param>
        /// <param name="page">获取第几页的数据 从 1 开始</param>
        /// <param name="page_size">每页数量</param>
        /// <param name="callback"></param>
        void LbsRadius(string types, float lon, float lat, float radius, int count, int page, int page_size, RXCallback<object> callback);

        /**
         * 删除经纬度坐标
         *
         * @param args  字典参数
         * @param callback 回调函数
         */
        void LbsDelete(Dictionary<string, object> args, RXCallback<object> callback);

        /// <summary>
        ///  删除经纬度坐标
        /// </summary>
        /// <param name="types">坐标分组，由 CP 自定义</param>
        /// <param name="callback"></param>
        void LbsDelete(string[] types, RXCallback<object> callback);

        /**
         * 给用户设置CP的自定义信息
         *
         * @param args  字典参数
         * @param callback 回调函数
         */
        void UserSetCustom(Dictionary<string, object> args, RXCallback<object> callback);

        /// <summary>
        /// 设置用户自定义信息
        /// </summary>
        /// <param name="custom">用户自定义信息</param>
        /// <param name="callback"></param>
        void UserSetCustom(string custom, RXCallback<object> callback);

        /**
         * 添加自定关系
         *
         * @param args  target	string	是	对方 OpenID
         *                 types	object	是	"CP 自定义关系类型列表，其值是一个 字典简直对列表，格式为：{类型标识符(string):是否为双向关系}"
         *                 target_remarks	string	否	用户给Target设置的备注信息（最长512字符）
         *                 user_remarks	string	否	Target给用户设置的备注信息（最长512字符）
         * @param callback 回调函数
         */
        void RelationAdd(Dictionary<string, object> args, RXCallback<object> callback);

        /// <summary>
        /// 添加自定义关系
        /// </summary>
        /// <param name="target">对方 OpenID</param>
        /// <param name="types">CP 自定义关系类型列表，其值是一个 map 简直对列表，value 必须为 bool</param>
        /// <param name="target_remarks">用户给 Target 设置的备注信息（最长 512 字符）</param>
        /// <param name="user_remarks"></param>
        /// <param name="callback">Target 给用户设置的备注信息（最长 512 字符）</param>
        void RelationAdd(string target, Dictionary<string, object> types, string target_remarks, string user_remarks, RXCallback<object> callback);


        /**
         * 删除自定关系
         *
         * @param args  target	string	是	对方 OpenID
         *                 types	object	是	"CP 自定义关系类型列表，其值是一个 字典简直对列表，格式为：{类型标识符(string):是否为双向关系}"
         * @param callback 回调函数
         */
        void RelationDelete(Dictionary<string, object> args, RXCallback<object> callback);


        /// <summary>
        /// 删除自定义关系
        /// </summary>
        /// <param name="target">对方 OpenID</param>
        /// <param name="types"><CP 自定义关系类型列表，其值是一个 map 简直对列表，value 必须为 bool/param>
        /// <param name="callback"></param>
        void RelationDelete(string target, Dictionary<string, object> types, RXCallback<object> callback);

        /**
         * 更新自定关系备注
         *
         * @param args target	string	是	对方 OpenID
         *                type	string	是	CP 自定义关系类型
         *                target_remarks	string	否	用户给Target设置的备注信息（最长512字符）
         */
        void UpdateRemarks(Dictionary<string, object> args, RXCallback<object> callback);

        /// <summary>
        /// 更新用户自定义关系备注
        /// </summary>
        /// <param name="target">对方 OpenID	</param>
        /// <param name="type">CP 自定义关系类型</param>
        /// <param name="target_remarks">用户给 Target 设置的备注信息（最长 512 字符）</param>
        /// <param name="callback"></param>
        void UpdateRemarks(string target, string type, string target_remarks, RXCallback<object> callback);

        /**
         * 判断两用户是否存在某自定关系
         *
         * @param args  target	string	是	对方 OpenID
         *                 type	string	是	CP 自定义关系类型
         * @param callback callback
         */
        void HasRelation(Dictionary<string, object> args, RXCallback<object> callback);

        /// <summary>
        /// 判断两用户是否存在某自定关系
        /// </summary>
        /// <param name="target">对方 OpenID	</param>
        /// <param name="type">CP 自定义关系类型</param>
        /// <param name="callback"></param>
        void HasRelation(string target, string type, RXCallback<object> callback);

        /**
         * 获取自定关系列表
         *
         * @param args  字典参数
         * @param callback 回调函数
         */
        void RelationList(Dictionary<string, object> args, RXCallback<object> callback);

        /// <summary>
        /// 获取自定关系列表
        /// </summary>
        /// <param name="type">CP 自定义关系类型</param>
        /// <param name="callback"></param>
        void RelationList(string type, RXCallback<object> callback);

        /**
         * 添加好友列表
         *
         * @param args  字典参数
         * @param callback 回调函数
         */
        void AddFriends(Dictionary<string, object> args, RXCallback<object> callback);

        /// <summary>
        /// 设置好友关系
        /// </summary>
        /// <param name="target"></param>
        /// <param name="target_remarks"></param>
        /// <param name="user_remarks"></param>
        /// <param name="callback"></param>
        void AddFriends(string target, string target_remarks, string user_remarks, RXCallback<object> callback);

        /**
         * 删除好友
         *
         * @param args  字典参数
         * @param callback 回调函数
         */
        void RemoveFriends(Dictionary<string, object> args, RXCallback<object> callback);

        /// <summary>
        /// 删除好友
        /// </summary>
        /// <param name="target">对方 OpenID	</param>
        /// <param name="callback"></param>
        void RemoveFriends(string target, RXCallback<object> callback);

        /**
         * 更新好友关系备注
         */
        void UpdateFriendRemarks(Dictionary<string, object> args, RXCallback<object> callback);

        /// <summary>
        /// 更新好友备注
        /// </summary>
        /// <param name="target">对方 OpenID</param>
        /// <param name="target_remarks">用户给 Target 设置的备注信息（最长 512 字符）</param>
        /// <param name="callback"></param>
        void UpdateFriendRemarks(string target, string target_remarks, RXCallback<object> callback);

        /**
         * 判断两用户是否为好友
         */
        void IsFriend(Dictionary<string, object> args, RXCallback<object> callback);

        /// <summary>
        /// 判断两用户是否为好友
        /// </summary>
        /// <param name="target">对方 OpenID	</param>
        /// <param name="callback"></param>
        void IsFriend(string target, RXCallback<object> callback);

        /**
         * 获取好友列表
         *
         * @param args  字典参数
         * @param callback 回调函数
         */
        void RelationFriends(Dictionary<string, object> args, RXCallback<object> callback);
        /// <summary>
        /// 获取好友列表
        /// </summary>
        /// <param name="callback"></param>
        void RelationFriends(RXCallback<object> callback);
    }

    class SocialAPI : Singleton<SocialAPI>, ISocial
    {
        public void AddFriends(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RELATION_ADD_FRIEND, args, callback);
        }

        public void AddFriends(string target, string target_remarks, string user_remarks, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "target", target },
                { "user_remarks", user_remarks },
                { "target_remarks", target_remarks }
            };
            API.Post(APIPath.RELATION_ADD_FRIEND, args, callback);
        }



        public void HasRelation(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RELATION_HAS_RELATION, args, callback);
        }

        public void HasRelation(string target, string type, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "target", target },
                { "type", type }
            };
            API.Post(APIPath.RELATION_HAS_RELATION, args, callback);

        }

        public void IsFriend(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RELATION_IS_FRIEND, args, callback);
        }

        public void IsFriend(string target, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "target", target }
            };
            API.Post(APIPath.RELATION_IS_FRIEND, args, callback);
        }

        public void LbsDelete(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.LBS_DELETE, args, callback);
        }

        public void LbsDelete(string[] types, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "types", types }
            };
            API.Post(APIPath.LBS_DELETE, args, callback);
        }

        public void LbsRadius(Dictionary<string, object> args, RXCallback<object> callback)
        {

            API.Post(APIPath.LBS_RADIUS, args, callback);
        }

        public void LbsRadius(string types, float lon, float lat, float radius, int count, int page, int page_size, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "types", types },
                { "lon", lon },
                { "lat", lat },
                { "radius", radius },
                { "count", count },
                { "page", page },
                { "page_size", page_size }
            };
            API.Post(APIPath.LBS_RADIUS, args, callback);
        }

        public void LbsUpdate(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.LBS_UPDATE, args, callback);
        }

        public void LbsUpdate(string[] types, float lon, float lat, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "types", types },
                { "lon", lon },
                { "lat", lat }
            };
            API.Post(APIPath.LBS_UPDATE, args, callback);
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

        public void RelationAdd(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RELATION_ADD, args, callback);

        }

        public void RelationAdd(string target, Dictionary<string, object> types, string target_remarks, string user_remarks, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "target", target },
                { "types", types },
                { "target_remarks", target_remarks },
                { "user_remarks", user_remarks }
            };
            API.Post(APIPath.RELATION_ADD, args, callback);
        }

        public void RelationDelete(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RELATION_DELETE, args, callback);
        }

        public void RelationDelete(string target, Dictionary<string, object> types, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "target", target },
                { "types", types }
            };
            API.Post(APIPath.RELATION_DELETE, args, callback);
        }

        public void RelationFriends(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RELATION_FRIENDS, args, callback);
        }

        public void RelationFriends(RXCallback<object> callback)
        {
            Dictionary<string, object> args = new();
            API.Post(APIPath.RELATION_FRIENDS, args, callback);
        }

        public void RelationList(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RELATION_LIST, args, callback);
        }

        public void RelationList(string type, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "type", type }
            };
            API.Post(APIPath.RELATION_LIST, args, callback);
        }

        public void RemoveFriends(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RELATION_DEL_FRIEND, args, callback);
        }

        public void RemoveFriends(string target, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "target", target }
            };
            API.Post(APIPath.RELATION_DEL_FRIEND, args, callback);
        }


        public void UpdateFriendRemarks(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RELATION_UPDATE_FRIEND_REMARKS, args, callback);
        }

        public void UpdateFriendRemarks(string target, string target_remarks, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "target", target },
                { "target_remarks", target_remarks }
            };
            API.Post(APIPath.RELATION_UPDATE_FRIEND_REMARKS, args, callback);

        }

        public void UpdateRemarks(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.RELATION_UPDATE_REMARKS, args, callback);
        }

        public void UpdateRemarks(string target, string type, string target_remarks, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "target", target },
                { "type", type },
                { "target_remarks", target_remarks }
            };
            API.Post(APIPath.RELATION_UPDATE_REMARKS, args, callback);
        }

        public void UserSetCustom(Dictionary<string, object> args, RXCallback<object> callback)
        {
            API.Post(APIPath.USER_SET_CUSTOM, args, callback);
        }

        public void UserSetCustom(string custom, RXCallback<object> callback)
        {
            Dictionary<string, object> args = new()
            {
                { "custom", custom }
            };
            API.Post(APIPath.USER_SET_CUSTOM, args, callback);
        }
    }
}