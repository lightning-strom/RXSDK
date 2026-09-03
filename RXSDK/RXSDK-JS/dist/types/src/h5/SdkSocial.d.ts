declare class SdkSocial {
    static instance: SdkSocial;
    static get I(): SdkSocial;
    private refreshSession;
    setcustom(params: {
        custom: string;
    }, { complete }: H5MethodParams): Promise<void>;
    addRelation(params: H5addRelation, { complete }: H5MethodParams): Promise<void>;
    deleteRelation(params: H5deleteRelation, { complete }: H5MethodParams): Promise<void>;
    updateremarks(params: H5updateremarks, { complete }: H5MethodParams): Promise<void>;
    hasRelation(params: H5HasRelation, { complete }: H5MethodParams): Promise<void>;
    relationList(params: H5relationlists, { complete }: H5MethodParams): Promise<void>;
    addFriend(params: H5addFriend, { complete }: H5MethodParams): Promise<void>;
    delfriend(params: H5deleFriend, { complete }: H5MethodParams): Promise<void>;
    updatefriendremarks(params: H5updatefriendremarks, { complete }: H5MethodParams): Promise<void>;
    isfriend(params: H5isfriend, { complete }: H5MethodParams): Promise<void>;
    friends({ complete }: H5MethodParams): Promise<void>;
    /**
     * 排行榜相关接口
     */
    addscore(params: H5addscroe, { complete }: H5MethodParams): Promise<void>;
    setscore(params: H5addscroe, { complete }: H5MethodParams): Promise<void>;
    queryuserrank(params: queryuserrank, { complete }: H5MethodParams): Promise<void>;
    getranklist(params: H5getranklistLimit, { complete }: H5MethodParams): Promise<void>;
    friendsrank(params: H5getranklist, { complete }: H5MethodParams): Promise<void>;
}
export default SdkSocial;
