
import { RXRequest } from '../net/RXRequest'
import { RCallback, RXCallback, RXErrorCode, RXResult } from '../types/Index'

import { Logger } from '../utils/Logger';
import { OssConfigBean } from './OssClient';

import OssClientAli from './OssClientAli';
import OssClientTencent from './OssClientTencent';
import OssClientAws from './OssClientAws';
import {RXUtil} from '../utils/RXUtil';
import { FileUtil } from '../utils/FileUtil';
import { Context } from '@kit.AbilityKit';
import DateTime from '../utils/DateTime';

enum OSS_API {
  STS = "/v1/thirdparty/api/oss_sts",
}

enum Provider {
  ALI = "ali",
  TENCENT = "tencent",
  AWS = "aws"
}

class Oss {
  // config: OssConfigBean = {
  //   provider: "ali",
  //   domain: "https://rxfile-test.ruixueyun.com",
  //   region: "oss-cn-beijing",
  //   bucket: "haiqi-ruixue-test",
  //   credentials: {
  //     access_key_secret: "7KJ2YK8uosEjVrqxgijGENhhDPJZbP4cJRqRngcTf9jB",
  //     start_unix_time: 0,
  //     expiration: "2024-11-14T09:01:24Z",
  //     expiration_unix_time: 0,
  //     access_key_id: "STS.NU2WxfYKHcVTEcu8LuK99kEBN",
  //     security_token: "CAISxQJ1q6Ft5B2yfSjIr5aHHMLStJRp1JS/R0XE3EwgR7YVhIDprDz2IHhMf3VsCeAWt/s1nm1X7f4YlqZJTJtIfkHfdsp36LJe9A75qCw2HBbvv9I+k5SANTW5KXyShb3/AYjQSNfaZY3eCTTtnTNyxr3XbCirW0ffX7SClZ9gaKZ8PGD6F00kYu1bPQx/ssQXGGLMPPK2SH7Qj3HXEVBjt3gX6wo9y9zmm5LDtUSO0AWhlLBE+t6gGPX+MZkwZqUYesyuwel7epDG1CNt8BVQ/M909vccoWyb4oHNUwAOuU/bbLGMqMcMNhJ4drU3XrJJt+TsVGfASE1edO4dojc63oE9O0y3LOjIS/tQgXsYE/gTQRfq6VUMI+F+JxjPyXcAS1g1+n0ElbTv1FHeR9LiZF80xOHFnHKOVmOJL84huHbiJjMopz2AGoABtRtvbudfadYm5nQKMoFnX1FFdrF/TtGcvLDx/iwsW1B8LNNbiG2IdNwY+AzECvkX36O4NMLQ7S6Ahr0kas1dhu9OgX3P7tAccX3vVAv81Hjp1C8sbxzlziF3GiuDUBGEY1/yI/w/nExAhkB2GDLoPjskqs7bMqDjdhzhZQ9yAhMgAA==",
  //     assumed_role: "300344888172257302:RoleSessionName",
  //     arn: "acs:ram::1177768403679529:role/ruixue-test/RoleSessionName"
  //   }
  // };

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
  }


  public async getConfigData(callback?: RCallback<OssConfigBean>) {
    return await RXRequest.get<OssConfigBean>(OSS_API.STS, null, null, callback)
  }

  public async uploadData(data: ArrayBuffer, objectKey: string, callback?: RCallback): Promise<RXResult<object>> {
    try {
      if (!data || data.byteLength <= 0) {
        let ret = { code: RXErrorCode.PARAMETER_ERROR, message: "File size is invalid or empty." }
        callback?.( ret );
        return ret
      }
      let ret: RXResult<OssConfigBean> = await this.getConfigData();
      let result
      // let c = this.config

      // objectKey="feedback_log/rxuLL14PoXN-AMR6x8UveCzlfPQ1wnGJWpmz8ExV_0"
      //  result = await new OssClientTencent(c).putObject(objectKey, data, callback)
      // Logger.debug("test result:" + result)


      //     let secret = "APy1zPf8qdS7R1M8PtSaRPVw9zEMEE9XZG4etZ4qsX2U"
      //     let stringToSign = `PUT
      //
      // application/octet-stream
      // Fri, 22 Nov 2024 10:11:05 GMT
      // x-oss-security-token:CAISxQJ1q6Ft5B2yfSjIr5f9fcrZp7ZD2Kq8WmLEr3oRedde3IDf2zz2IHhMf3VsCeAWt/s1nm1X7f4YlqZJTJtIfkHfdsp36LJe9A75lmNvTxHvv9I+k5SANTW5KXyShb3/AYjQSNfaZY3eCTTtnTNyxr3XbCirW0ffX7SClZ9gaKZ8PGD6F00kYu1bPQx/ssQXGGLMPPK2SH7Qj3HXEVBjt3gX6wo9y9zmm5LDtUSO0AWhlLBE+t6gGPX+MZkwZqUYesyuwel7epDG1CNt8BVQ/M909vccoWyb4oHNUwAOuU/bbLGMqMcMNhJ4drU3XrJJt+TsVGfASE1edO4dojc63oE9O0y3LOjISzsXlF5t8/gTQRfq6VUMI+F+JxjPyXcAS1g1+n0ElbTv1FHeR9LiZF80xOHFnHKOVmOJL84huOYQnhMopz2AGoABJyDpC1mXz9EC17TcnfJAQfzfwIpmsowBBgTWc64ioup/XjR6Lj7XPQ5Pb9gAD5J7yMVThtWNiyQZJwXjbOwcXWq99D3ub5SsYewaC3hXVXgdjgQRfc10GTZKjs3EcrCPeqxtc0xgxntC7Qes2W/Q7HrtJg6YwY5n8ZDSoQn8uZggAA==/haiqi-ruixue-test/test`    //6B 73 17 20 20 10 10 BE 74 71 E4 ED B1 D0 79 EC 2B 77 16 C2  a3MXICAQEL50ceTtsdB57Ct3FsI=
      //
      //
      //     // Logger.d("test HMAC 原文:" + stringToSign)
      //     // Logger.d("test HMAC 密钥:" + secret)
      //     const signature = await HashUtil.genBase64HmacSha1(stringToSign, secret);
      //     // Logger.d("test HMAC 期望hex:6b731720201010be7471e4edb1d079ec2b7716c2")
      //     Logger.d("test HMAC signature :" + (signature))
      //
      // const signaturetest = await HashUtil.buildSignatureTest(stringToSign, secret);
      // Logger.d("test HMAC signature ttt :" + signaturetest)
      //
      //
      //
      // let keyData = new Uint8Array(buffer.from(secret, 'utf-8').buffer);
      // Logger.d("test uint8 :" + keyData)
      // const encoder = new util.TextEncoder();
      // let u1 = encoder.encodeInto(secret);
      // Logger.d("test uint8:" + u1)

      //7C 87 6C 33 45 CB 09 A0 E1 07 28 12 6D 6E 4F 82 56 31 EC DC
      // const values = [0x7C, 0x87, 0x6C, 0x33, 0x45, 0xCB, 0x09, 0xA0, 0xE1, 0x07, 0x28, 0x12, 0x6D, 0x6E, 0x4F, 0x82, 0x56, 0x31, 0xEC, 0xDC];
      // const uint8Array = new Uint8Array(values);
      //fIdsM0XLCaDhBygSbW5PglYx7Nw=
      // console.info('test HMAC  base64:' + HashUtil.base64Encode(uint8Array))


      if (ret.code == 0) {
        let provider = ret.data?.provider
        if (provider == Provider.ALI) {
          result = await new OssClientAli(ret.data).putObject(objectKey, data, callback)
        } else if (provider == Provider.TENCENT) {
          result = await new OssClientTencent(ret.data).putObject(objectKey, data, callback)
        } else if (provider == Provider.AWS) {
          result = await new OssClientAws(ret.data).putObject(objectKey, data, callback)
        }
        return result
      } else {
        callback?.( ret );
        return ret
      }
    } catch (e) {
      Logger.e(e)
      callback?.(RXUtil.formatResult(e) );
    }

  }

  public async uploadFile(context: Context, filePath: string, objectKey?: string, callback?: RCallback): Promise<RXResult<object>> {
    try {
      let data: ArrayBuffer = await FileUtil.readFile(context, filePath)

      objectKey ??= `file_${DateTime.getFormattedDate()}_` + FileUtil.getFileName(filePath)
      return this.uploadData(data, objectKey, callback)
    } catch (e) {
      Logger.e(e)
      callback?.(RXUtil.formatResult(e) );
    }
  }
}

export default new Oss()