using System.Collections;
using System.Collections.Generic;
using UnityEngine;

#if UNITY_IOS && UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

public class IOSLineBuildPostProcessor
{
	private static RuiXueSDK_LineXcodeSetting _setting;
	
	[PostProcessBuildAttribute(2)]
	public static void OnPostProcessBuild(BuildTarget target, string path)
	{
		if (target != BuildTarget.iOS)
			return;
		
		_setting =  AssetDatabase.LoadAssetAtPath<RuiXueSDK_LineXcodeSetting>(RuiXueSDK_LineXcodeSetting.AssetPath);
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
		queriedUrlScheme.AddString("lineauth2");

		PlistElementDict dict = plist.root.CreateDict("LineSDKConfig");
		dict.SetString("ChannelID", $"{_setting.ChannelID}");
		
		
		// 添加 CFBundleURLTypes 
		PlistElement urlTypesElement = plist.root["CFBundleURLTypes"];
		PlistElementArray urlTypeArray = null; 
		if (urlTypesElement == null)
			urlTypeArray = plist.root.CreateArray("CFBundleURLTypes");
		else
			urlTypeArray = urlTypesElement as PlistElementArray;
		
		var urlTypeDict = urlTypeArray.AddDict();
		
		
		urlTypeDict.SetString("CFBundleTypeRole", "Editor");
		urlTypeDict.SetString("CFBundleURLName", "line");
		var urlScheme = urlTypeDict.CreateArray("CFBundleURLSchemes");
		urlScheme.AddString("line3rdp.$(PRODUCT_BUNDLE_IDENTIFIER)");
		
		// 应用修改
		plist.WriteToFile(plistPath);
	}
}
#endif