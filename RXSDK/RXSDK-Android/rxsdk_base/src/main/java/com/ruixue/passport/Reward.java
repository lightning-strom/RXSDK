package com.ruixue.passport;


import androidx.annotation.Keep;

import java.util.List;

// Created by wangliang on 2025/3/13.
public class Reward {
    public static final String KIND_REAL_AUTH = "realauth";

    @Keep
    private String kind;

    @Keep
    private List<RewardItem> list;

    @Keep
    public String getKind() {
        return kind;
    }

    @Keep
    public void setKind(String kind) {
        this.kind = kind;
    }

    @Keep
    public List<RewardItem> getList() {
        return list;
    }

    @Keep
    public void setList(List<RewardItem> list) {
        this.list = list;
    }

    public static class RewardItem {
        @Keep
        private String name;
        @Keep
        private int num;
        @Keep
        private String icon;
        @Keep
        private String num_format;

        @Keep
        public String getName() {
            return name;
        }

        @Keep
        public void setName(String name) {
            this.name = name;
        }

        @Keep
        public int getNum() {
            return num;
        }

        @Keep
        public void setNum(int num) {
            this.num = num;
        }

        @Keep
        public String getIcon() {
            return icon;
        }

        @Keep
        public void setIcon(String icon) {
            this.icon = icon;
        }

        @Keep
        public String getNum_format() {
            return num_format;
        }

        @Keep
        public void setNum_format(String num_format) {
            this.num_format = num_format;
        }
    }
}
