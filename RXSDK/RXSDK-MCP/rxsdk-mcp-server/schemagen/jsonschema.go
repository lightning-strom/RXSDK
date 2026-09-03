package schemagen

import (
	"strings"
)

func buildRequestSchema(meta EndpointMeta, structs map[string]*StructInfo) map[string]any {
	props := make(map[string]any)
	required := []string{}
	defs := make(map[string]any)
	used := make(map[string]bool)

	for _, q := range meta.QueryParams {
		props[q.Name] = map[string]any{
			"type":        swagTypeToJSONSchema(q.Type),
			"description": "[query] " + q.Description,
		}
		if q.Required {
			required = append(required, q.Name)
		}
	}

	if meta.BodyType != "" {
		inline := inlineStructObjectSchema(meta.BodyType, structs, used, defs)
		if inline != nil {
			if ps, ok := inline["properties"].(map[string]any); ok {
				for k, v := range ps {
					props[k] = v
				}
			}
			if req, ok := inline["required"].([]string); ok {
				required = append(required, req...)
			}
		}
	}

	return newObjectSchema(props, required, defs)
}

func buildResponseSchema(responseDataType string, structs map[string]*StructInfo) map[string]any {
	props := map[string]any{
		"code":          map[string]any{"type": "integer", "description": "状态 0 成功，其它失败"},
		"message":       map[string]any{"type": "string", "description": "错误信息"},
		"toast_message": map[string]any{"type": "string", "description": "弹窗信息"},
	}
	defs := make(map[string]any)
	used := make(map[string]bool)

	if data := schemaForResponseDataType(responseDataType, structs, used, defs); data != nil {
		props["data"] = data
	} else {
		props["data"] = map[string]any{"description": "动态返回数据"}
	}
	return newObjectSchema(props, nil, defs)
}

func inlineStructObjectSchema(typeName string, structs map[string]*StructInfo, used map[string]bool, defs map[string]any) map[string]any {
	typeName = strings.TrimPrefix(strings.TrimPrefix(typeName, "domain."), "*")
	if strings.HasPrefix(typeName, "map[") {
		return nil
	}
	info, ok := structs[typeName]
	if !ok {
		return map[string]any{"type": "object", "properties": map[string]any{}}
	}
	props := make(map[string]any)
	required := []string{}
	for _, f := range info.Fields {
		props[f.JSONName] = fieldToSchema(f, structs, used, defs)
		if f.Required {
			required = append(required, f.JSONName)
		}
	}
	out := map[string]any{"type": "object", "properties": props}
	if len(required) > 0 {
		out["required"] = required
	}
	return out
}

func schemaForResponseDataType(expr string, structs map[string]*StructInfo, used map[string]bool, defs map[string]any) map[string]any {
	expr = strings.TrimSpace(expr)
	if expr == "" {
		return nil
	}
	if strings.HasPrefix(expr, "map[") {
		inner := strings.TrimPrefix(strings.TrimPrefix(expr, "map[string]"), "domain.")
		if inner == "interface{}" || inner == "any" {
			return map[string]any{"type": "object", "additionalProperties": true}
		}
		return map[string]any{
			"type":                 "object",
			"additionalProperties": refOrInlineSchema(inner, structs, used, defs),
		}
	}
	return refOrInlineSchema(strings.TrimPrefix(expr, "domain."), structs, used, defs)
}

func refOrInlineSchema(typeName string, structs map[string]*StructInfo, used map[string]bool, defs map[string]any) map[string]any {
	typeName = strings.TrimPrefix(typeName, "*")
	if _, ok := structs[typeName]; ok {
		ensureStructDef(typeName, structs, used, defs)
		return map[string]any{"$ref": "#/$defs/" + typeName}
	}
	return map[string]any{"type": swagTypeToJSONSchema(typeName)}
}

func ensureStructDef(typeName string, structs map[string]*StructInfo, used map[string]bool, defs map[string]any) {
	if _, ok := defs[typeName]; ok {
		return
	}
	info, ok := structs[typeName]
	if !ok || used[typeName] {
		return
	}
	used[typeName] = true
	props := make(map[string]any)
	required := []string{}
	for _, f := range info.Fields {
		props[f.JSONName] = fieldToSchema(f, structs, used, defs)
		if f.Required {
			required = append(required, f.JSONName)
		}
	}
	schema := map[string]any{"type": "object", "properties": props}
	if len(required) > 0 {
		schema["required"] = required
	}
	defs[typeName] = schema
}

func fieldToSchema(f StructField, structs map[string]*StructInfo, used map[string]bool, defs map[string]any) map[string]any {
	schema := map[string]any{}
	if f.Description != "" {
		schema["description"] = f.Description
	}
	expr := strings.TrimPrefix(f.TypeExpr, "*")
	switch {
	case expr == "string":
		schema["type"] = "string"
	case expr == "bool":
		schema["type"] = "boolean"
	case expr == "int", expr == "int32", expr == "int64", expr == "uint", expr == "uint32", expr == "uint64":
		schema["type"] = "integer"
	case expr == "float32", expr == "float64":
		schema["type"] = "number"
	case expr == "interface{}":
		if _, ok := schema["description"]; !ok {
			schema["description"] = "动态类型"
		}
	case strings.HasPrefix(expr, "[]"):
		schema["type"] = "array"
		schema["items"] = elemSchema(strings.TrimPrefix(expr, "[]"), structs, used, defs)
	case strings.HasPrefix(expr, "map["):
		schema["type"] = "object"
		if strings.Contains(expr, "interface{}") || strings.Contains(expr, "any") {
			schema["additionalProperties"] = true
		} else {
			schema["additionalProperties"] = elemSchema(strings.TrimPrefix(expr, "map[string]"), structs, used, defs)
		}
	default:
		if _, ok := structs[expr]; ok {
			ensureStructDef(expr, structs, used, defs)
			schema["$ref"] = "#/$defs/" + expr
		} else {
			schema["type"] = "object"
		}
	}
	return schema
}

func elemSchema(elem string, structs map[string]*StructInfo, used map[string]bool, defs map[string]any) map[string]any {
	elem = strings.TrimPrefix(elem, "*")
	if elem == "interface{}" || elem == "any" {
		return map[string]any{}
	}
	if _, ok := structs[elem]; ok {
		ensureStructDef(elem, structs, used, defs)
		return map[string]any{"$ref": "#/$defs/" + elem}
	}
	return map[string]any{"type": swagTypeToJSONSchema(elem)}
}

func swagTypeToJSONSchema(t string) string {
	switch t {
	case "integer", "int", "int64":
		return "integer"
	case "number", "float":
		return "number"
	case "boolean", "bool":
		return "boolean"
	default:
		return "string"
	}
}

func newObjectSchema(props map[string]any, required []string, defs map[string]any) map[string]any {
	schema := map[string]any{
		"$schema":    jsonSchemaDialect,
		"type":       "object",
		"properties": props,
	}
	if len(required) > 0 {
		schema["required"] = required
	}
	if len(defs) > 0 {
		schema["$defs"] = defs
	}
	return schema
}
