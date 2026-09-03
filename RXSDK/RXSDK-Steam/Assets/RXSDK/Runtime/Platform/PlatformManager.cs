using UnityEngine;
using System.Collections.Generic;

namespace RXSDK
{
    public class PlatformManager
    {
        public static PlatformManager Instance { get; private set; }
        private Dictionary<string, IPlatformInterface> platforms;
        private IPlatformInterface currentPlatform;

        public void Init()
        {
            Instance = this;
            platforms = new Dictionary<string, IPlatformInterface>();
        }

        public void RegisterPlatform(IPlatformInterface platform)
        {
            if (!platforms.ContainsKey(platform.PlatformId))
            {
                platforms.Add(platform.PlatformId, platform);
                Debug.Log($"Registered platform: {platform.PlatformName}");
            }
        }

        public bool InitializePlatform(string platformId)
        {
            if (platforms.TryGetValue(platformId, out IPlatformInterface platform))
            {
                bool success = platform.Initialize();
                if (success)
                {
                    currentPlatform = platform;
                    Debug.Log($"Initialized platform: {platform.PlatformName}");
                }
                return success;
            }
            Debug.LogError($"Platform not found: {platformId}");
            return false;
        }

        public IPlatformInterface GetCurrentPlatform()
        {
            return currentPlatform;
        }

        public T GetPlatform<T>(string platformId) where T : class, IPlatformInterface
        {
            if (platforms.TryGetValue(platformId, out IPlatformInterface platform))
            {
                return platform as T;
            }
            return null;
        }
    }
}