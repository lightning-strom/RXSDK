import prompt from "@ohos:promptAction";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
class ToastUtil {
    constructor() {
    }
    showToast(s196: string, t196?: number) {
        if (s196) {
            Logger.debug(s196);
            try {
                prompt.showToast({ message: s196, duration: t196 });
            }
            catch (u196) {
                console.log(u196);
            }
        }
    }
}
export default new ToastUtil();
