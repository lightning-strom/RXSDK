package rxsdk

import (
	"context"
	"path/filepath"
	"strings"
	"testing"
)

func TestIOSLbsTemplateIncludesAmapAndSocialLbs(t *testing.T) {
	_, output, err := IOSLbsHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	for _, want := range []string{
		"RXLBSKit",
		"4.0.0",
		"getLocationInfo",
		"registeAMWithAppkey",
		"NSLocationAlwaysUsageDescription",
		"NSLocationAlwaysAndWhenInUseUsageDescription",
		"NSLocationWhenInUseUsageDescription",
		"UIBackgroundModes",
		"<string>location</string>",
		"lbsUpdateWithLon",
		"getRadiusAccountWithLon",
		"deleteLocationWithTypes",
	} {
		if !strings.Contains(output.Spec, want) {
			t.Fatalf("expected iOS LBS template to contain %q, got:\n%s", want, output.Spec)
		}
	}
}

func TestAddLBSLocationConfigToInfoPlistIsIdempotent(t *testing.T) {
	path := filepath.Join(t.TempDir(), "Info.plist")
	writeTestFile(t, path, `<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
	<key>UIBackgroundModes</key>
	<array>
		<string>audio</string>
	</array>
</dict>
</plist>
`)

	modified, err := addLBSLocationConfigToInfoPlist(path)
	if err != nil || !modified {
		t.Fatalf("expected first call to modify plist, modified=%v err=%v", modified, err)
	}
	content := readTestFile(t, path)
	for _, want := range []string{
		"<key>NSLocationAlwaysUsageDescription</key>",
		"<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>",
		"<key>NSLocationWhenInUseUsageDescription</key>",
		"<string>audio</string>",
		"<string>location</string>",
	} {
		if !strings.Contains(content, want) {
			t.Fatalf("expected plist to contain %q, got:\n%s", want, content)
		}
	}

	modified, err = addLBSLocationConfigToInfoPlist(path)
	if err != nil || modified {
		t.Fatalf("expected second call to be idempotent, modified=%v err=%v", modified, err)
	}
}

