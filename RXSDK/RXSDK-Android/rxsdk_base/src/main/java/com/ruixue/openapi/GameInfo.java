package com.ruixue.openapi;

/**
 * 游戏角色信息。
 *
 * <p>用于 {@link RXSdkApi#setGameInfo(GameInfo)} 统一传递角色状态。基础 SDK 会缓存
 * {@code roleId}/{@code serverId}，各渠道可按自身协议将其映射为创角、登录、升级或退出事件。</p>
 *
 * <p>建议完整上报时填写角色、区服、等级和事件类型；渠道专属字段统一放在 {@link #attach}，
 * 由对应渠道适配层解析。{@link #roleCreateTime} 使用 Unix 毫秒时间戳，若渠道要求秒级时间戳，
 * 由渠道适配层转换。</p>
 */

import android.text.TextUtils;

public class GameInfo {

    // 完整角色上报时的基础字段
    private String serverName;      // 区服显示名称
    private String serverId;        // 区服唯一标识
    private String roleName;        // 角色显示名称
    private String roleId;          // 角色唯一标识
    private String gameRoleLevel = "1"; // 角色等级；未填写时默认 1
    /**
     * 角色事件类型：0=未指定（仅缓存角色/区服信息）、1=创建角色、2=进入游戏、
     * 3=角色升级、4=退出游戏。
     */
    private int type;
    /**
     * 角色创建时间，Unix 毫秒时间戳。创建角色事件（{@code type=1}）建议填写；
     * 使用 {@link #GameInfo(int, String, String)} 且 {@code type=1} 时会自动设为当前时间。
     */
    private long roleCreateTime;

    // 可选角色属性
    private String partyId;         // 公会/帮派唯一标识
    private String partyName;       // 工会名称
    /**
     * 渠道扩展数据，建议使用 JSON 字符串。
     *
     * <p>例如角色职业、性别、好友列表等非通用字段。基础 SDK 不解析该字段，
     * 由目标渠道自行决定是否读取。</p>
     */
    private String attach;
    private String experience;      // 经验值
    private int vipLevel;           // vip等级
    private int gameRolePower;      // 战力
    /**
     * 游戏内余额/货币数量。使用字符串以兼容大数值、非整数或渠道自定义货币格式。
     */
    private String balance;

    public String getBalance() {
        return balance;
    }

    public void setBalance(String balance) {
        this.balance = balance;
    }

    /**
     * 构造仅用于缓存角色和区服信息的对象。
     *
     * <p>会以 {@code roleId} 作为默认角色名称、以 {@code serverId} 作为默认区服名称；
     * 空区服 ID 会归一为 {@code "default"}。事件类型保持 {@code 0}，不会自动创建角色事件。</p>
     *
     * @param roleId 角色唯一标识
     * @param serverId 区服唯一标识，可为空
     */
    public GameInfo(String roleId, String serverId) {
        this.roleId = roleId;
        this.roleName = roleId;
        if (TextUtils.isEmpty(serverId)) {
            serverId = "default";
        }
        this.serverId = serverId;
        this.serverName = serverId;
        if (type == 1) {
            this.roleCreateTime = System.currentTimeMillis();
        }
    }

    /**
     * 构造携带角色事件的基础信息对象。
     *
     * <p>会以 {@code roleId} 和 {@code serverId} 补全默认显示名称；空区服 ID 会归一为
     * {@code "default"}。当 {@code type=1} 时，创建时间默认使用构造时刻的 Unix 毫秒时间戳。</p>
     *
     * @param type 角色事件类型，建议使用 1-4
     * @param roleId 角色唯一标识
     * @param serverId 区服唯一标识，可为空
     */
    public GameInfo(int type, String roleId, String serverId) {
        this.type = type;
        this.roleId = roleId;
        this.roleName = roleId;
        if (TextUtils.isEmpty(serverId)) {
            serverId = "default";
        }
        this.serverId = serverId;
        this.serverName = serverId;
        if (type == 1) {
            this.roleCreateTime = System.currentTimeMillis();
        }
    }


    public String getServerName() {
        return serverName;
    }

    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public String getServerId() {
        return serverId;
    }

    public void setServerId(String serverId) {
        this.serverId = serverId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getPartyId() {
        return partyId;
    }

    public void setPartyId(String partyId) {
        this.partyId = partyId;
    }

    public String getPartyName() {
        return partyName;
    }

    public void setPartyName(String partyName) {
        this.partyName = partyName;
    }

    public String getGameRoleLevel() {
        return gameRoleLevel;
    }

    public void setGameRoleLevel(String gameRoleLevel) {
        this.gameRoleLevel = gameRoleLevel;
    }

    public String getAttach() {
        return attach;
    }

    public void setAttach(String attach) {
        this.attach = attach;
    }

    /**
     * 获取角色事件类型。
     *
     * <p>方法名为历史 API，返回值含义见 {@link #type}。</p>
     *
     * @return 0（未指定）或 1-4 对应的角色事件类型
     */
    public int Type() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public long getRoleCreateTime() {
        return roleCreateTime;
    }

    /**
     * 获取角色创建时间的字符串形式。
     *
     * <p>未设置时返回调用当刻的 Unix 毫秒时间戳；此方法不会回写 {@link #roleCreateTime}。
     * 若渠道要求秒级时间戳，应在渠道适配层进行转换。</p>
     *
     * @return Unix 毫秒时间戳字符串
     */
    public String getRoleCreateTimeString() {
        return String.valueOf(roleCreateTime > 0 ? roleCreateTime : System.currentTimeMillis());
    }

    public void setRoleCreateTime(long roleCreateTime) {
        this.roleCreateTime = roleCreateTime;
    }

    public int getVipLevel() {
        return vipLevel;
    }

    public void setVipLevel(int vipLevel) {
        this.vipLevel = vipLevel;
    }

    public int getGameRolePower() {
        return gameRolePower;
    }

    public void setGameRolePower(int gameRolePower) {
        this.gameRolePower = gameRolePower;
    }

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

//    /**
//     * 验证GameInfo对象的必传字段
//     * @return 验证通过返回true，否则返回false
//     */
//    public boolean validateGameInfo() {
//        // 验证基础必传字段非空
//        if (isEmpty(this.getServerName())
//                || isEmpty(this.getServerId())
//                || isEmpty(this.getRoleName())
//                || isEmpty(this.getRoleId())
//                || this.getGameRoleLevel() <= 0) {
//            return false;
//        }
//        // 验证type合法性（1-4）
//        int type = this.getType();
//        if (type < 1 || type > 4) {
//            return false;
//        }
//        // 验证type=1时角色创建时间必传
//        if (type == 1 && this.getRoleCreateTime() == null) {
//            return false;
//        }
//        return true;
//    }
}
