using System;

namespace RuiXue
{
    /// <summary>
    /// 第三方渠道游戏角色信息。
    /// </summary>
    public class GameInfo
    {
        /// <summary>角色 ID。</summary>
        public string roleId;
        /// <summary>角色名称，默认等于 roleId。</summary>
        public string roleName;
        /// <summary>服务器 ID，空值会被设为 default。</summary>
        public string serverId;
        /// <summary>服务器名称，默认等于 serverId。</summary>
        public string serverName;
        /// <summary>角色等级，默认 1。</summary>
        public string gameRoleLevel = "1";
        /// <summary>
        /// 操作类型。栩腾：1=选服、2=创角、3=进入游戏、4=升级；
        /// Quick：1=创角、2=进入游戏、3=升级、4=退出；
        /// MuMu：1=创角成功、2=登录成功、3=角色升级。
        /// 虎牙：1=创角、2=进游、3=升级、4=退出，均按当前角色快照上报。
        /// </summary>
        public int type;
        /// <summary>角色创建时间（Unix 毫秒）；type=1 时构造函数自动填充。</summary>
        public long roleCreateTime;
        /// <summary>公会 ID。</summary>
        public string partyId;
        /// <summary>公会名称。</summary>
        public string partyName;
        /// <summary>VIP 等级。</summary>
        public int vipLevel;
        /// <summary>角色战力。</summary>
        public int gameRolePower;
        /// <summary>经验值。</summary>
        public string experience;
        /// <summary>角色余额。</summary>
        public string balance;
        /// <summary>业务自定义透传字段。</summary>
        public string attach;

        /// <summary>
        /// 创建游戏角色信息，并补全角色名、服务器名、等级和创角时间默认值。
        /// </summary>
        public GameInfo(int type, string roleId, string serverId)
        {
            this.type = type;
            this.roleId = roleId;
            roleName = roleId;
            this.serverId = string.IsNullOrEmpty(serverId) ? "default" : serverId;
            serverName = this.serverId;

            if (type == 1)
            {
                roleCreateTime = (long)(DateTime.UtcNow -
                    new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds;
            }
        }
    }
}
