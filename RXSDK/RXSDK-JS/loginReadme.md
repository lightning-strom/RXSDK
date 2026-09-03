login逻辑
method: virtual | minigame


#virtual
虚拟账号。用于一些暂时不想接入瑞雪通行证的账号体系，但要使用瑞雪的分享、统计等功能的游戏项目，相当于将游戏项目自身作为一个三方账号平台。

virtual 的请求参数
logindata	string	CP 账号的部分信息，使用产品包的 AppKey 加密。明文信息为包含一个 string 类型的 ext 字段的 json object，ext 为 CP 服务器中该账号的唯一 ID。
regtime	string	注册日期，格式为 "2006-01-02 15:04:05"。
nickname	string	昵称。
avatar	string	头像地址。
sex	number	性别。




