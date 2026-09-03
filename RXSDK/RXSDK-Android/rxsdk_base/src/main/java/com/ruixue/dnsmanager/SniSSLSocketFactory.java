package com.ruixue.dnsmanager;


import android.net.SSLCertificateSocketFactory;
import android.os.Build;
import android.util.Log;

import java.io.IOException;
import java.lang.reflect.Method;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLPeerUnverifiedException;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

public class SniSSLSocketFactory extends SSLSocketFactory {

    public static final String TAG  = SniSSLSocketFactory.class.getName();


    private HttpsURLConnection mConn;


    public SniSSLSocketFactory(HttpsURLConnection conn) {
        mConn = conn;
    }


    @Override
    public Socket createSocket() throws IOException {
        return null;
    }


    @Override
    public Socket createSocket(String host, int port) throws IOException, UnknownHostException {
        return null;
    }


    @Override
    public Socket createSocket(String host, int port, InetAddress localHost, int localPort) throws IOException, UnknownHostException {
        return null;
    }


    @Override
    public Socket createSocket(InetAddress host, int port) throws IOException {
        return null;
    }


    @Override
    public Socket createSocket(InetAddress address, int port, InetAddress localAddress, int localPort) throws IOException {
        return null;
    }


    @Override
    public String[] getDefaultCipherSuites() {
        return new String[0];
    }


    @Override
    public String[] getSupportedCipherSuites() {
        return new String[0];
    }


    @Override
    public Socket createSocket(Socket socket, String host, int port, boolean autoClose) throws IOException {
        String realHost = mConn.getRequestProperty("Host");
        if (realHost == null) {
            realHost = host;
        }
        Log.i(TAG, "customized createSocket host is: " + realHost);
        InetAddress address = socket.getInetAddress();
        if (autoClose) {
            socket.close();
        }
        SSLCertificateSocketFactory sslSocketFactory = (SSLCertificateSocketFactory) SSLCertificateSocketFactory.getDefault(0);
        SSLSocket ssl = (SSLSocket) sslSocketFactory.createSocket(address, port);
        ssl.setEnabledProtocols(ssl.getSupportedProtocols());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            Log.i(TAG, "Setting SNI hostname");
            sslSocketFactory.setHostname(ssl, realHost);
        } else {
            Log.d(TAG, "No documented SNI support on Android < 4.2, trying with reflection");
            try {
                Method setHostnameMethod = ssl.getClass().getMethod("setHostname", String.class);
                setHostnameMethod.invoke(ssl, realHost);
            } catch (Exception e) {
                Log.w(TAG, "SNI not useable", e);
            }
        }
        // verify hostname and certificate
        SSLSession session = ssl.getSession();
        HostnameVerifier hostnameVerifier = HttpsURLConnection.getDefaultHostnameVerifier();
        if (!hostnameVerifier.verify(realHost, session)) {
            throw new SSLPeerUnverifiedException("Cannot verify hostname: " + realHost);
        }
        Log.i(TAG, "Established " + session.getProtocol() + " connection with " + session.getPeerHost() + " using " + session.getCipherSuite());
        return ssl;
    }
}

