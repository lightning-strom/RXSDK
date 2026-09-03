// Package main starts the RXSDK MCP service.
package main

import (
	"os"

	rxsdk "my-mcp-server"
)

func main() {
	if len(os.Args) == 2 && os.Args[1] == "version" {
		return
	}

	rxsdk.StartMCP()
}
