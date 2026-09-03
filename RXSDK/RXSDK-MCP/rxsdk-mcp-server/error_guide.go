package rxsdk

import (
	"context"
	"embed"
	"encoding/json"
	"fmt"
	"regexp"
	"sort"
	"strings"
	"sync"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

//go:embed knowledge/errors/*.json
var errorGuideKnowledgeFS embed.FS

var (
	errorGuideLoadOnce sync.Once
	errorGuideEntries  []ErrorGuideEntry
	errorGuideLoadErr  error

	errorGuideCodePattern = regexp.MustCompile(`-?\d{3,7}`)
)

var supportedErrorGuidePlatforms = []string{
	"ios",
	"android",
	"unity",
	"cocos2dx",
	"minigame",
}

type ErrorGuideInput struct {
	Platform string `json:"platform"`
	Keyword  string `json:"keyword"`
	Code     string `json:"code"`
	Scene    string `json:"scene"`
}

type ErrorGuideResponse struct {
	Matched         bool     `json:"matched"`
	Platform        string   `json:"platform"`
	ErrorCode       string   `json:"errorCode,omitempty"`
	MatchedKeywords []string `json:"matchedKeywords,omitempty"`
	Summary         string   `json:"summary"`
	PossibleCauses  []string `json:"possibleCauses"`
	Solutions       []string `json:"solutions"`
	RelatedDocs     []string `json:"relatedDocs,omitempty"`
	RawSource       string   `json:"rawSource,omitempty"`
}

type ErrorGuideRange struct {
	Min int `json:"min"`
	Max int `json:"max"`
}

type ErrorGuideEntry struct {
	ID               string            `json:"id"`
	Platform         string            `json:"platform,omitempty"`
	Scenes           []string          `json:"scenes,omitempty"`
	Codes            []string          `json:"codes,omitempty"`
	CodeRanges       []ErrorGuideRange `json:"codeRanges,omitempty"`
	Keywords         []string          `json:"keywords,omitempty"`
	RequiredKeywords []string          `json:"requiredKeywords,omitempty"`
	MatchMode        string            `json:"matchMode,omitempty"`
	Summary          string            `json:"summary"`
	PossibleCauses   []string          `json:"causes,omitempty"`
	Solutions        []string          `json:"solutions,omitempty"`
	RelatedDocs      []string          `json:"relatedDocs,omitempty"`
	Priority         int               `json:"priority,omitempty"`
}

type errorGuideKnowledgeFile struct {
	Platform string            `json:"platform"`
	Version  string            `json:"version"`
	Entries  []ErrorGuideEntry `json:"entries"`
}

type errorGuideQuery struct {
	Platform   string
	KeywordRaw string
	Keyword    string
	Scene      string
	Codes      []string
}

type errorGuideMatch struct {
	Entry           ErrorGuideEntry
	Score           int
	MatchedCode     string
	MatchedKeywords []string
	RawSource       string
}

func registerErrorGuideTool(server *mcp.Server) {
	mcp.AddTool(
		server,
		&mcp.Tool{
			Name: "error_guide",
			Description: mcpToolCallRequirement + `

瑞雪 SDK 错误指引工具。输入平台、错误码、错误文案或关键词后，返回原因判断、排查步骤和解决方案。

适用平台：
- ios
- android
- unity
- cocos2dx
- minigame

参数说明：
- platform: 可选，SDK 接入侧平台名称，仅作为弱提示，不作为知识库硬过滤条件
- keyword: 可选，原始错误文案、日志片段或关键词；如果用户输入了完整 JSON、日志或包含 msg/thirdmsg 的文本，必须原样传入 keyword，不要只提取 code
- code: 可选，错误码或 thirdcode；只适合传单个错误码。若用户给的是完整错误 JSON，请同时把完整 JSON 传给 keyword
- scene: 可选，场景，如 init/login/pay/share/network/permission/push

重要匹配规则：
- 同一个 code 可能对应多种错误原因，必须优先保留完整错误信息用于精确匹配
- Unity/Cocos 等跨平台 SDK 可能透出 Android/iOS 原生错误，匹配时会按 code/msg/thirdcode/thirdmsg 跨平台检索
- 例如用户输入 {"code":4101,"msg":"支付错误","thirdcode":-1,"thirdmsg":"product_id is null"} 时，应传 keyword 为完整 JSON，并可传 code=4101
- 不要把上述完整错误简化为仅 code=4101，否则只能命中通用支付错误`,
			InputSchema: map[string]any{
				"type": "object",
				"properties": map[string]any{
					"platform": map[string]any{
						"type":        "string",
						"description": "SDK 接入侧平台名称：ios/android/unity/cocos2dx/minigame。仅作为弱提示；Unity/Cocos 报错也会跨平台匹配 Android/iOS 原生错误",
						"enum":        supportedErrorGuidePlatforms,
					},
					"keyword": map[string]any{
						"type":        "string",
						"description": "原始错误文案、日志片段或关键词。用户提供完整 JSON、日志、msg、thirdmsg 时必须原样传入本字段，不能只提取 code",
					},
					"code": map[string]any{
						"type":        "string",
						"description": "单个错误码、系统错误码或三方错误码，例如 3001、-1001、WX_ERROR。若用户提供完整错误 JSON，请不要只填本字段，必须同时把完整 JSON 传给 keyword",
					},
					"scene": map[string]any{
						"type":        "string",
						"description": "错误场景，可选值如 init/login/pay/share/network/permission/push",
					},
				},
			},
		},
		ErrorGuideHandler,
	)
}

func ErrorGuideHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input ErrorGuideInput,
) (*mcp.CallToolResult, ErrorGuideResponse, error) {
	_ = ctx
	_ = req

	platform := normalizeErrorGuidePlatform(input.Platform)
	query := buildErrorGuideQuery(input, platform)
	if len(query.Codes) == 0 && query.Keyword == "" && query.Scene == "" {
		return nil, ErrorGuideResponse{
			Matched:        false,
			Platform:       platform,
			Summary:        "缺少查询条件",
			PossibleCauses: []string{"没有提供可用于匹配的错误码、错误文案或场景"},
			Solutions: []string{
				"至少补充 code、keyword、scene 其中一项",
				"优先提供完整错误 JSON：code、msg、trace_id、thirdcode、thirdmsg",
				"若是日志排查，可直接把完整报错文案作为 keyword 传入",
			},
			RelatedDocs: defaultErrorGuideDocs(platform),
		}, nil
	}

	entries, err := loadErrorGuideEntries()
	if err != nil {
		return nil, ErrorGuideResponse{}, err
	}

	matches := matchErrorGuideEntries(query, entries)
	if response := buildAmbiguousErrorGuideResponse(query, entries, matches); response != nil {
		return nil, *response, nil
	}

	if len(matches) == 0 {
		return nil, buildUnmatchedErrorGuideResponse(query), nil
	}

	best := matches[0]
	return nil, ErrorGuideResponse{
		Matched:         true,
		Platform:        best.Entry.Platform,
		ErrorCode:       firstNonEmpty(best.MatchedCode, firstEntryCode(best.Entry)),
		MatchedKeywords: best.MatchedKeywords,
		Summary:         best.Entry.Summary,
		PossibleCauses:  best.Entry.PossibleCauses,
		Solutions:       best.Entry.Solutions,
		RelatedDocs:     dedupeStrings(best.Entry.RelatedDocs),
		RawSource:       best.RawSource,
	}, nil
}

