#### 请求参数（JSON）


| **字段**         | **类型**   | **是否必填** | **说明**                                                  | **示例**                        |
| -------------- | -------- | -------- | ------------------------------------------------------- | ----------------------------- |
| user           | []String | 否        | 需要返回的用户注册信息字段，详见下方“user 支持查询字段”                         | `["openid","product_id"]`     |
| login          | []String | 否        | 需要返回的上次登录信息字段，详见下方“login 支持查询字段”                        | `["product_id","login_time"]` |
| current        | []String | 否        | 需要返回的本次请求信息字段，详见下方“current 支持查询字段”                      | `["ip","os"]`                 |
| aas            | []String | 否        | 需要返回的防沉迷信息字段，详见下方“aas 支持查询字段”                           | `["limit","aas"]`             |
| currentaccount | []String | 否        | 需要返回的当前登录凭证信息字段，详见下方“凭证支持查询字段”（仅 Accesstoken 调用有效）      | `["method","username"]`       |
| account        | []String | 否        | 需要返回的当前应用下全部登录凭证列表字段，详见下方“凭证支持查询字段”（仅 Accesstoken 调用有效） | `["method","username"]`       |
| openid         | String   | 否        | 瑞雪 openid；服务端签名调用时必填（与 cpuserid 二选一）                    | rxuxxxx                       |
| cpuserid       | String   | 否        | 游戏侧用户 ID；服务端签名调用时可代替 openid 定位用户                        | 10001                         |


> 说明：六个分组均为可选，至少传一个；分组传空数组或不传则对应数据不返回。Accesstoken 调用时由网关从 accesstoken 解析用户身份，无需在请求体传 `openid` / `cp_user_id`。

##### user 支持查询字段


| **查询字段**               | **响应字段**               | **说明**                  |
| ---------------------- | ---------------------- | ----------------------- |
| openid                 | openid                 | 瑞雪 openid               |
| cpuserid               | cpuserid               | 游戏侧用户 ID                |
| productid              | productid              | 注册产品                    |
| channelid              | channelid              | 注册渠道                    |
| custom                 | custom                 | 用户来源类型，枚举见下方“custom枚举值” |
| source                 | source                 | 用户实际来源（custom 的细分埋点）    |
| promoter               | promoter               | 注册时关联的推广员               |
| devicecode             | devicecode             | 注册时设备信息                 |
| subchannelid           | subchannelid           | 子渠道                     |
| platformid             | platformid             | 平台 ID                   |
| attr                   | attr                   | 用户属性                    |
| nickname               | nickname               | 昵称                      |
| avatar                 | avatar                 | 头像                      |
| regtime                | regtime                | 注册时间（Unix 秒）            |
| regip                  | regip                  | 注册 IP                   |
| birthday               | birthday               | 生日                      |
| age                    | age                    | 年龄（按生日计算）               |
| sex                    | sex                    | 性别                      |
| userstate              | userstate              | 用户状态                    |
| phone                  | phone                  | 手机号（掩码处理）               |
| email                  | email                  | 邮箱（掩码处理）                |
| flag                   | flag                   | 用户标记位，含义见下方“flag枚举值”    |
| topinviterplatformid   | topinviterplatformid   | 首次邀请人平台 ID              |
| topinviteropenid       | topinviteropenid       | 首次邀请人瑞雪 openid          |
| topinvitersubchannelid | topinvitersubchannelid | 首次邀请人子渠道                |
| inviterlevel           | inviterlevel           | 邀请人等级                   |
| invitersubchannelid    | invitersubchannelid    | 邀请人子渠道                  |
| inviteropenid          | inviteropenid          | 邀请人瑞雪 openid            |
| inviterplatformid      | inviterplatformid      | 邀请人平台 ID                |
| realauthid             | realauthid             | 实名认证 ID                 |
| realauthtime           | realauthtime           | 实名认证时间（Unix 秒）          |
| realauthid             | realauthid             | 实名认证 ID（需用户已实名时返回）      |
| realauthname           | realauthname           | 真实姓名（需用户已实名时返回）         |
| realauthidcard         | realauthidcard         | 身份证号码（需用户已实名时返回）        |
| realauthtime           | realauthtime           | 实名认证时间（需用户已实名时返回）       |
| realauthip             | realauthip             | 实名认证 IP（需用户已实名时返回）      |
| realauthdevicecode     | realauthdevicecode     | 实名认证设备码（需用户已实名时返回）      |


##### login 支持查询字段


| **查询字段**      | **说明**                          |
| ------------- | ------------------------------- |
| devicecode    | 上次登录的设备                         |
| productid     | 上次登录的产品                         |
| channelid     | 上次登录的渠道                         |
| loginip       | 上次登录的 IP                        |
| logintime     | 本次登录时间，格式 `2025-07-04 13:51:10` |
| lastlogintime | 上次登录时间，格式 `2025-07-04 13:51:10` |
| method        | 上次登录方式                          |


