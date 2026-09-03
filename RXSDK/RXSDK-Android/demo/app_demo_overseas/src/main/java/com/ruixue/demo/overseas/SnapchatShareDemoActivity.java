package com.ruixue.demo.overseas;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.ruixue.RXJSONCallback;
import com.ruixue.demo.overseas.databinding.ActivitySnapchatShareDemoBinding;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.share.ShareMediaType;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class SnapchatShareDemoActivity extends AppCompatActivity {

    private static final String TAG = SnapchatShareDemoActivity.class.getSimpleName();

    private static final int SYSTEM_ALBUM_PERMISSION_REQUEST_CODE = 101;
    private static final int OPEN_GALLERY_REQUEST_CODE = 102;

    private ActivitySnapchatShareDemoBinding binding;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySnapchatShareDemoBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        initTitle();

        binding.btnSelectImage.setOnClickListener(view -> {
            selectImage();
        });
        binding.btnSelectVideo.setOnClickListener(view -> {
            selectVideo();
        });

        binding.btnSelectNetImage.setOnClickListener(view -> {
            selectNetImage();
        });

        binding.btnSelectNetVideo.setOnClickListener(view -> selectNetVideo());

        binding.btnAutoShare.setOnClickListener(view -> {
            autoShare();
        });
    }

    private void initTitle() {
        setTitle("Snapchat 分享");
        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);
    }

    private boolean isSharingImage = false;

    private void selectImage() {
        isSharingImage = true;
        requestPermission();
    }

    private void selectVideo() {
        isSharingImage = false;
        requestPermission();
    }

    private void selectNetImage() {
        String url = "https://img95.699pic.com/photo/50136/1351.jpg_wh300.jpg";
        shareImage(url);
    }

    private void selectNetVideo() {
        String url = "https://media.w3.org/2010/05/sintel/trailer.mp4";
        shareVideo(url);
    }

    private void requestPermission() {
        String[] permissionList;
        if (Build.VERSION.SDK_INT < 33) {
            permissionList = new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE};
        } else {
            permissionList = new String[]{Manifest.permission.READ_MEDIA_IMAGES, Manifest.permission.READ_MEDIA_AUDIO, Manifest.permission.READ_MEDIA_VIDEO};
        }

        ActivityCompat.requestPermissions(this, permissionList, SYSTEM_ALBUM_PERMISSION_REQUEST_CODE);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == SYSTEM_ALBUM_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openSystemGallery();
            } else {
                Toast.makeText(this, "Please grant necessary permissions", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void openSystemGallery() {
        Intent intent;
        if (isSharingImage) {
            intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        } else {
            intent = new Intent(Intent.ACTION_PICK, MediaStore.Video.Media.EXTERNAL_CONTENT_URI);
        }
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET);
        startActivityForResult(intent, OPEN_GALLERY_REQUEST_CODE);
    }

    private ArrayList<String> mediaUrls = new ArrayList<>();

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == Activity.RESULT_OK && requestCode == OPEN_GALLERY_REQUEST_CODE) {
            if (data == null) {
                return;
            }
            mediaUrls.clear();
            if (data.getClipData() != null) {
                for (int i = 0; i < data.getClipData().getItemCount(); i++) {
                    Uri uri = data.getClipData().getItemAt(i).getUri();
                    mediaUrls.add(uri.toString());
//                    mediaUrls.add("/data/user/0/com.weile.bygame/cache/b22f4e157c885f973b4e0953b482742b");
//                    mediaUrls.add("/sdcard/DCIM/Camera/IMG_20240328_091756.jpg");
//                    mediaUrls.add("https://img95.699pic.com/photo/50136/1351.jpg_wh300.jpg");
                }
                goToShareActivity();
                return;
            }
            if (data.getDataString() != null) {
                String path = Uri.parse(data.getDataString()).getPath();
                mediaUrls.add(data.getDataString());
                goToShareActivity();
            }
        }
    }

    private void goToShareActivity() {
        String uri = null;

        if (mediaUrls.size() >= 1) {
            uri = mediaUrls.get(0);
        }

        if (uri == null) {
            Toast.makeText(this, "Uri 不能为空", Toast.LENGTH_SHORT).show();
            return;
        }

        if (isSharingImage) {
            shareImage(uri);
        } else {
            shareVideo(uri);
        }
    }

    private void shareImage(String uri) {
        Map<String, Object> shareMap = new HashMap<>();
        shareMap.put("platform", "snapchat");
        shareMap.put("material_type", ShareMediaType.IMAGE);
        shareMap.put("image", uri);
        RXSdkApi.getInstance().share(this, shareMap, new MyShareCallback());
    }

    private void shareVideo(String uri) {
        Map<String, Object> shareMap = new HashMap<>();
        shareMap.put("platform", "snapchat");
        shareMap.put("material_type", ShareMediaType.VIDEO);
        shareMap.put("video", uri);
        RXSdkApi.getInstance().share(this, shareMap, new MyShareCallback());
    }

    private void autoShare() {
        Map<String, Object> shareParams = new HashMap<>();
        shareParams.put("platform", "snapchat");
        shareParams.put("func", "sdk_chengjiu");
        shareParams.put("protocol_android", "jixiang433://");
        shareParams.put("protocol_ios", "jixiang433://");
        shareParams.put("auto_share", true);
        shareParams.put("auto_report", true);
        RXSdkApi.getInstance().share(this, shareParams, new MyShareCallback());
    }

    private static class MyShareCallback extends RXJSONCallback {
        @Override
        public void onSuccess(@Nullable JSONObject data) {
            Log.d(TAG, "snapchat share success");
        }

        @Override
        public void onFailed(@NonNull JSONObject cause) {
            Log.d(TAG, "snapchat share failed :" + cause);
        }
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
