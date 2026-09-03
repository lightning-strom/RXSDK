package com.ruixue.demo.activity;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.view.DisplayCutout;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.RXUICallback;
import com.ruixue.demo.GlobalConfig;
import com.ruixue.demo.api.DemoClickHandler;
import com.ruixue.demo.callback.DemoCallback;
import com.ruixue.demo.config.DemoTestButtons;
import com.ruixue.demo.config.TestButtonConfig;
import com.ruixue.demo.dialog.InfoDetailDialog;
import com.ruixue.demo.helper.LoginV2DemoHelper;
import com.ruixue.demo.helper.RxSdkHelper;
import com.ruixue.demo.utils.DemoUtils;
import com.ruixue.demo.v2.DemoManager;
import com.ruixue.demo.widget.CollapsibleHelper;
import com.ruixue.demo.widget.DynamicButtonPanel;
import com.ruixue.demo.widget.FloatingLogView;
import com.ruixue.demo.widget.LogManager;
import com.ruixue.demo.widget.MiniStatusBar;
import com.ruixue.demo.widget.ResizableLogPanel;
import com.ruixue.logger.Logger;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;
import com.ruixue.qipai.R;
import com.ruixue.utils.ActivityUtils;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.DateUtils;
import com.ruixue.utils.KeyHashUtil;
import com.ruixue.view.RXWebView;

import java.util.ArrayList;
import java.util.List;

/**
 * 游戏主界面
 */
public class MainActivity extends BaseSdkLifecycleActivity implements View.OnClickListener {

    private static final String TAG = MainActivity.class.getSimpleName();

    private static final int REQ_STARTUP_PERMISSIONS = 1000;
    private static final int REQ_OVERLAY_PERMISSION = 1001;
    private static final int MIN_PASSWORD_LENGTH = 4;
    private static final int MSG_LOG = 0;

    private final LogManager logManager = LogManager.getInstance();

    // 主线程日志分发器：避免后台线程直接写 UI，同时可在 onDestroy 统一清理
    private final Handler handler = new Handler(Looper.getMainLooper(), msg -> {
        if (msg.what == MSG_LOG && msg.obj instanceof String) {
            logManager.log((String) msg.obj);
        }
        return true;
    });

    private ResizableLogPanel logPanel;
    private MiniStatusBar statusBar;
    private FloatingLogView floatingLogView;
    private DemoClickHandler demoClickHandler;

    private final DemoCallback.ResultDisplay resultDisplay = new DemoCallback.ResultDisplay() {
        @Override
        public void showLog(String message) {
            MainActivity.this.showLog(message);
        }

        @Override
        public void showToast(String message) {
            MainActivity.this.showToast(message);
        }
    };

    private final RXUICallback jsonCallback =
            DemoCallback.createPasswordValidatingCallback(resultDisplay, MIN_PASSWORD_LENGTH);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        setupWindow();
        logDisplayInfo();
        initView();
        initSdkInfoPanel();
        initDynamicTestButtons();

        KeyHashUtil.getKeyHash(this);
        LoginV2DemoHelper.setContext(this);
        CollapsibleHelper.bind(findViewById(R.id.scroll_view));

        demoClickHandler = new DemoClickHandler(this, new DemoManager.ResultCallback() {
            @Override
            public void onResult(String message) {
                showLog(DateUtils.getMsTime() + message);
            }

            @Override
            public void onToast(String message) {
                showToast(message);
            }
        }, jsonCallback);

        handleIncomingIntent(getIntent(), true);

        RxSdkHelper.onCreate(this);

        requestStartupPermissions();

