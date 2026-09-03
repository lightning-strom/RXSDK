using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;
using UWA;

namespace UWA
{
    public static partial class UWAGPMInternal
    {
        [DllImport(UWA_DLL)]
        [return: MarshalAs(UnmanagedType.LPWStr)]
        internal extern static System.IntPtr UwaGpmGetSDKInfo(int type);

        public static string GetSDKInfo(int type)
        {
            if (!s_isSetup) return null;

            try
            {
                System.IntPtr ptr = UwaGpmGetSDKInfo(type);

                if (ptr == System.IntPtr.Zero) return null;

                int len = 0;
                while (Marshal.ReadByte(ptr, len) != 0) ++len; // Find the length of the string
                byte[] buffer = new byte[len];
                Marshal.Copy(ptr, buffer, 0, buffer.Length);
                return System.Text.Encoding.UTF8.GetString(buffer);
            }
            catch (System.Exception ex)
            {
                return "Error: Failed to get sdk info.\n Exception details: " + ex.Message;
            }
        }

    }
}

public static partial class UWAGPM
{
    /// <summary>
    /// Represents the different types of info that can be get by the SDK.
    /// </summary>
    public enum SDKInfoType
    {
        GPM_ID,             // GPM ID
        DEVICE_ID,          // Device ID
        DEVICE_MODEL,       // Device model
        SYSTEM,             // System version
        RESOLUTION,         // Resolution
        GRAPHIC_API,        // Graphic API
        EMULATOR,           // Emulator or not
        ROOT,               // Root or not
        CPU_CORE,           // CPU core number
        GPU_MODEL,          // GPU model
        RAM_MB,             // RAM size in MB
        ROM_GB,             // ROM size in GB
            
        SESSION_ID,         // Session ID
        USER_ID,            // User ID
        APP_VERSION,        // App version
        APP_CHANNEL,        // App channel
        
        NUM,
    }


    /// <summary>
    /// Gets the value of the specified SDK info type.
    /// </summary>
    /// <param name="type">The type of SDK info to retrieve.</param>
    /// <returns>The value of the specified SDK info, or null if the info is not available.</returns>
    public static string GetSDKInfo(SDKInfoType type)
    {
        return _platformHandler.GetSDKInfo(type);
    }

    private partial interface IPlatformHandler
    {
        string GetSDKInfo(SDKInfoType type);
    }

    private partial class DefaultHandler : IPlatformHandler
    {
        public string GetSDKInfo(SDKInfoType type)
        {
            return UWAGPMInternal.GetSDKInfo((int)type);
        }
    }

    private partial class EmptyHandler : IPlatformHandler
    {
        public string GetSDKInfo(SDKInfoType type) { return null; }
    }
}
