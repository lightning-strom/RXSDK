package com.ruixue.feedbackui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.viewpager2.widget.ViewPager2;

import com.ruixue.feedbackui.R;
import com.ruixue.feedbackui.adapter.PreViewAdapter;
import com.ruixue.feedbackui.bean.FileItem;

import java.util.List;

public class PreviewActivity extends AppCompatActivity {

    public static final String DATA_LIST = "data_list";
    public static final String DATA_POSITION = "data_position";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_preview);

        ImageView back = findViewById(R.id.back);

        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PreviewActivity.this.finish();
            }
        });

        Intent intent = getIntent();
        List<FileItem> dataList = intent.getParcelableArrayListExtra(DATA_LIST);
        int position = intent.getIntExtra(DATA_POSITION, 0);

        if (dataList == null || dataList.isEmpty()) {
            return;
        }

        PreViewAdapter preViewAdapter = new PreViewAdapter(getSupportFragmentManager(), getLifecycle(), dataList);

        ViewPager2 viewPager2 = findViewById(R.id.view_pager);
        viewPager2.setAdapter(preViewAdapter);
        viewPager2.setCurrentItem(position, false);

    }
}