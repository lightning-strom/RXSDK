// @keepTs
// @ts-nocheck
import systemShare from "@hms:collaboration.systemShare";
import harmonyShare from "@hms:collaboration.harmonyShare";
import type common from "@ohos:app.ability.common";
import utd from "@ohos:data.uniformTypeDescriptor";
import { NearbyTransferService } from "@normalized:N&&&hmssdk/src/main/ets/nearby/NearbyTransferService&4.0.0";
import { GlobalData } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/GlobalData&4.0.0";
import { getVersionName } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/VersionCompare&4.0.0";
import { NearbyLog } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/NearbyLog&4.0.0";
import { copyStoragePath } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/FileUtils&4.0.0";
export class KnockShareService {
    private static instance: KnockShareService;
    public static isSender: boolean;
    public constructor(b53: UIContext) {
        NearbyLog.info(" 碰一碰初始化");
        let c53 = async (d53: harmonyShare.SharableTarget) => {
            NearbyLog.info("监听到华为分享事件");
            let e53 = b53.getHostContext() as common.Context;
            GlobalData.filesDir = e53.filesDir;
            let f53: systemShare.SharedData = new systemShare.SharedData({
                utd: utd.UniformDataType.HYPERLINK,
                content: GlobalData.shareUri + getVersionName(),
                title: "近场快传示例",
                description: "传输下载资源"
            });
            d53.share(f53);
            await NearbyTransferService.getInstance().create(b53);
            NearbyLog.info("拷贝一下。。。");
            copyStoragePath("/data/storage/el2/base/files/test");
        };
        harmonyShare.on('knockShare', c53);
        harmonyShare.on('gesturesShare', c53);
    }
    public static getInstance(a53: UIContext): KnockShareService {
        if (!KnockShareService.instance) {
            KnockShareService.instance = new KnockShareService(a53);
        }
        return KnockShareService.instance;
    }
    public init() {
    }
}
