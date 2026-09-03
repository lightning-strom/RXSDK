package com.ruixue.demo.config;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Debug;
import android.text.TextUtils;
import android.widget.ArrayAdapter;
import android.widget.CheckedTextView;
import android.widget.ListView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.demo.GlobalConfig;
import com.ruixue.qipai.R;

import java.util.List;

/**
 * 初始化配置选择器
 * <p>
 * 底层数据源为 {@link InitConfigRegistry}（统一 {@code assets/init_configs.json}）。
 * 本类负责弹窗交互、记忆选中 key、IDE 调试自动清理。
 *
 * @since 2.0
 */
public class InitConfigSelector {

    private static final String PREF_NAME = "init_config_pref";
    /** 存储的是 Registry 中的 key（历史值可能是 {@code cp_xxx.json} 文件名，加载时会做一次清理）。 */
    private static final String KEY_SELECTED_CONFIG = "selected_config";
    private static final String KEY_SESSION_ID = "session_id";

    /**
     * 初始化配置选择器：IDE 调试运行时自动清除记忆；把记忆的 key 同步到 {@link GlobalConfig}。
     */
    public static void init(Context context) {
        InitConfigRegistry.ensureLoaded(context);
        migrateLegacyPref(context);

        if (isDebugRun()) {
            String currentSessionId = getSessionId();
            String savedSessionId = getPrefs(context).getString(KEY_SESSION_ID, "");
            if (!currentSessionId.equals(savedSessionId)) {
                clearSelection(context);
                getPrefs(context).edit().putString(KEY_SESSION_ID, currentSessionId).apply();
            }
        }

        String savedKey = getSelectedConfig(context);
        if (savedKey != null) {
            GlobalConfig.setInitConfigKey(savedKey);
        }
    }

    /** 显示配置选择弹窗。 */
    public static void showSelector(@NonNull Activity activity, @Nullable OnConfigSelectedListener listener) {
        List<InitConfigRegistry.ConfigItem> items = InitConfigRegistry.getAllItems(activity);
        if (items.isEmpty()) {
            return;
        }

        String rememberedKey = getSelectedConfig(activity);
        String currentKey = rememberedKey != null ? rememberedKey : GlobalConfig.getInitConfigKey(activity);

        int checkedItem = 0;
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).key.equals(currentKey)) {
                checkedItem = i;
                break;
            }
        }

        final int[] selectedIndex = {checkedItem};
        final String effectiveCurrentKey = currentKey;
        final String effectiveRememberedKey = rememberedKey;
        // 使用自定义 row layout（dialog_init_config_item.xml），把 singleLine=false / maxLines=6
        // 等属性写在 XML 中，避免系统 simple_list_item_single_choice 的 textAppearance 把
        // maxLines 复位成 1，导致多行 label 只显示首行。
        ArrayAdapter<InitConfigRegistry.ConfigItem> adapter = new ArrayAdapter<InitConfigRegistry.ConfigItem>(
                activity, R.layout.dialog_init_config_item, items) {
            @NonNull
            @Override
            public android.view.View getView(int position, @Nullable android.view.View convertView,
                                             @NonNull android.view.ViewGroup parent) {
                CheckedTextView view = (CheckedTextView) super.getView(position, convertView, parent);
                InitConfigRegistry.ConfigItem item = getItem(position);
                if (item != null) {
                    boolean isCurrent = item.key.equals(effectiveCurrentKey);
                    boolean isRemembered = !TextUtils.isEmpty(effectiveRememberedKey)
                            && item.key.equals(effectiveRememberedKey);
                    view.setText(item.getStyledDialogLabel(isCurrent, isRemembered));
                }
                return view;
            }
        };

        AlertDialog dialog = new AlertDialog.Builder(activity)
                .setTitle("🔧 选择初始化配置（长按查看 key/原始域名）")
                .setSingleChoiceItems(adapter, checkedItem, (d, which) -> selectedIndex[0] = which)
                .setPositiveButton("确定", (d, which) -> {
                    InitConfigRegistry.ConfigItem selected = items.get(selectedIndex[0]);
                    saveSelection(activity, selected.key);
                    GlobalConfig.setInitConfigKey(selected.key);
                    if (listener != null) {
                        listener.onConfigSelected(selected.key, selected.getDisplayName());
                    }
                })
                .setNegativeButton("取消", null)
                .setNeutralButton("清除记忆", (d, which) -> {
                    clearSelection(activity);
                    GlobalConfig.setInitConfigKey(null);
                    if (listener != null) {
                        listener.onConfigSelected(null, "已清除，将使用默认配置");
                    }
                })
                .create();
        dialog.show();
        ListView listView = dialog.getListView();
        if (listView != null) {
            listView.setOnItemLongClickListener((parent, view, position, id) -> {
                InitConfigRegistry.ConfigItem item = items.get(position);
                String msg = "key: " + item.key
                        + (TextUtils.isEmpty(item.domain) ? "" : "\n域名: " + item.domain);
                Toast.makeText(activity, msg, Toast.LENGTH_LONG).show();
                return true;
            });
        }
    }

    /** 获取当前记忆的配置 key（未记忆返回 null）。 */
    @Nullable
    public static String getSelectedConfig(Context context) {
        return getPrefs(context).getString(KEY_SELECTED_CONFIG, null);
    }

    /** 获取当前生效配置的人类可读名称。 */
    @NonNull
    public static String getSelectedConfigDisplayName(Context context) {
        String key = getSelectedConfig(context);
        if (key == null) key = GlobalConfig.getInitConfigKey(context);
        InitConfigRegistry.ConfigItem item = InitConfigRegistry.getItem(context, key);
        return item != null ? item.getDisplayName() : (key == null ? "" : key);
    }

    private static void saveSelection(Context context, String key) {
        getPrefs(context).edit().putString(KEY_SELECTED_CONFIG, key).apply();
    }

    /** 清除记忆的选择，回落到默认 key。 */
    public static void clearSelection(Context context) {
        getPrefs(context).edit().remove(KEY_SELECTED_CONFIG).apply();
    }

    /** 旧版本存的是 {@code cp_xxx.json} 文件名，本方法做一次兼容：去掉 .json 后缀，命中 key 则保留、否则清理。 */
    private static void migrateLegacyPref(Context context) {
        SharedPreferences prefs = getPrefs(context);
        String saved = prefs.getString(KEY_SELECTED_CONFIG, null);
        if (saved == null) return;
        if (InitConfigRegistry.contains(context, saved)) return;
        if (saved.endsWith(".json")) {
            String candidate = saved.substring(0, saved.length() - 5);
            // 特例：旧文件 rxyymxj_config.json → 新 key rxyymxj
            if ("rxyymxj_config".equals(candidate)) candidate = "rxyymxj";
            if (InitConfigRegistry.contains(context, candidate)) {
                prefs.edit().putString(KEY_SELECTED_CONFIG, candidate).apply();
                return;
            }
        }
        prefs.edit().remove(KEY_SELECTED_CONFIG).apply();
    }

    private static SharedPreferences getPrefs(Context context) {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    private static boolean isDebugRun() {
        return Debug.isDebuggerConnected() || Debug.waitingForDebugger();
    }

    private static String getSessionId() {
        long startTime = System.currentTimeMillis() - android.os.SystemClock.elapsedRealtime();
        return android.os.Process.myPid() + "_" + startTime;
    }

    /** 配置选择回调。第一个参数是 Registry key（清除记忆时为 null）。 */
    public interface OnConfigSelectedListener {
        void onConfigSelected(@Nullable String configKey, String displayName);
    }
}
