package com.ruixue.push.core;

public final class TokenResult {
    private final String token;
    private final String brandName;
    private final ResultCode resultCode;
    private String taskId;
    private int expireTime = Integer.MAX_VALUE;

    public enum ResultCode {
        OK,
        ERROR;
    }

    public TokenResult(Builder builder) {
        this.token = builder.token;
        this.brandName = builder.brandName;
        this.resultCode = builder.resultCode;
        this.taskId = builder.taskId;
        this.expireTime = builder.expireTime;
    }

    public TokenResult(String token, String brandName, ResultCode resultCode) {
        this.token = token;
        this.brandName = brandName;
        this.resultCode = resultCode;
    }

    public String getToken() {
        return this.token;
    }

    public int getExpireTime() {
        return this.expireTime;
    }

    /**
     * @return 是否是有效token
     */
    public boolean isValidToken() {
        long curTime = System.currentTimeMillis() / 1000;
        return curTime < this.expireTime;
    }

    public ResultCode getResultCode() {
        return this.resultCode;
    }

    public String getBrandName() {
        return brandName;
    }

    public String getTaskId() {
        return taskId;
    }

    public static class Builder {
        private String token;
        private String brandName;
        private ResultCode resultCode;
        private String taskId;
        private int expireTime = Integer.MAX_VALUE;

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public Builder brandName(String brandName) {
            this.brandName = brandName;
            return this;
        }

        public Builder resultCode(ResultCode resultCode) {
            this.resultCode = resultCode;
            return this;
        }

        public Builder taskId(String taskId) {
            this.taskId = taskId;
            return this;
        }

        public Builder expireTime(int expireTime) {
            this.expireTime = expireTime;
            return this;
        }

        public TokenResult build() {
            return new TokenResult(this);
        }
    }
}
