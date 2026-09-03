package rxsdk

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type unityAssemblyDefinition struct {
	Name       string
	Path       string
	References []string
	raw        map[string]json.RawMessage
}

func unityProjectSupportsAsmdefPreflight(workspacePath string) bool {
	if strings.TrimSpace(workspacePath) == "" {
		return false
	}
	assets, assetsErr := os.Stat(filepath.Join(workspacePath, "Assets"))
	manifest, manifestErr := os.Stat(filepath.Join(workspacePath, "Packages", "manifest.json"))
	return assetsErr == nil && assets.IsDir() && manifestErr == nil && !manifest.IsDir()
}

func unityAsmdefPreflight(workspacePath string) PassportPreflightResult {
	result := PassportPreflightResult{
		Platform:      "unity",
		WorkspacePath: workspacePath,
		Checked:       true,
	}
	assetsPath := filepath.Join(workspacePath, "Assets")
	manifestPath := filepath.Join(workspacePath, "Packages", "manifest.json")
	if info, err := os.Stat(assetsPath); err != nil || !info.IsDir() {
		result.Missing = append(result.Missing, "Unity 项目缺少 Assets 目录")
	}
	if info, err := os.Stat(manifestPath); err != nil || info.IsDir() {
		result.Missing = append(result.Missing, "Unity 项目缺少 Packages/manifest.json")
	}
	if len(result.Missing) > 0 {
		result.NextSteps = append(result.NextSteps, "确认 workspacePath 指向 Unity 项目根目录后重新调用 unity 工具")
		return result
	}

	installedAssemblies, guidToAssembly, warnings := findInstalledRuiXueAssemblies(workspacePath)
	result.Warnings = append(result.Warnings, warnings...)
	if len(installedAssemblies) == 0 {
		result.Warnings = append(result.Warnings, "未发现已解析的瑞雪 UPM 程序集，跳过业务 .asmdef 引用修复")
		result.Satisfied = true
		return result
	}

	businessAsmdefs, parseFailures := findUnityAssemblyDefinitions(assetsPath)
	for _, failure := range parseFailures {
		result.Missing = append(result.Missing, failure)
	}
	if len(businessAsmdefs) == 0 {
		result.Satisfied = len(result.Missing) == 0
		return result
	}

	requiredByAsmdef, err := findRequiredRuiXueReferences(assetsPath, businessAsmdefs, installedAssemblies)
	if err != nil {
		result.Missing = append(result.Missing, fmt.Sprintf("扫描 Unity 业务源码失败: %v", err))
		result.NextSteps = append(result.NextSteps, "修复文件访问问题后重新调用 unity 工具")
		return result
	}

	for asmdefPath, required := range requiredByAsmdef {
		definition := businessAsmdefs[asmdefPath]
		modified, err := ensureUnityAsmdefReferences(definition, required, guidToAssembly)
		if err != nil {
			result.Missing = append(result.Missing, fmt.Sprintf("更新 %s 失败: %v", relativeUnityPath(workspacePath, asmdefPath), err))
			continue
		}
		if modified {
			result.Modified = append(result.Modified, fmt.Sprintf(
				"%s：已补充瑞雪程序集引用 %s",
				relativeUnityPath(workspacePath, asmdefPath),
				strings.Join(required, "、"),
			))
		}
	}

	sort.Strings(result.Modified)
	result.Satisfied = len(result.Missing) == 0
	if !result.Satisfied {
		result.NextSteps = append(result.NextSteps, "修复无法解析或写入的业务 .asmdef 后重新调用 unity 工具")
	}
	return result
}

func findInstalledRuiXueAssemblies(workspacePath string) ([]string, map[string]string, []string) {
	assemblySet := map[string]bool{}
	guidToAssembly := map[string]string{}
	var warnings []string
	roots := []string{
		filepath.Join(workspacePath, "Packages"),
		filepath.Join(workspacePath, "Library", "PackageCache"),
	}
	for _, root := range roots {
		if info, err := os.Stat(root); err != nil || !info.IsDir() {
			continue
		}
		_ = filepath.WalkDir(root, func(path string, entry fs.DirEntry, walkErr error) error {
			if walkErr != nil {
				warnings = append(warnings, fmt.Sprintf("无法访问 %s: %v", path, walkErr))
				return nil
			}
			if entry.IsDir() || filepath.Ext(path) != ".asmdef" {
				return nil
			}
			definition, err := readUnityAssemblyDefinition(path)
			if err != nil {
				return nil
			}
			if !strings.HasPrefix(definition.Name, "RuiXue.") {
				return nil
			}
			assemblySet[definition.Name] = true
			meta, err := os.ReadFile(path + ".meta")
			if err == nil {
				for _, line := range strings.Split(string(meta), "\n") {
					if guid, ok := strings.CutPrefix(strings.TrimSpace(line), "guid:"); ok {
						guidToAssembly[strings.TrimSpace(guid)] = definition.Name
						break
					}
				}
			}
			return nil
		})
	}

	assemblies := make([]string, 0, len(assemblySet))
	for assembly := range assemblySet {
		assemblies = append(assemblies, assembly)
	}
	sort.Slice(assemblies, func(i, j int) bool {
		if len(assemblies[i]) == len(assemblies[j]) {
			return assemblies[i] < assemblies[j]
		}
		return len(assemblies[i]) > len(assemblies[j])
	})
	return assemblies, guidToAssembly, warnings
}

