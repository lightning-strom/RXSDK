package rxsdk

import (
	"context"
	"encoding/json"
	"strings"
	"testing"
	"time"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

func TestShareResponseSchemaReferenceUsesOperationAPI(t *testing.T) {
	reference, err := operationAPIResponseSchemaReference("v1/operationapi/share/data")
	if err != nil {
		t.Fatal(err)
	}
	if reference["source"] != apiSchemaSourceOperationAPI ||
		reference["path"] != "/v1/operationapi/share/data" {
		t.Fatalf("unexpected schema reference: %+v", reference)
	}
	schema, ok := reference["responseSchema"].(map[string]any)
	if !ok {
		t.Fatalf("responseSchema should be an object: %+v", reference)
	}
	defs, _ := schema["$defs"].(map[string]any)
	if defs["ShareData"] == nil || defs["ShareContent"] == nil {
		t.Fatalf("share response schema missing nested definitions: %+v", defs)
	}
}

func TestShareHandlersExposeOperationAPIResponseSchema(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	serverTransport, clientTransport := mcp.NewInMemoryTransports()
	go func() { _ = createServer().Run(ctx, serverTransport) }()
	client := mcp.NewClient(&mcp.Implementation{Name: "share-schema-test", Version: "1.0.0"}, nil)
	session, err := client.Connect(ctx, clientTransport, nil)
	if err != nil {
		t.Fatal(err)
	}
	defer session.Close()

	for _, tool := range []string{"ios", "android", "unity", "cocos2dx", "minigame"} {
		t.Run(tool, func(t *testing.T) {
			output, callErr := session.CallTool(ctx, &mcp.CallToolParams{
				Name: tool,
				Arguments: map[string]any{
					"feature": "share",
				},
			})
			if callErr != nil {
				t.Fatalf("call %s: %v", tool, callErr)
			}
			encoded, _ := json.Marshal(output.StructuredContent)
			text := string(encoded)
			for _, want := range []string{
				`"responseSchemas"`,
				`"getShareData"`,
				`"getShareInfo"`,
				`"/v1/operationapi/share/data"`,
				`"responseSchema"`,
				`"ShareData"`,
			} {
				if !strings.Contains(text, want) {
					t.Fatalf("%s output missing %q: %s", tool, want, text)
				}
			}
		})
	}
}
