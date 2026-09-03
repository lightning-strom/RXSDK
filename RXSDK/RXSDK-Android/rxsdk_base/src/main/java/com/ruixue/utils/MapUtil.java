package com.ruixue.utils;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/7/9
 */

import java.io.PrintStream;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Properties;
import java.util.ResourceBundle;
import java.util.SortedMap;

public class MapUtil {

    /**
     * An empty unmodifiable sorted map. This is not provided in the JDK.
     */
    @SuppressWarnings("rawtypes")

    /**
     * String used to indent the verbose and debug Map prints.
     */
    private static final String INDENT_STRING = "    ";


    public static Object firstNonNull(Map<String, Object> map, String... keys) {
        if (map != null) {
            for (String key : keys) {
                Object value = map.get(key);
                if (value != null)
                    return value;
            }
        }
        return null;
    }

    /**
     * Returns an immutable empty map if the argument is {@code null}, or the argument itself otherwise.
     * @param <K> the key type
     * @param <V> the value type
     * @param map the map, possibly {@code null}
     * @return an empty map if the argument is {@code null}
     */
    public static <K, V> Map<K, V> emptyIfNull(final Map<K, V> map) {
        return map == null ? Collections.<K, V>emptyMap() : map;
    }

    /**
     * Gets a Boolean from a Map in a null-safe manner.
     * <p>
     * If the value is a {@code Boolean} it is returned directly. If the value is a {@code String} and it
     * equals 'true' ignoring case then {@code true} is returned, otherwise {@code false}. If the value is a
     * {@code Number} an integer zero value returns {@code false} and non-zero returns {@code true}.
     * Otherwise, {@code null} is returned.
     * @param <K> the key type
     * @param map the map to use
     * @param key the key to look up
     * @return the value in the Map as a Boolean, {@code null} if null map input
     */
    public static <K> Boolean getBoolean(final Map<? super K, ?> map, final K key) {
        if (map != null) {
            final Object answer = map.get(key);
            if (answer != null) {
                if (answer instanceof Boolean) {
                    return (Boolean) answer;
                }
                if (answer instanceof String) {
                    return Boolean.valueOf((String) answer);
                }
                if (answer instanceof Number) {
                    final Number n = (Number) answer;
                    return n.intValue() != 0 ? Boolean.TRUE : Boolean.FALSE;
                }
            }
        }
        return null;
    }


    /**
     * Gets a boolean from a Map in a null-safe manner.
     * <p>
     * If the value is a {@code Boolean} its value is returned. If the value is a {@code String} and it equals
     * 'true' ignoring case then {@code true} is returned, otherwise {@code false}. If the value is a
     * {@code Number} an integer zero value returns {@code false} and non-zero returns {@code true}.
     * Otherwise, {@code false} is returned.
     * </p>
     * @param <K> the key type
     * @param map the map to use
     * @param key the key to look up
     * @return the value in the Map as a Boolean, {@code false} if null map input
     */
    public static <K> boolean getBooleanValue(final Map<? super K, ?> map, final K key) {
        return Boolean.TRUE.equals(getBoolean(map, key));
    }


    /**
     * Gets a Byte from a Map in a null-safe manner.
     * <p>
     * The Byte is obtained from the results of {@link #getNumber(Map, Object)}.
     * </p>
     * @param <K> the key type
     * @param map the map to use
     * @param key the key to look up
     * @return the value in the Map as a Byte, {@code null} if null map input
     */
    public static <K> Byte getByte(final Map<? super K, ?> map, final K key) {
        final Number answer = getNumber(map, key);
        if (answer == null) {
            return null;
        }
        if (answer instanceof Byte) {
            return (Byte) answer;
        }
        return Byte.valueOf(answer.byteValue());
    }


    /**
     * Gets a Double from a Map in a null-safe manner.
     * <p>
     * The Double is obtained from the results of {@link #getNumber(Map, Object)}.
     * </p>
     * @param <K> the key type
     * @param map the map to use
     * @param key the key to look up
     * @return the value in the Map as a Double, {@code null} if null map input
     */
    public static <K> Double getDouble(final Map<? super K, ?> map, final K key) {
        final Number answer = getNumber(map, key);
        if (answer == null) {
            return null;
        }
        if (answer instanceof Double) {
            return (Double) answer;
        }
        return Double.valueOf(answer.doubleValue());
    }


