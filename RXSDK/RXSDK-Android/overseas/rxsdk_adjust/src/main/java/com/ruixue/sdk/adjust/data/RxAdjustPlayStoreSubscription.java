package com.ruixue.sdk.adjust.data;

import com.adjust.sdk.AdjustPlayStoreSubscription;

import java.util.LinkedHashMap;
import java.util.Map;
public class RxAdjustPlayStoreSubscription {
    private long price;             // [M] revenue
    private String currency;        // [M] currency
    private String sku;             // [M] product_id
    private String orderId;         // [M] transaction_id
    private String signature;       // [M] receipt
    private String purchaseToken;   // [M] purchase_token
    private String billingStore;    // [M] billing_store
    private long purchaseTime;      // [O] transaction_date
    private Map<String, String> callbackParameters; // [O] callback_params
    private Map<String, String> partnerParameters;  // [O] partner_params

    public RxAdjustPlayStoreSubscription(final long price,
                                       final String currency,
                                       final String sku,
                                       final String orderId,
                                       final String signature,
                                       final String purchaseToken) {
        this.price = price;
        this.currency = currency;
        this.sku = sku;
        this.orderId = orderId;
        this.signature = signature;
        this.purchaseToken = purchaseToken;

        // default values
        this.purchaseTime = -1;
        this.billingStore = "GooglePlay";
    }

    long getPrice() {
        return price;
    }

    long getPurchaseTime() {
        return purchaseTime;
    }

    String getCurrency() {
        return currency;
    }

    String getSku() {
        return sku;
    }

    String getOrderId() {
        return orderId;
    }

    String getSignature() {
        return signature;
    }

    String getBillingStore() {
        return billingStore;
    }

    String getPurchaseToken() {
        return purchaseToken;
    }

    Map<String, String> getCallbackParameters() {
        return callbackParameters;
    }

    Map<String, String> getPartnerParameters() {
        return partnerParameters;
    }

    public void setPurchaseTime(final long purchaseTime) {
        this.purchaseTime = purchaseTime;
    }

    public void addCallbackParameter(String key, String value) {
        if (callbackParameters == null) {
            callbackParameters = new LinkedHashMap<String, String>();
        }
        String previousValue = callbackParameters.put(key, value);
    }

    public void addPartnerParameter(String key, String value) {
        if (partnerParameters == null) {
            partnerParameters = new LinkedHashMap<String, String>();
        }

        String previousValue = partnerParameters.put(key, value);
    }

    public static AdjustPlayStoreSubscription copy(RxAdjustPlayStoreSubscription rxAdjustPlayStoreSubscription) {
        AdjustPlayStoreSubscription adjustPlayStoreSubscription = new AdjustPlayStoreSubscription(
                rxAdjustPlayStoreSubscription.price,
                rxAdjustPlayStoreSubscription.currency,
                rxAdjustPlayStoreSubscription.sku,
                rxAdjustPlayStoreSubscription.orderId,
                rxAdjustPlayStoreSubscription.signature,
                rxAdjustPlayStoreSubscription.purchaseToken

        );
        adjustPlayStoreSubscription.setPurchaseTime(rxAdjustPlayStoreSubscription.purchaseTime);
        if (rxAdjustPlayStoreSubscription.callbackParameters != null) {
            for (String key : rxAdjustPlayStoreSubscription.callbackParameters.keySet()) {
                adjustPlayStoreSubscription.addCallbackParameter(
                        key, rxAdjustPlayStoreSubscription.callbackParameters.get(key)
                );
            }
        }
        if (rxAdjustPlayStoreSubscription.partnerParameters != null) {
            for (String key : rxAdjustPlayStoreSubscription.partnerParameters.keySet()) {
                adjustPlayStoreSubscription.addPartnerParameter(
                        key, rxAdjustPlayStoreSubscription.partnerParameters.get(key)
                );
            }
        }
        return adjustPlayStoreSubscription;
    }
}
