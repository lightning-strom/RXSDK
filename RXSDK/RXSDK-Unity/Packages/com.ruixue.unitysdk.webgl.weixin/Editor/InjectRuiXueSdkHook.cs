using System.IO;
using RuiXue.RuiXueBase.Editor;
using UnityEditor;
using UnityEngine;

#if UNITY_WEBGL && RUIXUE_MINIGAME_WEIXIN
using WeChatWASM;
public class InjectRuiXueSdkHook : LifeCycleBase
{
    const string SDKFOLDER = "RXJsSdk_WeiXin";
    private const string DSTFOLDER = "RuiXue_WeiXin";
    
    public override void afterBuildTemplate()
    {
        var pathSdk = AssetDatabase.FindAssets($"{SDKFOLDER}");
        if (pathSdk.Length == 0)
        {
            Debug.LogError($"注入瑞雪SDK 失败！找不到瑞雪SDK => {SDKFOLDER}");
            return;
        }

        var sdkSrcPath = AssetDatabase.GUIDToAssetPath(pathSdk[0]);
        var exportPath = BuildTemplateHelper.DstMinigameDir;
        var sdkDstPath = $"{exportPath}/{DSTFOLDER}";

        ProcessorFileUtil.CopyDirectory(sdkSrcPath, sdkDstPath);

        var gameJs = $"{exportPath}/game.js";
        if (!File.Exists(gameJs))
        {
            Debug.LogError($"注入瑞雪SDK 失败！找不到导出目标文件 => {gameJs}");
            return;
        }

        var lines = File.ReadAllLines(gameJs);
        string append = $"import './{DSTFOLDER}/CallJsRX_WeiXin.js'";
        bool find = false;
        foreach (var v in lines)
        {
            if (v == append)
            {
                find = true;
            }
        }

        if (!find)
        {
            File.AppendAllLines(gameJs, new[] { append });
        }

        Debug.Log($"注入瑞雪SDK成功!");
    }
}

#endif