package com.ruixue.demo.overseas;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.util.SparseArray;
import android.view.View;
import android.widget.EditText;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.callback.RXUICallback;
import com.ruixue.demo.GlobalConfig;
import com.ruixue.demo.helper.RxSdkHelper;
import com.ruixue.demo.utils.Logger;
import com.ruixue.demo.widget.CollapsibleHelper;
import com.ruixue.legal.LegalData;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXSdkApiFactory;
import com.ruixue.passport.LoginMethod;
import com.ruixue.sdk.RXOSUILoginConfig;

import org.json.JSONObject;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class OverseasDemoActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = OverseasDemoActivity.class.getSimpleName();
    private static final int FILE_SELECT_CODE = 100;

    private String typeShare = "facebook";
    private EditText et_hashtag, et_quote, et_link;
    private TextView tvShareFileUri;
    private Uri shareFileUrl = null;

    private final Map<Integer, Runnable> clickActions = new HashMap<>();
    private static boolean thirdSdkInitSuccess;
    private static boolean thirdSdkInitInProgress;
    private Runnable pendingThirdSdkAction;

    // RadioButton ID → 渠道名
    private static final SparseArray<String> SHARE_TYPE_MAP = new SparseArray<>();
    static {
        SHARE_TYPE_MAP.put(R.id.rb_facebook, "facebook");
        SHARE_TYPE_MAP.put(R.id.rb_messenger, "messenger");
        SHARE_TYPE_MAP.put(R.id.rb_instagram, "instagram");
        SHARE_TYPE_MAP.put(R.id.rb_line, "line");
        SHARE_TYPE_MAP.put(R.id.rb_whatsapp, "whatsapp");
        SHARE_TYPE_MAP.put(R.id.rb_tiktok, "tiktok");
        SHARE_TYPE_MAP.put(R.id.rb_twitter, "twitter");
        SHARE_TYPE_MAP.put(R.id.rb_system, "system");
    }

    // ==================== Lifecycle ====================

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.google_demo);

        tvShareFileUri = findViewById(R.id.tv_share_file_url);
        et_hashtag = findViewById(R.id.et_hashtag);
        et_quote = findViewById(R.id.et_quote);
        et_link = findViewById(R.id.et_link);
        et_link.setText("https://os-api-test.ruixueyun.com/v1/operationapi/url/landingtest/" + System.currentTimeMillis());

        CollapsibleHelper.bind(findViewById(R.id.root_container));
        ensureSdkReadyForDirectLaunch();

        RadioGroup rdgroup = findViewById(R.id.rg_facebook_share);
        rdgroup.setOnCheckedChangeListener((group, checkedId) -> {
            String type = SHARE_TYPE_MAP.get(checkedId);
            if (type != null) typeShare = type;
        });

        registerClickActions();

        dispatchSdkOnCreate(savedInstanceState);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        dispatchSdkOnNewIntent(intent);
    }

    private void dispatchSdkOnCreate(@Nullable Bundle savedInstanceState) {
        try {
            RuiXueSdk.onCreate(this, savedInstanceState);
        } catch (Throwable e) {
            Log.w(TAG, "skip SDK onCreate dispatch: " + e.getMessage());
        }
    }

    private void dispatchSdkOnNewIntent(@Nullable Intent intent) {
        try {
            RuiXueSdk.onNewIntent(this, intent);
        } catch (Throwable e) {
            Log.w(TAG, "skip SDK onNewIntent dispatch: " + e.getMessage());
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, final Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        RuiXueSdk.onActivityResult(this, requestCode, resultCode, data);
        if (requestCode == FILE_SELECT_CODE && resultCode == RESULT_OK) {
            shareFileUrl = data.getData();
            tvShareFileUri.setText(shareFileUrl.toString());
        }
    }

    // ==================== 按钮注册 ====================

    private void registerClickActions() {
        // 登录
        clickActions.put(R.id.os_login_ui, this::showOSLoginUI);
        clickActions.put(R.id.login_google, () -> OverseasHelper.login(this, LoginMethod.GOOGLE));
        clickActions.put(R.id.login_facebook, () -> OverseasHelper.login(this, LoginMethod.FACEBOOK));
        clickActions.put(R.id.login_line, () -> OverseasHelper.login(this, LoginMethod.LINE, GlobalConfig.getConfig().getExt()));
        clickActions.put(R.id.login_tiktok, () -> OverseasHelper.login(this, LoginMethod.TIKTOK));
        clickActions.put(R.id.login_zalo, () -> OverseasHelper.login(this, LoginMethod.ZALO));
        clickActions.put(R.id.login_snapchat, () -> OverseasHelper.login(this, LoginMethod.SNAPCHAT));
        clickActions.put(R.id.login_instagram, () -> OverseasHelper.login(this, LoginMethod.INSTAGRAM));
        clickActions.put(R.id.login_reddit, () -> OverseasHelper.login(this, LoginMethod.REDDIT));
        clickActions.put(R.id.login_vk, () -> runAfterThirdSdkReady(() -> OverseasHelper.login(this, LoginMethod.VK)));
        clickActions.put(R.id.logout, () -> RXSdkApi.getInstance().logout(new OnLogoutCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                ToastUtils.showToast(OverseasDemoActivity.this, data);
            }
        }));

        // Google 支付
        clickActions.put(R.id.pay_google, () -> OverseasHelper.payWithPicker(this, null));
        clickActions.put(R.id.pay_google_server, () -> OverseasHelper.payWithPickerServerMode(this, null));
        clickActions.put(R.id.pay_google_subscribe, () -> OverseasHelper.payGoogleSubscribe(this, null));
        clickActions.put(R.id.get_product, () -> OverseasHelper.getProductInfo(this));

        // Ogood
        clickActions.put(R.id.pay_ogood, () -> OverseasHelper.payWithPicker(this, "ogood"));
        clickActions.put(R.id.pay_ogood_browser, () -> OverseasHelper.payOgood(this, true));

        // RuStore
        clickActions.put(R.id.pay_rustore, () -> OverseasHelper.payWithPicker(this, "rustore"));
        clickActions.put(R.id.rustore_review, () -> OverseasHelper.ruStoreReview(this));
        clickActions.put(R.id.rustore_products, () -> OverseasHelper.ruStoreGetProductsInfoWithPicker(this));

        // VGamePop
        clickActions.put(R.id.vgp_login, () -> OverseasHelper.loginVGamePop(this));
        clickActions.put(R.id.vgp_pay, () -> OverseasHelper.payWithPicker(this, "apkpure"));
        clickActions.put(R.id.vgp_products, () -> OverseasHelper.getVGamePopProducts(this));
        clickActions.put(R.id.vgp_game_circle, () -> showLog("游戏圈：待 VGamePop 提供 API"));
        clickActions.put(R.id.vgp_vip_service, () -> showLog("VIP客服：待 VGamePop 提供 API"));

        // 分享
        clickActions.put(R.id.share_link, () -> getFacebookShareHelper().shareLink(this, et_link.getText().toString(), et_hashtag.getText().toString(), et_quote.getText().toString()));
        clickActions.put(R.id.share_text, () -> getFacebookShareHelper().shareText(this, et_hashtag.getText().toString(), et_link.getText().toString()));
        clickActions.put(R.id.share_link_with_tag, () -> getFacebookShareHelper().shareLink(this, et_link.getText().toString(), et_hashtag.getText().toString(), null));
        clickActions.put(R.id.share_link_with_quote, () -> getFacebookShareHelper().shareLink(this, et_link.getText().toString(), null, et_quote.getText().toString()));
        clickActions.put(R.id.share_image_local, () -> {
            Uri localFileUri = requireShareFileUri();
            String uri = localFileUri == null ? "https://oss-anchor-v2.weile.com/share/link_contents/14.png" : localFileUri.toString();
            getFacebookShareHelper().shareImage(this, uri);
        });
        clickActions.put(R.id.share_image_qr, () -> getFacebookShareHelper().shareImageWithQR(this));
        clickActions.put(R.id.share_image, () -> getFacebookShareHelper().shareImage(this, "https://oss-anchor-v2.weile.com/share/link_contents/14.png"));
        clickActions.put(R.id.share_video, () -> {
            Uri localFileUri = requireShareFileUri();
            String uri = localFileUri == null ? "https://media.w3.org/2010/05/sintel/trailer.mp4" : localFileUri.toString();
            getFacebookShareHelper().shareVideo(this, uri);
        });
        clickActions.put(R.id.share_media, () -> {
            Uri localFileUri = requireShareFileUri();
            if (localFileUri == null) {
                return;
            }
            getFacebookShareHelper().shareMedia(this, null, Arrays.asList(localFileUri.toString().split(",")));
        });
        clickActions.put(R.id.share_tiktok, () -> startActivity(new Intent(this, TiktokShareDemoActivity.class)));
        clickActions.put(R.id.share_zalo, () -> startActivity(new Intent(this, ZaloShareDemoActivity.class)));
        clickActions.put(R.id.share_snapchat, () -> startActivity(new Intent(this, SnapchatShareDemoActivity.class)));
        clickActions.put(R.id.share_instagram, () -> startActivity(new Intent(this, InstagramShareDemoActivity.class)));
        clickActions.put(R.id.share_reddit, () -> OverseasHelper.shareRedditTest(this));

        // 其他
        clickActions.put(R.id.channel_qoo, () -> startActivity(new Intent(this, QooActivity.class)));
    }

    // ==================== onClick ====================

    @Override
    public void onClick(View v) {
        Runnable action = clickActions.get(v.getId());
        if (action != null) {
            action.run();
        }
    }

    // ==================== 工具方法 ====================

    private void runAfterThirdSdkReady(@NonNull Runnable action) {
        if (thirdSdkInitSuccess) {
            action.run();
            return;
        }
        pendingThirdSdkAction = action;
        ensureSdkReadyForDirectLaunch();
        Toast.makeText(this, "SDK 初始化中，完成后自动继续", Toast.LENGTH_SHORT).show();
    }

    private void ensureSdkReadyForDirectLaunch() {
        if (thirdSdkInitSuccess || thirdSdkInitInProgress) {
            return;
        }
        thirdSdkInitInProgress = true;
        if (RuiXueSdk.getCpId() == null) {
            RxSdkHelper.onCreate(this, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    initThirdSdkForDemo();
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    thirdSdkInitInProgress = false;
                    showLog("SDK 初始化失败：" + cause);
                }
            });
            return;
        }
        initThirdSdkForDemo();
    }

    private void initThirdSdkForDemo() {
        Map<String, Object> thirdSdkParams = GlobalConfig.getConfig(this).getExt();
        RXSdkApi.getInstance().initThirdSdk(this, thirdSdkParams, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                thirdSdkInitSuccess = true;
                thirdSdkInitInProgress = false;
                showLog("第三方 SDK 初始化成功");
                Runnable action = pendingThirdSdkAction;
                pendingThirdSdkAction = null;
                if (action != null) {
                    action.run();
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                thirdSdkInitInProgress = false;
                showLog("第三方 SDK 初始化失败：" + cause);
            }
        });
    }

    public void showLog(final String log) {
        Log.i(TAG, log);
        runOnUiThread(() -> {
            View tvView = findViewById(R.id.tv_log);
            if (tvView instanceof TextView) {
                ((TextView) tvView).setText(log);
            }
            Toast.makeText(this, log, Toast.LENGTH_LONG).show();
        });
    }

    public void onClickChooseFile(View view) {
        if (view.getId() == R.id.bt_choose_share_file) {
            Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
            intent.setType("*/*");
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            try {
                startActivityForResult(Intent.createChooser(intent, "选择文件"), FILE_SELECT_CODE);
                overridePendingTransition(0, 0);
            } catch (Exception ex) {
                Toast.makeText(this, "请先安装文件管理器", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private Uri requireShareFileUri() {
        if (shareFileUrl == null) {
            tvShareFileUri.setText("请先选择分享文件");
            Toast.makeText(this, "请先选择分享文件", Toast.LENGTH_SHORT).show();
        }
        return shareFileUrl;
    }

    private FacebookShareHelper getFacebookShareHelper() {
        return new FacebookShareHelper(this, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.i("share success");
                if (data != null) showLog(data.toString());
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                showLog(cause.toString());
            }
        }, typeShare);
    }

    // ==================== 海外登录 UI ====================

    private void showOSLoginUI() {
        RXOSUILoginConfig loginUIConfig = new RXOSUILoginConfig();
        loginUIConfig.setForgotUrl(GlobalConfig.getDomain() + "static/passport/#/oversea/forgetpassword");
        loginUIConfig.setTitleResId(com.ruixue.qipai.R.drawable.logo);
        loginUIConfig.setFirstNeedSetPassword(true);
        loginUIConfig.setPrivacyThree("儿童隐私", "ruixue://" + LegalData.KEY_PRIVACY_POLICY);

        RXSdkApiFactory.getRxUiAPI().loginUIOS(this, loginUIConfig, null, new RXUICallback() {
            @Override
            public Map<String, Object> onClickHandle(Map<String, Object> params) {
                params.put("ignore_check_password", true);
                return params;
            }

            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Logger.i(TAG, "login callback: " + data);
                ToastUtils.showToast(OverseasDemoActivity.this, "登录成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Logger.e(TAG, "login callback: " + cause);
                ToastUtils.showToast(OverseasDemoActivity.this, "登录失败: " + cause);
            }
        }).show();
    }
}
