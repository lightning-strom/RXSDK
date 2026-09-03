package com.ruixue.contacts;

import static android.content.Context.MODE_PRIVATE;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.provider.ContactsContract;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ruixue.RuiXueSdk;
import com.ruixue.net.RXRequest;
import com.ruixue.permission.OnPermissionCallback;
import com.ruixue.permission.RXPermissions;
import com.ruixue.utils.AESUtil;
import com.ruixue.utils.Md5Util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/3/21
 */
public class ContactsHelper {

    private static final String PREFS_FILE_NAME = "rx_contacts_info";

    private static final String PREFS_KEY_CONTACTS = "rx_contacts";
    private static final String PREFS_KEY_TS = "rx_ts";

    public static class ContactsBean implements Comparable<ContactsBean> {
        @Keep
        String identifier;
        @Keep
        long ts;
        @Keep
        String name;
        @Keep
        List<String> phones;
        @Keep
        List<String> emails;

        public static Map<String, ContactsBean> fromJson(String json) {
            if (TextUtils.isEmpty(json))
                return null;
            Gson gson = new Gson();
            return gson.fromJson(json, new TypeToken<Map<String, ContactsBean>>() {
            }.getType());
        }

        @Override
        public int compareTo(ContactsBean contactsBean) {
            return (int) (ts - contactsBean.ts);
        }

        @Override
        public boolean equals(@Nullable Object o) {
            if (this == o)
                return true;
            if (!(o instanceof ContactsBean))
                return false;
            ContactsBean that = (ContactsBean) o;
            return ts == that.ts;
        }

        public Map<String, Object> toMap() {
            Map<String, Object> map = new HashMap<>();
            map.put("identifier", identifier);
            map.put("ts", ts);
            if (name != null)
                map.put("name", name);
            if (phones != null)
                map.put("phones", phones);
            if (emails != null)
                map.put("emails", emails);
            return map;
        }
    }

    public static void sendAddressBook(Context activity, String path, int time) {
        SharedPreferences sharedPreferences = activity.getSharedPreferences(PREFS_FILE_NAME, MODE_PRIVATE);
        long str = sharedPreferences.getLong(PREFS_KEY_TS, 0);
        long curTs = System.currentTimeMillis() / 1000;
        if (curTs > (str + time)) {
            if (ContextCompat.checkSelfPermission(activity, Manifest.permission.READ_CONTACTS) != PackageManager.PERMISSION_GRANTED) {
                RXPermissions.with(activity).permission(Manifest.permission.READ_CONTACTS).request(new OnPermissionCallback() {
                    @Override
                    public void onGranted(List<String> permissions, boolean all) {
                        sendContactsData(activity, path);
                    }
                });
            } else {
                sendContactsData(activity, path);
            }
        } else {
            Log.d("rxsdk", "Time condition not met surplus" + (curTs - (str + time)));
        }
    }

    public static Map<String, ContactsBean> getAlterData(Map<String, ContactsBean> map1, Map<String, ContactsBean> map2) {
        Map<String, ContactsBean> intersectionMap = new HashMap<>();
        if (map1 == null) {
            return map2;
        }
        if (map2 == null) {
            return intersectionMap;
        }
        if (map1.hashCode() == map2.hashCode()) {
            return intersectionMap;
        }
        for (Map.Entry<String, ContactsBean> entry : map2.entrySet()) {
            if (!map1.containsKey(entry.getKey()) || !Objects.equals(map1.get(entry.getKey()), entry.getValue())) {
                intersectionMap.put(entry.getKey(), entry.getValue());
            }
        }
        return intersectionMap;
    }

    public static Map<String, ContactsBean> getDel(Map<String, ContactsBean> map1, Map<String, ContactsBean> map2) {
        if (map1 == null)
            return new HashMap<>();
        Map<String, ContactsBean> differenceMap = new HashMap<>(map1);
        if (map2 != null) {
            differenceMap.keySet().removeAll(map2.keySet());
        }

        return differenceMap;
    }

    public static Map<String, ContactsBean> getAdd(Map<String, ContactsBean> map1, Map<String, ContactsBean> map2) {
        if (map2 == null)
            return new HashMap<>();
        Map<String, ContactsBean> differenceMap = new HashMap<>(map2);
        if (map1 != null) {
            differenceMap.keySet().removeAll(map1.keySet());
        }
        return differenceMap;
    }

    public static List<Map<String, Object>> getModify(Map<String, ContactsBean> old, Map<String, ContactsBean> c2) {
        return toListMap(getAlterData(old, c2));
    }

