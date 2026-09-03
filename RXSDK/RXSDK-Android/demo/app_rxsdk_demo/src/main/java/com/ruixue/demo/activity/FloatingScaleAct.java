package com.ruixue.demo.activity;

import android.os.Bundle;
import android.util.Log;
import android.view.Display;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;

import androidx.appcompat.app.AppCompatActivity;

 import com.ruixue.qipai.R;
//import androidx.databinding.DataBindingUtil;


public class FloatingScaleAct extends AppCompatActivity {
    private static final String TAG = "rfDevFloatingAct";

//    ActFloatScaleBinding mBinding;

    private boolean mIsSmall = false; // 当前是否小窗口
    private float mLastTx = 0; // 手指的上一个位置
    private float mLastTy = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        supportRequestWindowFeature(Window.FEATURE_NO_TITLE);
        super.onCreate(savedInstanceState);

        WindowManager.LayoutParams layoutParams = getWindow().getAttributes();
        layoutParams.flags = WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS | WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;

        setContentView(R.layout.act_float_scale);

//        ConsoleListView consoleListView = new ConsoleListView(this, null);
//        WindowManager.LayoutParams clp = new WindowManager.LayoutParams(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT);
//        consoleListView.setLayoutParams(clp);
//        EasyFloat.with(this).setLayout(consoleListView).show();


        WindowManager.LayoutParams clp = new WindowManager.LayoutParams(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT);
//        consoleListView.setLayoutParams(clp);
//        new EasyWindow<>(getApplication())
//                .setContentView(consoleListView)
//                .setGravity(Gravity.START | Gravity.TOP)
//                .setYOffset(600)
//                // 设置指定的拖拽规则
//                .setDraggable(new SpringDraggable(SpringDraggable.ORIENTATION_VERTICAL))
//                .show();

        findViewById(R.id.to_small).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                toSmall();
            }
        });

        findViewById(R.id.to_reset).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                WindowManager.LayoutParams lp = getWindow().getAttributes();
                lp.x = 0;
                lp.y = 0;
                getWindow().setAttributes(lp);
                getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
                mIsSmall = false;
            }
        });

        findViewById(R.id.root).setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        Log.d(TAG, "down " + event);
                        mLastTx = event.getRawX();
                        mLastTy = event.getRawY();
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        Log.d(TAG, "move " + event);
                        float dx = event.getRawX() - mLastTx;
                        float dy = event.getRawY() - mLastTy;
                        mLastTx = event.getRawX();
                        mLastTy = event.getRawY();
                        Log.d(TAG, "  dx: " + dx + ", dy: " + dy);
                        if (mIsSmall) {
                            WindowManager.LayoutParams lp = getWindow().getAttributes();
                            lp.x += dx;
                            lp.y += dy;
                            getWindow().setAttributes(lp);
                        }

                        break;
                    case MotionEvent.ACTION_UP:
                        Log.d(TAG, "up " + event);
                        return true;
                    case MotionEvent.ACTION_CANCEL:
                        Log.d(TAG, "cancel " + event);
                        return true;
                }
                return false;
            }
        });

//        mBinding = DataBindingUtil.setContentView(this, R.layout.act_float_scale);
//
//        mBinding.toSmall.setOnClickListener(v -> toSmall());
//        mBinding.toReset.setOnClickListener(v -> {
//            WindowManager.LayoutParams lp = getWindow().getAttributes();
//            lp.x = 0;
//            lp.y = 0;
//            getWindow().setAttributes(lp);
//            getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
//            mIsSmall = false;
//        });
//
//        mBinding.root.setOnTouchListener((v, event) -> {
//            switch (event.getAction()) {
//                case MotionEvent.ACTION_DOWN:
//                    Log.d(TAG, "down " + event);
//                    mLastTx = event.getRawX();
//                    mLastTy = event.getRawY();
//                    return true;
//                case MotionEvent.ACTION_MOVE:
//                    Log.d(TAG, "move " + event);
//                    float dx = event.getRawX() - mLastTx;
//                    float dy = event.getRawY() - mLastTy;
//                    mLastTx = event.getRawX();
//                    mLastTy = event.getRawY();
//                    Log.d(TAG, "  dx: " + dx + ", dy: " + dy);
//                    if (mIsSmall) {
//                        WindowManager.LayoutParams lp = getWindow().getAttributes();
//                        lp.x += dx;
//                        lp.y += dy;
//                        getWindow().setAttributes(lp);
//                    }
//
//                    break;
//                case MotionEvent.ACTION_UP:
//                    Log.d(TAG, "up " + event);
//                    return true;
//                case MotionEvent.ACTION_CANCEL:
//                    Log.d(TAG, "cancel " + event);
//                    return true;
//            }
//            return false;
//        });
    }

    private void toSmall() {
        mIsSmall = true;
        WindowManager m = getWindowManager();
        Display d = m.getDefaultDisplay();
        WindowManager.LayoutParams p = getWindow().getAttributes();
        p.height = (int) (d.getHeight() * 0.35);
        p.width = (int) (d.getWidth() * 0.2);
        p.x = 100;
        p.y = 100;
        p.dimAmount = 0.0f;
        getWindow().setAttributes(p);
//         moveTaskToBack(true);
    }
}
