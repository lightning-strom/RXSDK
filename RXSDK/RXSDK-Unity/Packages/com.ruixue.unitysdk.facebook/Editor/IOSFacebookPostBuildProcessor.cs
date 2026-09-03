using System.Collections;
using System.Collections.Generic;
using UnityEngine;

#if UNITY_IOS && UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

public class IOSFacebookBuildPostProcessor
{
	private static RuiXueSDK_FacebookXcodeSetting _setting;
	
	[PostProcessBuildAttribute(2)]
	public static void OnPostProcessBuild(BuildTarget target, string path)
	{
		if (target != BuildTarget.iOS)
			return;
		
		_setting =  AssetDatabase.LoadAssetAtPath<RuiXueSDK_FacebookXcodeSetting>(RuiXueSDK_FacebookXcodeSetting.AssetPath);
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
		
		// 添加FacebookClientToken
		plist.root.SetString("FacebookClientToken", _setting.FacebookClientToken);
		// 添加FacebookAppID
		plist.root.SetString("FacebookAppID", _setting.FacebookAppID);
		
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
		queriedUrlScheme.AddString(_setting.FbId);
		queriedUrlScheme.AddString("fbapi");
		queriedUrlScheme.AddString("fb-messenger-share-api");
		
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
		urlTypeDict.SetString("CFBundleURLName", "facebook");
		var urlScheme = urlTypeDict.CreateArray("CFBundleURLSchemes");
		urlScheme.AddString(_setting.FbId);
		
		// 应用修改
		plist.WriteToFile(plistPath);
	}
}
#endif