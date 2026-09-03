#!/usr/bin/env node

import { spawn } from "child_process";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveBinary() {
  const platform = os.platform();

  if (platform === "darwin") return "ruixue-sdk-mcp-darwin";
  if (platform === "linux") return "ruixue-sdk-mcp-linux";
  if (platform === "win32") return "ruixue-sdk-mcp.exe";

  throw new Error(`Unsupported platform: ${platform}`);
}

const binName = resolveBinary();
const binPath = path.join(__dirname, "..", "go-bin", binName);

const env = { ...process.env };
// Cursor 本地 MCP 走 stdio；仅显式 MCP_MODE=http 时启 HTTP 服务
if (!env.MCP_MODE) {
  env.MCP_MODE = "stdio";
}
// 兼容文档中的 --stdio 参数
const args = process.argv.slice(2);
if (args.includes("--stdio")) {
  env.MCP_MODE = "stdio";
}

const child = spawn(binPath, [], {
  stdio: "inherit",
  env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});