##### current 支持查询字段


| **查询字段**   | **说明**                  |
| ---------- | ----------------------- |
| productid  | 本次请求的产品                 |
| channelid  | 本次请求的渠道                 |
| devicecode | 本次请求的设备                 |
| ip         | 本次请求的 IP                |
| os         | 本次请求的系统（由 UserAgent 解析） |
| osversion  | 本次请求的系统版本               |


##### aas 支持查询字段


| **查询字段**    | **说明**                      |
| ----------- | --------------------------- |
| flag        | 防沉迷标志位（受限时置 `FlagAASLimit`） |
| limit       | 是否受防沉迷限制                    |
| aas         | 防沉迷控制下剩余可游戏秒数               |
| suitableage | 适用年龄（方便前端展示）                |
| trip        | 防沉迷提示语                      |


> 仅当请求了 aas 字段、且当前地区/账号类型未关闭防沉迷控制时才会进行防沉迷计算；已实名且成年的用户不受限制。

##### 凭证支持查询字段（currentaccount / account 通用）


| **查询字段**   | **说明**                                   |
| ---------- | ---------------------------------------- |
| userid     | 瑞雪用户 ID                                  |
| addtime    | 凭证添加时间（Unix 秒）                           |
| productid  | 注册产品 ID                                  |
| channelid  | 注册渠道 ID                                  |
| username   | 凭证用户名                                    |
| method     | 凭证类型，如 username/phone/email/thirdparty 等 |
| devicecode | 注册设备 ID                                  |


#### 响应结构（JSON）


| **字段** | **类型** | **说明**       |
| ------ | ------ | ------------ |
| code   | Number | 状态 等于0 为正常情况 |
| data   | Data   | 响应数据         |


##### Data


| **字段**         | **类型**            | **说明**        |
| -------------- | ----------------- | ------------- |
| user           | userData          | 用户注册时信息       |
| login          | loginData         | 用户上次登录信息      |
| current        | currentData       | 本次请求信息        |
| aas            | aasData           | 防沉迷信息         |
| currentaccount | credentialsData   | 当前登录凭证信息      |
| account        | []credentialsData | 当前应用下全部登录凭证列表 |


##### userData


