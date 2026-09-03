#if UNITY_IOS && UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using Debug = UnityEngine.Debug;
using UnityEditor.iOS.Xcode;

public class RXIosBuildPostProcessor
{
	// facebook client token
	private static string fbClientToken = "c7422414b5c54280ded0e6806c52";
	// facebook appid
	private static string fbAppID = "7472805502731255";
		
	[PostProcessBuildAttribute(2)]
	public static void OnPostProcessBuild(BuildTarget target, string path)
	{
		if (target != BuildTarget.iOS)
			return;

		// 配置 info.plist
		//SettingInfoPlist(path);
		
		// 配置 capability
		//SettingCapability(path);
	}
	
	// 编辑 info.plist
	static void SettingInfoPlist(string path)
	{
		// 修改Info.plist文件
		var plistPath = Path.Combine(path, "Info.plist");
		var plist = new PlistDocument();
		plist.ReadFromFile(plistPath);
        
        // 添加 Queried URL Schemes
        var queriedUrlScheme = plist.root.CreateArray("LSApplicationQueriesSchemes");
        
        /// Facebook 相关
        queriedUrlScheme.AddString(fbAppID);
        queriedUrlScheme.AddString("fbapi");
        queriedUrlScheme.AddString("fb-messenger-share-api");
        
        // 添加 appid 
        PlistElement element = plist.root["CFBundleURLTypes"];
        PlistElementArray urlTypeArray = null; 
        if (element == null)
	        urlTypeArray = plist.root.CreateArray("CFBundleURLTypes");
        else
	        urlTypeArray = element as PlistElementArray;
		
        var urlTypeDict = urlTypeArray.AddDict();
        
        /// 添加Facebook app id
        urlTypeDict.SetString("CFBundleTypeRole", "Editor");
        urlTypeDict.SetString("CFBundleURLName", "facebook app id");
        var urlScheme = urlTypeDict.CreateArray("CFBundleURLSchemes");
        urlScheme.AddString(fbAppID);
        
        // 添加FacebookClientToken
        plist.root.SetString("FacebookClientToken", fbClientToken);
        Debug.Log("添加FacebookClientToken配置" + fbClientToken);
        
        // 添加FacebookAppID
        plist.root.SetString("添加FacebookAppID", fbAppID);
        Debug.Log("添加FacebookAppID配置" + fbAppID);
        
		// 应用修改
		plist.WriteToFile(plistPath);
	}
	
	// 编辑 capability
	static void SettingCapability(string path)
	{
		// entitlements 相对路径
		string entitmentPath = RXIosXcodeTool.CreateEntitlements();
		
		ProjectCapabilityManager projectCapabilityManager = new 
			ProjectCapabilityManager(RXIosXcodeTool.PbxProjPath, entitmentPath, RXIosXcodeTool.EntitlementName); 

		// 添加苹果登录 Sign in with Apple
		projectCapabilityManager.AddSignInWithApple();
		
		// 添加推送 Push Notifications
		projectCapabilityManager.AddPushNotifications(true);

		projectCapabilityManager.WriteToFile();
	}
}
#endif