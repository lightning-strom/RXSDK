package com.ruixue.demo.activity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.qipai.R;
import com.ruixue.share.ShareMediaType;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class LineActivity extends BaseSdkLifecycleActivity implements View.OnClickListener {

    private EditText et_link;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_line);
        et_link = findViewById(R.id.et_link);
        et_link.setText("http://weilefun.com/fish/general/c7c99ee889d3a1c1/image/bg.jpg");
    }

    RXJSONCallback rxjsonCallback = new RXJSONCallback() {
        @Override
        public void onSuccess(@Nullable JSONObject data) {

        }

        @Override
        public void onFailed(@NonNull JSONObject cause) {

        }
    };

    @Override
    public void onClick(View v) {
        int id = v.getId();
        Map<String, Object> map = new HashMap<>();
        if (id == R.id.line_login) {
            map.put("method", LoginMethod.LINE);
            RuiXueSdk.login(this, map, rxjsonCallback);
        } else if (id == R.id.line_share_text) {
            map.put("material_type", ShareMediaType.TEXT);
            map.put("title", "line share title");
            map.put("content", "line share content");
            doShare(map);
        } else if (id == R.id.line_share_image_local) {
            map.put("material_type", ShareMediaType.IMAGE);
            doShare(map);
        } else if (id == R.id.line_share_image_net) {
            map.put("material_type", ShareMediaType.IMAGE);
            map.put("url", et_link.getText().toString());
            doShare(map);
        } else if (id == R.id.line_share_link) {
            map.put("material_type", ShareMediaType.WEBPAGE);
            map.put("image", "https://rxfile.weileliii.com/share/link_contents/81.png?ts=1647360568");
            map.put("url", et_link.getText().toString());
            doShare(map);
        }

    }


    public void doShare(Map<String, Object> map) {
        map.put("platform", "line");
        RXSdkApi.getInstance().share(this, map, rxjsonCallback);
    }
}