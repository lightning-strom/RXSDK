#if UNITY_ANDROID && UNITY_EDITOR
using System;
using UnityEngine;
using System.IO;
using UnityEditor.Android;

public class OaidAfterBuildToDo : IPostGenerateGradleAndroidProject
{
    public int callbackOrder { get { return 0; } }

    private bool compareVersion(string version1, string version2)
    {
        string[] version1List = version1.Split('.');
        string[] version2List = version2.Split('.');
        int v1year = Int32.Parse(version1List[0]);
        int v2year = Int32.Parse(version2List[0]);
        if (v1year != v2year)
        {
            return v1year > v2year;
        }
        int v1sub = Int32.Parse(version1List[1]);
        int v2sub = Int32.Parse(version2List[1]);
        return v1sub > v2sub;
    }
    
    private string getOutputPath(string path){
        if(compareVersion("2019.3", Application.unityVersion)) {
            return path;
        }
        
        DirectoryInfo parent = new DirectoryInfo(path).Parent;
        return Path.Combine(parent.FullName, "launcher");
    }

    public void OnPostGenerateGradleAndroidProject(string path)
    {
        Debug.Log(path);
        string launcherPath = getOutputPath(path);
        Debug.Log(launcherPath);
        // vivo
        string vivoSourceParh = Application.dataPath + "/Plugins/Android/supplierconfig.json";
        if (File.Exists(vivoSourceParh))
        {
            String destPath = launcherPath + "/src/main/assets/";
            
            if (!Directory.Exists(destPath))
            {
                Directory.CreateDirectory(destPath);
            }
            File.Copy(vivoSourceParh, destPath + "supplierconfig.json", true);
        }
        
    }
}
#endif