# 星驿支付（iOS）

星驿支付当前仅支持 Android，iOS SDK 不提供星驿 App 支付或星驿 H5 支付能力。

请勿在 iOS 平台将 `hq_type=xy` 传入 Apple IAP 接口。跨平台项目应在调用前判断运行平台，并在 iOS 返回“不支持星驿支付”的提示。

