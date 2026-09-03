package rxsdk

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestIOSPassportUnifiedHandlerKeepsBaseConfigCheck(t *testing.T) {
	dir := t.TempDir()
	_, output, err := IOSUnifiedHandler(context.Background(), nil, struct {
		Feature              string `json:"feature"`
		Region               string `json:"region"`
		WorkspacePath        string `json:"workspacePath"`
		TargetName           string `json:"targetName"`
		Provider             string `json:"provider"`
		UniversalLinkDomain  string `json:"universalLinkDomain"`
		AppKey               string `json:"appKey"`
		WechatAppId          string `json:"wechatAppId"`
		UniversalLink        string `json:"universalLink"`
		GIDClientID          string `json:"gidClientId"`
		GoogleURLScheme      string `json:"googleUrlScheme"`
		FacebookAppID        string `json:"facebookAppId"`
		FacebookClientToken  string `json:"facebookClientToken"`
		LineChannelID        string `json:"lineChannelId"`
		ZaloAppID            string `json:"zaloAppId"`
		TikTokAppID          string `json:"tiktokAppId"`
		InstagramClientID    string `json:"instagramClientId"`
		InstagramRedirectURI string `json:"instagramRedirectUri"`
		RedditClientID       string `json:"redditClientId"`
		RedditRedirectURI    string `json:"redditRedirectUri"`
	}{
		Feature:       "passport",
		WorkspacePath: dir,
		TargetName:    "Demo",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if output["error"] != "base_config_missing" {
		t.Fatalf("expected existing passport base config check, got: %+v", output)
	}
}

func TestIOSAppleSigninConfigTemplateIsExplicit(t *testing.T) {
	_, output, err := IOSAppleSigninConfigHandler(context.Background(), nil, struct{}{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	for _, want := range []string{
		"apple_signin_config",
		"com.apple.developer.applesignin",
		"普通 passport 不会修改 Apple Capability",
	} {
		if !strings.Contains(output.Spec, want) {
			t.Fatalf("expected Apple config template to contain %q, got:\n%s", want, output.Spec)
		}
	}
}

func TestIOSPassportPreflightDoesNotModifyAppleCapability(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Podfile"), "pod 'RXSDK_Pure', '4.0.4'\n")
	writeTestFile(t, filepath.Join(dir, "AppDelegate.m"), "RXSdkInitConfig *config;\n")

	preflight := iosPassportPreflight(dir)
	if !preflight.Satisfied {
		t.Fatalf("expected passport preflight satisfied, got: %+v", preflight)
	}
	if fileContainsAny(dir, []string{".entitlements"}, []string{"com.apple.developer.applesignin"}) {
		t.Fatal("expected passport not to create Apple entitlements")
	}
}

func TestIOSAppleSigninConfigPreflightRequiresWorkspace(t *testing.T) {
	preflight := iosAppleSigninConfigPreflight("", "")
	if preflight.Checked || preflight.Satisfied {
		t.Fatalf("expected unchecked/unsatisfied preflight, got: %+v", preflight)
	}
	if !strings.Contains(strings.Join(preflight.NextSteps, "\n"), "apple_signin_config") {
		t.Fatalf("expected dedicated feature retry hint, got: %+v", preflight.NextSteps)
	}
}

func TestIOSAppleSigninConfigPreflightRequiresTargetName(t *testing.T) {
	preflight := iosAppleSigninConfigPreflight(t.TempDir(), "")
	if preflight.Satisfied || !strings.Contains(strings.Join(preflight.Missing, "\n"), "targetName") {
		t.Fatalf("expected explicit targetName requirement, got: %+v", preflight)
	}
}

func TestIOSAppleSigninConfigRejectsSymlinkedXcodeProject(t *testing.T) {
	workspace := t.TempDir()
	external := t.TempDir()
	externalProject := filepath.Join(external, "Demo.xcodeproj")
	writeTestFile(t, filepath.Join(externalProject, "project.pbxproj"), "external project\n")
	if err := os.Symlink(externalProject, filepath.Join(workspace, "Demo.xcodeproj")); err != nil {
		t.Skipf("symlink unavailable: %v", err)
	}

	preflight := iosAppleSigninConfigPreflight(workspace, "Demo")
	if preflight.Satisfied {
		t.Fatalf("expected symlinked Xcode project rejected, got: %+v", preflight)
	}
	if readTestFile(t, filepath.Join(externalProject, "project.pbxproj")) != "external project\n" {
		t.Fatal("expected external project to remain unchanged")
	}
}

func TestAddSignInWithAppleToEntitlementsCreatesAndIsIdempotent(t *testing.T) {
	path := filepath.Join(t.TempDir(), "Demo", "Demo.entitlements")

	modified, err := addSignInWithAppleToEntitlements(path)
	if err != nil || !modified {
		t.Fatalf("expected entitlements creation, modified=%v err=%v", modified, err)
	}
	content := readTestFile(t, path)
	if !strings.Contains(content, "com.apple.developer.applesignin") ||
		!strings.Contains(content, "<string>Default</string>") {
		t.Fatalf("expected Sign in with Apple entitlement, got:\n%s", content)
	}

	modified, err = addSignInWithAppleToEntitlements(path)
	if err != nil || modified {
		t.Fatalf("expected idempotent second call, modified=%v err=%v", modified, err)
	}
}

func TestAddSignInWithAppleRejectsInvalidExistingValue(t *testing.T) {
	path := filepath.Join(t.TempDir(), "Demo.entitlements")
	writeTestFile(t, path, `<?xml version="1.0"?>
<plist version="1.0">
<dict>
    <key>com.apple.developer.applesignin</key>
    <array/>
</dict>
</plist>
`)

	modified, err := addSignInWithAppleToEntitlements(path)
	if err == nil || modified {
		t.Fatalf("expected invalid Apple entitlement error, modified=%v err=%v", modified, err)
	}
}

func TestConfigureIOSSignInWithAppleUsesExistingEntitlements(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Demo.xcodeproj", "project.pbxproj"), `
AAAAAAAAAAAAAAAAAAAAAAAA /* Demo */ = {
    isa = PBXNativeTarget;
    buildConfigurationList = BBBBBBBBBBBBBBBBBBBBBBBB /* Build configuration list for PBXNativeTarget "Demo" */;
};
CCCCCCCCCCCCCCCCCCCCCCCC /* Debug */ = {
    isa = XCBuildConfiguration;
    buildSettings = {
        CODE_SIGN_ENTITLEMENTS = "Config/App.entitlements";
    };
    name = Debug;
};
DDDDDDDDDDDDDDDDDDDDDDDD /* Release */ = {
    isa = XCBuildConfiguration;
    buildSettings = {
        CODE_SIGN_ENTITLEMENTS = "Config/App.entitlements";
    };
    name = Release;
};
BBBBBBBBBBBBBBBBBBBBBBBB /* Build configuration list for PBXNativeTarget "Demo" */ = {
    isa = XCConfigurationList;
    buildConfigurations = (
        CCCCCCCCCCCCCCCCCCCCCCCC /* Debug */,
        DDDDDDDDDDDDDDDDDDDDDDDD /* Release */,
    );
};
`)
	writeTestFile(t, filepath.Join(dir, "Config", "App.entitlements"), `<?xml version="1.0"?>
<plist version="1.0">
<dict>
    <key>aps-environment</key>
    <string>development</string>
</dict>
</plist>
`)

	result := PassportPreflightResult{}
	configureIOSSignInWithApple(dir, "Demo", &result)
	if len(result.Missing) > 0 {
		t.Fatalf("unexpected configuration error: %+v", result)
	}
	content := readTestFile(t, filepath.Join(dir, "Config", "App.entitlements"))
	if !strings.Contains(content, "com.apple.developer.applesignin") ||
		!strings.Contains(content, "aps-environment") {
		t.Fatalf("expected existing entitlements preserved and Apple added, got:\n%s", content)
	}
	matches, err := filepath.Glob(filepath.Join(dir, "Demo", "*.entitlements"))
	if err != nil {
		t.Fatalf("unexpected glob error: %v", err)
	}
	if len(matches) != 0 {
		t.Fatalf("expected no duplicate entitlements file, got: %v", matches)
	}

	secondResult := PassportPreflightResult{}
	configureIOSSignInWithApple(dir, "Demo", &secondResult)
	if len(secondResult.Missing) > 0 || len(secondResult.Modified) > 0 {
		t.Fatalf("expected idempotent configuration, got: %+v", secondResult)
	}
}

func TestConfigureIOSSignInWithAppleUsesXCConfigEntitlements(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Demo.xcodeproj", "project.pbxproj"), `
AAAAAAAAAAAAAAAAAAAAAAAA /* Demo */ = {
    isa = PBXNativeTarget;
    buildConfigurationList = BBBBBBBBBBBBBBBBBBBBBBBB /* Build configuration list for PBXNativeTarget "Demo" */;
};
EEEEEEEEEEEEEEEEEEEEEEEE /* Base.xcconfig */ = {
    isa = PBXFileReference;
    path = "Config/Base.xcconfig";
    sourceTree = "<group>";
};
CCCCCCCCCCCCCCCCCCCCCCCC /* Debug */ = {
    isa = XCBuildConfiguration;
    baseConfigurationReference = EEEEEEEEEEEEEEEEEEEEEEEE /* Base.xcconfig */;
    buildSettings = {
        PRODUCT_NAME = Demo;
    };
    name = Debug;
};
BBBBBBBBBBBBBBBBBBBBBBBB /* Build configuration list for PBXNativeTarget "Demo" */ = {
    isa = XCConfigurationList;
    buildConfigurations = (
        CCCCCCCCCCCCCCCCCCCCCCCC /* Debug */,
    );
};
`)
	writeTestFile(t, filepath.Join(dir, "Config", "Base.xcconfig"), "CODE_SIGN_ENTITLEMENTS = Config/Ignored.entitlements\n#include \"Signing.xcconfig\"\n")
	writeTestFile(t, filepath.Join(dir, "Config", "Signing.xcconfig"), "CODE_SIGN_ENTITLEMENTS = Config/Existing.entitlements\n")
	writeTestFile(t, filepath.Join(dir, "Config", "Ignored.entitlements"), `<?xml version="1.0"?>
<plist version="1.0"><dict></dict></plist>
`)
	writeTestFile(t, filepath.Join(dir, "Config", "Existing.entitlements"), `<?xml version="1.0"?>
<plist version="1.0">
<dict>
    <key>aps-environment</key>
    <string>development</string>
</dict>
</plist>
`)

	result := PassportPreflightResult{}
	configureIOSSignInWithApple(dir, "Demo", &result)
	if len(result.Missing) > 0 {
		t.Fatalf("unexpected configuration error: %+v", result)
	}
	entitlements := readTestFile(t, filepath.Join(dir, "Config", "Existing.entitlements"))
	if !strings.Contains(entitlements, "com.apple.developer.applesignin") ||
		!strings.Contains(entitlements, "aps-environment") {
		t.Fatalf("expected xcconfig entitlements reused, got:\n%s", entitlements)
	}
	pbxproj := readTestFile(t, filepath.Join(dir, "Demo.xcodeproj", "project.pbxproj"))
	if strings.Contains(pbxproj, "CODE_SIGN_ENTITLEMENTS") {
		t.Fatalf("expected xcconfig binding preserved without target override, got:\n%s", pbxproj)
	}
	if strings.Contains(readTestFile(t, filepath.Join(dir, "Config", "Ignored.entitlements")), "applesignin") {
		t.Fatal("expected later xcconfig include to override earlier entitlement path")
	}
}

func TestConfigureIOSSignInWithAppleOnlyUpdatesSelectedTarget(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, filepath.Join(dir, "Demo.xcodeproj", "project.pbxproj"), `
AAAAAAAAAAAAAAAAAAAAAAAA /* Demo */ = {
    isa = PBXNativeTarget;
    buildConfigurationList = BBBBBBBBBBBBBBBBBBBBBBBB /* Build configuration list for PBXNativeTarget "Demo" */;
};
EEEEEEEEEEEEEEEEEEEEEEEE /* DemoExtension */ = {
    isa = PBXNativeTarget;
    buildConfigurationList = FFFFFFFFFFFFFFFFFFFFFFFF /* Build configuration list for PBXNativeTarget "DemoExtension" */;
};
CCCCCCCCCCCCCCCCCCCCCCCC /* Debug */ = {
    isa = XCBuildConfiguration;
    buildSettings = {
        PRODUCT_NAME = Demo;
    };
    name = Debug;
};
DDDDDDDDDDDDDDDDDDDDDDDD /* Release */ = {
    isa = XCBuildConfiguration;
    buildSettings = {
        PRODUCT_NAME = Demo;
    };
    name = Release;
};
111111111111111111111111 /* Debug */ = {
    isa = XCBuildConfiguration;
    buildSettings = {
        PRODUCT_NAME = DemoExtension;
    };
    name = Debug;
};
222222222222222222222222 /* Release */ = {
    isa = XCBuildConfiguration;
    buildSettings = {
        PRODUCT_NAME = DemoExtension;
    };
    name = Release;
};
BBBBBBBBBBBBBBBBBBBBBBBB /* Build configuration list for PBXNativeTarget "Demo" */ = {
    isa = XCConfigurationList;
    buildConfigurations = (
        CCCCCCCCCCCCCCCCCCCCCCCC /* Debug */,
        DDDDDDDDDDDDDDDDDDDDDDDD /* Release */,
    );
};
FFFFFFFFFFFFFFFFFFFFFFFF /* Build configuration list for PBXNativeTarget "DemoExtension" */ = {
    isa = XCConfigurationList;
    buildConfigurations = (
        111111111111111111111111 /* Debug */,
        222222222222222222222222 /* Release */,
    );
};
`)

	result := PassportPreflightResult{}
	configureIOSSignInWithApple(dir, "Demo", &result)
	if len(result.Missing) > 0 {
		t.Fatalf("unexpected configuration error: %+v", result)
	}
	pbxproj := readTestFile(t, filepath.Join(dir, "Demo.xcodeproj", "project.pbxproj"))
	if strings.Count(pbxproj, "CODE_SIGN_ENTITLEMENTS") != 2 {
		t.Fatalf("expected only Demo Debug/Release configured, got:\n%s", pbxproj)
	}
	extensionIndex := strings.Index(pbxproj, "PRODUCT_NAME = DemoExtension;")
	if extensionIndex < 0 {
		t.Fatal("expected extension build settings")
	}
	extensionTail := pbxproj[extensionIndex:]
	if strings.Contains(strings.SplitN(extensionTail, "name = Debug;", 2)[0], "CODE_SIGN_ENTITLEMENTS") {
		t.Fatalf("expected extension target unchanged, got:\n%s", extensionTail)
	}
}

func TestConfigureIOSSignInWithAppleDoesNotBindInvalidEntitlements(t *testing.T) {
	dir := t.TempDir()
	pbxprojPath := filepath.Join(dir, "Demo.xcodeproj", "project.pbxproj")
	originalProject := `
AAAAAAAAAAAAAAAAAAAAAAAA /* Demo */ = {
    isa = PBXNativeTarget;
    buildConfigurationList = BBBBBBBBBBBBBBBBBBBBBBBB /* Build configuration list for PBXNativeTarget "Demo" */;
};
CCCCCCCCCCCCCCCCCCCCCCCC /* Debug */ = {
    isa = XCBuildConfiguration;
    buildSettings = {
        PRODUCT_NAME = Demo;
    };
    name = Debug;
};
BBBBBBBBBBBBBBBBBBBBBBBB /* Build configuration list for PBXNativeTarget "Demo" */ = {
    isa = XCConfigurationList;
    buildConfigurations = (
        CCCCCCCCCCCCCCCCCCCCCCCC /* Debug */,
    );
};
`
	writeTestFile(t, pbxprojPath, originalProject)
	writeTestFile(t, filepath.Join(dir, "Demo", "Demo.entitlements"), `<?xml version="1.0"?>
<plist version="1.0">
<dict>
    <key>com.apple.developer.applesignin</key>
    <array/>
</dict>
</plist>
`)

	result := PassportPreflightResult{}
	configureIOSSignInWithApple(dir, "Demo", &result)
	if len(result.Missing) == 0 {
		t.Fatalf("expected invalid entitlements error, got: %+v", result)
	}
	if readTestFile(t, pbxprojPath) != originalProject {
		t.Fatal("expected project.pbxproj unchanged when entitlements validation fails")
	}
}
