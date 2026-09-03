declare class SdkSocial {
    static instance: SdkSocial;
    static get I(): SdkSocial;
    private refreshSession;
    setcustom(params: {
        custom: string;
    }, { complete }: IMethodParams): Promise<void>;
    addRelation(params: IaddRelation, { complete }: IMethodParams): Promise<void>;
    deleteRelation(params: IdeleteRelation, { complete }: IMethodParams): Promise<void>;
    updateremarks(params: Iupdateremarks, { complete }: IMethodParams): Promise<void>;
    hasRelation(params: IHasRelation, { complete }: IMethodParams): Promise<void>;
    relationList(params: Irelationlists, { complete }: IMethodParams): Promise<void>;
    addFriend(params: IaddFriend, { complete }: IMethodParams): Promise<void>;
    delfriend(params: IdeleFriend, { complete }: IMethodParams): Promise<void>;
    updatefriendremarks(params: Iupdatefriendremarks, { complete }: IMethodParams): Promise<void>;
    isfriend(params: Iisfriend, { complete }: IMethodParams): Promise<void>;
    friends({ complete }: IMethodParams): Promise<void>;
    /**
     * 排行榜相关接口
     */
    addscore(params: Iaddscroe, { complete }: IMethodParams): Promise<void>;
    setscore(params: Iaddscroe, { complete }: IMethodParams): Promise<void>;
    queryuserrank(params: queryuserrank, { complete }: IMethodParams): Promise<void>;
    getranklist(params: IgetranklistLimit, { complete }: IMethodParams): Promise<void>;
    friendsrank(params: Igetranklist, { complete }: IMethodParams): Promise<void>;
    /**
     * 开放数据相关接口
     */
    authorizeWxFriendInteraction(callback?: Partial<IMethodParams>): Promise<true | void>;
    getUserInteractiveStorage(params: FriendInteractionStorage, { complete }: IMethodParams): Promise<void>;
    authorizeWxGameClubData(callback?: Partial<IMethodParams>): Promise<true | void>;
    getGameClubData(params: GameClubDataParams, { complete }: IMethodParams): Promise<void>;
    setUserCloudStorage(params: {
        KVDataList: KVData[];
    }, { complete }: IMethodParams): Promise<void>;
    getUserCloudStorage(params: FriendInteractionStorage, { complete }: IMethodParams): Promise<void>;
    removeUserCloudStorage(params: FriendInteractionStorage, { complete }: IMethodParams): Promise<void>;
    getUserCloudStorageKeys({ complete }: IMethodParams): Promise<void>;
    getFriendCloudStorage(params: FriendInteractionStorage, { complete }: IMethodParams): Promise<void>;
    getPotentialFriendList({ complete }: IMethodParams): Promise<void>;
    refreshSessionFunc(): Promise<1 | -1>;
}
export default SdkSocial;
