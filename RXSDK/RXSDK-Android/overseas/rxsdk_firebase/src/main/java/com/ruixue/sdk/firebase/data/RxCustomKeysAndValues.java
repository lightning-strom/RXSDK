package com.ruixue.sdk.firebase.data;

import androidx.annotation.NonNull;

import com.google.firebase.crashlytics.CustomKeysAndValues;

import java.util.HashMap;
import java.util.Map;

public class RxCustomKeysAndValues {
    final Map<String, String> keysAndValues;

    public static class Builder {

        // Holds the converted pairs of custom keys and values.
        private Map<String, String> keysAndValues = new HashMap<String, String>();

        // Methods to accept keys and values and convert values to strings.

        @NonNull
        public RxCustomKeysAndValues.Builder putString(@NonNull String key, @NonNull String value) {
            keysAndValues.put(key, value);
            return this;
        }

        @NonNull
        public RxCustomKeysAndValues.Builder putBoolean(@NonNull String key, boolean value) {
            keysAndValues.put(key, Boolean.toString(value));
            return this;
        }

        @NonNull
        public RxCustomKeysAndValues.Builder putDouble(@NonNull String key, double value) {
            keysAndValues.put(key, Double.toString(value));
            return this;
        }

        @NonNull
        public RxCustomKeysAndValues.Builder putFloat(@NonNull String key, float value) {
            keysAndValues.put(key, Float.toString(value));
            return this;
        }

        @NonNull
        public RxCustomKeysAndValues.Builder putLong(@NonNull String key, long value) {
            keysAndValues.put(key, Long.toString(value));
            return this;
        }

        @NonNull
        public RxCustomKeysAndValues.Builder putInt(@NonNull String key, int value) {
            keysAndValues.put(key, Integer.toString(value));
            return this;
        }

        @NonNull
        public RxCustomKeysAndValues build() {
            return new RxCustomKeysAndValues(this);
        }
    }

    RxCustomKeysAndValues(@NonNull RxCustomKeysAndValues.Builder builder) {
        this.keysAndValues = builder.keysAndValues;
    }

    public static CustomKeysAndValues copy(RxCustomKeysAndValues rxCustomKeysAndValues) {
        if (rxCustomKeysAndValues == null || rxCustomKeysAndValues.keysAndValues == null) {
            return null;
        }
        CustomKeysAndValues.Builder builder = new CustomKeysAndValues.Builder();
        for (String key : rxCustomKeysAndValues.keysAndValues.keySet()) {
            String value = rxCustomKeysAndValues.keysAndValues.get(key);
            if (value == null) {
                return null;
            }
            builder.putString(key, value);
        }
        return builder.build();
    }

}
