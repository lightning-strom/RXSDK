
using System;
using System.Collections.Generic;
using System.Linq;
using Steamworks;
using Newtonsoft.Json.Linq;
using RXSDK.Net;
using UnityEngine;

namespace RXSDK
{
#if !UNITY_OPENHARMONY && !DISABLESTEAMWORKS
    class SteamIapImpl : BillingClient
    {

        public SteamIapImpl()
        {
            RegisterCallbacks();
        }


        /// <summary>
        /// 注册Steam回调
        /// </summary>
        private void RegisterCallbacks()
        {
            Callback<MicroTxnAuthorizationResponse_t>.Create(OnMicroTxnAuthorizationResponse);
            Callback<SteamInventoryResultReady_t>.Create(OnSteamInventoryResultReady);
            Callback<SteamInventoryFullUpdate_t>.Create(OnSteamInventoryFullUpdate);
            Callback<SteamInventoryDefinitionUpdate_t>.Create(OnSteamInventoryDefinitionUpdate);
            Callback<SteamInventoryRequestPricesResult_t>.Create(OnSteamInventoryRequestPricesResult);
            Callback<SteamInventoryResultReady_t>.Create(OnInventoryResultReady);
            CallResult<SteamInventoryEligiblePromoItemDefIDs_t>.Create(OnSteamInventoryEligiblePromoItemDefIDs);
            CallResult<SteamInventoryStartPurchaseResult_t>.Create(OnSteamInventoryStartPurchaseResult);
        }

        /// <summary>
        /// 注销Steam回调
        /// </summary>
        private void UnregisterCallbacks()
        {
            // Steam API会自动清理回调，这里不需要额外操作
        }
        public string CALL_BACK_API => $"v1/ke/callback/f_channel/{SDKConfig.Instance.ProductId}/{SDKConfig.Instance.ChannelId}/steam";
        public override string BrandName => "steam";

        RXCallback<object> mCallback;
        MonoBehaviour mMono;
        OrderData mOrderData;

        public override void DoPay(OrderData orderData, RXCallback<object> callback, MonoBehaviour mono)
        {
            mOrderData = orderData;
            mCallback = callback;
            mMono = mono;
        }

        void CallbackSteamPayment(MonoBehaviour mono, string notifyUrl, Dictionary<string, object> keyValuePairs)
        {
            keyValuePairs ??= new Dictionary<string, object>();
            VerifyPayment(mono, notifyUrl, keyValuePairs, (ret, e) =>
            {
                mCallback?.Invoke(ret, e);
                mCallback = null;
            });
        }

        //用户确认支付后触发
        void OnMicroTxnAuthorizationResponse(MicroTxnAuthorizationResponse_t pCallback)
        {
            Debug.Log($"Steam 支付回调：AppID={pCallback.m_unAppID}, OrderID={pCallback.m_ulOrderID}, Authorized={pCallback.m_bAuthorized}");
            int code = pCallback.m_bAuthorized == 1 ? 0 : (int)RXErrorCode.PayCancel;

            if (code == 0)
            {
                CallbackSteamPayment(mMono, mOrderData?.notify_url ?? CALL_BACK_API, new Dictionary<string, object>() { { "order_id", pCallback.m_ulOrderID }, { "app_id", pCallback.m_unAppID } });
            }
            else
            {
                mCallback?.Invoke(new RXResult<object> { code = code, data = pCallback });
                mCallback = null;
            }

        }


        // 更新回调
        void OnSteamInventoryFullUpdate(SteamInventoryFullUpdate_t pCallback)
        {
            Debug.Log("[" + SteamInventoryFullUpdate_t.k_iCallback + " - SteamInventoryFullUpdate] - " + pCallback.m_handle);

        }

        // 物品定义回调
        void OnSteamInventoryDefinitionUpdate(SteamInventoryDefinitionUpdate_t pCallback)
        {
            Debug.Log("[物品定义 " + SteamInventoryDefinitionUpdate_t.k_iCallback + " - SteamInventoryDefinitionUpdate]");
        }

        void OnSteamInventoryEligiblePromoItemDefIDs(SteamInventoryEligiblePromoItemDefIDs_t pCallback, bool bIOFailure)
        {
            Debug.Log("[" + SteamInventoryEligiblePromoItemDefIDs_t.k_iCallback + " - SteamInventoryEligiblePromoItemDefIDs] - " + pCallback.m_result + " -- " + pCallback.m_steamID + " -- " + pCallback.m_numEligiblePromoItemDefs + " -- " + pCallback.m_bCachedData);

            uint ItemDefIDsArraySize = (uint)pCallback.m_numEligiblePromoItemDefs;
            SteamItemDef_t[] ItemDefIDs = new SteamItemDef_t[ItemDefIDsArraySize];
            bool ret = SteamInventory.GetEligiblePromoItemDefinitionIDs(pCallback.m_steamID, ItemDefIDs, ref ItemDefIDsArraySize);
            // print("SteamInventory.GetEligiblePromoItemDefinitionIDs(pCallback.m_steamID, ItemDefIDs, ref ItemDefIDsArraySize) - " + ret + " -- " + ItemDefIDsArraySize);
        }


        //订单创建结果
        void OnSteamInventoryStartPurchaseResult(SteamInventoryStartPurchaseResult_t pCallback, bool bIOFailure)
        {
            Debug.Log($"StartPurchase 回调：Result={pCallback.m_result}, OrderID={pCallback.m_ulOrderID}");

        }
        void OnSteamInventoryResultReady(SteamInventoryResultReady_t pCallback)
        {
            Debug.Log("[库存更新回调  ] - " + pCallback.m_handle + " -- " + pCallback.m_result);

            // m_SteamInventoryResult = pCallback.m_handle;
        }
        void OnSteamInventoryRequestPricesResult(SteamInventoryRequestPricesResult_t pCallback)
        {
            Debug.Log("[" + SteamInventoryRequestPricesResult_t.k_iCallback + " - SteamInventoryRequestPricesResult] - " + pCallback.m_result + " -- " + pCallback.m_rgchCurrency);
        }
        private void OnInventoryResultReady(SteamInventoryResultReady_t result)
        {
            if (result.m_result != EResult.k_EResultOK)
            {
                Debug.LogError($"❌ 获取库存失败，错误码: {result.m_result}");
                return;
            }

            uint itemCount = 0;
            bool success = SteamInventory.GetResultItems(result.m_handle, null, ref itemCount);
            Debug.Log($"✅ 库存拉取成功，Handle: {result.m_handle} , 获取物品： {success}, 物品数量： {itemCount}");
            if (!success || itemCount == 0)
            {
                // Debug.LogWarning("📭 没有任何物品");
                return;
            }

            SteamItemDetails_t[] items = new SteamItemDetails_t[itemCount];
            SteamInventory.GetResultItems(result.m_handle, items, ref itemCount);

            string log = $"📦 玩家库存总共 {itemCount} 个物品：\n";

            for (int i = 0; i < itemCount; i++)
            {
                var item = items[i];
                log += $"🪙#{i + 1} ID:{item.m_itemId} DefID:{item.m_iDefinition.m_SteamItemDef} 数量:{item.m_unQuantity} | ";
            }

            Debug.Log(log);

            // 最后释放 Handle（重要）
            SteamInventory.DestroyResult(result.m_handle);
        }

    }
#endif
}