using UnityEditor;
using UnityEngine;

public partial class RuiXueMiniGamePluginSwitch
{
    private const string DefineSymbol_WeiXin = "RUIXUE_MINIGAME_WEIXIN";

    public static void EnableWeiXin(bool enable)
    {
        string symbols = PlayerSettings.GetScriptingDefineSymbolsForGroup(BuildTargetGroup.WebGL);
        if (enable)
        {
            if (!symbols.Contains(DefineSymbol_WeiXin))
            {
                symbols += ";" + DefineSymbol_WeiXin;
                Debug.Log("Added define symbol: " + DefineSymbol_WeiXin);
            }
        }
        else
        {
            if (symbols.Contains(DefineSymbol_WeiXin))
            {
                symbols = symbols.Replace(DefineSymbol_WeiXin, "").Replace(";;", ";");
                symbols = symbols.Trim(';');
                Debug.Log("Removed define symbol: " + DefineSymbol_WeiXin);
            }
        }
        PlayerSettings.SetScriptingDefineSymbolsForGroup(BuildTargetGroup.WebGL, symbols);
    }
    
    [MenuItem("瑞雪SDK/小游戏插件开关/微信")]
    private static void ToggleWeiXin()
    {
        string symbols = PlayerSettings.GetScriptingDefineSymbolsForGroup(BuildTargetGroup.WebGL);
        if (symbols.Contains(DefineSymbol_WeiXin))
        {
            symbols = symbols.Replace(DefineSymbol_WeiXin, "").Replace(";;", ";");
            symbols = symbols.Trim(';');
            Debug.Log("Removed define symbol: " + DefineSymbol_WeiXin);
        }
        else
        {
            symbols += ";" + DefineSymbol_WeiXin;
            Debug.Log("Added define symbol: " + DefineSymbol_WeiXin);
        }
        PlayerSettings.SetScriptingDefineSymbolsForGroup(BuildTargetGroup.WebGL, symbols);
    }

    [MenuItem("瑞雪SDK/小游戏插件开关/微信", true)]
    private static bool ToggleWeiXinValidate()
    {
        string symbols = PlayerSettings.GetScriptingDefineSymbolsForGroup(BuildTargetGroup.WebGL);
        Menu.SetChecked("瑞雪SDK/小游戏插件开关/微信", symbols.Contains(DefineSymbol_WeiXin));
        return true;
    }
}