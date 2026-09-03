using System;
using System.Collections.Generic;

using Steamworks;
using UnityEngine;
using UnityEngine.UI;
using RXSDK;
using System.Collections;
using UnityEngine.Networking;
using System.Text;
using Newtonsoft.Json.Linq;
public class SteamSampleScene : MonoBehaviour
{

    #region UI相关
    // UI相关
    [Header("UI设置")]
    public GameObject buttonPrefab;  // 按钮预制体 - 用于动态创建按钮

    public Transform buttonContainer; // 显示button panel


    // 存储按钮文本和它们的回调函数
    private readonly Dictionary<string, Action> buttonActions = new();

    void Awake()
    {
        Application.SetStackTraceLogType(LogType.Log, StackTraceLogType.None);
        Application.SetStackTraceLogType(LogType.Error, StackTraceLogType.ScriptOnly);
        Application.SetStackTraceLogType(LogType.Exception, StackTraceLogType.ScriptOnly);
        Application.SetStackTraceLogType(LogType.Warning, StackTraceLogType.ScriptOnly);
    }
    void Start()
    {
        InitButton();
        InitHelper.Init114steam();
        // Environment.SetEnvironmentVariable("SteamAppId", "3634290");
        // Environment.SetEnvironmentVariable("SteamAppId", "2099760");
        // if (SteamAPI.RestartAppIfNecessary((AppId_t)2099760))
        // {
        //     Application.Quit();
        //     return;
        // }
        if (SteamManager.Initialized)
        {


            string name = SteamFriends.GetPersonaName();
            AppId_t appId = SteamUtils.GetAppID();
            Debug.Log($"Steam AppID: {appId} , PersonaName {name}");

            SteamInventory.LoadItemDefinitions();
        }

    }

    private void InitButton()
    {
        // 设置容器
        RectTransform containerRect = buttonContainer.GetComponent<RectTransform>();

        // 设置容器大小和位置 - 靠上显示
        containerRect.anchorMin = new Vector2(0.5f, 1f);
        containerRect.anchorMax = new Vector2(0.5f, 1f);
        containerRect.pivot = new Vector2(0.5f, 1f);
        containerRect.sizeDelta = new Vector2(600, 400); // 容器宽度
        containerRect.anchoredPosition = new Vector2(0, -20); // 距离顶部20像素

        // // 添加背景图像组件
        // Image containerImage = buttonContainer.GetComponent<Image>();
        // if (containerImage == null)
        // {
        //     containerImage = buttonContainer.gameObject.AddComponent<Image>();
        // }

        // // 设置背景颜色
        // containerImage.color = new Color(0.2f, 0.2f, 0.2f, 0.8f); // 半透明深灰色

        // 设置网格布局组
        GridLayoutGroup gridGroup = buttonContainer.gameObject.AddComponent<GridLayoutGroup>();
        gridGroup.spacing = new Vector2(10f, 10f); // 水平和垂直间距
        gridGroup.padding = new RectOffset(10, 10, 10, 10); // 内边距
        gridGroup.childAlignment = TextAnchor.MiddleCenter; // 子对象居中对齐
        gridGroup.constraint = GridLayoutGroup.Constraint.Flexible; // 灵活布局
        gridGroup.startCorner = GridLayoutGroup.Corner.UpperLeft; // 从左上角开始
        gridGroup.startAxis = GridLayoutGroup.Axis.Horizontal; // 水平方向优先
        gridGroup.cellSize = new Vector2(180, 50); // 单元格大小

        buttonActions.Add("RXScene", RXScene);
        // 配置按钮文本和点击事件
        buttonActions.Add("Login", Login);
        buttonActions.Add("Pay", Pay);
        buttonActions.Add("TrackData", TrackData);

        buttonActions.Add("LoadAllItemDefs", LoadAllItemDefs);
        buttonActions.Add("SteamOrder", SteamOrder);

        buttonActions.Add("IsOverlayEnabled", IsOverlayEnabled);
        buttonActions.Add("ActivateGameOverlay", ActivateGameOverlay);
        buttonActions.Add("ActivateGameOverlayToWebPage", ActivateGameOverlayToWebPage);
        buttonActions.Add("ActivateGameOverlayToUser", ActivateGameOverlayToUser);

        // 动态创建按钮
        foreach (var buttonData in buttonActions)
        {
            CreateButton(buttonData.Key, buttonData.Value);
        }
    }
    void ActivateGameOverlay()
    {
        SteamFriends.ActivateGameOverlay("Friends");

    }
    void ActivateGameOverlayToUser()
    {
        CSteamID steamID = SteamUser.GetSteamID();
        SteamFriends.ActivateGameOverlayToUser("chatroomgroup", steamID);
        Debug.Log("ActivateGameOverlayToUser");
    }
    void ActivateGameOverlayToWebPage()
    {
        SteamFriends.ActivateGameOverlayToWebPage("https://www.baidu.com/");
    }

