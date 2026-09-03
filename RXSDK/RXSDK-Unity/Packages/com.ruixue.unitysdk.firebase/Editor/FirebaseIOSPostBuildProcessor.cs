#if UNITY_IOS && UNITY_EDITOR
using UnityEngine;
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

public class FirebaseIOSPostBuildProcessor
{
    [PostProcessBuild(1)]
    public static void OnPostProcessBuild(BuildTarget target, string path)
    {
        if (target != BuildTarget.iOS)
            return;

        CopyGoogleServiceInfoPlist(path);
    }
    

    public static void CopyGoogleServiceInfoPlist(string path)
    {
        //读取源文件路径
        string googleFileSourceParh = Application.dataPath + "/Plugins/IOS/GoogleService-Info.plist";
        //拷贝文件(源路径及文件名, 拷贝路径及文件名, 若该文件名已存在,是否替换)
        if (File.Exists(googleFileSourceParh))
        {
            File.Copy(googleFileSourceParh, path + "/GoogleService-Info.plist", true);
        }
        
        string projectPath = PBXProject.GetPBXProjectPath(path);
        PBXProject pbxProject = new PBXProject();
        pbxProject.ReadFromFile(projectPath);
        string targetGuid = pbxProject.GetUnityMainTargetGuid();

        // 添加文件到target
        string fileGuid = pbxProject.AddFile("GoogleService-Info.plist", "GoogleService-Info.plist");
        pbxProject.AddFileToBuild(targetGuid, fileGuid);

        // 保存修改
        File.WriteAllText(projectPath, pbxProject.WriteToString());
    }
}
#endif