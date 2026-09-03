import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '53a'),
    exact: true
  },
  {
    path: '/search/',
    component: ComponentCreator('/search/', '21b'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '5f7'),
    routes: [
      {
        path: '/docs/v3.5',
        component: ComponentCreator('/docs/v3.5', 'de4'),
        routes: [
          {
            path: '/docs/v3.5',
            component: ComponentCreator('/docs/v3.5', '96d'),
            routes: [
              {
                path: '/docs/v3.5/',
                component: ComponentCreator('/docs/v3.5/', '299'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/adjust 数据获取流程/',
                component: ComponentCreator('/docs/v3.5/adjust 数据获取流程/', '8a5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/adjust 数据获取流程/adjust 数据归因流程',
                component: ComponentCreator('/docs/v3.5/adjust 数据获取流程/adjust 数据归因流程', 'aa6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/DNS/腾讯DNS/Android接入',
                component: ComponentCreator('/docs/v3.5/DNS/腾讯DNS/Android接入', '3e6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/DNS/腾讯DNS/iOS接入',
                component: ComponentCreator('/docs/v3.5/DNS/腾讯DNS/iOS接入', 'a79'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/DNS/腾讯DNS/Unity接入',
                component: ComponentCreator('/docs/v3.5/DNS/腾讯DNS/Unity接入', 'd3c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/DNS/腾讯DNS/微信小游戏接入',
                component: ComponentCreator('/docs/v3.5/DNS/腾讯DNS/微信小游戏接入', '0c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/DNS/阿里DNS/Android接入',
                component: ComponentCreator('/docs/v3.5/DNS/阿里DNS/Android接入', '8ae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/DNS/阿里DNS/iOS接入',
                component: ComponentCreator('/docs/v3.5/DNS/阿里DNS/iOS接入', 'c34'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/DNS/阿里DNS/Unity接入',
                component: ComponentCreator('/docs/v3.5/DNS/阿里DNS/Unity接入', '793'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/openinstall/Android',
                component: ComponentCreator('/docs/v3.5/openinstall/Android', '286'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/openinstall/iOS',
                component: ComponentCreator('/docs/v3.5/openinstall/iOS', '2f0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/openinstall/功能介绍',
                component: ComponentCreator('/docs/v3.5/openinstall/功能介绍', 'fed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/openinstall/参数配置说明',
                component: ComponentCreator('/docs/v3.5/openinstall/参数配置说明', '6fe'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/007（司墨）/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/007（司墨）/客户端接入', 'a86'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/007（司墨）/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/007（司墨）/支付配置说明', '345'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/007（司墨）/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/007（司墨）/登录配置说明', 'ffa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/4399/H5页游/H5支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/4399/H5页游/H5支付配置说明', 'd40'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/4399/H5页游/H5登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/4399/H5页游/H5登录配置说明', '9f8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/4399/Unity 接入',
                component: ComponentCreator('/docs/v3.5/三方服务/4399/Unity 接入', '6ff'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/4399/客户端/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/4399/客户端/客户端接入', 'af5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/4399/客户端/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/4399/客户端/支付配置说明', 'a17'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/4399/客户端/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/4399/客户端/登录配置说明', '168'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/4399/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/4399/小游戏/小游戏支付配置', 'b95'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/4399/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/4399/小游戏/小游戏登录配置', 'b6a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Adjust/Android/常用功能',
                component: ComponentCreator('/docs/v3.5/三方服务/Adjust/Android/常用功能', '40f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Adjust/Android/快速开始',
                component: ComponentCreator('/docs/v3.5/三方服务/Adjust/Android/快速开始', '45c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Adjust/Android/防作弊签名',
                component: ComponentCreator('/docs/v3.5/三方服务/Adjust/Android/防作弊签名', '099'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Adjust/Android/附加功能',
                component: ComponentCreator('/docs/v3.5/三方服务/Adjust/Android/附加功能', '6a7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Adjust/iOS/常用功能',
                component: ComponentCreator('/docs/v3.5/三方服务/Adjust/iOS/常用功能', '1f5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Adjust/iOS/快速开始',
                component: ComponentCreator('/docs/v3.5/三方服务/Adjust/iOS/快速开始', 'f1d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Adjust/iOS/防作弊签名',
                component: ComponentCreator('/docs/v3.5/三方服务/Adjust/iOS/防作弊签名', 'aa8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Adjust/iOS/附加功能',
                component: ComponentCreator('/docs/v3.5/三方服务/Adjust/iOS/附加功能', '137'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Android 渠道接入说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Android 渠道接入说明', 'bb1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Aptoide/Unity 接入',
                component: ComponentCreator('/docs/v3.5/三方服务/Aptoide/Unity 接入', '7ed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Aptoide/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/Aptoide/客户端接入', '274'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Bilibili/Unity 接入',
                component: ComponentCreator('/docs/v3.5/三方服务/Bilibili/Unity 接入', '9ac'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Bilibili/客户端/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/Bilibili/客户端/客户端接入', '07a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Bilibili/客户端/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Bilibili/客户端/支付配置说明', '263'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Bilibili/客户端/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Bilibili/客户端/登录配置说明', '47d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Bilibili/小游戏/小游戏支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Bilibili/小游戏/小游戏支付配置说明', 'bed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Bilibili/小游戏/小游戏登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Bilibili/小游戏/小游戏登录配置说明', '97b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Checkout/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/Checkout/Android', '1d9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Checkout/Unity',
                component: ComponentCreator('/docs/v3.5/三方服务/Checkout/Unity', '7e6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Checkout/配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Checkout/配置说明', 'd98'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Facebook/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/Facebook/Android', '2c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Facebook/H5登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Facebook/H5登录配置说明', '917'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Facebook/iOS',
                component: ComponentCreator('/docs/v3.5/三方服务/Facebook/iOS', '0c8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Facebook/Unity',
                component: ComponentCreator('/docs/v3.5/三方服务/Facebook/Unity', 'ef7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Facebook/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Facebook/登录配置说明', '4c8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Firebase/Android/分析',
                component: ComponentCreator('/docs/v3.5/三方服务/Firebase/Android/分析', '3ed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Firebase/Android/崩溃统计',
                component: ComponentCreator('/docs/v3.5/三方服务/Firebase/Android/崩溃统计', '9df'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Firebase/Android/推送',
                component: ComponentCreator('/docs/v3.5/三方服务/Firebase/Android/推送', 'd14'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Firebase/iOS/分析',
                component: ComponentCreator('/docs/v3.5/三方服务/Firebase/iOS/分析', 'e26'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Firebase/iOS/崩溃统计',
                component: ComponentCreator('/docs/v3.5/三方服务/Firebase/iOS/崩溃统计', '890'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Firebase/iOS/推送',
                component: ComponentCreator('/docs/v3.5/三方服务/Firebase/iOS/推送', '607'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/GameTok/H5支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/GameTok/H5支付配置', 'e64'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/GameTok/H5登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/GameTok/H5登录配置', 'f61'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Google/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/Google/Android', '80f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Google/H5登陆配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Google/H5登陆配置说明', '251'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Google/iOS',
                component: ComponentCreator('/docs/v3.5/三方服务/Google/iOS', 'f00'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Google/Unity',
                component: ComponentCreator('/docs/v3.5/三方服务/Google/Unity', 'ce2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Google/推送配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Google/推送配置说明', 'b58'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Google/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Google/支付配置说明', '331'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Google/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Google/登录配置说明', '397'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Instagram/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/Instagram/Android', '3e7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Instagram/iOS',
                component: ComponentCreator('/docs/v3.5/三方服务/Instagram/iOS', '1cf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Instagram/Unity',
                component: ComponentCreator('/docs/v3.5/三方服务/Instagram/Unity', '6b3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Line/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/Line/Android', '978'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Line/iOS',
                component: ComponentCreator('/docs/v3.5/三方服务/Line/iOS', 'e43'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Line/Unity',
                component: ComponentCreator('/docs/v3.5/三方服务/Line/Unity', 'd3c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/mumu模拟器/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/mumu模拟器/Android', 'e1c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/mumu模拟器/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/mumu模拟器/支付配置说明', '2c4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/mumu模拟器/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/mumu模拟器/登录配置说明', 'b9b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Oaid/Unity 接入',
                component: ComponentCreator('/docs/v3.5/三方服务/Oaid/Unity 接入', '4fa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Oaid/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/Oaid/客户端接入', '89e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/OPPO/Unity/快速接入',
                component: ComponentCreator('/docs/v3.5/三方服务/OPPO/Unity/快速接入', '94f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/OPPO/客户端/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/OPPO/客户端/客户端接入', 'eaf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/OPPO/客户端/推送配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/OPPO/客户端/推送配置说明', 'ed0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/OPPO/客户端/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/OPPO/客户端/支付配置说明', 'd72'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/OPPO/客户端/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/OPPO/客户端/登录配置说明', '675'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/OPPO/小游戏/小游戏数据行为上报配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/OPPO/小游戏/小游戏数据行为上报配置说明', '6fe'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/OPPO/小游戏/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/OPPO/小游戏/支付配置说明', 'a23'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/OPPO/小游戏/服务端接入/数据行为上报',
                component: ComponentCreator('/docs/v3.5/三方服务/OPPO/小游戏/服务端接入/数据行为上报', '7a9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/OPPO/小游戏/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/OPPO/小游戏/登录配置说明', 'db7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/OPPO/海外OPPO接入/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/OPPO/海外OPPO接入/客户端接入', 'c2f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/OPPO/海外OPPO接入/海外OPPO支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/OPPO/海外OPPO接入/海外OPPO支付配置说明', 'e80'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Qoo/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/Qoo/Android', 'f65'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Qoo/Qoo支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Qoo/Qoo支付配置说明', '5d0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Qoo/Qoo登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Qoo/Qoo登录配置说明', '610'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Qoo/Unity',
                component: ComponentCreator('/docs/v3.5/三方服务/Qoo/Unity', '4f9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/QQ/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/QQ/小游戏支付配置', '839'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/QQ/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/QQ/小游戏登录配置', 'eb5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Quick/H5小游戏/H5支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Quick/H5小游戏/H5支付配置说明', 'c96'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Quick/H5小游戏/H5登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Quick/H5小游戏/H5登录配置说明', 'e85'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Quick/Unity/快速接入',
                component: ComponentCreator('/docs/v3.5/三方服务/Quick/Unity/快速接入', '461'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Quick/客户端/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/Quick/客户端/客户端接入', '2dd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Quick/客户端/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Quick/客户端/支付配置说明', 'b84'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Quick/客户端/登陆配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Quick/客户端/登陆配置说明', 'b4a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Reddit/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/Reddit/Android', '23c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Reddit/iOS',
                component: ComponentCreator('/docs/v3.5/三方服务/Reddit/iOS', '76a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Reddit/Unity',
                component: ComponentCreator('/docs/v3.5/三方服务/Reddit/Unity', 'ead'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/SnapChat/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/SnapChat/Android', 'a29'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/SnapChat/iOS',
                component: ComponentCreator('/docs/v3.5/三方服务/SnapChat/iOS', 'c90'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/SnapChat/Unity',
                component: ComponentCreator('/docs/v3.5/三方服务/SnapChat/Unity', '256'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/steam/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/steam/支付配置说明', '075'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/steam/登陆配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/steam/登陆配置说明', '5b1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TapTap/Unity 接入',
                component: ComponentCreator('/docs/v3.5/三方服务/TapTap/Unity 接入', '377'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TapTap/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/TapTap/客户端接入', 'c61'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TapTap/配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/TapTap/配置说明', '602'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TikTok/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/TikTok/Android', 'd21'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TikTok/iOS',
                component: ComponentCreator('/docs/v3.5/三方服务/TikTok/iOS', '49b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TikTok/Unity',
                component: ComponentCreator('/docs/v3.5/三方服务/TikTok/Unity', 'f9f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/Android/初始化',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/Android/初始化', 'db2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/Android/原生广告',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/Android/原生广告', 'b91'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/Android/开屏广告',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/Android/开屏广告', 'c23'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/Android/插屏广告',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/Android/插屏广告', '532'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/Android/横幅广告',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/Android/横幅广告', '85b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/Android/激励视频',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/Android/激励视频', 'af8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/Android/隐私合规',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/Android/隐私合规', '809'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/iOS/初始化',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/iOS/初始化', '5e6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/iOS/原生广告',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/iOS/原生广告', 'bd1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/iOS/开屏广告',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/iOS/开屏广告', 'fe1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/iOS/插屏广告',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/iOS/插屏广告', 'f15'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/iOS/横幅广告',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/iOS/横幅广告', '0e1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/iOS/激励视频',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/iOS/激励视频', 'f7c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/TopOn/iOS/隐私合规',
                component: ComponentCreator('/docs/v3.5/三方服务/TopOn/iOS/隐私合规', '813'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/UC浏览器/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/UC浏览器/小游戏/小游戏支付配置', 'ace'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/UC浏览器/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/UC浏览器/小游戏/小游戏登录配置', 'c9c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Unity Android 渠道接入说明',
                component: ComponentCreator('/docs/v3.5/三方服务/Unity Android 渠道接入说明', 'd06'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/UTG支付/UTG 支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/UTG支付/UTG 支付配置', 'fc1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/vivo/Unity/快速接入',
                component: ComponentCreator('/docs/v3.5/三方服务/vivo/Unity/快速接入', '7ec'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/vivo/客户端/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/vivo/客户端/客户端接入', '3a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/vivo/客户端/推送配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/vivo/客户端/推送配置说明', 'b56'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/vivo/客户端/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/vivo/客户端/支付配置说明', 'c9c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/vivo/客户端/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/vivo/客户端/登录配置说明', 'c77'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/vivo/小游戏/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/vivo/小游戏/支付配置说明', '202'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/vivo/小游戏/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/vivo/小游戏/登录配置说明', 'a7f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/VNG小游戏/服务端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/VNG小游戏/服务端接入', '25c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/VNG小游戏/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/VNG小游戏/登录配置说明', '12b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/waffo支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/waffo支付配置', 'd3d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Zalo/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/Zalo/Android', '4ab'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Zalo/iOS',
                component: ComponentCreator('/docs/v3.5/三方服务/Zalo/iOS', '7d2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/Zalo/Unity',
                component: ComponentCreator('/docs/v3.5/三方服务/Zalo/Unity', '9db'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/一键登录/阿里一键登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/一键登录/阿里一键登录配置', '577'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/七七手游/H5小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/七七手游/H5小游戏支付配置', '7e3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/七七手游/H5小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/七七手游/H5小游戏登录配置', '01c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/七七手游/服务端对接/开放平台对接',
                component: ComponentCreator('/docs/v3.5/三方服务/七七手游/服务端对接/开放平台对接', '1a5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/三方错误码说明',
                component: ComponentCreator('/docs/v3.5/三方服务/三方错误码说明', '043'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/中宣部防沉迷参数获取',
                component: ComponentCreator('/docs/v3.5/三方服务/中宣部防沉迷参数获取', 'ed9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/九游/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/九游/客户端接入', '214'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/九游/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/九游/支付配置说明', '6e9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/九游/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/九游/登录配置说明', '1dd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/京东/任务完成通知接口',
                component: ComponentCreator('/docs/v3.5/三方服务/京东/任务完成通知接口', 'b86'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/京东/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/京东/小游戏支付配置', '8cc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/京东/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/京东/小游戏登录配置', 'b07'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/人群包/服务端接口',
                component: ComponentCreator('/docs/v3.5/三方服务/人群包/服务端接口', 'c8d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/最右/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/最右/小游戏支付配置', 'f26'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/最右/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/最右/小游戏登录配置', '367'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/最右/服务端对接/开放平台对接',
                component: ComponentCreator('/docs/v3.5/三方服务/最右/服务端对接/开放平台对接', '1f4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/Unity/快速接入',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/Unity/快速接入', '92d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/内嵌社区/快速接入',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/内嵌社区/快速接入', 'ec5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/华为小艺/小艺事件配置',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/华为小艺/小艺事件配置', 'cf4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/华为小艺/小艺接入',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/华为小艺/小艺接入', 'f62'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/国内客户端/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/国内客户端/客户端接入', 'af7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/国内客户端/推送配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/国内客户端/推送配置说明', '272'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/国内客户端/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/国内客户端/支付配置说明', '81f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/国内客户端/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/国内客户端/登录配置说明', 'f92'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/国内小游戏/小游戏支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/国内小游戏/小游戏支付配置说明', 'd3a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/国内小游戏/小游戏登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/国内小游戏/小游戏登录配置说明', '92a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/海外华为客户端/华为FaceBook登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/海外华为客户端/华为FaceBook登录配置', '172'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/海外华为客户端/华为Google登录',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/海外华为客户端/华为Google登录', '552'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/海外华为客户端/华为登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/海外华为客户端/华为登录配置说明', '045'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/海外华为客户端/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/海外华为客户端/客户端接入', '4fe'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/海外华为客户端/推送配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/海外华为客户端/推送配置说明', '900'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/海外华为客户端/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/海外华为客户端/支付配置说明', 'a12'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/海外小游戏/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/海外小游戏/支付配置说明', '5ce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/海外小游戏/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/海外小游戏/登录配置说明', '54d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/游戏近场快传（鸿蒙）/快速接入-原生版',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/游戏近场快传（鸿蒙）/快速接入-原生版', 'b3a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/游戏近场快传（鸿蒙）/快速接入-团结版',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/游戏近场快传（鸿蒙）/快速接入-团结版', '2ae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/游戏道具商城',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/游戏道具商城', '512'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/华为/高光时刻/快速接入',
                component: ComponentCreator('/docs/v3.5/三方服务/华为/高光时刻/快速接入', '696'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/哈啰/哈啰小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/哈啰/哈啰小游戏/小游戏支付配置', '2ad'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/哈啰/哈啰小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/哈啰/哈啰小游戏/小游戏登录配置', '4dd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/好游快爆/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/好游快爆/小游戏支付配置', 'f68'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/好游快爆/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/好游快爆/小游戏登录配置', 'be3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/小米/Unity 接入',
                component: ComponentCreator('/docs/v3.5/三方服务/小米/Unity 接入', '653'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/小米/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/小米/客户端接入', '447'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/小米/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/小米/小游戏/小游戏支付配置', 'a37'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/小米/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/小米/小游戏/小游戏登录配置', '8a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/小米/推送配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/小米/推送配置说明', '75d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/小米/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/小米/支付配置说明', '229'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/小米/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/小米/登录配置说明', '054'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/巨量广告/Android接入/快速接入',
                component: ComponentCreator('/docs/v3.5/三方服务/巨量广告/Android接入/快速接入', '761'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/巨量广告/iOS接入',
                component: ComponentCreator('/docs/v3.5/三方服务/巨量广告/iOS接入', '054'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/巨量广告/Unity接入/快速接入',
                component: ComponentCreator('/docs/v3.5/三方服务/巨量广告/Unity接入/快速接入', 'b52'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/应用宝/Unity 接入',
                component: ComponentCreator('/docs/v3.5/三方服务/应用宝/Unity 接入', '966'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/应用宝/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/应用宝/客户端接入', '5a7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/应用宝/游戏币支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/应用宝/游戏币支付配置说明', '6db'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/应用宝/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/应用宝/登录配置说明', '8ee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/应用宝/直购模式支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/应用宝/直购模式支付配置说明', 'aab'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/微信/Unity 接入/快速接入',
                component: ComponentCreator('/docs/v3.5/三方服务/微信/Unity 接入/快速接入', '91f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/微信/客户端接入/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/微信/客户端接入/Android', '633'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/微信/客户端接入/iOS',
                component: ComponentCreator('/docs/v3.5/三方服务/微信/客户端接入/iOS', '9c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/微信/客户端接入/鸿蒙原生',
                component: ComponentCreator('/docs/v3.5/三方服务/微信/客户端接入/鸿蒙原生', '6c5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/微信/客户端接入/鸿蒙团结',
                component: ComponentCreator('/docs/v3.5/三方服务/微信/客户端接入/鸿蒙团结', '21a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/微信/小游戏配置/公众号支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/微信/小游戏配置/公众号支付配置说明', '9c9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/微信/小游戏配置/小游戏登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/微信/小游戏配置/小游戏登录配置说明', 'cbb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/微信/小游戏配置/小游戏跳转支付',
                component: ComponentCreator('/docs/v3.5/三方服务/微信/小游戏配置/小游戏跳转支付', '8d5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/微信/小游戏配置/直购模式支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/微信/小游戏配置/直购模式支付配置说明', '714'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/微信/小游戏配置/虚拟支付2.0支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/微信/小游戏配置/虚拟支付2.0支付配置说明', 'b58'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/微信/微信配置/微信 H5 支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/微信/微信配置/微信 H5 支付配置说明', 'fcf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/微信/微信配置/微信App支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/微信/微信配置/微信App支付配置说明', '44c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/微信/微信配置/微信登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/微信/微信配置/微信登录配置说明', '665'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/快手/Unity 接入',
                component: ComponentCreator('/docs/v3.5/三方服务/快手/Unity 接入', 'f82'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/快手/客户端/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/快手/客户端/客户端接入', '907'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/快手/客户端/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/快手/客户端/支付配置说明', '087'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/快手/客户端/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/快手/客户端/登录配置说明', 'e98'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/快手/小游戏/小游戏支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/快手/小游戏/小游戏支付配置说明', '984'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/快手/小游戏/小游戏登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/快手/小游戏/小游戏登录配置说明', 'ac7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/抖音/Unity/快速接入',
                component: ComponentCreator('/docs/v3.5/三方服务/抖音/Unity/快速接入', 'c4a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/抖音/客户端/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/抖音/客户端/客户端接入', 'd14'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/抖音/客户端/抖音支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/抖音/客户端/抖音支付配置', 'fe1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/抖音/客户端/抖音登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/抖音/客户端/抖音登录配置', '898'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/抖音/小游戏/小游戏付费礼包配置',
                component: ComponentCreator('/docs/v3.5/三方服务/抖音/小游戏/小游戏付费礼包配置', '26f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/抖音/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/抖音/小游戏/小游戏支付配置', 'f71'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/抖音/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/抖音/小游戏/小游戏登录配置', 'b88'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/抖音/小游戏/推荐流直出游戏能力/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/抖音/小游戏/推荐流直出游戏能力/客户端接入', '952'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/抖音/小游戏/推荐流直出游戏能力/推荐流直出配置文档',
                component: ComponentCreator('/docs/v3.5/三方服务/抖音/小游戏/推荐流直出游戏能力/推荐流直出配置文档', 'f62'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/抖音/小游戏/推荐流直出游戏能力/服务端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/抖音/小游戏/推荐流直出游戏能力/服务端接入', 'da9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/抖音/小游戏/服务端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/抖音/小游戏/服务端接入', '047'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/抖音/小游戏/游戏站配置',
                component: ComponentCreator('/docs/v3.5/三方服务/抖音/小游戏/游戏站配置', '39a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/支付宝/Alipay/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/支付宝/Alipay/Android', '0ac'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/支付宝/Alipay/app支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/支付宝/Alipay/app支付配置说明', 'a22'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/支付宝/Alipay/Unity',
                component: ComponentCreator('/docs/v3.5/三方服务/支付宝/Alipay/Unity', '9af'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/支付宝/AlipayH5/Android',
                component: ComponentCreator('/docs/v3.5/三方服务/支付宝/AlipayH5/Android', '079'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/支付宝/AlipayH5/h5支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/支付宝/AlipayH5/h5支付配置说明', '7a7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/支付宝/AlipayH5/Unity',
                component: ComponentCreator('/docs/v3.5/三方服务/支付宝/AlipayH5/Unity', '159'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/支付宝/小游戏/小游戏IOS虚拟币支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/支付宝/小游戏/小游戏IOS虚拟币支付配置', '7ca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/支付宝/小游戏/小游戏安卓_鸿蒙支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/支付宝/小游戏/小游戏安卓_鸿蒙支付配置', '8f2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/支付宝/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/支付宝/小游戏/小游戏登录配置', 'f57'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/支付宝/小游戏/服务端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/支付宝/小游戏/服务端接入', 'eca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/支付宝/小游戏/游戏圈礼包',
                component: ComponentCreator('/docs/v3.5/三方服务/支付宝/小游戏/游戏圈礼包', '141'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/支付宝/小游戏/订阅消息模板ID获取',
                component: ComponentCreator('/docs/v3.5/三方服务/支付宝/小游戏/订阅消息模板ID获取', 'c50'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/易宝支付/Unity接入',
                component: ComponentCreator('/docs/v3.5/三方服务/易宝支付/Unity接入', 'db3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/易宝支付/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/易宝支付/客户端接入', '373'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/智齿/服务端接口',
                component: ComponentCreator('/docs/v3.5/三方服务/智齿/服务端接口', '4db'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/服务商内容安全/腾讯云配置',
                component: ComponentCreator('/docs/v3.5/三方服务/服务商内容安全/腾讯云配置', '32e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/服务商内容安全/阿里云配置',
                component: ComponentCreator('/docs/v3.5/三方服务/服务商内容安全/阿里云配置', 'b3b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/栩腾/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/栩腾/客户端接入', '5a2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/淘宝/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/淘宝/小游戏支付配置', '3fa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/淘宝/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/淘宝/小游戏登录配置', 'b8a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/爱奇艺/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/爱奇艺/小游戏支付配置', '264'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/爱奇艺/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/爱奇艺/小游戏登录配置', '60a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/爱微游/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/爱微游/小游戏支付配置', 'ce6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/爱微游/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/爱微游/小游戏登录配置', '494'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/独角兽/服务端接口',
                component: ComponentCreator('/docs/v3.5/三方服务/独角兽/服务端接口', '46f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/百度/Unity 接入',
                component: ComponentCreator('/docs/v3.5/三方服务/百度/Unity 接入', '60a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/百度/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/百度/客户端接入', 'd23'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/百度/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/百度/小游戏/小游戏支付配置', 'abe'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/百度/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/百度/小游戏/小游戏登录配置', 'e2f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/百度/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/百度/支付配置说明', 'deb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/百度/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/百度/登录配置说明', 'a6e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/百度/百度H5小游戏/H5支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/百度/百度H5小游戏/H5支付配置', '777'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/百度/百度H5小游戏/H5登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/百度/百度H5小游戏/H5登录配置', '6ab'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/私域/服务端接口',
                component: ComponentCreator('/docs/v3.5/三方服务/私域/服务端接口', 'bf5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/美团/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/美团/小游戏支付配置', '74a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/美团/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/美团/小游戏登录配置', 'a20'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/美团/服务端接口',
                component: ComponentCreator('/docs/v3.5/三方服务/美团/服务端接口', '794'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/群黑小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/群黑小游戏/小游戏支付配置', '950'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/群黑小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/群黑小游戏/小游戏登录配置', 'b36'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/群黑小游戏/服务端对接/开放平台对接',
                component: ComponentCreator('/docs/v3.5/三方服务/群黑小游戏/服务端对接/开放平台对接', '56e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/芒果小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/芒果小游戏/小游戏支付配置', '500'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/芒果小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/芒果小游戏/小游戏登录配置', '1ee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/苹果/ASA',
                component: ComponentCreator('/docs/v3.5/三方服务/苹果/ASA', 'd43'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/苹果/Game Center',
                component: ComponentCreator('/docs/v3.5/三方服务/苹果/Game Center', 'f4f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/苹果/H5登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/苹果/H5登录配置说明', '66d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/苹果/推送配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/苹果/推送配置说明', '1eb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/苹果/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/苹果/支付配置说明', 'b6e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/苹果/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/苹果/登录配置说明', 'cf4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/荣耀/Unity 接入',
                component: ComponentCreator('/docs/v3.5/三方服务/荣耀/Unity 接入', 'eb7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/荣耀/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/荣耀/客户端接入', '74e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/荣耀/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/荣耀/小游戏/小游戏支付配置', '6a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/荣耀/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/荣耀/小游戏/小游戏登录配置', '0c5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/荣耀/推送配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/荣耀/推送配置说明', 'e10'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/荣耀/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/荣耀/支付配置说明', 'e0d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/荣耀/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/荣耀/登录配置说明', '203'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/迅雷/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/迅雷/小游戏/小游戏支付配置', '063'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/迅雷/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/迅雷/小游戏/小游戏登录配置', '517'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/迅雷/小游戏/服务端对接/开放平台对接',
                component: ComponentCreator('/docs/v3.5/三方服务/迅雷/小游戏/服务端对接/开放平台对接', '89f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/银联/配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/银联/配置说明', '017'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/闪电玩/小游戏支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/闪电玩/小游戏支付配置', 'e85'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/闪电玩/小游戏登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/闪电玩/小游戏登录配置', 'a33'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/雷电模拟器/Unity 接入',
                component: ComponentCreator('/docs/v3.5/三方服务/雷电模拟器/Unity 接入', '8fc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/雷电模拟器/客户端接入',
                component: ComponentCreator('/docs/v3.5/三方服务/雷电模拟器/客户端接入', '23d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/雷电模拟器/支付配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/雷电模拟器/支付配置说明', '966'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/雷电模拟器/登录配置说明',
                component: ComponentCreator('/docs/v3.5/三方服务/雷电模拟器/登录配置说明', '5a0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/鸿蒙/鸿蒙应用微信登录',
                component: ComponentCreator('/docs/v3.5/三方服务/鸿蒙/鸿蒙应用微信登录', 'ed9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/鸿蒙/鸿蒙推送配置',
                component: ComponentCreator('/docs/v3.5/三方服务/鸿蒙/鸿蒙推送配置', 'fcf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/鸿蒙/鸿蒙支付配置',
                component: ComponentCreator('/docs/v3.5/三方服务/鸿蒙/鸿蒙支付配置', '6a8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/三方服务/鸿蒙/鸿蒙登录配置',
                component: ComponentCreator('/docs/v3.5/三方服务/鸿蒙/鸿蒙登录配置', '150'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/准备工作',
                component: ComponentCreator('/docs/v3.5/入门指南/准备工作', '8f8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/客户端错误码',
                component: ComponentCreator('/docs/v3.5/入门指南/客户端错误码', '25e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/常见问题',
                component: ComponentCreator('/docs/v3.5/入门指南/常见问题', '5b2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/4399H5小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/4399H5小游戏初始化/快速开始', '460'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/4399小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/4399小游戏初始化/快速开始', 'b5c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/Android初始化/快速接入',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/Android初始化/快速接入', '5e0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/gametok小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/gametok小游戏初始化/快速开始', 'e47'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/Go SDK 初始化',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/Go SDK 初始化', '56c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/iOS初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/iOS初始化/快速开始', '28d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/oppo小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/oppo小游戏初始化/快速开始', 'f86'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/Quick H5初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/Quick H5初始化/快速开始', '053'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/Steam 初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/Steam 初始化/快速开始', 'c1a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/UC小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/UC小游戏初始化/快速开始', 'cb4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/Unity 初始化/小游戏插件',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/Unity 初始化/小游戏插件', 'a7c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/Unity 初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/Unity 初始化/快速开始', '649'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/vivo小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/vivo小游戏初始化/快速开始', '30f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/vng小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/vng小游戏初始化/快速开始', 'c4a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/京东小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/京东小游戏初始化/快速开始', '119'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/最右小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/最右小游戏初始化/快速开始', '063'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/华为小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/华为小游戏初始化/快速开始', '4dc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/司墨007小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/司墨007小游戏初始化/快速开始', '327'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/哈啰小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/哈啰小游戏初始化/快速开始', '754'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/哔哩哔哩小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/哔哩哔哩小游戏初始化/快速开始', '7fd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/好游快爆小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/好游快爆小游戏初始化/快速开始', '929'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/小米小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/小米小游戏初始化/快速开始', '51f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/微信小游戏初始化/JS 快速接入',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/微信小游戏初始化/JS 快速接入', 'c1f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/微信小游戏初始化/Unity 快速接入',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/微信小游戏初始化/Unity 快速接入', 'faa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/快手小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/快手小游戏初始化/快速开始', '8c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/抖音小游戏初始化/快速接入',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/抖音小游戏初始化/快速接入', 'e12'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/支付宝小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/支付宝小游戏初始化/快速开始', '709'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/望舒h5初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/望舒h5初始化/快速开始', 'c48'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/淘宝小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/淘宝小游戏初始化/快速开始', '2d5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/热面小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/热面小游戏初始化/快速开始', '836'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/爱奇艺小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/爱奇艺小游戏初始化/快速开始', '9d1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/爱微游小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/爱微游小游戏初始化/快速开始', 'f44'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/独角兽小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/独角兽小游戏初始化/快速开始', '058'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/百度h5小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/百度h5小游戏初始化/快速开始', 'b5a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/百度小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/百度小游戏初始化/快速开始', 'aeb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/美团小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/美团小游戏初始化/快速开始', '2fb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/群黑小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/群黑小游戏初始化/快速开始', '1a0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/芒好玩小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/芒好玩小游戏初始化/快速开始', '39e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/荣耀/小游戏/初始化',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/荣耀/小游戏/初始化', '3a2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/荣耀/小游戏/支付',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/荣耀/小游戏/支付', '280'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/荣耀/小游戏/望舒后台支付配置',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/荣耀/小游戏/望舒后台支付配置', '78d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/荣耀/小游戏/望舒后台登陆配置',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/荣耀/小游戏/望舒后台登陆配置', 'f5f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/荣耀/小游戏/激励广告',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/荣耀/小游戏/激励广告', '247'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/荣耀/小游戏/登录',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/荣耀/小游戏/登录', '802'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/迅雷小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/迅雷小游戏初始化/快速开始', '777'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/闪电玩小游戏初始化/快速开始',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/闪电玩小游戏初始化/快速开始', '895'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/鸿蒙 初始化/快速开始-原生版',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/鸿蒙 初始化/快速开始-原生版', 'fec'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/快速开始/鸿蒙 初始化/快速开始-团结版',
                component: ComponentCreator('/docs/v3.5/入门指南/快速开始/鸿蒙 初始化/快速开始-团结版', '02a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/更新日志/Android',
                component: ComponentCreator('/docs/v3.5/入门指南/更新日志/Android', 'f5a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/更新日志/Go SDK',
                component: ComponentCreator('/docs/v3.5/入门指南/更新日志/Go SDK', '1c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/更新日志/iOS/RXOSUIKit',
                component: ComponentCreator('/docs/v3.5/入门指南/更新日志/iOS/RXOSUIKit', '8ee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/更新日志/iOS/RXSDK_Pure',
                component: ComponentCreator('/docs/v3.5/入门指南/更新日志/iOS/RXSDK_Pure', '046'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/更新日志/iOS/RXUIKit',
                component: ComponentCreator('/docs/v3.5/入门指南/更新日志/iOS/RXUIKit', '0d1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/更新日志/JavaScript',
                component: ComponentCreator('/docs/v3.5/入门指南/更新日志/JavaScript', 'f7b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/更新日志/Steam',
                component: ComponentCreator('/docs/v3.5/入门指南/更新日志/Steam', '87f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/更新日志/Unity',
                component: ComponentCreator('/docs/v3.5/入门指南/更新日志/Unity', '0f6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/更新日志/服务端 API',
                component: ComponentCreator('/docs/v3.5/入门指南/更新日志/服务端 API', 'd5c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/更新日志/鸿蒙/原生版',
                component: ComponentCreator('/docs/v3.5/入门指南/更新日志/鸿蒙/原生版', 'f49'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/更新日志/鸿蒙/团结版',
                component: ComponentCreator('/docs/v3.5/入门指南/更新日志/鸿蒙/团结版', 'ec6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/服务商配置申请/阿里云',
                component: ComponentCreator('/docs/v3.5/入门指南/服务商配置申请/阿里云', 'ad7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/服务端接入须知',
                component: ComponentCreator('/docs/v3.5/入门指南/服务端接入须知', '606'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/望舒国家、币种及简称对照表',
                component: ComponentCreator('/docs/v3.5/入门指南/望舒国家、币种及简称对照表', '1e2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/望舒多语言简称对照表',
                component: ComponentCreator('/docs/v3.5/入门指南/望舒多语言简称对照表', '94b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/入门指南/概览',
                component: ComponentCreator('/docs/v3.5/入门指南/概览', '5c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/内容安全/功能介绍',
                component: ComponentCreator('/docs/v3.5/内容安全/功能介绍', '4fe'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/内容安全/服务端接入/Go SDK',
                component: ComponentCreator('/docs/v3.5/内容安全/服务端接入/Go SDK', '24d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/内容安全/服务端接入/微信信息解密',
                component: ComponentCreator('/docs/v3.5/内容安全/服务端接入/微信信息解密', '422'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/内容安全/服务端接入/服务端 API',
                component: ComponentCreator('/docs/v3.5/内容安全/服务端接入/服务端 API', '553'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/内容安全/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/v3.5/内容安全/服务端接入/服务端回调接口', '376'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/Unity 接入/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/Unity 接入/快速接入', '700'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享 Android/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享 Android/快速接入', 'e73'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享 iOS/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享 iOS/快速接入', '3bd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享 鸿蒙/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享 鸿蒙/快速接入', '0ad'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-4399H5小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-4399H5小游戏/快速接入', '4ec'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-Facebook小游戏',
                component: ComponentCreator('/docs/v3.5/分享/分享-Facebook小游戏', '768'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-QQ小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-QQ小游戏/快速接入', '752'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-UC小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-UC小游戏/快速接入', '5a7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-vivo小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-vivo小游戏/快速接入', '9e4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-京东小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-京东小游戏/快速接入', '769'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-哈啰小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-哈啰小游戏/快速接入', '3c7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-哔哩哔哩小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-哔哩哔哩小游戏/快速接入', '074'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-微信小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-微信小游戏/快速接入', '5d6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-快手小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-快手小游戏/快速接入', '180'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-抖音小游戏/Unity 快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-抖音小游戏/Unity 快速接入', '01a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-抖音小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-抖音小游戏/快速接入', '4f8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-支付宝小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-支付宝小游戏/快速接入', '085'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-淘宝小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-淘宝小游戏/快速接入', 'c8f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-爱奇艺小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-爱奇艺小游戏/快速接入', 'b91'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-爱微游小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-爱微游小游戏/快速接入', '66b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-百度小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-百度小游戏/快速接入', '8b5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-美团小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-美团小游戏/快速接入', 'a6d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-群黑小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-群黑小游戏/快速接入', 'b4c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-芒好玩小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-芒好玩小游戏/快速接入', '304'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享-闪电玩小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/分享/分享-闪电玩小游戏/快速接入', '7c0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享平台支持类型和回调',
                component: ComponentCreator('/docs/v3.5/分享/分享平台支持类型和回调', 'c4a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享调度/Android',
                component: ComponentCreator('/docs/v3.5/分享/分享调度/Android', '94d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享调度/iOS',
                component: ComponentCreator('/docs/v3.5/分享/分享调度/iOS', '9d8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享通路配置/Android',
                component: ComponentCreator('/docs/v3.5/分享/分享通路配置/Android', 'd04'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/分享通路配置/iOS',
                component: ComponentCreator('/docs/v3.5/分享/分享通路配置/iOS', '67e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/功能介绍',
                component: ComponentCreator('/docs/v3.5/分享/功能介绍', '0c9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/对象存储回源配置',
                component: ComponentCreator('/docs/v3.5/分享/对象存储回源配置', 'a04'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/服务端接入/动态消息 API',
                component: ComponentCreator('/docs/v3.5/分享/服务端接入/动态消息 API', '0ec'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/分享/服务端接入/服务端 API',
                component: ComponentCreator('/docs/v3.5/分享/服务端接入/服务端 API', '113'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/区服角色/Android',
                component: ComponentCreator('/docs/v3.5/区服角色/Android', '122'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/区服角色/iOS',
                component: ComponentCreator('/docs/v3.5/区服角色/iOS', 'bc6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/区服角色/功能介绍',
                component: ComponentCreator('/docs/v3.5/区服角色/功能介绍', 'b13'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/区服角色/小游戏',
                component: ComponentCreator('/docs/v3.5/区服角色/小游戏', '2f4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/区服角色/服务端API',
                component: ComponentCreator('/docs/v3.5/区服角色/服务端API', 'c2b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/区服角色/服务端API(作废)',
                component: ComponentCreator('/docs/v3.5/区服角色/服务端API(作废)', '373'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/功能介绍',
                component: ComponentCreator('/docs/v3.5/即时通讯/功能介绍', '0ae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/客户端接入/会话操作/Android',
                component: ComponentCreator('/docs/v3.5/即时通讯/客户端接入/会话操作/Android', '768'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/客户端接入/会话操作/iOS',
                component: ComponentCreator('/docs/v3.5/即时通讯/客户端接入/会话操作/iOS', '874'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/客户端接入/历史消息/Android',
                component: ComponentCreator('/docs/v3.5/即时通讯/客户端接入/历史消息/Android', 'dfd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/客户端接入/历史消息/iOS',
                component: ComponentCreator('/docs/v3.5/即时通讯/客户端接入/历史消息/iOS', '2e0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/客户端接入/命名规则/Android',
                component: ComponentCreator('/docs/v3.5/即时通讯/客户端接入/命名规则/Android', 'e6c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/客户端接入/命名规则/iOS',
                component: ComponentCreator('/docs/v3.5/即时通讯/客户端接入/命名规则/iOS', '91e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/客户端接入/快速开始/Android',
                component: ComponentCreator('/docs/v3.5/即时通讯/客户端接入/快速开始/Android', '193'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/客户端接入/快速开始/iOS',
                component: ComponentCreator('/docs/v3.5/即时通讯/客户端接入/快速开始/iOS', '22c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/客户端接入/消息操作/Android',
                component: ComponentCreator('/docs/v3.5/即时通讯/客户端接入/消息操作/Android', 'bb5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/客户端接入/消息操作/iOS',
                component: ComponentCreator('/docs/v3.5/即时通讯/客户端接入/消息操作/iOS', '306'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/客户端接入/消息模型/Android',
                component: ComponentCreator('/docs/v3.5/即时通讯/客户端接入/消息模型/Android', 'a40'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/客户端接入/消息模型/iOS',
                component: ComponentCreator('/docs/v3.5/即时通讯/客户端接入/消息模型/iOS', 'd68'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/服务端接入/Go SDK',
                component: ComponentCreator('/docs/v3.5/即时通讯/服务端接入/Go SDK', '2d4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/服务端接入/数据约束',
                component: ComponentCreator('/docs/v3.5/即时通讯/服务端接入/数据约束', '848'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/服务端接入/服务端 API',
                component: ComponentCreator('/docs/v3.5/即时通讯/服务端接入/服务端 API', '447'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/v3.5/即时通讯/服务端接入/服务端回调接口', '39b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/即时通讯/服务端接入/消息定义',
                component: ComponentCreator('/docs/v3.5/即时通讯/服务端接入/消息定义', 'ed1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/商业化/Android',
                component: ComponentCreator('/docs/v3.5/商业化/Android', '9e7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/商业化/iOS',
                component: ComponentCreator('/docs/v3.5/商业化/iOS', 'c29'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/商业化/小游戏',
                component: ComponentCreator('/docs/v3.5/商业化/小游戏', 'a38'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/商业化/窗口运营配置/场景管理',
                component: ComponentCreator('/docs/v3.5/商业化/窗口运营配置/场景管理', '79f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/商业化/窗口运营配置/礼包管理',
                component: ComponentCreator('/docs/v3.5/商业化/窗口运营配置/礼包管理', 'dc9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/商业化/窗口运营配置/窗口管理',
                component: ComponentCreator('/docs/v3.5/商业化/窗口运营配置/窗口管理', 'c8f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/商户发红包/Android收款',
                component: ComponentCreator('/docs/v3.5/商户发红包/Android收款', '150'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/商户发红包/IOS收款',
                component: ComponentCreator('/docs/v3.5/商户发红包/IOS收款', 'cc7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/商户发红包/商家转账服务端接入',
                component: ComponentCreator('/docs/v3.5/商户发红包/商家转账服务端接入', 'd25'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/商户发红包/商户发红包（废弃）',
                component: ComponentCreator('/docs/v3.5/商户发红包/商户发红包（废弃）', 'a3d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/商户发红包/微信小游戏收款',
                component: ComponentCreator('/docs/v3.5/商户发红包/微信小游戏收款', '2ce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/定位/Android 定位/快速接入',
                component: ComponentCreator('/docs/v3.5/定位/Android 定位/快速接入', '2d2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/定位/iOS 定位/快速接入',
                component: ComponentCreator('/docs/v3.5/定位/iOS 定位/快速接入', '226'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/定位/Unity 定位/快速接入',
                component: ComponentCreator('/docs/v3.5/定位/Unity 定位/快速接入', 'ab8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/定位/功能介绍',
                component: ComponentCreator('/docs/v3.5/定位/功能介绍', 'f7f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/Android 客服/快速接入',
                component: ComponentCreator('/docs/v3.5/客服/Android 客服/快速接入', '853'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/iOS 客服/快速接入',
                component: ComponentCreator('/docs/v3.5/客服/iOS 客服/快速接入', '3c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/JavaScript 接入',
                component: ComponentCreator('/docs/v3.5/客服/JavaScript 接入', 'f30'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/Unity 客服/快速接入',
                component: ComponentCreator('/docs/v3.5/客服/Unity 客服/快速接入', '932'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/功能介绍',
                component: ComponentCreator('/docs/v3.5/客服/功能介绍', 'e7d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/微信小游戏客服配置',
                component: ComponentCreator('/docs/v3.5/客服/微信小游戏客服配置', '73f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/抖音小游戏客服配置',
                component: ComponentCreator('/docs/v3.5/客服/抖音小游戏客服配置', '622'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/服务端接入/APP 客服接入文档',
                component: ComponentCreator('/docs/v3.5/客服/服务端接入/APP 客服接入文档', '1fc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/服务端接入/客服面板内嵌CP自定义页接入文档',
                component: ComponentCreator('/docs/v3.5/客服/服务端接入/客服面板内嵌CP自定义页接入文档', '2e7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/服务端接入/帮助中心预览地址',
                component: ComponentCreator('/docs/v3.5/客服/服务端接入/帮助中心预览地址', '262'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/服务端接入/微信小游戏客服接入文档',
                component: ComponentCreator('/docs/v3.5/客服/服务端接入/微信小游戏客服接入文档', '305'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/服务端接入/抖音小游戏客服接入文档',
                component: ComponentCreator('/docs/v3.5/客服/服务端接入/抖音小游戏客服接入文档', '73e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/v3.5/客服/服务端接入/服务端回调接口', '1c4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/服务端接入/未读数量获取',
                component: ComponentCreator('/docs/v3.5/客服/服务端接入/未读数量获取', 'a3f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/设置浏览器消息通知权限',
                component: ComponentCreator('/docs/v3.5/客服/设置浏览器消息通知权限', 'efa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/避免客服掉线',
                component: ComponentCreator('/docs/v3.5/客服/避免客服掉线', '875'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/客服/鸿蒙客服/快速接入-原生版',
                component: ComponentCreator('/docs/v3.5/客服/鸿蒙客服/快速接入-原生版', 'dc8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/常见问题/',
                component: ComponentCreator('/docs/v3.5/常见问题/', '21a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/常见问题/分享相关',
                component: ComponentCreator('/docs/v3.5/常见问题/分享相关', 'd11'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/常见问题/域名切换_迁移',
                component: ComponentCreator('/docs/v3.5/常见问题/域名切换_迁移', '6e6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/常见问题/推送相关',
                component: ComponentCreator('/docs/v3.5/常见问题/推送相关', '512'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/常见问题/支付相关',
                component: ComponentCreator('/docs/v3.5/常见问题/支付相关', '073'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/常见问题/点击望舒菜单无反应的方案',
                component: ComponentCreator('/docs/v3.5/常见问题/点击望舒菜单无反应的方案', '41d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/常见问题/登录相关',
                component: ComponentCreator('/docs/v3.5/常见问题/登录相关', '0fc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/广告投放/Go SDK',
                component: ComponentCreator('/docs/v3.5/广告投放/Go SDK', 'f4a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/广告投放/功能介绍',
                component: ComponentCreator('/docs/v3.5/广告投放/功能介绍', '397'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/广告投放/巨量广告/Android接入',
                component: ComponentCreator('/docs/v3.5/广告投放/巨量广告/Android接入', '9f8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/广告投放/巨量广告/IOS接入',
                component: ComponentCreator('/docs/v3.5/广告投放/巨量广告/IOS接入', 'be7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/广告投放/巨量广告/Unity接入',
                component: ComponentCreator('/docs/v3.5/广告投放/巨量广告/Unity接入', '17c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/广告投放/巨量广告/功能介绍',
                component: ComponentCreator('/docs/v3.5/广告投放/巨量广告/功能介绍', 'c85'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/广告投放/广点通/Android',
                component: ComponentCreator('/docs/v3.5/广告投放/广点通/Android', 'c3a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/广告投放/广点通/iOS',
                component: ComponentCreator('/docs/v3.5/广告投放/广点通/iOS', '062'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/广告投放/广点通/功能介绍',
                component: ComponentCreator('/docs/v3.5/广告投放/广点通/功能介绍', 'd04'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/应用商店评分/Android 评分/快速接入',
                component: ComponentCreator('/docs/v3.5/应用商店评分/Android 评分/快速接入', 'b61'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/应用商店评分/iOS 评分/快速接入',
                component: ComponentCreator('/docs/v3.5/应用商店评分/iOS 评分/快速接入', 'f34'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/应用商店评分/Unity 评分/快速接入',
                component: ComponentCreator('/docs/v3.5/应用商店评分/Unity 评分/快速接入', '099'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/应用商店评分/功能介绍',
                component: ComponentCreator('/docs/v3.5/应用商店评分/功能介绍', '14c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/性能分析/GPM SDK接入/Android 接入/快速开始',
                component: ComponentCreator('/docs/v3.5/性能分析/GPM SDK接入/Android 接入/快速开始', '20b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/性能分析/GPM SDK接入/iOS 接入/快速开始',
                component: ComponentCreator('/docs/v3.5/性能分析/GPM SDK接入/iOS 接入/快速开始', '67b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/性能分析/UWA接入/Unity快速接入',
                component: ComponentCreator('/docs/v3.5/性能分析/UWA接入/Unity快速接入', '4ff'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/性能分析/功能描述',
                component: ComponentCreator('/docs/v3.5/性能分析/功能描述', 'f4e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/意见反馈/JavaScript 接入',
                component: ComponentCreator('/docs/v3.5/意见反馈/JavaScript 接入', '65d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/意见反馈/Unity 接入',
                component: ComponentCreator('/docs/v3.5/意见反馈/Unity 接入', 'c45'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/意见反馈/功能介绍',
                component: ComponentCreator('/docs/v3.5/意见反馈/功能介绍', '210'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/意见反馈/客户端接入/Android',
                component: ComponentCreator('/docs/v3.5/意见反馈/客户端接入/Android', '2df'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/意见反馈/客户端接入/iOS',
                component: ComponentCreator('/docs/v3.5/意见反馈/客户端接入/iOS', '973'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/意见反馈/服务端API',
                component: ComponentCreator('/docs/v3.5/意见反馈/服务端API', '47d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/排行榜/JavaScript 接入',
                component: ComponentCreator('/docs/v3.5/排行榜/JavaScript 接入', '034'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/排行榜/Unity 接入',
                component: ComponentCreator('/docs/v3.5/排行榜/Unity 接入', '6ef'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/排行榜/功能介绍',
                component: ComponentCreator('/docs/v3.5/排行榜/功能介绍', '194'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/排行榜/客户端接入/Android',
                component: ComponentCreator('/docs/v3.5/排行榜/客户端接入/Android', '94c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/排行榜/客户端接入/iOS',
                component: ComponentCreator('/docs/v3.5/排行榜/客户端接入/iOS', '481'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/排行榜/服务端接入/Go SDK',
                component: ComponentCreator('/docs/v3.5/排行榜/服务端接入/Go SDK', '3c7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/排行榜/服务端接入/小游戏开放接口 API',
                component: ComponentCreator('/docs/v3.5/排行榜/服务端接入/小游戏开放接口 API', '081'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/排行榜/服务端接入/服务端 API',
                component: ComponentCreator('/docs/v3.5/排行榜/服务端接入/服务端 API', '2e1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/排行榜/鸿蒙Unity接入',
                component: ComponentCreator('/docs/v3.5/排行榜/鸿蒙Unity接入', '8ba'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推广系统/功能介绍',
                component: ComponentCreator('/docs/v3.5/推广系统/功能介绍', '384'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推广系统/回调接入/服务端API',
                component: ComponentCreator('/docs/v3.5/推广系统/回调接入/服务端API', 'b03'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推广系统/回调接入/服务端回调接口',
                component: ComponentCreator('/docs/v3.5/推广系统/回调接入/服务端回调接口', '6cb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/Android Firebase 推送/快速接入',
                component: ComponentCreator('/docs/v3.5/推送/Android Firebase 推送/快速接入', 'e96'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/Android OPPO 推送/快速接入',
                component: ComponentCreator('/docs/v3.5/推送/Android OPPO 推送/快速接入', '42c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/Android Vivo 推送/快速接入',
                component: ComponentCreator('/docs/v3.5/推送/Android Vivo 推送/快速接入', '2de'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/Android 华为 推送/快速接入',
                component: ComponentCreator('/docs/v3.5/推送/Android 华为 推送/快速接入', '634'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/Android 小米 推送/快速接入',
                component: ComponentCreator('/docs/v3.5/推送/Android 小米 推送/快速接入', '39e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/Android 荣耀 推送/快速接入',
                component: ComponentCreator('/docs/v3.5/推送/Android 荣耀 推送/快速接入', '08f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/Android 魅族 推送/快速接入',
                component: ComponentCreator('/docs/v3.5/推送/Android 魅族 推送/快速接入', '0b5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/iOS 推送/快速接入',
                component: ComponentCreator('/docs/v3.5/推送/iOS 推送/快速接入', 'fb1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/Unity 接入/Android Unity 接入',
                component: ComponentCreator('/docs/v3.5/推送/Unity 接入/Android Unity 接入', 'b73'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/Unity 接入/iOS Unity 接入',
                component: ComponentCreator('/docs/v3.5/推送/Unity 接入/iOS Unity 接入', 'c66'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/功能介绍',
                component: ComponentCreator('/docs/v3.5/推送/功能介绍', '496'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/厂商推送限制参考',
                component: ComponentCreator('/docs/v3.5/推送/厂商推送限制参考', 'a59'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/服务端接入/Go SDK',
                component: ComponentCreator('/docs/v3.5/推送/服务端接入/Go SDK', '249'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/服务端接入/推送常见错误及解决方法',
                component: ComponentCreator('/docs/v3.5/推送/服务端接入/推送常见错误及解决方法', 'e1b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/服务端接入/服务端 API',
                component: ComponentCreator('/docs/v3.5/推送/服务端接入/服务端 API', 'bcc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/服务端接入/错误码定义',
                component: ComponentCreator('/docs/v3.5/推送/服务端接入/错误码定义', '88b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/鸿蒙 推送/快速接入-原生版',
                component: ComponentCreator('/docs/v3.5/推送/鸿蒙 推送/快速接入-原生版', '243'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/推送/鸿蒙 推送/快速接入-团结版',
                component: ComponentCreator('/docs/v3.5/推送/鸿蒙 推送/快速接入-团结版', '729'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/4399 小游戏 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/4399 小游戏 支付/快速接入', 'e91'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/4399H5小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/4399H5小游戏支付/快速接入', '09e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 007 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 007 支付/快速接入', '6a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 4399 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 4399 支付/快速接入', '043'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android Aptoide 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android Aptoide 支付/快速接入', '47a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android BiliBili 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android BiliBili 支付/快速接入', '95f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android Checkout 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android Checkout 支付/快速接入', '21a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android Google 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android Google 支付/快速接入', 'b4b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android mumu 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android mumu 支付/快速接入', '298'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android Mycard 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android Mycard 支付/快速接入', 'a12'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android OPPO 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android OPPO 支付/快速接入', '113'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android PayerMax 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android PayerMax 支付/快速接入', '64e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android Qoo 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android Qoo 支付/快速接入', '0fd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android Quick 支付',
                component: ComponentCreator('/docs/v3.5/支付/Android Quick 支付', 'c0a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android UniPin 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android UniPin 支付/快速接入', '9cd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android Upay 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android Upay 支付/快速接入', 'fe3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android Vivo 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android Vivo 支付/快速接入', '597'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android Waffo 支付',
                component: ComponentCreator('/docs/v3.5/支付/Android Waffo 支付', '07f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android Xsolla 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android Xsolla 支付/快速接入', '17f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 九游 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 九游 支付/快速接入', 'dff'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 京东 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 京东 支付/快速接入', '214'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 华为 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 华为 支付/快速接入', 'd63'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 小米 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 小米 支付/快速接入', '5df'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 应用宝直购 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 应用宝直购 支付/快速接入', '2fc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 应用宝道具 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 应用宝道具 支付/快速接入', '30c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 微信App 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 微信App 支付/快速接入', '411'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 微信H5 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 微信H5 支付/快速接入', '22a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 快手 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 快手 支付/快速接入', 'e8b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 抖音 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 抖音 支付/快速接入', 'b94'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 支付宝App 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 支付宝App 支付/快速接入', 'f6f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 支付宝H5 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 支付宝H5 支付/快速接入', '266'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 易宝 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 易宝 支付/快速接入', '839'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 望舒收银台支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 望舒收银台支付/快速接入', 'bfd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 栩腾支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 栩腾支付/快速接入', 'ab2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 海外 OPPO 支付',
                component: ComponentCreator('/docs/v3.5/支付/Android 海外 OPPO 支付', 'fa4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 百度 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 百度 支付/快速接入', '340'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 苏宁 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 苏宁 支付/快速接入', '05e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 荣耀 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 荣耀 支付/快速接入', '444'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 银联 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 银联 支付/快速接入', '634'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Android 雷电支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Android 雷电支付/快速接入', '8ac'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/gametok小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/gametok小游戏支付/快速接入', '76e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/oppo小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/oppo小游戏支付/快速接入', 'b0d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/QQ小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/QQ小游戏支付/快速接入', 'f0b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Quick H5支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Quick H5支付/快速接入', 'c6f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Steam 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Steam 支付/快速接入', '717'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/UC小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/UC小游戏支付/快速接入', '9db'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/Unity 接入/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/Unity 接入/快速接入', 'b22'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/vivo小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/vivo小游戏支付/快速接入', '3c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/vng小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/vng小游戏支付/快速接入', 'ed1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/京东小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/京东小游戏支付/快速接入', '2ee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/最右小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/最右小游戏支付/快速接入', '6f0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/功能介绍',
                component: ComponentCreator('/docs/v3.5/支付/功能介绍', '348'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/华为小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/华为小游戏支付/快速接入', '6c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/司墨007小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/司墨007小游戏支付/快速接入', 'b1e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/哈啰小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/哈啰小游戏支付/快速接入', '734'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/哔哩哔哩小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/哔哩哔哩小游戏支付/快速接入', '358'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/好游快爆小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/好游快爆小游戏支付/快速接入', '1a4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/小米小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/小米小游戏支付/快速接入', '99f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/微信小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/微信小游戏支付/快速接入', '1d7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/微信海外H5支付/业务介绍',
                component: ComponentCreator('/docs/v3.5/支付/微信海外H5支付/业务介绍', 'f29'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/微信海外H5支付/客户端接入-Android',
                component: ComponentCreator('/docs/v3.5/支付/微信海外H5支付/客户端接入-Android', 'c24'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/微信海外H5支付/望舒后台支付配置',
                component: ComponentCreator('/docs/v3.5/支付/微信海外H5支付/望舒后台支付配置', '1db'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/快手小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/快手小游戏支付/快速接入', '9be'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/抖音小游戏支付/IM2.0支付',
                component: ComponentCreator('/docs/v3.5/支付/抖音小游戏支付/IM2.0支付', 'e02'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/抖音小游戏支付/Untiy 快速接入',
                component: ComponentCreator('/docs/v3.5/支付/抖音小游戏支付/Untiy 快速接入', 'e9d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/抖音小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/抖音小游戏支付/快速接入', '3ed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/拉卡拉支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/拉卡拉支付/快速接入', '834'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/支付宝小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/支付宝小游戏支付/快速接入', '8df'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/服务端接入/国家编码 币种字典',
                component: ComponentCreator('/docs/v3.5/支付/服务端接入/国家编码 币种字典', '3fe'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/服务端接入/微信公众号 h5 微信客服卡片支付方式特别说明',
                component: ComponentCreator('/docs/v3.5/支付/服务端接入/微信公众号 h5 微信客服卡片支付方式特别说明', '0f6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/服务端接入/服务端 API',
                component: ComponentCreator('/docs/v3.5/支付/服务端接入/服务端 API', '16f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/v3.5/支付/服务端接入/服务端回调接口', '84b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/服务端接入/银联 h5 微信客服卡片支付方式特别说明',
                component: ComponentCreator('/docs/v3.5/支付/服务端接入/银联 h5 微信客服卡片支付方式特别说明', '01d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/服务端接入/错误码定义',
                component: ComponentCreator('/docs/v3.5/支付/服务端接入/错误码定义', '729'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/望舒H5 支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/望舒H5 支付/快速接入', 'c9d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/淘宝小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/淘宝小游戏支付/快速接入', 'a46'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/热面h5小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/热面h5小游戏支付/快速接入', '7c7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/爱奇艺小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/爱奇艺小游戏支付/快速接入', '338'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/爱微游小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/爱微游小游戏支付/快速接入', '8a2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/独角兽支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/独角兽支付/快速接入', 'f4e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/百度h5小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/百度h5小游戏支付/快速接入', 'd38'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/百度小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/百度小游戏支付/快速接入', '150'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/美团小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/美团小游戏支付/快速接入', 'a36'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/群黑小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/群黑小游戏支付/快速接入', 'cf0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/芒好玩小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/芒好玩小游戏支付/快速接入', '407'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/苹果支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/苹果支付/快速接入', '145'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/荣耀小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/荣耀小游戏支付/快速接入', '0f2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/迅雷小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/迅雷小游戏支付/快速接入', '106'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/银联支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/银联支付/快速接入', '9dc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/闪电玩小游戏支付/快速接入',
                component: ComponentCreator('/docs/v3.5/支付/闪电玩小游戏支付/快速接入', '82a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/鸿蒙支付/快速接入-原生版',
                component: ComponentCreator('/docs/v3.5/支付/鸿蒙支付/快速接入-原生版', 'a1a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/支付/鸿蒙支付/快速接入-团结版',
                component: ComponentCreator('/docs/v3.5/支付/鸿蒙支付/快速接入-团结版', '2c7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/Android 数据分析/快速接入',
                component: ComponentCreator('/docs/v3.5/数据分析/Android 数据分析/快速接入', '8a3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/iOS 数据分析/快速接入',
                component: ComponentCreator('/docs/v3.5/数据分析/iOS 数据分析/快速接入', '61e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/JavaScript 接入',
                component: ComponentCreator('/docs/v3.5/数据分析/JavaScript 接入', '27c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/Steam 接入/快速接入',
                component: ComponentCreator('/docs/v3.5/数据分析/Steam 接入/快速接入', '9dd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/Unity 数据分析/快速接入',
                component: ComponentCreator('/docs/v3.5/数据分析/Unity 数据分析/快速接入', '726'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/上报设备通讯录/Android',
                component: ComponentCreator('/docs/v3.5/数据分析/上报设备通讯录/Android', '7b8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/上报设备通讯录/iOS',
                component: ComponentCreator('/docs/v3.5/数据分析/上报设备通讯录/iOS', '43b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/其它数据分析接入方案建议/cp侧接入区服、角色数据分析',
                component: ComponentCreator('/docs/v3.5/数据分析/其它数据分析接入方案建议/cp侧接入区服、角色数据分析', '459'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/产品说明',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/产品说明', '285'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/准备工作/接入前的准备工作',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/准备工作/接入前的准备工作', 'c45'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/准备工作/标识用户',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/准备工作/标识用户', '872'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/准备工作/用户识别规则',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/准备工作/用户识别规则', 'afb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/其他功能/数据探索',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/其他功能/数据探索', '03d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/数据管理/事件填报',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/数据管理/事件填报', '904'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/数据管理/事件属性管理',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/数据管理/事件属性管理', 'b88'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/数据管理/事件管理',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/数据管理/事件管理', '45d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/数据管理/埋点管理',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/数据管理/埋点管理', 'd2b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/数据管理/用户属性管理',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/数据管理/用户属性管理', 'db3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/用户分析/属性分析',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/用户分析/属性分析', '72c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/用户分析/用户分群',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/用户分析/用户分群', '232'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/用户分析/用户标签',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/用户分析/用户标签', '1cb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/SQL 查询',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/SQL 查询', '310'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/事件分析',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/事件分析', 'c7b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/分布分析',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/分布分析', 'd33'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/漏斗分析',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/漏斗分析', '4ef'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/留存分析',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/留存分析', '621'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/路径分析',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/路径分析', '181'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/间隔分析',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/功能说明/行为分析/间隔分析', '02c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/快速使用指南/数据上报',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/快速使用指南/数据上报', 'ef8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/快速使用指南/用户属性和事件属性',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/快速使用指南/用户属性和事件属性', 'f1d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/快速使用指南/维度表属性',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/快速使用指南/维度表属性', 'c22'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/快速使用指南/项目理解',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/快速使用指南/项目理解', '1fa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/功能介绍/快速使用指南/预置事件和预置属性',
                component: ComponentCreator('/docs/v3.5/数据分析/功能介绍/快速使用指南/预置事件和预置属性', 'c43'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/数据上报实时查询校验',
                component: ComponentCreator('/docs/v3.5/数据分析/数据上报实时查询校验', 'db3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/服务端接入/Go SDK',
                component: ComponentCreator('/docs/v3.5/数据分析/服务端接入/Go SDK', 'd0c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/服务端接入/上报插件(LogBus)使用指南',
                component: ComponentCreator('/docs/v3.5/数据分析/服务端接入/上报插件(LogBus)使用指南', '071'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/服务端接入/元数据上报 API',
                component: ComponentCreator('/docs/v3.5/数据分析/服务端接入/元数据上报 API', 'd9d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/服务端接入/服务端 API',
                component: ComponentCreator('/docs/v3.5/数据分析/服务端接入/服务端 API', '542'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/获取设备已安装应用',
                component: ComponentCreator('/docs/v3.5/数据分析/获取设备已安装应用', '26e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/鸿蒙 数据分析/快速接入-原生版',
                component: ComponentCreator('/docs/v3.5/数据分析/鸿蒙 数据分析/快速接入-原生版', '088'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/数据分析/鸿蒙 数据分析/快速接入-团结版',
                component: ComponentCreator('/docs/v3.5/数据分析/鸿蒙 数据分析/快速接入-团结版', '81c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/智能机器人/服务端API',
                component: ComponentCreator('/docs/v3.5/智能机器人/服务端API', '124'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/望舒邮件管理/Android邮件API/快速开始',
                component: ComponentCreator('/docs/v3.5/望舒邮件管理/Android邮件API/快速开始', 'b37'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/望舒邮件管理/Android邮件UI（国内）/快速接入',
                component: ComponentCreator('/docs/v3.5/望舒邮件管理/Android邮件UI（国内）/快速接入', 'e39'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/望舒邮件管理/Android邮件UI（海外）/快速开始',
                component: ComponentCreator('/docs/v3.5/望舒邮件管理/Android邮件UI（海外）/快速开始', '920'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/望舒邮件管理/iOS邮件API/快速接入',
                component: ComponentCreator('/docs/v3.5/望舒邮件管理/iOS邮件API/快速接入', '6e2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/望舒邮件管理/iOS邮件UI（国内）/快速开始',
                component: ComponentCreator('/docs/v3.5/望舒邮件管理/iOS邮件UI（国内）/快速开始', '307'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/望舒邮件管理/iOS邮件UI（海外）/快速开始',
                component: ComponentCreator('/docs/v3.5/望舒邮件管理/iOS邮件UI（海外）/快速开始', 'cd1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/望舒邮件管理/Javascript/快速接入',
                component: ComponentCreator('/docs/v3.5/望舒邮件管理/Javascript/快速接入', '1d9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/望舒邮件管理/Unity邮件API/快速开始',
                component: ComponentCreator('/docs/v3.5/望舒邮件管理/Unity邮件API/快速开始', 'a6e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/望舒邮件管理/Unity邮件UI（国内）/快速开始',
                component: ComponentCreator('/docs/v3.5/望舒邮件管理/Unity邮件UI（国内）/快速开始', '3d4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/望舒邮件管理/Unity邮件UI（海外）/快速开始',
                component: ComponentCreator('/docs/v3.5/望舒邮件管理/Unity邮件UI（海外）/快速开始', '021'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/望舒邮件管理/功能介绍',
                component: ComponentCreator('/docs/v3.5/望舒邮件管理/功能介绍', '1df'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/望舒邮件管理/服务端接入/服务端API',
                component: ComponentCreator('/docs/v3.5/望舒邮件管理/服务端接入/服务端API', '2ee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/望舒邮件管理/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/v3.5/望舒邮件管理/服务端接入/服务端回调接口', '0a2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/法务配置/Steam 接入/快速接入',
                component: ComponentCreator('/docs/v3.5/法务配置/Steam 接入/快速接入', '406'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/法务配置/Unity 接入',
                component: ComponentCreator('/docs/v3.5/法务配置/Unity 接入', 'd26'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/法务配置/功能介绍',
                component: ComponentCreator('/docs/v3.5/法务配置/功能介绍', '37b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/法务配置/客户端接入/Android',
                component: ComponentCreator('/docs/v3.5/法务配置/客户端接入/Android', '845'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/法务配置/客户端接入/iOS',
                component: ComponentCreator('/docs/v3.5/法务配置/客户端接入/iOS', '6d1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/法务配置/服务端接入/服务端 API',
                component: ComponentCreator('/docs/v3.5/法务配置/服务端接入/服务端 API', '5e8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/法务配置/服务端接入/错误码定义',
                component: ComponentCreator('/docs/v3.5/法务配置/服务端接入/错误码定义', '316'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/法务配置/鸿蒙接入/快速接入-原生版',
                component: ComponentCreator('/docs/v3.5/法务配置/鸿蒙接入/快速接入-原生版', '02b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/法务配置/鸿蒙接入/快速接入-团结版',
                component: ComponentCreator('/docs/v3.5/法务配置/鸿蒙接入/快速接入-团结版', '148'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/Android公告API/快速开始',
                component: ComponentCreator('/docs/v3.5/游戏公告/Android公告API/快速开始', 'bda'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/Android公告UI（国内）/快速开始',
                component: ComponentCreator('/docs/v3.5/游戏公告/Android公告UI（国内）/快速开始', 'fbf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/Android公告UI（国外）/快速开始',
                component: ComponentCreator('/docs/v3.5/游戏公告/Android公告UI（国外）/快速开始', 'e5a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/iOS公告API/快速开始',
                component: ComponentCreator('/docs/v3.5/游戏公告/iOS公告API/快速开始', '82c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/iOS公告UI（国内）/快速开始',
                component: ComponentCreator('/docs/v3.5/游戏公告/iOS公告UI（国内）/快速开始', '127'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/iOS公告UI（国外）/快速开始',
                component: ComponentCreator('/docs/v3.5/游戏公告/iOS公告UI（国外）/快速开始', 'f76'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/oppo小游戏公告/快速接入',
                component: ComponentCreator('/docs/v3.5/游戏公告/oppo小游戏公告/快速接入', 'cc0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/Unity公告API/快速开始',
                component: ComponentCreator('/docs/v3.5/游戏公告/Unity公告API/快速开始', '034'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/Unity公告UI（国内）/快速开始',
                component: ComponentCreator('/docs/v3.5/游戏公告/Unity公告UI（国内）/快速开始', '296'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/Unity公告UI（国外）/快速接入',
                component: ComponentCreator('/docs/v3.5/游戏公告/Unity公告UI（国外）/快速接入', 'dff'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/vivo小游戏公告/快速接入',
                component: ComponentCreator('/docs/v3.5/游戏公告/vivo小游戏公告/快速接入', '28a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/功能介绍',
                component: ComponentCreator('/docs/v3.5/游戏公告/功能介绍', '703'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/华为小游戏公告/快速接入',
                component: ComponentCreator('/docs/v3.5/游戏公告/华为小游戏公告/快速接入', '4f7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/微信小游戏公告/快速接入',
                component: ComponentCreator('/docs/v3.5/游戏公告/微信小游戏公告/快速接入', 'bc8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/抖音小游戏公告/快速接入',
                component: ComponentCreator('/docs/v3.5/游戏公告/抖音小游戏公告/快速接入', 'd17'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/支付宝小游戏公告/快速接入',
                component: ComponentCreator('/docs/v3.5/游戏公告/支付宝小游戏公告/快速接入', 'f4a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/服务端API/',
                component: ComponentCreator('/docs/v3.5/游戏公告/服务端API/', '11b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/服务端回调接口',
                component: ComponentCreator('/docs/v3.5/游戏公告/服务端回调接口', 'ef3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/游戏公告/淘宝小游戏公告/快速接入',
                component: ComponentCreator('/docs/v3.5/游戏公告/淘宝小游戏公告/快速接入', 'dd3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/版本检查/JavaScript 接入',
                component: ComponentCreator('/docs/v3.5/版本检查/JavaScript 接入', '71b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/版本检查/Steam 接入/快速接入',
                component: ComponentCreator('/docs/v3.5/版本检查/Steam 接入/快速接入', '1d7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/版本检查/Unity 接入',
                component: ComponentCreator('/docs/v3.5/版本检查/Unity 接入', '5b7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/版本检查/功能介绍',
                component: ComponentCreator('/docs/v3.5/版本检查/功能介绍', '1d9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/版本检查/客户端接入/Android',
                component: ComponentCreator('/docs/v3.5/版本检查/客户端接入/Android', '30e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/版本检查/客户端接入/iOS',
                component: ComponentCreator('/docs/v3.5/版本检查/客户端接入/iOS', '1cb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/版本检查/服务端接入/服务端API',
                component: ComponentCreator('/docs/v3.5/版本检查/服务端接入/服务端API', 'c15'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/版本检查/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/v3.5/版本检查/服务端接入/服务端回调接口', '4b6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/版本检查/服务端接入/版本检查v2',
                component: ComponentCreator('/docs/v3.5/版本检查/服务端接入/版本检查v2', '7a3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/版本检查/服务端接入/错误码定义',
                component: ComponentCreator('/docs/v3.5/版本检查/服务端接入/错误码定义', 'a76'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/版本检查/鸿蒙接入/快速接入-原生版',
                component: ComponentCreator('/docs/v3.5/版本检查/鸿蒙接入/快速接入-原生版', 'f23'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/版本检查/鸿蒙接入/快速接入-团结版',
                component: ComponentCreator('/docs/v3.5/版本检查/鸿蒙接入/快速接入-团结版', '871'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/玩家意见反馈/Android意见反馈API/快速开始',
                component: ComponentCreator('/docs/v3.5/玩家意见反馈/Android意见反馈API/快速开始', '207'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/玩家意见反馈/Android意见反馈UI/快速接入',
                component: ComponentCreator('/docs/v3.5/玩家意见反馈/Android意见反馈UI/快速接入', '9c1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/玩家意见反馈/iOS意见反馈API/快速开始',
                component: ComponentCreator('/docs/v3.5/玩家意见反馈/iOS意见反馈API/快速开始', '5c5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/玩家意见反馈/iOS意见反馈UI/快速接入',
                component: ComponentCreator('/docs/v3.5/玩家意见反馈/iOS意见反馈UI/快速接入', '5b5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/玩家意见反馈/Javascript 接入/快速接入',
                component: ComponentCreator('/docs/v3.5/玩家意见反馈/Javascript 接入/快速接入', '01c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/玩家意见反馈/Unity意见反馈UI/快速接入',
                component: ComponentCreator('/docs/v3.5/玩家意见反馈/Unity意见反馈UI/快速接入', 'aee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/玩家意见反馈/功能介绍',
                component: ComponentCreator('/docs/v3.5/玩家意见反馈/功能介绍', '98f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/玩家意见反馈/服务端接入/服务端api',
                component: ComponentCreator('/docs/v3.5/玩家意见反馈/服务端接入/服务端api', '3fb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/玩家意见反馈/服务端接入/服务端回调',
                component: ComponentCreator('/docs/v3.5/玩家意见反馈/服务端接入/服务端回调', '843'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/4399H5小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/4399H5小游戏登录/快速接入', 'aa1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/4399小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/4399小游戏登录/快速接入', '40c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/Android 登录API/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/Android 登录API/快速接入', '246'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/Android 登录UI（国内）/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/Android 登录UI（国内）/快速接入', '95d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/Android 登录UI（国外）/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/Android 登录UI（国外）/快速接入', 'a2f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/gametok小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/gametok小游戏登录/快速接入', '862'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/iOS 登录API/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/iOS 登录API/快速接入', '2c3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/iOS 登录UI（国内）/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/iOS 登录UI（国内）/快速接入', '90f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/iOS 登录UI（国外）/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/iOS 登录UI（国外）/快速接入', '479'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/OPPO 小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/OPPO 小游戏登录/快速接入', 'b8e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/QQ 小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/QQ 小游戏登录/快速接入', 'e17'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/Quick H5登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/Quick H5登录/快速接入', '441'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/Steam 登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/Steam 登录/快速接入', '4ca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/UC小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/UC小游戏登录/快速接入', '96b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/Unity 登录API/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/Unity 登录API/快速接入', 'e34'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/Unity 登录UI（国内）/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/Unity 登录UI（国内）/快速接入', 'c1e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/Unity 登录UI（国外）/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/Unity 登录UI（国外）/快速接入', '1f4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/vivo 小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/vivo 小游戏登录/快速接入', 'a3f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/vng小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/vng小游戏登录/快速接入', 'af9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/京东小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/京东小游戏登录/快速接入', '260'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/最右小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/最右小游戏登录/快速接入', '462'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/功能介绍',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/功能介绍', 'c72'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/华为小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/华为小游戏登录/快速接入', '8db'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/司墨007小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/司墨007小游戏登录/快速接入', 'd7d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/哈啰小游戏/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/哈啰小游戏/快速接入', '81c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/哔哩哔哩小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/哔哩哔哩小游戏登录/快速接入', '579'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/好游快爆小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/好游快爆小游戏登录/快速接入', '0f6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/实名认证奖励道具/实名认证配置',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/实名认证奖励道具/实名认证配置', 'dc5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/实名认证奖励道具/服务端回调接口',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/实名认证奖励道具/服务端回调接口', '46d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/小米小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/小米小游戏登录/快速接入', '11d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/微信小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/微信小游戏登录/快速接入', '0a0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/微信小游戏登录/绑定、换绑手机',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/微信小游戏登录/绑定、换绑手机', '951'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/快手小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/快手小游戏登录/快速接入', '907'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/抖音小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/抖音小游戏登录/快速接入', '1cf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/支付宝小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/支付宝小游戏登录/快速接入', '4c5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/服务端接入/合规（实名）',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/服务端接入/合规（实名）', 'e23'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/服务端接入/服务端 API',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/服务端接入/服务端 API', 'b26'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/服务端接入/服务端回调接口', '982'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/望舒h5登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/望舒h5登录/快速接入', 'cf9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/海外H5登录/FaceBook H5登录配置说明',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/海外H5登录/FaceBook H5登录配置说明', 'cc9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/海外H5登录/Google H5登录配置说明',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/海外H5登录/Google H5登录配置说明', 'b2d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/海外H5登录/苹果H5登录配置说明',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/海外H5登录/苹果H5登录配置说明', 'c30'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/淘宝小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/淘宝小游戏登录/快速接入', '53a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/热面h5小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/热面h5小游戏登录/快速接入', '77a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/爱奇艺小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/爱奇艺小游戏登录/快速接入', 'b92'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/爱微游小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/爱微游小游戏登录/快速接入', 'a8f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/独角兽小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/独角兽小游戏登录/快速接入', '67d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/百度h5小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/百度h5小游戏登录/快速接入', 'fce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/百度小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/百度小游戏登录/快速接入', 'fc5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/美团小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/美团小游戏登录/快速接入', '8be'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/群黑小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/群黑小游戏登录/快速接入', '31f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/芒好玩小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/芒好玩小游戏登录/快速接入', '6e3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/荣耀小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/荣耀小游戏登录/快速接入', '55e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/迅雷小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/迅雷小游戏登录/快速接入', '7a2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/闪电玩小游戏登录/快速接入',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/闪电玩小游戏登录/快速接入', '354'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/鸿蒙登录/快速接入-原生版',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/鸿蒙登录/快速接入-原生版', '6aa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/登录（通行证）/鸿蒙登录/快速接入-团结版',
                component: ComponentCreator('/docs/v3.5/登录（通行证）/鸿蒙登录/快速接入-团结版', 'e1d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/社交/Android 社交/快速接入',
                component: ComponentCreator('/docs/v3.5/社交/Android 社交/快速接入', '6aa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/社交/iOS 社交/快速接入',
                component: ComponentCreator('/docs/v3.5/社交/iOS 社交/快速接入', '295'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/社交/JavaScript 接入',
                component: ComponentCreator('/docs/v3.5/社交/JavaScript 接入', 'e9c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/社交/Unity 接入/快速接入',
                component: ComponentCreator('/docs/v3.5/社交/Unity 接入/快速接入', '761'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/社交/功能介绍',
                component: ComponentCreator('/docs/v3.5/社交/功能介绍', '667'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/社交/服务端接入/Go SDK',
                component: ComponentCreator('/docs/v3.5/社交/服务端接入/Go SDK', 'a1e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/社交/服务端接入/服务端 API',
                component: ComponentCreator('/docs/v3.5/社交/服务端接入/服务端 API', 'd92'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/社交/鸿蒙社交/快速接入-团结版',
                component: ComponentCreator('/docs/v3.5/社交/鸿蒙社交/快速接入-团结版', 'd49'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/4399H5小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/4399H5小游戏广告/快速接入', '530'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/4399小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/4399小游戏广告/快速接入', 'd2e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/oppo小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/oppo小游戏广告/快速接入', '6df'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/QQ小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/QQ小游戏广告/快速接入', 'd97'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/UC小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/UC小游戏广告/快速接入', '7d1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/vivo小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/vivo小游戏广告/快速接入', '7d6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/京东小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/京东小游戏广告/快速接入', 'b2a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/最右小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/最右小游戏广告/快速接入', '50d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/功能介绍',
                component: ComponentCreator('/docs/v3.5/视频广告/功能介绍', '0d1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/华为小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/华为小游戏广告/快速接入', '215'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/哈啰小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/哈啰小游戏广告/快速接入', '8b1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/哔哩哔哩小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/哔哩哔哩小游戏广告/快速接入', '323'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/好游快爆小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/好游快爆小游戏广告/快速接入', '67a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/小米小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/小米小游戏广告/快速接入', 'bd0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/微信小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/微信小游戏广告/快速接入', '9b2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/快手小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/快手小游戏广告/快速接入', 'cab'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/抖音小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/抖音小游戏广告/快速接入', 'd1f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/支付宝小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/支付宝小游戏广告/快速接入', 'da1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/淘宝小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/淘宝小游戏广告/快速接入', 'cb2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/百度小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/百度小游戏广告/快速接入', 'cd8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/美团小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/美团小游戏广告/快速接入', '6f2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/群黑小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/群黑小游戏广告/快速接入', 'ef0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/芒好玩小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/芒好玩小游戏广告/快速接入', '1d3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/荣耀小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/荣耀小游戏广告/快速接入', '780'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/视频广告/迅雷小游戏广告/快速接入',
                component: ComponentCreator('/docs/v3.5/视频广告/迅雷小游戏广告/快速接入', '476'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/福利码/Android 接入/快速开始',
                component: ComponentCreator('/docs/v3.5/福利码/Android 接入/快速开始', '0dd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/福利码/iOS 接入/快速开始',
                component: ComponentCreator('/docs/v3.5/福利码/iOS 接入/快速开始', '27a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/福利码/Javascript 接入/快速接入',
                component: ComponentCreator('/docs/v3.5/福利码/Javascript 接入/快速接入', 'e25'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/福利码/Unity接入/快速开始',
                component: ComponentCreator('/docs/v3.5/福利码/Unity接入/快速开始', '008'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/福利码/功能介绍',
                component: ComponentCreator('/docs/v3.5/福利码/功能介绍', '9d8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/福利码/服务端API接口',
                component: ComponentCreator('/docs/v3.5/福利码/服务端API接口', 'a6d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/福利码/鸿蒙接入/快速接入-原生版',
                component: ComponentCreator('/docs/v3.5/福利码/鸿蒙接入/快速接入-原生版', '29e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/福利码/鸿蒙接入/快速接入-团结版',
                component: ComponentCreator('/docs/v3.5/福利码/鸿蒙接入/快速接入-团结版', 'de0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/订阅消息/微信/微信小游戏发送订阅消息',
                component: ComponentCreator('/docs/v3.5/订阅消息/微信/微信小游戏发送订阅消息', 'ddc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/订阅消息/微信/服务端回调',
                component: ComponentCreator('/docs/v3.5/订阅消息/微信/服务端回调', '025'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/设备信息/Android/快速接入',
                component: ComponentCreator('/docs/v3.5/设备信息/Android/快速接入', 'ef2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/设备信息/iOS/快速接入',
                component: ComponentCreator('/docs/v3.5/设备信息/iOS/快速接入', '8bf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/设备信息/JavaScript 接入',
                component: ComponentCreator('/docs/v3.5/设备信息/JavaScript 接入', '113'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/设备信息/Unity接入/快速开始',
                component: ComponentCreator('/docs/v3.5/设备信息/Unity接入/快速开始', '689'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/重要通知/支付合规调整',
                component: ComponentCreator('/docs/v3.5/重要通知/支付合规调整', '0da'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/重要通知/苹果隐私策略：PrivacyInfo.xcprivacy',
                component: ComponentCreator('/docs/v3.5/重要通知/苹果隐私策略：PrivacyInfo.xcprivacy', '729'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/防沉迷/Android 防沉迷/快速接入',
                component: ComponentCreator('/docs/v3.5/防沉迷/Android 防沉迷/快速接入', '993'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/防沉迷/iOS 防沉迷/快速接入',
                component: ComponentCreator('/docs/v3.5/防沉迷/iOS 防沉迷/快速接入', '7ee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/防沉迷/Unity 防沉迷/快速接入',
                component: ComponentCreator('/docs/v3.5/防沉迷/Unity 防沉迷/快速接入', '498'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/防沉迷/功能介绍',
                component: ComponentCreator('/docs/v3.5/防沉迷/功能介绍', 'be8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/防沉迷/常见问题',
                component: ComponentCreator('/docs/v3.5/防沉迷/常见问题', 'f82'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/防沉迷/鸿蒙 防沉迷/快速接入',
                component: ComponentCreator('/docs/v3.5/防沉迷/鸿蒙 防沉迷/快速接入', '017'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/v3.5/风控检测/Android/模拟器检测',
                component: ComponentCreator('/docs/v3.5/风控检测/Android/模拟器检测', 'ff0'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      },
      {
        path: '/docs',
        component: ComponentCreator('/docs', '64e'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '343'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '284'),
                exact: true
              },
              {
                path: '/docs/category/4399',
                component: ComponentCreator('/docs/category/4399', 'ef2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/4399-h5页游',
                component: ComponentCreator('/docs/category/4399-h5页游', '861'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/4399-小游戏',
                component: ComponentCreator('/docs/category/4399-小游戏', '712'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/apkpure',
                component: ComponentCreator('/docs/category/apkpure', '076'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/aptoide',
                component: ComponentCreator('/docs/category/aptoide', 'f91'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/bilibili',
                component: ComponentCreator('/docs/category/bilibili', '939'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/bilibili-1',
                component: ComponentCreator('/docs/category/bilibili-1', '170'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/facebook',
                component: ComponentCreator('/docs/category/facebook', 'd55'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/gametok',
                component: ComponentCreator('/docs/category/gametok', '985'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/google',
                component: ComponentCreator('/docs/category/google', '198'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/instagram',
                component: ComponentCreator('/docs/category/instagram', '027'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/line',
                component: ComponentCreator('/docs/category/line', '193'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/mumu模拟器',
                component: ComponentCreator('/docs/category/mumu模拟器', 'f44'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/oppo',
                component: ComponentCreator('/docs/category/oppo', '111'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/oppo-1',
                component: ComponentCreator('/docs/category/oppo-1', 'e67'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/oppo-2',
                component: ComponentCreator('/docs/category/oppo-2', '779'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/qoo',
                component: ComponentCreator('/docs/category/qoo', '57b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/qq',
                component: ComponentCreator('/docs/category/qq', '98c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/quick',
                component: ComponentCreator('/docs/category/quick', '6b9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/quick-1',
                component: ComponentCreator('/docs/category/quick-1', '1cd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/reddit',
                component: ComponentCreator('/docs/category/reddit', '4d3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/snapchat',
                component: ComponentCreator('/docs/category/snapchat', '059'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/steam',
                component: ComponentCreator('/docs/category/steam', 'b86'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/taptap',
                component: ComponentCreator('/docs/category/taptap', '73b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/tiktok',
                component: ComponentCreator('/docs/category/tiktok', '8a6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/uc',
                component: ComponentCreator('/docs/category/uc', '5ff'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/vivo',
                component: ComponentCreator('/docs/category/vivo', '91e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/vivo-1',
                component: ComponentCreator('/docs/category/vivo-1', '939'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/vk-id',
                component: ComponentCreator('/docs/category/vk-id', '5d5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/vng',
                component: ComponentCreator('/docs/category/vng', '2e1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/zalo',
                component: ComponentCreator('/docs/category/zalo', '850'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/九游',
                component: ComponentCreator('/docs/category/九游', '8e0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/京东',
                component: ComponentCreator('/docs/category/京东', '772'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/最右',
                component: ComponentCreator('/docs/category/最右', 'f20'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/华为',
                component: ComponentCreator('/docs/category/华为', 'b8f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/华为-1',
                component: ComponentCreator('/docs/category/华为-1', '31d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/华为-2',
                component: ComponentCreator('/docs/category/华为-2', 'd43'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/司墨-007',
                component: ComponentCreator('/docs/category/司墨-007', 'eb0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/哈啰',
                component: ComponentCreator('/docs/category/哈啰', 'dfd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/好游快爆',
                component: ComponentCreator('/docs/category/好游快爆', 'd69'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/小米',
                component: ComponentCreator('/docs/category/小米', 'f27'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/小米-1',
                component: ComponentCreator('/docs/category/小米-1', '9c5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/应用宝',
                component: ComponentCreator('/docs/category/应用宝', '360'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/微信',
                component: ComponentCreator('/docs/category/微信', '727'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/微信-1',
                component: ComponentCreator('/docs/category/微信-1', 'e26'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/快手',
                component: ComponentCreator('/docs/category/快手', '48f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/快手-1',
                component: ComponentCreator('/docs/category/快手-1', 'fff'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/抖音',
                component: ComponentCreator('/docs/category/抖音', 'efb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/抖音-1',
                component: ComponentCreator('/docs/category/抖音-1', '19f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/推荐流直出游戏能力',
                component: ComponentCreator('/docs/category/推荐流直出游戏能力', '328'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/支付宝',
                component: ComponentCreator('/docs/category/支付宝', '4c4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/支付宝-1',
                component: ComponentCreator('/docs/category/支付宝-1', 'f6e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/服务端',
                component: ComponentCreator('/docs/category/服务端', 'b80'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/栩腾',
                component: ComponentCreator('/docs/category/栩腾', '6a4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/淘宝',
                component: ComponentCreator('/docs/category/淘宝', '7be'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/爱奇艺',
                component: ComponentCreator('/docs/category/爱奇艺', 'c3f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/爱微游',
                component: ComponentCreator('/docs/category/爱微游', '94f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/独角兽',
                component: ComponentCreator('/docs/category/独角兽', 'adb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/百度',
                component: ComponentCreator('/docs/category/百度', '02a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/百度-h5页游',
                component: ComponentCreator('/docs/category/百度-h5页游', 'c72'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/百度-小游戏',
                component: ComponentCreator('/docs/category/百度-小游戏', '895'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/美团',
                component: ComponentCreator('/docs/category/美团', '26c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/群黑',
                component: ComponentCreator('/docs/category/群黑', '4bf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/芒好玩芒果-tv',
                component: ComponentCreator('/docs/category/芒好玩芒果-tv', 'b00'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/苹果',
                component: ComponentCreator('/docs/category/苹果', 'ff1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/荣耀',
                component: ComponentCreator('/docs/category/荣耀', 'b03'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/荣耀-1',
                component: ComponentCreator('/docs/category/荣耀-1', 'dc4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/迅雷',
                component: ComponentCreator('/docs/category/迅雷', 'dd5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/闪电玩',
                component: ComponentCreator('/docs/category/闪电玩', '93a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/雷电模拟器',
                component: ComponentCreator('/docs/category/雷电模拟器', 'fdb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/category/鸿蒙',
                component: ComponentCreator('/docs/category/鸿蒙', 'fcf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/changelog',
                component: ComponentCreator('/docs/changelog', '0d5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/changelog-harmonyos',
                component: ComponentCreator('/docs/changelog-harmonyos', 'fdc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/changelog-ios',
                component: ComponentCreator('/docs/changelog-ios', '831'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/changelog-javascript',
                component: ComponentCreator('/docs/changelog-javascript', 'b56'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/harmonyos-third-party',
                component: ComponentCreator('/docs/harmonyos-third-party', 'dc1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/公告管理',
                component: ComponentCreator('/docs/帮助中心/GM工具/公告管理', '6a7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/好友关系/好友关系配置',
                component: ComponentCreator('/docs/帮助中心/GM工具/好友关系/好友关系配置', '20b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/好友关系/用户聊天配置',
                component: ComponentCreator('/docs/帮助中心/GM工具/好友关系/用户聊天配置', '422'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/排行榜',
                component: ComponentCreator('/docs/帮助中心/GM工具/排行榜', '070'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/消息推送/小游戏订阅管理',
                component: ComponentCreator('/docs/帮助中心/GM工具/消息推送/小游戏订阅管理', 'a6d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/消息推送/小程序推送管理',
                component: ComponentCreator('/docs/帮助中心/GM工具/消息推送/小程序推送管理', 'a92'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/消息推送/应用推送管理',
                component: ComponentCreator('/docs/帮助中心/GM工具/消息推送/应用推送管理', '824'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/消息推送/微信客服自动推送',
                component: ComponentCreator('/docs/帮助中心/GM工具/消息推送/微信客服自动推送', '656'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/游戏内置邮件管理（通过回调发送）',
                component: ComponentCreator('/docs/帮助中心/GM工具/游戏内置邮件管理（通过回调发送）', 'b18'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/用户信息/用户账号查询',
                component: ComponentCreator('/docs/帮助中心/GM工具/用户信息/用户账号查询', '676'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/用户信息/运营操作日志',
                component: ComponentCreator('/docs/帮助中心/GM工具/用户信息/运营操作日志', '734'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/用户退款管理',
                component: ComponentCreator('/docs/帮助中心/GM工具/用户退款管理', '73e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/网页充值站点管理/充值站点基础配置',
                component: ComponentCreator('/docs/帮助中心/GM工具/网页充值站点管理/充值站点基础配置', 'ceb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/网页充值站点管理/商品管理',
                component: ComponentCreator('/docs/帮助中心/GM工具/网页充值站点管理/商品管理', '16f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/网页充值站点管理/福利活动配置',
                component: ComponentCreator('/docs/帮助中心/GM工具/网页充值站点管理/福利活动配置', '2ff'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/网页充值站点管理/订单管理',
                component: ComponentCreator('/docs/帮助中心/GM工具/网页充值站点管理/订单管理', '709'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/违规-防作弊/涉嫌风控账号',
                component: ComponentCreator('/docs/帮助中心/GM工具/违规-防作弊/涉嫌风控账号', 'd2c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/违规-防作弊/游戏行为违反处理',
                component: ComponentCreator('/docs/帮助中心/GM工具/违规-防作弊/游戏行为违反处理', '567'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/违规-防作弊/防作弊用户管理',
                component: ComponentCreator('/docs/帮助中心/GM工具/违规-防作弊/防作弊用户管理', 'a06'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/邮件管理(瑞雪)',
                component: ComponentCreator('/docs/帮助中心/GM工具/邮件管理(瑞雪)', '6bf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/GM工具/错误码多语言管理',
                component: ComponentCreator('/docs/帮助中心/GM工具/错误码多语言管理', '969'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/产品/产品管理',
                component: ComponentCreator('/docs/帮助中心/产品/产品管理', '218'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/产品/游戏道具管理',
                component: ComponentCreator('/docs/帮助中心/产品/游戏道具管理', '2d2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/产品/礼包管理',
                component: ComponentCreator('/docs/帮助中心/产品/礼包管理', 'df1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/产品/网页充值站点管理/充值站点基础配置',
                component: ComponentCreator('/docs/帮助中心/产品/网页充值站点管理/充值站点基础配置', '495'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/产品/网页充值站点管理/商品管理',
                component: ComponentCreator('/docs/帮助中心/产品/网页充值站点管理/商品管理', '324'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/产品/网页充值站点管理/福利活动配置',
                component: ComponentCreator('/docs/帮助中心/产品/网页充值站点管理/福利活动配置', '183'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/产品/网页充值站点管理/订单管理',
                component: ComponentCreator('/docs/帮助中心/产品/网页充值站点管理/订单管理', 'ac4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/产品/计费点信息管理',
                component: ComponentCreator('/docs/帮助中心/产品/计费点信息管理', 'f6f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/产品/项目参数配置',
                component: ComponentCreator('/docs/帮助中心/产品/项目参数配置', '928'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/产品/项目配置',
                component: ComponentCreator('/docs/帮助中心/产品/项目配置', 'b53'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/FaceBook/账户管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/FaceBook/账户管理', 'e97'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/OPPO营销/账户管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/OPPO营销/账户管理', '3a0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/VIVO营销/账户管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/VIVO营销/账户管理', '373'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/今日头条/广告管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/今日头条/广告管理', 'f94'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/今日头条/投放管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/今日头条/投放管理', 'abf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/今日头条/标题组管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/今日头条/标题组管理', '55a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/今日头条/账户管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/今日头条/账户管理', 'f07'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/准备工作',
                component: ComponentCreator('/docs/帮助中心/信息流广告/准备工作', '562'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/功能介绍',
                component: ComponentCreator('/docs/帮助中心/信息流广告/功能介绍', '98a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/华为商推/账户管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/华为商推/账户管理', 'cd7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/工具管理/媒体基础配置',
                component: ComponentCreator('/docs/帮助中心/信息流广告/工具管理/媒体基础配置', '0d7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/工具管理/应用管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/工具管理/应用管理', 'e56'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/工具管理/批投任务',
                component: ComponentCreator('/docs/帮助中心/信息流广告/工具管理/批投任务', '1d9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/工具管理/推广活动',
                component: ComponentCreator('/docs/帮助中心/信息流广告/工具管理/推广活动', '938'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/工具管理/文案管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/工具管理/文案管理', '9d5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/工具管理/映射管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/工具管理/映射管理', '776'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/工具管理/智能托管',
                component: ComponentCreator('/docs/帮助中心/信息流广告/工具管理/智能托管', '115'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/工具管理/标签管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/工具管理/标签管理', '575'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/工具管理/窗口期配置',
                component: ComponentCreator('/docs/帮助中心/信息流广告/工具管理/窗口期配置', 'fd3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/工具管理/素材库管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/工具管理/素材库管理', '646'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/工具管理/素材效果报表',
                component: ComponentCreator('/docs/帮助中心/信息流广告/工具管理/素材效果报表', '459'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/广点通/小游戏监控参数',
                component: ComponentCreator('/docs/帮助中心/信息流广告/广点通/小游戏监控参数', 'd26'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/广点通/广告管理V3',
                component: ComponentCreator('/docs/帮助中心/信息流广告/广点通/广告管理V3', '97f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/广点通/账户管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/广点通/账户管理', '528'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/快手/广告管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/快手/广告管理', '6da'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/快手/账户管理',
                component: ComponentCreator('/docs/帮助中心/信息流广告/快手/账户管理', '383'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/海外-adjust投放工具管理/adjust配置以及步骤',
                component: ComponentCreator('/docs/帮助中心/信息流广告/海外-adjust投放工具管理/adjust配置以及步骤', '9cc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/信息流广告/荣耀商推',
                component: ComponentCreator('/docs/帮助中心/信息流广告/荣耀商推', '7c0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/入门指南/基本概念',
                component: ComponentCreator('/docs/帮助中心/入门指南/基本概念', '9ee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/入门指南/快速接入',
                component: ComponentCreator('/docs/帮助中心/入门指南/快速接入', 'cc7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/入门指南/特性介绍',
                component: ComponentCreator('/docs/帮助中心/入门指南/特性介绍', 'a8b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/入门指南/认识瑞雪',
                component: ComponentCreator('/docs/帮助中心/入门指南/认识瑞雪', '22c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/协作工单/',
                component: ComponentCreator('/docs/帮助中心/协作工单/', 'a11'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/产品说明/',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/产品说明/', '565'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/准备工作/接入前准备工作',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/准备工作/接入前准备工作', '36a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/准备工作/标识用户',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/准备工作/标识用户', '0c7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/准备工作/用户识别规则',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/准备工作/用户识别规则', '49b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/其他功能/数据探索',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/其他功能/数据探索', 'c2d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/数据管理/事件填报',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/数据管理/事件填报', '396'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/数据管理/事件属性管理',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/数据管理/事件属性管理', '8cb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/数据管理/事件管理',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/数据管理/事件管理', 'f06'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/数据管理/埋点管理',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/数据管理/埋点管理', 'a7b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/数据管理/用户属性管理',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/数据管理/用户属性管理', '124'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/用户分析/属性分析',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/用户分析/属性分析', '7e6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/用户分析/用户分群',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/用户分析/用户分群', '9b1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/用户分析/用户标签',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/用户分析/用户标签', 'cd7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/行为分析/SQL查询',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/行为分析/SQL查询', '239'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/行为分析/事件分析',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/行为分析/事件分析', '7e0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/行为分析/分布分析',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/行为分析/分布分析', '5c5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/行为分析/漏斗分析',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/行为分析/漏斗分析', 'c85'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/行为分析/留存分析',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/行为分析/留存分析', '614'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/行为分析/路径分析',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/行为分析/路径分析', '89b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/功能说明/行为分析/间隔分析',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/功能说明/行为分析/间隔分析', '450'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/快速使用指南/数据上报',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/快速使用指南/数据上报', 'd6c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/快速使用指南/数据上报实时校验',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/快速使用指南/数据上报实时校验', 'd16'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/快速使用指南/用户属性和事件属性',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/快速使用指南/用户属性和事件属性', '978'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/快速使用指南/维度表属性',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/快速使用指南/维度表属性', '59a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/快速使用指南/项目理解',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/快速使用指南/项目理解', '201'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/大数据分析平台/快速使用指南/预置事件和预置属性',
                component: ComponentCreator('/docs/帮助中心/大数据分析平台/快速使用指南/预置事件和预置属性', 'd55'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服工作台/',
                component: ComponentCreator('/docs/帮助中心/客服工作台/', 'ac6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/客服临时公告',
                component: ComponentCreator('/docs/帮助中心/客服管理/客服临时公告', '942'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/客服工作台',
                component: ComponentCreator('/docs/帮助中心/客服管理/客服工作台', 'e90'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/客服接待状态',
                component: ComponentCreator('/docs/帮助中心/客服管理/客服接待状态', 'cf6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/客服自动回复配置',
                component: ComponentCreator('/docs/帮助中心/客服管理/客服自动回复配置', '875'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/帮助中心配置',
                component: ComponentCreator('/docs/帮助中心/客服管理/帮助中心配置', '280'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/意见反馈',
                component: ComponentCreator('/docs/帮助中心/客服管理/意见反馈', 'fd9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/数据统计/会话归类自动统计',
                component: ComponentCreator('/docs/帮助中心/客服管理/数据统计/会话归类自动统计', 'be9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/数据统计/会话记录',
                component: ComponentCreator('/docs/帮助中心/客服管理/数据统计/会话记录', '79e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/数据统计/客服操作日志',
                component: ComponentCreator('/docs/帮助中心/客服管理/数据统计/客服操作日志', '8f3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/数据统计/服务质量统计',
                component: ComponentCreator('/docs/帮助中心/客服管理/数据统计/服务质量统计', '3c1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/数据统计/机器人聊天记录',
                component: ComponentCreator('/docs/帮助中心/客服管理/数据统计/机器人聊天记录', 'c0d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/数据统计/评价与投诉',
                component: ComponentCreator('/docs/帮助中心/客服管理/数据统计/评价与投诉', 'b6c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/服务配置/人员配置',
                component: ComponentCreator('/docs/帮助中心/客服管理/服务配置/人员配置', '78f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/服务配置/分组设置',
                component: ComponentCreator('/docs/帮助中心/客服管理/服务配置/分组设置', '70b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/服务配置/常用话术',
                component: ComponentCreator('/docs/帮助中心/客服管理/服务配置/常用话术', '42f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/服务配置/服务面板配置',
                component: ComponentCreator('/docs/帮助中心/客服管理/服务配置/服务面板配置', '51a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/用户管理/找回账号',
                component: ComponentCreator('/docs/帮助中心/客服管理/用户管理/找回账号', '4c0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/用户管理/用户订单查询',
                component: ComponentCreator('/docs/帮助中心/客服管理/用户管理/用户订单查询', 'e88'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/用户管理/黑名单管理',
                component: ComponentCreator('/docs/帮助中心/客服管理/用户管理/黑名单管理', '29c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/客服管理/用户账户查询',
                component: ComponentCreator('/docs/帮助中心/客服管理/用户账户查询', '6a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/常见问题/',
                component: ComponentCreator('/docs/帮助中心/常见问题/', 'd5d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/常见问题/分享相关',
                component: ComponentCreator('/docs/帮助中心/常见问题/分享相关', 'bae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/常见问题/域名切换-迁移',
                component: ComponentCreator('/docs/帮助中心/常见问题/域名切换-迁移', '2fe'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/常见问题/推送相关',
                component: ComponentCreator('/docs/帮助中心/常见问题/推送相关', '655'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/常见问题/支付相关',
                component: ComponentCreator('/docs/帮助中心/常见问题/支付相关', '2a3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/常见问题/点击瑞雪菜单无反应的方案',
                component: ComponentCreator('/docs/帮助中心/常见问题/点击瑞雪菜单无反应的方案', '3e0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/常见问题/登录相关',
                component: ComponentCreator('/docs/帮助中心/常见问题/登录相关', '487'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/常见问题/项目数据',
                component: ComponentCreator('/docs/帮助中心/常见问题/项目数据', 'c7d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/应用实践/如何使用分享裂变？',
                component: ComponentCreator('/docs/帮助中心/应用实践/如何使用分享裂变？', '006'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/应用实践/如何使用子渠道分包？',
                component: ComponentCreator('/docs/帮助中心/应用实践/如何使用子渠道分包？', 'd86'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/应用实践/如何使用子渠道导量？',
                component: ComponentCreator('/docs/帮助中心/应用实践/如何使用子渠道导量？', 'c50'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/应用实践/如何使用子渠道投放？',
                component: ComponentCreator('/docs/帮助中心/应用实践/如何使用子渠道投放？', '727'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/应用实践/如何使用瑞雪客服？',
                component: ComponentCreator('/docs/帮助中心/应用实践/如何使用瑞雪客服？', '09e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/应用实践/如何分析素材归因？',
                component: ComponentCreator('/docs/帮助中心/应用实践/如何分析素材归因？', '368'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/应用实践/如何发布游戏公告？',
                component: ComponentCreator('/docs/帮助中心/应用实践/如何发布游戏公告？', '2d5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/意见反馈/产品意见反馈',
                component: ComponentCreator('/docs/帮助中心/意见反馈/产品意见反馈', '060'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/意见反馈/反馈类型配置',
                component: ComponentCreator('/docs/帮助中心/意见反馈/反馈类型配置', 'ea2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/意见反馈/玩家意见反馈',
                component: ComponentCreator('/docs/帮助中心/意见反馈/玩家意见反馈', '26d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/权限管理/成员管理',
                component: ComponentCreator('/docs/帮助中心/权限管理/成员管理', '8f2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/权限管理/角色管理',
                component: ComponentCreator('/docs/帮助中心/权限管理/角色管理', 'b44'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/法务-合规/合规信息管理/其他协议管理',
                component: ComponentCreator('/docs/帮助中心/法务-合规/合规信息管理/其他协议管理', '754'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/法务-合规/合规信息管理/服务条款配置',
                component: ComponentCreator('/docs/帮助中心/法务-合规/合规信息管理/服务条款配置', 'eab'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/法务-合规/合规信息管理/未成年保护设置',
                component: ComponentCreator('/docs/帮助中心/法务-合规/合规信息管理/未成年保护设置', 'f53'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/法务-合规/合规信息管理/节假日设置',
                component: ComponentCreator('/docs/帮助中心/法务-合规/合规信息管理/节假日设置', 'e66'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/法务-合规/合规信息管理/防沉迷配置',
                component: ComponentCreator('/docs/帮助中心/法务-合规/合规信息管理/防沉迷配置', '31f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/法务-合规/屏蔽词库',
                component: ComponentCreator('/docs/帮助中心/法务-合规/屏蔽词库', '0f4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/法务-合规/违规信息管理/客服会话审查',
                component: ComponentCreator('/docs/帮助中心/法务-合规/违规信息管理/客服会话审查', '56f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/法务-合规/违规信息管理/涉嫌风控账号',
                component: ComponentCreator('/docs/帮助中心/法务-合规/违规信息管理/涉嫌风控账号', '3d2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/活动管理/创建活动',
                component: ComponentCreator('/docs/帮助中心/活动管理/创建活动', 'c29'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/活动管理/已下线活动',
                component: ComponentCreator('/docs/帮助中心/活动管理/已下线活动', '13c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/活动管理/查看活动',
                component: ComponentCreator('/docs/帮助中心/活动管理/查看活动', '1ff'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/测试账号管理/',
                component: ComponentCreator('/docs/帮助中心/测试账号管理/', 'd0f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/渠道管理/发行渠道管理',
                component: ComponentCreator('/docs/帮助中心/渠道管理/发行渠道管理', '338'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/渠道管理/子渠道管理',
                component: ComponentCreator('/docs/帮助中心/渠道管理/子渠道管理', 'a9a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/渠道管理/安装包管理',
                component: ComponentCreator('/docs/帮助中心/渠道管理/安装包管理', '286'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/渠道管理/渠道包管理',
                component: ComponentCreator('/docs/帮助中心/渠道管理/渠道包管理', '893'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/渠道管理/渠道验证文件管理',
                component: ComponentCreator('/docs/帮助中心/渠道管理/渠道验证文件管理', 'ca7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/版本发布/安装包参数配置',
                component: ComponentCreator('/docs/帮助中心/版本发布/安装包参数配置', 'c1f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/版本发布/安装包管理',
                component: ComponentCreator('/docs/帮助中心/版本发布/安装包管理', 'b56'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/版本发布/服务端版本管理',
                component: ComponentCreator('/docs/帮助中心/版本发布/服务端版本管理', 'be6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/版本发布/模块管理V2',
                component: ComponentCreator('/docs/帮助中心/版本发布/模块管理V2', '4a4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/版本发布/版本发布日志',
                component: ComponentCreator('/docs/帮助中心/版本发布/版本发布日志', '733'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/版本发布/版本发布管理',
                component: ComponentCreator('/docs/帮助中心/版本发布/版本发布管理', '843'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/版本发布/版本测试管理',
                component: ComponentCreator('/docs/帮助中心/版本发布/版本测试管理', 'c93'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/版本发布/登录区域配置',
                component: ComponentCreator('/docs/帮助中心/版本发布/登录区域配置', '6d1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/版本发布/调试参数配置',
                component: ComponentCreator('/docs/帮助中心/版本发布/调试参数配置', '4f5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/瑞雪智能机器人/任务管理/',
                component: ComponentCreator('/docs/帮助中心/瑞雪智能机器人/任务管理/', '6b4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/瑞雪智能机器人/数据分析/会话日志',
                component: ComponentCreator('/docs/帮助中心/瑞雪智能机器人/数据分析/会话日志', 'b10'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/瑞雪智能机器人/智能运营',
                component: ComponentCreator('/docs/帮助中心/瑞雪智能机器人/智能运营', '784'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/瑞雪智能机器人/测试机器人',
                component: ComponentCreator('/docs/帮助中心/瑞雪智能机器人/测试机器人', '14e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/瑞雪智能机器人/知识库管理/知识库列表',
                component: ComponentCreator('/docs/帮助中心/瑞雪智能机器人/知识库管理/知识库列表', 'dee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/瑞雪智能机器人/知识库管理/知识点学习',
                component: ComponentCreator('/docs/帮助中心/瑞雪智能机器人/知识库管理/知识点学习', 'f42'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/瑞雪智能机器人/系统设置/机器人设置',
                component: ComponentCreator('/docs/帮助中心/瑞雪智能机器人/系统设置/机器人设置', '9e8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/瑞雪智能机器人/系统设置/高级设置',
                component: ComponentCreator('/docs/帮助中心/瑞雪智能机器人/系统设置/高级设置', 'f72'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/瑞雪智能机器人/词汇管理/实体管理',
                component: ComponentCreator('/docs/帮助中心/瑞雪智能机器人/词汇管理/实体管理', '797'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/瑞雪智能机器人/首页',
                component: ComponentCreator('/docs/帮助中心/瑞雪智能机器人/首页', '73b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/用户运营平台/分析工具/属性分析/',
                component: ComponentCreator('/docs/帮助中心/用户运营平台/分析工具/属性分析/', '710'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/用户运营平台/分析工具/属性分析/用户分层',
                component: ComponentCreator('/docs/帮助中心/用户运营平台/分析工具/属性分析/用户分层', '745'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/用户运营平台/分析工具/行为分析/SQL查询',
                component: ComponentCreator('/docs/帮助中心/用户运营平台/分析工具/行为分析/SQL查询', '465'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/用户运营平台/分析工具/行为分析/事件分析',
                component: ComponentCreator('/docs/帮助中心/用户运营平台/分析工具/行为分析/事件分析', '50b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/用户运营平台/数据管理/元数据管理/事件属性',
                component: ComponentCreator('/docs/帮助中心/用户运营平台/数据管理/元数据管理/事件属性', 'd0a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/用户运营平台/数据管理/元数据管理/元事件',
                component: ComponentCreator('/docs/帮助中心/用户运营平台/数据管理/元数据管理/元事件', '2a6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/用户运营平台/数据管理/元数据管理/用户属性',
                component: ComponentCreator('/docs/帮助中心/用户运营平台/数据管理/元数据管理/用户属性', '4dc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/用户运营平台/数据管理/外部表',
                component: ComponentCreator('/docs/帮助中心/用户运营平台/数据管理/外部表', 'b34'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/用户运营平台/智能运营/人群管理/人群包管理',
                component: ComponentCreator('/docs/帮助中心/用户运营平台/智能运营/人群管理/人群包管理', '50c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/用户运营平台/智能运营/人群管理/标签管理',
                component: ComponentCreator('/docs/帮助中心/用户运营平台/智能运营/人群管理/标签管理', 'e11'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/用户运营平台/智能运营/窗口运营/场景管理',
                component: ComponentCreator('/docs/帮助中心/用户运营平台/智能运营/窗口运营/场景管理', '7b8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/用户运营平台/智能运营/窗口运营/礼包管理',
                component: ComponentCreator('/docs/帮助中心/用户运营平台/智能运营/窗口运营/礼包管理', '59e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/用户运营平台/智能运营/窗口运营/窗口管理',
                component: ComponentCreator('/docs/帮助中心/用户运营平台/智能运营/窗口运营/窗口管理', '22f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/分享-广告调度管理',
                component: ComponentCreator('/docs/帮助中心/社交分享/分享-广告调度管理', 'bd8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/分享埋点配置',
                component: ComponentCreator('/docs/帮助中心/社交分享/分享埋点配置', '7b9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/分享归因流程',
                component: ComponentCreator('/docs/帮助中心/社交分享/分享归因流程', '4dd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/分享通路配置',
                component: ComponentCreator('/docs/帮助中心/社交分享/分享通路配置', '59e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/功能介绍',
                component: ComponentCreator('/docs/帮助中心/社交分享/功能介绍', '4ed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/广告管理工具',
                component: ComponentCreator('/docs/帮助中心/社交分享/广告管理工具', '650'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/消息通知设置',
                component: ComponentCreator('/docs/帮助中心/社交分享/消息通知设置', '064'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/APP原生分享/分享图片素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/APP原生分享/分享图片素材', '990'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/APP原生分享/分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/APP原生分享/分享策略', 'd4f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/APP原生分享/分享链接素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/APP原生分享/分享链接素材', '4e2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/Bilibili/小游戏分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/Bilibili/小游戏分享策略', '707'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/Bilibili/邀请好友素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/Bilibili/邀请好友素材', '633'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/FaceBook/分享图片素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/FaceBook/分享图片素材', '65c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/FaceBook/分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/FaceBook/分享策略', 'b42'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/FaceBook/分享链接素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/FaceBook/分享链接素材', 'c33'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/Line/分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/Line/分享策略', '1fa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/Line/分享链接素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/Line/分享链接素材', 'b6f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/Messenger/分享图片素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/Messenger/分享图片素材', '189'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/Messenger/分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/Messenger/分享策略', '340'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/Messenger/分享链接素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/Messenger/分享链接素材', 'c60'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/QQ/小游戏分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/QQ/小游戏分享策略', '3a6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/QQ/小游戏卡片配置',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/QQ/小游戏卡片配置', '7e5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/Reddit/分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/Reddit/分享策略', '196'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/Reddit/分享链接素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/Reddit/分享链接素材', '459'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/Snapchat/分享图片素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/Snapchat/分享图片素材', 'e12'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/Snapchat/分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/Snapchat/分享策略', '6f3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/TikTok/分享图片素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/TikTok/分享图片素材', '532'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/TikTok/分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/TikTok/分享策略', '734'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/Zalo/分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/Zalo/分享策略', '85b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/Zalo/分享链接素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/Zalo/分享链接素材', '2d6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/京东/小游戏分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/京东/小游戏分享策略', '79c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/京东/小游戏卡片配置',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/京东/小游戏卡片配置', '2ce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/华为/内嵌社区/分享图文素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/华为/内嵌社区/分享图文素材', '817'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/华为/内嵌社区/分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/华为/内嵌社区/分享策略', '43f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/华为/碰一碰/分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/华为/碰一碰/分享策略', '219'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/华为/碰一碰/分享链接素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/华为/碰一碰/分享链接素材', '7fa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/华为/高光时刻/分享视频素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/华为/高光时刻/分享视频素材', 'e9d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/华为/高光时刻/分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/华为/高光时刻/分享策略', '456'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/华为/高光时刻/分享链接素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/华为/高光时刻/分享链接素材', '9ca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/微信/分享图片素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/微信/分享图片素材', '57e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/微信/分享链接素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/微信/分享链接素材', '659'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/微信/小游戏分享卡片素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/微信/小游戏分享卡片素材', '881'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/微信/小游戏分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/微信/小游戏分享策略', 'c8a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/微信/小游戏海报配置',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/微信/小游戏海报配置', '93c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/微信/应用分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/微信/应用分享策略', '948'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/抖音/分享卡片素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/抖音/分享卡片素材', '4f0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/抖音/分享视频素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/抖音/分享视频素材', '92f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/抖音/小游戏分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/抖音/小游戏分享策略', '494'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/抖音/抖音后台获取分享配置模板',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/抖音/抖音后台获取分享配置模板', '054'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/支付宝/小游戏分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/支付宝/小游戏分享策略', '630'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/支付宝/邀请好友素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/支付宝/邀请好友素材', '9a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/百度/小游戏分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/百度/小游戏分享策略', '878'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/百度/邀请好友素材',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/百度/邀请好友素材', 'a2f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/美团/小游戏分享策略',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/美团/小游戏分享策略', 'ce7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/社交分享工具/美团/小游戏卡片配置',
                component: ComponentCreator('/docs/帮助中心/社交分享/社交分享工具/美团/小游戏卡片配置', '1a5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/落地页工具/抽奖活动管理',
                component: ComponentCreator('/docs/帮助中心/社交分享/落地页工具/抽奖活动管理', '478'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/落地页工具/落地页JSSDK使用说明',
                component: ComponentCreator('/docs/帮助中心/社交分享/落地页工具/落地页JSSDK使用说明', '5f2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/社交分享/落地页工具/落地页管理',
                component: ComponentCreator('/docs/帮助中心/社交分享/落地页工具/落地页管理', '81f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/任务管理/',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/任务管理/', '612'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/任务管理/我的任务',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/任务管理/我的任务', 'a5e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/任务管理/用户召回管理/全部召回用户',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/任务管理/用户召回管理/全部召回用户', '38a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/任务管理/用户召回管理/召回成功用户',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/任务管理/用户召回管理/召回成功用户', '33c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/任务管理/用户召回管理/已分配用户',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/任务管理/用户召回管理/已分配用户', '68e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/会员管理/会员权益管理',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/会员管理/会员权益管理', '5ac'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/会员管理/会员配置',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/会员管理/会员配置', 'b89'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/会员管理/成长值积分配置',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/会员管理/成长值积分配置', 'df3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/会员管理/积分兑换管理',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/会员管理/积分兑换管理', '61c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/内容管理/会员站配置',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/内容管理/会员站配置', '604'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/内容管理/游戏项目配置',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/内容管理/游戏项目配置', '193'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/用户管理/企业用户人群包管理',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/用户管理/企业用户人群包管理', 'f7e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/用户管理/企微客户管理',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/用户管理/企微客户管理', '838'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/用户管理/用户标签管理',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/用户管理/用户标签管理', '2e9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/用户管理/私域用户管理',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/用户管理/私域用户管理', '5cf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/用户触达管理/客户群发',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/用户触达管理/客户群发', 'b1a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/用户触达管理/短信发送--海外功能',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/用户触达管理/短信发送--海外功能', '854'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/用户触达管理/话术库管理',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/用户触达管理/话术库管理', 'c8e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/用户触达管理/邮件发送--海外功能',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/用户触达管理/邮件发送--海外功能', '39d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/系统设置/代开发小程序',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/系统设置/代开发小程序', 'b47'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/系统设置/员工活码管理',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/系统设置/员工活码管理', 'e0a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/运营工具管理/商城管理/充值管理',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/运营工具管理/商城管理/充值管理', '00e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/运营工具管理/商城管理/商品管理',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/运营工具管理/商城管理/商品管理', 'c5a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/运营工具管理/活动管理/活动配置',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/运营工具管理/活动管理/活动配置', 'fad'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/运营工具管理/活动管理/落地页配置',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/运营工具管理/活动管理/落地页配置', '03e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/运营工具管理/福利配置',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/运营工具管理/福利配置', '436'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/运营工具管理/订单管理',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/运营工具管理/订单管理', 'c38'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/私域运营平台/道具发放差错数据',
                component: ComponentCreator('/docs/帮助中心/私域运营平台/道具发放差错数据', '6a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/角色专区/商务',
                component: ComponentCreator('/docs/帮助中心/角色专区/商务', 'b0c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/角色专区/客服',
                component: ComponentCreator('/docs/帮助中心/角色专区/客服', 'b42'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/角色专区/投手',
                component: ComponentCreator('/docs/帮助中心/角色专区/投手', '7b9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/角色专区/法务',
                component: ComponentCreator('/docs/帮助中心/角色专区/法务', '70a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/角色专区/测试',
                component: ComponentCreator('/docs/帮助中心/角色专区/测试', '57b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/角色专区/研发',
                component: ComponentCreator('/docs/帮助中心/角色专区/研发', '05a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/角色专区/策划',
                component: ComponentCreator('/docs/帮助中心/角色专区/策划', '2a0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/角色专区/运维',
                component: ComponentCreator('/docs/帮助中心/角色专区/运维', '481'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/角色专区/运营',
                component: ComponentCreator('/docs/帮助中心/角色专区/运营', '911'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/内容类别管理',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/内容类别管理', '254'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/媒体应用与推广包关联',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/媒体应用与推广包关联', '921'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/抖音联运数据报表/流水分成报表',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/抖音联运数据报表/流水分成报表', '2c4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/抖音联运数据报表/监测链接管理',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/抖音联运数据报表/监测链接管理', '6f8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/机构管理',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/机构管理', 'd24'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/福利码管理/',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/福利码管理/', '404'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/福利码管理/活动管理',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/福利码管理/活动管理', 'b75'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/福利码管理/礼包管理',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/福利码管理/礼包管理', '76d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/系统日志/封禁解封日志',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/系统日志/封禁解封日志', '391'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/系统日志/道具发放日志',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/系统日志/道具发放日志', 'c8a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/落地页管理',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/落地页管理', '534'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/财务结算',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/财务结算', '5ed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/达人异常游戏设备统计',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/达人异常游戏设备统计', '9b6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/达人管理平台/达人管理',
                component: ComponentCreator('/docs/帮助中心/达人管理平台/达人管理', '082'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/运维资源管理/三方账号管理/分享账号管理',
                component: ComponentCreator('/docs/帮助中心/运维资源管理/三方账号管理/分享账号管理', '5cd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/运维资源管理/三方账号管理/支付账号管理',
                component: ComponentCreator('/docs/帮助中心/运维资源管理/三方账号管理/支付账号管理', '10a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/运维资源管理/三方账号管理/瑞雪收银台-国内',
                component: ComponentCreator('/docs/帮助中心/运维资源管理/三方账号管理/瑞雪收银台-国内', '410'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/运维资源管理/三方账号管理/瑞雪收银台-海外',
                component: ComponentCreator('/docs/帮助中心/运维资源管理/三方账号管理/瑞雪收银台-海外', '040'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/运维资源管理/三方账号管理/登录账号管理',
                component: ComponentCreator('/docs/帮助中心/运维资源管理/三方账号管理/登录账号管理', '187'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/运维资源管理/三方账号管理/红包账号管理',
                component: ComponentCreator('/docs/帮助中心/运维资源管理/三方账号管理/红包账号管理', '632'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/运维资源管理/推广域名管理',
                component: ComponentCreator('/docs/帮助中心/运维资源管理/推广域名管理', '348'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/运维资源管理/智能机器人管理',
                component: ComponentCreator('/docs/帮助中心/运维资源管理/智能机器人管理', '2ce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/运维资源管理/游戏站域名管理',
                component: ComponentCreator('/docs/帮助中心/运维资源管理/游戏站域名管理', 'f58'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/隐私政策/',
                component: ComponentCreator('/docs/帮助中心/隐私政策/', '49f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/帮助中心/项目部署/集群管理-部署',
                component: ComponentCreator('/docs/帮助中心/项目部署/集群管理-部署', 'ae6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/adjust-数据获取流程/',
                component: ComponentCreator('/docs/开发者文档/adjust-数据获取流程/', 'e7c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/adjust-数据获取流程/adjust-数据归因流程',
                component: ComponentCreator('/docs/开发者文档/adjust-数据获取流程/adjust-数据归因流程', 'b85'),
                exact: true
              },
              {
                path: '/docs/开发者文档/DNS/腾讯DNS/Unity接入',
                component: ComponentCreator('/docs/开发者文档/DNS/腾讯DNS/Unity接入', '3ba'),
                exact: true
              },
              {
                path: '/docs/开发者文档/DNS/腾讯DNS/原生接入',
                component: ComponentCreator('/docs/开发者文档/DNS/腾讯DNS/原生接入', 'ae6'),
                exact: true
              },
              {
                path: '/docs/开发者文档/DNS/腾讯DNS/微信小游戏接入',
                component: ComponentCreator('/docs/开发者文档/DNS/腾讯DNS/微信小游戏接入', '28e'),
                exact: true
              },
              {
                path: '/docs/开发者文档/DNS/阿里DNS/Unity接入',
                component: ComponentCreator('/docs/开发者文档/DNS/阿里DNS/Unity接入', '347'),
                exact: true
              },
              {
                path: '/docs/开发者文档/DNS/阿里DNS/原生接入',
                component: ComponentCreator('/docs/开发者文档/DNS/阿里DNS/原生接入', '3a1'),
                exact: true
              },
              {
                path: '/docs/开发者文档/openinstall/功能介绍',
                component: ComponentCreator('/docs/开发者文档/openinstall/功能介绍', '395'),
                exact: true
              },
              {
                path: '/docs/开发者文档/openinstall/原生接入',
                component: ComponentCreator('/docs/开发者文档/openinstall/原生接入', '5ac'),
                exact: true
              },
              {
                path: '/docs/开发者文档/openinstall/参数配置说明',
                component: ComponentCreator('/docs/开发者文档/openinstall/参数配置说明', '140'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/4399/H5页游/H5支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/4399/H5页游/H5支付配置说明', '16c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/4399/H5页游/H5登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/4399/H5页游/H5登录配置说明', '31c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/4399/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/4399/Unity-接入', '794'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/4399/客户端/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/4399/客户端/客户端接入', '504'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/4399/客户端/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/4399/客户端/支付配置说明', 'f09'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/4399/客户端/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/4399/客户端/登录配置说明', 'dfe'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/4399/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/4399/小游戏/小游戏支付配置', '0bd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/4399/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/4399/小游戏/小游戏登录配置', 'f41'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Adjust/常用功能',
                component: ComponentCreator('/docs/开发者文档/三方服务/Adjust/常用功能', '625'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/Adjust/快速开始',
                component: ComponentCreator('/docs/开发者文档/三方服务/Adjust/快速开始', '326'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/Adjust/防作弊签名',
                component: ComponentCreator('/docs/开发者文档/三方服务/Adjust/防作弊签名', '588'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/Adjust/附加功能',
                component: ComponentCreator('/docs/开发者文档/三方服务/Adjust/附加功能', '21b'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/APKPure/Android',
                component: ComponentCreator('/docs/开发者文档/三方服务/APKPure/Android', '894'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/APKPure/Unity',
                component: ComponentCreator('/docs/开发者文档/三方服务/APKPure/Unity', '09c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/APKPure/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/APKPure/支付配置说明', '449'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/APKPure/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/APKPure/登录配置说明', 'fba'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Aptoide/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Aptoide/Unity-接入', '14c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Aptoide/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Aptoide/客户端接入', 'aa6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Bilibili/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Bilibili/Unity-接入', 'e5c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Bilibili/客户端/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Bilibili/客户端/客户端接入', '507'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Bilibili/客户端/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Bilibili/客户端/支付配置说明', '332'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Bilibili/客户端/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Bilibili/客户端/登录配置说明', 'cde'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Bilibili/小游戏/小游戏支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Bilibili/小游戏/小游戏支付配置说明', 'bee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Bilibili/小游戏/小游戏登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Bilibili/小游戏/小游戏登录配置说明', '9f5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Checkout/Android',
                component: ComponentCreator('/docs/开发者文档/三方服务/Checkout/Android', '62c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/Checkout/Unity',
                component: ComponentCreator('/docs/开发者文档/三方服务/Checkout/Unity', 'e83'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/Checkout/配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Checkout/配置说明', 'd21'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/Facebook/H5登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Facebook/H5登录配置说明', '83e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Facebook/Unity',
                component: ComponentCreator('/docs/开发者文档/三方服务/Facebook/Unity', '6d9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Facebook/原生接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Facebook/原生接入', '692'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Facebook/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Facebook/登录配置说明', '930'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Firebase/分析',
                component: ComponentCreator('/docs/开发者文档/三方服务/Firebase/分析', '671'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/Firebase/崩溃统计',
                component: ComponentCreator('/docs/开发者文档/三方服务/Firebase/崩溃统计', '51e'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/Firebase/快速接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Firebase/快速接入', '382'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/Firebase/推送',
                component: ComponentCreator('/docs/开发者文档/三方服务/Firebase/推送', '165'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/GameTok/H5支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/GameTok/H5支付配置', '667'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/GameTok/H5登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/GameTok/H5登录配置', '3f4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Google/H5登陆配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Google/H5登陆配置说明', '31c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Google/Unity',
                component: ComponentCreator('/docs/开发者文档/三方服务/Google/Unity', '1dd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Google/原生接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Google/原生接入', '51b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Google/推送配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Google/推送配置说明', 'f72'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Google/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Google/支付配置说明', '07e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Google/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Google/登录配置说明', '869'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Google/订阅',
                component: ComponentCreator('/docs/开发者文档/三方服务/Google/订阅', '22f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Instagram/Unity',
                component: ComponentCreator('/docs/开发者文档/三方服务/Instagram/Unity', '590'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Instagram/原生接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Instagram/原生接入', '390'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Line/Unity',
                component: ComponentCreator('/docs/开发者文档/三方服务/Line/Unity', '4d5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Line/原生接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Line/原生接入', 'ede'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/mumu模拟器/Android',
                component: ComponentCreator('/docs/开发者文档/三方服务/mumu模拟器/Android', 'ac4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/mumu模拟器/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/mumu模拟器/支付配置说明', '966'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/mumu模拟器/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/mumu模拟器/登录配置说明', '758'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Oaid/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Oaid/Unity-接入', '1d2'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/Oaid/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Oaid/客户端接入', 'b8d'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/OPPO/Unity/快速接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/OPPO/Unity/快速接入', '937'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/OPPO/客户端/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/OPPO/客户端/客户端接入', '573'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/OPPO/客户端/推送配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/OPPO/客户端/推送配置说明', '721'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/OPPO/客户端/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/OPPO/客户端/支付配置说明', '86b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/OPPO/客户端/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/OPPO/客户端/登录配置说明', 'b01'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/OPPO/小游戏/小游戏数据行为上报配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/OPPO/小游戏/小游戏数据行为上报配置说明', 'b70'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/OPPO/小游戏/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/OPPO/小游戏/支付配置说明', 'b92'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/OPPO/小游戏/服务端接入/数据行为上报',
                component: ComponentCreator('/docs/开发者文档/三方服务/OPPO/小游戏/服务端接入/数据行为上报', 'b9a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/OPPO/小游戏/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/OPPO/小游戏/登录配置说明', 'fdb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/OPPO/海外OPPO接入/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/OPPO/海外OPPO接入/客户端接入', '0a7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/OPPO/海外OPPO接入/海外OPPO支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/OPPO/海外OPPO接入/海外OPPO支付配置说明', '5fb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Qoo/Android',
                component: ComponentCreator('/docs/开发者文档/三方服务/Qoo/Android', '504'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Qoo/Qoo支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Qoo/Qoo支付配置说明', '317'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Qoo/Qoo登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Qoo/Qoo登录配置说明', '721'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Qoo/Unity',
                component: ComponentCreator('/docs/开发者文档/三方服务/Qoo/Unity', '537'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/QQ/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/QQ/小游戏支付配置', 'ed0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/QQ/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/QQ/小游戏登录配置', 'b13'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Quick/H5小游戏/H5支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Quick/H5小游戏/H5支付配置说明', '6c9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Quick/H5小游戏/H5登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Quick/H5小游戏/H5登录配置说明', '06d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Quick/H5小游戏/支付快速接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Quick/H5小游戏/支付快速接入', '1a3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Quick/Unity/快速接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Quick/Unity/快速接入', '300'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Quick/客户端/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Quick/客户端/客户端接入', 'f09'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Quick/客户端/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Quick/客户端/支付配置说明', '386'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Quick/客户端/登陆配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/Quick/客户端/登陆配置说明', 'e8f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Reddit/Unity',
                component: ComponentCreator('/docs/开发者文档/三方服务/Reddit/Unity', 'd5b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Reddit/原生接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Reddit/原生接入', '4bd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/SnapChat/Unity',
                component: ComponentCreator('/docs/开发者文档/三方服务/SnapChat/Unity', 'cf7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/SnapChat/原生接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/SnapChat/原生接入', '770'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/steam/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/steam/支付配置说明', '064'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/steam/登陆配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/steam/登陆配置说明', '1b3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/TapTap/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/TapTap/Unity-接入', 'f8b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/TapTap/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/TapTap/客户端接入', '0d4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/TapTap/配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/TapTap/配置说明', 'ff3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/TikTok/Unity',
                component: ComponentCreator('/docs/开发者文档/三方服务/TikTok/Unity', '431'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/TikTok/原生接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/TikTok/原生接入', 'da3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/TopOn/初始化',
                component: ComponentCreator('/docs/开发者文档/三方服务/TopOn/初始化', '0aa'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/TopOn/原生广告',
                component: ComponentCreator('/docs/开发者文档/三方服务/TopOn/原生广告', '487'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/TopOn/开屏广告',
                component: ComponentCreator('/docs/开发者文档/三方服务/TopOn/开屏广告', '4d0'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/TopOn/插屏广告',
                component: ComponentCreator('/docs/开发者文档/三方服务/TopOn/插屏广告', 'bb2'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/TopOn/横幅广告',
                component: ComponentCreator('/docs/开发者文档/三方服务/TopOn/横幅广告', '245'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/TopOn/激励视频',
                component: ComponentCreator('/docs/开发者文档/三方服务/TopOn/激励视频', '63f'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/TopOn/隐私合规',
                component: ComponentCreator('/docs/开发者文档/三方服务/TopOn/隐私合规', 'f51'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/UC浏览器/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/UC浏览器/小游戏/小游戏支付配置', 'dd9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/UC浏览器/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/UC浏览器/小游戏/小游戏登录配置', 'f4e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/UTG支付/UTG-支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/UTG支付/UTG-支付配置', 'c01'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/vivo/Unity/快速接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/vivo/Unity/快速接入', 'eec'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/vivo/客户端/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/vivo/客户端/客户端接入', '90c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/vivo/客户端/推送配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/vivo/客户端/推送配置说明', '4e5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/vivo/客户端/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/vivo/客户端/支付配置说明', 'e90'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/vivo/客户端/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/vivo/客户端/登录配置说明', '6c4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/vivo/小游戏/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/vivo/小游戏/支付配置说明', 'a31'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/vivo/小游戏/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/vivo/小游戏/登录配置说明', '7a3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/VK-ID/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/VK-ID/客户端接入', '3e0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/VK-ID/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/VK-ID/登录配置说明', 'b3e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/VNG小游戏/服务端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/VNG小游戏/服务端接入', '90c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/VNG小游戏/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/VNG小游戏/登录配置说明', '0b9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/waffo支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/waffo支付配置', '330'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/Zalo/Unity',
                component: ComponentCreator('/docs/开发者文档/三方服务/Zalo/Unity', '618'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/Zalo/原生接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/Zalo/原生接入', '89a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/一键登录/阿里一键登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/一键登录/阿里一键登录配置', '9c1'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/七七手游/H5小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/七七手游/H5小游戏支付配置', '2fc'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/七七手游/H5小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/七七手游/H5小游戏登录配置', '923'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/七七手游/服务端对接/开放平台对接',
                component: ComponentCreator('/docs/开发者文档/三方服务/七七手游/服务端对接/开放平台对接', 'd4b'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/三方接入说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/三方接入说明', '498'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/三方错误码说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/三方错误码说明', '5ad'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/中宣部防沉迷参数获取',
                component: ComponentCreator('/docs/开发者文档/三方服务/中宣部防沉迷参数获取', '3bf'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/九游/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/九游/Unity-接入', '542'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/九游/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/九游/客户端接入', '5d9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/九游/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/九游/支付配置说明', '7c4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/九游/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/九游/登录配置说明', 'c76'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/京东/任务完成通知接口',
                component: ComponentCreator('/docs/开发者文档/三方服务/京东/任务完成通知接口', 'b04'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/京东/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/京东/小游戏支付配置', 'e93'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/京东/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/京东/小游戏登录配置', 'f5f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/人群包/服务端接口',
                component: ComponentCreator('/docs/开发者文档/三方服务/人群包/服务端接口', '7a5'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/最右/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/最右/小游戏支付配置', 'c91'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/最右/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/最右/小游戏登录配置', 'b93'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/最右/服务端对接/开放平台对接',
                component: ComponentCreator('/docs/开发者文档/三方服务/最右/服务端对接/开放平台对接', 'd8c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/Unity/快速接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/Unity/快速接入', '377'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/内嵌社区/快速接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/内嵌社区/快速接入', '7e6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/华为小艺/小艺事件配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/华为小艺/小艺事件配置', '61a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/华为小艺/小艺接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/华为小艺/小艺接入', 'e76'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/国内客户端/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/国内客户端/客户端接入', 'd03'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/国内客户端/推送配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/国内客户端/推送配置说明', '435'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/国内客户端/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/国内客户端/支付配置说明', '037'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/国内客户端/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/国内客户端/登录配置说明', 'b91'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/国内小游戏/小游戏支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/国内小游戏/小游戏支付配置说明', 'd46'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/国内小游戏/小游戏登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/国内小游戏/小游戏登录配置说明', 'fbe'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/海外华为客户端/华为FaceBook登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/海外华为客户端/华为FaceBook登录配置', '69c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/海外华为客户端/华为Google登录',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/海外华为客户端/华为Google登录', 'e4d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/海外华为客户端/华为登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/海外华为客户端/华为登录配置说明', 'a2b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/海外华为客户端/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/海外华为客户端/客户端接入', '06b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/海外华为客户端/推送配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/海外华为客户端/推送配置说明', 'beb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/海外华为客户端/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/海外华为客户端/支付配置说明', 'bfc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/海外小游戏/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/海外小游戏/支付配置说明', '706'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/海外小游戏/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/海外小游戏/登录配置说明', '6a9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/游戏近场快传-鸿蒙/快速接入-原生版',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/游戏近场快传-鸿蒙/快速接入-原生版', 'c37'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/游戏近场快传-鸿蒙/快速接入-团结版',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/游戏近场快传-鸿蒙/快速接入-团结版', '3d4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/华为/游戏道具商城',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/游戏道具商城', 'd87'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/华为/高光时刻/快速接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/华为/高光时刻/快速接入', '7b2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/司墨/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/司墨/客户端接入', 'f20'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/司墨/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/司墨/支付配置说明', 'ce1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/司墨/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/司墨/登录配置说明', 'd77'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/哈啰/哈啰小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/哈啰/哈啰小游戏/小游戏支付配置', '2d6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/哈啰/哈啰小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/哈啰/哈啰小游戏/小游戏登录配置', 'fe7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/好游快爆/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/好游快爆/小游戏支付配置', 'a2d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/好游快爆/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/好游快爆/小游戏登录配置', '7a8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/小米/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/小米/Unity-接入', '083'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/小米/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/小米/客户端接入', '20b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/小米/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/小米/小游戏/小游戏支付配置', '0fc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/小米/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/小米/小游戏/小游戏登录配置', 'cd4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/小米/推送配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/小米/推送配置说明', '58a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/小米/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/小米/支付配置说明', 'cfd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/小米/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/小米/登录配置说明', '983'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/巨量广告/Android接入/快速接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/巨量广告/Android接入/快速接入', 'b50'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/巨量广告/iOS接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/巨量广告/iOS接入', '3ae'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/巨量广告/Unity接入/快速接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/巨量广告/Unity接入/快速接入', 'c44'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/应用宝/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/应用宝/Unity-接入', 'f1e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/应用宝/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/应用宝/客户端接入', '660'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/应用宝/游戏币支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/应用宝/游戏币支付配置说明', 'be1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/应用宝/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/应用宝/登录配置说明', '9eb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/应用宝/直购模式支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/应用宝/直购模式支付配置说明', '2ff'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/微信/Unity-接入/快速接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/微信/Unity-接入/快速接入', 'd49'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/微信/客户端接入/原生接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/微信/客户端接入/原生接入', '249'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/微信/客户端接入/鸿蒙原生',
                component: ComponentCreator('/docs/开发者文档/三方服务/微信/客户端接入/鸿蒙原生', 'c96'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/微信/客户端接入/鸿蒙团结',
                component: ComponentCreator('/docs/开发者文档/三方服务/微信/客户端接入/鸿蒙团结', 'f51'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/微信/小游戏配置/公众号支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/微信/小游戏配置/公众号支付配置说明', '074'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/微信/小游戏配置/小游戏登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/微信/小游戏配置/小游戏登录配置说明', '983'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/微信/小游戏配置/小游戏跳转支付',
                component: ComponentCreator('/docs/开发者文档/三方服务/微信/小游戏配置/小游戏跳转支付', '50c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/微信/小游戏配置/直购模式支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/微信/小游戏配置/直购模式支付配置说明', '206'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/微信/小游戏配置/虚拟支付2-0支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/微信/小游戏配置/虚拟支付2-0支付配置说明', '2ed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/微信/微信配置/微信-H5-支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/微信/微信配置/微信-H5-支付配置说明', '395'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/微信/微信配置/微信App支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/微信/微信配置/微信App支付配置说明', '299'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/微信/微信配置/微信登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/微信/微信配置/微信登录配置说明', '12d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/快手/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/快手/Unity-接入', '300'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/快手/客户端/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/快手/客户端/客户端接入', '26e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/快手/客户端/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/快手/客户端/支付配置说明', 'c0b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/快手/客户端/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/快手/客户端/登录配置说明', 'd79'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/快手/小游戏/小游戏支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/快手/小游戏/小游戏支付配置说明', '807'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/快手/小游戏/小游戏登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/快手/小游戏/小游戏登录配置说明', '7fc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/抖音/Unity/快速接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/抖音/Unity/快速接入', '61e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/抖音/客户端/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/抖音/客户端/客户端接入', 'e72'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/抖音/客户端/抖音支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/抖音/客户端/抖音支付配置', '5c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/抖音/客户端/抖音登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/抖音/客户端/抖音登录配置', '13d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/抖音/小游戏/小游戏付费礼包配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/抖音/小游戏/小游戏付费礼包配置', 'a30'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/抖音/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/抖音/小游戏/小游戏支付配置', '504'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/抖音/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/抖音/小游戏/小游戏登录配置', 'bf9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/抖音/小游戏/推荐流直出游戏能力/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/抖音/小游戏/推荐流直出游戏能力/客户端接入', '2eb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/抖音/小游戏/推荐流直出游戏能力/推荐流直出配置文档',
                component: ComponentCreator('/docs/开发者文档/三方服务/抖音/小游戏/推荐流直出游戏能力/推荐流直出配置文档', '17b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/抖音/小游戏/推荐流直出游戏能力/服务端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/抖音/小游戏/推荐流直出游戏能力/服务端接入', '0b3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/抖音/小游戏/服务端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/抖音/小游戏/服务端接入', '13d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/抖音/小游戏/游戏站配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/抖音/小游戏/游戏站配置', 'e0c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/Alipay/Android',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/Alipay/Android', '0e1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/Alipay/app支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/Alipay/app支付配置说明', 'ac7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/Alipay/Unity',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/Alipay/Unity', 'e25'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/AlipayH5/Android',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/AlipayH5/Android', '01e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/AlipayH5/h5支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/AlipayH5/h5支付配置说明', 'ba0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/AlipayH5/Unity',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/AlipayH5/Unity', '4b8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/实名认证/SDK-接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/实名认证/SDK-接入', '28e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/实名认证/配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/实名认证/配置说明', 'c50'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/小游戏/小游戏IOS虚拟币支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/小游戏/小游戏IOS虚拟币支付配置', '6d3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/小游戏/小游戏安卓-鸿蒙支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/小游戏/小游戏安卓-鸿蒙支付配置', '0b3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/小游戏/小游戏登录配置', '512'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/小游戏/服务端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/小游戏/服务端接入', '172'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/小游戏/游戏圈礼包',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/小游戏/游戏圈礼包', 'dae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/支付宝/小游戏/订阅消息模板ID获取',
                component: ComponentCreator('/docs/开发者文档/三方服务/支付宝/小游戏/订阅消息模板ID获取', 'd72'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/易宝支付/Unity接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/易宝支付/Unity接入', 'c18'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/易宝支付/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/易宝支付/客户端接入', '163'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/智齿/服务端接口',
                component: ComponentCreator('/docs/开发者文档/三方服务/智齿/服务端接口', '972'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/服务商内容安全/腾讯云配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/服务商内容安全/腾讯云配置', '3e3'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/服务商内容安全/阿里云配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/服务商内容安全/阿里云配置', '152'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/栩腾/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/栩腾/客户端接入', 'a07'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/淘宝/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/淘宝/小游戏支付配置', 'bec'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/淘宝/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/淘宝/小游戏登录配置', '02b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/渠道矩阵',
                component: ComponentCreator('/docs/开发者文档/三方服务/渠道矩阵', '570'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/爱奇艺/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/爱奇艺/小游戏支付配置', 'aef'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/爱奇艺/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/爱奇艺/小游戏登录配置', '824'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/爱微游/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/爱微游/小游戏支付配置', '6ce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/爱微游/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/爱微游/小游戏登录配置', 'ced'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/独角兽/服务端接口',
                component: ComponentCreator('/docs/开发者文档/三方服务/独角兽/服务端接口', '4c0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/百度/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/百度/Unity-接入', 'ac8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/百度/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/百度/客户端接入', 'ea5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/百度/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/百度/小游戏/小游戏支付配置', '3e2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/百度/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/百度/小游戏/小游戏登录配置', '99f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/百度/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/百度/支付配置说明', '5ab'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/百度/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/百度/登录配置说明', '91a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/百度/百度H5小游戏/H5支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/百度/百度H5小游戏/H5支付配置', '0df'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/百度/百度H5小游戏/H5登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/百度/百度H5小游戏/H5登录配置', 'c63'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/私域/服务端接口',
                component: ComponentCreator('/docs/开发者文档/三方服务/私域/服务端接口', '607'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/美团/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/美团/小游戏支付配置', '54a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/美团/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/美团/小游戏登录配置', '444'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/美团/服务端接口',
                component: ComponentCreator('/docs/开发者文档/三方服务/美团/服务端接口', '48b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/群黑小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/群黑小游戏/小游戏支付配置', '59f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/群黑小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/群黑小游戏/小游戏登录配置', '8eb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/群黑小游戏/服务端对接/开放平台对接',
                component: ComponentCreator('/docs/开发者文档/三方服务/群黑小游戏/服务端对接/开放平台对接', '156'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/芒果小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/芒果小游戏/小游戏支付配置', '0c5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/芒果小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/芒果小游戏/小游戏登录配置', '36e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/苹果/ASA',
                component: ComponentCreator('/docs/开发者文档/三方服务/苹果/ASA', '9dd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/苹果/Game-Center',
                component: ComponentCreator('/docs/开发者文档/三方服务/苹果/Game-Center', 'c65'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/苹果/H5登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/苹果/H5登录配置说明', '992'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/苹果/推送配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/苹果/推送配置说明', '413'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/苹果/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/苹果/支付配置说明', 'a8b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/苹果/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/苹果/登录配置说明', '1ac'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/苹果/订阅',
                component: ComponentCreator('/docs/开发者文档/三方服务/苹果/订阅', 'bef'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/荣耀/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/荣耀/Unity-接入', '33b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/荣耀/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/荣耀/客户端接入', 'b99'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/荣耀/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/荣耀/小游戏/小游戏支付配置', 'c1a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/荣耀/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/荣耀/小游戏/小游戏登录配置', '352'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/荣耀/推送配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/荣耀/推送配置说明', 'cc1'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/荣耀/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/荣耀/支付配置说明', '8d2'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/荣耀/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/荣耀/登录配置说明', 'a5d'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/迅雷/小游戏/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/迅雷/小游戏/小游戏支付配置', 'c0b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/迅雷/小游戏/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/迅雷/小游戏/小游戏登录配置', '6a5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/迅雷/小游戏/服务端对接/开放平台对接',
                component: ComponentCreator('/docs/开发者文档/三方服务/迅雷/小游戏/服务端对接/开放平台对接', 'c4f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/银联/配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/银联/配置说明', 'bef'),
                exact: true
              },
              {
                path: '/docs/开发者文档/三方服务/闪电玩/小游戏支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/闪电玩/小游戏支付配置', '45e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/闪电玩/小游戏登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/闪电玩/小游戏登录配置', '782'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/雷电模拟器/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/雷电模拟器/Unity-接入', '1cf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/雷电模拟器/客户端接入',
                component: ComponentCreator('/docs/开发者文档/三方服务/雷电模拟器/客户端接入', 'aac'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/雷电模拟器/支付配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/雷电模拟器/支付配置说明', '28f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/雷电模拟器/登录配置说明',
                component: ComponentCreator('/docs/开发者文档/三方服务/雷电模拟器/登录配置说明', '6ef'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/鸿蒙/鸿蒙应用微信登录',
                component: ComponentCreator('/docs/开发者文档/三方服务/鸿蒙/鸿蒙应用微信登录', '3a1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/鸿蒙/鸿蒙推送配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/鸿蒙/鸿蒙推送配置', '513'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/鸿蒙/鸿蒙支付配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/鸿蒙/鸿蒙支付配置', '500'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/三方服务/鸿蒙/鸿蒙登录配置',
                component: ComponentCreator('/docs/开发者文档/三方服务/鸿蒙/鸿蒙登录配置', '1c4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/MCP-接入指南',
                component: ComponentCreator('/docs/开发者文档/入门指南/MCP-接入指南', '9eb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/准备工作',
                component: ComponentCreator('/docs/开发者文档/入门指南/准备工作', 'cf5'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/客户端错误码',
                component: ComponentCreator('/docs/开发者文档/入门指南/客户端错误码', 'ff3'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/Android-SDK配置',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/Android-SDK配置', '050'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/Android初始化/快速接入',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/Android初始化/快速接入', 'b70'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/Go-SDK-初始化',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/Go-SDK-初始化', '5d0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/iOS-SDK配置',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/iOS-SDK配置', '848'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/iOS初始化/快速开始',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/iOS初始化/快速开始', '31f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/Quick-H5初始化/快速开始',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/Quick-H5初始化/快速开始', '638'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/Steam-初始化/快速开始',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/Steam-初始化/快速开始', '4e2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/Unity-SDK配置',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/Unity-SDK配置', 'e1b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/Unity-初始化/小游戏插件',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/Unity-初始化/小游戏插件', '90e'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/Unity-初始化/快速开始',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/Unity-初始化/快速开始', '87e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/哔哩哔哩小游戏初始化/快速开始',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/哔哩哔哩小游戏初始化/快速开始', '36c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/4399H5',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/4399H5', 'cac'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/4399小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/4399小游戏', 'aad'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/gametok',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/gametok', '3db'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/OPPO小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/OPPO小游戏', 'aba'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/UC小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/UC小游戏', 'ebe'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/vivo小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/vivo小游戏', 'cb8'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/vng小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/vng小游戏', '63d'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/京东小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/京东小游戏', '8b8'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/最右小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/最右小游戏', 'ef1'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/华为小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/华为小游戏', 'fcf'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/司墨007',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/司墨007', '00a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/哈啰小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/哈啰小游戏', '132'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/哔哩哔哩小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/哔哩哔哩小游戏', 'a80'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/好游快爆',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/好游快爆', '0f1'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/小米小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/小米小游戏', '312'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/微信小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/微信小游戏', 'c08'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/快手小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/快手小游戏', '477'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/快速开始',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/快速开始', '5bf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/抖音小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/抖音小游戏', '167'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/支付宝小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/支付宝小游戏', '0b6'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/望舒H5',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/望舒H5', 'ce4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/淘宝小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/淘宝小游戏', '78f'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/热面小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/热面小游戏', '919'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/爱奇艺小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/爱奇艺小游戏', 'aac'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/爱微游',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/爱微游', 'd3b'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/独角兽小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/独角兽小游戏', '6bc'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/百度H5',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/百度H5', 'b1b'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/百度小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/百度小游戏', '884'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/美团小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/美团小游戏', '826'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/群黑小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/群黑小游戏', '3a2'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/芒好玩',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/芒好玩', 'cc9'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/荣耀小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/荣耀小游戏', '8d5'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/迅雷小游戏',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/迅雷小游戏', 'c1f'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/小游戏初始化/闪电玩',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/小游戏初始化/闪电玩', 'c59'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/望舒H5初始化/快速开始',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/望舒H5初始化/快速开始', '7b6'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/荣耀/小游戏/支付',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/荣耀/小游戏/支付', '859'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/荣耀/小游戏/望舒后台支付配置',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/荣耀/小游戏/望舒后台支付配置', 'ae8'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/荣耀/小游戏/望舒后台登陆配置',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/荣耀/小游戏/望舒后台登陆配置', '1fb'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/荣耀/小游戏/激励广告',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/荣耀/小游戏/激励广告', '07c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/荣耀/小游戏/登录',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/荣耀/小游戏/登录', '36a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/鸿蒙-初始化/快速开始-原生版',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/鸿蒙-初始化/快速开始-原生版', 'aba'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/快速开始/鸿蒙-初始化/快速开始-团结版',
                component: ComponentCreator('/docs/开发者文档/入门指南/快速开始/鸿蒙-初始化/快速开始-团结版', 'a91'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/更新日志/Android',
                component: ComponentCreator('/docs/开发者文档/入门指南/更新日志/Android', '751'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/更新日志/Go-SDK',
                component: ComponentCreator('/docs/开发者文档/入门指南/更新日志/Go-SDK', '52e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/更新日志/Steam',
                component: ComponentCreator('/docs/开发者文档/入门指南/更新日志/Steam', '54c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/更新日志/Unity',
                component: ComponentCreator('/docs/开发者文档/入门指南/更新日志/Unity', '1bb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/更新日志/鸿蒙/原生版',
                component: ComponentCreator('/docs/开发者文档/入门指南/更新日志/鸿蒙/原生版', '5c4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/更新日志/鸿蒙/团结版',
                component: ComponentCreator('/docs/开发者文档/入门指南/更新日志/鸿蒙/团结版', '4c2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/服务商配置申请/阿里云',
                component: ComponentCreator('/docs/开发者文档/入门指南/服务商配置申请/阿里云', '5cb'),
                exact: true
              },
              {
                path: '/docs/开发者文档/入门指南/服务端接入须知',
                component: ComponentCreator('/docs/开发者文档/入门指南/服务端接入须知', '0bd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/望舒国家-币种及简称对照表',
                component: ComponentCreator('/docs/开发者文档/入门指南/望舒国家-币种及简称对照表', '6af'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/望舒多语言简称对照表',
                component: ComponentCreator('/docs/开发者文档/入门指南/望舒多语言简称对照表', '1e0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/入门指南/错误码对照表',
                component: ComponentCreator('/docs/开发者文档/入门指南/错误码对照表', '501'),
                exact: true
              },
              {
                path: '/docs/开发者文档/内容安全/功能介绍',
                component: ComponentCreator('/docs/开发者文档/内容安全/功能介绍', '6d4'),
                exact: true
              },
              {
                path: '/docs/开发者文档/内容安全/服务端接入/Go-SDK',
                component: ComponentCreator('/docs/开发者文档/内容安全/服务端接入/Go-SDK', 'ebe'),
                exact: true
              },
              {
                path: '/docs/开发者文档/内容安全/服务端接入/微信信息解密',
                component: ComponentCreator('/docs/开发者文档/内容安全/服务端接入/微信信息解密', '9a2'),
                exact: true
              },
              {
                path: '/docs/开发者文档/内容安全/服务端接入/服务端-API',
                component: ComponentCreator('/docs/开发者文档/内容安全/服务端接入/服务端-API', '77e'),
                exact: true
              },
              {
                path: '/docs/开发者文档/内容安全/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/开发者文档/内容安全/服务端接入/服务端回调接口', 'b1a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/分享/Unity-接入/快速接入',
                component: ComponentCreator('/docs/开发者文档/分享/Unity-接入/快速接入', '976'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/分享/分享-Android/快速接入',
                component: ComponentCreator('/docs/开发者文档/分享/分享-Android/快速接入', 'd8b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/分享/分享-Facebook小游戏',
                component: ComponentCreator('/docs/开发者文档/分享/分享-Facebook小游戏', '718'),
                exact: true
              },
              {
                path: '/docs/开发者文档/分享/分享-iOS/快速接入',
                component: ComponentCreator('/docs/开发者文档/分享/分享-iOS/快速接入', '74a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/分享/分享-鸿蒙/快速接入',
                component: ComponentCreator('/docs/开发者文档/分享/分享-鸿蒙/快速接入', '3c8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/分享/分享平台支持类型和回调',
                component: ComponentCreator('/docs/开发者文档/分享/分享平台支持类型和回调', '309'),
                exact: true
              },
              {
                path: '/docs/开发者文档/分享/分享调度',
                component: ComponentCreator('/docs/开发者文档/分享/分享调度', '832'),
                exact: true
              },
              {
                path: '/docs/开发者文档/分享/分享通路配置',
                component: ComponentCreator('/docs/开发者文档/分享/分享通路配置', '537'),
                exact: true
              },
              {
                path: '/docs/开发者文档/分享/功能介绍',
                component: ComponentCreator('/docs/开发者文档/分享/功能介绍', '91d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/分享/对象存储回源配置',
                component: ComponentCreator('/docs/开发者文档/分享/对象存储回源配置', '7b4'),
                exact: true
              },
              {
                path: '/docs/开发者文档/分享/小游戏渠道分享',
                component: ComponentCreator('/docs/开发者文档/分享/小游戏渠道分享', '8a0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/分享/快速接入',
                component: ComponentCreator('/docs/开发者文档/分享/快速接入', '7a9'),
                exact: true
              },
              {
                path: '/docs/开发者文档/分享/服务端接入/动态消息-API',
                component: ComponentCreator('/docs/开发者文档/分享/服务端接入/动态消息-API', 'c6d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/分享/服务端接入/服务端-API',
                component: ComponentCreator('/docs/开发者文档/分享/服务端接入/服务端-API', 'cee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/区服角色/Unity',
                component: ComponentCreator('/docs/开发者文档/区服角色/Unity', '445'),
                exact: true
              },
              {
                path: '/docs/开发者文档/区服角色/功能介绍',
                component: ComponentCreator('/docs/开发者文档/区服角色/功能介绍', '6da'),
                exact: true
              },
              {
                path: '/docs/开发者文档/区服角色/原生接入',
                component: ComponentCreator('/docs/开发者文档/区服角色/原生接入', '891'),
                exact: true
              },
              {
                path: '/docs/开发者文档/区服角色/小游戏',
                component: ComponentCreator('/docs/开发者文档/区服角色/小游戏', '046'),
                exact: true
              },
              {
                path: '/docs/开发者文档/区服角色/服务端API',
                component: ComponentCreator('/docs/开发者文档/区服角色/服务端API', 'd1a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/区服角色/服务端API-作废',
                component: ComponentCreator('/docs/开发者文档/区服角色/服务端API-作废', '9f5'),
                exact: true
              },
              {
                path: '/docs/开发者文档/即时通讯/功能介绍',
                component: ComponentCreator('/docs/开发者文档/即时通讯/功能介绍', '913'),
                exact: true
              },
              {
                path: '/docs/开发者文档/即时通讯/客户端接入/会话操作',
                component: ComponentCreator('/docs/开发者文档/即时通讯/客户端接入/会话操作', '769'),
                exact: true
              },
              {
                path: '/docs/开发者文档/即时通讯/客户端接入/历史消息',
                component: ComponentCreator('/docs/开发者文档/即时通讯/客户端接入/历史消息', '11a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/即时通讯/客户端接入/命名规则',
                component: ComponentCreator('/docs/开发者文档/即时通讯/客户端接入/命名规则', 'ddb'),
                exact: true
              },
              {
                path: '/docs/开发者文档/即时通讯/客户端接入/快速开始',
                component: ComponentCreator('/docs/开发者文档/即时通讯/客户端接入/快速开始', 'b16'),
                exact: true
              },
              {
                path: '/docs/开发者文档/即时通讯/客户端接入/消息操作',
                component: ComponentCreator('/docs/开发者文档/即时通讯/客户端接入/消息操作', 'a5f'),
                exact: true
              },
              {
                path: '/docs/开发者文档/即时通讯/客户端接入/消息模型',
                component: ComponentCreator('/docs/开发者文档/即时通讯/客户端接入/消息模型', 'be7'),
                exact: true
              },
              {
                path: '/docs/开发者文档/即时通讯/服务端接入/Go-SDK',
                component: ComponentCreator('/docs/开发者文档/即时通讯/服务端接入/Go-SDK', 'd17'),
                exact: true
              },
              {
                path: '/docs/开发者文档/即时通讯/服务端接入/数据约束',
                component: ComponentCreator('/docs/开发者文档/即时通讯/服务端接入/数据约束', '7e1'),
                exact: true
              },
              {
                path: '/docs/开发者文档/即时通讯/服务端接入/服务端-API',
                component: ComponentCreator('/docs/开发者文档/即时通讯/服务端接入/服务端-API', 'c7a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/即时通讯/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/开发者文档/即时通讯/服务端接入/服务端回调接口', 'd34'),
                exact: true
              },
              {
                path: '/docs/开发者文档/即时通讯/服务端接入/消息定义',
                component: ComponentCreator('/docs/开发者文档/即时通讯/服务端接入/消息定义', '868'),
                exact: true
              },
              {
                path: '/docs/开发者文档/商业化/原生接入',
                component: ComponentCreator('/docs/开发者文档/商业化/原生接入', 'a15'),
                exact: true
              },
              {
                path: '/docs/开发者文档/商业化/小游戏',
                component: ComponentCreator('/docs/开发者文档/商业化/小游戏', '2f5'),
                exact: true
              },
              {
                path: '/docs/开发者文档/商业化/窗口运营配置/场景管理',
                component: ComponentCreator('/docs/开发者文档/商业化/窗口运营配置/场景管理', '545'),
                exact: true
              },
              {
                path: '/docs/开发者文档/商业化/窗口运营配置/礼包管理',
                component: ComponentCreator('/docs/开发者文档/商业化/窗口运营配置/礼包管理', '59e'),
                exact: true
              },
              {
                path: '/docs/开发者文档/商业化/窗口运营配置/窗口管理',
                component: ComponentCreator('/docs/开发者文档/商业化/窗口运营配置/窗口管理', 'c35'),
                exact: true
              },
              {
                path: '/docs/开发者文档/商户发红包/Android',
                component: ComponentCreator('/docs/开发者文档/商户发红包/Android', 'f8c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/商户发红包/iOS',
                component: ComponentCreator('/docs/开发者文档/商户发红包/iOS', 'f79'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/商户发红包/功能介绍',
                component: ComponentCreator('/docs/开发者文档/商户发红包/功能介绍', '5c6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/商户发红包/商家转账服务端接入',
                component: ComponentCreator('/docs/开发者文档/商户发红包/商家转账服务端接入', 'd70'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/商户发红包/微信小游戏收款',
                component: ComponentCreator('/docs/开发者文档/商户发红包/微信小游戏收款', '32d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/商户发红包/收款',
                component: ComponentCreator('/docs/开发者文档/商户发红包/收款', '189'),
                exact: true
              },
              {
                path: '/docs/开发者文档/定位/Android-定位/快速接入',
                component: ComponentCreator('/docs/开发者文档/定位/Android-定位/快速接入', 'f5a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/定位/iOS-定位/快速接入',
                component: ComponentCreator('/docs/开发者文档/定位/iOS-定位/快速接入', 'd8a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/定位/Unity-定位/快速接入',
                component: ComponentCreator('/docs/开发者文档/定位/Unity-定位/快速接入', '53b'),
                exact: true
              },
              {
                path: '/docs/开发者文档/定位/功能介绍',
                component: ComponentCreator('/docs/开发者文档/定位/功能介绍', 'ed7'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/Android-客服/快速接入',
                component: ComponentCreator('/docs/开发者文档/客服/Android-客服/快速接入', '6ca'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/iOS-客服/快速接入',
                component: ComponentCreator('/docs/开发者文档/客服/iOS-客服/快速接入', '9a6'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/JavaScript-接入',
                component: ComponentCreator('/docs/开发者文档/客服/JavaScript-接入', 'd56'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/Unity-客服/快速接入',
                component: ComponentCreator('/docs/开发者文档/客服/Unity-客服/快速接入', '4db'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/功能介绍',
                component: ComponentCreator('/docs/开发者文档/客服/功能介绍', '34a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/服务端接入/APP-客服接入文档',
                component: ComponentCreator('/docs/开发者文档/客服/服务端接入/APP-客服接入文档', 'c3c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/服务端接入/客服面板内嵌CP自定义页接入文档',
                component: ComponentCreator('/docs/开发者文档/客服/服务端接入/客服面板内嵌CP自定义页接入文档', '7f4'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/服务端接入/帮助中心预览地址',
                component: ComponentCreator('/docs/开发者文档/客服/服务端接入/帮助中心预览地址', 'e2c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/服务端接入/微信小游戏客服接入文档',
                component: ComponentCreator('/docs/开发者文档/客服/服务端接入/微信小游戏客服接入文档', '976'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/服务端接入/微信小游戏客服配置',
                component: ComponentCreator('/docs/开发者文档/客服/服务端接入/微信小游戏客服配置', '910'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/服务端接入/抖音小游戏客服接入文档',
                component: ComponentCreator('/docs/开发者文档/客服/服务端接入/抖音小游戏客服接入文档', '1a4'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/服务端接入/抖音小游戏客服配置',
                component: ComponentCreator('/docs/开发者文档/客服/服务端接入/抖音小游戏客服配置', 'b40'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/开发者文档/客服/服务端接入/服务端回调接口', '4c7'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/服务端接入/未读数量获取',
                component: ComponentCreator('/docs/开发者文档/客服/服务端接入/未读数量获取', '8f4'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/服务端接入/设置浏览器消息通知权限',
                component: ComponentCreator('/docs/开发者文档/客服/服务端接入/设置浏览器消息通知权限', '84a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/服务端接入/避免客服掉线',
                component: ComponentCreator('/docs/开发者文档/客服/服务端接入/避免客服掉线', 'd6b'),
                exact: true
              },
              {
                path: '/docs/开发者文档/客服/鸿蒙客服/快速接入-原生版',
                component: ComponentCreator('/docs/开发者文档/客服/鸿蒙客服/快速接入-原生版', '7ac'),
                exact: true
              },
              {
                path: '/docs/开发者文档/常见问题/',
                component: ComponentCreator('/docs/开发者文档/常见问题/', '921'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/常见问题/分享相关',
                component: ComponentCreator('/docs/开发者文档/常见问题/分享相关', '750'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/常见问题/域名切换-迁移',
                component: ComponentCreator('/docs/开发者文档/常见问题/域名切换-迁移', 'e95'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/常见问题/推送相关',
                component: ComponentCreator('/docs/开发者文档/常见问题/推送相关', '0fc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/常见问题/支付相关',
                component: ComponentCreator('/docs/开发者文档/常见问题/支付相关', '7dd'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/常见问题/点击望舒菜单无反应的方案',
                component: ComponentCreator('/docs/开发者文档/常见问题/点击望舒菜单无反应的方案', 'fc1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/常见问题/登录相关',
                component: ComponentCreator('/docs/开发者文档/常见问题/登录相关', 'e77'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/广告投放/Go-SDK',
                component: ComponentCreator('/docs/开发者文档/广告投放/Go-SDK', '58f'),
                exact: true
              },
              {
                path: '/docs/开发者文档/广告投放/功能介绍',
                component: ComponentCreator('/docs/开发者文档/广告投放/功能介绍', '521'),
                exact: true
              },
              {
                path: '/docs/开发者文档/广告投放/巨量广告/Android接入',
                component: ComponentCreator('/docs/开发者文档/广告投放/巨量广告/Android接入', '995'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/广告投放/巨量广告/IOS接入',
                component: ComponentCreator('/docs/开发者文档/广告投放/巨量广告/IOS接入', 'd48'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/广告投放/巨量广告/Unity接入',
                component: ComponentCreator('/docs/开发者文档/广告投放/巨量广告/Unity接入', 'b96'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/广告投放/巨量广告/功能介绍',
                component: ComponentCreator('/docs/开发者文档/广告投放/巨量广告/功能介绍', 'fea'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/广告投放/广点通/Android',
                component: ComponentCreator('/docs/开发者文档/广告投放/广点通/Android', 'd39'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/广告投放/广点通/iOS',
                component: ComponentCreator('/docs/开发者文档/广告投放/广点通/iOS', 'f32'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/广告投放/广点通/功能介绍',
                component: ComponentCreator('/docs/开发者文档/广告投放/广点通/功能介绍', '372'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/广告投放/广点通/原生接入',
                component: ComponentCreator('/docs/开发者文档/广告投放/广点通/原生接入', '8f0'),
                exact: true
              },
              {
                path: '/docs/开发者文档/应用商店评分/Unity-评分/快速接入',
                component: ComponentCreator('/docs/开发者文档/应用商店评分/Unity-评分/快速接入', 'd62'),
                exact: true
              },
              {
                path: '/docs/开发者文档/应用商店评分/功能介绍',
                component: ComponentCreator('/docs/开发者文档/应用商店评分/功能介绍', '65a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/应用商店评分/快速接入',
                component: ComponentCreator('/docs/开发者文档/应用商店评分/快速接入', '009'),
                exact: true
              },
              {
                path: '/docs/开发者文档/性能分析/GPM-SDK接入/快速开始',
                component: ComponentCreator('/docs/开发者文档/性能分析/GPM-SDK接入/快速开始', '760'),
                exact: true
              },
              {
                path: '/docs/开发者文档/性能分析/UWA接入/Unity快速接入',
                component: ComponentCreator('/docs/开发者文档/性能分析/UWA接入/Unity快速接入', '5b7'),
                exact: true
              },
              {
                path: '/docs/开发者文档/性能分析/功能描述',
                component: ComponentCreator('/docs/开发者文档/性能分析/功能描述', '81a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/意见反馈/JavaScript-接入',
                component: ComponentCreator('/docs/开发者文档/意见反馈/JavaScript-接入', '0bf'),
                exact: true
              },
              {
                path: '/docs/开发者文档/意见反馈/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/意见反馈/Unity-接入', '070'),
                exact: true
              },
              {
                path: '/docs/开发者文档/意见反馈/功能介绍',
                component: ComponentCreator('/docs/开发者文档/意见反馈/功能介绍', '051'),
                exact: true
              },
              {
                path: '/docs/开发者文档/意见反馈/原生接入',
                component: ComponentCreator('/docs/开发者文档/意见反馈/原生接入', 'a77'),
                exact: true
              },
              {
                path: '/docs/开发者文档/意见反馈/服务端API',
                component: ComponentCreator('/docs/开发者文档/意见反馈/服务端API', 'c7c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/排行榜/JavaScript-接入',
                component: ComponentCreator('/docs/开发者文档/排行榜/JavaScript-接入', 'a2f'),
                exact: true
              },
              {
                path: '/docs/开发者文档/排行榜/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/排行榜/Unity-接入', '7fc'),
                exact: true
              },
              {
                path: '/docs/开发者文档/排行榜/功能介绍',
                component: ComponentCreator('/docs/开发者文档/排行榜/功能介绍', 'd6b'),
                exact: true
              },
              {
                path: '/docs/开发者文档/排行榜/原生接入',
                component: ComponentCreator('/docs/开发者文档/排行榜/原生接入', 'eb6'),
                exact: true
              },
              {
                path: '/docs/开发者文档/排行榜/服务端接入/Go-SDK',
                component: ComponentCreator('/docs/开发者文档/排行榜/服务端接入/Go-SDK', 'ef6'),
                exact: true
              },
              {
                path: '/docs/开发者文档/排行榜/服务端接入/小游戏开放接口-API',
                component: ComponentCreator('/docs/开发者文档/排行榜/服务端接入/小游戏开放接口-API', 'b97'),
                exact: true
              },
              {
                path: '/docs/开发者文档/排行榜/服务端接入/服务端-API',
                component: ComponentCreator('/docs/开发者文档/排行榜/服务端接入/服务端-API', '095'),
                exact: true
              },
              {
                path: '/docs/开发者文档/排行榜/鸿蒙Unity接入',
                component: ComponentCreator('/docs/开发者文档/排行榜/鸿蒙Unity接入', 'f1c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推广系统/功能介绍',
                component: ComponentCreator('/docs/开发者文档/推广系统/功能介绍', 'd7b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/推广系统/回调接入/服务端API',
                component: ComponentCreator('/docs/开发者文档/推广系统/回调接入/服务端API', '99b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/推广系统/回调接入/服务端回调接口',
                component: ComponentCreator('/docs/开发者文档/推广系统/回调接入/服务端回调接口', '766'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/推送/Android-Firebase-推送/快速接入',
                component: ComponentCreator('/docs/开发者文档/推送/Android-Firebase-推送/快速接入', 'ae0'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/Android-OPPO-推送/快速接入',
                component: ComponentCreator('/docs/开发者文档/推送/Android-OPPO-推送/快速接入', 'd9e'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/Android-Vivo-推送/快速接入',
                component: ComponentCreator('/docs/开发者文档/推送/Android-Vivo-推送/快速接入', '29f'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/Android-华为-推送/快速接入',
                component: ComponentCreator('/docs/开发者文档/推送/Android-华为-推送/快速接入', '4e1'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/Android-小米-推送/快速接入',
                component: ComponentCreator('/docs/开发者文档/推送/Android-小米-推送/快速接入', '50d'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/Android-荣耀-推送/快速接入',
                component: ComponentCreator('/docs/开发者文档/推送/Android-荣耀-推送/快速接入', 'a00'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/Android-魅族-推送/快速接入',
                component: ComponentCreator('/docs/开发者文档/推送/Android-魅族-推送/快速接入', '3f2'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/iOS-推送/快速接入',
                component: ComponentCreator('/docs/开发者文档/推送/iOS-推送/快速接入', 'a43'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/Unity-接入/Android-Unity-接入',
                component: ComponentCreator('/docs/开发者文档/推送/Unity-接入/Android-Unity-接入', 'f9d'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/Unity-接入/iOS-Unity-接入',
                component: ComponentCreator('/docs/开发者文档/推送/Unity-接入/iOS-Unity-接入', 'd59'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/功能介绍',
                component: ComponentCreator('/docs/开发者文档/推送/功能介绍', '12c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/厂商推送限制参考',
                component: ComponentCreator('/docs/开发者文档/推送/厂商推送限制参考', '809'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/服务端接入/Go-SDK',
                component: ComponentCreator('/docs/开发者文档/推送/服务端接入/Go-SDK', '5ee'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/服务端接入/推送常见错误及解决方法',
                component: ComponentCreator('/docs/开发者文档/推送/服务端接入/推送常见错误及解决方法', '890'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/服务端接入/服务端-API',
                component: ComponentCreator('/docs/开发者文档/推送/服务端接入/服务端-API', '7c9'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/服务端接入/错误码定义',
                component: ComponentCreator('/docs/开发者文档/推送/服务端接入/错误码定义', 'db5'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/鸿蒙-推送/快速接入-原生版',
                component: ComponentCreator('/docs/开发者文档/推送/鸿蒙-推送/快速接入-原生版', '8a5'),
                exact: true
              },
              {
                path: '/docs/开发者文档/推送/鸿蒙-推送/快速接入-团结版',
                component: ComponentCreator('/docs/开发者文档/推送/鸿蒙-推送/快速接入-团结版', '76d'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/Android-H5支付/PayerMax',
                component: ComponentCreator('/docs/开发者文档/支付/Android-H5支付/PayerMax', '3a8'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/Android-H5支付/Quick H5',
                component: ComponentCreator('/docs/开发者文档/支付/Android-H5支付/Quick H5', '92e'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/Android-H5支付/UniPin',
                component: ComponentCreator('/docs/开发者文档/支付/Android-H5支付/UniPin', 'c70'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/Android-H5支付/Xsolla',
                component: ComponentCreator('/docs/开发者文档/支付/Android-H5支付/Xsolla', '230'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/Android-H5支付/京东',
                component: ComponentCreator('/docs/开发者文档/支付/Android-H5支付/京东', 'ab3'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/Android-H5支付/微信H5',
                component: ComponentCreator('/docs/开发者文档/支付/Android-H5支付/微信H5', '5f7'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/Android-H5支付/微信海外H5/业务介绍',
                component: ComponentCreator('/docs/开发者文档/支付/Android-H5支付/微信海外H5/业务介绍', 'f0d'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/Android-H5支付/微信海外H5/客户端接入-Android',
                component: ComponentCreator('/docs/开发者文档/支付/Android-H5支付/微信海外H5/客户端接入-Android', '30b'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/Android-H5支付/微信海外H5/望舒后台支付配置',
                component: ComponentCreator('/docs/开发者文档/支付/Android-H5支付/微信海外H5/望舒后台支付配置', '8bd'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/Android-H5支付/支付宝H5',
                component: ComponentCreator('/docs/开发者文档/支付/Android-H5支付/支付宝H5', '0f9'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/Android-H5支付/望舒收银台',
                component: ComponentCreator('/docs/开发者文档/支付/Android-H5支付/望舒收银台', 'bff'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/007',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/007', 'f21'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/4399',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/4399', 'ed3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/Apkpure',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/Apkpure', 'eb3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/Aptoide',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/Aptoide', 'b83'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/BiliBili',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/BiliBili', '0e5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/Checkout',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/Checkout', '88c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/Google',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/Google', '710'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/mumu',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/mumu', '719'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/Mycard',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/Mycard', '8f9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/OPPO',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/OPPO', '4b5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/Qoo',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/Qoo', '03d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/Rustore',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/Rustore', 'dd9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/Upay',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/Upay', '0a9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/Vivo',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/Vivo', '0b9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/Waffo',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/Waffo', '4b5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/九游',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/九游', 'c3c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/华为',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/华为', '3e2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/小米',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/小米', '386'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/应用宝直购',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/应用宝直购', '2e4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/应用宝道具',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/应用宝道具', '68a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/微信App',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/微信App', '68e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/快手',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/快手', 'de7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/抖音',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/抖音', 'b47'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/支付宝App',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/支付宝App', 'd75'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/易宝',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/易宝', 'dcc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/星驿',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/星驿', '98c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/栩腾',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/栩腾', '310'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/海外 OPPO',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/海外 OPPO', 'fb8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/百度',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/百度', '942'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/苏宁',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/苏宁', '4dc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/荣耀',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/荣耀', '41d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/银联',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/银联', '1bc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Android-渠道支付/雷电',
                component: ComponentCreator('/docs/开发者文档/支付/Android-渠道支付/雷电', '230'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Steam-支付/快速接入',
                component: ComponentCreator('/docs/开发者文档/支付/Steam-支付/快速接入', '91c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/Unity-接入/快速接入',
                component: ComponentCreator('/docs/开发者文档/支付/Unity-接入/快速接入', '669'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/功能介绍',
                component: ComponentCreator('/docs/开发者文档/支付/功能介绍', '214'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/4399H5小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/4399H5小游戏', '9d0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/4399小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/4399小游戏', 'ee8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/gametok小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/gametok小游戏', '5a8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/oppo小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/oppo小游戏', 'cb2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/QQ小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/QQ小游戏', '221'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/UC小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/UC小游戏', '2bb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/vivo小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/vivo小游戏', '15b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/vng小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/vng小游戏', '889'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/京东小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/京东小游戏', '107'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/最右小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/最右小游戏', '6e9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/华为小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/华为小游戏', 'e6b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/司墨007小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/司墨007小游戏', '42c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/哈啰小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/哈啰小游戏', 'e54'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/哔哩哔哩小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/哔哩哔哩小游戏', '61c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/好游快爆小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/好游快爆小游戏', '24f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/小米小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/小米小游戏', '8af'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/微信小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/微信小游戏', '0ef'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/快手小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/快手小游戏', '869'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/抖音小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/抖音小游戏', 'f49'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/支付宝小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/支付宝小游戏', '6ac'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/淘宝小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/淘宝小游戏', '280'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/热面h5小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/热面h5小游戏', '27f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/爱奇艺小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/爱奇艺小游戏', 'e03'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/爱微游小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/爱微游小游戏', '530'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/百度h5小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/百度h5小游戏', 'c14'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/百度小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/百度小游戏', '726'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/美团小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/美团小游戏', '70c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/群黑小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/群黑小游戏', '992'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/芒好玩小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/芒好玩小游戏', 'aaf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/荣耀小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/荣耀小游戏', '04d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/迅雷小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/迅雷小游戏', 'd16'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/小游戏渠道支付/闪电玩小游戏',
                component: ComponentCreator('/docs/开发者文档/支付/小游戏渠道支付/闪电玩小游戏', 'fb8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/拉卡拉支付/快速接入',
                component: ComponentCreator('/docs/开发者文档/支付/拉卡拉支付/快速接入', 'a2c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/服务端接入/国家编码-币种字典',
                component: ComponentCreator('/docs/开发者文档/支付/服务端接入/国家编码-币种字典', '021'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/服务端接入/微信公众号-h5-微信客服卡片支付方式特别说明',
                component: ComponentCreator('/docs/开发者文档/支付/服务端接入/微信公众号-h5-微信客服卡片支付方式特别说明', 'b23'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/服务端接入/服务端-API',
                component: ComponentCreator('/docs/开发者文档/支付/服务端接入/服务端-API', '4bb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/开发者文档/支付/服务端接入/服务端回调接口', 'f09'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/服务端接入/银联-h5-微信客服卡片支付方式特别说明',
                component: ComponentCreator('/docs/开发者文档/支付/服务端接入/银联-h5-微信客服卡片支付方式特别说明', '718'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/服务端接入/错误码定义',
                component: ComponentCreator('/docs/开发者文档/支付/服务端接入/错误码定义', 'e9c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/望舒H5-支付/快速接入',
                component: ComponentCreator('/docs/开发者文档/支付/望舒H5-支付/快速接入', 'e57'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/独角兽支付/快速接入',
                component: ComponentCreator('/docs/开发者文档/支付/独角兽支付/快速接入', '273'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/苹果支付/快速接入',
                component: ComponentCreator('/docs/开发者文档/支付/苹果支付/快速接入', '38b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/银联支付/快速接入',
                component: ComponentCreator('/docs/开发者文档/支付/银联支付/快速接入', '99c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/支付/鸿蒙支付/快速接入-原生版',
                component: ComponentCreator('/docs/开发者文档/支付/鸿蒙支付/快速接入-原生版', '529'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/支付/鸿蒙支付/快速接入-团结版',
                component: ComponentCreator('/docs/开发者文档/支付/鸿蒙支付/快速接入-团结版', '318'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/数据分析/Android-数据分析/快速接入',
                component: ComponentCreator('/docs/开发者文档/数据分析/Android-数据分析/快速接入', '919'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/数据分析/iOS-数据分析/快速接入',
                component: ComponentCreator('/docs/开发者文档/数据分析/iOS-数据分析/快速接入', '522'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/数据分析/JavaScript-接入',
                component: ComponentCreator('/docs/开发者文档/数据分析/JavaScript-接入', 'd1d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/数据分析/Steam-接入/快速接入',
                component: ComponentCreator('/docs/开发者文档/数据分析/Steam-接入/快速接入', '413'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/数据分析/Unity-数据分析/快速接入',
                component: ComponentCreator('/docs/开发者文档/数据分析/Unity-数据分析/快速接入', 'cd7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/数据分析/上报设备通讯录',
                component: ComponentCreator('/docs/开发者文档/数据分析/上报设备通讯录', '785'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/其它数据分析接入方案建议/cp侧接入区服-角色数据分析',
                component: ComponentCreator('/docs/开发者文档/数据分析/其它数据分析接入方案建议/cp侧接入区服-角色数据分析', '7db'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/产品说明',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/产品说明', '907'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/准备工作/接入前的准备工作',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/准备工作/接入前的准备工作', 'e07'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/准备工作/标识用户',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/准备工作/标识用户', '214'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/准备工作/用户识别规则',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/准备工作/用户识别规则', '0be'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/其他功能/数据探索',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/其他功能/数据探索', 'ecc'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/数据管理/事件填报',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/数据管理/事件填报', 'af7'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/数据管理/事件属性管理',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/数据管理/事件属性管理', '7f3'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/数据管理/事件管理',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/数据管理/事件管理', '6df'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/数据管理/埋点管理',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/数据管理/埋点管理', '6ab'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/数据管理/用户属性管理',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/数据管理/用户属性管理', 'd20'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/用户分析/属性分析',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/用户分析/属性分析', 'bc6'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/用户分析/用户分群',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/用户分析/用户分群', '66e'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/用户分析/用户标签',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/用户分析/用户标签', 'fd0'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/SQL-查询',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/SQL-查询', '638'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/事件分析',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/事件分析', '09f'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/分布分析',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/分布分析', '8bb'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/漏斗分析',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/漏斗分析', 'feb'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/留存分析',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/留存分析', 'fb7'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/路径分析',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/路径分析', '3fa'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/间隔分析',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/功能说明/行为分析/间隔分析', '3e0'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/快速使用指南/数据上报',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/快速使用指南/数据上报', '489'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/快速使用指南/用户属性和事件属性',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/快速使用指南/用户属性和事件属性', 'e70'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/快速使用指南/维度表属性',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/快速使用指南/维度表属性', '298'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/快速使用指南/项目理解',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/快速使用指南/项目理解', '501'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/功能介绍/快速使用指南/预置事件和预置属性',
                component: ComponentCreator('/docs/开发者文档/数据分析/功能介绍/快速使用指南/预置事件和预置属性', '4ad'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/数据上报实时查询校验',
                component: ComponentCreator('/docs/开发者文档/数据分析/数据上报实时查询校验', '454'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/服务端接入/Go-SDK',
                component: ComponentCreator('/docs/开发者文档/数据分析/服务端接入/Go-SDK', 'bfb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/数据分析/服务端接入/上报插件-LogBus-使用指南',
                component: ComponentCreator('/docs/开发者文档/数据分析/服务端接入/上报插件-LogBus-使用指南', '033'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/数据分析/服务端接入/元数据上报-API',
                component: ComponentCreator('/docs/开发者文档/数据分析/服务端接入/元数据上报-API', '715'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/数据分析/服务端接入/服务端-API',
                component: ComponentCreator('/docs/开发者文档/数据分析/服务端接入/服务端-API', '16c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/数据分析/获取设备已安装应用',
                component: ComponentCreator('/docs/开发者文档/数据分析/获取设备已安装应用', '4fa'),
                exact: true
              },
              {
                path: '/docs/开发者文档/数据分析/鸿蒙-数据分析/快速接入-原生版',
                component: ComponentCreator('/docs/开发者文档/数据分析/鸿蒙-数据分析/快速接入-原生版', '8d7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/数据分析/鸿蒙-数据分析/快速接入-团结版',
                component: ComponentCreator('/docs/开发者文档/数据分析/鸿蒙-数据分析/快速接入-团结版', 'd6c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/智能机器人/服务端API',
                component: ComponentCreator('/docs/开发者文档/智能机器人/服务端API', '5d9'),
                exact: true
              },
              {
                path: '/docs/开发者文档/望舒邮件管理/Android邮件API/快速开始',
                component: ComponentCreator('/docs/开发者文档/望舒邮件管理/Android邮件API/快速开始', '2a2'),
                exact: true
              },
              {
                path: '/docs/开发者文档/望舒邮件管理/Android邮件UI-国内/快速接入',
                component: ComponentCreator('/docs/开发者文档/望舒邮件管理/Android邮件UI-国内/快速接入', '6b9'),
                exact: true
              },
              {
                path: '/docs/开发者文档/望舒邮件管理/Android邮件UI-海外/快速开始',
                component: ComponentCreator('/docs/开发者文档/望舒邮件管理/Android邮件UI-海外/快速开始', '713'),
                exact: true
              },
              {
                path: '/docs/开发者文档/望舒邮件管理/iOS邮件API/快速接入',
                component: ComponentCreator('/docs/开发者文档/望舒邮件管理/iOS邮件API/快速接入', '0d3'),
                exact: true
              },
              {
                path: '/docs/开发者文档/望舒邮件管理/iOS邮件UI-国内/快速开始',
                component: ComponentCreator('/docs/开发者文档/望舒邮件管理/iOS邮件UI-国内/快速开始', '892'),
                exact: true
              },
              {
                path: '/docs/开发者文档/望舒邮件管理/iOS邮件UI-海外/快速开始',
                component: ComponentCreator('/docs/开发者文档/望舒邮件管理/iOS邮件UI-海外/快速开始', '91d'),
                exact: true
              },
              {
                path: '/docs/开发者文档/望舒邮件管理/Javascript/快速接入',
                component: ComponentCreator('/docs/开发者文档/望舒邮件管理/Javascript/快速接入', '2d7'),
                exact: true
              },
              {
                path: '/docs/开发者文档/望舒邮件管理/Unity邮件API/快速开始',
                component: ComponentCreator('/docs/开发者文档/望舒邮件管理/Unity邮件API/快速开始', '83b'),
                exact: true
              },
              {
                path: '/docs/开发者文档/望舒邮件管理/Unity邮件UI-国内/快速开始',
                component: ComponentCreator('/docs/开发者文档/望舒邮件管理/Unity邮件UI-国内/快速开始', '101'),
                exact: true
              },
              {
                path: '/docs/开发者文档/望舒邮件管理/Unity邮件UI-海外/快速开始',
                component: ComponentCreator('/docs/开发者文档/望舒邮件管理/Unity邮件UI-海外/快速开始', '15f'),
                exact: true
              },
              {
                path: '/docs/开发者文档/望舒邮件管理/功能介绍',
                component: ComponentCreator('/docs/开发者文档/望舒邮件管理/功能介绍', '625'),
                exact: true
              },
              {
                path: '/docs/开发者文档/望舒邮件管理/服务端接入/服务端API',
                component: ComponentCreator('/docs/开发者文档/望舒邮件管理/服务端接入/服务端API', '331'),
                exact: true
              },
              {
                path: '/docs/开发者文档/望舒邮件管理/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/开发者文档/望舒邮件管理/服务端接入/服务端回调接口', '1b3'),
                exact: true
              },
              {
                path: '/docs/开发者文档/概览',
                component: ComponentCreator('/docs/开发者文档/概览', '731'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/法务配置/Steam-接入/快速接入',
                component: ComponentCreator('/docs/开发者文档/法务配置/Steam-接入/快速接入', '4b2'),
                exact: true
              },
              {
                path: '/docs/开发者文档/法务配置/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/法务配置/Unity-接入', 'e23'),
                exact: true
              },
              {
                path: '/docs/开发者文档/法务配置/功能介绍',
                component: ComponentCreator('/docs/开发者文档/法务配置/功能介绍', '7ed'),
                exact: true
              },
              {
                path: '/docs/开发者文档/法务配置/原生接入',
                component: ComponentCreator('/docs/开发者文档/法务配置/原生接入', 'f0a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/法务配置/服务端接入/服务端-API',
                component: ComponentCreator('/docs/开发者文档/法务配置/服务端接入/服务端-API', '435'),
                exact: true
              },
              {
                path: '/docs/开发者文档/法务配置/服务端接入/错误码定义',
                component: ComponentCreator('/docs/开发者文档/法务配置/服务端接入/错误码定义', 'df0'),
                exact: true
              },
              {
                path: '/docs/开发者文档/法务配置/鸿蒙接入/快速接入-原生版',
                component: ComponentCreator('/docs/开发者文档/法务配置/鸿蒙接入/快速接入-原生版', '40d'),
                exact: true
              },
              {
                path: '/docs/开发者文档/法务配置/鸿蒙接入/快速接入-团结版',
                component: ComponentCreator('/docs/开发者文档/法务配置/鸿蒙接入/快速接入-团结版', 'b82'),
                exact: true
              },
              {
                path: '/docs/开发者文档/游戏公告/Android公告API/快速开始',
                component: ComponentCreator('/docs/开发者文档/游戏公告/Android公告API/快速开始', 'f7b'),
                exact: true
              },
              {
                path: '/docs/开发者文档/游戏公告/Android公告UI-国内/快速开始',
                component: ComponentCreator('/docs/开发者文档/游戏公告/Android公告UI-国内/快速开始', 'a3d'),
                exact: true
              },
              {
                path: '/docs/开发者文档/游戏公告/Android公告UI-国外/快速开始',
                component: ComponentCreator('/docs/开发者文档/游戏公告/Android公告UI-国外/快速开始', 'bf5'),
                exact: true
              },
              {
                path: '/docs/开发者文档/游戏公告/iOS公告API/快速开始',
                component: ComponentCreator('/docs/开发者文档/游戏公告/iOS公告API/快速开始', 'f8e'),
                exact: true
              },
              {
                path: '/docs/开发者文档/游戏公告/iOS公告UI-国内/快速开始',
                component: ComponentCreator('/docs/开发者文档/游戏公告/iOS公告UI-国内/快速开始', '2e9'),
                exact: true
              },
              {
                path: '/docs/开发者文档/游戏公告/iOS公告UI-国外/快速开始',
                component: ComponentCreator('/docs/开发者文档/游戏公告/iOS公告UI-国外/快速开始', '7b8'),
                exact: true
              },
              {
                path: '/docs/开发者文档/游戏公告/Unity公告API/快速开始',
                component: ComponentCreator('/docs/开发者文档/游戏公告/Unity公告API/快速开始', '29b'),
                exact: true
              },
              {
                path: '/docs/开发者文档/游戏公告/Unity公告UI-国内/快速开始',
                component: ComponentCreator('/docs/开发者文档/游戏公告/Unity公告UI-国内/快速开始', '879'),
                exact: true
              },
              {
                path: '/docs/开发者文档/游戏公告/Unity公告UI-国外/快速接入',
                component: ComponentCreator('/docs/开发者文档/游戏公告/Unity公告UI-国外/快速接入', '6fc'),
                exact: true
              },
              {
                path: '/docs/开发者文档/游戏公告/功能介绍',
                component: ComponentCreator('/docs/开发者文档/游戏公告/功能介绍', 'b7b'),
                exact: true
              },
              {
                path: '/docs/开发者文档/游戏公告/小游戏渠道公告',
                component: ComponentCreator('/docs/开发者文档/游戏公告/小游戏渠道公告', '832'),
                exact: true
              },
              {
                path: '/docs/开发者文档/游戏公告/服务端API',
                component: ComponentCreator('/docs/开发者文档/游戏公告/服务端API', '839'),
                exact: true
              },
              {
                path: '/docs/开发者文档/游戏公告/服务端回调接口',
                component: ComponentCreator('/docs/开发者文档/游戏公告/服务端回调接口', '3d7'),
                exact: true
              },
              {
                path: '/docs/开发者文档/版本检查/JavaScript-接入',
                component: ComponentCreator('/docs/开发者文档/版本检查/JavaScript-接入', 'd64'),
                exact: true
              },
              {
                path: '/docs/开发者文档/版本检查/Steam-接入/快速接入',
                component: ComponentCreator('/docs/开发者文档/版本检查/Steam-接入/快速接入', 'f05'),
                exact: true
              },
              {
                path: '/docs/开发者文档/版本检查/Unity-接入',
                component: ComponentCreator('/docs/开发者文档/版本检查/Unity-接入', '8fb'),
                exact: true
              },
              {
                path: '/docs/开发者文档/版本检查/功能介绍',
                component: ComponentCreator('/docs/开发者文档/版本检查/功能介绍', '14a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/版本检查/客户端接入/iOS',
                component: ComponentCreator('/docs/开发者文档/版本检查/客户端接入/iOS', '88c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/版本检查/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/开发者文档/版本检查/服务端接入/服务端回调接口', '1c8'),
                exact: true
              },
              {
                path: '/docs/开发者文档/版本检查/服务端接入/版本检查v2',
                component: ComponentCreator('/docs/开发者文档/版本检查/服务端接入/版本检查v2', 'b15'),
                exact: true
              },
              {
                path: '/docs/开发者文档/版本检查/服务端接入/错误码定义',
                component: ComponentCreator('/docs/开发者文档/版本检查/服务端接入/错误码定义', '00d'),
                exact: true
              },
              {
                path: '/docs/开发者文档/版本检查/鸿蒙接入/快速接入-原生版',
                component: ComponentCreator('/docs/开发者文档/版本检查/鸿蒙接入/快速接入-原生版', 'd46'),
                exact: true
              },
              {
                path: '/docs/开发者文档/版本检查/鸿蒙接入/快速接入-团结版',
                component: ComponentCreator('/docs/开发者文档/版本检查/鸿蒙接入/快速接入-团结版', '930'),
                exact: true
              },
              {
                path: '/docs/开发者文档/玩家意见反馈/Android意见反馈API/快速开始',
                component: ComponentCreator('/docs/开发者文档/玩家意见反馈/Android意见反馈API/快速开始', '09c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/玩家意见反馈/Android意见反馈UI/快速接入',
                component: ComponentCreator('/docs/开发者文档/玩家意见反馈/Android意见反馈UI/快速接入', '613'),
                exact: true
              },
              {
                path: '/docs/开发者文档/玩家意见反馈/iOS意见反馈API/快速开始',
                component: ComponentCreator('/docs/开发者文档/玩家意见反馈/iOS意见反馈API/快速开始', '3dc'),
                exact: true
              },
              {
                path: '/docs/开发者文档/玩家意见反馈/iOS意见反馈UI/快速接入',
                component: ComponentCreator('/docs/开发者文档/玩家意见反馈/iOS意见反馈UI/快速接入', '658'),
                exact: true
              },
              {
                path: '/docs/开发者文档/玩家意见反馈/Javascript-接入/快速接入',
                component: ComponentCreator('/docs/开发者文档/玩家意见反馈/Javascript-接入/快速接入', '788'),
                exact: true
              },
              {
                path: '/docs/开发者文档/玩家意见反馈/Unity意见反馈UI/快速接入',
                component: ComponentCreator('/docs/开发者文档/玩家意见反馈/Unity意见反馈UI/快速接入', '093'),
                exact: true
              },
              {
                path: '/docs/开发者文档/玩家意见反馈/功能介绍',
                component: ComponentCreator('/docs/开发者文档/玩家意见反馈/功能介绍', '0dd'),
                exact: true
              },
              {
                path: '/docs/开发者文档/玩家意见反馈/服务端接入/服务端api',
                component: ComponentCreator('/docs/开发者文档/玩家意见反馈/服务端接入/服务端api', '397'),
                exact: true
              },
              {
                path: '/docs/开发者文档/玩家意见反馈/服务端接入/服务端回调',
                component: ComponentCreator('/docs/开发者文档/玩家意见反馈/服务端接入/服务端回调', '802'),
                exact: true
              },
              {
                path: '/docs/开发者文档/用户信息/获取指定用户信息',
                component: ComponentCreator('/docs/开发者文档/用户信息/获取指定用户信息', '3b8'),
                exact: true
              },
              {
                path: '/docs/开发者文档/登录-通行证/Android-登录API/快速接入',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/Android-登录API/快速接入', 'b17'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/Android-登录UI-国内/快速接入',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/Android-登录UI-国内/快速接入', '71a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/Android-登录UI-国外/快速接入',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/Android-登录UI-国外/快速接入', '658'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/iOS-登录API/快速接入',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/iOS-登录API/快速接入', 'c51'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/iOS-登录UI-国内/快速接入',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/iOS-登录UI-国内/快速接入', '006'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/iOS-登录UI-国外/快速接入',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/iOS-登录UI-国外/快速接入', '962'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/Quick-H5登录/快速接入',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/Quick-H5登录/快速接入', '4f3'),
                exact: true
              },
              {
                path: '/docs/开发者文档/登录-通行证/Steam-登录/快速接入',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/Steam-登录/快速接入', 'b79'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/Unity-登录API/快速接入',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/Unity-登录API/快速接入', '788'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/Unity-登录UI-国内/快速接入',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/Unity-登录UI-国内/快速接入', '1b2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/Unity-登录UI-国外/快速接入',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/Unity-登录UI-国外/快速接入', '89b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/功能介绍',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/功能介绍', 'd33'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/实名认证奖励道具/实名认证配置',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/实名认证奖励道具/实名认证配置', '30f'),
                exact: true
              },
              {
                path: '/docs/开发者文档/登录-通行证/实名认证奖励道具/服务端回调接口',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/实名认证奖励道具/服务端回调接口', '1bd'),
                exact: true
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/4399H5',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/4399H5', 'e7f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/4399小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/4399小游戏', '1b8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/gametok',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/gametok', 'ce5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/OPPO小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/OPPO小游戏', 'bc3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/QQ小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/QQ小游戏', 'dd2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/UC小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/UC小游戏', 'acf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/vivo小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/vivo小游戏', 'a0e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/vng小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/vng小游戏', 'dae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/京东小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/京东小游戏', '0bb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/最右小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/最右小游戏', '841'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/华为小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/华为小游戏', 'b67'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/司墨007',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/司墨007', 'c6f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/哈啰小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/哈啰小游戏', 'd97'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/哔哩哔哩小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/哔哩哔哩小游戏', 'f19'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/好游快爆',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/好游快爆', '677'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/小米小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/小米小游戏', 'f1f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/微信小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/微信小游戏', '9af'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/微信小游戏-绑定换绑手机',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/微信小游戏-绑定换绑手机', 'ab4'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/快手小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/快手小游戏', '158'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/快速接入',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/快速接入', '0f3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/抖音小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/抖音小游戏', '686'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/支付宝小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/支付宝小游戏', 'eef'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/望舒H5',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/望舒H5', '213'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/海外H5',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/海外H5', '287'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/淘宝小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/淘宝小游戏', '88e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/热面H5',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/热面H5', '09f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/爱奇艺小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/爱奇艺小游戏', '7b5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/爱微游',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/爱微游', '359'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/独角兽小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/独角兽小游戏', '55d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/百度H5',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/百度H5', '7b1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/百度小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/百度小游戏', '278'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/美团小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/美团小游戏', '772'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/群黑小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/群黑小游戏', '734'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/芒好玩',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/芒好玩', '731'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/荣耀小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/荣耀小游戏', '328'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/迅雷小游戏',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/迅雷小游戏', '7be'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/小游戏渠道登录/闪电玩',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/小游戏渠道登录/闪电玩', '8af'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/服务端接入/合规-实名',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/服务端接入/合规-实名', 'aa7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/服务端接入/服务端-API',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/服务端接入/服务端-API', '901'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/服务端接入/服务端回调接口',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/服务端接入/服务端回调接口', '9ac'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/鸿蒙登录/快速接入-原生版',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/鸿蒙登录/快速接入-原生版', '03c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/登录-通行证/鸿蒙登录/快速接入-团结版',
                component: ComponentCreator('/docs/开发者文档/登录-通行证/鸿蒙登录/快速接入-团结版', '778'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/社交/Android-社交/快速接入',
                component: ComponentCreator('/docs/开发者文档/社交/Android-社交/快速接入', '963'),
                exact: true
              },
              {
                path: '/docs/开发者文档/社交/iOS-社交/快速接入',
                component: ComponentCreator('/docs/开发者文档/社交/iOS-社交/快速接入', '172'),
                exact: true
              },
              {
                path: '/docs/开发者文档/社交/JavaScript-接入',
                component: ComponentCreator('/docs/开发者文档/社交/JavaScript-接入', '4f7'),
                exact: true
              },
              {
                path: '/docs/开发者文档/社交/Unity-接入/快速接入',
                component: ComponentCreator('/docs/开发者文档/社交/Unity-接入/快速接入', '55e'),
                exact: true
              },
              {
                path: '/docs/开发者文档/社交/功能介绍',
                component: ComponentCreator('/docs/开发者文档/社交/功能介绍', 'e1f'),
                exact: true
              },
              {
                path: '/docs/开发者文档/社交/服务端接入/Go-SDK',
                component: ComponentCreator('/docs/开发者文档/社交/服务端接入/Go-SDK', 'f8e'),
                exact: true
              },
              {
                path: '/docs/开发者文档/社交/服务端接入/服务端-API',
                component: ComponentCreator('/docs/开发者文档/社交/服务端接入/服务端-API', '83c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/社交/鸿蒙社交/快速接入-团结版',
                component: ComponentCreator('/docs/开发者文档/社交/鸿蒙社交/快速接入-团结版', '46c'),
                exact: true
              },
              {
                path: '/docs/开发者文档/视频广告/功能介绍',
                component: ComponentCreator('/docs/开发者文档/视频广告/功能介绍', 'f15'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/视频广告/小游戏广告接入',
                component: ComponentCreator('/docs/开发者文档/视频广告/小游戏广告接入', 'c1d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/福利码/Android',
                component: ComponentCreator('/docs/开发者文档/福利码/Android', 'e46'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/福利码/iOS',
                component: ComponentCreator('/docs/开发者文档/福利码/iOS', '177'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/福利码/Javascript-接入/快速接入',
                component: ComponentCreator('/docs/开发者文档/福利码/Javascript-接入/快速接入', '79b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/福利码/Unity接入/快速开始',
                component: ComponentCreator('/docs/开发者文档/福利码/Unity接入/快速开始', 'c64'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/福利码/功能介绍',
                component: ComponentCreator('/docs/开发者文档/福利码/功能介绍', '79c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/福利码/快速接入',
                component: ComponentCreator('/docs/开发者文档/福利码/快速接入', '4e8'),
                exact: true
              },
              {
                path: '/docs/开发者文档/福利码/服务端API接口',
                component: ComponentCreator('/docs/开发者文档/福利码/服务端API接口', '374'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/福利码/鸿蒙接入/快速接入-原生版',
                component: ComponentCreator('/docs/开发者文档/福利码/鸿蒙接入/快速接入-原生版', 'a76'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/福利码/鸿蒙接入/快速接入-团结版',
                component: ComponentCreator('/docs/开发者文档/福利码/鸿蒙接入/快速接入-团结版', 'f67'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/订阅消息/微信/微信小游戏发送订阅消息',
                component: ComponentCreator('/docs/开发者文档/订阅消息/微信/微信小游戏发送订阅消息', '008'),
                exact: true
              },
              {
                path: '/docs/开发者文档/订阅消息/微信/服务端回调',
                component: ComponentCreator('/docs/开发者文档/订阅消息/微信/服务端回调', 'fd1'),
                exact: true
              },
              {
                path: '/docs/开发者文档/设备信息/JavaScript-接入',
                component: ComponentCreator('/docs/开发者文档/设备信息/JavaScript-接入', 'c6a'),
                exact: true
              },
              {
                path: '/docs/开发者文档/设备信息/Unity接入/快速开始',
                component: ComponentCreator('/docs/开发者文档/设备信息/Unity接入/快速开始', 'cd3'),
                exact: true
              },
              {
                path: '/docs/开发者文档/设备信息/快速接入',
                component: ComponentCreator('/docs/开发者文档/设备信息/快速接入', 'a22'),
                exact: true
              },
              {
                path: '/docs/开发者文档/重要通知/支付合规调整',
                component: ComponentCreator('/docs/开发者文档/重要通知/支付合规调整', '088'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/重要通知/苹果隐私策略-PrivacyInfo-xcprivacy',
                component: ComponentCreator('/docs/开发者文档/重要通知/苹果隐私策略-PrivacyInfo-xcprivacy', '7be'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/开发者文档/防沉迷/Android-防沉迷/快速接入',
                component: ComponentCreator('/docs/开发者文档/防沉迷/Android-防沉迷/快速接入', '16d'),
                exact: true
              },
              {
                path: '/docs/开发者文档/防沉迷/iOS-防沉迷/快速接入',
                component: ComponentCreator('/docs/开发者文档/防沉迷/iOS-防沉迷/快速接入', '971'),
                exact: true
              },
              {
                path: '/docs/开发者文档/防沉迷/Unity-防沉迷/快速接入',
                component: ComponentCreator('/docs/开发者文档/防沉迷/Unity-防沉迷/快速接入', '946'),
                exact: true
              },
              {
                path: '/docs/开发者文档/防沉迷/功能介绍',
                component: ComponentCreator('/docs/开发者文档/防沉迷/功能介绍', '31e'),
                exact: true
              },
              {
                path: '/docs/开发者文档/防沉迷/常见问题',
                component: ComponentCreator('/docs/开发者文档/防沉迷/常见问题', '615'),
                exact: true
              },
              {
                path: '/docs/开发者文档/防沉迷/快速接入',
                component: ComponentCreator('/docs/开发者文档/防沉迷/快速接入', '192'),
                exact: true
              },
              {
                path: '/docs/开发者文档/防沉迷/鸿蒙-防沉迷/快速接入',
                component: ComponentCreator('/docs/开发者文档/防沉迷/鸿蒙-防沉迷/快速接入', 'dc6'),
                exact: true
              },
              {
                path: '/docs/开发者文档/风控检测/Android/模拟器检测',
                component: ComponentCreator('/docs/开发者文档/风控检测/Android/模拟器检测', 'ce6'),
                exact: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
