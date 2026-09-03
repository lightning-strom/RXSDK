
using System;
using System.Collections.Generic;

using Steamworks;
using UnityEngine;

namespace RXSDK
{
    public class SteamLoginImpl : Singleton<SteamLoginImpl>, ILoginHandler
    {
        public void DoLogin(string method, Dictionary<string, object> parm, Action<int, Dictionary<string, object>, string> callback)
        {

            int code = -1;
            Dictionary<string, object> data = new();
            string message = null;

            try
            {
                if (!SteamManager.Initialized)
                {
                    message = "Steam API 未初始化！";
                    code = (int)RXErrorCode.LoginError;
                    callback?.Invoke(code, data, message);
                    return;
                }

                // 获取Steam ID
                CSteamID steamId = SteamUser.GetSteamID();

                // 获取Web API票据
                byte[] ticketData = new byte[1024];
                uint ticketSize;
                SteamNetworkingIdentity identity = new();
                string name = SteamFriends.GetPersonaName();

                // 获取票据数据
                if (SteamUser.GetAuthSessionTicket(ticketData, ticketData.Length, out ticketSize, ref identity) != HAuthTicket.Invalid)
                {
                    code = 0;
                    string hexTicket = BitConverter.ToString(ticketData, 0, (int)ticketSize).Replace("-", "");
                    string lang = SteamApps.GetCurrentGameLanguage();
                    data.Add("steamid", steamId.ToString());
                    data.Add("ticket", hexTicket);
                    data.Add("lang", lang);
                    data.Add("name", name);
                    Debug.Log($"Steam  ID: {steamId} ,语言  {lang}, Ticket (Hex): {hexTicket}");
                    message = "Steam登录成功";
                }
                else
                {
                    Debug.LogError("Failed to get Steam ticket data");
                    message = "Failed to get Steam ticket data";
                    code = (int)RXErrorCode.LoginError;
                }
            }
            catch (Exception e)
            {
                message = e.Message;
                code = (int)RXErrorCode.LoginError;
                Debug.LogError("Steam登录失败: " + e.Message);
            }
            finally
            {
                callback?.Invoke(code, data, message);
            }

        }
    }
}