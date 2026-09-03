package com.ruixue.adapter;


import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.utils.StringUtils;

import java.util.List;

public class RegionData implements Comparable<RegionData>, Cloneable {


    @Keep
    private String country_code;

    @Keep
    private String en;

    @Keep
    private int tel;

    public String getTel() {
        return StringUtils.enforceLTR("+" + (tel));
    }

    public int getTelNum() {
        return tel;
    }


    public String getText() {
        return en;
    }

    public void setText(String text) {
        this.en = text;
    }

    public String getCountryCode() {
        return country_code;
    }

    public String getGroupName() {
        return String.valueOf(en.toCharArray()[0]);
    }

    public RegionData(String text) {
        this.en = text;
    }

    public static List<RegionData> fromJson(String json) {
        return new Gson().fromJson(json, new TypeToken<List<RegionData>>() {
        }.getType());
    }

    @Override
    public int compareTo(RegionData o) {
        return en.compareTo(o.en);
    }

    public static int getDefaultTel(List<RegionData> dataList) {
        if (dataList != null) {
            String country = RXGlobalData.COUNTRY;
            for (RegionData regionData : dataList) {
                if (regionData.getCountryCode().equals(country)) {
                    return regionData.getTelNum();
                }
            }
        }
        return 1;
    }

    @Override
    public RegionData clone() {
        try {
            return (RegionData) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
