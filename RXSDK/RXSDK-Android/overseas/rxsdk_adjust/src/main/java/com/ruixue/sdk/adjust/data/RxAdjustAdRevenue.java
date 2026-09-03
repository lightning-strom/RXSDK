package com.ruixue.sdk.adjust.data;

import com.adjust.sdk.AdjustAdRevenue;

import java.util.LinkedHashMap;
import java.util.Map;
public class RxAdjustAdRevenue {

    public String source;
    public Double revenue;
    public String currency;
    public Integer adImpressionsCount;
    public String adRevenueNetwork;
    public String adRevenueUnit;
    public String adRevenuePlacement;
    public Map<String, String> callbackParameters;
    public Map<String, String> partnerParameters;

    public RxAdjustAdRevenue(final String source) {
        if (!isValidSource(source)) {
            return;
        }

        this.source = source;
    }

    public void setRevenue(final Double revenue, final String currency) {
        this.revenue = revenue;
        this.currency = currency;
    }

    public void setAdImpressionsCount(final Integer adImpressionsCount) {
        this.adImpressionsCount = adImpressionsCount;
    }

    public void setAdRevenueNetwork(final String adRevenueNetwork) {
        this.adRevenueNetwork = adRevenueNetwork;
    }

    public void setAdRevenueUnit(final String adRevenueUnit) {
        this.adRevenueUnit = adRevenueUnit;
    }

    public void setAdRevenuePlacement(final String adRevenuePlacement) {
        this.adRevenuePlacement = adRevenuePlacement;
    }

    public void addCallbackParameter(final String key, final String value) {
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

    public boolean isValid() {
        return isValidSource(this.source);
    }

    private boolean isValidSource(final String param) {
        if (param == null) {
            return false;
        }
        if (param.isEmpty()) {
            return false;
        }
        return true;
    }

    public static AdjustAdRevenue copy(RxAdjustAdRevenue rxAdjustAdRevenue) {
        AdjustAdRevenue adjustAdRevenue = new AdjustAdRevenue(rxAdjustAdRevenue.source);
        adjustAdRevenue.setRevenue(rxAdjustAdRevenue.revenue, rxAdjustAdRevenue.currency);
        adjustAdRevenue.setAdImpressionsCount(rxAdjustAdRevenue.adImpressionsCount);
        adjustAdRevenue.setAdRevenueNetwork(rxAdjustAdRevenue.adRevenueNetwork);
        adjustAdRevenue.setAdRevenueUnit(rxAdjustAdRevenue.adRevenueUnit);
        adjustAdRevenue.setAdRevenuePlacement(rxAdjustAdRevenue.adRevenuePlacement);
        if (rxAdjustAdRevenue.callbackParameters != null) {
            for (String key : rxAdjustAdRevenue.callbackParameters.keySet()) {
                adjustAdRevenue.addCallbackParameter(key, rxAdjustAdRevenue.callbackParameters.get(key));
            }
        }
        if (rxAdjustAdRevenue.partnerParameters != null) {
            for (String key : rxAdjustAdRevenue.partnerParameters.keySet()) {
                adjustAdRevenue.addPartnerParameter(key, rxAdjustAdRevenue.partnerParameters.get(key));
            }
        }
        return adjustAdRevenue;
    }
}
