interface ucLogin {
    login_openid?: string;
    method: 'minigame_uc';
    ext?: {
        [key: string]: any;
    };
}
type IpayForuc = Omit<IpayParmas, 'openid'>;
interface ucTrackForReq {
    type: 'track';
    time: string;
    distinct_id: string;
    devicecode: string;
    event: string;
    uuid: string;
    platform_id: 4;
    cpid: number;
    product_id?: string;
    channel_id?: string;
    ip?: string;
    sub_channel_id?: string;
    properties?: {
        [key: string]: any;
    };
}
type ucRewardedAdParams = {
    adUnitId: string;
    isCheck?: boolean;
};
