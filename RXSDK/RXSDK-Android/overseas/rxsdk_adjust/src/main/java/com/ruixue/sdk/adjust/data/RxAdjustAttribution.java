package com.ruixue.sdk.adjust.data;

import com.adjust.sdk.AdjustAttribution;
import com.adjust.sdk.Util;

public class RxAdjustAttribution {
    public String trackerToken;
    public String trackerName;
    public String network;
    public String campaign;
    public String adgroup;
    public String creative;
    public String clickLabel;
    public String adid;
    public String costType;
    public Double costAmount;
    public String costCurrency;
    public String fbInstallReferrer;

    public RxAdjustAttribution(String trackerToken, String trackerName, String network,
                               String campaign, String adgroup, String creative, String clickLabel,
                               String adid, String costType, Double costAmount, String costCurrency,
                               String fbInstallReferrer) {
        this.trackerToken = trackerToken;
        this.trackerName = trackerName;
        this.network = network;
        this.campaign = campaign;
        this.adgroup = adgroup;
        this.creative = creative;
        this.clickLabel = clickLabel;
        this.adid = adid;
        this.costType = costType;
        this.costAmount = costAmount;
        this.costCurrency = costCurrency;
        this.fbInstallReferrer = fbInstallReferrer;
    }

    @Override
    public String toString() {
        return Util.formatString(
                "tt:%s tn:%s net:%s cam:%s adg:%s cre:%s cl:%s adid:%s ct:%s ca:%.2f cc:%s fir:%s",
                trackerToken, trackerName, network, campaign, adgroup, creative, clickLabel,
                adid, costType, costAmount, costCurrency, fbInstallReferrer);
    }

    public static RxAdjustAttribution copy(AdjustAttribution attribution) {
        return new RxAdjustAttribution(attribution.trackerToken, attribution.trackerName, attribution.network,
                attribution.campaign, attribution.adgroup, attribution.creative, attribution.clickLabel,
                attribution.adid, attribution.costType, attribution.costAmount, attribution.costCurrency,
                attribution.fbInstallReferrer);
    }

}
