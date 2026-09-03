package rxsdk

const mcpToolCallRequirement = `【MCP Server 调用要求】
当用户请求与本工具能力匹配时，Agent 必须调用 ruixue-sdk-mcp server 的当前工具获取结果；允许先读取 schema 确认参数，但读取后必须继续发起工具调用，不能只根据 schema、工具描述、源码或已有知识直接回答。
如果缺少必填参数，应先向用户补充询问，拿到必要参数后再调用本工具。`

// ==================== 数据结构 ====================

// DependencyData 依赖模板数据结构
type DependencyData struct {
	Channel    string
	Version    string
	GradleType string
}

// AgentData Agent 模板数据结构
type AgentData struct {
	Channel string
	Version string
}

// ==================== 自动化接入步骤 ====================

// SetupStepType 步骤类型
type SetupStepType string

const (
	// StepTypeCheckFile 检测文件是否存在
	StepTypeCheckFile SetupStepType = "check_file"
	// StepTypeCreateFile 创建文件
	StepTypeCreateFile SetupStepType = "create_file"
	// StepTypeEditFile 编辑文件
	StepTypeEditFile SetupStepType = "edit_file"
	// StepTypeRunCommand 执行命令
	StepTypeRunCommand SetupStepType = "run_command"
	// StepTypeUserInput 请求用户输入
	StepTypeUserInput SetupStepType = "user_input"
)

// SetupStep 自动化接入步骤
type SetupStep struct {
	ID          string        `json:"id"`                    // 步骤唯一标识
	Type        SetupStepType `json:"type"`                  // 步骤类型
	Description string        `json:"description"`           // 步骤描述（中文）
	Target      string        `json:"target"`                // 目标文件路径或命令
	Content     string        `json:"content,omitempty"`     // 文件内容或命令参数
	InsertAfter string        `json:"insertAfter,omitempty"` // 编辑文件时，在此正则匹配后插入
	WorkingDir  string        `json:"workingDir,omitempty"`  // 命令执行目录
	Condition   string        `json:"condition,omitempty"`   // 执行条件描述
	OnSuccess   string        `json:"onSuccess,omitempty"`   // 成功后跳转到的步骤 ID
	OnFailure   string        `json:"onFailure,omitempty"`   // 失败后跳转到的步骤 ID
	Required    bool          `json:"required"`              // 是否为必需步骤
	Note        string        `json:"note,omitempty"`        // 额外说明
}

// SetupResult 自动化接入返回结果
type SetupResult struct {
	Platform    string      `json:"platform"`    // 平台: ios, android
	Version     string      `json:"version"`     // SDK 版本
	Steps       []SetupStep `json:"steps"`       // 执行步骤列表
	AgentGuide  string      `json:"agentGuide"`  // AI Agent 执行指南
	UserMessage string      `json:"userMessage"` // 给用户的提示信息
}

// SetupInputParams 自动化接入输入参数
type SetupInputParams struct {
	WorkspacePath string `json:"workspacePath"` // 项目工作目录
	Version       string `json:"version"`       // SDK 版本（可选）
	Channel       string `json:"channel"`       // 渠道（Android 专用）
	PodSource     string `json:"podSource"`     // CocoaPods 源（iOS 专用）
}

// ==================== 初始化检查指南 ====================

// AndroidInitCheckGuide Android 初始化检查指南
const AndroidInitCheckGuide = `【前置条件检查】在使用此功能前，必须确保 SDK 已正确初始化：

1. 检查项目中是否存在 SDK 初始化代码：
   - 搜索 "RXSDK.initialize" 或 "RXSdkInitConfig"
   - 检查 Application 类是否继承 RXApplication 或调用了 RXSDK.onApplicationCreate

2. 如果未找到初始化代码，请先完成以下步骤：
   a) 调用 android_add_dependency 添加依赖
   b) 调用 android_init 获取初始化代码并集成

3. 初始化代码示例：
   RXSdkInitConfig config = new RXSdkInitConfig(
       cpid, productId, channelId, baseUrlList,
       new RXRequestCallback() {
           @Override
           public void onResponse(JSONObject response) {
               int code = response.optInt("code", -1);
               if (code == 0) {
                   // 初始化成功，data 可能为空
               } else {
                   // 初始化失败，读取 msg 字段
                   String msg = response.optString("msg");
               }
           }
       }
   );
   RXSDK.initialize(activity, config);

4. 关键检查点：
   - build.gradle 中是否有 rxsdk 依赖
   - Application 类是否正确配置（继承 RXApplication 或调用 RXSDK.onApplicationCreate）
   - AndroidManifest.xml 中是否注册了 Application
   - 初始化回调中通过 code == 0 判断成功`

