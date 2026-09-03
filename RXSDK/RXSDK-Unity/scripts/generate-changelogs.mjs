/**
 * 根据 git 历史与版本记录，为各 com.ruixue 包生成 CHANGELOG.md
 * 运行: node scripts/generate-changelogs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagesRoot = path.join(__dirname, '..', 'Packages');

const versions = [
  {
    ver: '1.6.17', date: '2025-11-28',
    changes: [
      { type: 'Fixed', items: ['修复已知问题'] },
    ],
  },
  {
    ver: '1.6.16', date: '2025-11-20',
    changes: [
      { type: 'Added', items: ['新增 `SetArea` 设置地区接口'] },
    ],
  },
  {
    ver: '1.6.15', date: '2025-11-07',
    changes: [
      { type: 'Added', items: ['新增 `SetPasswordStrength` 设置密码强度', '新增 `SetPwdPattern` 设置密码正则'] },
      { type: 'Changed', items: ['Android 原生依赖更新'] },
    ],
  },
  {
    ver: '1.6.14', date: '2025-10-16',
    changes: [
      { type: 'Changed', items: ['UWA 升级至 1.4.4.0', 'UWA 剔除鸿蒙与 x86 架构'] },
    ],
  },
  {
    ver: '1.6.13', date: '2025-08-18',
    changes: [
      { type: 'Changed', items: ['UWA 升级至 1.4.3.3', 'iOS 登录回调调整'] },
      { type: 'Added', items: [
        '微信小游戏补全区服相关接口',
        '微信小游戏 JS SDK 升级至 3.10.11',
        '抖音 SDK 升级，新增 `OpenCustomerServiceConversation`',
        '微信小游戏补全广点通上报接口',
      ] },
    ],
  },
  {
    ver: '1.6.12', date: '2025-05-16',
    changes: [
      { type: 'Changed', items: ['更新抖音 JS SDK'] },
    ],
  },
  {
    ver: '1.6.11', date: '2025-05-13',
    changes: [
      { type: 'Changed', items: ['UWA 升级至 1.4.1.3'] },
      { type: 'Removed', items: ['移除 UWA Open Harmony so'] },
    ],
  },
  {
    ver: '1.6.10', date: '2025-04-24',
    changes: [
      { type: 'Changed', items: ['删除海外库 RXContactSDK 引用'] },
      { type: 'Fixed', items: ['修复 UWA 包描述'] },
    ],
  },
  {
    ver: '1.6.9', date: '2025-03-04',
    changes: [
      { type: 'Changed', items: ['iOS Facebook 删除 RXContactSDK 引用', '微信小游戏版本号升级'] },
      { type: 'Added', items: ['微信小游戏补全缺失接口'] },
      { type: 'Fixed', items: ['微信小游戏多线程打包关闭'] },
    ],
  },
  {
    ver: '1.6.7', date: '2025-02-17',
    changes: [
      { type: 'Added', items: ['添加瑞雪 SDK 微信、抖音小游戏插件开关'] },
      { type: 'Changed', items: ['更新抖音 JS SDK'] },
    ],
  },
  {
    ver: '1.6.6', date: '2025-02-11',
    changes: [
      { type: 'Fixed', items: ['分享参数为空时移除（避免异常）'] },
      { type: 'Changed', items: ['代码优化', 'UWA 版本升级至 1.3.2.4'] },
    ],
  },
  {
    ver: '1.6.5', date: '2025-01-23',
    changes: [
      { type: 'Changed', items: ['更新抖音 JS 代码', '优化 JS 日志输出，使用 `SetLogEnable` 开关控制'] },
      { type: 'Fixed', items: ['修复 LBS 库 Demo 在 Windows 平台编译报错', '替换 Unity 即将废弃接口 `Pointer_stringify` 为 `UTF8ToString`'] },
    ],
  },
  {
    ver: '1.6.4', date: '2025-01-21',
    changes: [
      { type: 'Changed', items: ['优化抖音 SDK 代码'] },
    ],
  },
  {
    ver: '1.6.3', date: '2025-01-18',
    changes: [
      { type: 'Changed', items: ['平台隔离优化', '优化抖音支付与分享'] },
    ],
  },
  {
    ver: '1.6.2', date: '2025-01-17',
    changes: [
      { type: 'Added', items: ['抖音小额支付支持'] },
    ],
  },
  {
    ver: '1.6.1', date: '2024-12-11',
    changes: [
      { type: 'Added', items: ['新增 `LoginOpenidExpireInvalid` 接口（iOS / Android）', 'UWA 新增发送通知', '添加 link.xml 防止 Unity 打包剔除接口'] },
      { type: 'Fixed', items: ['修复 iOS 编译失败问题'] },
    ],
  },
  {
    ver: '1.6.0', date: '2024-11-05',
    changes: [
      { type: 'Added', items: ['新增 Quick 库', '新增 `LoginOpenidExpireInvalid` 基础接口'] },
      { type: 'Changed', items: ['同步原生 SDK 3.6.1', '国内外登录配置参数重构', 'UWA SDK 更新', '支付同步 native 3.6.1+'] },
    ],
  },
  {
    ver: '1.5.0', date: '2024-10-26',
    changes: [
      { type: 'Added', items: ['新增 FeedbackUI（意见反馈 UI）独立模块'] },
      { type: 'Changed', items: ['微信 SDK JS 更新至 3.9.40', 'UWA SDK 更新'] },
      { type: 'Fixed', items: ['修复版本更新接口返回解析报错（嵌套 JSON 反序列化）'] },
    ],
  },
  {
    ver: '1.0.0', date: '2024-06-14',
    changes: [
      { type: 'Added', items: [
        '全平台架构搭建（Android / iOS / WebGL）',
        '登录、支付、分享、数据上报、推送、排行、反馈、帮助中心等核心模块',
        '海外模块：Google、Facebook、Instagram、TikTok、Snapchat、Reddit、Line、Zalo 等桥接',
        'Adjust、Firebase 桥接',
        '微信小游戏（WebGL）、抖音小游戏（WebGL）支持',
        'UWA 性能模块',
      ] },
    ],
  },
  {
    ver: '0.1.0', date: '2024-03-13',
    changes: [
      { type: 'Added', items: ['初始版本，项目结构搭建'] },
    ],
  },
];

function buildChangelog(pkgName) {
  let md = `# Changelog

本文件记录 \`${pkgName}\` 的版本变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

`;

  for (const v of versions) {
    md += `## [${v.ver}] - ${v.date}\n\n`;
    for (const c of v.changes) {
      md += `### ${c.type}\n\n`;
      for (const item of c.items) {
        md += `- ${item}\n`;
      }
      md += '\n';
    }
  }
  return md;
}

const dirs = fs.readdirSync(packagesRoot).filter((n) => n.startsWith('com.ruixue.')).sort();
for (const dir of dirs) {
  const pkgPath = path.join(packagesRoot, dir, 'package.json');
  if (!fs.existsSync(pkgPath)) continue;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const clPath = path.join(packagesRoot, dir, 'CHANGELOG.md');
  fs.writeFileSync(clPath, buildChangelog(pkg.name), 'utf8');
  console.log('OK', dir);
}
console.log('Done:', dirs.length, 'packages');