func loadErrorGuideEntries() ([]ErrorGuideEntry, error) {
	errorGuideLoadOnce.Do(func() {
		files := []string{
			"knowledge/errors/common.json",
			"knowledge/errors/ios.json",
			"knowledge/errors/android.json",
			"knowledge/errors/unity.json",
			"knowledge/errors/cocos2dx.json",
			"knowledge/errors/minigame.json",
		}

		var all []ErrorGuideEntry
		for _, name := range files {
			data, err := errorGuideKnowledgeFS.ReadFile(name)
			if err != nil {
				errorGuideLoadErr = err
				return
			}

			var file errorGuideKnowledgeFile
			if err := json.Unmarshal(data, &file); err != nil {
				errorGuideLoadErr = fmt.Errorf("parse %s failed: %w", name, err)
				return
			}

			defaultPlatform := normalizeErrorGuidePlatform(file.Platform)
			if defaultPlatform == "" && strings.Contains(name, "common.json") {
				defaultPlatform = "common"
			}

			for _, entry := range file.Entries {
				if entry.Platform == "" {
					entry.Platform = defaultPlatform
				} else {
					entry.Platform = normalizeErrorGuidePlatform(entry.Platform)
				}
				all = append(all, entry)
			}
		}

		errorGuideEntries = all
	})

	return errorGuideEntries, errorGuideLoadErr
}

