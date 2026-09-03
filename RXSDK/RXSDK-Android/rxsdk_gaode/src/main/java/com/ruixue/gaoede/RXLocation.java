package com.ruixue.gaoede;

public class RXLocation {
    /**
     * WGS84坐标系
     */
   protected String coordType = "";
    /**
     * 经度
     */
    protected double longitude;
    /**
     * 纬度
     */
    protected double latitude;
    /**
     * 经度
     */
   protected String longitudeStr = "";
    /**
     * 纬度
     */
   protected String latitudeStr = "";
    /**
     * 精度(米)
     */
   protected float accuracy;

    /**
     * 提供者
     */
   protected String provider = "";
    /**
     * 速度(米/秒)
     */
   protected float speed;
    /**
     * 角度
     */
   protected float bearing;
    /**
     * 星    数
     */
   protected int satellites = 0;
    /**
     * 国    家
     */
   protected String country = "";
    /**
     * 省
     */
   protected String province = "";
    /**
     * 市
     */
   protected String city = "";
    /**
     * 城市编码
     */
   protected String cityCode = "";
    /**
     * 区
     */
   protected String district = "";
    /**
     * 区域码
     */
   protected String adCode = "";
    /**
     * 地址
     */
   protected String address = "";
    /**
     * 兴趣点
     */
   protected String poiName = "";
    /**
     * 定位时间
     */
   protected String time = "";

    public String getCoordType() {
        return coordType;
    }

    public void setCoordType(String coordType) {
        this.coordType = coordType;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public String getLongitudeStr() {
        return longitudeStr;
    }

    public void setLongitudeStr(String longitudeStr) {
        this.longitudeStr = longitudeStr;
    }

    public String getLatitudeStr() {
        return latitudeStr;
    }

    public void setLatitudeStr(String latitudeStr) {
        this.latitudeStr = latitudeStr;
    }

    public float getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(float accuracy) {
        this.accuracy = accuracy;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public float getSpeed() {
        return speed;
    }

    public void setSpeed(float speed) {
        this.speed = speed;
    }

    public float getBearing() {
        return bearing;
    }

    public void setBearing(float bearing) {
        this.bearing = bearing;
    }

    public int getSatellites() {
        return satellites;
    }

    public void setSatellites(int satellites) {
        this.satellites = satellites;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCityCode() {
        return cityCode;
    }

    public void setCityCode(String cityCode) {
        this.cityCode = cityCode;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getAdCode() {
        return adCode;
    }

    public void setAdCode(String adCode) {
        this.adCode = adCode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPoiName() {
        return poiName;
    }

    public void setPoiName(String poiName) {
        this.poiName = poiName;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}



