package com.ruixue.base;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/13
 */

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.database.ContentObserver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;

import android.os.Handler;
import android.os.Message;
import android.provider.Settings;
import android.text.TextUtils;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;

import com.ruixue.internal.RXFileProvider;
import com.ruixue.logger.RXLogger;

import java.io.File;


public class Downloader {

    private static final String TAG = Downloader.class.getSimpleName();


    //下载器
    private DownloadManager downloadManager;
    //上下文
    private final Context mContext;

    //下载的ID
    private long downloadId = -1;

    private boolean isRegistReceiver = false;

    private boolean autoInstall = false;

    private OnFinishCallback mFinishCallback;

    @SuppressLint("StaticFieldLeak")
    private static Downloader instance;

    public static Downloader getInstance(Context context) {
        if (instance == null) {
            instance = new Downloader(context);
        }
        return instance;
    }

    public Downloader(Context context) {
        this.mContext = context;
    }

    public interface OnFinishCallback {
        void onFinish(boolean isSuccess, String uriStr);

    }

    public DownloadManager getDownloadManager() {
        return downloadManager;
    }

    public long getDownloadId() {
        return downloadId;
    }

    public Downloader setFinishCallback(OnFinishCallback finishCallback) {
        mFinishCallback = finishCallback;
        return this;
    }

    public Downloader setAutoInstall(boolean autoInstall) {
        this.autoInstall = autoInstall;
        return this;
    }

    public void downloadAPK(String url, String name) {
        downloadAPK(url, name, null, null);
    }

