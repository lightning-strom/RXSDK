/**
 * 根据各包 package.json 生成/更新 README.md（开发维护用）
 * 运行: node scripts/generate-readmes.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagesRoot = path.join(__dirname, '..', 'Packages');

function depTable(deps) {
  if (!deps || Object.keys(deps).length === 0) return '无（根基础库）';
  return Object.entries(deps)
    .map(([k, v]) => `\`${k}\` @ \`${v}\``)
    .join('<br>');
}

function buildReadme(pkg) {
  const samples = pkg.samples?.length
    ? pkg.samples.map((s) => `- **${s.displayName}**：${s.description || ''}（\`${s.path}\`）`).join('\n')
    : '- 本包未配置 Samples，请参考代码与工程内 `Assets/Samples` 中同名示例（若有）。';

  return `# ${pkg.displayName}

${pkg.description || '（见 package.json）'}

## 包信息

| 项 | 内容 |
|----|------|
| UPM 名称 | \`${pkg.name}\` |
| 依赖 | ${depTable(pkg.dependencies)} |

## 安装

1. 在 Unity 工程 **Packages/manifest.json** 中配置瑞雪 Scoped Registry（见仓库根目录 README）。
2. 在 \`dependencies\` 中加入（版本号与项目统一）：

\`\`\`json
"${pkg.name}": "x.y.z"
\`\`\`

3. 若依赖中包含其它 \`com.ruixue.*\` 包，**版本号需与 \`com.ruixue.unitysdk.base\` 保持一致**。

## 使用说明

${pkg.name === 'com.ruixue.unitysdk.base'
    ? '- 本包为 **SDK 基础库**：请先阅读 \`RuiXueSdk\` 初始化流程，其它 \`com.ruixue.*\` 模块均依赖本包。'
    : '- 先完成 **RuiXue.Base**（\`com.ruixue.unitysdk.base\`）初始化，再调用本模块 API（除非本包文档另有说明）。'}
- 详细接入与平台差异以**瑞雪内部接口文档**为准；本 README 仅作仓库导航。

## 示例（Samples）

${samples}

## 相关文件

- 变更记录：同目录下 \`CHANGELOG.md\`（若有）
- 仓库总览：[\`README.md\`](../../README.md)
`;
}

const baseExtra = `

---

## 基础库说明（本包专用）

- **命名空间**：\`RuiXue\`，主入口为静态类 \`RuiXueSdk\`。
- **平台**：Android / iOS / WebGL 等通过宏选择实现（\`UNITY_ANDROID\`、\`UNITY_IOS\`、\`UNITY_WEBGL\` 等），编辑器下非目标平台使用占位实现。
- **原生依赖**：Android 需在 \`mainTemplate.gradle\` 中配置瑞雪 Maven 与 \`rxsdk_*\` 依赖；iOS 使用 CocoaPods / 工程内插件，详见内部工程规范。
`;

const dirs = fs
  .readdirSync(packagesRoot)
  .filter((n) => n.startsWith('com.ruixue.'))
  .sort();

for (const dir of dirs) {
  const pkgPath = path.join(packagesRoot, dir, 'package.json');
  if (!fs.existsSync(pkgPath)) continue;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const readmePath = path.join(packagesRoot, dir, 'README.md');
  let body = buildReadme(pkg);
  if (pkg.name === 'com.ruixue.unitysdk.base') body += baseExtra;
  fs.writeFileSync(readmePath, body, 'utf8');
  console.log('OK', dir);
}

console.log('Done:', dirs.length, 'packages');
