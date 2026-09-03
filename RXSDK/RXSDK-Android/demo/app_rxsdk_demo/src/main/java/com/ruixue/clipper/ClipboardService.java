package com.ruixue.clipper;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;

import android.util.Log;

public class ClipboardService extends IntentService {
    private static String TAG = "ClipboardService";

    public ClipboardService() {
        super("ClipboardService");
    }

    /* Define service as sticky so that it stays in background */
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        super.onStartCommand(intent, flags, startId);
        return START_STICKY;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        // start itself to ensure our broadcast receiver is active
        Log.d(TAG, "Start clipboard service.");


//    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
//        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
//        NotificationChannel channel = null;
//        channel = new NotificationChannel(CHANNEL_ID_STRING, getString(R.string.app_name), NotificationManager.IMPORTANCE_HIGH);
//        notificationManager.createNotificationChannel(channel);
//        Notification notification = new Notification.Builder(getApplicationContext(), CHANNEL_ID_STRING).build();
//        startForeground(1, notification);

        startService(new Intent(getApplicationContext(), ClipboardService.class));
    }

    /**
     * The IntentService calls this method from the default worker thread with
     * the intent that started the service. When this method returns, IntentService
     * stops the service, as appropriate.
     */
    @Override
    protected void onHandleIntent(Intent intent) {
        Log.d(TAG, "receive task onHandleIntent:");
    }

    @Override
    public void onDestroy() {
        Log.i(TAG, "onDestroy");
    }
}