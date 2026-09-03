package schemagen

import (
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var (
	routeRe           = regexp.MustCompile(`apiProxy\.(Get|Post)\(\s*(?:` + "`" + `([^` + "`" + `]+)` + "`" + `|"([^"]+)")\s*,\s*adapter\.(\w+)`)
	bindAdapterRe     = regexp.MustCompile(`api\.Bind(\w+APIAdapter)`)
	bindFuncDeclRe    = regexp.MustCompile(`func (Bind\w+APIAdapter)\s*\(`)
	swagRouterRe      = regexp.MustCompile(`@Router\s+(/[^\s]+)\s+\[(\w+)\]`)
	swagSummaryRe     = regexp.MustCompile(`@Summary\s+(.+)`)
	swagParamQueryRe  = regexp.MustCompile(`@Param\s+(\w+)\s+query\s+(\w+)\s+(\w+)\s+"([^"]*)"`)
	swagParamHeaderRe = regexp.MustCompile(`@Param\s+(\S+)\s+header\s+(\w+)\s+(\w+)\s+"([^"]*)"`)
	swagParamBodyRe   = regexp.MustCompile(`@Param\s+data\s+body\s+([\w.]+)`)
	swagSuccessRe     = regexp.MustCompile(`@Success\s+200\s+\{object\}\s+domain\.Response(?:\{data=([^}]+)\})?`)
	pathSegmentParamRe = regexp.MustCompile(`\{([^}:]+)`)
	unmarshalRe       = regexp.MustCompile(`var\s+param\s+domain\.(\w+)`)
	unmarshalRxkitRe  = regexp.MustCompile(`var\s+param\s+domain\.(\w+)[\s\n]+err\s+:=\s+rxkit\.UnmarshalJSON`)
)

func registeredBindNames(appGoPath string) ([]string, error) {
	data, err := os.ReadFile(appGoPath)
	if err != nil {
		return nil, err
	}
	var names []string
	seen := make(map[string]bool)
	for _, m := range bindAdapterRe.FindAllStringSubmatch(string(data), -1) {
		if seen[m[1]] {
			continue
		}
		seen[m[1]] = true
		names = append(names, m[1])
	}
	if len(names) == 0 {
		return nil, fmt.Errorf("no Bind*APIAdapter in %s", appGoPath)
	}
	return names, nil
}

func discoverBindFuncFiles(adapterDir string) (map[string]string, error) {
	entries, err := os.ReadDir(adapterDir)
	if err != nil {
		return nil, err
	}
	out := make(map[string]string)
	for _, ent := range entries {
		if ent.IsDir() || !strings.HasSuffix(ent.Name(), ".go") || strings.HasSuffix(ent.Name(), "_test.go") {
			continue
		}
		path := filepath.Join(adapterDir, ent.Name())
		data, err := os.ReadFile(path)
		if err != nil {
			return nil, err
		}
		for _, m := range bindFuncDeclRe.FindAllStringSubmatch(string(data), -1) {
			out[m[1]] = path
		}
	}
	return out, nil
}

func routesFromRegisteredBinds(bindNames []string, bindFuncToFile map[string]string) ([]routeBinding, error) {
	var routes []routeBinding
	for _, name := range bindNames {
		bindFunc := "Bind" + name
		filePath, ok := bindFuncToFile[bindFunc]
		if !ok {
			return nil, fmt.Errorf("bind function %s not found under adapter package", bindFunc)
		}
		data, err := os.ReadFile(filePath)
		if err != nil {
			return nil, err
		}
		body := extractPackageFuncSource(string(data), bindFunc)
		if body == "" {
			return nil, fmt.Errorf("empty body for %s in %s", bindFunc, filePath)
		}
		for _, m := range routeRe.FindAllStringSubmatch(body, -1) {
			p := m[2]
			if p == "" {
				p = m[3]
			}
			routes = append(routes, routeBinding{m[1], p, m[4]})
		}
	}
	return routes, nil
}

type routeBinding struct {
	method, path, handler string
}

func parseAdapterEndpoints(appGoPath, adapterDir string) ([]EndpointMeta, error) {
	bindNames, err := registeredBindNames(appGoPath)
	if err != nil {
		return nil, err
	}
	bindFuncToFile, err := discoverBindFuncFiles(adapterDir)
	if err != nil {
		return nil, err
	}
	routes, err := routesFromRegisteredBinds(bindNames, bindFuncToFile)
	if err != nil {
		return nil, err
	}
	handlerMeta, err := parseAllAdapterHandlers(adapterDir)
	if err != nil {
		return nil, err
	}

	byPath := make(map[string]*EndpointMeta)
	for _, r := range routes {
		meta := &EndpointMeta{
			Path:   normalizePath(r.path),
			Method: strings.ToUpper(r.method),
			Module: moduleFromPath(r.path),
		}
		applyHandlerMeta(meta, handlerMeta[r.handler])
		applyHandlerMeta(meta, handlerMeta[strings.ToLower(r.handler)])
		mergePathParams(meta)
		key := meta.Method + " " + meta.Path
		if existing, ok := byPath[key]; ok {
			mergeEndpointMeta(existing, meta)
		} else {
			cp := *meta
			byPath[key] = &cp
		}
	}

	out := make([]EndpointMeta, 0, len(byPath))
	for _, m := range byPath {
		out = append(out, *m)
	}
	return out, nil
}

func parseAllAdapterHandlers(adapterDir string) (map[string]*EndpointMeta, error) {
	entries, err := os.ReadDir(adapterDir)
	if err != nil {
		return nil, err
	}
	handlerMeta := make(map[string]*EndpointMeta)
	for _, ent := range entries {
		if ent.IsDir() || !strings.HasSuffix(ent.Name(), ".go") || strings.HasSuffix(ent.Name(), "_test.go") {
			continue
		}
		path := filepath.Join(adapterDir, ent.Name())
		fileHandlers, err := parseAdapterFileHandlers(path)
		if err != nil {
			return nil, fmt.Errorf("%s: %w", path, err)
		}
		for k, v := range fileHandlers {
			if existing, ok := handlerMeta[k]; ok {
				mergeEndpointMeta(existing, v)
			} else {
				handlerMeta[k] = v
			}
		}
	}
	return handlerMeta, nil
}

func mergeEndpointMeta(dst, src *EndpointMeta) {
	if src == nil {
		return
	}
	if dst.Summary == "" && src.Summary != "" {
		dst.Summary = src.Summary
	}
	if dst.BodyType == "" && src.BodyType != "" {
		dst.BodyType = src.BodyType
	}
	if dst.ResponseDataType == "" && src.ResponseDataType != "" {
		dst.ResponseDataType = src.ResponseDataType
	}
	mergeQueryParams(dst, src.QueryParams)
}

func mergeQueryParams(dst *EndpointMeta, src []QueryParam) {
	if len(src) == 0 {
		return
	}
	seen := make(map[string]bool, len(dst.QueryParams))
	for _, q := range dst.QueryParams {
		seen[q.Name] = true
	}
	for _, q := range src {
		if seen[q.Name] {
			continue
		}
		dst.QueryParams = append(dst.QueryParams, q)
		seen[q.Name] = true
	}
}

func applyHandlerMeta(meta *EndpointMeta, hm *EndpointMeta) {
	if hm != nil {
		mergeEndpointMeta(meta, hm)
	}
}

func mergePathParams(meta *EndpointMeta) {
	mergeQueryParams(meta, pathParamsFromRoute(meta.Path))
}

func pathParamsFromRoute(p string) []QueryParam {
	var out []QueryParam
	for _, m := range pathSegmentParamRe.FindAllStringSubmatch(p, -1) {
		name := m[1]
		out = append(out, QueryParam{
			Name:        name,
			Type:        "string",
			Required:    true,
			Description: "[path] " + name,
		})
	}
	return out
}

func parseAdapterFileHandlers(path string) (map[string]*EndpointMeta, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	content := string(data)

	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, path, data, parser.ParseComments)
	if err != nil {
		return nil, err
	}

	handlerMeta := make(map[string]*EndpointMeta)
	for _, decl := range f.Decls {
		fn, ok := decl.(*ast.FuncDecl)
		if !ok || fn.Recv == nil || fn.Name == nil {
			continue
		}
		name := fn.Name.Name
		meta := parseHandlerComments(fn.Doc)
		body := extractMethodFuncSource(content, name)
		if m := unmarshalRe.FindStringSubmatch(body); len(m) > 1 {
			meta.BodyType = m[1]
		}
		if m := unmarshalRxkitRe.FindStringSubmatch(body); len(m) > 1 {
			meta.BodyType = m[1]
		}
		handlerMeta[name] = meta
		handlerMeta[strings.ToLower(name)] = meta
	}
	return handlerMeta, nil
}

