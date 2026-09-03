package com.ruixue.legal;

import androidx.annotation.Keep;

import com.google.gson.Gson;

import org.json.JSONObject;

import java.util.List;

/**
 * 法务数据 {@link com.ruixue.RuiXueSdk#getRXSdkApi()#legal()}
 */
@Keep
public class LegalData {

    /**
     * 用户服务协议
     */
    @Keep
    public static final String KEY_SERVICE_AGREEMENT = "00001";
    /**
     * 隐私保护政策
     */
    @Keep
    public static final String KEY_PRIVACY_POLICY = "00002";
    /**
     * 第三方SDK
     */
    @Keep
    public static final String KEY_SDKS_DIRECTORY = "00003";
    /**
     * 健康游戏公告
     */
    @Keep
    public static final String KEY_HEALTHY_GAMES_BULLETIN = "00004";
    /**
     * 适龄提示
     */
    @Keep
    public static final String KEY_AGE_TIPS = "00005";
    /**
     * 绿色游戏公告
     */
    @Keep
    public static final String KEY_GREEN_GAME_ANNOUNCEMENT = "00006";
    /**
     * 版号信息
     */
    @Keep
    public static final String KEY_PLATE_NUMBER = "00007";
    /**
     * 游戏账号注销条件
     */
    @Keep
    public static final String KEY_WRITE_OFF = "00008";
    /**
     * 游戏账号注销协议
     */
    @Keep
    public static final String KEY_MUTUAL_CANCELLATION = "00009";
    /**
     * 其他
     */
    @Keep
    public static final String KEY_OTHER = "000010";


    @Keep
    protected List<TermsBean> terms;
    @Keep
    protected PermissionsBean permissions;
    @Keep
    protected MinorsBean minor;

    @Keep
    public List<TermsBean> getTerms() {
        return terms;
    }

    @Keep
    public TermsBean getTerm(String key) {
        if (terms != null) {
            for (TermsBean termsBean : terms) {
                if (termsBean.getKey().equals(key)) {
                    return termsBean;
                }
            }
        }
        return null;
    }

    public String getTermTitle(String key) {
        TermsBean termsBean = getTerm(key);
        if (termsBean != null) {
            return termsBean.title;
        } else {
            return "";
        }
    }

    @Keep
    public MinorsBean getMinor() {
        return minor;
    }

    @Keep
    public PermissionsBean getPermissions() {
        return permissions;
    }

    @Keep
    public void setPermissions(PermissionsBean permissions) {
        this.permissions = permissions;
    }


    @Keep
    public static class PermissionsBean {
        @Keep
        protected String title;
        @Keep
        protected String content;
        @Keep
        protected List<PermissionItem> list;

        @Keep
        public String getTitle() {
            return title;
        }

        @Keep
        public void setTitle(String title) {
            this.title = title;
        }

        @Keep
        public String getContent() {
            return content;
        }

        @Keep
        public void setContent(String content) {
            this.content = content;
        }

        @Keep
        public List<PermissionItem> getList() {
            return list;
        }

        @Keep
        public void setList(List<PermissionItem> list) {
            this.list = list;
        }
    }

    @Keep
    public static class PermissionItem {
        @Keep
        protected int id;
        @Keep
        protected String key;
        @Keep
        protected String name;
        @Keep
        protected String content;
        @Keep
        protected int enable;

        @Keep
        public int getId() {
            return id;
        }

        @Keep
        public String getKey() {
            return key;
        }

        @Keep
        public String getName() {
            return name;
        }

        @Keep
        public String getContent() {
            return content;
        }

        @Keep
        public boolean isEnable() {
            return enable != 0;
        }

    }

    @Keep
    public static class TermsBean {
        @Keep
        public int id;
        @Keep
        public String key;
        @Keep
        public String title;
        @Keep
        public String content;
        @Keep
        public int is_default;//后台调试标识

        /**
         * 客户端选中标识
         */
        @Keep
        public boolean is_selected = false;

        @Keep
        public void setSelect(boolean select) {
            this.is_selected = select;
        }

        @Keep
        public boolean isSelected() {
            return is_selected;
        }

        @Keep
        public int getId() {
            return id;
        }

        @Keep
        public String getKey() {
            return key;
        }

        @Keep
        public String getTitle() {
            return title;
        }

        @Keep
        public String getContent() {
            return content;
        }


    }

    @Keep
    public static class MinorsBean {
        @Keep
        public int age;
        @Keep
        public String image;
        @Keep
        public RealName real_name;
        @Keep
        public String login;
        @Keep
        public String age_8;
        @Keep
        public String age_8_16;
        @Keep
        public String age_16_18;

        @Keep
        public int getAge() {
            return age;
        }

        @Keep
        public String getImage() {
            return image;
        }

        @Keep
        public RealName getRealName() {
            return real_name;
        }

        @Keep
        public String getLogin() {
            return login;
        }

        @Keep
        public String getAge_8() {
            return age_8;
        }

        @Keep
        public String getAge_8_16() {
            return age_8_16;
        }

        @Keep
        public String getAge_16_18() {
            return age_16_18;
        }

        @Keep
        public static class RealName {
            @Keep
            protected String title;
            @Keep
            protected String content;

            @Keep
            public String getTitle() {
                return title;
            }

            @Keep
            public String getContent() {
                return content;
            }
        }
    }

    @Keep
    public static LegalData fromJson(JSONObject jsonObject) {
        if (jsonObject != null) {
            return new Gson().fromJson(jsonObject.toString(), LegalData.class);
        } else {
            return null;
        }

    }
}