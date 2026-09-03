using System.Collections;
using System.Collections.Generic;
using UnityEngine;

#if UNITY_IOS && UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

public class IOSLBSBuildPostProcessor
{
	private static RuiXueSDK_LBSXcodeSetting _setting;
	
	[PostProcessBuildAttribute(2)]
	public static void OnPostProcessBuild(BuildTarget target, string path)
	{
		if (target != BuildTarget.iOS)
			return;
		
		_setting =  AssetDatabase.LoadAssetAtPath<RuiXueSDK_LBSXcodeSetting>(RuiXueSDK_LBSXcodeSetting.AssetPath);
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
		
		plist.root.SetString("NSLocationAlwaysUsageDescription", _setting.PrivacyLocationAlwaysUsageDescription);
		plist.root.SetString("NSLocationAlwaysAndWhenInUseUsageDescription", _setting.PrivacyLocationAlwaysAndWhenInUseUsageDescription);
		plist.root.SetString("NSLocationWhenInUseUsageDescription", _setting.PrivacyLocationWhenInUseUsageDescription);
		
		PlistElement backgroundModes = plist.root["UIBackgroundModes"];
		PlistElementArray backgroundModesArray = null;
		if (backgroundModes == null)
		{
			backgroundModesArray = plist.root.CreateArray("UIBackgroundModes");
		}
		else
		{
			backgroundModesArray = backgroundModes as PlistElementArray;
		}
		
		backgroundModesArray.AddString("location"); // 添加后台定位模式
		
		// 应用修改
		plist.WriteToFile(plistPath);
	}

}
#endif