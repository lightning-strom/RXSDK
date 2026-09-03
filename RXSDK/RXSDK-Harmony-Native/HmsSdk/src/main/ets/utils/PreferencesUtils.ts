/*
 * Copyright (c) 2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import preferences from '@ohos.data.preferences'
import { Logger } from './Logger'

const TAG: string = 'rxsdk'
const PREFERENCES_NAME: string = 'rxsdk_prefs'

class PreferencesUtils {
  private mPreferences: preferences.Preferences | undefined = undefined

  async lazyInit(context: any) {
    if (this.mPreferences === undefined && context) {
      this.mPreferences = await preferences.getPreferences(context, PREFERENCES_NAME)
    }
  }

  async get(key: string, context?: any) {
    await this.lazyInit(context)
    if (this.mPreferences) {
      return await this.mPreferences.get(key, null)
    } else {
      return Promise.reject("preferences not init")
    }
  }

  async put(key: string, value: string, context?: any) {
    Logger.info(TAG, `set ${key}`)
    await this.lazyInit(context)
    if (this.mPreferences) {
      await this.mPreferences.put(key, value)
      await this.mPreferences.flush()
      Logger.debug(TAG, `put  end` + value)
    } else {
      return Promise.reject("preferences not init")
    }
  }
}

export default new PreferencesUtils()