    void IsOverlayEnabled()
    {
        Debug.Log("IsOverlayEnabled:" + SteamUtils.IsOverlayEnabled());
    }
    void RXScene()
    {
        try
        {
            string sceneName = "RXSapmleScene";
            SceneUtility.LoadSceneAsync(sceneName);

        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to load scene 'RXSampleScene': {e.Message}");
        }
    }


    /// <summary>
    /// 创建一个按钮并设置其文本和点击事件
    /// </summary>
    /// <param name="text">按钮文本</param>
    /// <param name="onClickAction">点击事件回调</param>
    void CreateButton(string text, Action onClickAction)
    {
        // 生成按钮
        GameObject newButton = Instantiate(buttonPrefab, buttonContainer);

        // 设置按钮文本
        Text buttonText = newButton.GetComponentInChildren<Text>();
        if (buttonText != null)
        {
            buttonText.text = text;
        }
        else
        {
            Debug.LogError($"按钮预制体 '{buttonPrefab.name}' 缺少 Text 组件！");
            Destroy(newButton);
            return;
        }

        // 绑定点击事件
        Button button = newButton.GetComponent<Button>();
        if (button != null)
        {
            // 设置按钮颜色
            // ColorBlock colors = button.colors;
            // colors.normalColor = new Color(0.3f, 0.3f, 0.3f, 1f); // 正常颜色
            // colors.highlightedColor = new Color(0.4f, 0.4f, 0.4f, 1f); // 高亮颜色
            // colors.pressedColor = new Color(0.2f, 0.2f, 0.2f, 1f); // 按下颜色
            // colors.selectedColor = new Color(0.4f, 0.4f, 0.4f, 1f); // 选中颜色
            // button.colors = colors;

            // // 设置文本颜色
            // if (buttonText != null)
            // {
            //     buttonText.color = Color.white; // 白色文本
            // }

            button.onClick.AddListener(() => onClickAction.Invoke());
        }
        else
        {
            Debug.LogError($"按钮预制体 '{buttonPrefab.name}' 缺少 Button 组件！");
            Destroy(newButton);
        }
    }


    #endregion

    // 沙盒模式的 URL
    public const string SANDBOX_URL = "https://partner.steam-api.com/ISteamMicroTxnSandbox/";

    // 生产模式的 URL
    public const string PRODUCT_URL = "https://partner.steam-api.com/ISteamMicroTxn/";
    private const string KEY = "4AEDFD633AE93DD6429C5064D686518B";
    public void InitTxn(string currency, string itemId, string amount, long userId, string description, bool isSandbox)
    {
        string userIdStr = userId.ToString();
        string orderId = userIdStr.Substring(userIdStr.Length - 6) + ((int)DateTimeOffset.Now.ToUnixTimeSeconds()).ToString();
        string httpUrl = GetUrl(isSandbox) + "InitTxn/v3/";
        string steamId = SteamUser.GetSteamID().ToString();
        string appId = SteamUtils.GetAppID().ToString();
        string language = SteamLangConverter.SteamToIsoLanguage(SteamApps.GetCurrentGameLanguage());
        string dataStr = string.Format(
            "key={0}&orderid={1}&steamid={2}&appid={3}&itemcount={4}&language={5}&currency={6}&itemid[0]={7}&qty[0]=1&amount[0]={8}&description[0]={9}&usersession={10}",
            KEY, orderId, steamId, appId, 1, language, currency, itemId, amount, description, "client"
        );

        StartCoroutine(SendRequest(httpUrl, dataStr, ProcessResponse));
    }

    private string GetUrl(bool isSandbox)
    {
        string url = isSandbox ? SANDBOX_URL : PRODUCT_URL;
        return url;
    }

