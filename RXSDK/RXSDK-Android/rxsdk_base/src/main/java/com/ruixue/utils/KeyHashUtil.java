package com.ruixue.utils;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.util.Base64;
import android.util.Log;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import java.util.ArrayList;
import java.util.List;

public class KeyHashUtil {
     public static List<String> getKeyHash(Context context) {
        List<String> keyHashList = new ArrayList<>();
        try {
            PackageInfo info = context.getPackageManager().getPackageInfo(
                    context.getPackageName(),  //Insert your own package name.
                    PackageManager.GET_SIGNATURES
            );
            for (Signature signature : info.signatures) {
                MessageDigest md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                String keyHash = Base64.encodeToString(md.digest(), Base64.DEFAULT);
                Log.d("KeyHash:", keyHash);
                keyHashList.add(keyHash);
            }
        } catch (PackageManager.NameNotFoundException | NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return keyHashList;
    }
}
