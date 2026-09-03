package com.ruixue.sdk.adjust.data;


import com.adjust.sdk.AdjustThirdPartySharing;

import java.util.HashMap;
import java.util.Map;
public class RxAdjustThirdPartySharing {
    Boolean isEnabled;
    Map<String, Map<String, String>> granularOptions;
    Map<String, Map<String, Boolean>> partnerSharingSettings;

    public RxAdjustThirdPartySharing(final Boolean isEnabled) {
        this.isEnabled = isEnabled;
        granularOptions = new HashMap<>();
        partnerSharingSettings = new HashMap<>();
    }

    public void addGranularOption(final String partnerName,
                                  final String key,
                                  final String value)
    {
        Map<String, String> partnerOptions = granularOptions.get(partnerName);
        if (partnerOptions == null) {
            partnerOptions = new HashMap<>();
            granularOptions.put(partnerName, partnerOptions);
        }
        partnerOptions.put(key, value);
    }

    public void addPartnerSharingSetting(final String partnerName,
                                         final String key,
                                         final boolean value)
    {
        Map<String, Boolean> partnerSharingSetting = this.partnerSharingSettings.get(partnerName);
        if (partnerSharingSetting == null) {
            partnerSharingSetting = new HashMap<>();
            partnerSharingSettings.put(partnerName, partnerSharingSetting);
        }
        partnerSharingSetting.put(key, value);
    }

    public Boolean getEnabled() {
        return isEnabled;
    }

    public Map<String, Map<String, String>> getGranularOptions() {
        return granularOptions;
    }

    public Map<String, Map<String, Boolean>> getPartnerSharingSettings() {
        return partnerSharingSettings;
    }
    public static AdjustThirdPartySharing copy(RxAdjustThirdPartySharing rxAdjustThirdPartySharing) {
        AdjustThirdPartySharing adjustThirdPartySharing = new AdjustThirdPartySharing(rxAdjustThirdPartySharing.getEnabled());
        Map<String, Map<String, String>> granularOptionsMap
                = rxAdjustThirdPartySharing.getGranularOptions();
        for (String key : granularOptionsMap.keySet()) {
            Map<String, String> subMap = granularOptionsMap.get(key);
            if (subMap != null) {
                for (String subKey : subMap.keySet()) {
                    adjustThirdPartySharing.addGranularOption(key, subKey, subMap.get(subKey));
                }
            }

        }
        Map<String, Map<String, Boolean>> partnerSharingSettings
                = rxAdjustThirdPartySharing.getPartnerSharingSettings();
        for (String key : partnerSharingSettings.keySet()) {
            Map<String, Boolean> subMap = partnerSharingSettings.get(key);
            if (subMap != null) {
                for (String subKey : subMap.keySet()) {
                    boolean subMapVal = Boolean.TRUE.equals(subMap.get(subKey));
                    adjustThirdPartySharing.addPartnerSharingSetting(key, subKey, subMapVal);
                }
            }
        }
        return adjustThirdPartySharing;
    }
}
