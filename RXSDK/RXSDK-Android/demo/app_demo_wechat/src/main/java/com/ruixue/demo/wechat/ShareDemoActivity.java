package com.ruixue.demo.wechat;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpClient;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.share.MIMEType;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareMediaType;
import com.ruixue.share.ShareObject;
import com.ruixue.share.system.SystemShare;
import com.ruixue.utils.AssetsUtil;
import com.ruixue.utils.JSONUtil;
import com.ruixue.wechat.WXSdkWrapper;

import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


public class ShareDemoActivity extends AppCompatActivity implements View.OnClickListener {
    private static final String TAG = RuiXueSdk.TAG;
    public int mTargetScene = 0;
    private String mWxAppid = "";
    private TextView tvShareFileUri;
    private EditText et_gh_username;
    private EditText et_link;
    private CheckBox cb_qr_link;
    private Uri shareFileUrl = null;


    public void showLog(final String log) {
        Log.i(TAG, log);
        runOnUiThread(() -> {
            View tvView = findViewById(R.id.tv_log);
//            View svView = findViewById(R.id.sv_log);
            if (tvView instanceof TextView) {
                ((TextView) tvView).setText(log);
            }
            ToastUtils.showToast(this, log);
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
                showLog("分享已发送成功");
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

    private Map<String, Object> addQRParams(Map<String, Object> share) {
        if (cb_qr_link.isChecked()) {
            String url = et_link.getText().toString();
            share.put("url", url);
            share.put("wh", 150);
            share.put("x", 10);
            share.put("y", 15);
        }
        return share;
    }

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
            share.put("title", "分享标题 分享文本参数");
            share.put("material_type", ShareMediaType.TEXT);
            share.put("shareScene", mTargetScene);
        } else if (id == R.id.wx_business) {
////{"businessType":"requestMerchantTransfer","query":"mchId=1610603362&appId=wxd9cba83a0a1ef20d&package=ABBQO%2BoYAAABAAAAAAAUHfHQk7Oq4CYq7AVNaRAAAADnGpepZahT9IkJjn90%2B1qg%2BGR3j5vdnB3o%2B563YJ18I1bQy3xi8OUqBGjFv%2BgnheiH22q1%2FdPOPwMgtNevQA%2BR%2B7zn216CLht8%2BgYY1WYAO5kAi1A%3D"}
            WXSdkWrapper.getInstance().openBusinessView(this, "wxd9cba83a0a1ef20d", "requestMerchantTransfer", "mchId=1610603362&appId=wxd9cba83a0a1ef20d&package=ABBQO%2BoYAAABAAAAAAAUHfHQk7Oq4CYq7AVNaRAAAADnGpepZahT9IkJjn90%2B1qg%2BGR3j5vdnB3o%2B563YJ18I1bQy3xi8OUqBGjFv%2BgnheiH22q1%2FdPOPwMgtNevQA%2BR%2B7zn216CLht8%2BgYY1WYAO5kAi1A%3D", new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    showLog(String.valueOf(data));
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    showLog(cause.toString());
                }
            });
        } else if (id == R.id.open_wx) {
            WXSdkWrapper.openWXApp(this);
        } else if (id == R.id.send_img_net) {
//          分享网络图片参数
            share.put("shareScene", mTargetScene);
            share.put("material_type", ShareMediaType.IMAGE);
            addQRParams(share);
            share.put("image", et_link.getText().toString());

        } else if (id == R.id.send_img_local) {
            //         分享本地图片参数
            share.put("shareScene", mTargetScene);
            share.put("material_type", ShareMediaType.IMAGE);
            addQRParams(share);
            if (shareFileUrl != null) {
                share.put("image", shareFileUrl.toString());
            } else {
                share.put("image", this.getExternalFilesDir(null) + File.separator + "share_test.png");
            }
            RXLogger.i("share image path :" + (String) share.get("image"));

        } else if (id == R.id.send_subscribe_msg) {
            share.put("scene", 1000);
            share.put("template_id", "7YuTL__ilzyZB9DXcDt2mHx-CAS_E7KtsQkhIGVhhRM"); //订阅消息模板 ID，在微信开放平台提交应用审核通过后获得
            share.put("reserved", "reserved_value");
            WXSdkWrapper.subscribeMessage(this, share, callback);
            return;
        } else if (id == R.id.open_miniprogram) {
            String gh_id = getMiniGhId();
            share.put("username", gh_id);
            WXSdkWrapper.openMiniProgram(this, share, callback);
            return;
        } else if (id == R.id.send_webpage) {
            Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());
            // 分享url参数
            share.put("title", "title够兄弟才拆红包！470万金豆一起拆！");
            share.put("content", "content够兄弟才拆红包！470万金豆一起拆！"); //只在会话时显示，朋友圈时不显示
            share.put("show_content_in_circle", true);
            share.put("shareScene", mTargetScene);
            share.put("material_type", ShareMediaType.WEBPAGE);
//            share.put("image", "https://img1.baidu.com/it/u=1569546883,489283881&fm=26&fmt=auto&gp=0.jpg");
            share.put("image", "https://rxfile.weileliii.com/share/link_contents/81.png?ts=1647360568");
//            share.put("url", "https://mobile.jixiang.cn/html/fb.html?image=https://www.tongitsshow.com/images/share/share_3.jpg");
            share.put("url", et_link.getText().toString());

        } else if (id == R.id.send_video) {
            // 分享url参数
            share.put("title", "分享视频，最新新渣渣辉全集视频");
            share.put("content", "渣渣辉开始讲话！");
            share.put("shareScene", mTargetScene);
            share.put("material_type", ShareMediaType.VIDEO);
            share.put("url", "https://media.w3.org/2010/05/sintel/trailer.mp4");
        } else if (id == R.id.send_icon_web) {
            Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());
            // 分享url参数
            share.put("title", "title够兄弟才拆红包！470万金豆一起拆！");
            share.put("content", "content描述网页类型，够兄弟才拆红包！470万金豆一起拆！");
            share.put("shareScene", mTargetScene);
            share.put("material_type", ShareMediaType.WEBPAGE);
            share.put("url", et_link.getText().toString());

        } else if (id == R.id.get_token) {
            WXSdkWrapper.login(this, share, callback);
            return;

        } else if (id == R.id.unregister) {
            WXSdkWrapper.unregisterApp();
            return;

        } else if (id == R.id.send_mini) {
//                分享小程序
            share.put("material_type", ShareMediaType.A2M);
            share.put("title", "分享微信小程序标题");
            share.put("content", "开发者在 App 中在集成微信 SDK 后，可调用接口实现，以下依次是文字、图片、音乐、视频、网页、小程序类型分享的示例。如果分享的消息中涉及文件路径（如图片类型消息），建议开发者针对 Android 7.0 版本及以上设备，判断微信版本支持的情况下，更新为 FileProvider 的方式进行分享。详情查阅《OpenSDK 支持 FileProvider 方式分享文件到微信文档》\n" + "\n" + "WXMediaMessage （微信媒体消息内容）说明");
            share.put("image", "http://weilefun.com/fish/general/c7c99ee889d3a1c1/image/bg.jpg"); // 小程序消息封面图片，小于128k
            share.put("url", "http://weilefun.com/fish/general/index.html?rtag=c7c99ee889d3a1c1&identity=_sIxSTdVg&protocol_android=weile263&protocol_ios=weile263&api=https%3A%2F%2Frx-api.weileyurtr.com%2F");   // 兼容低版本的网页链接
//            share.put("username", "gh_d43f693ca31f");
            String gh_id = getMiniGhId();
            share.put("username", gh_id);
            share.put("path", "/pages/media");

        } else if (id == R.id.download_img) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Bitmap bmp = HttpClient.getRemoteBitmap(et_link.getText().toString());
                        String path = ShareDemoActivity.this.getExternalFilesDir(null).getPath() + "/share.png";
                        FileOutputStream out = new FileOutputStream(path);
                        bmp.compress(Bitmap.CompressFormat.PNG, 100, out);
                        out.flush();
                        out.close();
                        shareFileUrl = Uri.parse(path);
                        RXLogger.i(path);
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                tvShareFileUri.setText(shareFileUrl.toString());
                            }
                        });
                        RXLogger.i(shareFileUrl.toString());
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }).start();

            return;

        }
        if (share.size() > 2) {
//            RXLogger.i( ShareObject.fromMap(share).toString());
            RXSdkApi.getInstance().share(ShareDemoActivity.this, share, callback);
        }
    }

    @NonNull
    private String getMiniGhId() {
        String gh_id = et_gh_username.getText().toString();
        if (TextUtils.isEmpty(gh_id)) {
            gh_id = "gh_f24d58f11458"; //com.weile.jxmj 小程序原始id
        }
        return gh_id;
    }


    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.wechat_demo);
        tvShareFileUri = findViewById(R.id.tv_share_file_url);
        et_gh_username = findViewById(R.id.et_gh_username);
        et_link = findViewById(R.id.et_link);
        cb_qr_link = findViewById(R.id.cb_qr_link);
