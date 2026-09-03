package com.ruixue.share;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */
public final class PlatformSns {
    public String getKeyword() {
        return mKeyword;
    }

    public void setKeyword(String mKeyword) {
        this.mKeyword = mKeyword;
    }

    public String getShowWord() {
        return mShowWord;
    }

    public void setShowWord(String mShowWord) {
        this.mShowWord = mShowWord;
    }

    public String getIcon() {
        return mIcon;
    }

    public void setIcon(String mIcon) {
        this.mIcon = mIcon;
    }

    public String getGrayIcon() {
        return mGrayIcon;
    }

    public void setGrayIcon(String mGrayIcon) {
        this.mGrayIcon = mGrayIcon;
    }

    public int getIndex() {
        return mIndex;
    }

    public void setIndex(int mIndex) {
        this.mIndex = mIndex;
    }

    public PlatformType getPlatform() {
        return mPlatform;
    }

    /**
     * 唯一标识
     */
    public String mKeyword;
    /**
     * 显示内容
     */
    public String mShowWord;
    /**
     * icon
     */
    public String mIcon;
    /**
     * 灰色 icon
     */
    public String mGrayIcon;
    public int mIndex;
    public final PlatformType mPlatform;

    public PlatformSns(String enumStr) {
        this.mPlatform = PlatformType.toEnum(enumStr);
        init();
    }

    public PlatformSns(PlatformType platformType) {
        this.mPlatform = platformType;
        init();
    }

    public void init() {
        this.mKeyword = this.mPlatform.getKeyword();
        this.mShowWord = this.mPlatform.getShowWord();
        this.mIcon = this.mPlatform.getIcon();
        this.mGrayIcon = this.mPlatform.getIcon();
        this.mIndex = 0;
    }

    /**
     * 创建自定义类型
     * @param showWord 显示名称
     * @param keyword 唯一标识名称
     * @param icon icon res name
     * @param grayIcon 灰色 icon res name
     * @return
     */
    public static PlatformSns create(String showWord, String keyword, String icon, String grayIcon, int index) {
        PlatformSns snsPlatform = new PlatformSns(PlatformType.NONE);
        snsPlatform.mShowWord = showWord;
        snsPlatform.mIcon = icon;
        snsPlatform.mGrayIcon = grayIcon;
        snsPlatform.mIndex = index;
        snsPlatform.mKeyword = keyword;
        return snsPlatform;
    }

   public static PlatformSns create(PlatformType platformType) {
        return new PlatformSns(platformType);
    }

}