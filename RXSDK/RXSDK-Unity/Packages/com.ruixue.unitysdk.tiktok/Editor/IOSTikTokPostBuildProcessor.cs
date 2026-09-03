using System.Collections;
using System.Collections.Generic;
using UnityEngine;

#if UNITY_IOS && UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

public class IOSTikTokBuildPostProcessor
{
	private static RuiXueSDK_TikTokXcodeSetting _setting;
	
	[PostProcessBuildAttribute(2)]
	public static void OnPostProcessBuild(BuildTarget target, string path)
	{
		if (target != BuildTarget.iOS)
			return;
		
		_setting =  AssetDatabase.LoadAssetAtPath<RuiXueSDK_TikTokXcodeSetting>(RuiXueSDK_TikTokXcodeSetting.AssetPath);
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
		
		// 添加TikTokAppID
		plist.root.SetString("TikTokAppID", _setting.TikTokAppID);
		//添加相册权限
		plist.root.SetString("NSPhotoLibraryUsageDescription", _setting.PrivacyPhotoLibraryUsageDescription);
		
		// ApplicationQueriesSchemes
		PlistElement queryElement = plist.root["LSApplicationQueriesSchemes"];
		PlistElementArray queriedUrlScheme = null;
		if (queryElement == null)
		{
			// 添加 Queried URL Schemes
			queriedUrlScheme = plist.root.CreateArray("LSApplicationQueriesSchemes");
		}
		else
		{
			queriedUrlScheme = queryElement as PlistElementArray;
		}
		queriedUrlScheme.AddString("tiktokopensdk");
		queriedUrlScheme.AddString("tiktoksharesdk");
		queriedUrlScheme.AddString("snssdk1180");
		queriedUrlScheme.AddString("snssdk1233");
		
		// 添加 CFBundleURLTypes 
		PlistElement urlTypesElement = plist.root["CFBundleURLTypes"];
		PlistElementArray urlTypeArray = null; 
		if (urlTypesElement == null)
			urlTypeArray = plist.root.CreateArray("CFBundleURLTypes");
		else
			urlTypeArray = urlTypesElement as PlistElementArray;
		
		var urlTypeDict = urlTypeArray.AddDict();
		
		// app id
		urlTypeDict.SetString("CFBundleTypeRole", "Editor");
		urlTypeDict.SetString("CFBundleURLName", "TikTokAppID");
		var urlScheme = urlTypeDict.CreateArray("CFBundleURLSchemes");
		urlScheme.AddString(_setting.TikTokAppID);
		
		// 应用修改
		plist.WriteToFile(plistPath);
	}
}
#endif