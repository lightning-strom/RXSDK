using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

#if UNITY_IOS && UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

public class IOSSnapChatPostBuildProcessor
{
	private static RuiXueSDK_SnapChatXcodeSetting _setting;
	
	[PostProcessBuildAttribute(2)]
	public static void OnPostProcessBuild(BuildTarget target, string path)
	{
		if (target != BuildTarget.iOS)
			return;
		
		_setting =  AssetDatabase.LoadAssetAtPath<RuiXueSDK_SnapChatXcodeSetting>(RuiXueSDK_SnapChatXcodeSetting.AssetPath);
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
		
		// 添加SCSDKClientId
		plist.root.SetString("SCSDKClientId", _setting.SCSDKClientId);
		// 添加SCSDKRedirectUrl
		plist.root.SetString("SCSDKRedirectUrl", _setting.SCSDKRedirectUrl);
		
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
		queriedUrlScheme.AddString("snapchat");
		queriedUrlScheme.AddString("bitmoji-sdk");
		queriedUrlScheme.AddString("itms-apps");
		
		// 添加 CFBundleURLTypes 
		PlistElement urlTypesElement = plist.root["CFBundleURLTypes"];
		PlistElementArray urlTypeArray = null; 
		if (urlTypesElement == null)
			urlTypeArray = plist.root.CreateArray("CFBundleURLTypes");
		else
			urlTypeArray = urlTypesElement as PlistElementArray;
		
		var urlTypeDict = urlTypeArray.AddDict();
		
		// scheme
		urlTypeDict.SetString("CFBundleTypeRole", "Editor");
		urlTypeDict.SetString("CFBundleURLName", "ruixue");
		var urlScheme = urlTypeDict.CreateArray("CFBundleURLSchemes");
		urlScheme.AddString("ruixue");
		
		// SCSDKScopes
		PlistElement soopeElement = plist.root["SCSDKScopes"];
		PlistElementArray scopeUrlScheme = null;
		if (soopeElement == null)
		{
			// 添加 scopeUrlScheme
			scopeUrlScheme = plist.root.CreateArray("SCSDKScopes");
		}
		else
		{
			scopeUrlScheme = queryElement as PlistElementArray;
		}
		
		foreach (string scopeStr in _setting.SCSDKScopes)
		{
			scopeUrlScheme.AddString(scopeStr);
		}
		
		// 应用修改
		plist.WriteToFile(plistPath);
	}
}
#endif