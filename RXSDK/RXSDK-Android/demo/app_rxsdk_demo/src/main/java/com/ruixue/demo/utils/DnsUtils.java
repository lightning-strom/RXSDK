package com.ruixue.demo.utils;

import android.annotation.SuppressLint;
import android.os.Build;
import android.util.Log;

import com.ruixue.logger.RXLogger;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.regex.Pattern;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/11/16
 */
public class DnsUtils {
    private final static String TAG = "DnsUtils";
    private static final Pattern IPV4_PATTERN = Pattern.compile("^(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}$");

    public static void hook() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            hookN();
        }
    }

    public static boolean isIpv4(String address) {
        return IPV4_PATTERN.matcher(address).matches();
    }

   static String hostIp6="";
    //ipv6
    public static String getLocalIpV6() {
        try {
            for (Enumeration<NetworkInterface> en = NetworkInterface
                    .getNetworkInterfaces(); en.hasMoreElements(); ) {
                NetworkInterface intf = en.nextElement();
                for (Enumeration<InetAddress> enumIpAddr = intf.getInetAddresses(); enumIpAddr.hasMoreElements(); ) {
                    InetAddress inetAddress = enumIpAddr.nextElement();
                    // RXLogger.e("ip1       " + inetAddress);
                    RXLogger.e("ip1  " + inetAddress.getHostAddress());
                 /*   RXLogger.e("getHostName  " + inetAddress.getHostName());
                    RXLogger.e("getCanonicalHostName  " + inetAddress.getCanonicalHostName());
                    RXLogger.e("getAddress  " + Arrays.toString(inetAddress.getAddress()));
                    RXLogger.e("getHostAddress  " + inetAddress.getHostAddress());*/
                    if (!inetAddress.isLoopbackAddress() && inetAddress instanceof Inet6Address) {
                        return inetAddress.getHostAddress();
                    }
                }
            }
        } catch (Exception ex) {
            Log.e("IP Address", ex.toString());
        }
        return null;
    }



    public static String getlocalIp() {
        String ip;
        try {
            for (Enumeration<NetworkInterface> en = NetworkInterface.getNetworkInterfaces(); en.hasMoreElements(); ) {
                NetworkInterface intf = en.nextElement();
                for (Enumeration<InetAddress> enumIpAddr = intf.getInetAddresses(); enumIpAddr.hasMoreElements(); ) {
                    InetAddress inetAddress = enumIpAddr.nextElement();
                    if (!inetAddress.isLoopbackAddress() && !inetAddress.isLinkLocalAddress()) {
//                           ip=inetAddress.getHostAddress().toString();
                        System.out.println("ip==========" + inetAddress.getHostAddress());
                        return inetAddress.getHostAddress();
                    }
                }
            }
        } catch (SocketException ignored) {
        }
        return null;
    }

    public static String validateV6() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                hostIp6 = getLocalIpV6();
            }
        }).start();
        //过滤找到真实的ipv6地址
        RXLogger.e("v6 validateV6 " + hostIp6);
        if (hostIp6 != null && hostIp6.contains("%")) {
            String[] split = hostIp6.split("%");
            String s1 = split[0];
            RXLogger.e("v6 remove % is " + s1);
            if (s1 != null && s1.contains(":")) {
                String[] split1 = s1.split(":");
                if (split1.length == 6 || split1.length == 8) {
                    if (split1[0].contains("fe") || split1[0].contains("fc")) {
                        return "0.0.0.0";
                    } else {
                        return s1;
                    }
                }
            }
        }
        return "0.0.0.0";
    }

    /**
     * 7.0 之后 InetAddress 才有 impl
     */
    private static void hookN() {
        try {

            Log.d(TAG, "invoke 111：ipv6FirstN");

            //获取InetAddress中的impl
            @SuppressLint("SoonBlockedPrivateApi") Field impl = InetAddress.class.getDeclaredField("impl");
            impl.setAccessible(true);
            //获取accessFlags
            Field modifiersField = Field.class.getDeclaredField("accessFlags");
            modifiersField.setAccessible(true);
            //去final
            modifiersField.setInt(impl, impl.getModifiers() & ~java.lang.reflect.Modifier.FINAL);
            //获取原始InetAddressImpl对象
            final Object originalImpl = impl.get(null);
            //构建动态代理InetAddressImpl对象
            Object dynamicImpl = Proxy.newProxyInstance(originalImpl.getClass().getClassLoader(), originalImpl.getClass().getInterfaces(), new InvocationHandler() {
                @Override
                public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                    //如果函数名为lookupAllHostAddr，并且参数长度为2，第一个参数是host，第二个参数是netId
                    Object originalResult = method.invoke(originalImpl, args);
                    if (method.getName().equals("lookupAllHostAddr") && args != null && args.length == 2 && originalResult != null) {
                        InetAddress[] originalAddresses = (InetAddress[]) originalResult;
                        return myDnsLogic(originalAddresses);
                    }
                    return originalResult;
                }
            });
            //替换impl为动态代理对象
            impl.set(null, dynamicImpl);
            //还原final
            modifiersField.setInt(impl, impl.getModifiers() & java.lang.reflect.Modifier.FINAL);
        } catch (Throwable e) {

            Log.e(TAG, "invoke 555：" + e);

        }
    }

    private static InetAddress[] myDnsLogic(InetAddress[] originalAddresses) {
        // 做自己的逻辑；
        return originalAddresses;
    }

}