    /**
     * Gets a Float from a Map in a null-safe manner.
     * <p>
     * The Float is obtained from the results of {@link #getNumber(Map, Object)}.
     * </p>
     * @param <K> the key type
     * @param map the map to use
     * @param key the key to look up
     * @return the value in the Map as a Float, {@code null} if null map input
     */
    public static <K> Float getFloat(final Map<? super K, ?> map, final K key) {
        final Number answer = getNumber(map, key);
        if (answer == null) {
            return null;
        }
        if (answer instanceof Float) {
            return (Float) answer;
        }
        return Float.valueOf(answer.floatValue());
    }


    /**
     * Gets a Integer from a Map in a null-safe manner.
     * <p>
     * The Integer is obtained from the results of {@link #getNumber(Map, Object)}.
     * </p>
     * @param <K> the key type
     * @param map the map to use
     * @param key the key to look up
     * @return the value in the Map as a Integer, {@code null} if null map input
     */
    public static <K> Integer getInteger(final Map<? super K, ?> map, final K key) {
        final Number answer = getNumber(map, key);
        if (answer == null) {
            return null;
        }
        if (answer instanceof Integer) {
            return (Integer) answer;
        }
        return Integer.valueOf(answer.intValue());
    }


    /**
     * Gets a Long from a Map in a null-safe manner.
     * <p>
     * The Long is obtained from the results of {@link #getNumber(Map, Object)}.
     * </p>
     * @param <K> the key type
     * @param map the map to use
     * @param key the key to look up
     * @return the value in the Map as a Long, {@code null} if null map input
     */
    public static <K> Long getLong(final Map<? super K, ?> map, final K key) {
        final Number answer = getNumber(map, key);
        if (answer == null) {
            return null;
        }
        if (answer instanceof Long) {
            return (Long) answer;
        }
        return Long.valueOf(answer.longValue());
    }


    /**
     * Gets a Map from a Map in a null-safe manner.
     * <p>
     * If the value returned from the specified map is not a Map then {@code null} is returned.
     * </p>
     * @param <K> the key type
     * @param map the map to use
     * @param key the key to look up
     * @return the value in the Map as a Map, {@code null} if null map input
     */
    public static <K> Map<?, ?> getMap(final Map<? super K, ?> map, final K key) {
        if (map != null) {
            final Object answer = map.get(key);
            if (answer instanceof Map) {
                return (Map<?, ?>) answer;
            }
        }
        return null;
    }


    /**
     * Gets a Number from a Map in a null-safe manner.
     * <p>
     * If the value is a {@code Number} it is returned directly. If the value is a {@code String} it is
     * converted using {@link NumberFormat#parse(String)} on the system default formatter returning {@code null} if
     * the conversion fails. Otherwise, {@code null} is returned.
     * </p>
     * @param <K> the key type
     * @param map the map to use
     * @param key the key to look up
     * @return the value in the Map as a Number, {@code null} if null map input
     */
    public static <K> Number getNumber(final Map<? super K, ?> map, final K key) {
        if (map != null) {
            final Object answer = map.get(key);
            if (answer != null) {
                if (answer instanceof Number) {
                    return (Number) answer;
                }
                if (answer instanceof String) {
                    try {
                        final String text = (String) answer;
                        return NumberFormat.getInstance().parse(text);
                    } catch (final ParseException e) { // NOPMD
                        // failure means null is returned
                    }
                }
            }
        }
        return null;
    }


    /**
     * Gets from a Map in a null-safe manner.
     * @param <K> the key type
     * @param <V> the value type
     * @param map the map to use
     * @param key the key to look up
     * @return the value in the Map, {@code null} if null map input
     */
    public static <K, V> V getObject(final Map<? super K, V> map, final K key) {
        if (map != null) {
            return map.get(key);
        }
        return null;
    }

