using System.Collections;
using System.Collections.Generic;
using UnityEngine;

#if UNITY_IOS && UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

public class IOSGoogleBuildPostProcessor
{
	private static RuiXueSDK_GoogleXcodeSetting _setting;
	
	[PostProcessBuildAttribute(2)]
	public static void OnPostProcessBuild(BuildTarget target, string path)
	{
		if (target != BuildTarget.iOS)
			return;
		
		_setting =  AssetDatabase.LoadAssetAtPath<RuiXueSDK_GoogleXcodeSetting>(RuiXueSDK_GoogleXcodeSetting.AssetPath);
		if (_setting == null)
			return;
		
		// 配置 info.plist
		SettingInfoPlist(path);
	}
	
	// 配置 info.plist
	static void SettingInfoPlist(string path)
	{
		// 修改Info.plist文件
		var plistPath = Path.Combine(path, "Info.plist");
		var plist = new PlistDocument();
		plist.ReadFromFile(plistPath);
		
		plist.root.SetString("GIDClientID", _setting.GIDClientID);
		
		// 添加 CFBundleURLTypes 
		PlistElement urlTypesElement = plist.root["CFBundleURLTypes"];
		PlistElementArray urlTypeArray = null; 
		if (urlTypesElement == null)
			urlTypeArray = plist.root.CreateArray("CFBundleURLTypes");
		else
			urlTypeArray = urlTypesElement as PlistElementArray;
		
		var urlTypeDict = urlTypeArray.AddDict();
		
		// IOS 网址架构
		urlTypeDict.SetString("CFBundleTypeRole", "Editor");
		urlTypeDict.SetString("CFBundleURLName", "google");
		var urlScheme = urlTypeDict.CreateArray("CFBundleURLSchemes");
		urlScheme.AddString(_setting.REVERSED_CLIENT_ID);
		
		// 应用修改
		plist.WriteToFile(plistPath);
	}
}
#endif