func parseHandlerComments(doc *ast.CommentGroup) *EndpointMeta {
	meta := &EndpointMeta{}
	if doc == nil {
		return meta
	}
	text := doc.Text()
	if m := swagSummaryRe.FindStringSubmatch(text); len(m) > 1 {
		meta.Summary = strings.TrimSpace(m[1])
	}
	if m := swagParamBodyRe.FindStringSubmatch(text); len(m) > 1 {
		meta.BodyType = strings.TrimPrefix(m[1], "domain.")
	}
	for _, m := range swagParamQueryRe.FindAllStringSubmatch(text, -1) {
		meta.QueryParams = append(meta.QueryParams, QueryParam{
			Name:        m[1],
			Type:        m[2],
			Required:    m[3] == "true",
			Description: m[4],
		})
	}
	for _, m := range swagParamHeaderRe.FindAllStringSubmatch(text, -1) {
		meta.QueryParams = append(meta.QueryParams, QueryParam{
			Name:        m[1],
			Type:        m[2],
			Required:    m[3] == "true",
			Description: "[header] " + m[4],
		})
	}
	if m := swagSuccessRe.FindStringSubmatch(text); len(m) > 1 && strings.TrimSpace(m[1]) != "" {
		meta.ResponseDataType = strings.TrimSpace(m[1])
	}
	if m := swagRouterRe.FindStringSubmatch(text); len(m) > 2 {
		meta.Path = normalizePath(m[1])
		meta.Method = strings.ToUpper(m[2])
	}
	return meta
}

