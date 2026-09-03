package com.ruixue.demo.wechat;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.demo.ysdk.R;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.reflect.WXManager;
import com.ruixue.share.MIMEType;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareMediaType;
import com.ruixue.share.ShareObject;
import com.ruixue.share.system.SystemShare;
import com.ruixue.utils.EntityUtils;

import org.json.JSONObject;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class ShareDemoActivity extends AppCompatActivity implements View.OnClickListener {
    private static final String TAG = RuiXueSdk.TAG;
    public int mTargetScene = 0;
    private String mWxAppid = "";
    private TextView tvShareFileUri;
    private EditText et_share_func;
    private Uri shareFileUrl = null;


    public void showLog(final String log) {
        Log.i(TAG, log);
        runOnUiThread(() -> {
            View tvView = findViewById(R.id.tv_log);
//            View svView = findViewById(R.id.sv_log);
            if (tvView instanceof TextView) {
                ((TextView) tvView).setText(log);
            }
//            if (svView instanceof ScrollView) {
//                ((ScrollView) svView).fullScroll(View.FOCUS_DOWN);
//            }
        });
    }

    RXJSONCallback callback = new RXJSONCallback() {
        @Override
        public void onSuccess(@Nullable JSONObject data) {
            if (data != null)
                showLog(data.toString());
            else {
                showLog("执行成功。。。");
            }
        }

        @Override
        public void onFailed(@NonNull JSONObject cause) {
            showLog(cause.toString());
        }

        @Override
        public void onError(RXException e) {
            showLog(e.getMessage());
        }
    };

    @Override
    public void onClick(View v) {
        int id = v.getId();
        Map<String, Object> share = new HashMap<>();
        share.put("appid", this.mWxAppid);

//        share.put("appid", "wxd9cba83a0a1ef20d");
//        share.put("appid", "wx947d90b240217c7e");//weile.jxmj

        if (TextUtils.isEmpty((CharSequence) share.get("appid"))) {
            Toast.makeText(this, "wechat appid is null error", Toast.LENGTH_LONG).show();
            return;
        }

        if (id == R.id.send_text) {
//          分享文本参数
            share.put("title", "分享标题： wxd9cba83a0a1ef20d123");
            share.put("type", ShareMediaType.TEXT);
            share.put("shareScene", mTargetScene);
        } else if (id == R.id.send_img) {
//          分享网络图片参数
            share.put("shareScene", mTargetScene);
            share.put("type", "image");
            share.put("url", "https://ruixueyun.yuque.com/dashboard");
            share.put("wh", 150);
            share.put("x", 10);
            share.put("y", 15);
//            share.put("imageUrl", "https://cloudimg2.weile.com/channelshare/20210402/1617334963.png");
//            share.put("imageUrl", "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.lanrentuku.com%2Fimg%2Fallimg%2F2001%2F15804396073272.jpg&refer=http%3A%2F%2Fimg.lanrentuku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652940089&t=8342c002ab828c7e6cfc76ae67c74ab7");
            share.put("imageUrl", "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F022221105922%2F210222105922-7-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652940120&t=9afa2c6fd3e22bbf202ab1ba4040b494");

        } else if (id == R.id.send_localimg) {
            //         分享本地图片参数
            share.put("shareScene", mTargetScene);
            share.put("type", ShareMediaType.IMAGE);
            share.put("url", "https://ruixueyun.yuque.com/dashboard");

            if (shareFileUrl != null) {
                share.put("imageUrl", shareFileUrl.toString());
            } else {
                share.put("imageUrl", Environment.getExternalStorageDirectory().getPath() + File.separator + "123123.jpg");
            }
            RXLogger.i((String) share.get("imageUrl"));

        } else if (id == R.id.send_subscribe_msg) {
            share.put("scene", 1000);
            share.put("template_id", "7YuTL__ilzyZB9DXcDt2mHx-CAS_E7KtsQkhIGVhhRM"); //订阅消息模板 ID，在微信开放平台提交应用审核通过后获得

            share.put("reserved", "reserved_value");
            WXManager.subscribeMessage(this, share, callback);
            return;
        } else if (id == R.id.open_miniprogram) {
            share.put("username", "gh_f24d58f11458"); //com.weile.jxmj 小程序原始id
            WXManager.openMiniProgram(this, share, callback);
            return;
        } else if (id == R.id.send_webpage) {
            Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());
            // 分享url参数
            share.put("title", "够兄弟才拆红包！470万金豆一起拆！");
//            share.put("description", "够兄弟才拆红包！470万金豆一起拆！");
            share.put("shareScene", mTargetScene);
            share.put("type", "url");
//            share.put("imageUrl", "https://img1.baidu.com/it/u=1569546883,489283881&fm=26&fmt=auto&gp=0.jpg");
            share.put("imageUrl", "https://rxfile.weileliii.com/share/link_contents/81.png?ts=1647360568");

            share.put("url", "https://developers.weixin.qq.com/doc/oplatform/Mobile_App/Share_and_Favorites/Android.html");

        } else if (id == R.id.send_icon_web) {
            Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());
            // 分享url参数
            share.put("title", "够兄弟才拆红包！470万金豆一起拆！");
//            share.put("description", "描述网页类型，够兄弟才拆红包！470万金豆一起拆！");
            share.put("shareScene", mTargetScene);
            share.put("type", "url");
            share.put("url", "https://developers.weixin.qq.com/doc/oplatform/Mobile_App/Share_and_Favorites/Android.html");

        } else if (id == R.id.get_token) {
            WXManager.login(this, share, callback);
            return;

        } else if (id == R.id.unregister) {
            WXManager.unregisterApp(this);
            return;

        } else if (id == R.id.send_mini) {
//                分享小程序
            share.put("type", "a2m");
            share.put("title", "Android开发手册");
            share.put("description", "开发者在 App 中在集成微信 SDK 后，可调用接口实现，以下依次是文字、图片、音乐、视频、网页、小程序类型分享的示例。如果分享的消息中涉及文件路径（如图片类型消息），建议开发者针对 Android 7.0 版本及以上设备，判断微信版本支持的情况下，更新为 FileProvider 的方式进行分享。详情查阅《OpenSDK 支持 FileProvider 方式分享文件到微信文档》\n" +
                    "\n" +
                    "WXMediaMessage （微信媒体消息内容）说明");
            share.put("imageUrl", "https://img1.baidu.com/it/u=1569546883,489283881&fm=26&fmt=auto&gp=0.jpg"); // 小程序消息封面图片，小于128k
            share.put("url", "http://www.qq.com");   // 兼容低版本的网页链接
//            share.put("username", "gh_d43f693ca31f");
            share.put("username", "gh_f24d58f11458"); //com.weile.jxmj 小程序原始id
            share.put("path", "/pages/media");

        } else if (id == R.id.strategy_share) {
            String func = et_share_func.getText().toString();
            func = TextUtils.isEmpty(func) ? "match" : func;
            String region = ((EditText) findViewById(R.id.et_region)).getText().toString();
            region = TextUtils.isEmpty(region) ? "220101" : region;
            share.put("func", func);
            share.put("region", region);
            share.put("read_cache", true);
            RXSdkApi.getInstance().getShareData(share, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    if (data != null) {
                        showLog(data.toString());
                    }
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    showLog(cause.toString());
                }
            });
            return;
        } else if (id == R.id.strategy_get) {
            //分享限制获取
            String func = ((EditText) findViewById(R.id.et_share_func)).getText().toString();
//            RXSdkApi.getInstance().shareLimit(new String[]{func}, callback);
            return;
        }
        if (share.size() > 2) {

//            RXLogger.i( ShareObject.fromMap(share).toString());
            RXSdkApi.getInstance().share(ShareDemoActivity.this, share, callback);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.wechat_demo);
        tvShareFileUri = findViewById(R.id.tv_share_file_url);
        et_share_func = findViewById(R.id.et_share_func);
        this.mWxAppid = getIntent().getStringExtra("wx_appid");
        Log.i(TAG, "wxappid: " + this.mWxAppid);
        RuiXueSdk.trackingLifecycle(this);
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
//                requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_WRITE_STORAGE_PERMISSION);
            } else {
                Toast.makeText(this, "缺少文件读写权限，可能会造成无法分享文件", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        Log.i(TAG, "onNewIntent");

    }


    public void onRadioButtonClicked(View view) {
        if (!(view instanceof RadioButton)) {
            return;
        }
        boolean checked = ((RadioButton) view).isChecked();
        int id = view.getId();
        if (id == R.id.target_scene_session) {
            if (checked) {
                mTargetScene = 0;
            }
        } else if (id == R.id.target_scene_timeline) {
            if (checked) {
                mTargetScene = 1;
            }
        } else if (id == R.id.target_scene_favorite) {
            if (checked) {
                mTargetScene = 2;
            }
        }
    }


    private static final int FILE_SELECT_CODE = 100;
    private static final int REQUEST_SHARE_FILE_CODE = 120;
    private static final int REQUEST_WRITE_STORAGE_PERMISSION = 121;

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_WRITE_STORAGE_PERMISSION) {
            if (grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "缺少文件读写权限，可能会造成无法分享文件", Toast.LENGTH_SHORT).show();
            }
        }
    }

    public void onClickChooseFile(View view) {
        if (view.getId() == R.id.bt_choose_share_file) {
            openFileChooser();
        }
    }

    //点击系统分享
    public void onClickSystemShare(View view) {
        int resid = view.getId();
        if (resid == R.id.sys_send_text) {
//            new SystemShare.Builder(this)
//                    .setContentType(ShareContentType.TEXT)
//                    .setShareScene(mTargetScene)
//                    .setTextContent("This is a test message.")
//                    .setTitle("Share Text")
//                    // .forcedUseSystemChooser(false)
//                    .build()
//                    .shareBySystem();
            ShareObject shareObject = new ShareObject();
            shareObject.setPlatform(PlatformType.SYSTEM.getKeyword());
            shareObject.setTitle("文本标题");
            shareObject.setDescription("文本描述");
            shareObject.setShareScene(mTargetScene);
            shareObject.setType(ShareMediaType.TEXT);

            RXSdkApi.getInstance().share(this, EntityUtils.entityToMap(shareObject), (RXJSONCallback) callback);
        } else if (resid == R.id.sys_send_image) {
            new SystemShare.Builder(this)
                    .setContentType(MIMEType.IMAGE)
                    .setShareFileUri(getShareFileUri())
                    .setShareScene(mTargetScene)
                    .setTitle("Share Image")
                    .setTextContent("Share Image text show")
                    .build()
                    .shareBySystem();

        } else if (resid == R.id.sys_send_audio) {
            new SystemShare.Builder(this)
                    .setContentType(MIMEType.AUDIO)
                    .setShareFileUri(getShareFileUri())
                    .setTitle("Share Audio")
                    .build()
                    .shareBySystem();
        } else if (resid == R.id.sys_send_video) {
            new SystemShare.Builder(this)
                    .setContentType(MIMEType.VIDEO)
                    .setShareFileUri(getShareFileUri())
                    .setTitle("Share Video")
                    .build()
                    .shareBySystem();

        } else if (resid == R.id.sys_send_file) {
            new SystemShare.Builder(this)
                    .setContentType(MIMEType.FILE)
                    .setShareFileUri(getShareFileUri())
                    .setTitle("Share File")
                    .setOnActivityResult(REQUEST_SHARE_FILE_CODE)
                    .build()
                    .shareBySystem();

        } else if (resid == R.id.sys_send_net_image) {
            ShareObject shareObject = new ShareObject();
            shareObject.setPlatform(PlatformType.SYSTEM.getKeyword());
            shareObject.setTitle("网络 图片");
            shareObject.setShareScene(mTargetScene);
            shareObject.setType(ShareMediaType.IMAGE);
            shareObject.setUrl("https://doc.ruixueyun.com/zh/openapi/share");
            shareObject.setImage("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcdn.68design.net%2Fwork%2Fpic%2F201510%2F1dv2wKjAmW.jpg&refer=http%3A%2F%2Fcdn.68design.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652758330&t=f2e9de4eb62505a2c21db2cd14d68aa3");

            RXSdkApi.getInstance().share(this, EntityUtils.entityToMap(shareObject), callback);
        }
    }


    //点击选择文件
    private void openFileChooser() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("*/*");
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        try {
            startActivityForResult(Intent.createChooser(intent, "选择文件"), FILE_SELECT_CODE);
            overridePendingTransition(0, 0);
        } catch (Exception ex) {
            // Potentially direct the user to the Market with OnProgressChangeListener Dialog
            Toast.makeText(this, "请先安装文件管理器", Toast.LENGTH_SHORT).show();
        }
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, final Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        RuiXueSdk.onActivityResult(this, requestCode, resultCode, data);
        Log.d("DemoActivity", "requestCode=" + requestCode + " resultCode=" + resultCode);
        if (requestCode == FILE_SELECT_CODE && resultCode == RESULT_OK) {
            shareFileUrl = data.getData();
            tvShareFileUri.setText(shareFileUrl.toString());

            // String filePath = FileUtil.getFileRealPath(this, shareFileUrl);
            // shareFileUrl = FileUtil.getFileUri(this, null, new File(filePath));
        } else if (requestCode == REQUEST_SHARE_FILE_CODE) {
            //  share complete.
        }
    }

    public Uri getShareFileUri() {
        if (shareFileUrl == null) {
            tvShareFileUri.setText("Please choose a file to share.");
            Toast.makeText(this, "Please choose a file to share", Toast.LENGTH_SHORT).show();
        }
        return shareFileUrl;
    }

    @Override
    protected void onPostResume() {
        super.onPostResume();
        RXLogger.i("onPostResume");
    }

    @Override
    protected void onResume() {
        super.onResume();
        RXLogger.i("onResume");

    }

    @Override
    protected void onStop() {
        super.onStop();
        RXLogger.i("onStop");
    }
}
