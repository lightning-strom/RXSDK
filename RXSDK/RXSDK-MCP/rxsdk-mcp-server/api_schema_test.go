package rxsdk

import (
	"encoding/json"
	"strings"
	"testing"

	"my-mcp-server/schemagen"
)

func TestApiSchema_EmbeddedCatalog(t *testing.T) {
	catalog, err := loadApiSchemaCatalog()
	if err != nil {
		t.Fatal(err)
	}
	if err := schemagen.ValidateCatalog(catalog); err != nil {
		t.Fatalf("embedded catalog invalid: %v", err)
	}
}

func TestApiSchema_SearchByPath(t *testing.T) {
	catalog, err := loadApiSchemaCatalog()
	if err != nil {
		t.Fatal(err)
	}
	out := searchApiSchema(catalog, ApiSchemaInput{
		Source: "operation_api",
		Path:   "share/data",
	})
	if !out.Matched || out.Count == 0 {
		t.Fatalf("expected match: %+v", out)
	}
	if !strings.HasSuffix(out.Results[0].Path, "/share/data") {
		t.Fatalf("unexpected path: %s", out.Results[0].Path)
	}
	props, ok := out.Results[0].RequestSchema["properties"].(map[string]any)
	if !ok || len(props) == 0 {
		t.Fatal("request schema properties should not be empty")
	}
	if _, ok := props["product_id"]; !ok {
		t.Fatal("missing product_id in request properties")
	}
}

func TestApiSchema_RequiresQuery(t *testing.T) {
	catalog, err := loadApiSchemaCatalog()
	if err != nil {
		t.Fatal(err)
	}
	out := searchApiSchema(catalog, ApiSchemaInput{Source: "operation_api"})
	if out.Matched {
		t.Fatal("expected no match without path/module/keyword")
	}
	if out.Message == "" {
		t.Fatal("expected message hint")
	}
}

func TestApiSchema_UnknownSource(t *testing.T) {
	_, out, err := ApiSchemaHandler(nil, nil, ApiSchemaInput{
		Source: "other_api",
		Path:   "share/data",
	})
	if err != nil {
		t.Fatal(err)
	}
	if out.Matched {
		t.Fatal("expected no match for unknown source")
	}
	if !strings.Contains(out.Message, "operation_api") {
		t.Fatalf("expected hint message: %s", out.Message)
	}
}

func TestApiSchema_LegalTermsOtherModuleMatch(t *testing.T) {
	catalog, err := loadApiSchemaCatalog()
	if err != nil {
		t.Fatal(err)
	}
	out := searchApiSchema(catalog, ApiSchemaInput{
		Source: "operation_api",
		Module: "legal",
	})
	if !out.Matched {
		t.Fatal("expected legal module matches")
	}
	found := false
	for _, r := range out.Results {
		if strings.Contains(r.Path, "legal_terms_other") {
			found = true
			break
		}
	}
	if !found {
		t.Fatal("module=legal should include legal_terms_other")
	}
}

func TestApiSchema_StrictPathNoSubstring(t *testing.T) {
	catalog, err := loadApiSchemaCatalog()
	if err != nil {
		t.Fatal(err)
	}
	out := searchApiSchema(catalog, ApiSchemaInput{
		Source: "operation_api",
		Path:   "url",
	})
	if out.Matched {
		t.Fatalf("path=url should not fuzzy-match all url/* routes: count=%d", out.Count)
	}
	out = searchApiSchema(catalog, ApiSchemaInput{
		Source: "operation_api",
		Path:   "url/landing",
	})
	if !out.Matched || out.Results[0].Path == "" {
		t.Fatal("expected exact suffix match for url/landing")
	}
}

func TestApiSchema_ModuleKeywordCombo(t *testing.T) {
	catalog, err := loadApiSchemaCatalog()
	if err != nil {
		t.Fatal(err)
	}
	out := searchApiSchema(catalog, ApiSchemaInput{
		Source:  "operation_api",
		Module:  "share",
		Keyword: "product_id",
	})
	if !out.Matched {
		t.Fatal("expected module+keyword match")
	}
	for _, r := range out.Results {
		if r.Module != "share" {
			t.Fatalf("module filter failed: %s", r.Module)
		}
	}
}

func TestApiSchema_LegalTermsQueryParams(t *testing.T) {
	catalog, err := loadApiSchemaCatalog()
	if err != nil {
		t.Fatal(err)
	}
	out := searchApiSchema(catalog, ApiSchemaInput{
		Source: "operation_api",
		Path:   "legal/terms",
	})
	if !out.Matched {
		t.Fatal("expected legal/terms match")
	}
	props, _ := out.Results[0].RequestSchema["properties"].(map[string]any)
	if props["product_id"] == nil || props["channel_id"] == nil {
		b, _ := json.Marshal(props)
		t.Fatalf("legal/terms missing query params: %s", string(b))
	}
}