// IOSInitCheckGuide iOS 初始化检查指南
const IOSInitCheckGuide = `【前置条件检查】在使用此功能前，必须确保 SDK 已正确初始化：

1. 检查项目中是否存在 SDK 初始化代码：
   - 搜索 "RXSdkInitConfig" 或 "initWithConfig:complete:"
   - 检查 AppDelegate 中是否调用了 SDK 初始化方法

2. 如果未找到初始化代码，请先完成以下步骤：
   a) 确保已通过 CocoaPods 添加 RXSDK_Pure 依赖
   b) 在 AppDelegate 的 didFinishLaunchingWithOptions 中调用初始化

3. 初始化代码示例：
   #import <RXSDK_Pure/RXSDK_Pure.h>
   #import <RXUIKit/RXUIKitService.h>  // 国内环境
   // #import <RXOSUIKit/RXOSUIKitService.h>  // 海外环境
   
   // UI 组件初始化（必须在 SDK initWithConfig 之前）
   [[RXUIKitService sharedSDK] regist];  // 国内环境
   // [[RXOSUIKitService sharedSDK] regist];  // 海外环境
   
   RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
   config.cpId = @"YOUR_CP_ID";              // 必须，CP 唯一 ID
   config.productId = @"YOUR_PRODUCT_ID";    // 必须，应用 ID
   config.channelId = @"YOUR_CHANNEL_ID";    // 必须，渠道 ID
   config.baseUrlList = @[@"https://api.example.com/"];  // 必须，域名列表
   config.launchOptions = launchOptions;
   
   [[RXSDK sharedSDK] initWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
       if (error) {
           NSLog(@"SDK 初始化失败: %@", error.responesObject);
       } else {
           NSLog(@"SDK 初始化成功: %@", response);
       }
   }];

4. 关键检查点：
   - Podfile 中是否有 RXSDK_Pure 和 RXUIKit/RXOSUIKit 依赖
   - AppDelegate 是否正确配置初始化代码
   - cpId、productId、channelId、baseUrlList 四个必须参数是否已配置
   - UI 组件初始化（regist）是否在 SDK initWithConfig 之前执行
   - 确保在调用其他 SDK 方法前初始化已完成`

// UnityInitCheckGuide Unity 初始化检查指南
const UnityInitCheckGuide = `【前置条件检查】在使用此功能前，必须确保 SDK 已正确初始化：

1. 检查项目中是否存在 SDK 初始化代码：
   - 搜索 "RXSDK.Initialize" 或 "RXSdkInitConfig"
   - 检查是否在某个 MonoBehaviour 的 Start() 或 Awake() 中调用了初始化

2. 如果未找到初始化代码，请先完成以下步骤：
   a) 确保已通过 UPM 或 .unitypackage 安装了瑞雪 SDK
   b) 调用 unity feature=init 获取初始化代码并集成

3. 初始化代码示例：
   var config = new RXSdkInitConfig
   {
       cpId = "your_cpid",
       productId = "your_product_id",
       channelId = "your_channel_id",
       baseUrlList = new List<string> { "https://api1.ruixueyun.com" }
   };
   RXSDK.Initialize(config, result =>
   {
       if (result.IsSuccess) Debug.Log("SDK 初始化成功");
       else Debug.LogError("SDK 初始化失败: " + result.Error);
   });

4. 关键检查点：
   - 项目中是否已安装 com.ruixue.unitysdk.base 包（UPM）或导入了 .unitypackage
   - 是否有引用 using RuiXue; 命名空间
   - 初始化回调中通过 result.IsSuccess 判断成功
   - 确保在调用其他 SDK 方法前初始化已完成`

