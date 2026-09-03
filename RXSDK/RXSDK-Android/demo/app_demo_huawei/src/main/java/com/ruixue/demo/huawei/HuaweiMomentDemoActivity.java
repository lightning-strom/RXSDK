package com.ruixue.demo.huawei;

import android.Manifest;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.ruixue.RXJSONCallback;
import com.ruixue.huawei.moment.HuaweiMomentHelper;
import com.ruixue.net.ToastUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

// Created by wangliang on 2025/1/3
public class HuaweiMomentDemoActivity extends AppCompatActivity {

    private static final int REQUEST_PERMISSION = 1000;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_huawei_moment_demo);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
        setTitle("华为内嵌社区");

        findViewById(R.id.initBtn).setOnClickListener(v -> {
            init();
        });

        findViewById(R.id.checkAdultBtn).setOnClickListener(v -> {
            checkAdult();
        });

        findViewById(R.id.openForumBtn).setOnClickListener(v -> {
            openForum();
        });

        findViewById(R.id.checkSceneBtn).setOnClickListener(v -> {
            checkScene();
        });

        findViewById(R.id.openSceneBtn).setOnClickListener(v -> {
            openScene();
        });

        findViewById(R.id.publishBtn).setOnClickListener(v -> {
            publish();
        });


        findViewById(R.id.closeBtn).setOnClickListener(v -> {
            close();
        });

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_PERMISSION);
            } else {
                Toast.makeText(this, "缺少文件读写权限，可能会导致高光时刻录功能无法使用", Toast.LENGTH_SHORT).show();
            }
        }

        init();


//        RXShareConfig config = new RXShareConfig();
//        config.setFunc("sunshare2");
//        config.setPlatform("system");
//        config.setAndroidScheme("jixiang433://");
//        config.setiOSScheme("jixiang433://");
//        RuiXueSdk.getApi().share(this, config, new RXJSONCallback() {
//            @Override
//            public void onSuccess(@Nullable JSONObject data) {
//                RXLogger.d("WLTest", "share success");
//            }
//
//            @Override
//            public void onFailed(@NonNull JSONObject cause) {
//                RXLogger.d("WLTest", "share failed " + cause);
//            }
//        });

    }

    private void init() {
        Map<String, Object> params = new HashMap<>();
        params.put("appId", "100207097");
        params.put("clientId", "549191826406388352");
        params.put("clientSecret", "9C475E698B82B0920BCFEACFECD82FAEDA8C7929215F1CC5EC200A3E404B9718");
//        params.put("cpAccessToken", "xxx");
        params.put("orientation", ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        HuaweiMomentHelper.getInstance().init(this, params, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                ToastUtils.showToast(HuaweiMomentDemoActivity.this, "init success");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                ToastUtils.showToast(HuaweiMomentDemoActivity.this, "init failed " + cause);
            }
        });
    }

    private void checkAdult() {
        HuaweiMomentHelper.getInstance().checkAdult(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data != null) {
                    int adult = data.optInt("adult");
                    if (adult == 0) {
                        ToastUtils.showToast(HuaweiMomentDemoActivity.this, "未成年");
                    } else if (adult == 1) {
                        ToastUtils.showToast(HuaweiMomentDemoActivity.this, "已成年");
                    } else {
                        ToastUtils.showToast(HuaweiMomentDemoActivity.this, "当前用户未完成实名认证");
                    }
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                ToastUtils.showToast(HuaweiMomentDemoActivity.this, "check adult failed " + cause);
            }
        });
    }

    private void openForum() {
        HuaweiMomentHelper.getInstance().openForumPage(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                ToastUtils.showToast(HuaweiMomentDemoActivity.this, "打开成功");
                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        close();
                    }
                }, 10000);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                ToastUtils.showToast(HuaweiMomentDemoActivity.this, "open forum failed " + cause);
            }
        });
    }

    private void checkScene() {
        String sceneId = "461272578598633652";
        HuaweiMomentHelper.getInstance().checkScene(sceneId, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if(data !=null) {
                    boolean valid = data.optBoolean("valid");
                    if (valid) {
                        ToastUtils.showToast(HuaweiMomentDemoActivity.this, "场景有效");
                    } else {
                        ToastUtils.showToast(HuaweiMomentDemoActivity.this, "场景无效，请检查管理后数据");
                    }
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                ToastUtils.showToast(HuaweiMomentDemoActivity.this, "check scene failed " + cause);
            }
        });
    }

    private void openScene() {
        String sceneId = "461272578598633652";
        HuaweiMomentHelper.getInstance().openScene(sceneId, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                // 帖子详情页
                // 活动详情页
                ToastUtils.showToast(HuaweiMomentDemoActivity.this, "打开成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                ToastUtils.showToast(HuaweiMomentDemoActivity.this, "open scene failed " + cause);
            }
        });
    }

    private void publish() {
        Map<String, Object> shareReqMap = new HashMap<>();
        shareReqMap.put("func", "hwtest");//分享埋点
        shareReqMap.put("platform", "system");//分享平台
        shareReqMap.put("protocol_android", "jixiang433://");//android 客户端scheme
        shareReqMap.put("protocol_ios", "jixiang433://");//iOS 客户端scheme
        shareReqMap.put("auto_report", false);
        HuaweiMomentHelper.getInstance().publish(this, shareReqMap, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                ToastUtils.showToast(HuaweiMomentDemoActivity.this, "调起发布界面");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                ToastUtils.showToast(HuaweiMomentDemoActivity.this, "publish failed " + cause);
            }
        });
    }

    private void close() {
        String content = "";
        HuaweiMomentHelper.getInstance().closeWithConfirm(content, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                ToastUtils.showToast(HuaweiMomentDemoActivity.this, "关闭成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                ToastUtils.showToast(HuaweiMomentDemoActivity.this, "close failed " + cause);
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
