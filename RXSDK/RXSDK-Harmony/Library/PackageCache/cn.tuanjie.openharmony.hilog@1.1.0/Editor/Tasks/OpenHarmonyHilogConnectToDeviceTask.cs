using System;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal class OpenHarmonyHilogConnectToDeviceInput : IOpenHarmonyHilogTaskInput
    {
        internal OpenHarmonyBridge.HDC hdc;
        internal string ip;
        internal string port;
        internal string deviceId;
        internal bool setListeningPort;
    }

    internal class OpenHarmonyHilogConnectToDeviceResult : IOpenHarmonyHilogTaskResult
    {
        internal bool success;
        internal string message;
        internal OpenHarmonyBridge.HDC hdc;
        internal string ip;
        internal string port;
        internal string deviceID;
    }

    internal class OpenHarmonyHilogConnectToDeviceTask
    {
        //Try to connect to the device via Wi-Fi
        internal static IOpenHarmonyHilogTaskResult Execute(IOpenHarmonyHilogTaskInput input)
        {
            var result = new OpenHarmonyHilogConnectToDeviceResult();

            try
            {
                var workInput = ((OpenHarmonyHilogConnectToDeviceInput)input);
                var HDC = result.hdc = workInput.hdc;

                if (HDC == null)
                    throw new NullReferenceException("HDC interface has to be valid");

                var ip = result.ip = workInput.ip;
                var port = result.port = workInput.port;
                string cmd;
                var outputMsg = "Connect OK";

                if (ip.Contains("Failed to get IP address"))
                    throw new NullReferenceException(ip);

                if (workInput.setListeningPort)
                {
                    //Ask device switch from USB debug mode to Wi-Fi debug mode.
                    //Wait 3s for device to switch mode.
                    cmd = string.Format("-t {0} tmode port {1}", workInput.deviceId, port);
                    outputMsg = HDC.Run(new[] { cmd }, "Failed to HDC tcpip " + port);
                    var wait = 3000;
                    OpenHarmonyHilogInternalLog.Log("Waiting {0} ms until HDC returns", wait);
                    System.Threading.Thread.Sleep(wait);
                }

                if (outputMsg.StartsWith("[Fail]") || outputMsg.Contains("connect failed status"))
                {
                    throw new NullReferenceException(outputMsg);
                }

                result.deviceID = workInput.deviceId;

                int tryCount = 0;

                //Try to connect to device via Wi-Fi
                do
                {
                    System.Threading.Thread.Sleep(500);
                    cmd = string.Format("tconn {1}:{2}", workInput.deviceId, ip, port);
                    OpenHarmonyHilogInternalLog.Log("{0} {1}", HDC.GetHDCPath(), cmd);
                    outputMsg = HDC.Run(new[] { cmd }, "Unable to connect to " + ip + ":" + port);
                    tryCount++;

                    if (tryCount > 4)
                    {
                        throw new Exception(outputMsg);
                    }
                }
                while (!outputMsg.Contains("Target is connected"));

                result.message = "Connect OK";
                result.success = true;
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log(ex.Message);
                result.success = false;
                result.message = ex.Message;
            }
            return result;
        }
    }

    internal class OpenHarmonyHilogReconnectToDeviceTask
    {
        //Try to reconnect to the device via Wi-Fi
        internal static IOpenHarmonyHilogTaskResult Execute(IOpenHarmonyHilogTaskInput input)
        {
            var result = new OpenHarmonyHilogConnectToDeviceResult();

            try
            {
                var workInput = ((OpenHarmonyHilogConnectToDeviceInput)input);
                var HDC = result.hdc = workInput.hdc;

                if (HDC == null)
                    throw new NullReferenceException("HDC interface has to be valid");

                string cmd;
                var outputMsg = String.Empty;

                result.deviceID = workInput.deviceId;

                int tryCount = 0;

                //Try to connect to device via Wi-Fi
                do
                {
                    System.Threading.Thread.Sleep(500);
                    cmd = string.Format("tconn {0}", workInput.deviceId);
                    OpenHarmonyHilogInternalLog.Log("{0} {1}", HDC.GetHDCPath(), cmd);
                    outputMsg = HDC.Run(new[] { cmd }, "Unable to connect to " + workInput.deviceId);
                    tryCount++;

                    if (tryCount > 4)
                    {
                        throw new Exception(outputMsg);
                    }
                }
                while (!outputMsg.Contains("Target is connected"));

                result.message = "Connect OK";
                result.success = true;
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log(ex.Message);
                result.success = false;
                result.message = ex.Message;
            }
            return result;
        }
    }
}