//        et_link.setText("http://weilefun.com/fish/general/index.html?rtag=c7c99ee889d3a1c1&identity=_sIxSTdVg&protocol_android=weile263&protocol_ios=weile263&api=https%3A%2F%2Frx-api.weileyurtr.com%2F");
        et_link.setText("http://weilefun.com/fish/general/c7c99ee889d3a1c1/image/bg.jpg");

        et_gh_username.setText("gh_f24d58f11458"); //com.weile.jxmj 小程序原始id

        this.mWxAppid = getIntent().getStringExtra("wx_appid");
        Log.i(TAG, "wx_appid: " + this.mWxAppid);
        RuiXueSdk.trackingLifecycle(this);
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
//                requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_WRITE_STORAGE_PERMISSION);
            } else {
                Toast.makeText(this, "缺少文件读写权限，可能会造成无法分享文件", Toast.LENGTH_SHORT).show();
            }
        }
        AssetsUtil.copyFromAssets(this, "png");
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
        } else if (id == R.id.target_scene_select) {
            if (checked) {
                mTargetScene = -1;
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

    public void onClickChooseFile(View view) {
        if (view.getId() == R.id.bt_choose_share_file) {
            openFileChooser();
        }
    }

    //点击系统分享
    public void onClickSystemShare(View view) {
        int resid = view.getId();
        if (resid == R.id.sys_send_text) {
            //文本类型不支持朋友圈
            ShareObject shareObject = new ShareObject();
            shareObject.setPlatform(PlatformType.SYSTEM.getKeyword());
            shareObject.setTitle("分享文本标题");
            shareObject.setDescription("分享文本描述");
            shareObject.setShareScene(mTargetScene);
            shareObject.setType(ShareMediaType.TEXT);
            String jsonStr = new Gson().toJson(shareObject);
            RXLogger.i(jsonStr);
            Map<String, Object> map = new Gson().fromJson(jsonStr, new TypeToken<Map<String, Object>>() {
            }.getType());
            Map<String, Object> map1 = JSONUtil.fromJson(jsonStr, new TypeToken<Map<String, Object>>() {
            }.getType());

            RXSdkApi.getInstance().share(this, map1, (RXJSONCallback) callback);

//            Map<String, Object> map = new HashMap<>();
//            map.put("platform", "system");
//            map.put("material_type", "text");
//            map.put("title", "title");
//            map.put("content", "test");
//            map.put("url", "");
//            map.put("image", "");
//            map.put("shareScene", -1);
//            RXSdkApi.getInstance().share(this, map, (RXJSONCallback) callback);


        } else if (resid == R.id.sys_send_image) {
//            new SystemShare.Builder(this).setContentType(MIMEType.IMAGE).setShareFileUri(getShareFileUri()).setShareScene(mTargetScene).setTitle("Share Image").setTextContent("Share Image text show").build().shareBySystem();
            Uri uri = getShareFileUri();
            shareImageBySystem(uri == null ? null : uri.toString());
        } else if (resid == R.id.sys_send_net_image) {
            shareImageBySystem(et_link.getText().toString());
        } else if (resid == R.id.sys_send_audio) {
            new SystemShare.Builder(this).setContentType(MIMEType.AUDIO).setShareFileUri(getShareFileUri()).setTitle("Share Audio").build().shareBySystem();
        } else if (resid == R.id.sys_send_video) {
            new SystemShare.Builder(this).setContentType(MIMEType.VIDEO).setShareFileUri(getShareFileUri()).setTitle("Share Video").build().shareBySystem();

        } else if (resid == R.id.sys_send_file) {
            new SystemShare.Builder(this).setContentType(MIMEType.FILE).setShareFileUri(getShareFileUri()).setTitle("Share File").setOnActivityResult(REQUEST_SHARE_FILE_CODE).build().shareBySystem();
        }
    }

    private void shareImageBySystem(String imagePath) {
        ShareObject shareObject = new ShareObject();
        shareObject.setPlatform(PlatformType.SYSTEM.getKeyword());
        shareObject.setTitle("系统分享图片示例");
        shareObject.setShareScene(mTargetScene);
        shareObject.setType(ShareMediaType.IMAGE);
        if (cb_qr_link.isChecked()) {
            shareObject.setWidth(150);
            shareObject.setHeight(150);
            String qr_url = et_link.getText().toString();
            if (TextUtils.isEmpty(qr_url)) {
                qr_url = "http://weilefun.com/fish/general/index.html?rtag=c7c99ee889d3a1c1&identity=_sIxSTdVg&protocol_android=weile263&protocol_ios=weile263&api=https%3A%2F%2Frx-api.weileyurtr.com%2F";
            }
            shareObject.setUrl(qr_url);
        }
        shareObject.setImage(imagePath);
        RXSdkApi.getInstance().share(this, shareObject.toMap(), callback);
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
