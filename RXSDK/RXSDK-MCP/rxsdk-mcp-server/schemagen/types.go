package schemagen

const jsonSchemaDialect = "https://json-schema.org/draft/2020-12/schema"

type StructField struct {
	JSONName    string
	GoName      string
	TypeExpr    string
	Required    bool
	Description string
}

type StructInfo struct {
	Name   string
	Fields []StructField
}

type QueryParam struct {
	Name        string
	Type        string
	Required    bool
	Description string
}

type EndpointMeta struct {
	Path             string
	Method           string
	Module           string
	Summary          string
	BodyType         string
	QueryParams      []QueryParam
	ResponseDataType string
}

type Catalog struct {
	Source         string             `json:"source"`
	SchemaDialect  string             `json:"schemaDialect"`
	Version        string             `json:"version,omitempty"`
	GeneratedAt    string             `json:"generatedAt"`
	EndpointCount  int                `json:"endpointCount"`
	Endpoints      []EndpointDocument `json:"endpoints"`
}

type EndpointDocument struct {
	Path           string         `json:"path"`
	Method         string         `json:"method"`
	Module         string         `json:"module"`
	Summary        string         `json:"summary,omitempty"`
	RequestSchema  map[string]any `json:"requestSchema"`
	ResponseSchema map[string]any `json:"responseSchema"`
}
