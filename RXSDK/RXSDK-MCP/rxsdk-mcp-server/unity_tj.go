package rxsdk

import "strings"

const UNITY_TJ_DEFAULT_VERSION = "tuanjie-openharmony"

const UnityTJInitCheckGuide = `【团结 OpenHarmony 前置检查】

1. 确认项目已包含 RXSDK 源码或包：
   - 搜索 Assets/RXSDK/Runtime/RuiXueSdk.cs
   - 搜索 namespace RXSDK

2. 关键入口：
   - 命名空间：RXSDK
   - 入口类：RuiXueSdk
   - 初始化：RuiXueSdk.Init(InitArgs, RXCallback<string>)
   - 新回调：RXCallback<T>，读取 RXResult<T>.code / data / msg

3. 团结 OpenHarmony 构建注意：
   - 不要套用普通 Unity v1 的 RuiXue 命名空间
   - 不要使用 RXLogin / RXPay 分模块入口
   - 支付、登录、分享、埋点均从 RXSDK.RuiXueSdk 静态方法进入`

func UnityTJUnifiedOutput(feature, version, installType, workspacePath string) map[string]any {
	if strings.TrimSpace(version) == "" {
		version = UNITY_TJ_DEFAULT_VERSION
	}
	if strings.TrimSpace(installType) == "" {
		installType = "source"
	}

	base := map[string]any{
		"sdkApiVersion": "tj",
		"version":       version,
		"initCheck":     UnityTJInitCheckGuide,
	}

	switch feature {
	case "init":
		base["usage"] = "团结 OpenHarmony SDK 初始化"
		base["code"] = unityTJInitSpec
	case "dependency":
		base["usage"] = "团结 OpenHarmony SDK 依赖接入"
		base["code"] = unityTJDependencySpec
	case "setup":
		base["usage"] = "团结 OpenHarmony SDK 接入步骤"
		base["instructions"] = strings.ReplaceAll(unityTJSetupSpec, "{{workspacePath}}", workspacePath)
		base["installType"] = installType
	case "agent":
		base["usage"] = "团结 OpenHarmony SDK Agent 指南"
		base["guide"] = unityTJAgentSpec
	case "login":
		base["usage"] = "团结 OpenHarmony 登录"
		base["spec"] = unityTJLoginSpec
	case "payment":
		base["usage"] = "团结 OpenHarmony 支付"
		base["spec"] = unityTJPaymentSpec
	case "share":
		base["usage"] = "团结 OpenHarmony 分享"
		base["spec"] = unityTJShareSpec
	case "tracking":
		base["usage"] = "团结 OpenHarmony 数据埋点"
		base["spec"] = unityTJTrackingSpec
	default:
		base["error"] = "团结 OpenHarmony 版当前 MCP 已覆盖 feature: init, dependency, setup, agent, login, payment, share, tracking；暂未覆盖: " + feature
	}
	return base
}

const unityTJDependencySpec = `# 瑞雪 SDK 团结 OpenHarmony 依赖

适用项目：ruixue_tj_unity / 团结引擎 OpenHarmony 构建。

接入方式：
1. 将 RXSDK 源码或包放入 Unity 项目 Assets/RXSDK。
2. 确认存在 Assets/RXSDK/Runtime/RuiXueSdk.cs。
3. 业务代码引用命名空间：

using RXSDK;

不要使用普通 Unity v1/v2 的包名和命名空间：
- 普通 v1: RuiXue / RXLogin / RXPay
- 普通 v2: RXSDK / SdkCallback
- 团结版: RXSDK.RuiXueSdk + RXCallback<T>`

const unityTJSetupSpec = `# 团结 OpenHarmony SDK 接入步骤

workspacePath: {{workspacePath}}

1. 检查 Assets/RXSDK/Runtime 是否存在。
2. 搜索 namespace RXSDK，确认入口类 RuiXueSdk 可用。
3. 在启动场景 MonoBehaviour 的 Awake/Start 中调用 RuiXueSdk.Init。
4. 登录使用 RuiXueSdk.Login(LoginMethod, Dictionary<string, object>, RXCallback<LoginData>)。
5. 支付使用 RuiXueSdk.Pay(PayArgs, RXCallback<object>)。
6. 分享使用 RuiXueSdk.Share(RXShareConfig, RXCallback<object>)。
7. 埋点使用 RuiXueSdk.Track(eventName, properties, distinctId)。

注意：团结版新接口优先用 RXCallback<T>，旧 Action<int, data, msg> 重载仅用于兼容。`