func buildErrorGuideQuery(input ErrorGuideInput, platform string) errorGuideQuery {
	keyword := strings.TrimSpace(strings.Join([]string{input.Keyword, input.Code}, " "))
	return errorGuideQuery{
		Platform:   platform,
		KeywordRaw: strings.TrimSpace(input.Keyword),
		Keyword:    normalizeErrorGuideText(keyword),
		Scene:      normalizeErrorGuideScene(input.Scene),
		Codes:      collectErrorGuideCodes(input.Code, input.Keyword),
	}
}

func matchErrorGuideEntries(query errorGuideQuery, entries []ErrorGuideEntry) []errorGuideMatch {
	var matches []errorGuideMatch
	for _, entry := range entries {
		if !isErrorGuidePlatformMatch(query.Platform, entry.Platform) {
			continue
		}

		match := scoreErrorGuideEntry(query, entry)
		if match.Score > 0 {
			matches = append(matches, match)
		}
	}

	sort.Slice(matches, func(i, j int) bool {
		if matches[i].Score != matches[j].Score {
			return matches[i].Score > matches[j].Score
		}
		if matches[i].Entry.Priority != matches[j].Entry.Priority {
			return matches[i].Entry.Priority > matches[j].Entry.Priority
		}
		return matches[i].Entry.ID < matches[j].Entry.ID
	})

	return matches
}

func buildAmbiguousErrorGuideResponse(query errorGuideQuery, entries []ErrorGuideEntry, matches []errorGuideMatch) *ErrorGuideResponse {
	if len(query.Codes) == 0 {
		return nil
	}
	if len(matches) > 0 && matches[0].Entry.Platform != "common" {
		return nil
	}

	for _, code := range query.Codes {
		candidates := exactPlatformCodeCandidates(code, entries)
		if len(candidates) == 0 {
			continue
		}

		causes := make([]string, 0, len(candidates))
		var docs []string
		for _, entry := range candidates {
			causes = append(causes, fmt.Sprintf("%s：%s", entry.ID, entry.Summary))
			docs = append(docs, entry.RelatedDocs...)
		}
		docs = append(docs, defaultErrorGuideDocs(query.Platform)...)

		return &ErrorGuideResponse{
			Matched:        false,
			Platform:       firstNonEmpty(query.Platform, candidates[0].Platform),
			ErrorCode:      code,
			Summary:        fmt.Sprintf("错误码 %s 存在多个具体错误场景，需要补充完整错误信息后才能跨平台精确判断", code),
			PossibleCauses: dedupeStrings(causes),
			Solutions: []string{
				"补充完整错误 JSON：code、msg、thirdcode、thirdmsg",
				"如果是支付错误，优先提供 thirdmsg 原文，例如 product_id is null、third_tag is null",
				"不要只传 code；同一个 code 需要依赖 msg/thirdmsg 区分具体原因",
			},
			RelatedDocs: dedupeStrings(docs),
			RawSource:   fmt.Sprintf("knowledge/errors/*#ambiguous-code-%s", code),
		}
	}

	return nil
}

func exactPlatformCodeCandidates(code string, entries []ErrorGuideEntry) []ErrorGuideEntry {
	code = normalizeErrorGuideText(code)
	if code == "" {
		return nil
	}

	var candidates []ErrorGuideEntry
	for _, entry := range entries {
		if entry.Platform == "common" {
			continue
		}
		if !containsNormalized(entry.Codes, code) {
			continue
		}
		if len(entry.Keywords) == 0 && len(entry.RequiredKeywords) == 0 && !strings.Contains(strings.ToLower(entry.MatchMode), "keyword") {
			continue
		}
		candidates = append(candidates, entry)
	}

	sort.Slice(candidates, func(i, j int) bool {
		if candidates[i].Priority != candidates[j].Priority {
			return candidates[i].Priority > candidates[j].Priority
		}
		return candidates[i].ID < candidates[j].ID
	})
	return candidates
}

