package rxsdk

import (
	"context"
	"embed"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"sync"

	"github.com/modelcontextprotocol/go-sdk/mcp"

	"my-mcp-server/schemagen"
)

//go:embed knowledge/api_schemas/operation_api.json
var apiSchemaKnowledgeFS embed.FS

const apiSchemaSourceOperationAPI = "operation_api"

var (
	apiSchemaLoadOnce sync.Once
	apiSchemaCatalog  *schemagen.Catalog
	apiSchemaLoadErr  error
)

// ApiSchemaInput api_schema 工具入参。
type ApiSchemaInput struct {
	Source  string `json:"source" jsonschema:"API 来源，填 operation_api"`
	Path    string `json:"path,omitempty" jsonschema:"路由 path，如 share/data"`
	Module  string `json:"module,omitempty" jsonschema:"模块名 share/legal/url 等"`
	Keyword string `json:"keyword,omitempty" jsonschema:"模糊匹配 path、summary 或字段"`
}

// ApiSchemaResult 单条接口 schema。
type ApiSchemaResult struct {
	Path           string         `json:"path"`
	Method         string         `json:"method"`
	Module         string         `json:"module"`
	Summary        string         `json:"summary,omitempty"`
	RequestSchema  map[string]any `json:"requestSchema"`
	ResponseSchema map[string]any `json:"responseSchema"`
}

// ApiSchemaOutput api_schema 工具出参。
type ApiSchemaOutput struct {
	Matched bool              `json:"matched"`
	Source  string            `json:"source"`
	Count   int               `json:"count"`
	Results []ApiSchemaResult `json:"results"`
	Message string            `json:"message,omitempty"`
}

func loadApiSchemaCatalog() (*schemagen.Catalog, error) {
	apiSchemaLoadOnce.Do(func() {
		data, err := apiSchemaKnowledgeFS.ReadFile("knowledge/api_schemas/operation_api.json")
		if err != nil {
			apiSchemaLoadErr = err
			return
		}
		var catalog schemagen.Catalog
		if err := json.Unmarshal(data, &catalog); err != nil {
			apiSchemaLoadErr = fmt.Errorf("parse operation_api.json: %w", err)
			return
		}
		apiSchemaCatalog = &catalog
	})
	if apiSchemaLoadErr != nil {
		return nil, apiSchemaLoadErr
	}
	return apiSchemaCatalog, nil
}

func operationAPIResponseSchemaReference(path string) (map[string]any, error) {
	catalog, err := loadApiSchemaCatalog()
	if err != nil {
		return nil, err
	}
	target := normalizeSchemaPath(path)
	for _, endpoint := range catalog.Endpoints {
		if normalizeSchemaPath(endpoint.Path) == target {
			return map[string]any{
				"source":         apiSchemaSourceOperationAPI,
				"path":           endpoint.Path,
				"responseSchema": endpoint.ResponseSchema,
			}, nil
		}
	}
	return nil, fmt.Errorf("operation_api response schema not found: %s", path)
}

func searchApiSchema(catalog *schemagen.Catalog, input ApiSchemaInput) ApiSchemaOutput {
	pathQ := normalizeSchemaPath(input.Path)
	moduleQ := strings.TrimSpace(strings.ToLower(input.Module))
	keywordQ := strings.TrimSpace(strings.ToLower(input.Keyword))

	if pathQ == "" && moduleQ == "" && keywordQ == "" {
		return ApiSchemaOutput{
			Matched: false,
			Source:  apiSchemaSourceOperationAPI,
			Count:   0,
			Message: "请至少提供 path、module 或 keyword 之一",
		}
	}

	type scored struct {
		score int
		doc   schemagen.EndpointDocument
	}
	var matches []scored

	for _, ep := range catalog.Endpoints {
		score := scoreEndpoint(ep, pathQ, moduleQ, keywordQ)
		if score > 0 {
			matches = append(matches, scored{score: score, doc: ep})
		}
	}

	if len(matches) == 0 {
		return ApiSchemaOutput{
			Matched: false,
			Source:  apiSchemaSourceOperationAPI,
			Count:   0,
			Message: "未找到匹配接口，请调整 path/module/keyword",
		}
	}

	sort.Slice(matches, func(i, j int) bool {
		return matches[i].score > matches[j].score
	})

	limit := 10
	if len(matches) < limit {
		limit = len(matches)
	}
	results := make([]ApiSchemaResult, 0, limit)
	for i := 0; i < limit; i++ {
		ep := matches[i].doc
		results = append(results, ApiSchemaResult{
			Path:           ep.Path,
			Method:         ep.Method,
			Module:         ep.Module,
			Summary:        ep.Summary,
			RequestSchema:  ep.RequestSchema,
			ResponseSchema: ep.ResponseSchema,
		})
	}

	return ApiSchemaOutput{
		Matched: true,
		Source:  apiSchemaSourceOperationAPI,
		Count:   len(results),
		Results: results,
	}
}

