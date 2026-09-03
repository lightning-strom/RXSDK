using System.Collections;
using System.Collections.Generic;
using UnityEngine;

#if UNITY_IOS && UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

public class IOSWeiXinBuildPostProcessor
{
	private static RuiXueSDK_WeiXinXcodeSetting _setting;
	
	[PostProcessBuildAttribute(2)]
	public static void OnPostProcessBuild(BuildTarget target, string path)
	{
		if (target != BuildTarget.iOS)
			return;
		
		_setting =  AssetDatabase.LoadAssetAtPath<RuiXueSDK_WeiXinXcodeSetting>(RuiXueSDK_WeiXinXcodeSetting.AssetPath);
		if (_setting == null)
			return;
		
		// 配置 info.plist
		SettingInfoPlist(path);
		
		// 配置 capability
		SettingCapability(path);
	}
	
	// 配置 info.plist
	static void SettingInfoPlist(string path)
	{
		// 修改Info.plist文件
		var plistPath = Path.Combine(path, "Info.plist");
		var plist = new PlistDocument();
		plist.ReadFromFile(plistPath);

		// 添加 Queried URL Schemes
		PlistElement queryElement = plist.root["LSApplicationQueriesSchemes"];
		PlistElementArray queriedUrlScheme = null;
		if (queryElement == null)
			queriedUrlScheme = plist.root.CreateArray("LSApplicationQueriesSchemes");
		else
			queriedUrlScheme = queryElement as PlistElementArray;

		queriedUrlScheme.AddString("wechat");
		queriedUrlScheme.AddString("weixin");
		queriedUrlScheme.AddString("weixinULAPI");

		// 添加 CFBundleURLTypes 
		PlistElement element = plist.root["CFBundleURLTypes"];
		PlistElementArray urlTypeArray = null; 
		if (element == null)
			urlTypeArray = plist.root.CreateArray("CFBundleURLTypes");
		else
			urlTypeArray = element as PlistElementArray;
		
		var urlTypeDict = urlTypeArray.AddDict();
		
		// app id
		urlTypeDict.SetString("CFBundleTypeRole", "Editor");
		urlTypeDict.SetString("CFBundleURLName", "wechat");
		var urlScheme = urlTypeDict.CreateArray("CFBundleURLSchemes");
		urlScheme.AddString(_setting.AppID);
		
		// 应用修改
		plist.WriteToFile(plistPath);
	}
	
	// 配置 AssociatedDomains
	static void SettingCapability(string path)
	{
		if (_setting.AssociatedDomains.Length == 0)
			return;
		
		// entitlements 相对路径
		string entitmentPath = RXIosXcodeTool.CreateEntitlements();
		
		ProjectCapabilityManager projectCapabilityManager = new 
			ProjectCapabilityManager(RXIosXcodeTool.PbxProjPath, entitmentPath, RXIosXcodeTool.EntitlementName); 
		
		projectCapabilityManager.AddAssociatedDomains(_setting.AssociatedDomains);

		projectCapabilityManager.WriteToFile();
	}
}
#endif