func TestIOSLbsPreflightConfiguresNativeProject(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Podfile"), `target 'Demo' do
  pod 'RXSDK_Pure', '4.0.4'
  pod 'RXLBSKit'
end
`)
	writeTestFile(t, filepath.Join(dir, "Demo", "AppDelegate.m"), "RXSdkInitConfig *config;\n")
	writeTestFile(t, filepath.Join(dir, "Demo", "Info.plist"), `<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
</dict>
</plist>
`)

	preflight := iosLbsPreflight(dir, "Demo")
	if !preflight.Checked || !preflight.Satisfied {
		t.Fatalf("expected iOS LBS preflight satisfied, got: %+v", preflight)
	}
	podfile := readTestFile(t, filepath.Join(dir, "Podfile"))
	if !strings.Contains(podfile, "pod 'RXLBSKit', '"+lbsIOSMinVersion+"'") {
		t.Fatalf("expected unversioned RXLBSKit pinned to %s, got:\n%s", lbsIOSMinVersion, podfile)
	}
	content := readTestFile(t, filepath.Join(dir, "Demo", "Info.plist"))
	for _, want := range []string{
		"NSLocationAlwaysUsageDescription",
		"NSLocationAlwaysAndWhenInUseUsageDescription",
		"NSLocationWhenInUseUsageDescription",
		"UIBackgroundModes",
		"<string>location</string>",
	} {
		if !strings.Contains(content, want) {
			t.Fatalf("expected configured plist to contain %q, got:\n%s", want, content)
		}
	}
}

func TestIOSLbsPreflightRequiresWorkspace(t *testing.T) {
	preflight := iosLbsPreflight("", "")
	if preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied preflight without workspace, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "ios feature=lbs") {
		t.Fatalf("expected retry hint, got: %+v", preflight.NextSteps)
	}
}

func TestIOSLbsPreflightDetectsMissingDependencyAndUpgradesRXSDK(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Podfile"), `target 'Demo' do
  pod 'RXSDK_Pure', '4.0.1'
  # pod 'RXLBSKit'
end
`)
	writeTestFile(t, filepath.Join(dir, "Demo", "AppDelegate.m"), "RXSdkInitConfig *config;\n")
	writeTestFile(t, filepath.Join(dir, "Demo", "Info.plist"), `<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
</dict>
</plist>
`)

	preflight := iosLbsPreflight(dir, "Demo")
	if !preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected checked/unsatisfied preflight, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.Missing, "\n"), "RXLBSKit") {
		t.Fatalf("expected missing RXLBSKit dependency, got: %+v", preflight.Missing)
	}
	podfile := readTestFile(t, filepath.Join(dir, "Podfile"))
	if !strings.Contains(podfile, "pod 'RXSDK_Pure', '"+passportIOSMinVersion+"'") {
		t.Fatalf("expected RXSDK_Pure upgrade to %s, got:\n%s", passportIOSMinVersion, podfile)
	}
}

func TestIOSLbsPreflightRequiresTargetForMultipleInfoPlists(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Podfile"), `target 'Demo' do
  pod 'RXSDK_Pure', '4.0.4'
  pod 'RXLBSKit'
end
`)
	writeTestFile(t, filepath.Join(dir, "Demo", "AppDelegate.m"), "RXSdkInitConfig *config;\n")
	emptyPlist := "<?xml version=\"1.0\"?><plist version=\"1.0\"><dict></dict></plist>\n"
	writeTestFile(t, filepath.Join(dir, "Demo", "Info.plist"), emptyPlist)
	writeTestFile(t, filepath.Join(dir, "DemoTests", "Info.plist"), emptyPlist)

	preflight := iosLbsPreflight(dir, "")
	if preflight.Satisfied || !strings.Contains(strings.Join(preflight.Missing, "\n"), "targetName") {
		t.Fatalf("expected ambiguous Info.plist error, got: %+v", preflight)
	}
	if readTestFile(t, filepath.Join(dir, "Demo", "Info.plist")) != emptyPlist {
		t.Fatal("expected ambiguous preflight not to modify any Info.plist")
	}

	preflight = iosLbsPreflight(dir, "Demo")
	if !preflight.Satisfied {
		t.Fatalf("expected target-specific preflight satisfied, got: %+v", preflight)
	}
	if !strings.Contains(readTestFile(t, filepath.Join(dir, "Demo", "Info.plist")), "UIBackgroundModes") {
		t.Fatal("expected selected target Info.plist to be configured")
	}
	if readTestFile(t, filepath.Join(dir, "DemoTests", "Info.plist")) != emptyPlist {
		t.Fatal("expected unselected target Info.plist to remain unchanged")
	}
}

func TestAddLBSLocationConfigRejectsMalformedBackgroundModes(t *testing.T) {
	path := filepath.Join(t.TempDir(), "Info.plist")
	writeTestFile(t, path, `<?xml version="1.0"?>
<plist version="1.0">
<dict>
	<key>UIBackgroundModes</key>
	<string>audio</string>
</dict>
</plist>
`)

	modified, err := addLBSLocationConfigToInfoPlist(path)
	if err == nil || modified {
		t.Fatalf("expected malformed UIBackgroundModes error, modified=%v err=%v", modified, err)
	}
}

func TestResolveLBSInfoPlistAcceptsSingleRootPlistWithTargetName(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "Info.plist")
	writeTestFile(t, path, "<?xml version=\"1.0\"?><plist version=\"1.0\"><dict></dict></plist>\n")

	resolved, err := resolveLBSInfoPlistPath(dir, "Demo")
	if err != nil || resolved != path {
		t.Fatalf("expected root Info.plist, resolved=%q err=%v", resolved, err)
	}
}

func TestIOSLbsPreflightEnforcesRXLBSKitMinimumVersion(t *testing.T) {
	for _, testCase := range []struct {
		name        string
		current     string
		wantVersion string
	}{
		{name: "upgrade low version", current: "3.9.9", wantVersion: lbsIOSMinVersion},
		{name: "keep higher version", current: "4.1.0", wantVersion: "4.1.0"},
	} {
		t.Run(testCase.name, func(t *testing.T) {
			dir := t.TempDir()
			writeTestFile(t, filepath.Join(dir, "Podfile"), `target 'Demo' do
  pod 'RXSDK_Pure', '4.0.4'
  pod 'RXLBSKit', '`+testCase.current+`'
end
`)
			writeTestFile(t, filepath.Join(dir, "Demo", "AppDelegate.m"), "RXSdkInitConfig *config;\n")
			writeTestFile(t, filepath.Join(dir, "Demo", "Info.plist"), "<?xml version=\"1.0\"?><plist version=\"1.0\"><dict></dict></plist>\n")

			preflight := iosLbsPreflight(dir, "Demo")
			if !preflight.Satisfied {
				t.Fatalf("expected satisfied preflight, got: %+v", preflight)
			}
			podfile := readTestFile(t, filepath.Join(dir, "Podfile"))
			if !strings.Contains(podfile, "pod 'RXLBSKit', '"+testCase.wantVersion+"'") {
				t.Fatalf("expected RXLBSKit %s, got:\n%s", testCase.wantVersion, podfile)
			}
		})
	}
}
