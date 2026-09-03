package com.ruixue.utils;

import android.annotation.SuppressLint;
import android.content.Context;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;

import com.ruixue.RuiXueSdk;
import com.ruixue.openapi.RXGlobalData;

import java.io.File;
import java.io.FileReader;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.Objects;

public class MacUtil {
    @SuppressLint({"MissingPermission", "HardwareIds"})
    public static String getMacAddress(Context context) {
        String wlanMac = null;
        if (RXGlobalData.readSensitiveInfoEnabled()) {
            try {
                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) { //6.0以前的
                    try {
                        @SuppressLint("WrongConstant") WifiManager wm = (WifiManager) context.getApplicationContext()
                                .getSystemService(Context.WIFI_SERVICE);
                        wlanMac = wm.getConnectionInfo().getMacAddress().trim();
                    } catch (Exception ignored) {
                    }
                }
                if (isInvalidMac(wlanMac)) {
                    wlanMac = getMacAboveM();
                }
                if (isInvalidMac(wlanMac)) {
                    return null;
                }
            } catch (Exception ignore) {
            }
        }
        return wlanMac;
    }

    //是否无效 mac 地址
    private static boolean isInvalidMac(String mac) {
        return TextUtils.isEmpty(mac) || "02:00:00:00:00:00".equals(mac);
    }

    // M 23 os 6.0 以上
    private static String getMacAboveM() {
        String mac = getMac60_1();
        if (isInvalidMac(mac)) {
            mac = getMac60_2();
        }
        if (isInvalidMac(mac)) {
            mac = getLocalMacAddressFromIp();
        }
        return mac;
    }

    /**
     * 根据IP地址获取MAC地址
     */
    public static String getLocalMacAddressFromIp() {
        String strMacAddr = null;
        if (RXGlobalData.readSensitiveInfoEnabled()) {
            try {
                //获得IpD地址
                InetAddress ip = getLocalInetAddress();
                byte[] b = NetworkInterface.getByInetAddress(ip).getHardwareAddress();
                StringBuilder buffer = new StringBuilder();
                for (int i = 0; i < b.length; i++) {
                    if (i != 0) {
                        buffer.append(':');
                    }
                    String str = Integer.toHexString(b[i] & 0xFF);
                    buffer.append(str.length() == 1 ? 0 + str : str);
                }
                strMacAddr = buffer.toString().toUpperCase();
            } catch (Exception ignored) {
            }
        }
        return strMacAddr;
    }

    /**
     * Get IP address from first non-localhost interface
     *
     * @param useIPv4 true=return ipv4, false=return ipv6
     * @return address or empty string
     */
    public static String getIPAddress(boolean useIPv4) {
        if (RXGlobalData.readSensitiveInfoEnabled()) {
            try {
                List<NetworkInterface> interfaces =
                        Collections.list(NetworkInterface.getNetworkInterfaces());

                for (NetworkInterface interface_ : interfaces) {

                    for (InetAddress inetAddress :
                            Collections.list(interface_.getInetAddresses())) {

                    /* a loopback address would be something like 127.0.0.1 (the device
                       itself). we want to return the first non-loopback address. */
                        if (!inetAddress.isLoopbackAddress()) {
                            String ipAddr = inetAddress.getHostAddress();
                            boolean isIPv4 = ipAddr.indexOf(':') < 0;

                            if (isIPv4 && !useIPv4) {
                                continue;
                            }
                            if (useIPv4 && !isIPv4) {
                                int delim = ipAddr.indexOf('%'); // drop ip6 zone suffix
                                ipAddr = delim < 0 ? ipAddr.toUpperCase() :
                                        ipAddr.substring(0, delim).toUpperCase();
                            }
                            return ipAddr;
                        }
                    }

                }
            } catch (Exception ignored) {
            } // if we can't connect, just return empty string
        }
        return "";
    }

    /**
     * Get IPv4 address from first non-localhost interface
     *
     * @return address or empty string
     */
    public static String getIPAddress() {
        return getIPAddress(true);
    }

    /**
     * 获取移动设备本地IP
     */
    private static InetAddress getLocalInetAddress() {
        InetAddress ip = null;
        try {
            //列举
            Enumeration<NetworkInterface> en_netInterface = NetworkInterface.getNetworkInterfaces();
            while (en_netInterface.hasMoreElements()) {//是否还有元素
                NetworkInterface ni = (NetworkInterface) en_netInterface.nextElement();//得到下一个元素
                Enumeration<InetAddress> en_ip = ni.getInetAddresses();//得到一个ip地址的列举
                while (en_ip.hasMoreElements()) {
                    ip = en_ip.nextElement();
                    if (!ip.isLoopbackAddress() && !Objects.requireNonNull(ip.getHostAddress()).contains(":"))
                        break;
                    else
                        ip = null;
                }
                if (ip != null) {
                    break;
                }
            }
        } catch (SocketException e) {
            e.printStackTrace();
        }
        return ip;
    }

    /**
     * 获取当前系统连接网络的网卡的mac地址
     */
    public static String getMac() {
        byte[] mac = null;
        if (RXGlobalData.readSensitiveInfoEnabled()) {
            try {
                Enumeration<NetworkInterface> netInterfaces = NetworkInterface.getNetworkInterfaces();
                while (netInterfaces != null && netInterfaces.hasMoreElements()) {
                    NetworkInterface ni = netInterfaces.nextElement();
                    Enumeration<InetAddress> address = ni.getInetAddresses();
                    while (address.hasMoreElements()) {
                        InetAddress ip = address.nextElement();
                        if (ip.isAnyLocalAddress() || !(ip instanceof Inet4Address) || ip.isLoopbackAddress())
                            continue;
                        if (ip.isSiteLocalAddress()) {
                            mac = ni.getHardwareAddress();
                            Log.i(RuiXueSdk.TAG, "get ethX：" + ni.getDisplayName());
                        } else if (!ip.isLinkLocalAddress()) {
                            mac = ni.getHardwareAddress();
                            Log.i(RuiXueSdk.TAG, "get ethX：" + ni.getDisplayName());
                            break;
                        }
                    }
                }
            } catch (SocketException e) {
                e.printStackTrace();
            }
        }
        return getMacString(mac);
    }

    /**
     * 获取wifi模块的mac地址
     */
    public static String getWifiMac() {
        return getNetworkInterfaceMac("wlan0");
    }

    public static String getP2pMac() {
        return getNetworkInterfaceMac("p2p0");
    }

    public static String getIp6tnl0Mac() {
        return getNetworkInterfaceMac("ip6tnl0");
    }

    public static String getIpVti0Mac() {
        return getNetworkInterfaceMac("ip_vti0");
    }

    public static String getLoMac() {
        return getNetworkInterfaceMac("lo");
    }

    public static String getTeql0Mac() {
        return getNetworkInterfaceMac("teql0");
    }

    public static String getSit0Mac() {
        return getNetworkInterfaceMac("sit0");
    }

    public static String getIp6Vti0Mac() {
        return getNetworkInterfaceMac("ip6_vti0");
    }

    /**
     * 获取有线网卡模块的mac地址
     */
    public static String getEthernetMac() {
        return getNetworkInterfaceMac("eth0");
    }

    /**
     * 获取指定网卡mac地址
     */
    private static String getNetworkInterfaceMac(String networkInterfaceName) {
        try {
            Enumeration<NetworkInterface> networkInterfaces = NetworkInterface.getNetworkInterfaces();
            while (networkInterfaces.hasMoreElements()) {
                NetworkInterface ni = networkInterfaces.nextElement();
                if (networkInterfaceName.equals(ni.getName())) {
                    return getMacString(getMacBytes(ni));
                }
            }
        } catch (SocketException e) {
            e.printStackTrace();
        }
        return null;
    }

    private static byte[] getMacBytes(NetworkInterface ni) {
        byte[] mac = null;
        try {
            Enumeration<InetAddress> address = ni.getInetAddresses();
            while (address.hasMoreElements()) {
                InetAddress ip = address.nextElement();
                if (ip.isAnyLocalAddress() || !(ip instanceof Inet4Address) || ip.isLoopbackAddress())
                    continue;
                if (ip.isSiteLocalAddress())
                    mac = ni.getHardwareAddress();
                else if (!ip.isLinkLocalAddress()) {
                    mac = ni.getHardwareAddress();
                    break;
                }
            }
        } catch (SocketException e) {
            e.printStackTrace();
        }
        return mac;
    }

    private static String getMacString(byte[] mac) {
        if (mac != null) {
            StringBuilder sb = new StringBuilder();
            for (byte b : mac) {
                sb.append(parseByte(b));
            }
            return sb.substring(0, sb.length() - 1);
        }
        return null;
    }

    private static String parseByte(byte b) {
        String s = "00" + Integer.toHexString(b) + ":";
        return s.substring(s.length() - 3);
    }


    private static String getMac60_1() {
        String macSerial = "";
        try {
            //6.0-7.0
            Process pp = Runtime.getRuntime().exec("cat /sys/class/net/wlan0/address ");
            InputStreamReader ir = new InputStreamReader(pp.getInputStream());
            LineNumberReader input = new LineNumberReader(ir);
            String str = "";
            while (null != str) {
                str = input.readLine();
                if (str != null) {
                    macSerial = str.trim();
                    break;
                }
            }
        } catch (Exception var6) {
            var6.printStackTrace();
        }
        if (TextUtils.isEmpty(macSerial)) {
            try {
                return readMacAddressFile();
            } catch (Exception var5) {
                var5.printStackTrace();
            }
        }
        return macSerial;
    }

    //7.0以上
    // 遍历循环所有的网络接口，找到接口是 wlan0
    // * 必须的权限 <uses-permission android:name="android.permission.INTERNET" />
    private static String getMac60_2() {
        try {
            List<NetworkInterface> all = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface nif : all) {
                if (!nif.getName().equalsIgnoreCase("wlan0")) continue;
                byte[] macBytes = nif.getHardwareAddress();
                if (macBytes == null) {
                    return "";
                }
                StringBuilder res1 = new StringBuilder();
                for (byte b : macBytes) {
                    res1.append(String.format("%02X:", b));
                }
                if (res1.length() > 0) {
                    res1.deleteCharAt(res1.length() - 1);
                }
                String mac = res1.toString();
                if (!TextUtils.isEmpty(mac)) {
                    mac = mac.toLowerCase();
                }
                return mac;
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private static String readMacAddressFile() throws Exception {
        File file = new File("/sys/class/net/eth0/address");
        if (file.exists() && file.canRead()) {
            FileReader reader = new FileReader(file);
            StringBuilder builder = new StringBuilder();
            char[] buffer = new char[4096];
            for (int readLength = reader.read(buffer); readLength >= 0; readLength = reader.read(buffer)) {
                builder.append(buffer, 0, readLength);
            }
            reader.close();
            return builder.toString().toUpperCase().substring(0, 17);
        } else {
            return null;
        }
    }


}
