package com.ruixue.utils;

import com.ruixue.logger.RXLogger;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EntityUtils {

    /**
     * 实体类转Map
     * @param object 要转换的实体对象
     * @return @description: 实体类转Map
     */
    public static Map<String, Object> entityToMap(Object object) {
        return entityToMap(object, false, false);
    }

    /**
     * 实体类转Map
     * @param object      要转换的实体对象 不支持类嵌套
     * @param ignoreNull  是否忽略 null 值
     * @param ignoreSuper 是否忽略 父类变量
     * @return @description: 实体类转Map
     */
    public static Map<String, Object> entityToMap(Object object, boolean ignoreNull, boolean ignoreSuper) {
        Map<String, Object> map = new HashMap<>();
        for (Field field : getDeclaredFields(object.getClass(), ignoreSuper)) {
            try {
                boolean flag = field.isAccessible();
                field.setAccessible(true);
                Object o = field.get(object);
                if (!ignoreNull || o != null) {
                    map.put(field.getName(), o);
                }
                field.setAccessible(flag);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return map;
    }


    /**
     * 判断是否是基本类型
     * @param type Class对象的实例
     * @return true代表你指定的这个Class对象是基本类型，false代表这个Class对象不是基本类型
     */
    public static boolean isPrimitive(Type type) {
        return type instanceof Class<?> && ((Class<?>) type).isPrimitive();
    }

    /**
     * @param classT
     * @param ignoreSuper 是否只是本类属性， 不包括父类属性
     */
    public static Field[] getDeclaredFields(Class<?> classT, boolean ignoreSuper) {
        List<Field> fieldList = new ArrayList<>();
        if (ignoreSuper) {
            for (Field field : classT.getDeclaredFields()) {
                if (!field.getName().startsWith("shadow$")) {
                    fieldList.add(field);
                } else {
                    RXLogger.i("ignore field " + field.getName());
                }
            }
        } else {
            while (classT != null) {
                for (Field field : classT.getDeclaredFields()) {
                    if (!field.getName().startsWith("shadow$")) {
                        fieldList.add(field);
                    } else {
                        RXLogger.i("ignore field " + field.getName());
                    }
                }
                classT = classT.getSuperclass();
            }
        }
        return fieldList.toArray(new Field[0]);
    }


    /**
     * @param <T>    Map转实体类
     * @param map    需要初始化的数据，key字段必须与实体类的成员名字一样，否则赋值为空
     * @param entity 需要转化成的实体类
     * @return @description: Map转实体类
     */
    public static <T> T mapToEntity(Map<String, Object> map, Class<T> entity) {
        T t = null;
        try {
            Constructor<T> constructor = entity.getDeclaredConstructor();
            constructor.setAccessible(true);
            t = constructor.newInstance();
//            t = entity.newInstance();
            for (Field field : getDeclaredFields(entity, false)) {
                if (map.containsKey(field.getName())) {
                    boolean flag = field.isAccessible();
                    field.setAccessible(true);
                    Object object = map.get(field.getName());
                    if (object != null && (field.getType().isPrimitive() || field.getType().isInstance(object))) {
                        try {
                            field.set(t, object);
                        } catch (IllegalArgumentException e) {
                            e.printStackTrace();
                        }
                    }
                    field.setAccessible(flag);
                }
            }
            return t;
        } catch (InstantiationException | NoSuchMethodException | InvocationTargetException | IllegalAccessException e) {
            e.printStackTrace();
        }
        return t;
    }

}
