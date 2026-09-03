## 工程配置

### 添加定位权限

Info.plist 中添加如下权限，value 描述为示例，可自定义。

| **key**                                                     | **value**              |
| ----------------------------------------------------------- | ---------------------- |
| Privacy - Location Always Usage Description                 | 是否允许访问定位权限？ |
| Privacy - Location Always and When In Use Usage Description | 是否允许访问定位权限？ |
| Privacy - Location When In Use Usage Description            | 是否允许访问定位权限？ |

### 后台定位开关

开启后台定位权限。

target-signing&capabilites-background modes-location updates


## 注册高德

需先注册高德定位服务获取 [appKey](https://doc.ruixueyun.com/main/#/view?viewPath=613c6b98-6ac3-4f99-9114-59795abb9d53)。

