package com.ruixue.demo.huawei;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RadioGroup;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.huawei.game.replay.common.model.RecordResult;
import com.huawei.game.replay.common.model.ShareResult;
import com.huawei.game.replay.common.model.TemplateDetail;
import com.huawei.game.replay.common.model.TemplateResult;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.huawei.replay.HuaweiReplayHelper;
import com.ruixue.huawei.replay.OnApplyShareCallback;
import com.ruixue.huawei.replay.OnInitCallback;
import com.ruixue.huawei.replay.OnQueryTemplatesCallback;
import com.ruixue.huawei.replay.OnRecordCallback;
import com.ruixue.huawei.replay.OnVideoClippedCallback;
import com.ruixue.huawei.replay.OnVideoExportedCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;

import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Created by wangliang on 2025/1/3
public class HuaweiReplayDemoActivity extends AppCompatActivity {

    private static final int REQUEST_PERMISSION = 100;

    private boolean isAppRecord = true;

    private LinearLayout logContainer;
    private ScrollView scrollView;

    List<String> localFilePaths = new ArrayList<>();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_huawei_replay_demo);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
        setTitle("华为高光时刻");

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED
                && ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED
                && ContextCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.READ_PHONE_STATE, Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_PERMISSION);
            } else {
                Toast.makeText(this, "缺少文件读写权限，可能会导致高光时刻录功能无法使用", Toast.LENGTH_SHORT).show();
            }
        }

        findViewById(R.id.initBtn).setOnClickListener(v -> {
            init();
        });

        RadioGroup radioGroup = findViewById(R.id.recordModeGroup);
        radioGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                if (checkedId == R.id.appRecordModeBtn) {
                    RXLogger.d("WLTest", "应用内录制模式");
                    isAppRecord = true;
                } else if (checkedId == R.id.sysRecordModeBtn) {
                    RXLogger.d("WLTest", "系统录制模式");
                    isAppRecord = false;
                }
            }
        });

        logContainer = findViewById(R.id.logContainer);
        scrollView = findViewById(R.id.scrollView);

        findViewById(R.id.startManualRecordBtn).setOnClickListener(v -> {
            startManualRecord();
        });

        findViewById(R.id.startAutoRecordBtn).setOnClickListener(v -> {
            startAutoRecord();
        });

        findViewById(R.id.clipVideoBtn).setOnClickListener(v -> {
            clipVideo();
        });

        findViewById(R.id.stopRecordBtn).setOnClickListener(v -> {
            stopRecord();
        });

        findViewById(R.id.queryTemplatesBtn).setOnClickListener(v -> {
            queryTemplates();
        });

        findViewById(R.id.exportVideoBtn).setOnClickListener(v -> {
            exportVideo();
        });

        findViewById(R.id.quickShareBtn).setOnClickListener(v -> {
            share("hwtest");
        });

        findViewById(R.id.quickShareVideoBtn).setOnClickListener(v -> {
            share("hw_replay_video");
        });

        init();


    }


    private void addLog(String content) {
        TextView textView = new TextView(this);
        textView.setText(content);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        logContainer.addView(textView, params);
        if (scrollView == null)
            return;
        scrollView.post(new Runnable() {
            @Override
            public void run() {
                scrollView.fullScroll(View.FOCUS_DOWN);
            }
        });
    }

    private void init() {
        Map<String, Object> params = new HashMap<>();
        params.put("agcAppId", "100207097");
        params.put("clientId", "549191826406388352");
        params.put("clientSecret", "9C475E698B82B0920BCFEACFECD82FAEDA8C7929215F1CC5EC200A3E404B9718");
        params.put("openId", "111");
        params.put("apiKey", "CgB6e3x9YFLOA8w7kXfvvbMnd8mpG8ZNNurpwEiJyEr6H2V6UW5j8PxtganqBH6nzOIPYzyDs/WaNn8VrM094Pm+");
        File file = getExternalFilesDir(null);

        String outputPath = file != null ? file.getAbsolutePath() : getFilesDir().getAbsolutePath();
        RXLogger.d("WLTest", "output path :" + outputPath);
        params.put("outputPath", outputPath);
        addLog("init start");
        HuaweiReplayHelper.getInstance().init(this, params, new OnInitCallback() {
            @Override
            public void onInit(int code, String msg) {
                if (code == 0) {
                    addLog("init success");
                } else {
                    addLog("init failed: code" + code + ", msg:" + msg);
                }
                ToastUtils.showToast(HuaweiReplayDemoActivity.this, "init code:" + code + ", msg:" + msg);
            }

            @Override
            public void onError(RecordResult recordResult) {
                addLog("init failed: code" + recordResult.code + ", msg:" + recordResult.msg);
                ToastUtils.showToast(HuaweiReplayDemoActivity.this, "onError code:" + recordResult.code + ", msg:" + recordResult.msg);
            }
        });
    }

