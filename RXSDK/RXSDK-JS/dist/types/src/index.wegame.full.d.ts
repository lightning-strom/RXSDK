import SdkSocial from './index.social';
import SdkWegame from './index.wegame';
import SdkHelpcenter from './index.helpcenter';
declare class SdkWegameFull extends SdkWegame {
    constructor(initParams: ISdkInitParams);
    static get social(): SdkSocial;
    static get helpcenter(): SdkHelpcenter;
    setcustom(params: {
        custom: string;
    }, callback: IMethodParams): Promise<void>;
    addRelation(params: IaddRelation, callback: IMethodParams): Promise<void>;
    deleteRelation(params: IdeleteRelation, callback: IMethodParams): Promise<void>;
    updateremarks(params: Iupdateremarks, callback: IMethodParams): Promise<void>;
    hasRelation(params: IHasRelation, callback: IMethodParams): Promise<void>;
    relationList(params: Irelationlists, callback: IMethodParams): Promise<void>;
    addFriend(params: IaddFriend, callback: IMethodParams): Promise<void>;
    delfriend(params: IdeleFriend, callback: IMethodParams): Promise<void>;
    updatefriendremarks(params: Iupdatefriendremarks, callback: IMethodParams): Promise<void>;
    isfriend(params: Iisfriend, callback: IMethodParams): Promise<void>;
    friends(callback: IMethodParams): Promise<void>;
    addscore(params: Iaddscroe, callback: IMethodParams): Promise<void>;
    setscore(params: Iaddscroe, callback: IMethodParams): Promise<void>;
    queryuserrank(params: queryuserrank, callback: IMethodParams): Promise<void>;
    getranklist(params: IgetranklistLimit, callback: IMethodParams): Promise<void>;
    friendsrank(params: Igetranklist, callback: IMethodParams): Promise<void>;
    getUserInteractiveStorage(params: FriendInteractionStorage, callback: IMethodParams): Promise<void>;
    getGameClubData(params: GameClubDataParams, callback: IMethodParams): Promise<void>;
    setUserCloudStorage(params: {
        KVDataList: KVData[];
    }, callback: IMethodParams): Promise<void>;
    getUserCloudStorage(params: FriendInteractionStorage, callback: IMethodParams): Promise<void>;
    removeUserCloudStorage(params: FriendInteractionStorage, callback: IMethodParams): Promise<void>;
    getUserCloudStorageKeys(callback: IMethodParams): Promise<void>;
    getFriendCloudStorage(params: FriendInteractionStorage, callback: IMethodParams): Promise<void>;
    getPotentialFriendList(callback: IMethodParams): Promise<void>;
    getHelpcenterMainLayout(callback: IMethodParams): Promise<void>;
    getHelpcenterQuestionLayout(params: HelpcenterQuestionReq, callback: IMethodParams): Promise<void>;
    getHelpcenterInfoLayout(params: HelpcenterQuestionReq, callback: IMethodParams): Promise<void>;
    helpcenterResolution(params: HelpcenterResolution, callback: IMethodParams): Promise<void>;
}
export default SdkWegameFull;
