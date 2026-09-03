#if UNITY_ANDROID && UNITY_EDITOR
using System;
using UnityEngine;
using System.IO;
using UnityEditor.Android;

public class FirebaseAfterBuildToDo : IPostGenerateGradleAndroidProject
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
        Debug.Log("path: " + path);
        string launcherPath = getOutputPath(path);
        Debug.Log("launcherPath: " + launcherPath);
        //读取源文件路径
        string googleFileSourceParh = Application.dataPath + "/Plugins/Android/google-services.json";
        //拷贝文件(源路径及文件名, 拷贝路径及文件名, 若该文件名已存在,是否替换)
        if (File.Exists(googleFileSourceParh))
        {
            File.Copy(googleFileSourceParh, launcherPath + "/google-services.json", true);
        }

        string icNotificationDefaultPath = Application.dataPath + "/Resources/ic_notification_default.png";
        if (File.Exists(icNotificationDefaultPath))
        {
            string drawablePath = launcherPath + "/src/main/res/drawable";
            if (!Directory.Exists(drawablePath))
            {
                Directory.CreateDirectory(drawablePath);
            }

            File.Copy(icNotificationDefaultPath, 
                drawablePath +  "/ic_notification_default.png", true);
        }


    }
}
#endif