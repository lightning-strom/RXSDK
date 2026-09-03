/****************************************************************************
Copyright (c) 2015-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.cpp;

import android.content.Intent;
import android.os.Bundle;
import android.os.Build;
import android.view.View;
import android.view.WindowInsets;
import android.view.DisplayCutout;
import android.graphics.Rect;
import android.util.DisplayMetrics;
import androidx.annotation.NonNull;
import org.cocos2dx.lib.Cocos2dxActivity;
import com.ruixue.sdk.RuixueSDK;
import com.ruixue.openapi.RXSDK;

public class AppActivity extends Cocos2dxActivity {

    private static int sStatusBarHeight = 0;
    private static int sDisplayCutoutTop = 0;
    private static float sScreenDensity = 1.0f;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.setEnableVirtualButton(false);
        super.onCreate(savedInstanceState);
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        
        // 获取屏幕密度
        DisplayMetrics dm = getResources().getDisplayMetrics();
        sScreenDensity = dm.density;
        
        // 获取状态栏高度
        int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            sStatusBarHeight = getResources().getDimensionPixelSize(resourceId);
        }
        
        // 获取刘海屏/打孔屏高度 (Android P 及以上)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            final View decorView = getWindow().getDecorView();
            decorView.post(new Runnable() {
                @Override
                public void run() {
                    WindowInsets windowInsets = decorView.getRootWindowInsets();
                    if (windowInsets != null) {
                        DisplayCutout cutout = windowInsets.getDisplayCutout();
                        if (cutout != null) {
                            sDisplayCutoutTop = cutout.getSafeInsetTop();
                        }
                    }
                }
            });
        }
        
        // 初始化瑞雪 SDK 生命周期
        RXSDK.onCreate(this);
        RuixueSDK.setActivity(this);
    }
    
    /**
     * 获取顶部安全区域高度（像素）
     * 返回状态栏高度或刘海屏高度中较大的值
     */
    public static int getTopSafeAreaHeight() {
        return Math.max(sStatusBarHeight, sDisplayCutoutTop);
    }
    
    /**
     * 获取顶部安全区域高度（Cocos2d-x 坐标系）
     * 需要将像素转换为 Cocos2d-x 的点坐标
     */
    public static float getTopSafeAreaInPoints() {
        int pixels = getTopSafeAreaHeight();
        // Cocos2d-x 使用点坐标，需要根据设计分辨率进行转换
        return pixels / sScreenDensity;
    }

    @Override
    protected void onStart() {
        super.onStart();
        RXSDK.onStart(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        RXSDK.onResume(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        RXSDK.onPause(this);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        RXSDK.onActivityResult(this, requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
            @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        RXSDK.onRequestPermissionsResult(this, requestCode, permissions, grantResults);
    }

    @Override
    protected void onStop() {
        super.onStop();
        RXSDK.onStop(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        RuixueSDK.onDestroy();
    }
}