    /**
     * Looks up the given key in the given map, converting null into the given default value.
     * @param <K>          the key type
     * @param <V>          the value type
     * @param map          the map whose value to look up
     * @param key          the key of the value to look up in that map
     * @param defaultValue what to return if the value is null
     * @return the value in the map, or defaultValue if the original value is null or the map is null
     */
    public static <K, V> V getObject(final Map<K, V> map, final K key, final V defaultValue) {
        if (map != null) {
            final V answer = map.get(key);
            if (answer != null) {
                return answer;
            }
        }
        return defaultValue;
    }

    /**
     * Gets a Short from a Map in a null-safe manner.
     * <p>
     * The Short is obtained from the results of {@link #getNumber(Map, Object)}.
     * </p>
     * @param <K> the key type
     * @param map the map to use
     * @param key the key to look up
     * @return the value in the Map as a Short, {@code null} if null map input
     */
    public static <K> Short getShort(final Map<? super K, ?> map, final K key) {
        final Number answer = getNumber(map, key);
        if (answer == null) {
            return null;
        }
        if (answer instanceof Short) {
            return (Short) answer;
        }
        return Short.valueOf(answer.shortValue());
    }


    /**
     * Gets a String from a Map in a null-safe manner.
     * <p>
     * The String is obtained via {@code toString}.
     * </p>
     * @param <K> the key type
     * @param map the map to use
     * @param key the key to look up
     * @return the value in the Map as a String, {@code null} if null map input
     */
    public static <K> String getString(final Map<? super K, ?> map, final K key) {
        if (map != null) {
            final Object answer = map.get(key);
            if (answer != null) {
                return answer.toString();
            }
        }
        return null;
    }


    /**
     * Inverts the supplied map returning a new HashMap such that the keys of the input are swapped with the values.
     * <p>
     * This operation assumes that the inverse mapping is well defined. If the input map had multiple entries with the
     * same value mapped to different keys, the returned map will map one of those keys to the value, but the exact key
     * which will be mapped is undefined.
     * </p>
     * @param <K> the key type
     * @param <V> the value type
     * @param map the map to invert, must not be null
     * @return a new HashMap containing the inverted data
     * @throws NullPointerException if the map is null
     */
    public static <K, V> Map<V, K> invertMap(final Map<K, V> map) {
        Objects.requireNonNull(map, "map");
        final Map<V, K> out = new HashMap<>(map.size());
        for (final Entry<K, V> entry : map.entrySet()) {
            out.put(entry.getValue(), entry.getKey());
        }
        return out;
    }

    /**
     * Null-safe check if the specified map is empty.
     * <p>
     * Null returns true.
     * </p>
     * @param map the map to check, may be null
     * @return true if empty or null
     * @since 3.2
     */
    public static boolean isEmpty(final Map<?, ?> map) {
        return map == null || map.isEmpty();
    }

    /**
     * Null-safe check if the specified map is not empty.
     * <p>
     * Null returns false.
     * </p>
     * @param map the map to check, may be null
     * @return true if non-null and non-empty
     * @since 3.2
     */
    public static boolean isNotEmpty(final Map<?, ?> map) {
        return !MapUtil.isEmpty(map);
    }


    /**
     * Writes indentation to the given stream.
     * @param out    the stream to indent
     * @param indent the index of the indentation
     */
    private static void printIndent(final PrintStream out, final int indent) {
        for (int i = 0; i < indent; i++) {
            out.print(INDENT_STRING);
        }
    }

    /**
     * Protects against adding null values to a map.
     * <p>
     * This method checks the value being added to the map, and if it is null it is replaced by an empty string.
     * </p>
     * <p>
     * This could be useful if the map does not accept null values, or for receiving data from a source that may provide
     * null or empty string which should be held in the same way in the map.
     * </p>
     * <p>
     * Keys are not validated. Note that this method can be used to circumvent the map's value type at runtime.
     * </p>
     * @param <K>   the key type
     * @param map   the map to add to, must not be null
     * @param key   the key
     * @param value the value, null converted to ""
     * @throws NullPointerException if the map is null
     */
    public static <K> void safeAddToMap(final Map<? super K, Object> map, final K key, final Object value)
            throws NullPointerException {
        Objects.requireNonNull(map, "map");
        map.put(key, value == null ? "" : value);
    }

