using UnityEngine;
using System.IO;

public class SteamAppIDWriter : MonoBehaviour
{
    private void Awake()
    {
#if !UNITY_EDITOR
        WriteSteamAppID();
#endif
    }

    void WriteSteamAppID()
    {
        string appId = ReadAppIDFromProjectRoot();
        if (string.IsNullOrEmpty(appId)) return;

        string pathToWrite = GetMacExecutableDir();
        if (string.IsNullOrEmpty(pathToWrite)) return;

        string filePath = Path.Combine(pathToWrite, "steam_appid.txt");
        if (!File.Exists(filePath))
        {
            File.WriteAllText(filePath, appId);
            Debug.Log("steam_appid.txt written to: " + filePath);
        }
    }

    string ReadAppIDFromProjectRoot()
    {
        string rootPath = Path.Combine(Application.dataPath, "..", "steam_appid.txt");
        string fullPath = Path.GetFullPath(rootPath);
        if (!File.Exists(fullPath))
        {
            Debug.LogWarning("steam_appid.txt not found at: " + fullPath);
            return null;
        }
        return File.ReadAllText(fullPath).Trim();
    }

    string GetMacExecutableDir()
    {
#if UNITY_STANDALONE_OSX
        string dataPath = Application.dataPath; // e.g. /YourGame.app/Contents/Resources/Data
        string macPath = Path.Combine(dataPath, "..", "MacOS");
        return Path.GetFullPath(macPath);
#else
        return null;
#endif
    }
}