func extractMethodFuncSource(content, funcName string) string {
	re := regexp.MustCompile(`func\s+\([^)]*\)\s+` + regexp.QuoteMeta(funcName) + `\s*\([^)]*\)[^{]*\{`)
	idx := re.FindStringIndex(content)
	if idx == nil {
		re2 := regexp.MustCompile(`func\s+\([^)]*\)\s+` + regexp.QuoteMeta(funcName) + `\s*\([^)]*\)[^{]*\{`)
		idx = re2.FindStringIndex(content)
	}
	if idx == nil {
		return ""
	}
	return extractBraceBlock(content, idx[0])
}

func extractPackageFuncSource(content, funcName string) string {
	re := regexp.MustCompile(`func\s+` + regexp.QuoteMeta(funcName) + `\s*\([^)]*\)[^{]*\{`)
	idx := re.FindStringIndex(content)
	if idx == nil {
		return ""
	}
	return extractBraceBlock(content, idx[0])
}

func extractBraceBlock(content string, start int) string {
	brace := strings.Index(content[start:], "{")
	if brace < 0 {
		return ""
	}
	pos := start + brace
	depth := 0
	for i := pos; i < len(content); i++ {
		switch content[i] {
		case '{':
			depth++
		case '}':
			depth--
			if depth == 0 {
				return content[start : i+1]
			}
		}
	}
	return ""
}

func normalizePath(p string) string {
	p = strings.TrimSpace(p)
	if !strings.HasPrefix(p, "/") {
		p = "/" + p
	}
	return p
}

func moduleFromPath(p string) string {
	parts := strings.Split(strings.Trim(normalizePath(p), "/"), "/")
	for i, part := range parts {
		if part == "operationapi" && i+1 < len(parts) {
			seg := parts[i+1]
			if seg != "" && !strings.Contains(seg, "{") {
				return seg
			}
		}
	}
	if len(parts) >= 2 && parts[0] == "v1" {
		return parts[1]
	}
	return ""
}
