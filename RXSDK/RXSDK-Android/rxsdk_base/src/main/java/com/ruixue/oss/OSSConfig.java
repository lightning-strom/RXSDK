package com.ruixue.oss;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/12/8
 */
public class OSSConfig implements Serializable {

    public static final String PROVIDER_ALI = "ali";
    public static final String PROVIDER_TENCENT = "tencent";
    public static final String PROVIDER_AWS = "aws";

    @Keep
    @SerializedName("provider")
    private String provider;

    @Keep
    @SerializedName("region")
    private String region;
    @Keep
    @SerializedName("bucket")
    private String bucket;
    @Keep
    @SerializedName("domain")
    private String domain;
    @Keep
    @SerializedName("credentials")
    private CredentialsBean credentials;

    public String getProvider() {
        return provider;
    }

    public String getRegion() {
        return region;
    }

    public String getBucket() {
        return bucket;
    }

    public String getDomain() {
        return domain;
    }

    public CredentialsBean getCredentials() {
        return credentials;
    }

    public static OSSConfig objectFromData(String str) {
        return new Gson().fromJson(str, OSSConfig.class);
    }

    public static class AssumedRoleUserBean implements Serializable {
        @Keep
        @SerializedName("assumed_role_id")
        private String assumedRoleId;
        @Keep
        @SerializedName("arn")
        private String arn;

        public String getAssumedRoleId() {
            return assumedRoleId;
        }

        public String getArn() {
            return arn;
        }
    }

    public static class CredentialsBean implements Serializable {
        @Keep
        @SerializedName("access_key_secret")
        private String accessKeySecret;
        @Keep
        @SerializedName("expiration")
        private String expiration;
        @Keep
        @SerializedName("access_key_id")
        private String accessKeyId;
        @Keep
        @SerializedName("security_token")
        private String securityToken;

        @Keep
        @SerializedName("start_unix_time")
        private long startUnixTime;

        @Keep
        @SerializedName("expiration_unix_time")
        private long expirationUnixTime;

        @Keep
        @SerializedName("assumed_role")
        private String assumedRole;

        @Keep
        @SerializedName("arn")
        private String arn;

        public String getAccessKeySecret() {
            return accessKeySecret;
        }

        public String getExpiration() {
            return expiration;
        }

        public String getAccessKeyId() {
            return accessKeyId;
        }

        public String getSecurityToken() {
            return securityToken;
        }

        public long getStartUnixTime() {
            return startUnixTime;
        }

        public long getExpirationUnixTime() {
            return expirationUnixTime;
        }

        public String getAssumedRole() {
            return assumedRole;
        }

        public String getArn() {
            return arn;
        }
    }
}