func scoreErrorGuideEntry(query errorGuideQuery, entry ErrorGuideEntry) errorGuideMatch {
	match := errorGuideMatch{
		Entry:     entry,
		RawSource: fmt.Sprintf("knowledge/errors/%s.json#%s", entry.Platform, entry.ID),
	}
	hasSignal := false
	matchedScene := false
	matchedCode := false
	matchedKeyword := false

	if entry.Platform == "common" {
		match.RawSource = fmt.Sprintf("knowledge/errors/common.json#%s", entry.ID)
	}

	if query.Scene != "" && containsNormalized(entry.Scenes, query.Scene) {
		match.Score += 120
		hasSignal = true
		matchedScene = true
	}

	for _, code := range query.Codes {
		if code == "" {
			continue
		}
		if containsNormalized(entry.Codes, code) {
			match.Score += 1000
			hasSignal = true
			matchedCode = true
			if match.MatchedCode == "" {
				match.MatchedCode = code
			}
			continue
		}

		numericCode, ok := parseErrorGuideInt(code)
		if !ok {
			continue
		}
		for _, r := range entry.CodeRanges {
			if numericCode >= r.Min && numericCode <= r.Max {
				match.Score += 650
				hasSignal = true
				matchedCode = true
				if match.MatchedCode == "" {
					match.MatchedCode = code
				}
				break
			}
		}
	}

	if query.Keyword != "" {
		if len(entry.RequiredKeywords) > 0 {
			requiredMatchedKeywords, ok := matchAllRequiredKeywords(query.Keyword, entry.RequiredKeywords)
			if ok {
				match.Score += 360
				hasSignal = true
				matchedKeyword = true
				match.MatchedKeywords = append(match.MatchedKeywords, requiredMatchedKeywords...)
			}
		}

		for _, keyword := range entry.Keywords {
			normalizedKeyword := normalizeErrorGuideText(keyword)
			if normalizedKeyword == "" {
				continue
			}
			if strings.Contains(query.Keyword, normalizedKeyword) {
				match.Score += 220
				hasSignal = true
				matchedKeyword = true
				match.MatchedKeywords = append(match.MatchedKeywords, keyword)
			}
		}
	}

	if !isErrorGuideMatchModeSatisfied(entry.MatchMode, matchedCode, matchedKeyword, matchedScene) {
		match.Score = 0
		match.MatchedCode = ""
		match.MatchedKeywords = nil
		return match
	}

	if !hasSignal {
		return match
	}

	if query.Platform != "" && entry.Platform == query.Platform {
		match.Score += 40
	}

	match.MatchedKeywords = dedupeStrings(match.MatchedKeywords)
	match.Score += entry.Priority
	return match
}

func isErrorGuideMatchModeSatisfied(matchMode string, matchedCode bool, matchedKeyword bool, matchedScene bool) bool {
	switch strings.ToLower(strings.TrimSpace(matchMode)) {
	case "", "any":
		return true
	case "code_and_keyword":
		return matchedCode && matchedKeyword
	case "code_only":
		return matchedCode
	case "keyword_only":
		return matchedKeyword
	case "scene_and_keyword":
		return matchedScene && matchedKeyword
	default:
		return true
	}
}

func matchAllRequiredKeywords(queryKeyword string, requiredKeywords []string) ([]string, bool) {
	if len(requiredKeywords) == 0 {
		return nil, false
	}

	matched := make([]string, 0, len(requiredKeywords))
	for _, keyword := range requiredKeywords {
		normalizedKeyword := normalizeErrorGuideText(keyword)
		if normalizedKeyword == "" {
			return nil, false
		}
		if !strings.Contains(queryKeyword, normalizedKeyword) {
			return nil, false
		}
		matched = append(matched, keyword)
	}

	return matched, true
}

