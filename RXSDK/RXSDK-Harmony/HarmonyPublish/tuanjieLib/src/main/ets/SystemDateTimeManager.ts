import systemDateTime from '@ohos.systemDateTime';
import { BusinessError } from '@ohos.base';

export default class SystemDateTimeManager {
  public static getInstance(): SystemDateTimeManager {
    return new SystemDateTimeManager();
  }

  public getTimezone(): string {
    try {
      let timezone = systemDateTime.getTimezoneSync();
      console.log(`timezone: ==>  ${timezone}`)
      return timezone;
    } catch (e) {
      let error = e as BusinessError;
      console.info(`Failed to get timezone. message: ${error.message}, code: ${error.code}`);
      console.info(`return default timezone: 'Asia/Shanghai'.`);
      return 'Asia/Shanghai';
    }

  }
}


export function RegisterSystemDateTimeManager() {
  var register = {};
  register["SystemDateTimeManager"] = SystemDateTimeManager;
  return register;
}