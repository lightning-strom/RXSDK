package com.ruixue.base;

import androidx.annotation.Keep;

import com.ruixue.utils.EntityUtils;

import java.util.Map;

public class SdkInfo {

    SdkInfo(String name, String version, String ext, String plugins) {
        this.name = name;
        this.version = version;
        this.ext = ext;
        this.plugins = plugins;
    }

    SdkInfo(Builder builder) {
        this.name = builder.name;
        this.version = builder.version;
        this.ext = builder.ext;
        this.plugins = builder.plugins;
        this.state = builder.state;
    }

    @Keep
    private final String name;
    @Keep
    private final String version;
    @Keep
    private final String ext;
    @Keep
    private final String plugins;

    public int getState() {
        return state;
    }

    private int state;

    public String getExt() {
        return ext;
    }

    public String getVersion() {
        return version;
    }

    public String getName() {
        return name;
    }

    public Map<String, Object> toMap() {
        return EntityUtils.entityToMap(this, true, true);
    }

    public static class Builder {
        @Keep
        private String name;
        @Keep
        private String version;
        @Keep
        private String ext;
        @Keep
        private String plugins;

        public Builder setState(int state) {
            this.state = state;
            return this;
        }

        private int state;

        public Builder setPlugins(String plugins) {
            this.plugins = plugins;
            return this;
        }

        public Builder setExt(String ext) {
            this.ext = ext;
            return this;
        }

        public Builder setName(String name) {
            this.name = name;
            return this;
        }

        public Builder setVersion(String version) {
            this.version = version;
            return this;
        }

        public SdkInfo build() {
            return new SdkInfo(this);
        }
    }

}
