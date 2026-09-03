import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const quickEntries = [
  {title: '开始阅读', to: '/docs/开发者文档/概览'},
  {title: '查看更新日志', to: '/docs/开发者文档/入门指南/更新日志/Android'},
];

const roleEntries = [
  {
    title: '新手接入',
    desc: '从准备工作和快速开始路径进入',
    to: '/docs/开发者文档/概览',
  },
  {
    title: '客户端开发',
    desc: 'Android / iOS / Unity / 鸿蒙接入文档',
    to: '/docs/开发者文档/登录-通行证/功能介绍',
  },
  {
    title: '服务端开发',
    desc: '服务端 API、回调规范与 Go SDK',
    to: '/docs/开发者文档/登录-通行证/服务端接入/服务端-API',
  },
];

const featureEntries = [
  {
    title: '入门指南',
    desc: '初始化、准备工作、常见问题',
    to: '/docs/开发者文档/概览',
  },
  {
    title: '登录（通行证）',
    desc: '多平台登录与账号体系接入',
    to: '/docs/开发者文档/登录-通行证/功能介绍',
  },
  {
    title: '支付',
    desc: '渠道支付接入与回调处理',
    to: '/docs/开发者文档/支付/功能介绍',
  },
  {
    title: '推送',
    desc: '厂商推送能力和服务端推送',
    to: '/docs/开发者文档/推送/功能介绍',
  },
  {
    title: '数据分析',
    desc: '事件上报、属性管理与分析能力',
    to: '/docs/开发者文档/数据分析/功能介绍/产品说明',
  },
  {
    title: '服务端 API',
    desc: '签名、回调与通用规范',
    to: '/docs/开发者文档/入门指南/服务端接入须知',
  },
];

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="首页" description="望舒开发者文档中心">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroInner}>
              <Heading as="h1" className={styles.heroTitle}>
                {siteConfig.title}
              </Heading>
              {siteConfig.tagline && (
                <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
              )}
              <p className={styles.heroDescription}>
                望舒开发者文档中心，覆盖客户端接入、服务端 API、支付、推送与数据分析等核心能力。
              </p>
              <div className={styles.quickActions}>
                {quickEntries.map((entry) => (
                  <Link key={entry.title} className={styles.quickActionButton} to={entry.to}>
                    {entry.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container margin-top--lg">
          <Heading as="h2" className={styles.sectionTitle}>
            按角色快速进入
          </Heading>
          <div className={styles.roleGrid}>
            {roleEntries.map((entry) => (
              <Link key={entry.title} className={styles.roleCard} to={entry.to}>
                <Heading as="h3" className={styles.cardTitle}>
                  {entry.title}
                </Heading>
                <p className={styles.cardDesc}>{entry.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container margin-vert--md">
          <Heading as="h2" className={styles.sectionTitle}>
            核心文档分类
          </Heading>
          <div className={styles.featureGrid}>
            {featureEntries.map((entry) => (
              <Link key={entry.title} className={styles.featureCard} to={entry.to}>
                <Heading as="h3" className={styles.cardTitle}>
                  {entry.title}
                </Heading>
                <p className={styles.cardDesc}>{entry.desc}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="container margin-bottom--lg">
          <div className={styles.searchHint}>
            推荐关键词：登录回调 / 支付回调 / 初始化 / 错误码 / 版本检查
          </div>
        </section>
      </main>
    </Layout>
  );
}
