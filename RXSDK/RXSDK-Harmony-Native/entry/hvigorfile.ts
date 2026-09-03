import { hapTasks, OhosHapContext, OhosPluginId, Target } from '@ohos/hvigor-ohos-plugin';

import { getNode, hvigor } from '@ohos/hvigor'

const entryNode = getNode(__filename);

entryNode.afterNodeEvaluate(node => {
  const hapContext = node.getContext(OhosPluginId.OHOS_HAP_PLUGIN) as OhosHapContext;
  const moduleJsonOpt = hapContext.getModuleJsonOpt();
  hapContext?.targets((target: Target) => {
    const targetName = target.getTargetName();
    if (!hapContext) {
      return;
    }
    if (targetName === 'ddz') {
      moduleJsonOpt['module']['metadata'] = [...moduleJsonOpt['module']['metadata'], {
        "name": "app_id",
        "value": "5765880207854615923"
      },
        {
          "name": "client_id",
          "value": "111230323"
        }];
    } else if (targetName === 'wljxmj') {
      moduleJsonOpt['module']['metadata'] = [...moduleJsonOpt['module']['metadata'], {
        "name": "app_id",
        "value": "6917568334958783334"
      },
        {
          "name": "client_id",
          "value": "6917568334958783334"
        }];
    } else if (targetName === 'fish') {
      // 捕鱼：AGC OAuth Client ID / APP ID（与 ruixue_tj_unity 对齐）
      moduleJsonOpt['module']['metadata'] = [...moduleJsonOpt['module']['metadata'], {
        "name": "app_id",
        "value": "5765880207855351397"
      },
        {
          "name": "client_id",
          "value": "111965797"
        }];
    } else if (targetName === 'jymxpd') {
      // 梦想家园派对：AGC app_id / client_id
      moduleJsonOpt['module']['metadata'] = [...moduleJsonOpt['module']['metadata'], {
        "name": "app_id",
        "value": "6917603355321208008"
      },
        {
          "name": "client_id",
          "value": "6917603355321208008"
        }];
    } else {
      moduleJsonOpt['module']['metadata'] = [...moduleJsonOpt['module']['metadata'], {
        "name": "app_id",
        "value": "5765880207855131389"
      },
        {
          "name": "client_id",
          "value": "111745789"
        }];
    }
  })
  console.log(moduleJsonOpt['module']['metadata']);
  // 将obj对象设置回上下文对象以使能到构建的过程与结果中
  hapContext.setModuleJsonOpt(moduleJsonOpt);
})

export default {
  system: hapTasks, /* Built-in plugin of Hvigor. It cannot be modified. */
  plugins: []         /* Custom plugin to extend the functionality of Hvigor. */
}
