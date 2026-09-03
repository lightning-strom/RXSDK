package com.ruixue.demo.activity;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;
import com.ruixue.qipai.R;

import org.json.JSONObject;

/**
 * Created by wangliang on 2024/9/3
 */
public class PromoTestActivity extends AppCompatActivity {

    private String promoCode;

    @Override
    @SuppressLint("MissingInflatedId")
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_promo_test);
        Button displayBtn = findViewById(R.id.promo_display);
        TextView tvPromoInfo = findViewById(R.id.promoInfo);
        EditText etPromoCode = findViewById(R.id.promoCodeEt);
        displayBtn.setOnClickListener(v -> RuiXueSdk.getRXSdkApi().getPromoDisplayKEY(false, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.d("getPromoDisplayKEY onSuccess" + data);
                tvPromoInfo.setText(data.toString());
                promoCode = data.optString("promo_code");
                etPromoCode.setText(promoCode);
//                ToastUtils.showToast(PromoTestActivity.this, data.toString());
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.e("getPromoDisplayKEY onFailed:" + cause);
                ToastUtils.showToast(PromoTestActivity.this, cause);
            }
        }));

        Button exchangeBtn = findViewById(R.id.promo_exchange);
        TextView tvPromoExchangeInfo = findViewById(R.id.promoChangeInfo);


        exchangeBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String code = etPromoCode.getText().toString();
                if (TextUtils.isEmpty(code)) {
                    ToastUtils.showToast(PromoTestActivity.this, "福利码不能为空");
                    return;
                }
                RuiXueSdk.getRXSdkApi().exchangePromoCDKEY(code, new RXRequestCallback() {


                    @Override
                    public void onResponse(JSONObject jsonObject) {
                        tvPromoExchangeInfo.setText(jsonObject.toString());
                    }
                });
            }
        });
    }
}
