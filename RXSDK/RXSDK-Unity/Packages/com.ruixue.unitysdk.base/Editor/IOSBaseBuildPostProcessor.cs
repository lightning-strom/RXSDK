#if UNITY_IOS && UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEngine;
using Debug = UnityEngine.Debug;
using UnityEditor.iOS.Xcode;

public class IOSBaseBuildPostProcessor
{
	[PostProcessBuildAttribute(1)]
	public static void OnPostProcessBuild(BuildTarget target, string path)
	{
		if (target != BuildTarget.iOS)
			return;

		// 配置 info.plist
		SettingInfoPlist(path);
		
		PodInstall(path);
	}
	
	// 编辑 info.plist
	static void SettingInfoPlist(string path)
	{
		// 修改Info.plist文件
		var plistPath = Path.Combine(path, "Info.plist");
		var plist = new PlistDocument();
		plist.ReadFromFile(plistPath);

		string trackDescription = "此标识符将用于向您推荐个性化广告。";
		var setting =  AssetDatabase.LoadAssetAtPath<RuiXueSDK_BaseXcodeSetting>(RuiXueSDK_BaseXcodeSetting.AssetPath);
		if (setting && !string.IsNullOrEmpty(setting.PrivacyTrackingUsageDescription))
		{
			trackDescription = setting.PrivacyTrackingUsageDescription;
		}
		
		// 添加获取IDFA权限
        plist.root.SetString("NSUserTrackingUsageDescription", trackDescription);
        
		// 应用修改
		plist.WriteToFile(plistPath);
	}

	static string GetPodFile()
	{
		string[] podFiles = AssetDatabase.FindAssets("Podfile");
		string[] podTemplateFiles = AssetDatabase.FindAssets("PodfileTemplate");
		if (podTemplateFiles.Length == 0)
		{
			return null;
		}
		
		string podTemplateFile = Path.GetFullPath(AssetDatabase.GUIDToAssetPath(podTemplateFiles[0]));
		HashSet<string> podLines = new HashSet<string>();
		foreach (var f in podFiles)
		{
			string podFile = Path.GetFullPath(AssetDatabase.GUIDToAssetPath(f));
			string[] allLines = File.ReadAllLines(podFile);
			foreach(var line in allLines)
			{
				var podLine = line.Trim();
				if(podLine.StartsWith("pod"))
					podLines.Add(podLine);
			}
		}
		
		// 生成pod buildTemp
		string podBuildTempFile = Path.Combine(Application.dataPath, "tempFileBuild");
		if (!File.Exists(podBuildTempFile))
		{
			File.Copy(podTemplateFile, podBuildTempFile);
		}
		
		// 读取模版文件内容
		string templateContent = File.ReadAllText(podTemplateFile);
		
		// 替换模版内容
		StringBuilder sbPods = new StringBuilder();
		foreach(String str in podLines){
			sbPods.AppendLine(str);
		}
		string newLine = sbPods.ToString();
		string extensionTargets = string.Empty;
		if (podLines.Contains("pod 'RXPushSDK'"))
		{
			extensionTargets =
				"target 'NotificationService' do\n" +
				"    use_frameworks!\n" +
				"    pod 'RXPushSDK'\n" +
				"end\n";
		}

		string replacedContent = templateContent
			.Replace("{{RUIXUE_POD}}", newLine)
			.Replace("{{RUIXUE_EXTENSION_TARGETS}}", extensionTargets);
		
		// 写入buildTemp
		File.WriteAllText(podBuildTempFile, replacedContent);
		return podBuildTempFile;
	}
	
	static void PodInstall(string xcodePath)
	{
		string podFile = GetPodFile();
		if (string.IsNullOrEmpty(podFile))
		{
			throw new Exception("can't find pod file template");
		}
		
		Debug.Log($"podfile = {podFile}");
		
		//生成shell脚本
		string shPath = Path.Combine(xcodePath, "podinstall.sh");
		StringBuilder sb = new StringBuilder();
		sb.AppendLine("#!/bin/sh");
		sb.AppendLine("export LANG=en_US.UTF-8");
		sb.AppendLine($"cd '{xcodePath}'");
		sb.AppendLine($"cp '{podFile}' Podfile");
		sb.AppendLine("pod deintegrate || true");
		sb.AppendLine("pod install");
		File.WriteAllText(shPath, sb.ToString());

		//执行shell        
		Process process = new Process();
		process.StartInfo.FileName = "sh";
		process.StartInfo.Arguments = "podinstall.sh";
		process.StartInfo.RedirectStandardOutput = true;
		process.StartInfo.CreateNoWindow = true;
		process.StartInfo.UseShellExecute = false;
		process.StartInfo.WorkingDirectory = xcodePath;

		if (!process.Start())
		{
			throw new Exception("pod install error");
		}
		
		// 读取命令输出
		string output = process.StandardOutput.ReadToEnd();
		process.WaitForExit();
		process.Close();
		
		Debug.Log("pod install output: " + output);
	}
}
#endif