func findUnityAssemblyDefinitions(root string) (map[string]*unityAssemblyDefinition, []string) {
	definitions := map[string]*unityAssemblyDefinition{}
	var failures []string
	_ = filepath.WalkDir(root, func(path string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			failures = append(failures, fmt.Sprintf("无法访问业务程序集路径 %s: %v", path, walkErr))
			return nil
		}
		if entry.IsDir() || filepath.Ext(path) != ".asmdef" {
			return nil
		}
		definition, err := readUnityAssemblyDefinition(path)
		if err != nil {
			failures = append(failures, fmt.Sprintf("解析业务程序集 %s 失败: %v", path, err))
			definitions[path] = &unityAssemblyDefinition{Path: path}
			return nil
		}
		definitions[path] = definition
		return nil
	})
	return definitions, failures
}

func readUnityAssemblyDefinition(path string) (*unityAssemblyDefinition, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var raw map[string]json.RawMessage
	if err := json.Unmarshal(content, &raw); err != nil {
		return nil, err
	}
	var name string
	if err := json.Unmarshal(raw["name"], &name); err != nil || strings.TrimSpace(name) == "" {
		return nil, fmt.Errorf("缺少有效的 name")
	}
	var references []string
	if value, ok := raw["references"]; ok {
		if err := json.Unmarshal(value, &references); err != nil {
			return nil, fmt.Errorf("references 不是字符串数组")
		}
	}
	return &unityAssemblyDefinition{Name: name, Path: path, References: references, raw: raw}, nil
}

func findRequiredRuiXueReferences(
	assetsPath string,
	definitions map[string]*unityAssemblyDefinition,
	installedAssemblies []string,
) (map[string][]string, error) {
	asmdefByDir := make(map[string]string, len(definitions))
	for path := range definitions {
		asmdefByDir[filepath.Dir(path)] = path
	}
	requiredSets := map[string]map[string]bool{}
	err := filepath.WalkDir(assetsPath, func(path string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if entry.IsDir() || filepath.Ext(path) != ".cs" {
			return nil
		}
		owner := closestUnityAsmdef(filepath.Dir(path), assetsPath, asmdefByDir)
		if owner == "" || definitions[owner].raw == nil {
			return nil
		}
		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		for _, assembly := range installedAssemblies {
			if sourceUsesRuiXueAssembly(string(content), assembly) {
				if requiredSets[owner] == nil {
					requiredSets[owner] = map[string]bool{}
				}
				requiredSets[owner][assembly] = true
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	required := make(map[string][]string, len(requiredSets))
	for path, set := range requiredSets {
		for assembly := range set {
			required[path] = append(required[path], assembly)
		}
		sort.Strings(required[path])
	}
	return required, nil
}

func closestUnityAsmdef(dir, assetsPath string, asmdefByDir map[string]string) string {
	for {
		if path := asmdefByDir[dir]; path != "" {
			return path
		}
		if dir == assetsPath {
			return ""
		}
		parent := filepath.Dir(dir)
		if parent == dir || !strings.HasPrefix(parent, assetsPath) {
			return ""
		}
		dir = parent
	}
}

func sourceUsesRuiXueAssembly(content, assembly string) bool {
	if assembly == "RuiXue.Base" {
		return strings.Contains(content, "using RuiXue;") ||
			strings.Contains(content, "RuiXue.RuiXueSdk")
	}
	namespace := assembly
	return strings.Contains(content, "using "+namespace+";") ||
		strings.Contains(content, "using "+namespace+".") ||
		strings.Contains(content, namespace+".")
}

func ensureUnityAsmdefReferences(
	definition *unityAssemblyDefinition,
	required []string,
	guidToAssembly map[string]string,
) (bool, error) {
	existing := map[string]bool{}
	for _, reference := range definition.References {
		existing[reference] = true
		if guid, ok := strings.CutPrefix(reference, "GUID:"); ok {
			if assembly := guidToAssembly[guid]; assembly != "" {
				existing[assembly] = true
			}
		}
	}

	modified := false
	for _, assembly := range required {
		if existing[assembly] {
			continue
		}
		definition.References = append(definition.References, assembly)
		existing[assembly] = true
		modified = true
	}
	if !modified {
		return false, nil
	}

	references, err := json.Marshal(definition.References)
	if err != nil {
		return false, err
	}
	definition.raw["references"] = references
	content, err := json.MarshalIndent(definition.raw, "", "    ")
	if err != nil {
		return false, err
	}
	content = append(content, '\n')
	if err := atomicWriteFile(definition.Path, content); err != nil {
		return false, err
	}
	return true, nil
}

func mergePassportPreflightResults(base, addition PassportPreflightResult) PassportPreflightResult {
	if !base.Checked {
		return addition
	}
	if !addition.Checked {
		return base
	}
	base.Satisfied = base.Satisfied && addition.Satisfied
	base.Modified = appendUniqueStrings(base.Modified, addition.Modified...)
	base.Missing = appendUniqueStrings(base.Missing, addition.Missing...)
	base.Warnings = appendUniqueStrings(base.Warnings, addition.Warnings...)
	base.NextSteps = appendUniqueStrings(base.NextSteps, addition.NextSteps...)
	return base
}

func appendUniqueStrings(values []string, additions ...string) []string {
	existing := make(map[string]bool, len(values))
	for _, value := range values {
		existing[value] = true
	}
	for _, value := range additions {
		if !existing[value] {
			values = append(values, value)
			existing[value] = true
		}
	}
	return values
}

func relativeUnityPath(workspacePath, path string) string {
	relative, err := filepath.Rel(workspacePath, path)
	if err != nil {
		return path
	}
	return filepath.ToSlash(relative)
}
