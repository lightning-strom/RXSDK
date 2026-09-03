package com.ruixue.net;

import java.util.HashMap;
import java.util.Map;

public enum HttpMethod {
    GET("GET"), POST("POST"), PUT("PUT"), DELETE("DELETE");

    private final String value;
    private static final Map<String, HttpMethod> MAP = new HashMap<>();

    static {
        for (HttpMethod season : values()) {
            MAP.put(season.value, season);
        }
    }
    public static HttpMethod parse(String name) {
        return MAP.get(name);
    }

    private HttpMethod(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }

    @Override
    public String toString() {
        return this.value;
    }
}