func scoreEndpoint(ep schemagen.EndpointDocument, pathQ, moduleQ, keywordQ string) int {
	if moduleQ != "" && !moduleMatches(ep, moduleQ) {
		return 0
	}

	pathScore := 0
	if pathQ != "" {
		norm := normalizeSchemaPath(ep.Path)
		switch {
		case norm == pathQ:
			pathScore = 100
		case strings.HasSuffix(norm, "/"+pathQ):
			pathScore = 85
		default:
			return 0
		}
	}

	kwScore := keywordScore(ep, keywordQ)
	if keywordQ != "" && kwScore == 0 {
		return 0
	}

	if pathScore > 0 {
		return pathScore + kwScore
	}
	if kwScore > 0 {
		return kwScore
	}
	if moduleQ != "" {
		return 10
	}
	return 0
}

func moduleMatches(ep schemagen.EndpointDocument, moduleQ string) bool {
	m := strings.ToLower(ep.Module)
	if m == moduleQ {
		return true
	}
	if strings.HasPrefix(m, moduleQ+"_") {
		return true
	}
	return strings.Contains(normalizeSchemaPath(ep.Path), moduleQ)
}

func keywordScore(ep schemagen.EndpointDocument, keywordQ string) int {
	if keywordQ == "" {
		return 0
	}
	score := 0
	if strings.Contains(strings.ToLower(ep.Path), keywordQ) {
		score += 40
	}
	if strings.Contains(strings.ToLower(ep.Summary), keywordQ) {
		score += 30
	}
	score += scoreSchemaKeyword(ep.RequestSchema, keywordQ)
	score += scoreSchemaKeyword(ep.ResponseSchema, keywordQ)
	return score
}

func scoreSchemaKeyword(schema map[string]any, keyword string) int {
	if schema == nil {
		return 0
	}
	data, err := json.Marshal(schema)
	if err != nil {
		return 0
	}
	if strings.Contains(strings.ToLower(string(data)), keyword) {
		return 10
	}
	return 0
}

func normalizeSchemaPath(p string) string {
	p = strings.TrimSpace(p)
	p = strings.TrimPrefix(p, "/")
	p = strings.TrimPrefix(p, "v1/operationapi/")
	return strings.ToLower(strings.Trim(p, "/"))
}

func ApiSchemaHandler(
	ctx context.Context,
	req *mcp.CallToolRequest,
	input ApiSchemaInput,
) (*mcp.CallToolResult, ApiSchemaOutput, error) {
	_ = ctx
	_ = req

	source := strings.TrimSpace(strings.ToLower(input.Source))
	if source == "" {
		source = apiSchemaSourceOperationAPI
	}
	if source != apiSchemaSourceOperationAPI {
		return nil, ApiSchemaOutput{
			Matched: false,
			Source:  source,
			Count:   0,
			Message: "未知 source，当前仅支持 operation_api",
		}, nil
	}

	pathQ := normalizeSchemaPath(input.Path)
	moduleQ := strings.TrimSpace(input.Module)
	keywordQ := strings.TrimSpace(input.Keyword)
	if pathQ == "" && moduleQ == "" && keywordQ == "" {
		return nil, ApiSchemaOutput{
			Matched: false,
			Source:  apiSchemaSourceOperationAPI,
			Count:   0,
			Message: "请至少提供 path、module 或 keyword 之一",
		}, nil
	}

	catalog, err := loadApiSchemaCatalog()
	if err != nil {
		return nil, ApiSchemaOutput{}, err
	}

	return nil, searchApiSchema(catalog, input), nil
}

func registerApiSchemaTool(server *mcp.Server) {
	mcp.AddTool(
		server,
		&mcp.Tool{
			Name: "api_schema",
			Description: mcpToolCallRequirement + `

服务端 HTTP API schema 检索。返回 JSON Schema 2020-12 请求/响应结构。

本服务仅提供已嵌入 schema 的检索，运行时不从源码导出。
schema 由维护脚本从 operation-api 同步至 knowledge/api_schemas/operation_api.json。

source=operation_api（瑞雪分享裂变运营 HTTP API，非客户端 ruixuego SDK）

参数（可组合）：path / module / keyword，至少一项。
- path：精确或后缀匹配（如 share/data），不支持模糊子串（url 不会匹配全部 url/*）
- module：模块过滤，legal 可匹配 legal/terms 与 legal_terms_other
- keyword：匹配 path、summary 或 schema 字段名

注意：部分接口 request 为空或 response.data 为泛化描述，表示源码缺少 swag 注释，需结合 handler 确认。

示例：
- api_schema source=operation_api path=share/data
- api_schema source=operation_api module=legal
- api_schema source=operation_api module=share keyword=product_id`,
		},
		ApiSchemaHandler,
	)
}
