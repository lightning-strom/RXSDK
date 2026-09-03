package com.ruixue.base;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/1/25
 */
public class EventTracker<T> {
//    public interface EventObserver<T> {
//        void invoke(T data);
//    }
//
//    private final Map<Object, EventObserver> msActivityResultObserver = new HashMap<>();
//
//    public void registerObserver(Object key, EventObserver o) {
//        if (key != null) {
//            msActivityResultObserver.put(key, o);
//        }
//    }
//
//    public void removeObserver(Object key) {
//        if (key != null)
//            msActivityResultObserver.remove(key);
//    }
//
//    public void emit(Object key, T data) {
//        if (key != null && msActivityResultObserver.containsKey(key)) {
//            Objects.requireNonNull(msActivityResultObserver.get(key)).invoke(data);
//        }
//    }
}
