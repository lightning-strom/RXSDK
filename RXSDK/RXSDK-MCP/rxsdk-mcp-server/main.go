package rxsdk

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

// ==================== Main ====================

func createServer() *mcp.Server {
	server := mcp.NewServer(
		&mcp.Implementation{
			Name:    "ruixue-sdk-mcp",
			Version: "1.0.0",
		},
		nil,
	)

	registerAndroidTools(server)
	registerIOSTools(server)
	registerUnityTools(server)
	registerCocos2dxTools(server)
	registerHarmonyTools(server)
	registerMinigameTools(server)
	registerErrorGuideTool(server)
	registerRuixuegoTools(server)
	registerApiSchemaTool(server)

	return server
}

func StartMCP() {
	mode := os.Getenv("MCP_MODE")
	if mode == "" {
		mode = "http"
	}

	switch strings.ToLower(mode) {
	case "http":
		startHTTPServer()
	default:
		startStdioServer()
	}
}

// startStdioServer 本地模式，供 Cursor IDE 使用
func startStdioServer() {
	server := createServer()
	log.Println("[MCP] Starting in stdio mode...")
	if err := server.Run(context.Background(), &mcp.StdioTransport{}); err != nil {
		log.Fatal("MCP Server (stdio) failed:", err)
	}
}

// startHTTPServer 云端模式，通过 StreamableHTTP 对外服务
func startHTTPServer() {
	apiKey := os.Getenv("MCP_API_KEY")

	server := createServer()
	handler := mcp.NewStreamableHTTPHandler(
		func(r *http.Request) *mcp.Server { return server },
		&mcp.StreamableHTTPOptions{},
	)

	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, `{"status":"ok","service":"ruixue-sdk-mcp","version":"1.0.0"}`)
	})

	if apiKey != "" {
		mux.Handle("/mcp", apiKeyMiddleware(apiKey, handler))
	} else {
		log.Println("[MCP] WARNING: MCP_API_KEY not set, running without authentication")
		mux.Handle("/mcp", handler)
	}

	// port := os.Getenv("PORT")
	// if port == "" {
	// 	port = "8080"
	// }
	port := "8080"

	addr := ":" + port
	log.Printf("[MCP] Starting HTTP server on %s (endpoint: /mcp)\n", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal("MCP Server (http) failed:", err)
	}
}

// apiKeyMiddleware 验证请求中的 API Key
func apiKeyMiddleware(validKey string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		key := r.Header.Get("Authorization")
		if key == "" {
			key = r.Header.Get("X-API-Key")
		}

		key = strings.TrimPrefix(key, "Bearer ")

		if key != validKey {
			http.Error(w, `{"error":"unauthorized","message":"invalid or missing API key"}`, http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
