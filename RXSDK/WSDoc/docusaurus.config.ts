import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import tabBlocks from 'docusaurus-remark-plugin-tab-blocks';
import remarkGfm from 'remark-gfm';
// import remarkDefinitionList from 'remark-definition-list'; // removed: conflicts with :::tip title admonitions

const config: Config = {
  title: '望舒文档系统',
  tagline: '开发者文档中心',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
    faster: true,
  },

  url: (process.env.DOC_SITE_URL || 'https://docs.ruixueyun.com').replace(/\/+$/, ''),
  baseUrl: '/',

  organizationName: 'haiqi',
  projectName: 'knowledge-base',

  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          exclude: ['**/_*.mdx'],
          breadcrumbs: true,
          remarkPlugins: [
            remarkGfm,
            [
              tabBlocks,
              {
                labels: [
                  ['js', 'JavaScript'],
                  ['ts', 'TypeScript'],
                  ['jsx', 'React JSX'],
                  ['tsx', 'React TSX'],
                  ['bash', 'Bash'],
                  ['json', 'JSON'],
                ],
              },
            ],
          ],
          lastVersion: 'current',
          versions: {
            current: {
              label: 'v4.x',
            },
            'v3.5': {
              label: 'v3.5',
              banner: 'unmaintained',
              path: 'v3.5',
            },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: [
    '@docusaurus/theme-mermaid',
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/docs/开发者文档/数据分析/上报设备通讯录/iOS',
            to: '/docs/开发者文档/数据分析/上报设备通讯录',
          },
          {
            from: '/docs/开发者文档/数据分析/上报设备通讯录/Android',
            to: '/docs/开发者文档/数据分析/上报设备通讯录',
          },
          {
            from: '/docs/category/上报设备通讯录',
            to: '/docs/开发者文档/数据分析/上报设备通讯录',
          },
          {
            from: '/docs/开发者文档/入门指南/更新日志/JavaScript',
            to: '/docs/changelog-javascript',
          },
          {
            from: '/docs/开发者文档/入门指南/更新日志/iOS',
            to: '/docs/changelog-ios',
          },
          {
            from: '/docs/category/更新日志',
            to: '/docs/changelog',
          },
          {
            from: '/docs/category/鸿蒙',
            to: '/docs/changelog-harmonyos',
          },
          // ── 目录重组后的旧分类入口 ──
          {
            from: '/docs/category/账户',
            to: '/docs/开发者文档/登录-通行证/功能介绍',
          },
          {
            from: '/docs/category/登录',
            to: '/docs/开发者文档/登录-通行证/功能介绍',
          },
          {
            from: '/docs/category/支付',
            to: '/docs/开发者文档/支付/功能介绍',
          },
          {
            from: '/docs/category/分享',
            to: '/docs/开发者文档/分享/功能介绍',
          },
          {
            from: '/docs/category/数据分析',
            to: '/docs/开发者文档/数据分析/功能介绍/产品说明',
          },
          {
            from: '/docs/category/商业化',
            to: '/docs/开发者文档/商业化/原生接入',
          },
          {
            from: '/docs/category/广告投放',
            to: '/docs/开发者文档/广告投放/功能介绍',
          },
          {
            from: '/docs/category/小游戏渠道',
            to: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/快速开始',
          },
          {
            from: '/docs/category/国内-sdk&渠道',
            to: '/docs/开发者文档/三方服务/三方接入说明',
          },
          {
            from: '/docs/category/海外-sdk&渠道',
            to: '/docs/开发者文档/三方服务/三方接入说明',
          },
          {
            from: '/docs/category/运营工具',
            to: '/docs/开发者文档/推送/功能介绍',
          },
          {
            from: '/docs/category/数据与性能',
            to: '/docs/开发者文档/数据分析/功能介绍/产品说明',
          },
          {
            from: '/docs/category/用户服务',
            to: '/docs/开发者文档/客服/功能介绍',
          },
          // ── 命名规则（合并为单页） ──
          {
            from: '/docs/开发者文档/即时通讯/客户端接入/命名规则/iOS',
            to: '/docs/开发者文档/即时通讯/客户端接入/命名规则',
          },
          {
            from: '/docs/开发者文档/即时通讯/客户端接入/命名规则/Android',
            to: '/docs/开发者文档/即时通讯/客户端接入/命名规则',
          },
          {
            from: '/docs/category/命名规则',
            to: '/docs/开发者文档/即时通讯/客户端接入/命名规则',
          },
          // ── 分享通路配置（Tabs 合并） ──
          {
            from: '/docs/开发者文档/分享/分享通路配置/iOS',
            to: '/docs/开发者文档/分享/分享通路配置',
          },
          {
            from: '/docs/开发者文档/分享/分享通路配置/Android',
            to: '/docs/开发者文档/分享/分享通路配置',
          },
          {
            from: '/docs/category/分享通路配置',
            to: '/docs/开发者文档/分享/分享通路配置',
          },
          // ── 分享调度（Tabs 合并） ──
          {
            from: '/docs/开发者文档/分享/分享调度/iOS',
            to: '/docs/开发者文档/分享/分享调度',
          },
          {
            from: '/docs/开发者文档/分享/分享调度/Android',
            to: '/docs/开发者文档/分享/分享调度',
          },
          {
            from: '/docs/category/分享调度',
            to: '/docs/开发者文档/分享/分享调度',
          },
          // ── 法务配置/客户端接入（Tabs 合并） ──
          {
            from: '/docs/开发者文档/法务配置/客户端接入/iOS',
            to: '/docs/开发者文档/法务配置/原生接入',
          },
          {
            from: '/docs/开发者文档/法务配置/客户端接入/Android',
            to: '/docs/开发者文档/法务配置/原生接入',
          },
          {
            from: '/docs/开发者文档/法务配置',
            to: '/docs/开发者文档/法务配置/原生接入',
          },
          {
            from: '/docs/开发者文档/法务配置/客户端接入',
            to: '/docs/开发者文档/法务配置/原生接入',
          },
          // ── 意见反馈/客户端接入（Tabs 合并） ──
          {
            from: '/docs/开发者文档/意见反馈/客户端接入/iOS',
            to: '/docs/开发者文档/意见反馈/原生接入',
          },
          {
            from: '/docs/开发者文档/意见反馈/客户端接入/Android',
            to: '/docs/开发者文档/意见反馈/原生接入',
          },
          {
            from: '/docs/开发者文档/意见反馈',
            to: '/docs/开发者文档/意见反馈/原生接入',
          },
          {
            from: '/docs/开发者文档/意见反馈/客户端接入',
            to: '/docs/开发者文档/意见反馈/原生接入',
          },
          // ── 第二批（8 处） ──
          // ── 设备信息/快速接入 ──
          {
            from: '/docs/开发者文档/设备信息/iOS/快速接入',
            to: '/docs/开发者文档/设备信息/快速接入',
          },
          {
            from: '/docs/开发者文档/设备信息/Android/快速接入',
            to: '/docs/开发者文档/设备信息/快速接入',
          },
          {
            from: '/docs/开发者文档/设备信息/iOS',
            to: '/docs/开发者文档/设备信息/快速接入',
          },
          {
            from: '/docs/开发者文档/设备信息/Android',
            to: '/docs/开发者文档/设备信息/快速接入',
          },
          // ── 商户发红包/收款 ──
          {
            from: '/docs/开发者文档/商户发红包/iOS收款',
            to: '/docs/开发者文档/商户发红包/收款',
          },
          {
            from: '/docs/开发者文档/商户发红包/Android收款',
            to: '/docs/开发者文档/商户发红包/收款',
          },
          // ── GPM-SDK接入/快速开始 ──
          {
            from: '/docs/开发者文档/性能分析/GPM-SDK接入/iOS-接入/快速开始',
            to: '/docs/开发者文档/性能分析/GPM-SDK接入/快速开始',
          },
          {
            from: '/docs/开发者文档/性能分析/GPM-SDK接入/Android-接入/快速开始',
            to: '/docs/开发者文档/性能分析/GPM-SDK接入/快速开始',
          },
          {
            from: '/docs/开发者文档/性能分析/GPM-SDK接入/iOS-接入',
            to: '/docs/开发者文档/性能分析/GPM-SDK接入/快速开始',
          },
          {
            from: '/docs/开发者文档/性能分析/GPM-SDK接入/Android-接入',
            to: '/docs/开发者文档/性能分析/GPM-SDK接入/快速开始',
          },
          // ── DNS/腾讯DNS/接入 ──
          {
            from: '/docs/开发者文档/DNS/腾讯DNS/iOS接入',
            to: '/docs/开发者文档/DNS/腾讯DNS/原生接入',
          },
          {
            from: '/docs/开发者文档/DNS/腾讯DNS/Android接入',
            to: '/docs/开发者文档/DNS/腾讯DNS/原生接入',
          },
          {
            from: '/docs/开发者文档/DNS/腾讯DNS/接入',
            to: '/docs/开发者文档/DNS/腾讯DNS/原生接入',
          },
          // ── DNS/阿里DNS/接入 ──
          {
            from: '/docs/开发者文档/DNS/阿里DNS/iOS接入',
            to: '/docs/开发者文档/DNS/阿里DNS/原生接入',
          },
          {
            from: '/docs/开发者文档/DNS/阿里DNS/Android接入',
            to: '/docs/开发者文档/DNS/阿里DNS/原生接入',
          },
          {
            from: '/docs/开发者文档/DNS/阿里DNS/接入',
            to: '/docs/开发者文档/DNS/阿里DNS/原生接入',
          },
          // ── openinstall/接入 ──
          {
            from: '/docs/开发者文档/openinstall/iOS',
            to: '/docs/开发者文档/openinstall/原生接入',
          },
          {
            from: '/docs/开发者文档/openinstall/Android',
            to: '/docs/开发者文档/openinstall/原生接入',
          },
          {
            from: '/docs/开发者文档/openinstall/接入',
            to: '/docs/开发者文档/openinstall/原生接入',
          },
          // ── 排行榜/客户端接入 ──
          {
            from: '/docs/开发者文档/排行榜/客户端接入/iOS',
            to: '/docs/开发者文档/排行榜/原生接入',
          },
          {
            from: '/docs/开发者文档/排行榜/客户端接入/Android',
            to: '/docs/开发者文档/排行榜/原生接入',
          },
          {
            from: '/docs/category/客户端接入',
            to: '/docs/开发者文档/排行榜/原生接入',
          },
          {
            from: '/docs/开发者文档/排行榜/客户端接入',
            to: '/docs/开发者文档/排行榜/原生接入',
          },
          // ── 区服角色/客户端接入 ──
          {
            from: '/docs/开发者文档/区服角色/iOS',
            to: '/docs/开发者文档/区服角色/原生接入',
          },
          {
            from: '/docs/开发者文档/区服角色/Android',
            to: '/docs/开发者文档/区服角色/原生接入',
          },
          {
            from: '/docs/开发者文档/区服角色/客户端接入',
            to: '/docs/开发者文档/区服角色/原生接入',
          },
          // ── 第三批（12 处） ──
          // ── 福利码/快速接入 ──
          {
            from: '/docs/开发者文档/福利码/iOS-接入/快速开始',
            to: '/docs/开发者文档/福利码/快速接入',
          },
          {
            from: '/docs/开发者文档/福利码/Android-接入/快速开始',
            to: '/docs/开发者文档/福利码/快速接入',
          },
          {
            from: '/docs/开发者文档/福利码/iOS-接入',
            to: '/docs/开发者文档/福利码/快速接入',
          },
          {
            from: '/docs/开发者文档/福利码/Android-接入',
            to: '/docs/开发者文档/福利码/快速接入',
          },
          // ── 应用商店评分/快速接入 ──
          {
            from: '/docs/开发者文档/应用商店评分/iOS-评分/快速接入',
            to: '/docs/开发者文档/应用商店评分/快速接入',
          },
          {
            from: '/docs/开发者文档/应用商店评分/Android-评分/快速接入',
            to: '/docs/开发者文档/应用商店评分/快速接入',
          },
          {
            from: '/docs/开发者文档/应用商店评分/iOS-评分',
            to: '/docs/开发者文档/应用商店评分/快速接入',
          },
          {
            from: '/docs/开发者文档/应用商店评分/Android-评分',
            to: '/docs/开发者文档/应用商店评分/快速接入',
          },
          // ── 即时通讯/客户端接入/历史消息 ──
          {
            from: '/docs/开发者文档/即时通讯/客户端接入/历史消息/iOS',
            to: '/docs/开发者文档/即时通讯/客户端接入/历史消息',
          },
          {
            from: '/docs/开发者文档/即时通讯/客户端接入/历史消息/Android',
            to: '/docs/开发者文档/即时通讯/客户端接入/历史消息',
          },
          {
            from: '/docs/开发者文档/即时通讯/客户端接入/快速开始/iOS',
            to: '/docs/开发者文档/即时通讯/客户端接入/快速开始',
          },
          {
            from: '/docs/开发者文档/即时通讯/客户端接入/快速开始/Android',
            to: '/docs/开发者文档/即时通讯/客户端接入/快速开始',
          },
          // ── 三方服务 8 渠道 ──
          {
            from: '/docs/开发者文档/三方服务/Line/iOS',
            to: '/docs/开发者文档/三方服务/Line/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Line/Android',
            to: '/docs/开发者文档/三方服务/Line/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Reddit/iOS',
            to: '/docs/开发者文档/三方服务/Reddit/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Reddit/Android',
            to: '/docs/开发者文档/三方服务/Reddit/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Instagram/iOS',
            to: '/docs/开发者文档/三方服务/Instagram/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Instagram/Android',
            to: '/docs/开发者文档/三方服务/Instagram/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/SnapChat/iOS',
            to: '/docs/开发者文档/三方服务/SnapChat/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/SnapChat/Android',
            to: '/docs/开发者文档/三方服务/SnapChat/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Facebook/iOS',
            to: '/docs/开发者文档/三方服务/Facebook/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Facebook/Android',
            to: '/docs/开发者文档/三方服务/Facebook/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/TikTok/iOS',
            to: '/docs/开发者文档/三方服务/TikTok/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/TikTok/Android',
            to: '/docs/开发者文档/三方服务/TikTok/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Zalo/iOS',
            to: '/docs/开发者文档/三方服务/Zalo/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Zalo/Android',
            to: '/docs/开发者文档/三方服务/Zalo/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Google/iOS',
            to: '/docs/开发者文档/三方服务/Google/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Google/Android',
            to: '/docs/开发者文档/三方服务/Google/原生接入',
          },
          // ── 三方服务 8 渠道：接入 → 原生接入 ──
          {
            from: '/docs/开发者文档/三方服务/Line/接入',
            to: '/docs/开发者文档/三方服务/Line/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Reddit/接入',
            to: '/docs/开发者文档/三方服务/Reddit/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Instagram/接入',
            to: '/docs/开发者文档/三方服务/Instagram/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/SnapChat/接入',
            to: '/docs/开发者文档/三方服务/SnapChat/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Facebook/接入',
            to: '/docs/开发者文档/三方服务/Facebook/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/TikTok/接入',
            to: '/docs/开发者文档/三方服务/TikTok/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Zalo/接入',
            to: '/docs/开发者文档/三方服务/Zalo/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Google/接入',
            to: '/docs/开发者文档/三方服务/Google/原生接入',
          },
          // ── 第四批：即时通讯 + 分享快速接入 ──
          {
            from: '/docs/开发者文档/即时通讯/客户端接入/会话操作/iOS',
            to: '/docs/开发者文档/即时通讯/客户端接入/会话操作',
          },
          {
            from: '/docs/开发者文档/即时通讯/客户端接入/会话操作/Android',
            to: '/docs/开发者文档/即时通讯/客户端接入/会话操作',
          },
          {
            from: '/docs/category/会话操作',
            to: '/docs/开发者文档/即时通讯/客户端接入/会话操作',
          },
          {
            from: '/docs/开发者文档/即时通讯/客户端接入/消息操作/iOS',
            to: '/docs/开发者文档/即时通讯/客户端接入/消息操作',
          },
          {
            from: '/docs/开发者文档/即时通讯/客户端接入/消息操作/Android',
            to: '/docs/开发者文档/即时通讯/客户端接入/消息操作',
          },
          {
            from: '/docs/category/消息操作',
            to: '/docs/开发者文档/即时通讯/客户端接入/消息操作',
          },
          {
            from: '/docs/开发者文档/即时通讯/客户端接入/消息模型/iOS',
            to: '/docs/开发者文档/即时通讯/客户端接入/消息模型',
          },
          {
            from: '/docs/开发者文档/即时通讯/客户端接入/消息模型/Android',
            to: '/docs/开发者文档/即时通讯/客户端接入/消息模型',
          },
          {
            from: '/docs/category/消息模型',
            to: '/docs/开发者文档/即时通讯/客户端接入/消息模型',
          },
          {
            from: '/docs/开发者文档/分享/分享-iOS/快速接入',
            to: '/docs/开发者文档/分享/快速接入',
          },
          {
            from: '/docs/开发者文档/分享/分享-Android/快速接入',
            to: '/docs/开发者文档/分享/快速接入',
          },
          {
            from: '/docs/开发者文档/分享/分享-iOS',
            to: '/docs/开发者文档/分享/快速接入',
          },
          {
            from: '/docs/开发者文档/分享/分享-Android',
            to: '/docs/开发者文档/分享/快速接入',
          },
          {
            from: '/docs/category/分享 iOS',
            to: '/docs/开发者文档/分享/快速接入',
          },
          {
            from: '/docs/category/分享 Android',
            to: '/docs/开发者文档/分享/快速接入',
          },
          // ── 第五批：微信/商业化/广点通/Adjust/Firebase/TopOn ──
          {
            from: '/docs/开发者文档/三方服务/微信/客户端接入/iOS',
            to: '/docs/开发者文档/三方服务/微信/客户端接入/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/微信/客户端接入/Android',
            to: '/docs/开发者文档/三方服务/微信/客户端接入/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/微信/客户端接入/接入',
            to: '/docs/开发者文档/三方服务/微信/客户端接入/原生接入',
          },
          {
            from: '/docs/开发者文档/商业化/iOS',
            to: '/docs/开发者文档/商业化/原生接入',
          },
          {
            from: '/docs/开发者文档/商业化/Android',
            to: '/docs/开发者文档/商业化/原生接入',
          },
          {
            from: '/docs/开发者文档/广告投放/广点通/iOS',
            to: '/docs/开发者文档/广告投放/广点通/原生接入',
          },
          {
            from: '/docs/开发者文档/广告投放/广点通/Android',
            to: '/docs/开发者文档/广告投放/广点通/原生接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Adjust/iOS/快速开始',
            to: '/docs/开发者文档/三方服务/Adjust/快速开始',
          },
          {
            from: '/docs/开发者文档/三方服务/Adjust/Android/快速开始',
            to: '/docs/开发者文档/三方服务/Adjust/快速开始',
          },
          {
            from: '/docs/开发者文档/三方服务/Adjust/iOS/常用功能',
            to: '/docs/开发者文档/三方服务/Adjust/常用功能',
          },
          {
            from: '/docs/开发者文档/三方服务/Adjust/Android/常用功能',
            to: '/docs/开发者文档/三方服务/Adjust/常用功能',
          },
          {
            from: '/docs/开发者文档/三方服务/Adjust/iOS/附加功能',
            to: '/docs/开发者文档/三方服务/Adjust/附加功能',
          },
          {
            from: '/docs/开发者文档/三方服务/Adjust/Android/附加功能',
            to: '/docs/开发者文档/三方服务/Adjust/附加功能',
          },
          {
            from: '/docs/开发者文档/三方服务/Adjust/iOS/防作弊签名',
            to: '/docs/开发者文档/三方服务/Adjust/防作弊签名',
          },
          {
            from: '/docs/开发者文档/三方服务/Adjust/Android/防作弊签名',
            to: '/docs/开发者文档/三方服务/Adjust/防作弊签名',
          },
          {
            from: '/docs/开发者文档/三方服务/Adjust/iOS',
            to: '/docs/开发者文档/三方服务/Adjust/快速开始',
          },
          {
            from: '/docs/开发者文档/三方服务/Adjust/Android',
            to: '/docs/开发者文档/三方服务/Adjust/快速开始',
          },
          {
            from: '/docs/category/Adjust iOS',
            to: '/docs/开发者文档/三方服务/Adjust/快速开始',
          },
          {
            from: '/docs/category/Adjust Android',
            to: '/docs/开发者文档/三方服务/Adjust/快速开始',
          },
          {
            from: '/docs/开发者文档/三方服务/Firebase/Android/快速接入',
            to: '/docs/开发者文档/三方服务/Firebase/快速接入',
          },
          {
            from: '/docs/开发者文档/三方服务/Firebase/iOS/分析',
            to: '/docs/开发者文档/三方服务/Firebase/分析',
          },
          {
            from: '/docs/开发者文档/三方服务/Firebase/Android/分析',
            to: '/docs/开发者文档/三方服务/Firebase/分析',
          },
          {
            from: '/docs/开发者文档/三方服务/Firebase/iOS/推送',
            to: '/docs/开发者文档/三方服务/Firebase/推送',
          },
          {
            from: '/docs/开发者文档/三方服务/Firebase/Android/推送',
            to: '/docs/开发者文档/三方服务/Firebase/推送',
          },
          {
            from: '/docs/开发者文档/三方服务/Firebase/iOS/崩溃统计',
            to: '/docs/开发者文档/三方服务/Firebase/崩溃统计',
          },
          {
            from: '/docs/开发者文档/三方服务/Firebase/Android/崩溃统计',
            to: '/docs/开发者文档/三方服务/Firebase/崩溃统计',
          },
          {
            from: '/docs/开发者文档/三方服务/Firebase/iOS',
            to: '/docs/开发者文档/三方服务/Firebase/分析',
          },
          {
            from: '/docs/开发者文档/三方服务/Firebase/Android',
            to: '/docs/开发者文档/三方服务/Firebase/快速接入',
          },
          {
            from: '/docs/category/Firebase iOS',
            to: '/docs/开发者文档/三方服务/Firebase/分析',
          },
          {
            from: '/docs/category/Firebase Android',
            to: '/docs/开发者文档/三方服务/Firebase/快速接入',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/iOS/初始化',
            to: '/docs/开发者文档/三方服务/TopOn/初始化',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/Android/初始化',
            to: '/docs/开发者文档/三方服务/TopOn/初始化',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/iOS/隐私合规',
            to: '/docs/开发者文档/三方服务/TopOn/隐私合规',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/Android/隐私合规',
            to: '/docs/开发者文档/三方服务/TopOn/隐私合规',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/iOS/激励视频',
            to: '/docs/开发者文档/三方服务/TopOn/激励视频',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/Android/激励视频',
            to: '/docs/开发者文档/三方服务/TopOn/激励视频',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/iOS/横幅广告',
            to: '/docs/开发者文档/三方服务/TopOn/横幅广告',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/Android/横幅广告',
            to: '/docs/开发者文档/三方服务/TopOn/横幅广告',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/iOS/插屏广告',
            to: '/docs/开发者文档/三方服务/TopOn/插屏广告',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/Android/插屏广告',
            to: '/docs/开发者文档/三方服务/TopOn/插屏广告',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/iOS/开屏广告',
            to: '/docs/开发者文档/三方服务/TopOn/开屏广告',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/Android/开屏广告',
            to: '/docs/开发者文档/三方服务/TopOn/开屏广告',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/iOS/原生广告',
            to: '/docs/开发者文档/三方服务/TopOn/原生广告',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/Android/原生广告',
            to: '/docs/开发者文档/三方服务/TopOn/原生广告',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/iOS',
            to: '/docs/开发者文档/三方服务/TopOn/初始化',
          },
          {
            from: '/docs/开发者文档/三方服务/TopOn/Android',
            to: '/docs/开发者文档/三方服务/TopOn/初始化',
          },
          {
            from: '/docs/category/TopOn iOS',
            to: '/docs/开发者文档/三方服务/TopOn/初始化',
          },
          {
            from: '/docs/category/TopOn Android',
            to: '/docs/开发者文档/三方服务/TopOn/初始化',
          },
          // category redirects for deleted subdirs
          {
            from: '/docs/category/快速开始',
            to: '/docs/开发者文档/即时通讯/客户端接入/快速开始',
          },
        ],
      },
    ],
    [
      'docusaurus-plugin-llms',
      {
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        docsDir: 'docs',
        title: '望舒文档系统',
        description: 'SDK 开发者文档，涵盖登录、支付、推送、数据分析等功能',
        excludeImports: true,
        removeDuplicateHeadings: true,
        generateMarkdownFiles: false,
        includeOrder: [
          'intro*',
          '开发者文档/入门指南/**',
          '开发者文档/登录*/**',
          '开发者文档/支付/**',
          '开发者文档/推送/**',
          '开发者文档/数据分析/**',
        ],
        includeUnmatchedLast: true,
        ignoreFiles: [],
        warnOnIgnoredFiles: true,
      },
    ],
  ],

  themeConfig: {
    // TODO: 替换为望舒品牌 social card（当前为 Docusaurus 默认图）
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '望舒文档系统',
      logo: {
        alt: '望舒',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {
          type: 'doc',
          docId: '开发者文档/概览',
          position: 'left',
          label: '开发者文档',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} 望舒文档系统`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
    },
    mermaid: {
      theme: {light: 'base', dark: 'base'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
