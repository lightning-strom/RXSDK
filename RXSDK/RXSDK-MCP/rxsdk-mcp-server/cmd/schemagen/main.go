// 维护工具：从 operation-api 源码（只读）同步 schema 到 knowledge/。
// 不参与 MCP 运行时。
package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"

	"my-mcp-server/schemagen"
)

func main() {
	root := flag.String("root", "", "operation-api 根目录")
	out := flag.String("out", "knowledge/api_schemas/operation_api.json", "输出 JSON 路径")
	flag.Parse()

	if *root == "" {
		*root = os.Getenv("OPERATION_API_ROOT")
	}
	if *root == "" {
		*root = filepath.Join("..", "..", "operation-api")
	}
	absRoot, err := filepath.Abs(*root)
	if err != nil {
		fmt.Fprintf(os.Stderr, "root: %v\n", err)
		os.Exit(1)
	}
	absOut, err := filepath.Abs(*out)
	if err != nil {
		fmt.Fprintf(os.Stderr, "out: %v\n", err)
		os.Exit(1)
	}

	catalog, err := schemagen.ExportFromOperationAPI(absRoot, absOut)
	if err != nil {
		fmt.Fprintf(os.Stderr, "export failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("synced %d endpoints to %s\n", len(catalog.Endpoints), absOut)
}
