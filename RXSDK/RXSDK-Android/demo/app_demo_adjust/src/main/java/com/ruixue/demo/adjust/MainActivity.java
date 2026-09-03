package com.ruixue.demo.adjust;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import com.ruixue.sdk.adjust.AdjustSdkWrapper;
import com.ruixue.sdk.adjust.callback.OnRxDeviceIdsRead;
import com.ruixue.sdk.adjust.config.RxAdjustEvent;
import com.ruixue.sdk.adjust.data.RxAdjustAdRevenue;
import com.ruixue.sdk.adjust.data.RxAdjustPlayStoreSubscription;
import com.ruixue.sdk.adjust.data.RxAdjustThirdPartySharing;

public class MainActivity extends AppCompatActivity {

    private final String TAG = MainActivity.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        findViewById(R.id.btn_trace_event).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("36il0v");
                AdjustSdkWrapper.getInstance().trackEvent(rxAdjustEvent);
            }
        });

        findViewById(R.id.btn_revenue_trace_event).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("cshuun");
                rxAdjustEvent.setRevenue(0.01,"EUR");
                AdjustSdkWrapper.getInstance().trackEvent(rxAdjustEvent);
            }
        });

        findViewById(R.id.btn_orderid_trace_event).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("abc123");
                rxAdjustEvent.setRevenue(0.01,"EUR");
                rxAdjustEvent.setOrderId("{OrderId}");
                AdjustSdkWrapper.getInstance().trackEvent(rxAdjustEvent);
            }
        });

        findViewById(R.id.btn_parameter_trace_event).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("kmgq59");
                rxAdjustEvent.addCallbackParameter("key","value");
                rxAdjustEvent.addCallbackParameter("foo","bar");
                AdjustSdkWrapper.getInstance().trackEvent(rxAdjustEvent);
            }
        });

        findViewById(R.id.btn_parter_parameter_trace_event).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("abc123");
                rxAdjustEvent.addPartnerParameter("key","value");
                rxAdjustEvent.addPartnerParameter("foo","bar");
                AdjustSdkWrapper.getInstance().trackEvent(rxAdjustEvent);
            }
        });

        findViewById(R.id.btn_callbackid_trace_event).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("abc123");
                rxAdjustEvent.setCallbackId("Your-Custom-Id");
                AdjustSdkWrapper.getInstance().trackEvent(rxAdjustEvent);
            }
        });

        findViewById(R.id.btn_add_session_callback_parameter).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AdjustSdkWrapper.getInstance().addSessionCallbackParameter("foo", "bar");
            }
        });

        findViewById(R.id.btn_remove_session_callback_parameter).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AdjustSdkWrapper.getInstance().removeSessionCallbackParameter("foo");
            }
        });

        findViewById(R.id.btn_reset_session_callback_parameter).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AdjustSdkWrapper.getInstance().resetSessionCallbackParameters();
            }
        });

        findViewById(R.id.btn_add_session_partner_parameter).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AdjustSdkWrapper.getInstance().addSessionPartnerParameter("foo", "bar");
            }
        });

        findViewById(R.id.btn_remove_session_partner_parameter).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AdjustSdkWrapper.getInstance().removeSessionPartnerParameter("foo");
            }
        });

        findViewById(R.id.btn_reset_session_partner_parameter).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AdjustSdkWrapper.getInstance().resetSessionPartnerParameters();
            }
        });

        findViewById(R.id.btn_send_first_packages).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                AdjustSdkWrapper.getInstance().sendFirstPackages();
            }
        });

        findViewById(R.id.btn_needscost).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

            }
        });

        findViewById(R.id.btn_attribution).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AdjustSdkWrapper.getInstance().getAttribution();
            }
        });

        findViewById(R.id.btn_offline_enables).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AdjustSdkWrapper.getInstance().setOfflineMode(true);
            }
        });

        findViewById(R.id.btn_offline_idsables).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AdjustSdkWrapper.getInstance().setOfflineMode(false);
            }
        });

        findViewById(R.id.btn_forget_me).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AdjustSdkWrapper.getInstance().gdprForgetMe(MainActivity.this);
            }
        });

        findViewById(R.id.btn_thirdParty_disable).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustThirdPartySharing adjustThirdPartySharing = new RxAdjustThirdPartySharing(false);
                AdjustSdkWrapper.getInstance().trackThirdPartySharing(adjustThirdPartySharing);
            }
        });

        findViewById(R.id.btn_thirdParty_enable).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustThirdPartySharing adjustThirdPartySharing = new RxAdjustThirdPartySharing(true);
                AdjustSdkWrapper.getInstance().trackThirdPartySharing(adjustThirdPartySharing);
            }
        });

        findViewById(R.id.btn_granular_option).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustThirdPartySharing adjustThirdPartySharing = new RxAdjustThirdPartySharing(null);
                adjustThirdPartySharing.addGranularOption("PartnerA", "foo", "bar");
                AdjustSdkWrapper.getInstance().trackThirdPartySharing(adjustThirdPartySharing);
            }
        });

        findViewById(R.id.btn_thirdPartyshare_yes).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustThirdPartySharing adjustThirdPartySharing = new RxAdjustThirdPartySharing(null);
                adjustThirdPartySharing.addPartnerSharingSetting("PartnerA", "install", true);
                adjustThirdPartySharing.addPartnerSharingSetting("PartnerA", "events", false);
                adjustThirdPartySharing.addPartnerSharingSetting("PartnerA", "sessions", false);
                AdjustSdkWrapper.getInstance().trackThirdPartySharing(adjustThirdPartySharing);
            }
        });

        findViewById(R.id.btn_thirdPartyshare_analytics).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustThirdPartySharing adjustThirdPartySharing = new RxAdjustThirdPartySharing(null);
                adjustThirdPartySharing.addPartnerSharingSetting("PartnerA", "install", true);
                adjustThirdPartySharing.addPartnerSharingSetting("PartnerA", "events", false);
                adjustThirdPartySharing.addPartnerSharingSetting("PartnerA", "sessions", false);
                AdjustSdkWrapper.getInstance().trackThirdPartySharing(adjustThirdPartySharing);
            }
        });

        findViewById(R.id.btn_thirdPartyshare_deny).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustThirdPartySharing adjustThirdPartySharing = new RxAdjustThirdPartySharing(null);
                adjustThirdPartySharing.addPartnerSharingSetting("PartnerA", "install", false);
                adjustThirdPartySharing.addPartnerSharingSetting("PartnerA", "events", false);
                adjustThirdPartySharing.addPartnerSharingSetting("PartnerA", "sessions", false);
                AdjustSdkWrapper.getInstance().trackThirdPartySharing(adjustThirdPartySharing);
            }
        });

        findViewById(R.id.btn_granular_limit).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustThirdPartySharing tps = new RxAdjustThirdPartySharing(null);
                tps.addGranularOption("facebook", "data_processing_options_country", "1");
                tps.addGranularOption("facebook", "data_processing_options_state", "1000");
                AdjustSdkWrapper.getInstance().trackThirdPartySharing(tps);
            }
        });

        findViewById(R.id.btn_measurement_consent).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AdjustSdkWrapper.getInstance().trackMeasurementConsent(true);
            }
        });

        findViewById(R.id.btn_track_adrevenue).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustAdRevenue rxAdjustAdRevenue = new RxAdjustAdRevenue("test");
                rxAdjustAdRevenue.setRevenue(1.6, "USD");
                AdjustSdkWrapper.getInstance().trackAdRevenue(rxAdjustAdRevenue);
            }
        });

        findViewById(R.id.btn_playstore_subscription).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RxAdjustPlayStoreSubscription subscription = new RxAdjustPlayStoreSubscription(
                        1,
                        "xxx",
                        "test",
                        "test",
                        "test",
                        "test");
                subscription.setPurchaseTime(10L);

                subscription.addCallbackParameter("key","value");
                subscription.addCallbackParameter("foo","bar");

                subscription.addPartnerParameter("key","value");
                subscription.addPartnerParameter("foo","bar");

                AdjustSdkWrapper.getInstance().trackPlayStoreSubscription(subscription);
            }
        });

        findViewById(R.id.btn_google_adidread).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AdjustSdkWrapper.getInstance().getGoogleAdId(MainActivity.this, new OnRxDeviceIdsRead() {
                    @Override
                    public void onGoogleAdIdRead(String googleAdId) {
                        Log.d(TAG, "onGoogleAdIdRead:" + googleAdId);
                    }
                });
            }
        });
        findViewById(R.id.btn_amazonadid).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String amazonAdId = AdjustSdkWrapper.getInstance().getAmazonAdId(MainActivity.this);
                Log.d(TAG, "amazonAdId:" + amazonAdId);
            }
        });

        findViewById(R.id.btn_adid).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String adid = AdjustSdkWrapper.getInstance().getAdid();
                Log.d(TAG, "adid:" + adid);
            }
        });

        findViewById(R.id.btn_push_token).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AdjustSdkWrapper.getInstance().setPushToken("test",MainActivity.this);
            }
        });

        findViewById(R.id.btn_stop_adjust).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AdjustSdkWrapper.getInstance().setEnabled(false);
            }
        });

        Uri uri = AdjustSdkWrapper.getInstance().getData(getIntent());
        if (uri != null) {
            Log.d(TAG, "onCreate deep link:" + uri.toString());

            AdjustSdkWrapper.getInstance().appWillOpenUrl(uri, getApplicationContext());

            AdjustSdkWrapper.getInstance().resolveLink(
                    uri.toString(),
                    new String[]{"example.com"},
                    getApplicationContext()
            );
        }

    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Uri uri = AdjustSdkWrapper.getInstance().getData(intent);
        if (uri != null) {
            Log.d(TAG, "onCreate deep link:" + uri.toString());
            AdjustSdkWrapper.getInstance().appWillOpenUrl(uri, getApplicationContext());
            AdjustSdkWrapper.getInstance().resolveLink(
                    uri.toString(),
                    new String[]{"example.com"},
                    getApplicationContext()
            );
        }
    }
}