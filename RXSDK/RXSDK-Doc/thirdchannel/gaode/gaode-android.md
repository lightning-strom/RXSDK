
## SDK 集成

打开 `mainTemplate.gradle` 文件，在 `dependencies` 中加入

```groovy
    implementation " com.ruixue:rxsdk_gaode:${version}"
```

### 参数说明

| **字段** | **类型** | **是否必填** | **说明**         |
| -------- | -------- | ------------ | ---------------- |
| apikey   | String   | 是           | 高德开放平台获取 |

- 打开 `AndroidManifest.xml` 文件，在 `application` 中新增

```xml
<application>
  <!--android:value="请输入com.amap.api.v2.apikey您的用户Key value值" />-->
      <meta-data
           android:name="com.amap.api.v2.apikey"
           android:value="apikey 参数值" />
</application>
```

- 打开 `launcherTemplate.gradle` 文件， 在 `defaultConfig` 中新增

```groovy
       manifestPlaceholders = [
           AMAP_APIKEY     : "2642d735325ae5de2d00328104fbb8ce"
       ] 
```

## 初始化定位

**接口原型**

```csharp
    public void InitLocation();
```

**调用示例**

```csharp
    public void OnInitLocation()
    {
        RXLBSAndroid.InitLocation();
    }
```

## 获取GPS状态的字符串

**接口原型**

```csharp
    /// <summary>
    /// 获取GPS状态的字符串
    /// </summary>
    /// <param name="statusCode">statusCode GPS状态码</param>
    /// <returns></returns>
    public string GetGPSStatusString(int statusCode);
```
**调用示例**

```csharp
    public void OnGetGPSStatusString()
    {
        LogUtil.Log("EventManager", $"GetGPSStatusString {RXLBSAndroid.GetGPSStatusString(0)}");
    }
```

## 设置定位参数

**接口原型**

```csharp
        /// <summary>
        /// 设置参数
        /// </summary>
        /// <param name="cbAddress">设置是否需要显示地址信息</param>
        /// <param name="cbGpsFirst">设置是否优先返回GPS定位结果，如果30秒内GPS没有返回定位结果则进行网络定位,注意：只有在高精度模式下的单次定位有效，其他方式无效</param>
        /// <param name="cbCacheAble">设置是否开启缓存</param>
        /// <param name="cbOnceLocation">设置是否单次定位</param>
        /// <param name="cbOnceLastest">设置是否等待设备wifi刷新，如果设置为true,会自动变为单次定位，持续定位时不要使用</param>
        /// <param name="cbSensorAble">设置是否使用传感器</param>
        /// <param name="strInterval">设置发送定位请求的时间间隔,最小值为1000，如果小于1000，按照1000算</param>
        /// <param name="strTimeout">设置网络请求超时时间</param>
    public void ResetOption(bool cbAddress, bool cbGpsFirst, bool cbCacheAble, bool cbOnceLocation, bool cbOnceLastest,
                bool cbSensorAble, long strInterval, long strTimeout);
```

**调用示例**

```csharp
    public void OnResetOption()
    {
        RXLBSAndroid.ResetOption(true, true, true, true, true, 
            true, 10000, 10000);
    }
```

## 开始定位

**接口原型**

```csharp
        /// <summary>
        /// 开始定位
        /// </summary>
        /// <param name="cbAddress">设置是否需要显示地址信息</param>
        /// <param name="cbGpsFirst">设置是否优先返回GPS定位结果，如果30秒内GPS没有返回定位结果则进行网络定位,注意：只有在高精度模式下的单次定位有效，其他方式无效</param>
        /// <param name="cbCacheAble">设置是否开启缓存</param>
        /// <param name="cbOnceLocation">设置是否单次定位</param>
        /// <param name="cbOnceLastest">设置是否等待设备wifi刷新，如果设置为true,会自动变为单次定位，持续定位时不要使用</param>
        /// <param name="cbSensorAble"设置是否使用传感器></param>
        /// <param name="strInterval">设置发送定位请求的时间间隔,最小值为1000，如果小于1000，按照1000算</param>
        /// <param name="strTimeout">设置网络请求超时时间</param>
        public void StartLocation(bool cbAddress, bool cbGpsFirst, bool cbCacheAble, bool cbOnceLocation, bool cbOnceLastest,
            bool cbSensorAble, long strInterval, long strTimeout, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError, RequestExtDelegates channelCallback)
```

**调用示例**

```csharp
    public void OnStartLocation()
    {
        RXLBSAndroid.StartLocation(true, true, true, true, true, 
            true, 10000, 10000, 
            StartLocationResponseDelegate, StartLocationErrorDelegate);
    }
```

## 开始定位

**接口原型**

```csharp
    /// <summary>
    /// 开始定位
    /// </summary>
    /// <param name="types">坐标分组，由 CP 自定义。</param>
    /// <param name="duration">单位秒，需要传入大于30秒以上的秒数</param>
    public void StartLocation(string[] types, int duration, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
```

**调用示例**

```csharp
    public void OnStartLocation2()
    {
        string[] arr = { "test", "friend" };
        RXLBSAndroid.StartLocation(arr, 5000, StartLocationResponseDelegate, StartLocationErrorDelegate);
    }
```

## 停止定位 销毁定位

**接口原型**

```csharp
    public void StopLocation()
```

**调用示例**

**接口原型**

```csharp
    public void OnStopLocation()
    {
        RXLBSAndroid.StopLocation();
    }
```

## 停止定位 销毁定位

**接口原型**

```csharp
    /// <summary>
    /// 输入GCJ-02经纬度 转WGS纬度
    /// </summary>
    /// <param name="lat">纬度</param>
    /// <param name="lon">经度</param>
    public double WGSLat(double lat, double lon)
```

**调用示例**

```csharp
    public void OnWGSLat()
    {
        LogUtil.Log("EventManager", $" OnWGSLat : {RXLBSAndroid.WGSLat(1, 3)}");
    }
```

## 输入GCJ经纬度 转WGS经度

**接口原型**

```csharp
    /// <summary>
    /// 输入GCJ-02经纬度 转WGS纬度
    /// </summary>
    /// <param name="lat">纬度</param>
    /// <param name="lon">经度</param>
    public double WGSLon(double lat, double lon)
```

**调用示例**

```csharp
    public void OnWGSLon()
    {
        LogUtil.Log("EventManager", $" OnWGSLat : {RXLBSAndroid.WGSLon(1, 3)}");
    }
```

## 坐标转换算法 转换经度所需

**接口原型**

```csharp
    /// <summary>
    /// 坐标转换算法 转换经度所需
    /// </summary>
    /// <param name="x">longitude</param>
    /// <param name="y">latitude</param>
    public double TransformLon(double x, double y)
```

**调用示例**

```csharp
    public void OnTransformLon()
    {
        LogUtil.Log("EventManager", $" OnWGSLat : {RXLBSAndroid.TransformLon(1, 3)}");
    }
```

## 坐标转换算法 转换纬度所需

**接口原型**

```csharp
    /// <summary>
    /// 坐标转换算法 转换经度所需
    /// </summary>
    /// <param name="x">longitude</param>
    /// <param name="y">latitude</param>
    public double TransformLat(double x, double y)
```

**调用示例**

```csharp
    public void OnTransformLat()
    {
        LogUtil.Log("EventManager", $" OnWGSLat : {RXLBSAndroid.TransformLat(1, 3)}");
    }
```