        registerBackPressedHandler();
    }

    private void registerBackPressedHandler() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                Logger.i(TAG, "onBackPressed");
                RuiXueSdk.exitApp(MainActivity.this, new OnAppExitCallback() {
                    @Override
                    public void onExitConfirm(@Nullable String res) {
                        RXLogger.e("onExitConfirm");
                        finishAffinity();
                    }
                });
            }
        });
    }

    private void setupWindow() {
        Window window = getWindow();
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = window.getAttributes();
            lp.layoutInDisplayCutoutMode =
                    WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;

            final View decorView = window.getDecorView();
            decorView.post(() -> {
                WindowInsets insets = decorView.getRootWindowInsets();
                if (insets == null) {
                    return;
                }
                DisplayCutout cutout = insets.getDisplayCutout();
                if (cutout != null) {
                    RXLogger.i("DisplayCutout safeInset L/T/R/B="
                            + cutout.getSafeInsetLeft() + "/"
                            + cutout.getSafeInsetTop() + "/"
                            + cutout.getSafeInsetRight() + "/"
                            + cutout.getSafeInsetBottom());
                }
            });
        }

        window.getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);

        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(Color.TRANSPARENT);
    }

    private void logDisplayInfo() {
        WindowManager wm = getWindowManager();
        if (wm == null) {
            return;
        }
        DisplayMetrics metrics = new DisplayMetrics();
        wm.getDefaultDisplay().getMetrics(metrics);

        int navBarHeight = Build.VERSION.SDK_INT >= Build.VERSION_CODES.R
                ? AppUtils.getNavigationBarHeightWithInsets(this)
                : AppUtils.getNavigationBarHeight(this);

        RXLogger.i("screenWidthDp:" + AppUtils.px2dp(this, metrics.widthPixels)
                + ",screenHeightDp:" + AppUtils.px2dp(this, metrics.heightPixels)
                + ",navBarHeight:" + navBarHeight);
        RXLogger.i("widthPixels:" + metrics.widthPixels
                + ",heightPixels:" + metrics.heightPixels
                + ",DisplayMetrics:" + metrics);
    }

    private void initView() {
        logPanel = findViewById(R.id.log_panel);
        if (logPanel != null) {
            logManager.addOutput(logPanel);
        }
        LoginV2DemoHelper.setHandler(handler);
    }

    private void initSdkInfoPanel() {
        statusBar = findViewById(R.id.status_bar);
        if (statusBar == null) {
            return;
        }
        statusBar.setPackageName(getPackageName());
        statusBar.setVersion("v" + getAppVersionName() + " | SDK " + RuiXueSdk.getSdkVersion());
        statusBar.setOnStatusClickListener(() -> InfoDetailDialog.showAppInfo(this));
    }

    private void initDynamicTestButtons() {
        DynamicButtonPanel panel = findViewById(R.id.dynamic_button_panel);
        if (panel == null) {
            return;
        }
        List<TestButtonConfig.ButtonGroup> groups =
                DemoTestButtons.getTestButtons(this, this::showLog);
        panel.setButtonGroups(groups);
    }

    private String getAppVersionName() {
        try {
            return getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
            RXLogger.e("getAppVersionName failed: " + e.getMessage());
            return "unknown";
        }
    }

    private void requestStartupPermissions() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return;
        }
        List<String> need = new ArrayList<>();
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE)
                != PackageManager.PERMISSION_GRANTED) {
            need.add(Manifest.permission.READ_PHONE_STATE);
        }
        // WRITE_EXTERNAL_STORAGE 在 Android 13 (TIRAMISU) 起已不再授予，申请也无意义
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU
                && ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                        != PackageManager.PERMISSION_GRANTED) {
            need.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
        }
        if (!need.isEmpty()) {
            ActivityCompat.requestPermissions(this,
                    need.toArray(new String[0]), REQ_STARTUP_PERMISSIONS);
        }
    }

    private void handleIncomingIntent(Intent intent, boolean fromCreate) {
        if (intent == null) {
            return;
        }
        logDeepLinkParams(intent, fromCreate);
        Bundle bundle = intent.getExtras();
        if (bundle != null && bundle.containsKey("task_id")) {
            openPushActivity();
            return;
        }
        if (fromCreate) {
            String bundleStr = DemoUtils.bundleToString(bundle);
            if (!TextUtils.isEmpty(bundleStr)) {
                showLog(" bundle:" + bundleStr);
            }
        } else {
            showLog("bundle:" + DemoUtils.bundleToString(bundle));
        }
    }

    private void logDeepLinkParams(@NonNull Intent intent, boolean fromCreate) {
        Uri data = intent.getData();
        if (data == null) {
            return;
        }
        String source = fromCreate ? "onCreate" : "onNewIntent";
        String fullUri = data.toString();
        String baseMessage = source + " deepLink: " + fullUri;
        showLog(baseMessage);
        RXLogger.i(baseMessage);

        try {
            if (!data.isHierarchical()) {
                return;
            }
            boolean hasValidParam = false;
            for (String key : data.getQueryParameterNames()) {
                if (TextUtils.isEmpty(key)) {
                    continue;
                }
                String value = data.getQueryParameter(key);
                String queryMessage = source + " deepLink param: " + key + "=" + value;
                showLog(queryMessage);
                RXLogger.i(queryMessage);
                hasValidParam = true;
            }
            if (!hasValidParam) {
                String emptyParamsMessage = source + " deepLink param: <none>";
                showLog(emptyParamsMessage);
                RXLogger.i(emptyParamsMessage);
            }
        } catch (Exception e) {
            RXLogger.w(TAG, "parse deepLink params failed: " + e.getMessage());
        }
    }

    public void showLog(String json) {
        Logger.i("showLog:" + json);
        handler.obtainMessage(MSG_LOG, json).sendToTarget();
    }

    private void showToast(String msg) {
        ToastUtils.showLongToast(this, msg);
    }

    /**
     * 切换浮动日志显示
     */
    private void toggleFloatingLog() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            showToast("请授予悬浮窗权限");
            Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
            intent.setData(Uri.parse("package:" + getPackageName()));
            startActivityForResult(intent, REQ_OVERLAY_PERMISSION);
            return;
        }

        if (floatingLogView == null) {
            floatingLogView = new FloatingLogView(this);
        }

        if (floatingLogView.isShowing()) {
            floatingLogView.hide();
            logManager.removeOutput(floatingLogView);
            showToast("浮动日志已关闭");
        } else {
            floatingLogView.show();
            logManager.addOutput(floatingLogView);
            showToast("浮动日志已开启");
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        Logger.i(TAG, "onNewIntent " + (intent != null ? intent.toUri(Intent.URI_INTENT_SCHEME) : "null"));
        handleIncomingIntent(intent, false);
        RuiXueSdk.onNewIntent(this, intent);
    }

    @Override
    protected void onDestroy() {
        handler.removeCallbacksAndMessages(null);
        if (floatingLogView != null) {
            if (floatingLogView.isShowing()) {
                floatingLogView.hide();
            }
            logManager.removeOutput(floatingLogView);
            floatingLogView = null;
        }
        if (logPanel != null) {
            logManager.removeOutput(logPanel);
        }
        LoginV2DemoHelper.setHandler(null);
        super.onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        Logger.i(TAG, "onActivityResult:requestCode :" + requestCode
                + ",resultCode :" + resultCode
                + ", data :" + ((data != null && data.getExtras() != null) ? data.getExtras().toString() : ""));

        if (requestCode == REQ_OVERLAY_PERMISSION) {
            toggleFloatingLog();
            return;
        }

        IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
        if (result != null) {
            if (result.getContents() == null) {
                Toast.makeText(this, "已取消扫码", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "扫码结果: " + result.getContents(), Toast.LENGTH_LONG).show();
                RXWebView.create(this, result.getContents()).show();
            }
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onClick(View v) {
        if (demoClickHandler != null && demoClickHandler.handleClick(v)) {
            return;
        }
        if (v.getId() == R.id.btn_floating_log) {
            toggleFloatingLog();
        }
    }

    private void openPushActivity() {
        Bundle bundle = getIntent().getExtras();
        if (bundle != null) {
            bundle.putAll(ActivityUtils.toBundle(GlobalConfig.getExt()));
        } else {
            bundle = ActivityUtils.toBundle(GlobalConfig.getExt());
        }
        try {
            Intent intent = new Intent("com.ruixue.push.intent.action.test");
            intent.setClass(this, Class.forName("com.ruixue.demo.push.MainPushActivity"));
            if (bundle != null) {
                intent.putExtras(bundle);
            }
            showLog("rx_push_ACTION: " + intent.toUri(Intent.URI_INTENT_SCHEME));
            startActivity(intent);
        } catch (ClassNotFoundException e) {
            RXLogger.e("openPushActivity failed: " + e.getMessage());
        }
    }
}
