#if UNITY_IOS && UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

public static class RXIosXcodeTool
{
    // 导出Xcode项目目录
    public static string ExportPath { get; private set; }

    // entitment 名称
    public static string EntitlementName { get; set; } = "Unity-iPhone";

    /// <summary>
    /// pbx proj 路径
    /// </summary>
    public static string PbxProjPath => PBXProject.GetPBXProjectPath(ExportPath);

    /// <summary>
    /// 主target名称
    /// </summary>
    public static string MainTargetName { get; set; } = "Unity-iPhone";

    [PostProcessBuildAttribute(0)]
    public static void OnPostProcessBuild(BuildTarget target, string path)
    {
        if (target != BuildTarget.iOS)
            return;
        
        ExportPath = path;
    }
    
    // 获取 pbxProject 实例
    public static PBXProject PbxProject()
    {
        var projPath = PBXProject.GetPBXProjectPath(ExportPath);
        var pbxProject = new PBXProject();
        pbxProject.ReadFromString(File.ReadAllText(projPath));
        return pbxProject;
    }
    
    // 创建Entitlements
    public static string CreateEntitlements()
    {
        // entitlements 相对路径
        string entitmentPath = EntitlementName + "/" + EntitlementName + ".entitlements";

        PBXProject pbxProject = RXIosXcodeTool.PbxProject();
        pbxProject.SetBuildProperty(pbxProject.GetUnityMainTargetGuid(), "CODE_SIGN_ENTITLEMENTS", entitmentPath);
        return entitmentPath;
    }
}

#endif