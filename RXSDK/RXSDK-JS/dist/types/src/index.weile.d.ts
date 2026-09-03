import SdkCommon from '@/index.common';
declare class SdkWeiLe extends SdkCommon {
    private __queries;
    private __sdk;
    __type: SelfChannel;
    constructor(params: ISdkParams);
    setFormChannel(): void;
    private __h5Init;
    login({ complete }: IMethodParams): Promise<void>;
    closeGame(methodParams?: IMethodParams): Promise<void>;
    pay({ complete }: IMethodParams, data: IRequestPay): Promise<void>;
    getBeanNumber({ complete }: IMethodParams): Promise<void>;
    getIsPlayingGame({ complete }: IMethodParams): Promise<void>;
    getDiamondNumber({ complete }: IMethodParams): Promise<void>;
    showDiamondStore({ complete }: IMethodParams): Promise<void>;
    roleLogin({ complete }: IMethodParams, data: RoleLoginParams): Promise<void>;
    share({ complete }: IMethodParams, data: IRequestShareData): Promise<void>;
    ad({ complete }: IMethodParams, data: IRequestAdData): Promise<void>;
}
export default SdkWeiLe;