func buildUnmatchedErrorGuideResponse(query errorGuideQuery) ErrorGuideResponse {
	solutions := []string{
		"补充完整错误 JSON：code、msg、trace_id、thirdcode、thirdmsg",
		"如果只有日志片段，请把完整报错文案作为 keyword 重新查询",
		"如果是初始化后立即报错，请确认初始化顺序和回调成功状态",
	}

	if query.Platform == "android" {
		solutions = append(solutions,
			"Android 侧同时检查 onResponse 中的 code/msg，以及 onError(RXException) 的异常类型",
			"如果是厂商能力或三方渠道问题，请一并提供 thirdcode/thirdmsg",
		)
	}

	if query.Platform == "ios" {
		solutions = append(solutions,
			"iOS 如果是系统网络错误，请同时提供原始 NSError.code",
			"如果是三方组件报错，请说明对应组件是否已在 SDK 初始化前完成 regist/configure",
		)
	}

	return ErrorGuideResponse{
		Matched:        false,
		Platform:       query.Platform,
		ErrorCode:      firstString(query.Codes),
		Summary:        "未命中现有错误指引知识库",
		PossibleCauses: []string{"报错信息不完整", "当前问题属于低频或尚未沉淀到知识库", "错误来自三方 SDK 原始返回，尚未形成专门方案"},
		Solutions:      dedupeStrings(solutions),
		RelatedDocs:    defaultErrorGuideDocs(query.Platform),
	}
}

func normalizeErrorGuidePlatform(platform string) string {
	normalized := strings.ToLower(strings.TrimSpace(platform))
	switch normalized {
	case "ios", "i os":
		return "ios"
	case "android":
		return "android"
	case "unity":
		return "unity"
	case "cocos", "cocos2d", "cocos2dx", "cocos-2dx":
		return "cocos2dx"
	case "minigame", "mini-game", "小游戏":
		return "minigame"
	case "common":
		return "common"
	default:
		return ""
	}
}

func normalizeErrorGuideScene(scene string) string {
	normalized := normalizeErrorGuideText(scene)
	switch normalized {
	case "initialize":
		return "init"
	case "payment":
		return "pay"
	case "permission":
		return "permission"
	default:
		return normalized
	}
}

func normalizeErrorGuideText(text string) string {
	normalized := strings.ToLower(strings.TrimSpace(text))
	replacer := strings.NewReplacer(
		"\n", " ",
		"\r", " ",
		"\t", " ",
		"：", ":",
		"，", ",",
		"（", "(",
		"）", ")",
	)
	normalized = replacer.Replace(normalized)
	return strings.Join(strings.Fields(normalized), " ")
}

func collectErrorGuideCodes(code string, keyword string) []string {
	var results []string
	appendCode := func(value string) {
		value = normalizeErrorGuideText(value)
		if value != "" {
			results = append(results, value)
		}
		for _, match := range errorGuideCodePattern.FindAllString(value, -1) {
			results = append(results, normalizeErrorGuideText(match))
		}
	}

	appendCode(code)
	appendCode(keyword)
	return dedupeStrings(results)
}

func containsNormalized(values []string, target string) bool {
	target = normalizeErrorGuideText(target)
	for _, value := range values {
		if normalizeErrorGuideText(value) == target {
			return true
		}
	}
	return false
}

func isErrorGuidePlatformMatch(queryPlatform string, entryPlatform string) bool {
	return true
}

func parseErrorGuideInt(value string) (int, bool) {
	value = strings.TrimSpace(value)
	if value == "" {
		return 0, false
	}
	var parsed int
	_, err := fmt.Sscanf(value, "%d", &parsed)
	return parsed, err == nil
}

func defaultErrorGuideDocs(platform string) []string {
	docs := []string{"RXSDK-Doc/common/specs/error_codes.md"}
	switch platform {
	case "ios":
		docs = append(docs, "RXSDK-Doc/ios/api/callback.md")
	case "android":
		docs = append(docs, "RXSDK-Doc/android/api/callback.md")
	case "unity":
		docs = append(docs, "RXSDK-Doc/unity/api/callback.md")
	case "cocos2dx":
		docs = append(docs, "RXSDK-Cocos2dx/Classes/RuixueSDK/RuixueBridge.h")
	case "minigame":
		docs = append(docs, "RXSDK-JS/src/config/const.ts")
	}
	return docs
}

func dedupeStrings(values []string) []string {
	seen := make(map[string]struct{}, len(values))
	result := make([]string, 0, len(values))
	for _, value := range values {
		if strings.TrimSpace(value) == "" {
			continue
		}
		if _, ok := seen[value]; ok {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}

func firstString(values []string) string {
	if len(values) == 0 {
		return ""
	}
	return values[0]
}

func firstEntryCode(entry ErrorGuideEntry) string {
	if len(entry.Codes) == 0 {
		return ""
	}
	return entry.Codes[0]
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return ""
}
