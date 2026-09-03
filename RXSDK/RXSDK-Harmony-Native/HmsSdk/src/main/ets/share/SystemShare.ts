import { ShareParams } from "../types/Index";
import { IShareTarget } from "./ISharableTarget";
import { common, Context } from "@kit.AbilityKit";
import { systemShare } from "@kit.ShareKit";
import { ShareObject } from "./ShareObject";
import { Logger } from "../utils/Logger";

export default class SystemShare implements IShareTarget {
  async doShare(params: ShareParams, context: Context): Promise<void> {
    let data = await new ShareObject(params).toSystemShareData()
    let controller: systemShare.ShareController = new systemShare.ShareController(data);

     let options : systemShare.ShareControllerOptions = {
      previewMode: systemShare.SharePreviewMode.DETAIL,
      selectionMode: systemShare.SelectionMode.SINGLE
    };

 // data.addRecord({
 //      utd: utd.UniformDataType.PNG,
 //      uri: 'file://.../test.png'
 //    });
 //     systemShare.getWant(data)
 //      .then((want) => {
 //        console.info('want = ', JSON.stringify(want));
 //        session!.terminateSelfWithResult({
 //          resultCode: 2,
 //          want: want
 //        })
 //      })
 //      .catch((error: BusinessError) => {
 //        console.error(`Failed to getWant. Code: ${error.code}, message: ${error.message}`);
 //      });
 //    配置预览模式
 //    systemShare.getWant(data,options)
 //      .then((want) => {
 //        console.info('want = ', JSON.stringify(want));
 //        session!.terminateSelfWithResult({
 //          resultCode: 2,
 //          want: want
 //        })
 //      })
 //      .catch((error: BusinessError) => {
 //        console.error(`Failed to getWant. Code: ${error.code}, message: ${error.message}`);
 //      });

    return controller.show(context as common.UIAbilityContext, {
      selectionMode: systemShare.SelectionMode.SINGLE,
      previewMode: systemShare.SharePreviewMode.DEFAULT,
    })
  }
}