// @keepTs
// @ts-nocheck
import { BUILD_MODE_NAME, DEBUG, HAR_VERSION, TARGET_NAME } from "@normalized:N&&&hmssdk/BuildProfile&4.0.0";
export default class SDKInfo {
    static readonly VERSION = HAR_VERSION;
    static readonly BUILD_MODE = BUILD_MODE_NAME;
    static readonly DEBUG = DEBUG;
    static readonly TARGET = TARGET_NAME;
}