    @NonNull
    private static List<Map<String, Object>> toListMap(Map<String, ContactsBean> map) {
        List<Map<String, Object>> list = new ArrayList<>();
        if (map != null) {
            Collection<ContactsBean> li = map.values();
            for (ContactsBean c : li) {
                list.add(c.toMap());
            }
        }
        return list;
    }

    private static void sendContactsData(Context activity, String path) {
        String apiPath = "/v1/" + path + "/ph/uab";
        List<Map<String, Object>> list = getContactsData(activity);
        if (list != null && list.size() > 0) {
            Map<String, Object> address_books = new HashMap<>();
            String secert = Md5Util.StringInMd5(RuiXueSdk.getDeviceCode() + RuiXueSdk.getOpenid());
            String oridata = new Gson().toJson(list);
            String data = AESUtil.encrypt(oridata, secert).replaceAll("\\r?\\n", "");

            address_books.put("data", data);
            RXRequest.create(apiPath).setNeedLoggedIn(true).setBody(address_books).postAsync();
        }
    }

    private static List<Map<String, Object>> getContactsData(Context activity) {

        ContentResolver cr = activity.getContentResolver();
        Cursor cur = cr.query(ContactsContract.Contacts.CONTENT_URI, null, null, null, null);
        Map<String, ContactsBean> addrs = new HashMap<>();
        if (cur.moveToFirst()) {
            do {
//                int cidx = cur.getColumnIndex(ContactsContract.Contacts.LOOKUP_KEY);
//                if (cidx >= 0) {
//                    String lookupKey = cur.getString(cidx);
//                    Uri uri = Uri.withAppendedPath(ContactsContract.Contacts.CONTENT_LOOKUP_URI, lookupKey);
//                    RXLogger.e(uri.toString());
//                }
                // Do something with the Uri, like query it with a CursorLoader
                try {

                    @SuppressLint("Range") String id = cur.getString(cur.getColumnIndex(ContactsContract.Contacts._ID));
                    @SuppressLint("Range") String name = cur.getString(cur.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME));
                    @SuppressLint("Range") long last_updated_timestamp = cur.getLong(cur.getColumnIndex(ContactsContract.Contacts.CONTACT_LAST_UPDATED_TIMESTAMP));
//
//                    RXLogger.e("getColumnNames:" + Arrays.toString(cur.getColumnNames()));
//
//                    for (String idx : cur.getColumnNames()) {
//                        @SuppressLint("Range") String val = cur.getString(cur.getColumnIndex(idx));
//                        RXLogger.e(idx + ":" + val);
//                    }
                    // 可以获取更多的字段，例如电话号码
                    Cursor cursorUri = cr.query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI, null, ContactsContract.CommonDataKinds.Phone.CONTACT_ID + " = " + id, null, null);
                    List<String> phoneList = new ArrayList<>();
                    if (cursorUri != null) {
                        while (cursorUri.moveToNext()) {
                            int cn = cursorUri.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER);
                            if (cn >= 0) {
                                String phoneNumber = cursorUri.getString(cn);
                                phoneList.add(phoneNumber.replace(" ", ""));
                            }
                        }
                        cursorUri.close();
                    }
                    // 获取电子邮件
                    Cursor emails = cr.query(ContactsContract.CommonDataKinds.Email.CONTENT_URI, null, ContactsContract.CommonDataKinds.Email.CONTACT_ID + " = " + id, null, null);
                    List<String> emailList = new ArrayList<>();
                    if (emails != null) {
                        while (emails.moveToNext()) {
                            int cn = emails.getColumnIndex(ContactsContract.CommonDataKinds.Email.DATA);
                            if (cn >= 0) {
                                String emailAddress = emails.getString(cn);
                                // 在这里处理电子邮件
                                emailList.add(emailAddress);
                            }
                        }
                        emails.close();
                    }


                    ContactsBean addr = new ContactsBean();
                    addr.identifier = id;
                    addr.ts = last_updated_timestamp;
                    addr.name = name;
                    addr.phones = phoneList;
                    addr.emails = emailList;
                    addrs.put(id, addr);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } while (cur.moveToNext());
        }
        cur.close();

        SharedPreferences sharedPreferences = activity.getSharedPreferences(PREFS_FILE_NAME, MODE_PRIVATE);
        String str = sharedPreferences.getString(PREFS_KEY_CONTACTS, null);

        Map<String, ContactsBean> oldContacts = ContactsBean.fromJson(str);

        sharedPreferences.edit().putString(PREFS_KEY_CONTACTS, new Gson().toJson(addrs)).apply();
        sharedPreferences.edit().putLong(PREFS_KEY_TS, (System.currentTimeMillis() / 1000)).apply();
        if (oldContacts != null) {
            return getModify(oldContacts, addrs);
        } else {
            return toListMap(addrs);
        }
    }

}
