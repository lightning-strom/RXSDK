import prompt from '@ohos.promptAction'
import { Logger } from './Logger'

class ToastUtil {
  constructor() {
  }

  showToast(message: string, duration?: number) {
    if (message) {
      Logger.debug(message)
      try {
        prompt.showToast({ message, duration })
      } catch (e) {
        console.log(e)
      }
    }
  }
}

export default new ToastUtil()