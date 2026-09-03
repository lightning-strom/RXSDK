package com.ruixue.sdk.vk

import android.app.Activity
import android.app.Application
import android.content.Context
import androidx.lifecycle.LifecycleOwner
import com.ruixue.RXJSONCallback
import com.ruixue.error.RXErrorCode
import com.ruixue.logger.RXLogger
import com.ruixue.utils.JSONUtil
import com.vk.id.AccessToken
import com.vk.id.VKID
import com.vk.id.VKIDAuthFail
import com.vk.id.auth.VKIDAuthCallback
import org.json.JSONObject
import java.util.Locale

/**
 * 官方 [VKID] OAuth 2.1 授权桥接（见
 * [迁移说明](https://id.vk.com/about/business/go/docs/en/vkid/latest/vk-id/connection/migration/android/migration-on-oauth-2.1)）。
 *
 * 与 WebView PKCE（code + code_verifier）不同：成功后 ext 为 **access_token**，需瑞雪服务端支持 OAuth 2.1 客户端令牌登录。
 */
object VkIdAuthBridge {

    private const val AUTH_MODE_SDK = "sdk"
    private const val AUTH_MODE_CODE = "code"

    @Volatile
    private var vkidInitialized = false

    @JvmStatic
    fun useOfficialSdk(params: Map<String, Any?>?): Boolean {
        return useOfficialSdk(params, true)
    }

    @JvmStatic
    fun useOfficialSdk(params: Map<String, Any?>?, defaultMode: Boolean): Boolean {
        val mode = extString(params, "vk_auth_mode")?.lowercase(Locale.US)
        if (AUTH_MODE_CODE == mode) {
            return false
        }
        if (AUTH_MODE_SDK == mode) {
            return true
        }
        // 未显式指定时默认走官方 VK ID SDK；显式 code 才回退 WebView PKCE。
        return defaultMode
    }

    @JvmStatic
    fun initVkid(context: Context): Boolean {
        if (vkidInitialized) {
            return true
        }
        val app = context.applicationContext
        if (app !is Application) {
            RXLogger.e("VKID.init requires Application context")
            return false
        }
        return try {
            VKID.init(app)
            vkidInitialized = true
            RXLogger.i("VKID.init ok")
            true
        } catch (t: Throwable) {
            RXLogger.e("VKID.init failed: ${t.message}")
            false
        }
    }

    @JvmStatic
    fun authorize(activity: Activity, callback: RXJSONCallback) {
        if (!vkidInitialized) {
            callback.onFailed(
                JSONUtil.toJSONObject(
                    RXErrorCode.THIRD_INIT_ERROR.value,
                    "VKID not initialized; check host Manifest placeholders (VKIDClientID/Secret)"
                )
            )
            return
        }
        val vkCallback = object : VKIDAuthCallback {
            override fun onAuth(accessToken: AccessToken) {
                RXLogger.i("VKID authorize success")
                val ext = JSONObject()
                ext.put("access_token", accessToken.token)
                callback.onSuccess(ext)
            }

            override fun onFail(fail: VKIDAuthFail) {
                if (fail is VKIDAuthFail.Canceled) {
                    callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject())
                    return
                }
                val msg = fail.toString()
                RXLogger.e("VKID authorize failed: $msg")
                callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(-1, msg))
            }
        }
        val owner = activity as? LifecycleOwner
        if (owner == null) {
            callback.onFailed(
                RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(
                    -1,
                    "Activity must extend AppCompatActivity for VKID.authorize"
                )
            )
            return
        }
        try {
            VKID.instance.authorize(owner, vkCallback)
        } catch (t: Throwable) {
            RXLogger.e("VKID.authorize exception: ${t.message}")
            callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(-1, t.message ?: "authorize error"))
        }
    }

    private fun extString(params: Map<String, Any?>?, key: String): String? {
        if (params == null) {
            return null
        }
        val o = params[key] ?: return null
        val s = o.toString().trim()
        return if (s.isEmpty()) null else s
    }
}
