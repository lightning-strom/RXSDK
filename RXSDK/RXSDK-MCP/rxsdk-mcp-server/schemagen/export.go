package schemagen

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// ExportFromOperationAPI 读取 operation-api 源码（只读），生成 MCP schema JSON。
func ExportFromOperationAPI(operationAPIRoot, outPath string) (*Catalog, error) {
	structs, err := parseDomainStructs(domainDirFromRoot(operationAPIRoot))
	if err != nil {
		return nil, fmt.Errorf("parse domain: %w", err)
	}
	endpoints, err := parseAdapterEndpoints(appGoPathFromRoot(operationAPIRoot), adapterDirFromRoot(operationAPIRoot))
	if err != nil {
		return nil, fmt.Errorf("parse adapters: %w", err)
	}

	catalog := &Catalog{
		Source:        "operation_api",
		SchemaDialect: jsonSchemaDialect,
		GeneratedAt:   time.Now().Format(time.RFC3339),
		EndpointCount: len(endpoints),
		Endpoints:     make([]EndpointDocument, 0, len(endpoints)),
	}
	for _, meta := range endpoints {
		catalog.Endpoints = append(catalog.Endpoints, EndpointDocument{
			Path:           meta.Path,
			Method:         meta.Method,
			Module:         meta.Module,
			Summary:        meta.Summary,
			RequestSchema:  buildRequestSchema(meta, structs),
			ResponseSchema: buildResponseSchema(meta.ResponseDataType, structs),
		})
	}

	if outPath != "" {
		if err := ValidateCatalog(catalog); err != nil {
			return nil, fmt.Errorf("catalog validation: %w", err)
		}
		data, err := json.MarshalIndent(catalog, "", "  ")
		if err != nil {
			return nil, err
		}
		if err := os.MkdirAll(filepath.Dir(outPath), 0o755); err != nil {
			return nil, err
		}
		if err := os.WriteFile(outPath, data, 0o644); err != nil {
			return nil, err
		}
	}
	return catalog, nil
}

// ValidateCatalog 校验嵌入 MCP 的 schema 质量。
func ValidateCatalog(c *Catalog) error {
	if c == nil {
		return fmt.Errorf("catalog is nil")
	}
	if !strings.Contains(c.SchemaDialect, "2020-12") {
		return fmt.Errorf("invalid schemaDialect: %s", c.SchemaDialect)
	}
	if len(c.Endpoints) == 0 {
		return fmt.Errorf("no endpoints")
	}
	if c.EndpointCount != len(c.Endpoints) {
		return fmt.Errorf("endpointCount %d != len(endpoints) %d", c.EndpointCount, len(c.Endpoints))
	}
	for _, ep := range c.Endpoints {
		if err := validateSchemaMap(ep.Path+" request", ep.RequestSchema); err != nil {
			return err
		}
		if err := validateSchemaMap(ep.Path+" response", ep.ResponseSchema); err != nil {
			return err
		}
	}
	return nil
}

func validateSchemaMap(label string, schema map[string]any) error {
	if schema == nil {
		return fmt.Errorf("%s: schema is nil", label)
	}
	if schema["$schema"] != jsonSchemaDialect {
		return fmt.Errorf("%s: invalid $schema", label)
	}
	if err := validatePropertyKeys(label, schema); err != nil {
		return err
	}
	if defs, ok := schema["$defs"].(map[string]any); ok {
		for name, def := range defs {
			defMap, ok := def.(map[string]any)
			if !ok {
				continue
			}
			if err := validatePropertyKeys(label+" $defs/"+name, defMap); err != nil {
				return err
			}
		}
	}
	return nil
}

func validatePropertyKeys(label string, schema map[string]any) error {
	props, _ := schema["properties"].(map[string]any)
	for k, v := range props {
		if strings.Contains(k, `"`) || strings.Contains(k, "default:") {
			return fmt.Errorf("%s: invalid property key %q", label, k)
		}
		child, ok := v.(map[string]any)
		if !ok {
			continue
		}
		if nested, ok := child["properties"].(map[string]any); ok && len(nested) > 0 {
			for nk := range nested {
				if strings.Contains(nk, `"`) || strings.Contains(nk, "default:") {
					return fmt.Errorf("%s: invalid nested property key %q", label, nk)
				}
			}
		}
	}
	return nil
}
