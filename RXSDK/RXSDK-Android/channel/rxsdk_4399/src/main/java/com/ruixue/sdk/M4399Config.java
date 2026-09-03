package com.ruixue.sdk;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.os.Build;
import android.util.SparseArray;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/5/4
 */
public class M4399Config {

//0	成功，通用code
//1	取消，通用code
//2	处理中，通用code
//3	失败，通用code
//4	超时，通用code
//5	中止，通用code
//16	登录成功
//17	不能取得游戏盒认证（一般是号被封了）
//18	登录取消
//19	游戏不存在，GameKey问题
//20	已登录
//21	没有初始化
//22	一键登录失败
//24	拒绝用户协议与隐私政策
//25	网络问题，或者服务端问题
//50	认证通过
//51	待认证
//52	拒绝认证
//53	跳过认证，此时后台配置允许取消
//54	认证审核中
//55	取消认证
//56	认证中断，一般由于账号被顶，或踢出
//57	认证错误，具体消息看对应message
//6001	充值取消
//0, 9000	充值成功
//2, 9001	订单处理中，游戏应等待服务端的充值回调状态
//9002	订单已提交，SDK 不能在有限时间内判断订单状态，游戏应以服务端状态为准

    public static String getErrMsg(int code) {
        return code2Msg.get(code, "未知错误");
    }

    static SparseArray<String> code2Msg = new SparseArray<>();

    static {
        code2Msg.put(0, "成功");
        code2Msg.put(1, "取消");
        code2Msg.put(2, "处理中");
        code2Msg.put(3, "失败");
        code2Msg.put(4, "超时");
        code2Msg.put(5, "中止");
        code2Msg.put(16, "登录成功");
        code2Msg.put(17, "不能取得游戏盒认证（一般是号被封了）");
        code2Msg.put(18, "登录取消");
        code2Msg.put(19, "游戏不存在，GameKey问题");
        code2Msg.put(20, "已登录");
        code2Msg.put(21, "没有初始化");
        code2Msg.put(22, "一键登录失败");
        code2Msg.put(24, "拒绝用户协议与隐私政策");
        code2Msg.put(25, "网络问题，或者服务端问题");
        code2Msg.put(50, "认证通过");
        code2Msg.put(51, "待认证");
        code2Msg.put(52, "拒绝认证");
        code2Msg.put(53, "跳过认证，此时后台配置允许取消");
        code2Msg.put(54, "认证审核中");
        code2Msg.put(55, "取消认证");
        code2Msg.put(56, "认证中断，一般由于账号被顶，或踢出");
        code2Msg.put(57, "认证错误，具体消息看对应message");
        code2Msg.put(6001, "充值取消");
        code2Msg.put(9000, "充值成功");
        code2Msg.put(9001, "订单处理中，游戏应等待服务端的充值回调状态");
        code2Msg.put(9002, "订单已提交，SDK 不能在有限时间内判断订单状态，游戏应以服务端状态为准");
    }

//    private final static int MARK_MAX_LENGTH = 32;
//    private final static String MARK_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
//
//
//    static final boolean SUPPORT_EXCESS = true;
//    static final boolean COMPACT_NOTCH = true;
//
//    public static void compactNotch(Activity activity) {
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P && COMPACT_NOTCH) {
//            Window window = activity.getWindow();
//            if (window != null) {
//                WindowManager.LayoutParams lp = window.getAttributes();
//                lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
//                window.setAttributes(lp);
//                // 允许内容绘制到耳朵区
//                final View decorView = window.getDecorView();
//                decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
//            }
//        }
//    }
//
//    private static String b62(long num) {
//        StringBuilder sb = new StringBuilder();
//        int remainder;
//        while (num > 21) {
//            //对 scale 进行求余，然后将余数追加至 sb 中，由于是从末位开始追加的，因此最后需要反转字符串
//            remainder = Long.valueOf(num % 62).intValue();
//            sb.append(MARK_CHARS.charAt(remainder));
//            //除以进制数，获取下一个末尾数
//            num = num / 62;
//        }
//        sb.append(MARK_CHARS.charAt(Long.valueOf(num).intValue()));
//        return sb.reverse().toString();
//    }


}
