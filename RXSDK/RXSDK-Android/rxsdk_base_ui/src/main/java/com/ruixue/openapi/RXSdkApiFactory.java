package com.ruixue.openapi;

import androidx.annotation.NonNull;

import com.ruixue.reflect.BaseReflectClass;

public class RXSdkApiFactory extends BaseReflectClass {

    private RXSdkApiFactory() {
        throw new RuntimeException(RXSdkApiFactory.class.getSimpleName() + " should not be instantiated");
    }


    public static <T extends IRXView> T createView(Class<T> rxViewClass) throws IllegalAccessException, InstantiationException {
        return rxViewClass.newInstance();
    }


    @NonNull
    public static RXSdkUI getRxUiAPI() {

        return RXSdkUI.getInstance();
//        String className = Objects.requireNonNull(RXSdkApiFactory.class.getPackage()).getName() + ".RXSdkUiImpl";
//        Class<?> RxsdkUiImpl = getClass(className);
//        if (RxsdkUiImpl != null) {
//            try {
//                Method methodInit = RxsdkUiImpl.getMethod("getInstance");
//                return (IRXSdkUi) Objects.requireNonNull(methodInit.invoke(null));
//            } catch (InvocationTargetException e) {
//                Throwable t = e.getCause();
//                assert t != null;
//                t.printStackTrace();
//
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        }
//        throw new RuntimeException(className + " class did not load successfully ！");
    }

}