    private IEnumerator SendRequest(string url, string dataStr, Action<string> callback = null)
    {
        using (UnityWebRequest request = new UnityWebRequest(url, UnityWebRequest.kHttpVerbPOST))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(dataStr);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("Steam Purchase Fail: " + request.error);
            }
            else
            {
                string content = request.downloadHandler.text;
                callback?.Invoke(content);
            }
        }
    }


    private void ProcessResponse(string responseContent)
    {
        // 在这里处理返回的响应，例如解析 JSON 内容  {"response":{"result":"OK","params":{"orderid":"5678901744337705","transid":"94120343920201740"}}}
        // 示例：解析 JSON 并输出
        try
        {

            Debug.Log(responseContent);
            var obj = JObject.Parse(responseContent);
            string orderid = obj["response"]["params"]["orderid"].ToString();
            BillingManager.Instance.VerifyPayment(this, $"v1/ke/callback/f_channel/1002/steam/steam", new Dictionary<string, object>() { { "orderid", orderid } }, (res, e) =>
            {
                if (e != null)
                {
                    Debug.LogError("VerifyPayment Error:" + e.Message);
                }
                Debug.Log("VerifyPayment resp:" + res?.ToJson());
            });

        }
        catch (Exception ex)
        {
            Debug.LogError("Failed to parse response: " + ex.Message);
        }
    }


    void SteamOrder()
    {

        InitTxn("USD", "100", "10.0", 1234567890, "Test purchase", true);

    }
    void Login()
    {
        Dictionary<string, object> parm = new();
        RuiXueSdk.Login(LoginMethod.Steam, parm, (code, data, msg) =>
                 {
                     if (code == 0 && data != null)
                     {
                         Log.D("data= " + data.ToJson());

                     }
                     else
                     {
                         Log.D("code:" + code + ", msg:" + msg);

                     }
                 });



    }

    void LoadInventory()
    {

        try
        {

            SteamInventory.LoadItemDefinitions();

            // 获取所有物品
            SteamInventoryResult_t result;
            if (SteamInventory.GetAllItems(out result))
            {
                // 获取物品数量
                uint itemCount = 0;
                SteamItemDetails_t[] pOutItemsArray = new SteamItemDetails_t[0];
                SteamInventory.GetResultItems(result, pOutItemsArray, ref itemCount);

                if (itemCount > 0)
                {
                    // 获取物品详情
                    SteamItemDetails_t[] items = new SteamItemDetails_t[itemCount];
                    uint actualCount = itemCount;
                    SteamInventory.GetResultItems(result, items, ref actualCount);
                    Debug.Log($"Found {actualCount} items in inventory");
                    Debug.Log("items:" + items.ToString());
                    // for (int i = 0; i < actualCount; i++)
                    // {
                    //     Debug.Log($"Item ID: {items[i].m_iDefinition}, Quantity: {items[i].m_unQuantity}");
                    // }
                }
                else
                {
                    Debug.Log("No items found in inventory");
                }
            }
            else
            {
                Debug.LogError("Failed to get inventory items");
            }
        }
        catch (Exception ex)
        {
            Debug.LogError($"Error loading inventory: {ex.Message}");
        }
    }


    void LoadAllItemDefs()
    {
        const int MAX_ITEMS = 1024;
        uint count = 0;

        if (SteamInventory.GetItemDefinitionIDs(null, ref count))
        {
            SteamItemDef_t[] itemDefs = new SteamItemDef_t[count];

            if (SteamInventory.GetItemDefinitionIDs(itemDefs, ref count))
            {
                Debug.Log($"📦 总共发现 {count} 个物品定义：");

                for (int i = 0; i < count; i++)
                {
                    var def = itemDefs[i];
                    string name = GetProp(def, "name");
                    string iconUrl = GetProp(def, "icon_url");
                    // Debug.Log($"🪙 ID: {def.m_SteamItemDef} | 名称: {name} | 图标: {iconUrl}");
                    string price = GetProp(def, "price");
                    Debug.Log($"🪙 ID: {def.m_SteamItemDef} | 名称: {name}   | 价格: {price}");
                }
            }
            else
            {
                Debug.LogError("❌ 获取物品定义失败！");
            }
        }
        else
        {
            Debug.LogError("❌ 获取物品定义失败！");
        }
    }

    string GetProp(SteamItemDef_t def, string propName)
    {
        uint bufferSize = 1024;
        SteamInventory.GetItemDefinitionProperty(def, propName, out string value, ref bufferSize);
        return value;
    }


    void GrantTestItems()
    {

        try
        {
            // 创建物品定义数组
            SteamItemDef_t[] newItems = new SteamItemDef_t[2];
            newItems[0] = new SteamItemDef_t() { m_SteamItemDef = 100 };
            newItems[1] = new SteamItemDef_t() { m_SteamItemDef = 200 };

            // 创建数量数组
            uint[] quantities = new uint[2];
            quantities[0] = 1;
            quantities[1] = 10;

            // 生成物品
            SteamInventoryResult_t result;
            SteamInventory.GenerateItems(out result, newItems, quantities, 2);
            Debug.Log("Test items generated successfully " + result.ToString());
        }
        catch (Exception ex)
        {
            Debug.LogError($"Error generating test items: {ex.Message}");
        }
    }

    void StartPurchase100()
    {
        StartPurchase(100);
    }

    void TrackData()
    {
        Dictionary<string, object> keyValuePairs = new()
        {
            { "login", "sset" },//事件类型（目前默认为 track）
            { "login2", "sset" + DeviceUtility.GetNewUUID() }//事件类型（目前默认为 track）
        };
        RuiXueSdk.Track("#test", keyValuePairs);

    }
    void Pay()
    {
        string steamId = SteamUser.GetSteamID().ToString();
        string appId = SteamUtils.GetAppID().ToString();
        string language = SteamApps.GetCurrentGameLanguage();

        var data = new PayArgs()
        {
            pay_type = "steam",
            goods_tag = "bytest",
            // goods_tag = "goods_forever_1_10",
            trade_no = "" + TimeUtility.GetTimeMillis(),
            ext = new Dictionary<string, object>() {
                {"steam_id",steamId},
                {"app_id",appId},
                {"language",language}
            }
        };

        RuiXueSdk.Pay(data, (result, e) =>
         {
             if (e != null)
             {
                 Log.D("Error:" + e.Message);
                 return;
             }
             Log.D("Pay code:" + result.code + ", msg:" + result.msg);

             if (data != null)
             {
                 Log.D("data= " + data.ToString());
             }
         });
    }
    void StartPurchase(int itemId)
    {
        // string orderId = Guid.NewGuid().ToString();

        SteamItemDef_t[] itemDefs = new[] { new SteamItemDef_t() { m_SteamItemDef = itemId } };
        uint arrayLength = (uint)itemDefs.Length;

        uint[] quantities = new[] { 1U };

        SteamAPICall_t apiCall = SteamInventory.StartPurchase(itemDefs, quantities, arrayLength);

        if (apiCall != SteamAPICall_t.Invalid)
        {
            Debug.Log($"发起订单成功，等待回调itemId = {itemId} ");
        }
        else
        {
            Debug.LogError("StartPurchase 失败，apiCall 无效！");
        }


    }
    #region Steam物品相关方法
    void ConsumeItem()
    {
        SteamInventoryResult_t result;
        if (SteamInventory.GetAllItems(out result))
        {
            Debug.Log("🧾 正在获取库存...");
            Callback<SteamInventoryResultReady_t>.Create((res) =>
            {
                if (res.m_result != EResult.k_EResultOK)
                {
                    Debug.LogError($"库存拉取失败: {res.m_result}");
                    return;
                }

                uint itemCount = 0;
                bool success = SteamInventory.GetResultItems(res.m_handle, null, ref itemCount);
                if (!success || itemCount == 0)
                {
                    Debug.Log("库存为空");
                    return;
                }

                SteamItemDetails_t[] items = new SteamItemDetails_t[itemCount];
                SteamInventory.GetResultItems(res.m_handle, items, ref itemCount);

                // 消耗第一个物品
                var item = items[0];
                SteamInventoryResult_t consumeResult;
                bool consumed = SteamInventory.ConsumeItem(out consumeResult, item.m_itemId, 1);

                if (consumed)
                {
                    Debug.Log($"🗑️ 请求消耗物品 ID: {item.m_itemId} 数量: 1");

                    Callback<SteamInventoryResultReady_t>.Create((consumeRes) =>
                    {
                        if (consumeRes.m_result == EResult.k_EResultOK)
                        {
                            Debug.Log($"✅ 成功消耗物品: {item.m_itemId}");
                        }
                        else
                        {
                            Debug.LogError($"❌ 消耗失败: {consumeRes.m_result}");
                        }
                    });
                }
                else
                {
                    Debug.LogError("调用 ConsumeItem 失败");
                }

            });
        }
        else
        {
            Debug.LogError("无法获取库存");
        }
    }

    public void GetAllItems()
    {
        if (SteamInventory.GetAllItems(out SteamInventoryResult_t result))
        {
            Debug.Log($"📦 正在拉取库存 Handle={result.m_SteamInventoryResult}");
        }
    }


    #endregion

}
