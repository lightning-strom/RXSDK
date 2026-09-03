import SdkWegame from '@/index.wegame';
declare class Demo<T extends SdkWegame> {
    sdk: T;
    constructor(sdk: any);
    login: () => void;
    pay: () => void;
    createContactButton: () => void;
    track: () => void;
    share: () => void;
    startScreenRecord: () => void;
    stopScreenRecord: () => void;
    shareScreenRecord: () => void;
    authenticateRealName: (complete: any) => void;
    rewardedVideoAd: () => void;
}
export default Demo;
