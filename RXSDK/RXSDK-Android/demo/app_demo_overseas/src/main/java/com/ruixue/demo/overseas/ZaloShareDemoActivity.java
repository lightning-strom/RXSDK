package com.ruixue.demo.overseas;

import android.os.Bundle;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.ruixue.RXJSONCallback;
import com.ruixue.demo.overseas.databinding.ActivityZaloShareDemoBinding;
import com.ruixue.logger.RXLogger;

import org.json.JSONObject;

import java.util.Objects;

// create by wangliang at 2024/3/21
public class ZaloShareDemoActivity extends AppCompatActivity {

    private ActivityZaloShareDemoBinding binding;

    private ZaloShareHelper shareHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityZaloShareDemoBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setTitle("Zalo 分享");
        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);

        shareHelper = new ZaloShareHelper(this);
        initViews();
    }

    private void initViews() {
        if (binding == null) {
            return;
        }

        binding.linkEt.setText("https://iwn478abe.fishinggamezone.com/landing/third/TG8sjCLdWBaCgVcbFKkyEP/1695120987/06-vi/index.html");
        binding.linkTitleEt.setText("title");
        binding.linkContentEt.setText("content");

        binding.shareBtn.setOnClickListener(view -> {
            if (shareHelper != null) {
                String url = binding.linkEt.getText().toString();
                String title = binding.linkTitleEt.getText().toString();
                String content = binding.linkContentEt.getText().toString();
                shareHelper.shareLinkToZalo(url, title, content, new MyShareCallback());
            }
        });

        binding.shareFeedBtn.setOnClickListener(view -> {
            if (shareHelper != null) {
                String url = binding.linkEt.getText().toString();
                String title = binding.linkTitleEt.getText().toString();
                String content = binding.linkContentEt.getText().toString();
                shareHelper.shareLinkToZaloFeed(url, title, content, new MyShareCallback());
            }
        });

        binding.shareFriendBtn.setOnClickListener(view -> {
            if (shareHelper != null) {
                String url = binding.linkEt.getText().toString();
                String title = binding.linkTitleEt.getText().toString();
                String content = binding.linkContentEt.getText().toString();
                shareHelper.shareLinkToZaloFriend(url, title, content, new MyShareCallback());
            }
        });
    }

    private static class MyShareCallback extends RXJSONCallback {

        @Override
        public void onSuccess(@Nullable JSONObject data) {
            RXLogger.i("share success");
        }

        @Override
        public void onFailed(@NonNull JSONObject cause) {
            RXLogger.e("share failed " + cause);
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
