import { RXRequest } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RCallback, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import type { OssConfigBean } from './OssClient';
import OssClientAli from "@normalized:N&&&hmssdk/src/main/ets/oss/OssClientAli&4.0.0";
import OssClientTencent from "@normalized:N&&&hmssdk/src/main/ets/oss/OssClientTencent&4.0.0";
import OssClientAws from "@normalized:N&&&hmssdk/src/main/ets/oss/OssClientAws&4.0.0";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXUtil&4.0.0";
import { FileUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/FileUtil&4.0.0";
import type { Context } from "@ohos:abilityAccessCtrl";
import DateTime from "@normalized:N&&&hmssdk/src/main/ets/utils/DateTime&4.0.0";
enum OSS_API {
    STS = "/v1/thirdparty/api/oss_sts"
}
enum Provider {
    ALI = "ali",
    TENCENT = "tencent",
    AWS = "aws"
}
class Oss {
    config: OssConfigBean = {
        "provider": "tencent",
        "domain": "https://haiqi-test-1319527102.cos.ap-beijing.myqcloud.com",
        "region": "ap-beijing",
        "bucket": "haiqi-test-1319527102",
        "credentials": {
            "access_key_secret": "5k16GRexkq+bevuic3DvevyoNY4j4s/JcysLEsmlhvs=",
            "start_unix_time": 1734079812,
            "expiration": "2024-12-13 11:50:12",
            "expiration_unix_time": 1734090612,
            "access_key_id": "AKIDXJJbL8vUVHrZM01AqLAZkq_VQmnUFVytPZo1JadQtok53J2Y8GuRjgQyOXKJqka1",
            "security_token": "CdtPuF61DsrTrvypi85bIDK8uVz6To3a7071de07a472bfcc9c93f5964b6d73f1UT0_7pxKaX9hSUFyjpqXUlxeHI4LubnGEbRLPBRS1AfAN4s1N4RIiB6hXaHlmMxqGu_G-E48-6txMYzjBxlrg23wXWPEKzKtAbz1S844s5IQW3KSMeqq3_xn624O7e2rw2TQQwCW7vzDRdcsZGywQ-_qqJTB36fdjOIay8tbt3MPc4B8NT5T2FaLlUywbXEN9ZD3fJKyqj6sa74xgHrL0r2LJK9uILMqlUDTBWFEnczwiP7cNxaR63RU-VtubGhOm82MC-7-V05tUa1DJ-_b2Qvc4gNO0vS73KIXldt2Cr4g2xI2Jl-qa7F1wnm6wc3ggY8oQtb4tXcDo8P51PMt61CT_KBD3trP5jq3QMqNNGpNjCK_zF70q5s-w4f_--VjLkTyiBpDx2rxtHBHEmR3nBE9cHkV3KNLMsAd4Dja6Uboa1mxhHxQRxBVllraYoY45QO4Xs6xCQUtNcS1uhBP4jBm7r5sfuy-JsRFyJLxo7g5M_UUoFlPIxMUhocX9Ad7umFfkxS3_wUMDb4lCy5F57q9y0U8MNRDvE1tpR1cLrRQ4HdcZUSqItGaHVe7lTvWK840hiX-yEX3GIfZjSJFHF86jwdrah1nZATxsBJfdkT-NUP1-uFlEb660MjSNXG87GcGIESv_Dysy1a1uTJjOK-NzL5QGN-sRnECOg2FO83jqbq4pbsyiBLqo6t84NQAO0YEBH1Ek6q1hZq15PvnQ4p8AiEfFjndZnGqGtfKYQUYCM8v7zvUhRxXfwFoqNut",
            "assumed_role": "",
            "arn": ""
        }
    };
    public async getConfigData(v62?: RCallback<OssConfigBean>) {
        return await RXRequest.get<OssConfigBean>(OSS_API.STS, null, null, v62);
    }
    public async uploadData(n62: ArrayBuffer, o62: string, p62?: RCallback): Promise<RXResult<object>> {
        try {
            if (!n62 || n62.byteLength <= 0) {
                let u62 = { code: RXErrorCode.PARAMETER_ERROR, message: "File size is invalid or empty." };
                p62?.(u62);
                return u62;
            }
            let r62: RXResult<OssConfigBean> = await this.getConfigData();
            let s62;
            if (r62.code == 0) {
                let t62 = r62.data?.provider;
                if (t62 == Provider.ALI) {
                    s62 = await new OssClientAli(r62.data).putObject(o62, n62, p62);
                }
                else if (t62 == Provider.TENCENT) {
                    s62 = await new OssClientTencent(r62.data).putObject(o62, n62, p62);
                }
                else if (t62 == Provider.AWS) {
                    s62 = await new OssClientAws(r62.data).putObject(o62, n62, p62);
                }
                return s62;
            }
            else {
                p62?.(r62);
                return r62;
            }
        }
        catch (q62) {
            Logger.e(q62);
            p62?.(RXUtil.formatResult(q62));
        }
    }
    public async uploadFile(h62: Context, i62: string, j62?: string, k62?: RCallback): Promise<RXResult<object>> {
        try {
            let m62: ArrayBuffer = await FileUtil.readFile(h62, i62);
            j62 ??= `file_${DateTime.getFormattedDate()}_` + FileUtil.getFileName(i62);
            return this.uploadData(m62, j62, k62);
        }
        catch (l62) {
            Logger.e(l62);
            k62?.(RXUtil.formatResult(l62));
        }
    }
}
export default new Oss();
