/*
 * Copyright (c) 2022. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package com.ruixue.internal;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
//import java.util.Observable;

    @SuppressWarnings("deprecation")
public class RXObservable  {

    private Map<String, ArrayList<?>> observerMap;

    public static class model {
        public String name;
        public Object obj;
    }




    private volatile static RXObservable rxObservable = null;

    public static RXObservable get() {
        if (rxObservable == null) {
            synchronized (RXObservable.class) {
                if (rxObservable == null) {
                    rxObservable = new RXObservable();
                }
            }
        }
        return rxObservable;
    }

    private RXObservable() {
        observerMap = new HashMap<>();

    }
}