const unityTJAgentSpec = `# 团结 OpenHarmony Agent 指南

识别规则：
- 如果项目包含 ruixue_tj_unity、Assets/RXSDK/Runtime/RuiXueSdk.cs、namespace RXSDK，优先按团结 OpenHarmony 版处理。
- 不要生成普通 Unity v1 的 using RuiXue / RXLogin / RXPay。
- 不要生成普通 Unity v2 的 RXSDK.Initialize / SdkCallback。

推荐入口：
- 初始化：RuiXueSdk.Init(InitArgs, RXCallback<string>)
- 登录：RuiXueSdk.Login(LoginMethod, Dictionary<string, object>, RXCallback<LoginData>)
- 支付：RuiXueSdk.Pay(PayArgs, RXCallback<object>)
- 分享：RuiXueSdk.Share(RXShareConfig, RXCallback<object>)
- 埋点：RuiXueSdk.Track(...)`

const unityTJInitSpec = `# 团结 OpenHarmony 初始化

signature:
  namespace: RXSDK
  class: RuiXueSdk
  method: Init(InitArgs args, RXCallback<string> callback)

code: |
  using RXSDK;
  using UnityEngine;

  public class GameStart : MonoBehaviour
  {
      private void Start()
      {
          var args = new InitArgs
          {
              cpId = "your_cpid",
              productId = "your_product_id",
              channelId = "your_channel_id",
              baseUrls = new[] { "https://cn-api-test.ruixueyun.com" },
              debugEnable = true,
              cpRoleId = "role_001",
              regionTag = "server_001"
          };

          RuiXueSdk.Init(args, (ret, e) =>
          {
              if (ret != null && ret.code == 0)
              {
                  Debug.Log("RXSDK init success: " + ret.data);
              }
              else
              {
                  Debug.LogError("RXSDK init failed: " + (ret?.msg ?? e?.Message));
              }
          });
      }
  }`

const unityTJLoginSpec = `# 团结 OpenHarmony 登录

signature:
  namespace: RXSDK
  class: RuiXueSdk
  method: Login(LoginMethod method, Dictionary<string, object> ext, RXCallback<LoginData> callback)

code: |
  using System.Collections.Generic;
  using RXSDK;
  using UnityEngine;

  private void LoginGuest()
  {
      RuiXueSdk.Login(LoginMethod.Guest, new Dictionary<string, object>(), (ret, e) =>
      {
          if (ret != null && ret.code == 0)
          {
              Debug.Log("login success openid=" + ret.data?.openid);
          }
          else
          {
              Debug.LogError("login failed: " + (ret?.msg ?? e?.Message));
          }
      });
  }

  private void LoginByUsername(string username, string password)
  {
      RuiXueSdk.Login(LoginMethod.UserName, new Dictionary<string, object>
      {
          { "username", username },
          { "password", password }
      }, (ret, e) =>
      {
          Debug.Log(ret != null ? ret.msg : e?.Message);
      });
  }`

const unityTJPaymentSpec = `# 团结 OpenHarmony 支付

signature:
  namespace: RXSDK
  class: RuiXueSdk
  method: Pay(PayArgs args, RXCallback<object> callback)

code: |
  using System.Collections.Generic;
  using RXSDK;
  using UnityEngine;

  private void Pay()
  {
      var args = new PayArgs
      {
          pay_type = "harmony",
          goods_tag = "diamond_100",
          trade_no = System.DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString(),
          custom_ext = new Dictionary<string, object>
          {
              { "product_name", "100钻石" },
              { "product_desc", "购买100钻石" }
          }
      };

      RuiXueSdk.Pay(args, (ret, e) =>
      {
          if (ret != null && ret.code == 0)
              Debug.Log("pay success: " + ret.data);
          else
              Debug.LogError("pay failed: " + (ret?.msg ?? e?.Message));
      });
  }`

const unityTJShareSpec = `# 团结 OpenHarmony 分享

signature:
  namespace: RXSDK
  class: RuiXueSdk
  method: Share(RXShareConfig config, RXCallback<object> callback)

code: |
  using RXSDK;
  using UnityEngine;

  private void ShareKnockCard()
  {
      var config = new RXShareConfig
      {
          platform = "hw_knock",
          func = "peng-big"
      };

      RuiXueSdk.Share(config, (ret, e) =>
      {
          Debug.Log(ret != null ? ret.msg : e?.Message);
      });
  }`

const unityTJTrackingSpec = `# 团结 OpenHarmony 埋点

signature:
  namespace: RXSDK
  class: RuiXueSdk
  methods:
    - Track(string eventName, Dictionary<string, object> properties, string distinctId = null)
    - SetPublicProperties(Dictionary<string, Dictionary<string, object>> publicPro)
    - TrackUserAction(Dictionary<string, object> trackData, string distinctId = null)

code: |
  using System.Collections.Generic;
  using RXSDK;

  private void TrackPayButtonClick()
  {
      RuiXueSdk.Track("pay_button_click", new Dictionary<string, object>
      {
          { "goods_tag", "diamond_100" },
          { "scene", "shop" }
      });
  }`
