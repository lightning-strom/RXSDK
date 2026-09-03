package com.ruixue.demo.activity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import androidx.fragment.app.FragmentActivity;

import com.ruixue.qipai.R;


public class SplashActivity extends FragmentActivity {
  private static final String TAG = "SplashActivity";
  Handler mHandler = new Handler(Looper.getMainLooper());

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_splash);
    if (checkPrivacyAgree()) {
      mHandler.postDelayed(new Runnable() {
        @Override
        public void run() {
          startActivity(new Intent(SplashActivity.this, MainActivity.class));
          overridePendingTransition(0, 0);
          SplashActivity.this.finish();
        }
      }, 2000);
      return;
    }
//    Log.e(TAG,"Boolean.parseBoolean(BuildConfig.USE_SDK_PRIVACY) : " +
//        ""+Boolean.parseBoolean(BuildConfig.USE_SDK_PRIVACY));
//
//    //TODO cp接入时候，根据自己需求选择对应的分支， 是使用自己的隐私协议 还是sdk的隐私协议，如果使用自己的隐私协议，需要 sdk  在服务端配置中关闭自己的隐私
//    if(Boolean.parseBoolean(BuildConfig.USE_SDK_PRIVACY)){
//      useSdkPrivacy();
//    }else {
//      usePrivacy();
//    }
  }

//  private void usePrivacy() {
//    AlertDialog.Builder builder = null;
//    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP_MR1) {
//      builder =
//          new AlertDialog.Builder(this,
//              android.R.style.Theme_DeviceDefault_Light_Dialog_Alert);
//    } else {
//      builder =
//          new AlertDialog.Builder(this,
//              android.R.style.Theme_DeviceDefault_Light_Dialog);
//    }
//    builder.setTitle("隐私权保护政策");
//    builder.setMessage("我是隐私协议的内容，是假的");
//    builder.setPositiveButton("确认", new DialogInterface.OnClickListener() {
//      @Override
//      public void onClick(DialogInterface dialog, int which) {
////    KwaiSdk.setSplashActivityName(SplashActivity.class.getName());
//        dialog.dismiss();
//        SharedPreferences sharedPreferences = getSharedPreferences("privacy", Context.MODE_PRIVATE);
//        sharedPreferences.edit().putBoolean("isPrivacyAgree", true).apply();
//        mHandler.postDelayed(new Runnable() {
//          @Override
//          public void run() {
//            //TODO 必须设置，CP 如果使用自己的隐私协议， 这个值没有会出问题 最好在闪屏之后，游戏界面启动时候调用
//            KwaiSdk.setPrivacyAgree();
//
//            startActivity(new Intent(SplashActivity.this, PermissionActivity.class));
//            overridePendingTransition(0, 0);
//            SplashActivity.this.finish();
//          }
//        }, 300);
//        dialog.dismiss();
//      }
//    });
//    builder.setNegativeButton("取消", new DialogInterface.OnClickListener() {
//      @Override
//      public void onClick(DialogInterface dialog, int which) {
//        finish();
//      }
//    });
//    builder.show();
//  }

  private boolean checkPrivacyAgree() {
    SharedPreferences sharedPreferences = getSharedPreferences("privacy", Context.MODE_PRIVATE);
    return sharedPreferences.getBoolean("isPrivacyAgree", false);
  }

//  private void useSdkPrivacy() {
//    SharedPreferences sharedPreferences = getSharedPreferences("privacy", Context.MODE_PRIVATE);
//    boolean isPrivacyAgree = sharedPreferences.getBoolean("isPrivacyAgree", false);
//    Log.e(TAG, " is agree goto game isPrivacyAgree : "+isPrivacyAgree);
//    if (isPrivacyAgree) {
//      mHandler.postDelayed(new Runnable() {
//        @Override
//        public void run() {
//          Log.e(TAG, " start");
//          startActivity(new Intent(SplashActivity.this, PermissionActivity.class));
//          overridePendingTransition(0, 0);
//          SplashActivity.this.finish();
//        }
//      }, 3000);
//      return;
//    }
//
//    final long startTime = System.currentTimeMillis();
//    KwaiSdk.setCallback(new KwaiSdkCallback() {
//      @Override
//      public void onPrivacyAgree(boolean userclick) {
//        SharedPreferences sharedPreferences = getSharedPreferences("privacy", Context.MODE_PRIVATE);
//        sharedPreferences.edit().putBoolean("isPrivacyAgree", true).apply();
//        Log.e(TAG, "KwaiSdkCallback onPrivacyAgree=" + userclick);
//        long time = System.currentTimeMillis() - startTime;
//        if (time > 3000) {
//          mHandler.postDelayed(new Runnable() {
//            @Override
//            public void run() {
//              KwaiSdk.setPrivacyAgree();
//              startActivity(new Intent(SplashActivity.this, PermissionActivity.class));
//              overridePendingTransition(0, 0);
//              SplashActivity.this.finish();
//            }
//          }, 300);
//        } else {
//          mHandler.postDelayed(new Runnable() {
//            @Override
//            public void run() {
//              startActivity(new Intent(SplashActivity.this, PermissionActivity.class));
//              overridePendingTransition(0, 0);
//              SplashActivity.this.finish();
//            }
//          }, time);
//        }
//      }
//
//      @Override
//      public void forceLogout() {
//      }
//
//      @Override
//      public void switchAccount() {
//      }
//    });
//  }
}