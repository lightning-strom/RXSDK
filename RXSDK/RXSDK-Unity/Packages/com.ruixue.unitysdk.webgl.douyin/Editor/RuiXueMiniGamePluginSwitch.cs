using UnityEditor;
using UnityEngine;

public partial class RuiXueMiniGamePluginSwitch
{
    private const string DefineSymbol_DouYin = "RUIXUE_MINIGAME_DOUYIN";

    public static void EnableDouYin(bool enable)
    {
        string symbols = PlayerSettings.GetScriptingDefineSymbolsForGroup(BuildTargetGroup.WebGL);
        if (enable)
        {
            if (!symbols.Contains(DefineSymbol_DouYin))
            {
                symbols += ";" + DefineSymbol_DouYin;
                Debug.Log("Added define symbol: " + DefineSymbol_DouYin);
            }
        }
        else
        {
            if (symbols.Contains(DefineSymbol_DouYin))
            {
                symbols = symbols.Replace(DefineSymbol_DouYin, "").Replace(";;", ";");
                symbols = symbols.Trim(';');
                Debug.Log("Removed define symbol: " + DefineSymbol_DouYin);
            }
        }
        PlayerSettings.SetScriptingDefineSymbolsForGroup(BuildTargetGroup.WebGL, symbols);
    }

    [MenuItem("瑞雪SDK/小游戏插件开关/抖音")]
    private static void ToggleDouYin()
    {
        string symbols = PlayerSettings.GetScriptingDefineSymbolsForGroup(BuildTargetGroup.WebGL);
        if (symbols.Contains(DefineSymbol_DouYin))
        {
            symbols = symbols.Replace(DefineSymbol_DouYin, "").Replace(";;", ";");
            symbols = symbols.Trim(';');
            Debug.Log("Removed define symbol: " + DefineSymbol_DouYin);
        }
        else
        {
            symbols += ";" + DefineSymbol_DouYin;
            Debug.Log("Added define symbol: " + DefineSymbol_DouYin);
        }
        PlayerSettings.SetScriptingDefineSymbolsForGroup(BuildTargetGroup.WebGL, symbols);
    }

    [MenuItem("瑞雪SDK/小游戏插件开关/抖音", true)]
    private static bool ToggleDouYinValidate()
    {
        string symbols = PlayerSettings.GetScriptingDefineSymbolsForGroup(BuildTargetGroup.WebGL);
        Menu.SetChecked("瑞雪SDK/小游戏插件开关/抖音", symbols.Contains(DefineSymbol_DouYin));
        return true;
    }
}