package com.ruixue.demo.permission;

import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.location.Address;
import android.location.Geocoder;
import android.media.ExifInterface;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;

import android.util.Log;
import android.view.View;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;


import com.ruixue.net.ToastUtils;
import com.ruixue.permission.OnPermissionCallback;
import com.ruixue.permission.Permission;
import com.ruixue.permission.RXPermissions;
import com.ruixue.qipai.R;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

/**
 * author : Android lee
 * time   : 2018/06/15
 * desc   : 权限申请演示
 */
public final class PermissionActivity extends AppCompatActivity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.permission_layout);

        findViewById(R.id.btn_main_request_single).setOnClickListener(this);
        findViewById(R.id.btn_main_request_group).setOnClickListener(this);
        findViewById(R.id.btn_main_request_location).setOnClickListener(this);
        findViewById(R.id.btn_main_request_bluetooth).setOnClickListener(this);
        findViewById(R.id.btn_main_request_media_location).setOnClickListener(this);
        findViewById(R.id.btn_main_request_storage).setOnClickListener(this);
        findViewById(R.id.btn_main_request_install).setOnClickListener(this);
        findViewById(R.id.btn_main_request_window).setOnClickListener(this);
        findViewById(R.id.btn_main_request_setting).setOnClickListener(this);
        findViewById(R.id.btn_main_request_notification).setOnClickListener(this);
        findViewById(R.id.btn_main_request_notification_listener).setOnClickListener(this);
        findViewById(R.id.btn_main_request_package).setOnClickListener(this);
        findViewById(R.id.btn_main_request_alarm).setOnClickListener(this);
        findViewById(R.id.btn_main_request_not_disturb).setOnClickListener(this);
        findViewById(R.id.btn_main_request_ignore_battery).setOnClickListener(this);
        findViewById(R.id.btn_main_request_open_vpn).setOnClickListener(this);
        findViewById(R.id.btn_main_app_details).setOnClickListener(this);
        if (getSupportActionBar() != null) {
            Objects.requireNonNull(getSupportActionBar()).setTitle("权限申请测试页面");
        }
    }

    @Override
    public void onClick(View view) {
        int viewId = view.getId();
        if (viewId == R.id.btn_main_request_single) {

            RXPermissions.with(this)
                    .permission(Permission.CAMERA)
                    .interceptor(new PermissionInterceptor())
                    .request(new OnPermissionCallback() {

                        @Override
                        public void onGranted(List<String> permissions, boolean all) {
                            toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                        }
                    });

        } else if (viewId == R.id.btn_main_request_group) {

            RXPermissions.with(this)
                    .permission(Permission.RECORD_AUDIO)
                    .permission(Permission.Group.CALENDAR)
                    .interceptor(new PermissionInterceptor())
                    .request(new OnPermissionCallback() {

                        @Override
                        public void onGranted(List<String> permissions, boolean all) {
                            if (!all) {
                                return;
                            }
                            toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                        }
                    });

        } else if (viewId == R.id.btn_main_request_location) {

            RXPermissions.with(this)
                    .permission(Permission.ACCESS_COARSE_LOCATION)
                    .permission(Permission.ACCESS_FINE_LOCATION)
                    // 如果不需要在后台使用定位功能，请不要申请此权限
                    .permission(Permission.ACCESS_BACKGROUND_LOCATION)
                    .interceptor(new PermissionInterceptor())
                    .request(new OnPermissionCallback() {

                        @Override
                        public void onGranted(List<String> permissions, boolean all) {
                            if (!all) {
                                return;
                            }
                            toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                        }
                    });

        } else if (viewId == R.id.btn_main_request_bluetooth) {

            long delayMillis = 0;
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
                delayMillis = 2000;
                toast("当前版本不是 Android 12 及以上，旧版本的需要定位权限才能进行扫描蓝牙");
            }

            try {
                view.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        RXPermissions.with(PermissionActivity.this)
                                .permission(Permission.BLUETOOTH_SCAN)
                                .permission(Permission.BLUETOOTH_CONNECT)
                                .permission(Permission.BLUETOOTH_ADVERTISE)
                                .interceptor(new PermissionInterceptor())
                                .request(new OnPermissionCallback() {

                                    @Override
                                    public void onGranted(List<String> permissions, boolean all) {
                                        toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                                    }
                                });
                    }
                }, delayMillis);
            } catch (Exception e) {
                e.printStackTrace();
            }

        } else if (viewId == R.id.btn_main_request_media_location) {

            long delayMillis = 0;
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
                delayMillis = 2000;
                toast("当前版本不是 Android 10 及以上，旧版本的需要读取存储权限才能获取媒体位置权限");
            }

            view.postDelayed(new Runnable() {

                @Override
                public void run() {
                    RXPermissions.with(PermissionActivity.this)
                            // Permission.Group.STORAGE 和 Permission.MANAGE_EXTERNAL_STORAGE 二选一
                            .permission(Permission.Group.STORAGE)
                            .permission(Permission.ACCESS_MEDIA_LOCATION)
                            .interceptor(new PermissionInterceptor())
                            .request(new OnPermissionCallback() {

                                @Override
                                public void onGranted(List<String> permissions, boolean all) {
                                    if (!all) {
                                        return;
                                    }
                                    toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                                    getAllImagesFromGallery();
                                }
                            });
                }
            }, delayMillis);

        } else if (viewId == R.id.btn_main_request_storage) {

            long delayMillis = 0;
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
                delayMillis = 2000;
                toast("当前版本不是 Android 11 及以上，会自动变更为旧版的请求方式");
            }

            view.postDelayed(new Runnable() {

                @Override
                public void run() {
                    RXPermissions.with(PermissionActivity.this)
                            // 适配 Android 11 分区存储这样写
                            //.permission(Permission.Group.STORAGE)
                            // 不适配 Android 11 分区存储这样写
                            .permission(Permission.MANAGE_EXTERNAL_STORAGE)
                            .interceptor(new PermissionInterceptor())
                            .request(new OnPermissionCallback() {

                                @Override
                                public void onGranted(List<String> permissions, boolean all) {
                                    toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                                }
                            });
                }
            }, delayMillis);

        } else if (viewId == R.id.btn_main_request_install) {

            RXPermissions.with(this)
                    .permission(Permission.REQUEST_INSTALL_PACKAGES)
                    .interceptor(new PermissionInterceptor())
                    .request(new OnPermissionCallback() {

                        @Override
                        public void onGranted(List<String> permissions, boolean all) {
                            toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                        }
                    });

        } else if (viewId == R.id.btn_main_request_window) {

            RXPermissions.with(this)
                    .permission(Permission.SYSTEM_ALERT_WINDOW)
                    .interceptor(new PermissionInterceptor())
                    .request(new OnPermissionCallback() {

                        @Override
                        public void onGranted(List<String> permissions, boolean all) {
                            toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                        }
                    });

        } else if (viewId == R.id.btn_main_request_setting) {

            RXPermissions.with(this)
                    .permission(Permission.WRITE_SETTINGS)
                    .interceptor(new PermissionInterceptor())
                    .request(new OnPermissionCallback() {

                        @Override
                        public void onGranted(List<String> permissions, boolean all) {
                            toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                        }
                    });

        } else if (viewId == R.id.btn_main_request_notification) {

            RXPermissions.with(this)
                    .permission(Permission.NOTIFICATION_SERVICE)
                    .request(new OnPermissionCallback() {

                        @Override
                        public void onGranted(List<String> permissions, boolean all) {
                            toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                        }
                    });

        } else if (viewId == R.id.btn_main_request_notification_listener) {

            RXPermissions.with(this)
                    .permission(Permission.BIND_NOTIFICATION_LISTENER_SERVICE)
                    .interceptor(new PermissionInterceptor())
                    .request(new OnPermissionCallback() {

                        @Override
                        public void onGranted(List<String> permissions, boolean all) {
                            toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                            toggleNotificationListenerService();
                        }
                    });

        } else if (viewId == R.id.btn_main_request_package) {

            RXPermissions.with(this)
                    .permission(Permission.PACKAGE_USAGE_STATS)
                    .interceptor(new PermissionInterceptor())
                    .request(new OnPermissionCallback() {

                        @Override
                        public void onGranted(List<String> permissions, boolean all) {
                            toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                        }
                    });

        } else if (viewId == R.id.btn_main_request_alarm) {

            RXPermissions.with(this)
                    .permission(Permission.SCHEDULE_EXACT_ALARM)
                    .interceptor(new PermissionInterceptor())
                    .request(new OnPermissionCallback() {

                        @Override
                        public void onGranted(List<String> permissions, boolean all) {
                            toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                        }
                    });

        } else if (viewId == R.id.btn_main_request_not_disturb) {

            RXPermissions.with(this)
                    .permission(Permission.ACCESS_NOTIFICATION_POLICY)
                    .interceptor(new PermissionInterceptor())
                    .request(new OnPermissionCallback() {

                        @Override
                        public void onGranted(List<String> permissions, boolean all) {
                            toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                        }
                    });

        } else if (viewId == R.id.btn_main_request_ignore_battery) {

            RXPermissions.with(this)
                    .permission(Permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
                    .interceptor(new PermissionInterceptor())
                    .request(new OnPermissionCallback() {

                        @Override
                        public void onGranted(List<String> permissions, boolean all) {
                            toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                        }
                    });

        } else if (viewId == R.id.btn_main_request_open_vpn) {

            RXPermissions.with(this)
                    .permission(Permission.BIND_VPN_SERVICE)
                    .interceptor(new PermissionInterceptor())
                    .request(new OnPermissionCallback() {

                        @Override
                        public void onGranted(List<String> permissions, boolean all) {
                            toast("获取" + PermissionNameConvert.getPermissionString(PermissionActivity.this, permissions) + "成功");
                        }
                    });

        } else if (viewId == R.id.btn_main_app_details) {

            RXPermissions.startPermissionActivity(this);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == RXPermissions.REQUEST_CODE) {
            toast("检测到你刚刚从权限设置界面返回回来");
        }
    }

    public void toast(CharSequence text) {
        ToastUtils.showToast(this, text.toString());
    }

    private void toggleNotificationListenerService() {
        PackageManager packageManager = getPackageManager();
        packageManager.setComponentEnabledSetting(
                new ComponentName(this, NotificationMonitorService.class),
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP);

        packageManager.setComponentEnabledSetting(
                new ComponentName(this, NotificationMonitorService.class),
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP);
    }

    /**
     * 获取所有图片
     */
    private void getAllImagesFromGallery() {
        String[] projection = {MediaStore.Images.Media._ID, MediaStore.Images.Media.DATA,
                MediaStore.MediaColumns.TITLE, MediaStore.Images.Media.SIZE,
                MediaStore.Images.ImageColumns.LATITUDE, MediaStore.Images.ImageColumns.LONGITUDE};

        final String orderBy = MediaStore.Video.Media.DATE_TAKEN;
        Cursor cursor = getApplicationContext().getContentResolver()
                .query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, projection,
                        null, null, orderBy + " DESC");

        int idIndex = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns._ID);
        int pathIndex = cursor.getColumnIndex(MediaStore.MediaColumns.DATA);

        while (cursor.moveToNext()) {

            String filePath = cursor.getString(pathIndex);

            float[] latLong = new float[2];

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // 谷歌官方文档：https://developer.android.google.cn/training/data-storage/shared/media?hl=zh-cn#location-media-captured
                Uri photoUri = Uri.withAppendedPath(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                        cursor.getString(idIndex));
                photoUri = MediaStore.setRequireOriginal(photoUri);
                try {
                    InputStream inputStream = getApplicationContext()
                            .getContentResolver().openInputStream(photoUri);
                    if (inputStream == null) {
                        continue;
                    }
                    ExifInterface exifInterface = new ExifInterface(inputStream);
                    // 获取图片的经纬度
                    exifInterface.getLatLong(latLong);
                    inputStream.close();
                } catch (IOException | UnsupportedOperationException e) {
                    e.printStackTrace();
                } // java.lang.UnsupportedOperationException:
                // Caller must hold ACCESS_MEDIA_LOCATION permission to access original
                // 经过测试，在部分手机上面申请获取媒体位置权限，如果用户选择的是 "仅在使用中允许"
                // 那么就会导致权限是授予状态，但是调用 openInputStream 时会抛出此异常

            } else {
                int latitudeIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.ImageColumns.LATITUDE);
                int longitudeIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.ImageColumns.LONGITUDE);
                latLong = new float[]{cursor.getFloat(latitudeIndex), cursor.getFloat(longitudeIndex)};
            }

            if (latLong[0] != 0 && latLong[1] != 0) {
                Log.i("RXPermissions", "获取到图片的经纬度：" + filePath + "，" + Arrays.toString(latLong));
                Log.i("RXPermissions", "图片经纬度所在的地址：" + latLongToAddressString(latLong[0], latLong[1]));
            } else {
                Log.i("RXPermissions", "该图片获取不到经纬度：" + filePath);
            }
        }
        cursor.close();
    }

    /**
     * 将经纬度转换成地址
     */
    private String latLongToAddressString(float latitude, float longitude) {
        String addressString = "";
        Geocoder geocoder = new Geocoder(this, Locale.getDefault());
        try {
            List<Address> addresses = geocoder.getFromLocation(latitude, longitude, 1);
            if (addresses != null) {
                Address returnedAddress = addresses.get(0);
                StringBuilder strReturnedAddress = new StringBuilder("");

                for (int i = 0; i <= returnedAddress.getMaxAddressLineIndex(); i++) {
                    strReturnedAddress.append(returnedAddress.getAddressLine(i)).append("\n");
                }
                addressString = strReturnedAddress.toString();
            } else {
                Log.w("RXPermissions", "没有返回地址");
            }
        } catch (Exception e) {
            e.printStackTrace();
            Log.w("RXPermissions", "无法获取到地址");
        }
        return addressString;
    }
}