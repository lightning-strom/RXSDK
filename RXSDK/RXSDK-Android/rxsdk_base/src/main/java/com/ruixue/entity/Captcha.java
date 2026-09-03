package com.ruixue.entity;

import com.ruixue.model.BaseResult;

/**
 * 验证码
 */
public class Captcha extends BaseResult {

    public static final int CAPTCHA_REPEAT_SEND = 312223;
    public static final int CAPTCHA_TEST = 312231;
    private DataBean data;

    public DataBean getData() {
        return data;
    }

    public void setData(DataBean data) {
        this.data = data;
    }

    public static class DataBean {

        private int interval;
        private int surplus;

        public int getInterval() {
            return interval;
        }

        public void setInterval(int interval) {
            this.interval = interval;
        }

        public int getSurplus() {
            return surplus;
        }

        public void setSurplus(int surplus) {
            this.surplus = surplus;
        }
    }
}
