package com.ruixue.utils;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/22
 */
public final class ObjectUtils {

    private ObjectUtils() {
        throw new AssertionError("No ObjectUtils instances for you!");
    }

    /**
     * compare two object
     * @param actual
     * @param expected
     * @return <ul>
     * <li>if both are null, return true</li>
     * <li>return actual.{@link Object#equals(Object)}</li>
     * </ul>
     */
    public static boolean isEquals(Object actual, Object expected) {
        return actual == expected || (actual == null ? expected == null : actual.equals(expected));
    }

    /**
     * compare two object
     * <ul>
     * <strong>About result</strong>
     * <li>if v1 > v2, return 1</li>
     * <li>if v1 = v2, return 0</li>
     * <li>if v1 < v2, return -1</li>
     * </ul>
     * <ul>
     * <strong>About rule</strong>
     * <li>if v1 is null, v2 is null, then return 0</li>
     * <li>if v1 is null, v2 is not null, then return -1</li>
     * <li>if v1 is not null, v2 is null, then return 1</li>
     * <li>return v1.{@link Comparable#compareTo(Object)}</li>
     * </ul>
     * @param v1
     * @param v2
     */
    @SuppressWarnings({"unchecked", "rawtypes"})
    public static <V> int compare(V v1, V v2) {
        return v1 == null ? (v2 == null ? 0 : -1) : (v2 == null ? 1 : ((Comparable) v1).compareTo(v2));
    }

    /**
     * convert long array to Long array
     * @param source
     * @return
     */
    public static Long[] transformLongArray(long[] source) {
        Long[] destin = new Long[source.length];
        for (int i = 0; i < source.length; i++) {
            destin[i] = source[i];
        }
        return destin;
    }

    /**
     * convert Long array to long array
     * @param source
     * @return
     */
    public static long[] transformLongArray(Long[] source) {
        long[] destin = new long[source.length];
        for (int i = 0; i < source.length; i++) {
            destin[i] = source[i];
        }
        return destin;
    }

    /**
     * convert int array to Integer array
     * @param source
     * @return
     */
    public static Integer[] transformIntArray(int[] source) {
        Integer[] destin = new Integer[source.length];
        for (int i = 0; i < source.length; i++) {
            destin[i] = source[i];
        }
        return destin;
    }

    /**
     * convert Integer array to int array
     * @param source
     * @return
     */
    public static int[] transformIntArray(Integer[] source) {
        int[] destin = new int[source.length];
        for (int i = 0; i < source.length; i++) {
            destin[i] = source[i];
        }
        return destin;
    }

    public static int hashCode(Object o) {
        return o != null ? o.hashCode() : 0;
    }

    public static int hash(Object... values) {
        return Arrays.hashCode(values);
    }

    /**
     * @param obj 支持 int 非 0 为 true
     * @return boolean
     */
    public static boolean toBoolean(Object obj) {
        return toBoolean(obj, false);
    }

    public static boolean toBoolean(Object obj, boolean defVal) {
        if (obj == null) {
            return defVal;
        } else if (obj instanceof String) {
            return Boolean.parseBoolean(obj.toString());
        } else if (obj instanceof Integer) {
            return ((Integer) obj) > 0;
        } else {
            return (boolean) obj;
        }
    }

    public static int toInt(Object o) {
        return toInt(o, 0);
    }

    public static int toInt(Object o, int defaultVal) {
        if (o instanceof Number) {
            return ((Number) o).intValue();
        }
        try {
            return Integer.parseInt(toString(o, Integer.toString(defaultVal)));
        } catch (NumberFormatException ignore) {
            return defaultVal;
        }
    }

    public static String toString(Object o) {
        return String.valueOf(o);
    }

    public static String toString(Object o, String nullDefault) {
        return (o != null) ? o.toString() : nullDefault;
    }
//BeanUtils.populate(findArchiveDto,map);

    //Object转Map
//    public static Map<String, Object> objectToMap(Object obj) throws IllegalAccessException, NoSuchFieldException {
//        if (obj == null) return null;
//        Map<String, Object> map = new LinkedHashMap<>();
//        Class<?> clazz = obj.getClass();
//        System.out.println(clazz);
////         Field[] fields = obj.getClass().getDeclaredFields();
////        for(int i = 0; i < fields.length; i++){
////            Field subField = obj.getClass().getDeclaredField(fields[i].getName());
////            subField.setAccessible(true);
////            Object o = subField.get(obj);
////            map.put(fields[i].getName(), o);
////        }
//        for (Field field : clazz.getDeclaredFields()) {
//            field.setAccessible(true);
//            String fieldName = field.getName();
//            Object value = field.get(obj);
//            if (value == null) {
//                value = "";
//            }
//            map.put(fieldName, value);
//        }
//        return map;
//    }

    //Map转Object
    public static Object mapToObject(Map<Object, Object> map, Class<?> beanClass) throws Exception {
        if (map == null)
            return null;
        Object obj = beanClass.newInstance();
        Field[] fields = obj.getClass().getDeclaredFields();
        for (Field field : fields) {
            int mod = field.getModifiers();
            if (Modifier.isStatic(mod) || Modifier.isFinal(mod)) {
                continue;
            }
            field.setAccessible(true);
            if (map.containsKey(field.getName())) {
                field.set(obj, map.get(field.getName()));
            }
        }
        return obj;
    }


    public static <K, V> List<Map<K, V>> castListMap(Object obj, Class<K> kCalzz, Class<V> vCalzz) {
        List<Map<K, V>> result = new ArrayList<>();
        if (obj instanceof List<?>) {
            for (Object mapObj : (List<?>) obj) {
                if (mapObj instanceof Map<?, ?>) {
                    Map<K, V> map = new HashMap<>(16);
                    for (Map.Entry<?, ?> entry : ((Map<?, ?>) mapObj).entrySet()) {
                        map.put(kCalzz.cast(entry.getKey()), vCalzz.cast(entry.getValue()));
                    }
                    result.add(map);
                }
            }
            return result;
        }
        return null;
    }

    public static <V> List<Map<String, V>> castListMap(Object obj, Class<V> vClass) throws IllegalAccessException {
        List<Map<String, V>> result = new ArrayList<>();
        if (obj instanceof List<?>) {
            for (Object o : (List<?>) obj) {
                Map<String, V> map = new HashMap<>(16);
                Class<?> oClass = o.getClass();
                for (Field field : oClass.getDeclaredFields()) {
                    field.setAccessible(true);
                    String key = field.getName();
                    Object value = field.get(key);
                    if (value == null) {
                        value = "";
                    }
                    map.put(key, vClass.cast(value));
                }
                result.add(map);
            }
            return result;
        }
        return null;
    }


    public static <T> List<T> castList(Object obj, Class<T> clazz) {
        List<T> result = new ArrayList<T>();
        if (obj instanceof List<?>) {
            for (Object o : (List<?>) obj) {
                result.add(clazz.cast(o));
            }
            return result;
        }
        return null;
    }


    public static <T> T requireNonNull(T obj) {
        if (obj == null)
            throw new NullPointerException();
        return obj;
    }

    public static <T> T requireNonNull(T obj, String message) {
        if (obj == null)
            throw new NullPointerException(message);
        return obj;
    }

    public static boolean isNull(Object obj) {
        return obj == null;
    }

    public static boolean nonNull(Object obj) {
        return obj != null;
    }

    public static boolean isEmpty(Object obj) {
        return obj == null;
    }

    public static boolean isEmpty(Object[] obj) {
        return obj == null || obj.length == 0;
    }

}