| **字段**                 | **类型** | **说明**                           | **案例**                                           |
| ---------------------- | ------ | -------------------------------- | ------------------------------------------------ |
| openid                 | string | 瑞雪 openid                        | rxufoMlxBd47G8N5PbuwgCpJYSNyN-zXqe261Kbk         |
| cpuserid               | string | 游戏侧用户 ID                         | 10001                                            |
| custom                 | string | 用户来源类型                           | share                                            |
| source                 | string | 用户实际来源，例如 custom:share 当前字段为分享埋点 | failsharecoin                                    |
| productid              | string | 注册的产品                            | 1002                                             |
| channelid              | string | 注册的渠道                            | 818                                              |
| promoter               | string | 注册时关联的推广员                        | 12359                                            |
| devicecode             | string | 注册时设备信息                          | 40CF718FECB889D6418C97D8D3E11BC6                 |
| subchannelid           | string | 子渠道                              | 0                                                |
| platformid             | number | 平台 ID                            | 1                                                |
| attr                   | number | 用户属性                             | 0                                                |
| nickname               | string | 昵称                               | 瑞雪用户                                             |
| avatar                 | string | 头像                               | [https://xxx/avatar.png](https://xxx/avatar.png) |
| regtime                | number | 注册时间（Unix 秒）                     | 1751608270                                       |
| regip                  | string | 注册 IP                            | 124.235.118.55                                   |
| accounttype            | string | 账号类型                             | phone                                            |
| phonecontactid         | number | 手机号关联 ID                         | 100                                              |
| birthday               | string | 生日                               | 2000-01-01                                       |
| age                    | number | 年龄                               | 25                                               |
| sex                    | number | 性别                               | 1                                                |
| userstate              | number | 用户状态                             | 0                                                |
| phone                  | string | 手机号（掩码处理）                        | 1388000                                          |
| email                  | string | 邮箱（掩码处理）                         | a@xx.com                                         |
| flag                   | number | 用户标记位，含义见“flag枚举值”               | 8                                                |
| topinviterplatformid   | number | 首次邀请人平台 ID                       | 1                                                |
| topinviteropenid       | string | 首次邀请人瑞雪 openid                   | rxxxx                                            |
| topinvitersubchannelid | string | 首次邀请人子渠道                         | 0                                                |
| inviterlevel           | number | 邀请人等级                            | 1                                                |
| invitersubchannelid    | string | 邀请人子渠道                           | 0                                                |
| inviteropenid          | string | 邀请人瑞雪 openid                     | rxxxx                                            |
| inviterplatformid      | number | 邀请人平台 ID                         | 1                                                |
| realauthid             | number | 实名认证 ID                          | 100                                              |
| realauthname           | string | 真实姓名                             | 张三                                               |
| realauthidcard         | string | 身份证号码                            | 1101234                                          |
| realauthtime           | number | 实名认证时间（Unix 秒）                   | 1751608270                                       |
| realauthip             | string | 实名认证 IP                          | 124.235.118.55                                   |
| realauthdevicecode     | string | 实名认证设备码                          | 40CF718FECB889D6418C97D8D3E11BC6                 |


##### loginData


| **字段**        | **类型** | **说明**   | **案例**                           |
| ------------- | ------ | -------- | -------------------------------- |
| productid     | string | 上次登录的产品  | 1002                             |
| channelid     | string | 上次登录的渠道  | 818                              |
| devicecode    | string | 上次登录的设备  | 40CF718FECB889D6418C97D8D3E11BC6 |
| loginip       | string | 上次登录的 IP | 124.235.118.55                   |
| logintime     | string | 本次登录时间   | 2025-07-04 13:51:10              |
| lastlogintime | string | 上次登录时间   | 2025-07-04 13:51:10              |
| method        | string | 上次登录方式   | phone                            |


##### currentData


| **字段**     | **类型** | **说明**    | **案例**                           |
| ---------- | ------ | --------- | -------------------------------- |
| productid  | string | 本次请求的产品   | 1002                             |
| channelid  | string | 本次请求的渠道   | 818                              |
| devicecode | string | 本次请求的设备   | 40CF718FECB889D6418C97D8D3E11BC6 |
| ip         | string | 本次请求的 IP  | 124.235.118.55                   |
| os         | string | 本次请求的系统   | Android                          |
| osversion  | string | 本次请求的系统版本 | 18.5                             |


##### aasData


| **字段**      | **类型** | **说明**                    | **案例**   |
| ----------- | ------ | ------------------------- | -------- |
| flag        | number | 防沉迷标志位（受限时含 FlagAASLimit） | 2        |
| limit       | bool   | 是否受防沉迷限制                  | true     |
| aas         | number | 防沉迷控制下剩余可游戏秒数             | 3600     |
| suitableage | number | 适用年龄（方便前端展示）              | 18       |
| trip        | string | 防沉迷提示语                    | 未成年人保护提示 |


##### credentialsData


| **字段**     | **类型** | **说明**                                 | **案例**                           |
| ---------- | ------ | -------------------------------------- | -------------------------------- |
| userid     | number | 瑞雪用户 ID                                | 10001                            |
| addtime    | number | 凭证添加时间（Unix 秒）                         | 1751608270                       |
| productid  | string | 注册产品 ID                                | 1002                             |
| channelid  | string | 注册渠道 ID                                | 818                              |
| username   | string | 凭证用户名                                  | 1388000                          |
| method     | string | 凭证类型，如 username/phone/email/thirdparty | phone                            |
| devicecode | string | 注册设备 ID                                | 40CF718FECB889D6418C97D8D3E11BC6 |


#### custom枚举值


| **字段**      | **说明** |
| ----------- | ------ |
| ad          | 广告     |
| share       | 分享     |
| guide       | 导量     |
| subpackage  | 分包     |
| promoter    | 分包-推广员 |
| push        | 推送     |
| xingtu      | 星图     |
| douyinunion | 抖音联运   |
| activity    | 活动     |


#### flag枚举值

flag 为按位组合（bitmask），可同时置多位，按位与判断是否命中。


| **值** | **名称**                         | **说明**                  |
| ----- | ------------------------------ | ----------------------- |
| 1     | FlagNewUser                    | 新注册用户                   |
| 2     | FlagAASLimit                   | 进行防沉迷控制                 |
| 4     | FlagGuestBindThirdpartyAccount | 游客是否绑定了三方账号（仅游客登录返回时有效） |
| 8     | FlagHasFirstPhone              | 是否已完成首次绑定手机             |
| 16    | FlagHasFirstEmail              | 是否已完成首次绑定 Email         |
| 32    | FlagInDeregister               | 正处在注销流程中                |
| 64    | FlagTestAccount                | 测试账号                    |


> 说明：`user.flag` 由首绑手机/邮箱、注销中等状态组合而成；`aas.flag` 在受防沉迷限制时含 `FlagAASLimit`。

#### os枚举值


| **字段**  | **描述**                                                 |
| ------- | ------------------------------------------------------ |
| iPad    | (iPad; CPU OS 185 like Mac OS X)                       |
| Android | (Linux; Android 12; RTE-AL00 Build/HUAWEIRNA-AL00; wv) |
| iPhone  | (iPhone; CPU iPhone OS 185 like Mac OS X)              |
| Phone   | (Phone; OpenHarmony 5.0)                               |
| Windows | (Windows NT 10.0; Win64; x64)                          |


