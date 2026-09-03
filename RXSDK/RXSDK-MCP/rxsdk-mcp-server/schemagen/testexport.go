package schemagen

import "go/ast"

// 以下导出仅供单元测试使用。

func PathParamsFromRouteForTest(p string) []QueryParam {
	return pathParamsFromRoute(p)
}

func ParseJSONTagForTest(tag string) (string, bool) {
	return parseJSONTag(&ast.BasicLit{Value: "`" + tag + "`"})
}

func RegisteredBindNamesForTest(appGoPath string) ([]string, error) {
	return registeredBindNames(appGoPath)
}

func DiscoverBindFuncFilesForTest(adapterDir string) (map[string]string, error) {
	return discoverBindFuncFiles(adapterDir)
}

func RoutesFromRegisteredBindsForTest(bindNames []string, bindFuncToFile map[string]string) ([]RouteBindingForTest, error) {
	routes, err := routesFromRegisteredBinds(bindNames, bindFuncToFile)
	if err != nil {
		return nil, err
	}
	out := make([]RouteBindingForTest, len(routes))
	for i, r := range routes {
		out[i] = RouteBindingForTest{r.method, r.path, r.handler}
	}
	return out, nil
}

type RouteBindingForTest struct {
	Method, Path, Handler string
}
