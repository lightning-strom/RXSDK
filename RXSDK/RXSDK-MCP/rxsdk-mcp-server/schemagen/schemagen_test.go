package schemagen_test

import (
	"os"
	"path/filepath"
	"testing"

	"my-mcp-server/schemagen"
)

func TestPathParamsFromRoute(t *testing.T) {
	params := schemagen.PathParamsFromRouteForTest("/v1/jump/{product_id}/{channel_id}")
	if len(params) != 2 {
		t.Fatalf("expected 2 path params, got %d", len(params))
	}
	if params[0].Name != "product_id" || params[1].Name != "channel_id" {
		t.Fatalf("unexpected names: %+v", params)
	}
}

func TestParseJSONTag(t *testing.T) {
	name, omitempty := schemagen.ParseJSONTagForTest(`json:"product_id"`)
	if name != "product_id" || omitempty {
		t.Fatalf("got %q omit=%v", name, omitempty)
	}
	name, omitempty = schemagen.ParseJSONTagForTest(`json:"code" default:"0"`)
	if name != "code" {
		t.Fatalf("expected code, got %q", name)
	}
	name, _ = schemagen.ParseJSONTagForTest(`json:"-"`)
	if name != "-" {
		t.Fatalf("expected '-' for ignored field tag, got %q", name)
	}
}

func TestRegisteredBindNames(t *testing.T) {
	dir := t.TempDir()
	appGo := filepath.Join(dir, "app.go")
	if err := os.WriteFile(appGo, []byte(`
package api
func init() {
	api.BindShareAPIAdapter(proxy, uc)
	api.BindLegalAPIAdapter(proxy, uc)
}
`), 0o644); err != nil {
		t.Fatal(err)
	}
	names, err := schemagen.RegisteredBindNamesForTest(appGo)
	if err != nil {
		t.Fatal(err)
	}
	if len(names) != 2 {
		t.Fatalf("expected 2 bind names, got %d: %v", len(names), names)
	}
}

func TestRoutesFromRegisteredBinds(t *testing.T) {
	dir := t.TempDir()
	adapterDir := filepath.Join(dir, "adapter")
	if err := os.MkdirAll(adapterDir, 0o755); err != nil {
		t.Fatal(err)
	}
	adapterGo := filepath.Join(adapterDir, "share_api_adapter.go")
	body := `package api
func BindShareAPIAdapter(apiProxy *gate.APIApp, useCase domain.ShareUseCase) {
	adapter := shareAPIAdapter{useCase: useCase}
	apiProxy.Post("/v1/operationapi/share/data", adapter.Data, gate.AuthTypeNoAuth)
	apiProxy.Get("/v1/operationapi/share/platforms", adapter.Platforms, gate.AuthTypeNoAuth)
}
type shareAPIAdapter struct{ useCase domain.ShareUseCase }
func (api *shareAPIAdapter) Data(req *gate.Request) error { return nil }
func (api *shareAPIAdapter) Platforms(req *gate.Request) error { return nil }
`
	if err := os.WriteFile(adapterGo, []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
	bindMap, err := schemagen.DiscoverBindFuncFilesForTest(adapterDir)
	if err != nil {
		t.Fatal(err)
	}
	if bindMap["BindShareAPIAdapter"] == "" {
		t.Fatal("BindShareAPIAdapter not discovered")
	}
	routes, err := schemagen.RoutesFromRegisteredBindsForTest([]string{"ShareAPIAdapter"}, bindMap)
	if err != nil {
		t.Fatal(err)
	}
	if len(routes) != 2 {
		t.Fatalf("expected 2 routes, got %d", len(routes))
	}
}
