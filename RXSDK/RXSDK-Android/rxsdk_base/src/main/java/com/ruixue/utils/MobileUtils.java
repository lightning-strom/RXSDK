package com.ruixue.utils;

import android.text.TextUtils;
import android.widget.TextView;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MobileUtils {

    /**
     * \w任意大小写英文字母 0-9数字 下划线 +为至少出现1个以上字符 [-+.]\w+ 任意包含 - + . 及
     * \w字符的组合出现0次或多次，主要包括例如jb51.net@vip.163.com这样的邮箱中的jb51.net
     * @param email
     * @return
     * @ 固定符号
     * <p>
     * \w+ 出现至少1次以上 \w的字符 [-.]\w+ 出现零次或多次这种组合的字符,
     * <p>
     * 例如：jb51.net@vip.163.com 中的 vip.163
     * <p>
     * \. 固定符号 必须包括一个这个
     * <p>
     * 反正\w+([-.]\w+)* 这种组合是规定要以 \w类型字符开头，然后后面跟上\w以及 - 中划线 .点号 的组合吧
     */
    public static boolean isEmail(String email) {
        if (TextUtils.isEmpty(email)){
            return false;
        }else {
            return email.matches("\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");
        }
    }

    public static boolean isPhone(String mobileNumber) {
        return isMobileNO(mobileNumber);
    }

    /**
     * 验证手机号码，11位数字，1开通，第二位数必须是3456789这些数字之一
     */
    public static boolean isMobileNO(String mobileNumber) {
        boolean flag;
        try {
            Pattern regex = Pattern.compile("^\\+?\\d{1,15}$");
            Matcher matcher = regex.matcher(mobileNumber);
            flag = matcher.matches();
        } catch (Exception e) {
            e.printStackTrace();
            flag = false;
        }
        return flag;
    }

    /**
     * @param phone 电话号码
     * @return 脱敏号码
     */
    public static String getPhone(String phone) {
        if (null != phone && phone.startsWith("+") && phone.length() > 5) {
            String reginCode = phone.substring(1, 5);
            return "+" + Integer.valueOf(reginCode) + phone.substring(5).replaceAll("(\\d{3})\\d{3}(\\d{1})", "$1***$2");
        } else if (null != phone && !TextUtils.isEmpty(phone)) {
            return phone.replaceAll("(\\d{3})\\d{4}(\\d{4})", "$1****$2");
        } else {
            return phone;
        }
    }
}
