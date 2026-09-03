package com.ruixue.demo.firebase;

import static com.google.firebase.messaging.Constants.MessagePayloadKeys.SENDER_ID;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.RemoteMessage;
import com.ruixue.sdk.firebase.FirebaseSdkWrapper;
import com.ruixue.sdk.firebase.config.RxFirebaseAnalytics;
import com.ruixue.sdk.firebase.data.RxCustomKeysAndValues;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        if (getIntent().getExtras() != null) {
            for (String key : getIntent().getExtras().keySet()) {
                Object value = getIntent().getExtras().get(key);
                Log.d("message-onCreate", "Key: " + key + " Value: " + value);
            }
        }

        FirebaseSdkWrapper.getInstance().initFirebaseAnalytics(this);

        findViewById(R.id.btn_log_event).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Bundle bundle = new Bundle();
                bundle.putString(RxFirebaseAnalytics.Param.METHOD, "sign");
                FirebaseSdkWrapper.getInstance().getFirebaseAnalytics().logEvent(
                        RxFirebaseAnalytics.Event.SIGN_UP,
                        bundle
                );
            }
        });

        findViewById(R.id.btn_default_event).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Bundle parameters = new Bundle();
                parameters.putString("level_name", "Caverns01");
                parameters.putInt("level_difficulty", 4);
                FirebaseSdkWrapper.getInstance().getFirebaseAnalytics().setDefaultEventParameters(parameters);
            }
        });

        findViewById(R.id.btn_user_property).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseSdkWrapper.getInstance().getFirebaseAnalytics().setUserProperty("favorite_food", "food");
            }
        });

        findViewById(R.id.btn_user_id).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseSdkWrapper.getInstance().getFirebaseAnalytics().setAnalyticsUserId("123456");
            }
        });

        findViewById(R.id.btn_collection_enabled).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseSdkWrapper.getInstance().getFirebaseAnalytics().setAnalyticsCollectionEnabled(true);
            }
        });

        findViewById(R.id.btn_test_crash).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                throw new IllegalArgumentException("Test Crash"); // Force a crash
            }
        });

        findViewById(R.id.btn_custom_key).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseSdkWrapper.getInstance().getFirebaseCrashlytics().setCustomKey("my_string_key", "foo");
            }
        });

        findViewById(R.id.btn_custom_keys).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxCustomKeysAndValues keysAndValues = new RxCustomKeysAndValues.Builder()
                        .putString("string key", "string value")
                        .putString("string key 2", "string  value 2")
                        .putBoolean("boolean key", true)
                        .putBoolean("boolean key 2", false)
                        .putFloat("float key", 1.01f)
                        .putFloat("float key 2", 2.02f)
                        .build();
                FirebaseSdkWrapper.getInstance().getFirebaseCrashlytics().setCustomKeys(keysAndValues);
            }
        });

        findViewById(R.id.btn_log).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseSdkWrapper.getInstance().getFirebaseCrashlytics().log("message");
            }
        });

        findViewById(R.id.btn_crash_user_id).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseSdkWrapper.getInstance().getFirebaseCrashlytics().setCrashUserId("user123456789");
            }
        });

        findViewById(R.id.btn_report_exception).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    throw new RuntimeException("Test Crash");
                } catch (Exception e) {
                    FirebaseSdkWrapper.getInstance().getFirebaseCrashlytics().recordException(e);
                }
            }
        });

        findViewById(R.id.btn_crash_collection_enabled).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseSdkWrapper.getInstance().getFirebaseCrashlytics().setCrashlyticsCollectionEnabled(true);
            }
        });

        findViewById(R.id.btn_get_token).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseSdkWrapper.getInstance().getFirebaseMessaging().getToken(new OnCompleteListener() {
                    @Override
                    public void onComplete(@NonNull Task task) {
                        Log.d("firebase-message", "getToken:" + task.toString());
                    }
                });
            }
        });

        findViewById(R.id.btn_autoinit_enabled).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseSdkWrapper.getInstance().getFirebaseMessaging().setAutoInitEnabled(true);
            }
        });

        findViewById(R.id.btn_subscrib_totopic).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseSdkWrapper.getInstance().getFirebaseMessaging().subscribeToTopic("weather", new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        Log.d("firebase-message", "subscrib: " + task.toString());
                    }
                });
            }
        });

        findViewById(R.id.btn_send).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RemoteMessage remoteMessage =
                        new RemoteMessage.Builder(SENDER_ID + "@fcm.googleapis.com")
                        .setMessageId(Integer.toString(1111))
                        .addData("my_message", "Hello World")
                        .addData("my_action","SAY_HELLO")
                        .build();
                FirebaseSdkWrapper.getInstance().getFirebaseMessaging().send(remoteMessage);
            }
        });
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (intent.getExtras() != null) {
            for (String key : intent.getExtras().keySet()) {
                Object value = intent.getExtras().get(key);
                Log.d("message-onNewIntentt", "Key: " + key + " Value: " + value);
            }
        }

    }
}