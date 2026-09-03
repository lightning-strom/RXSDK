import { CpBean } from '../common/Types';

export const ConfigList: CpBean[] = [
  {
    desc: "114",
    cpId: "114",
    productId: "1002",
    channelId: "100",
    baseUrls: ["https://cn-api-test.ruixueyun.com"],
    privacyEnable: true,
    // privacy: this.privacy
  },
  {
    desc: "119",
    cpId: "119",
    productId: "1002",
    channelId: "1000",
    baseUrls: ["http://os-api-test.ruixueyun.com"],
    privacyEnable: true,
    // privacy: this.privacy
  }, {
  desc: "白帽子",
  cpId: "1000315",
  productId: "1002",
  channelId: "harmony",
  baseUrls: ["https://tlhizf.jiaxianghudong.com"],
  privacyEnable: true,
  // privacy: this.privacy
},
  {
    desc: "捕鱼",
    cpId: "1000038",
    productId: "264",
    channelId: "214",
    baseUrls: ["https://yh9gc7be1n.hitoffapp.com"],
    privacyEnable: true,
    // privacy: this.privacy
  },  {
    desc: "家乡",
    cpId: "1000101",
    productId: "1002",
    channelId: "214",
    baseUrls: ["https://iiwfmic.weilekuiming.com"],
    privacyEnable: true,
    // privacy: this.privacy
  },
  {
    desc: "梦想家园派对",
    cpId: "1000197",
    productId: "198",
    channelId: "214",
    baseUrls: ["https://winykn.jiaxiangyouxi.com"],
    privacyEnable: true,
  },
  {
    desc: "四川",
    cpId: "1000102",
    productId: "142",
    channelId: "214",
    baseUrls: ["https://umusblhbv.wjhmqn.com"],
    privacyEnable: true,
    // privacy: this.privacy
  },
  {
    desc: "斗地主",
    cpId: "1000103",
    productId: "34",
    channelId: "214",
    baseUrls: ["https://gochsyj.pwypyq.com/", "https://gochsyj.dtnanb.com/"],
    privacyEnable: true,
    // privacy: this.privacy
  }
];


export function ConfigByCpid(cpid, productId?, channelId?): CpBean {
  const result = ConfigList.find((item) => {
    if (item.cpId === cpid) {
      if (productId !== undefined) {
        if (productId === item.productId) {
          if (channelId !== undefined) {
            return channelId === item.channelId;
          }
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  });
  return result || null;
}
