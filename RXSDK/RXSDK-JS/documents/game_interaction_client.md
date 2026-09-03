wx.getRelationFriendList 回调数据
object.success 回调函数

参数

Object res

|属性|	类型	|说明|
|------|------|------|
|signature	|string|	使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息|
|encryptedData	|string|	包括 RelationFriendData 在内的加密数据，详见加密数据解密算法|
|iv|	string|	加密算法的初始向量|

接口地址

| 场景 | 方法 | 路径 | 鉴权 |
|------|------|------|------|
| 小游戏客户端 | POST | `/v1/social/gameinteraction/info` | AccessToken |

## 4. 请求参数

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `iv` | string | 是 | 微信回调 `iv` |
| `encrypted_data` | string | 是 | 微信回调 `encryptedData` |
| `signature` | string | 是 | 微信回调 `signature` |
| `raw_data` | string | 是 | 微信签名校验原始字符串；回调无 `rawData` 时传 `""` |
| `openid` | string | CP 服必填 | 当前用户瑞雪 openid（客户端鉴权时由网关注入，无需传） |
| `cp_user_id` | string | 否 | CP 用户 ID，可替代 openid |

---

## 5. 响应参数

```json
{
  "code": 0,
  "data": {
    "openid": "当前用户瑞雪openid",
    "friends": [
      {
        "external_openid": "微信好友openid",
        "rx_openid": "好友瑞雪openid",
        "cp_user_id": "好友CP用户ID",
        "nickname": "好友昵称"
      }
    ]
  }
}
```

| 字段 | 说明 |
|------|------|
| `openid` | 当前登录用户的瑞雪 openid |
| `friends[].external_openid` | 微信侧好友 openid（解密原始数据） |
| `friends[].rx_openid` | 好友瑞雪 openid（Passport 查询，未注册可能为空） |
| `friends[].cp_user_id` | 好友 CP 用户 ID |
| `friends[].nickname` | 好友昵称 |
