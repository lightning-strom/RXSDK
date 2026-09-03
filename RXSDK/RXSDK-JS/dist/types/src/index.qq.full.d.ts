import SdkSocial from './index.social';
import SdkQQ from './index.qq';
declare class SdkQQFull extends SdkQQ {
    constructor(initParams: ISdkInitParams);
    static get social(): SdkSocial;
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
}
export default SdkQQFull;