    /**
     * Gets the given map size or 0 if the map is null
     * @param map a Map or null
     * @return the given map size or 0 if the map is null
     */
    public static int size(final Map<?, ?> map) {
        return map == null ? 0 : map.size();
    }

    /**
     * Returns a synchronized map backed by the given map.
     * <p>
     * You must manually synchronize on the returned buffer's iterator to avoid non-deterministic behavior:
     * </p>
     *
     * <pre>
     * Map m = MapUtils.synchronizedMap(myMap);
     * Set s = m.keySet(); // outside synchronized block
     * synchronized (m) { // synchronized on MAP!
     *     Iterator i = s.iterator();
     *     while (i.hasNext()) {
     *         process(i.next());
     *     }
     * }
     * </pre>
     *
     * <p>
     * This method uses the implementation in {@link java.util.Collections Collections}.
     * </p>
     * @param <K> the key type
     * @param <V> the value type
     * @param map the map to synchronize, must not be null
     * @return a synchronized map backed by the given map
     */
    public static <K, V> Map<K, V> synchronizedMap(final Map<K, V> map) {
        return Collections.synchronizedMap(map);
    }

    /**
     * Returns a synchronized sorted map backed by the given sorted map.
     * <p>
     * You must manually synchronize on the returned buffer's iterator to avoid non-deterministic behavior:
     * </p>
     *
     * <pre>
     * Map m = MapUtils.synchronizedSortedMap(myMap);
     * Set s = m.keySet(); // outside synchronized block
     * synchronized (m) { // synchronized on MAP!
     *     Iterator i = s.iterator();
     *     while (i.hasNext()) {
     *         process(i.next());
     *     }
     * }
     * </pre>
     *
     * <p>
     * This method uses the implementation in {@link java.util.Collections Collections}.
     * </p>
     * @param <K> the key type
     * @param <V> the value type
     * @param map the map to synchronize, must not be null
     * @return a synchronized map backed by the given map
     * @throws NullPointerException if the map is null
     */
    public static <K, V> SortedMap<K, V> synchronizedSortedMap(final SortedMap<K, V> map) {
        return Collections.synchronizedSortedMap(map);
    }

    /**
     * Creates a new HashMap using data copied from a ResourceBundle.
     * @param resourceBundle the resource bundle to convert, must not be null
     * @return the HashMap containing the data
     * @throws NullPointerException if the bundle is null
     */
    public static Map<String, Object> toMap(final ResourceBundle resourceBundle) {
        Objects.requireNonNull(resourceBundle, "resourceBundle");
        final Enumeration<String> enumeration = resourceBundle.getKeys();
        final Map<String, Object> map = new HashMap<>();

        while (enumeration.hasMoreElements()) {
            final String key = enumeration.nextElement();
            final Object value = resourceBundle.getObject(key);
            map.put(key, value);
        }

        return map;
    }

    /**
     * Gets a new Properties object initialized with the values from a Map. A null input will return an empty properties
     * object.
     * <p>
     * A Properties object may only store non-null keys and values, thus if the provided map contains either a key or
     * value which is {@code null}, a {@link NullPointerException} will be thrown.
     * </p>
     * @param <K> the key type
     * @param <V> the value type
     * @param map the map to convert to a Properties object
     * @return the properties object
     * @throws NullPointerException if a key or value in the provided map is {@code null}
     */
    public static <K, V> Properties toProperties(final Map<K, V> map) {
        final Properties answer = new Properties();
        if (map != null) {
            for (final Entry<K, V> entry2 : map.entrySet()) {
                final Map.Entry<?, ?> entry = entry2;
                final Object key = entry.getKey();
                final Object value = entry.getValue();
                answer.put(key, value);
            }
        }
        return answer;
    }

    /**
     * Don't allow instances.
     */
    private MapUtil() {
    }

}