// MinigameInitCheckGuide 小游戏初始化检查指南
const MinigameInitCheckGuide = `【前置条件检查】在使用此功能前，必须确保 SDK 已正确初始化：

1. 检查项目中是否存在 SDK 初始化代码：
   - 搜索 "new RxSdk(" 或 "import RxSdk"
   - 检查入口文件（game.js）是否引入并实例化了 SDK

2. 如果未找到初始化代码，请先完成以下步骤：
   a) 将 SDK 构建产物（dist/lib/）复制到小游戏项目中
   b) 在入口文件中 import 并实例化 SDK
   c) 调用 minigame feature=init 获取初始化代码

3. 初始化代码示例：
   import RxSdk from './lib/channel-sdk'

   const sdk = new RxSdk({
       productId: 'your_product_id',
       channelId: 'your_channel_id',
       cpid: 'your_cpid',
       baseUrlList: ['https://api1.ruixueyun.com']
   })

   sdk.login({}, {
       complete(res) {
           if (res.code === 0) {
               console.log('登录成功', res.data)
           }
       }
   })

4. 关键检查点：
   - SDK 文件是否已正确引入项目
   - productId、channelId、cpid、baseUrlList 四个必须参数是否已配置
   - 微信后台是否配置了请求合法域名（request 域名白名单）
   - 确保在登录成功后再调用其他 SDK 功能接口
   - 所有 API 调用统一使用 callback 模式：{ complete(res) { ... } }`

// RuixuegoInitCheckGuide Go 服务端 SDK 初始化检查指南
const RuixuegoInitCheckGuide = `【前置条件检查】在使用此功能前，必须确保 ruixuego 已正确初始化：

1. 检查 go.mod 是否包含：
   github.com/ruixueyun/ruixuego

2. 检查进程入口是否调用：
   ruixuego.Init(&ruixuego.Config{...})
   以及（使用埋点时）defer ruixuego.Close()

3. 初始化示例（@test 必须替换为真实参数）：
   err := ruixuego.Init(&ruixuego.Config{
       APIDomain: "@test",
       CPID:      1000000, // 必须替换为真实 CPID
       CPKey:     "@test",
       AppKeys: map[string]map[string]string{
           "@test": {"@test": "@test"},
       },
       BigData: &ruixuego.BigDataConfig{AutoFlush: true}, // 埋点需要
   })

4. 关键检查点：
   - APIDomain / CPID / CPKey / AppKeys 是否已替换，无残留 @test
   - Timeout / TrackTimeout 若配置，请填毫秒数字（如 5000），勿传 time.Second 字面量
   - 业务 API 优先使用 *V2 方法
   - 失败时可用 ruixuego.ErrTraceID(err) 排查
   - 若尚未依赖或初始化：先调用 ruixuego feature=dependency，再 feature=init`

// ==================== 常量 ====================

// SDK_VERSION 历史参考版本号（仅用于 agent 示例代码）
// SDK_VERSION 历史参考版本号（仅用于 agent 示例代码）
// 注意：Unity setup 和 dependency 功能会优先使用用户传入版本号，未传入时从 UPM registry 获取 latest
const SDK_VERSION = "4.0.14"

// 默认渠道
const DEFAULT_CHANNEL = "rxsdk_weile"

// 可用渠道列表
var availableChannels = []string{
	"rxsdk_weile",         // 自运营
	"rxsdk_baidu_wangxun", // 百度网讯
	"rxsdk_ysdk",          // 应用宝
	"rxsdk_vivo",          // vivo
	"rxsdk_oppo",          // oppo
	"rxsdk_huawei",        // 华为
	"rxsdk_xiaomi",        // 小米
	"rxsdk_douyin_gb",     // 抖音
	"rxsdk_kwaiallin",     // 快手
	"rxsdk_taptap",        // TapTap
	"rxsdk_overseas",      // Google Play
	"rxsdk_9game",         // 九游
	"rxsdk_007",           // 007
	"rxsdk_quick",         // Quick
	"rxsdk_bilibili",      // 哔哩哔哩
	"rxsdk_4399",          // 4399
	"rxsdk_honor",         // 荣耀
	"rxsdk_ld",            // 雷电模拟器
	"rxsdk_yofun",         // MuMu模拟器
	"rxsdk_xuteng",        // 栩腾
	"rxsdk_overseas_oppo", // 海外oppo
	"rxsdk_rustore",       // RuStore
	"rxsdk_apkpure",       // Apkpure
}
