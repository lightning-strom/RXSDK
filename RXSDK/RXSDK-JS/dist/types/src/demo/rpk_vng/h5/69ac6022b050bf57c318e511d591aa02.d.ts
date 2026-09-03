interface H5UCLoginParam {
    method: 'minigame_uc';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5UCPayParam {
    pay_type: 'minigame_uc';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H54399LoginParam {
    method: 'minigame_4399h5';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H54399PayParam {
    pay_type: 'minigame_4399h5';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H5QunheiLoginParam {
    method: 'minigame_qunhei';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5QunheiPayParam {
    pay_type: 'minigame_qunhei';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H5QunheiVerifyParam {
    type: 1 | 2 | 3;
}
interface H5QunheiServerAddParam {
    unid: string;
    gid: number;
    servernum: number;
    kftime: number;
    ddtime: number;
    sign: number;
}
interface H5QunheiUpOnlineParam {
    userid: string;
    gid: number;
    type: number;
    serverid: number;
    time: number;
    logintime: number;
    sign: number;
}
interface H5QunheiUpRoleParam {
    act: number;
    username: string;
    serverid: number;
    servername: string;
    rolename: string;
    roleid: number;
    level: number;
    power: number;
    vip: number;
    rolecreatetime: string;
    ver: string;
    sign: string;
}
interface H5BaiduLoginParam {
    method: 'minigame_baiduh5';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5BaiduPayParam {
    pay_type: 'minigame_baiduh5';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
}
interface H5QiqiLoginParam {
    method: 'minigame_77';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5QiqiPayParam {
    pay_type: 'minigame_77';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H5XunleiLoginParam {
    method: 'minigame_xunlei';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5XunleiPayParam {
    pay_type: 'minigame_xunlei';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H5XunleiSyncServerParam {
    game_id: string;
    time: number;
    servers: string;
    sign: string;
}
interface H5XunleiMessageSyncParam {
    game_id: string;
    account: string;
    server_id: string;
    server_create_time: string;
    role_id: string;
    role_name: string;
    msg: string;
    msg_type: 1 | 2 | 3;
    sign: string;
    ts: number;
}
interface H5XunleiActionReportcParam {
    gameId: string;
    event: 1 | 2;
    roleId: string;
    roleName: string;
    serverId?: string;
    serverName?: string;
}
interface H5ZuiyouLoginParam {
    method: 'minigame_zuiyou';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5ZuiyouPayParam {
    pay_type: 'minigame_zuiyou';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H5IQiYiLoginParam {
    method: 'minigame_zuiyou';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5IQiYiPayParam {
    pay_type: 'minigame_zuiyou';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H5HaluoLoginParam {
    method: 'minigame_haluo';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5HaluoPayParam {
    pay_type: 'minigame_haluo';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H5VngLoginParam {
    method: 'minigame_xunlei';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5VngPayParam {
    pay_type: 'minigame_xunlei';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    serverId: string;
    roleId: string;
    roleName: string;
    addInfo: string;
    exchange?: boolean;
}
interface H5QuickLoginParam {
    method: 'minigame_quick';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5QuickPayParam {
    pay_type: 'minigame_xunlei';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    userRoleId: string;
    userRoleName: string;
    serverId: number;
    userServer: string;
    userLevel: number;
    quantifier: string;
    exchange?: boolean;
}
interface H5QuickRoleReportParam {
    isCreateRole: boolean;
    roleCreateTime: number;
    serverId: number;
    serverName: string;
    userRoleId: string;
    userRoleName: string;
    userRoleBalance: number;
    vipLevel: number;
    userRoleLevel: number;
    partyId: number;
    partyName: string;
    gameRoleGender?: string;
    gameRolePower?: string;
    partyRoleId?: number;
    partyRoleName?: string;
    professionId?: string;
    profession?: string;
    friendlist?: string;
}
interface H5AwyLoginParam {
    method: 'minigame_aiweiyou';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5AwyPayParam {
    pay_type: 'minigame_aiweiyou';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H5SimoLoginParam {
    method: 'minigame_007';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5SimoPayParam {
    pay_type: 'minigame_007';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    server_id: string;
    server_name: string;
    role_id: string;
    role_name: string;
    role_level: number;
    exchange?: boolean;
}
interface H5SimoUpRoleParam {
    server_id: string;
    server_name: string;
    role_action: 'create' | 'enter' | 'up_level';
    role_id: string;
    role_name: string;
    role_level: number;
    combat_number: string;
    vip: number;
    timestamp: number;
    sign: string;
}
interface InitH5Params {
    productId: string;
    channelId: string;
    cpid: string;
    baseUrlList: string[];
    complete: (data: any) => void;
    gameId?: string | number;
    appkey?: string;
    productCode?: string;
    productKey?: string;
    single_player_mode?: boolean;
    logSwitch?: boolean;
}
interface H5TrackForReq {
    type: 'track';
    time: string;
    distinct_id: string;
    devicecode: string;
    event: string;
    uuid: string;
    platform_id: 4 | 3;
    cpid: number;
    product_id?: string;
    channel_id?: string;
    ip?: string;
    sub_channel_id?: string;
    properties?: {
        [key: string]: any;
    };
}
interface H5UCGetShareData {
    query?: string;
    target?: string;
}
interface H5AwyShareData {
    imageUrl?: string;
    query?: string;
}
interface H5Response<T = unknown> {
    code: number;
    msg: string;
    data?: T;
}
interface H5ResponseLogin extends H5Response {
    tid: string;
    token: string;
    openid: string;
    username: string;
    nickname: string;
    avatarUrl: string;
    sex: 0 | 1;
    /** 0:女; 1:男 **/
    timestamp: number;
    ext?: {
        channel_userid?: string;
    } & any;
    regtime: string;
    wxOpenid?: string;
    /** 三方平台的唯一标识 */
    uid?: number;
    source_openid: string;
    source: string;
    user_flag: string;
    cp_user_id: string;
}
interface H5MethodParams<T = any> {
    complete: (data: T) => void;
    fail?: (err: T) => void;
}
interface H5getShareData {
    func?: string;
    transmits?: string;
    imageUrl?: string;
    title?: string;
    query?: string;
    region?: string;
    readCache?: boolean;
}
interface H5sendCaptcha {
    email?: string;
    phone?: string;
    purpose: 'register' | 'bindphone' | 'unbindphone' | 'resetpwd' | 'bindemail' | 'unbindemail' | 'login' | 'setpwd';
}
interface H5BindPhone {
    phone: string;
    captcha_code: string;
    password: string;
}
type H5unBindPhone = Omit<H5BindPhone, 'password'>;
type H5BindEmail = Omit<H5BindPhone, 'phone'> & {
    email: string;
};
type H5unBindEmail = Omit<H5BindEmail, 'password'>;
type H5ReqMediaCheckAsync = {
    urls: string[];
    /**
     * 阿里鉴黄规则
     *    porn：图片智能鉴黄
     *    terrorism：图片暴恐涉政
     *    ad：图文违规
     *    qrcode：图片二维码
     *    live：图片不良场景
     *    logo：图片logo
     */
    scenes: string[];
};
type H5MediaCheckAsyncReqParams = Omit<H5ReqMediaCheckAsync, 'version' | 'openid'>;
type H5megSecCheck = {
    content: string;
    version: 2;
    scene: 1 | 2 | 3 | 4;
    openid: string;
    title?: string;
    nickname?: string;
    signature?: string;
};
type H5OmitMegSecCheck = Omit<H5megSecCheck, 'version' | 'openid'>;
type H5ScriptType = 'js' | 'lua' | 'u3d';
type H5OutputFileSuffix = 'json' | 'lua';
interface H5CheckVersionParams {
    type?: H5ScriptType;
    format?: H5OutputFileSuffix;
}
interface H5CheckAppVersion extends H5CheckVersionParams {
    clientversion: string;
    devicecode?: string;
    region?: number;
}
interface H5CheckVersion extends H5CheckAppVersion {
    games?: object;
    activities?: object;
}
interface H5CheckGameVersion extends H5CheckVersionParams {
    gameid: number;
    gameversion: number;
    gamecheckversion?: number;
}
interface H5CheckActivityVersion extends H5CheckVersionParams {
    activityshortname: string;
    activityversion: number;
    activitycheckversion?: number;
}
interface H5ReqBusinessData {
    window_key: string;
    event: string;
    before_event?: string;
}
interface H5ReqBusinessOrder {
    trade_no: string;
    sign: string;
}
interface H5ReqCreateFeedback {
    product_id?: string;
    channel_id?: string;
    game_id: number;
    kind_id: number;
    kind_name: string;
    priority: 1 | 2;
    content: string;
    picture: string;
    player_gameid: string;
    send_voided_mails: 1 | 2;
}
interface H5ReqFeedbackEval {
    key_number: number;
    pleased_status: number;
    reason: string;
}
interface H5HelpcenterQuestionReq {
    id: number;
}
interface H5HelpcenterResolution {
    id: number;
    status: boolean;
}
interface H5addRelation {
    target: string;
    types: {
        [key: string]: boolean;
    };
    target_remarks?: string;
    user_remarks?: string;
}
type h5_somes = 'target_remarks' | 'user_remarks';
type h5_some3 = 'types';
type h5_somes2 = 'user_remarks';
type H5deleteRelation = Omit<H5addRelation, h5_somes>;
type H5updateremarks = Omit<H5addRelation, h5_somes2 | h5_some3> & H5relationlists;
type H5HasRelation = Omit<H5addRelation, h5_somes | h5_some3> & H5relationlists;
type H5addFriend = Omit<H5addRelation, h5_some3>;
type H5relationlists = {
    type: string;
};
type H5deleFriend = Pick<H5addRelation, 'target'>;
type H5updatefriendremarks = Pick<H5addRelation, 'target' | 'target_remarks'>;
type H5isfriend = Pick<H5addRelation, 'target'>;
type H5addscroe = {
    rank_id: string;
    score: number;
};
type H5getranklist = {
    rank_id: string;
};
type H5getranklistLimit = H5getranklist & {
    start_rank: number;
    end_rank: number;
};
interface H5getShareData {
    func?: string;
    transmits?: string;
    imageUrl?: string;
    title?: string;
    query?: string;
    region?: string;
    readCache?: boolean;
    custom_ext?: any;
}
interface H5ReqShareScheduleInit {
    funcs?: string[];
    type?: string;
    open_id?: string;
}
interface H5ReqShareScheduleReport {
    product_id?: string;
    channel_id?: string;
    func: string;
    platform?: string;
    type?: string;
    open_id?: string;
    sub_channel_id?: string;
    region?: string;
    transmits: string;
    scheduling_type: string;
    scheduling_event: boolean;
    properties?: object;
}
interface H5OppoLoginParam {
    method: 'minigame_oppo';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5OppoPayParam {
    count?: number;
    onlyGetOrder?: boolean;
    pay_type: 'minigame_oppo';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H5VivoLoginParam {
    method: 'minigame_oppo';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5VivoPayParam {
    onlyGetOrder?: boolean;
    pay_type: 'minigame_oppo';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H5XiaomiLoginParam {
    method: 'minigame_xiaomi';
    login_openid?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5XiaomiPayParam {
    onlyGetOrder?: boolean;
    pay_type: 'minigame_xiaomi';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H5HuaweiLoginParam {
    login_openid?: string;
    method?: string;
    ext?: {
        [key: string]: any;
    };
}
interface H5HuaweiPayParam {
    onlyGetOrder?: boolean;
    pay_type: 'minigame_huawei';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H5HonorLoginParam {
    login_openid?: string;
    method?: string;
    ext?: {
        [key: string]: any;
    };
    needAuthCode?: boolean;
    isProfileRequired?: boolean;
}
interface H5HonorPayParam {
    onlyGetOrder?: boolean;
    pay_type: 'minigame_honor';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
interface H5RuixueLoginParam {
    login_openid?: string;
    method?: string;
    ext?: {
        [key: string]: any;
    };
    stopCallback?: boolean;
}
interface InitOverseaH5Params {
    productId: string;
    channelId: string;
    cpid: string;
    baseUrlList: string[];
    overseaChannelList?: string[];
    complete: (data: any) => void;
}
interface H5OverseaLoginParam {
    method: string;
    idToken?: string;
    custom_params?: any;
    google_config: {
        client_id: string;
    };
    apple_config: {
        clientId: string;
        scope: string;
        state: string;
        nonce: string;
        redirectURI: string;
        usePopup: boolean;
    };
    facebook_config: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: boolean;
        app_associated_business: boolean;
        scope: string;
    };
    instagram_config: {
        clientId: string;
        redirectUri?: string;
    };
    tiktok_config: {
        clientKey: string;
        scope?: string;
        redirectUri?: string;
    };
    zalo_config: {
        appId: string;
    };
}
interface H5OverseaShareParams {
    func: string;
    shareData?: any;
    href: string;
    platform: string;
    transmits?: string;
    imageUrl?: string;
    desc?: string;
    content?: string;
    title?: string;
    query?: string;
    needNotFuncQuery?: boolean;
    inviter_region?: string;
    inviter_openid?: string;
}
interface H5RUIXUEPayParam {
    pay_type: 'aums';
    goods_tag: string;
    currency?: 'CNY';
    is_debug?: 0 | 1;
    trade_no: string;
    transmit_args?: string;
    env?: 0 | 1;
    indulge_auth: 0 | 1;
    age?: number;
    notify_url?: string;
    ext: {
        [key: string]: any;
    };
    exchange?: boolean;
}