    /**
     * @param url         url
     * @param name        name
     * @param description description
     * @param mimeType    mimeType
     * @return downloadId 通过该id可以取消任务，重启任务、获取下载的文件等等
     */
    public long downloadAPK(String url, String name, @Nullable String description, @Nullable String mimeType) {
        try {
            //创建下载任务
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            //移动网络情况下是否允许漫游
            request.setAllowedOverRoaming(false);
            //下载时，下载完成后显示通知
            request.setNotificationVisibility(autoInstall ? DownloadManager.Request.VISIBILITY_VISIBLE : DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setTitle(name);
            if (!TextUtils.isEmpty(description)) {
                request.setDescription(description);
            }
            /// 允许该记录在下载管理界面可见
            request.setVisibleInDownloadsUi(true);
            if (TextUtils.isEmpty(mimeType)) {
                request.setMimeType(mimeType);
            }
            //设置下载的路径
            if (ContextCompat.checkSelfPermission(mContext, Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                //公共下载目录
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, name);
                request.allowScanningByMediaScanner();
            } else {
                //沙盒下载目录
                request.setDestinationInExternalFilesDir(mContext, Environment.DIRECTORY_DOWNLOADS, name);
            }
            //获取DownloadManager
            downloadManager = (DownloadManager) mContext.getSystemService(Context.DOWNLOAD_SERVICE);
            //将下载请求加入下载队列，加入下载队列后会给该任务返回一个long型的id，通过该id可以取消任务，重启任务、获取下载的文件等等
            downloadId = downloadManager.enqueue(request);
            RXLogger.i(downloadId + " 开始下载 :" + url);

            isRegistReceiver = true;
            //注册广播接收者，监听下载状态
            mContext.registerReceiver(mReceiver, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
            return downloadId;
        } catch (Exception e) {
            e.printStackTrace();
            if (mFinishCallback != null) {
                mFinishCallback.onFinish(false, e.getMessage());
            }
            return -1;
        }
    }


    public void registerContentObserver(Handler handler) {
        //“content://downloads/public_downloads”,
        //“content://downloads/my_downloads”,
        //“content://downloads/all_downloads”
        mContext.getContentResolver().registerContentObserver(Uri.parse("content://downloads/my_downloads"), true, new DownloadChangeObserver(handler));
    }

    /**
     * 下载监听
     */
    static class DownloadChangeObserver extends ContentObserver {

        private final Handler handler;

        public DownloadChangeObserver(Handler handler) {
            super(handler);
            this.handler = handler;
        }

        @Override
        public void onChange(boolean selfChange) {
            super.onChange(selfChange);
//             updateProcess();
        }

//        private void updateProcess() {
//            int[] bytesAndStatus = instance.queryDownloadedProcess(instance.downloadId);
//            Message msg = Message.obtain();
//            Bundle bundle = new Bundle();
//            bundle.putInt("CompletedSize", bytesAndStatus[0]);
//            bundle.putInt("TotalSize", bytesAndStatus[1]);
//            bundle.putInt("pro", bytesAndStatus[2]);
//            msg.setData(bundle);
//            this.handler.sendMessage(msg);
//        }
    }


    //广播监听下载的各个状态
    private final BroadcastReceiver mReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            long completeDownLoadId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, downloadId);
            checkStatus(completeDownLoadId);
        }
    };


    //检查下载状态
    private void checkStatus(long downloadId) {
        DownloadManager.Query query = new DownloadManager.Query();
        //通过下载的id查找
        query.setFilterById(downloadId);
        Cursor c = downloadManager.query(query);
        if (c.moveToFirst()) {
            @SuppressLint("Range") int status = c.getInt(c.getColumnIndex(DownloadManager.COLUMN_STATUS));
            switch (status) {
                //下载暂停
                case DownloadManager.STATUS_PAUSED:
                    break;
                //下载延迟
                case DownloadManager.STATUS_PENDING:
                    break;
                //正在下载
                case DownloadManager.STATUS_RUNNING:
                    break;
                //下载完成
                case DownloadManager.STATUS_SUCCESSFUL:
                    Uri apkFileUri = queryDownloadedApk(downloadId);
                    if (mFinishCallback != null) {
                        mFinishCallback.onFinish(true, apkFileUri.toString());
                    }
                    //下载完成安装APK
                    if (autoInstall) {
                        installAPK(apkFileUri);
                    }
                    downloadId = -1;
                    break;
                //下载失败
                case DownloadManager.STATUS_FAILED:
                    RXLogger.e("下载失败 :" + downloadId);
                    if (mFinishCallback != null) {
                        mFinishCallback.onFinish(false, "" + downloadId);
                    }
                    downloadId = -1;
                    break;
            }
        }
    }


    public void installAPK(Uri apkUri) {
        installAPK(new File(apkUri.getPath()));
    }

    private boolean checkInstallPermission() {
        boolean isInstallPermission = true;//是否有8.0安装权限
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                isInstallPermission = mContext.getPackageManager().canRequestPackageInstalls();
//                if (!isInstallPermission) {
//                    new AlertDialog.Builder(mContext)
//                            .setTitle("权限申请")
//                            .setMessage("Android8.0未知来源应用安装权限")
//                            .setPositiveButton("赏给你", new DialogInterface.OnClickListener() {
//                                @Override
//                                public void onClick(DialogInterface dialog, int which) {
//                                    dialog.cancel();
//                                    startInstallPermissionSettingActivity();
//                                }
//                            }).setNegativeButton("取消", null).show();
//                }
            } catch (Exception e) {
                e.printStackTrace();
                isInstallPermission = false;
            }
        }
        return isInstallPermission;
    }

    /**
     * 兼容 8.0 未知来源应用安装
     */
    int Code_INSTALLPACKAGES = 1;

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void startInstallPermissionSettingActivity() {
        Uri packageURI = Uri.parse("package:" + mContext.getPackageName());
        Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, packageURI);
        ((Activity) mContext).startActivityForResult(intent, Code_INSTALLPACKAGES);
    }

    public void installAPK(File apkFile) {
        boolean isInstallPermission = checkInstallPermission();
        if (!isInstallPermission) {
            RXLogger.e("not install package permission");
        }
        Intent intent = new Intent();
        Uri uri;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            uri = RXFileProvider.getUriForFile(mContext, apkFile);
            intent.setAction(Intent.ACTION_INSTALL_PACKAGE);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);//7.0以后，系统要求授予临时uri读取权限，安装完毕以后，系统会自动收回权限，次过程没有用户交互
        } else {//7.0以下
            uri = Uri.fromFile(apkFile);
            intent.setAction(Intent.ACTION_VIEW);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        }
        intent.setDataAndType(uri, "application/vnd.android.package-archive");
        mContext.startActivity(intent);
    }


    /**
     * @param downloadId downloadId
     * @return 下载 索引 0 已下载字节数  1 总需下载的字节数  2 当前下载状态
     */
    @SuppressLint("Range")
    public int[] queryBytesAndStatus(long downloadId) {
        int[] bytesAndStatus = new int[]{-1, -1, 0};
        DownloadManager.Query query = new DownloadManager.Query().setFilterById(downloadId);
        try (Cursor c = downloadManager.query(query)) {
            if (c != null && c.moveToFirst()) {
                //已经下载的字节数
                bytesAndStatus[0] = c.getInt(c.getColumnIndexOrThrow(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));
                //总需下载的字节数
                bytesAndStatus[1] = c.getInt(c.getColumnIndexOrThrow(DownloadManager.COLUMN_TOTAL_SIZE_BYTES));
                bytesAndStatus[2] = c.getInt(c.getColumnIndex(DownloadManager.COLUMN_STATUS));

            }
        }
//        if (bytesAndStatus[1] > 0) {
//            long pro = (bytesAndStatus[0] * 100L) / bytesAndStatus[1];
//            bytesAndStatus[2] = (int) pro;
//        }
        return bytesAndStatus;
    }

    public Uri queryDownloadedApk(long downloadId) {
        Uri targetApkFile = null;
        if (downloadId != -1) {
            DownloadManager.Query query = new DownloadManager.Query();
            query.setFilterById(downloadId);
            query.setFilterByStatus(DownloadManager.STATUS_SUCCESSFUL);
            Cursor cur = downloadManager.query(query);
            if (cur != null) {
                if (cur.moveToFirst()) {
                    @SuppressLint("Range") String uriString = cur.getString(cur.getColumnIndex(DownloadManager.COLUMN_LOCAL_URI));
                    if (!uriString.isEmpty()) {
                        targetApkFile = Uri.parse(uriString);
                    }
                }
                cur.close();
            }
        }
        return targetApkFile;
    }

    public Uri queryDownloadedApk() {
        return queryDownloadedApk(downloadId);
    }

    public void destroy() {
        if (mContext != null && isRegistReceiver) {
            isRegistReceiver = false;
            mContext.unregisterReceiver(mReceiver);
        }
    }

}