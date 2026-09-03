using UnityEngine;
using RXSDK;

public class PrefabLoader : MonoBehaviour
{
    [Header("Platform Specific Prefabs")]
    [Tooltip("Windows platform specific prefab")]
    public GameObject windowsPrefab;

    [Tooltip("macOS platform specific prefab")]
    public GameObject macOSPrefab;

    [Tooltip("OpenHarmony platform specific prefab")]
    public GameObject openHarmonyPrefab;

    [Tooltip("Android platform specific prefab")]
    public GameObject androidPrefab;

    [Tooltip("iOS platform specific prefab")]
    public GameObject iosPrefab;

    [Header("Settings")]
    [Tooltip("Whether to automatically initialize the platform prefab on start")]
    public bool autoInitialize = true;

    [Tooltip("Whether to destroy this loader after instantiating the prefab")]
    public bool destroyAfterInstantiate = false;

    private GameObject currentPlatformInstance;

    private void Start()
    {
        if (autoInitialize)
        {
            InitializePlatformPrefab();
        }
    }

    public void InitializePlatformPrefab()
    {
        // 如果已经有实例，先销毁
        if (currentPlatformInstance != null)
        {
            Destroy(currentPlatformInstance);
        }

        GameObject prefabToInstantiate = GetPlatformPrefab();

        if (prefabToInstantiate != null)
        {
            try
            {
                // 实例化预置体
                currentPlatformInstance = Instantiate(prefabToInstantiate);

                // 初始化平台特定组件
                InitializePlatformSpecificComponents(currentPlatformInstance);

                Debug.Log($"Successfully instantiated platform prefab: {prefabToInstantiate.name} for platform: {Application.platform}");

                if (destroyAfterInstantiate)
                {
                    Destroy(gameObject);
                }
            }
            catch (System.Exception e)
            {
                Debug.LogError($"Failed to instantiate platform prefab: {e.Message}");
                if (currentPlatformInstance != null)
                {
                    Destroy(currentPlatformInstance);
                    currentPlatformInstance = null;
                }
            }
        }
        else
        {
            Debug.LogWarning($"No prefab assigned for current platform: {Application.platform}");
        }
    }

    private void InitializePlatformSpecificComponents(GameObject instance)
    {
        // 根据平台初始化特定组件
        switch (Application.platform)
        {
            case RuntimePlatform.WindowsPlayer:
                Debug.Log("Initializing Windows platform specific components");
                break;

            case RuntimePlatform.OSXPlayer:
                Debug.Log("Initializing macOS platform specific components");
                break;

            case RuntimePlatform.Android:
                // 初始化 Android 特定组件
                break;

            case RuntimePlatform.IPhonePlayer:
                // 初始化 iOS 特定组件
                break;
#if UNITY_OPENHARMONY
            case RuntimePlatform.OpenHarmony:
                // 初始化 OpenHarmony 特定组件
                break;
#endif
        }
    }

    private GameObject GetPlatformPrefab()
    {
        Debug.Log($"Getting platform prefab for platform: {Application.platform}");
        switch (Application.platform)
        {
            case RuntimePlatform.WindowsPlayer:
                return windowsPrefab;
            case RuntimePlatform.OSXEditor:
                return macOSPrefab;
            case RuntimePlatform.OSXPlayer:
                return macOSPrefab;
            case RuntimePlatform.Android:
                return androidPrefab;
            case RuntimePlatform.IPhonePlayer:
                return iosPrefab;
#if UNITY_OPENHARMONY
            case RuntimePlatform.OpenHarmony:
                return openHarmonyPrefab;
#endif
            default:
                Debug.LogWarning($"Unsupported platform: {Application.platform}");
                return null;
        }
    }

    public void SetAutoInitialize(bool value)
    {
        autoInitialize = value;
    }

    public void SetDestroyAfterInstantiate(bool value)
    {
        destroyAfterInstantiate = value;
    }


    public GameObject GetCurrentPlatformInstance()
    {
        return currentPlatformInstance;
    }

    private void OnDestroy()
    {
        // 清理当前平台实例
        if (currentPlatformInstance != null)
        {
            Destroy(currentPlatformInstance);
            currentPlatformInstance = null;
        }
    }
}