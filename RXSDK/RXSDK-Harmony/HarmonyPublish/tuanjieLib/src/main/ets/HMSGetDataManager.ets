import hilog from '@ohos.hilog';

export default class HMSGetDataManager {
 

    public GetData(key:string,value:string):string{
        try{
            let info:ESObject = globalThis.sdkInfo;
            let ret:string = value;
            if(info&&info.hasOwnProperty(key)&&info[key]!==undefined){
                ret=info[key];
            }
            hilog.info(0x0000,"Get data","Get data success"+ret);
            return ret;
        }
        catch(error){
            hilog.info(0x0000,"Get data","Get data faild"+error);
            return value;
        }
    }
    

    public static getInstance() {
        return new HMSGetDataManager();
    }
}



export function RegisterHMSGetDataManager() {
    let register: Record<string, Object> = {};
    register["HMSGetDataManager"] = HMSGetDataManager;
    return register;
}