//    private void shareUrl(String url) {
//        RXCustomShareConfig config = new RXCustomShareConfig();
//        config.setPlatform("system");
//        config.setAndroidProtocol("test");
//        config.setIOSProtocol("test");
//        config.setType(ShareMediaType.WEBPAGE);
//        config.setTitle("瑞雪系统分享");
//        config.setUrl("https://pgs-replay.cloud.huawei.com/nsp-campaign-res-drcn/campaignpreview/6835afd91dbc4191b0bff9bdade32f32/index.html?shareCode=535335740641439872-100207097-535335723738394624");
//        RuiXueSdk.getApi().shareCustom(this, config, new RXJSONCallback() {
//            @Override
//            public void onSuccess(@Nullable JSONObject data) {
//                ToastUtils.showToast(HuaweiReplayDemoActivity.this, "分享成功");
//            }
//
//            @Override
//            public void onFailed(@NonNull JSONObject cause) {
//                ToastUtils.showToast(HuaweiReplayDemoActivity.this, "分享失败");
//            }
//        });
//    }

//    private void shareVideo(String url) {
//        File videoFile = new File("/storage/emulated/0/Android/data/app.weile.doudizhu.huawei/files/huawei_replay_1736403166240.mp4");
//        if (!videoFile.exists()) {
//            Toast.makeText(this, "视频文件不存在", Toast.LENGTH_SHORT).show();
//            return;
//        }
//
//        Uri videoUri = RXFileProvider.getUriForFile(this, videoFile);
////        Intent intent = new Intent(Intent.ACTION_SEND);
////        intent.setType("video/*");
////        intent.putExtra(Intent.EXTRA_STREAM, videoUri);
////        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
////        startActivity(Intent.createChooser(intent, "分享视频"));
//
//        RXCustomShareConfig config = new RXCustomShareConfig();
//        config.setPlatform("system");
//        config.setAndroidProtocol("test");
//        config.setIOSProtocol("test");
//        config.setType(ShareMediaType.VIDEO);
//        config.setTitle("瑞雪系统分享");
//        config.setUrl("/storage/emulated/0/Android/data/app.weile.doudizhu.huawei/files/huawei_replay_1736403166240.mp4");
//        RuiXueSdk.getApi().shareCustom(this, config, new RXJSONCallback() {
//            @Override
//            public void onSuccess(@Nullable JSONObject data) {
//                ToastUtils.showToast(HuaweiReplayDemoActivity.this, "分享成功");
//            }
//
//            @Override
//            public void onFailed(@NonNull JSONObject cause) {
//                ToastUtils.showToast(HuaweiReplayDemoActivity.this, "分享失败");
//            }
//        });
//    }

    private void startManualRecord() {
        addLog("开始手动录制(" + (isAppRecord ? "应用内模式" : "系统录制模式") + ")");
        String filename = "huawei_replay_" + System.currentTimeMillis() + ".mp4";
        HuaweiReplayHelper.getInstance().startManualRecord(isAppRecord ? this : null, filename, 10, new OnRecordCallback() {
            @Override
            public void onStart(RecordResult recordResult) {
                RXLogger.d("WLTest", "startManualRecord onStart code:" + recordResult.code + ", msg:" + recordResult.msg);
            }

            @Override
            public void onStop(RecordResult recordResult) {
                addLog("录制结束，视频地址:" + recordResult.filePath);
                if (!TextUtils.isEmpty(recordResult.filePath)) {
                    localFilePaths.add(recordResult.filePath);
                }
                RXLogger.d("WLTest", "startManualRecord onStop code:" + recordResult.code + ", msg:" + recordResult.msg + ", filepath:" + recordResult.filePath);
            }
        });
    }

    private void startAutoRecord() {
        addLog("开始自动录制(" + (isAppRecord ? "应用内模式" : "系统录制模式") + ")");
        HuaweiReplayHelper.getInstance().startAutoRecord(isAppRecord ? this : null, new OnRecordCallback() {
            @Override
            public void onStart(RecordResult recordResult) {
                RXLogger.d("WLTest", "startAutoRecord code:" + recordResult.code + ", msg:" + recordResult.msg);
            }

            @Override
            public void onStop(RecordResult recordResult) {
                addLog("结束自动录制");
                RXLogger.d("WLTest", "startManualRecord onStop code:" + recordResult.code + ", msg:" + recordResult.msg + ", filepath:" + recordResult.filePath);
            }
        });
    }

    private void clipVideo() {
        String filename = "huawei_replay_" + System.currentTimeMillis() + ".mp4";
        RXLogger.d("WLTest", "clipVideo >>> " + filename);
        addLog("获取高光时刻");
        // 从当前向前截图 10 s，并输出视频
        HuaweiReplayHelper.getInstance().clipVideo(filename, 10, new OnVideoClippedCallback() {
            @Override
            public void onVideoClipped(RecordResult recordResult) {
                addLog("获取高光时刻 code:" + recordResult.code + ", msg:" + recordResult.msg + ", filepath: " + recordResult.filePath);
                if (!TextUtils.isEmpty(recordResult.filePath)) {
                    localFilePaths.add(recordResult.filePath);
                }
                RXLogger.d("WLTest", "onVideoClipped code:" + recordResult.code + ", msg:" + recordResult.msg + ", filepath: " + recordResult.filePath);
            }
        });
    }

    private void stopRecord() {
        HuaweiReplayHelper.getInstance().stopRecord();
    }

    private void queryTemplates() {
        RXLogger.d("WLTest", "queryTemplates");
        addLog("获取可使用的模版");
        HuaweiReplayHelper.getInstance().queryTemplates(new OnQueryTemplatesCallback() {
            @Override
            public void onQueryTemplates(TemplateResult templateResult) {
                RXLogger.d("WLTest", "onQueryTemplates >> ");

                String strIds = "[";
                if (templateResult != null && templateResult.templates != null) {
                    for (int i = 0; i < templateResult.templates.size(); i++) {
                        TemplateDetail detail = templateResult.templates.get(i);
                        RXLogger.d("WLTest", "onQueryTemplates id:" + detail.templateId);
                        strIds += detail.templateId;
                        if (i < templateResult.templates.size() - 1) {
                            strIds += ",";
                        }
                    }
                }
                strIds += "]";
                addLog("获取可使用的模版 " + strIds);
            }
        });
    }

    private void exportVideo() {
        String oneLandscapeTemplateId = "387511071394504218_templateCS30021";
        String filename = "huawei_replay_export_" + System.currentTimeMillis() + ".mp4";
        RXLogger.d("WLTest", "filename >>> " + filename);
        addLog("导出视频 开始");
        List<String> importFilePaths = new ArrayList<>();
        if (!localFilePaths.isEmpty()) {
            int size = Math.min(localFilePaths.size(), 3);
            for (int i = 0; i < size; i++) {
                importFilePaths.add(localFilePaths.get(i));
            }
        }
//        importFilePaths.add("/storage/emulated/0/Android/data/com.jixiang.game.fish.huawei/files/huawei_replay_1736318835746.mp4");
//        importFilePaths.add("/storage/emulated/0/Android/data/com.jixiang.game.fish.huawei/files/huawei_replay_1736318863012.mp4");
//        importFilePaths.add("/storage/emulated/0/Android/data/com.jixiang.game.fish.huawei/files/huawei_replay_1736318883224.mp4");
        List<String> replaceWords = new ArrayList<>();
        replaceWords.add("Test By Ruixue");
        replaceWords.add("AAAAAA");
        List<String> replaceAudioPaths = new ArrayList<>();
        HuaweiReplayHelper.getInstance().exportVideo(filename, oneLandscapeTemplateId, importFilePaths, replaceWords, null, replaceAudioPaths, new OnVideoExportedCallback() {
            @Override
            public void onVideoExported(RecordResult recordResult) {
                addLog("导出视频 完成, file path:" + recordResult.filePath);
                RXLogger.d("WLTest", "onVideoExported code:" + recordResult.code + ", msg:" + recordResult.msg + ", filepath: " + recordResult.filePath);
                addLog("申请分享链接 开始");
                HuaweiReplayHelper.getInstance().applyShare(recordResult.filePath, oneLandscapeTemplateId, new OnApplyShareCallback() {
                    @Override
                    public void onApplyShare(ShareResult shareResult) {
                        addLog("申请分享链接 完成, url:" + shareResult.getUrl());
                    }
                });
            }

            @Override
            public void onExportProgress(int percent) {
                addLog("导出视频 进行中, 进度: " + percent + "%");
                RXLogger.d("WLTest", "onVideoExported progress:" + percent);

            }
        });
    }

    private void shareVideo() {
        String oneLandscapeTemplateId = "387511071394504218_templateCS30021";
        String filepath = "/storage/emulated/0/Android/data/app.weile.doudizhu.huawei/files/huawei_replay_1736403166240.mp4";
        HuaweiReplayHelper.getInstance().applyShare(filepath, oneLandscapeTemplateId, new OnApplyShareCallback() {
            @Override
            public void onApplyShare(ShareResult shareResult) {
                RXLogger.d("WLTest", "onApplyShare url:" + shareResult.getUrl());
//                shareUrl(shareResult.getUrl());
            }
        });
    }

    private void share(String func) {
        Map<String, Object> shareReqMap = new HashMap<>();
        shareReqMap.put("func", func);//分享埋点
        shareReqMap.put("protocol_android", "jixiang433://");//android 客户端scheme
        shareReqMap.put("protocol_ios", "jixiang433://");//iOS 客户端scheme
        shareReqMap.put("auto_report", true);

        List<String> importFilePaths = new ArrayList<>();
        if (!localFilePaths.isEmpty()) {
            int size = Math.min(localFilePaths.size(), 3);
            for (int i = 0; i < size; i++) {
                importFilePaths.add(localFilePaths.get(i));
            }
        }
        addLog("开始一键分享，视频合成需要点时间，请耐心等待 ...");
        HuaweiReplayHelper.getInstance().share(this, importFilePaths, shareReqMap, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.d("WLTest", "share success");
                addLog("一键分享成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.d("WLTest", "share failed:" + cause);
                addLog("一键分享失败: " + cause);
            }
        });
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        RuiXueSdk.onActivityResult(this, requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_PERMISSION) {
            RXLogger.d("WLTest", "grant results " + Arrays.toString(grantResults));
        }
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
