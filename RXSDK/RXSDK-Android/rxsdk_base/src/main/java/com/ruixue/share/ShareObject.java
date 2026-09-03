package com.ruixue.share;

import android.text.TextUtils;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;

import com.ruixue.utils.EntityUtils;


import java.util.Map;

@SuppressWarnings("unused")
@Keep
public class ShareObject {

//    {"title":"sdf","url":"https://domain-open.com/chengjiulei?identity=lCqMu9g4R","material_type":"link","material_id":9,"landing_id":2,"image":"https://rxfile.weilekuiming.com/share/2022/07/18/1658136314471_33201650360357_.pic.jpg","content":"sdfsdf"}
    /**
     * {@link PlatformType#getKeyword()}
     */
    @Keep
    protected String platform = PlatformType.WECHAT.getKeyword();

    @Keep
    protected @ShareScene int shareScene;
    @ShareMediaType
    @Keep
    protected String material_type;

    @Keep
    protected String title;

    @Keep
    protected String content;

    @Keep
    protected String image;
    @Keep
    protected String url;

    @Keep
    protected int x;
    @Keep
    protected int y;
    @Keep
    protected int width;


    @Keep
    protected int height;

    @Keep
    protected int wh;


    @Keep
    private String package_name;

    @Keep
    private String class_name;


    private Boolean force_user_system_chooser = Boolean.TRUE;

    @Keep
    private int border_size;

    public int getBorderSize() {
        return border_size;
    }

    public void setBorderSize(int border_size) {
        this.border_size = border_size;
    }

    public String getPackageName() {
        return package_name;
    }

    public void setForceUserSystemChooser(Boolean force_user_system_chooser) {
        this.force_user_system_chooser = force_user_system_chooser;
    }

    public Boolean getForceUserSystemChooser() {
        return force_user_system_chooser;
    }

    public String getClassName() {
        return class_name;
    }

    @Keep
    public void setPlatform(String platform) {
        this.platform = platform;
    }

    @Keep
    public void setType(String type) {
        this.material_type = type;
    }

    @Keep
    public void setShareScene(int shareScene) {
        this.shareScene = shareScene;
    }

    @Keep
    public void setTitle(String title) {
        this.title = title;
    }

    @Keep
    public void setDescription(String description) {
        this.content = description;
    }

    @Keep
    public void setImage(String image) {
        this.image = image;
    }

    @Keep
    public void setUrl(String url) {
        this.url = url;
    }

    @Keep
    public void setX(int x) {
        this.x = x;
    }

    @Keep
    public void setY(int y) {
        this.y = y;
    }

    @Keep
    public void setWidth(int width) {
        this.width = width;
    }

    @Keep
    public void setHeight(int height) {
        this.height = height;
    }

    @Keep
    public boolean isNotEmpty(String value) {
        return !TextUtils.isEmpty(value);
    }

    @Keep
    public boolean checkShareParam() {
        return isNotEmpty(this.material_type);
    }

    @Keep
    public String getPlatform() {
        return platform;
    }


    /**
     * {@link ShareMediaType} 分享material素材类型 url 分享链接 image 分享图片 a2m app分享至小游戏 text 分享文本 card 小卡片
     */
    @NonNull
    @Keep
    public String getType() {
        return material_type;
    }

    /**
     * 分享场景 {@link ShareScene}
     */
    @Keep
    public int getShareScene() {
        return shareScene;
    }

    /**
     * 标题
     */
    @Keep
    public String getTitle() {
        return title;
    }

    /**
     * 描述
     */
    @Keep
    public String getDescription() {
        return content;
    }

    /**
     * 分享的图片或icon 地址
     */
    @Keep
    public String getImage() {
        return image;
    }

    /**
     * 分享的链接地址 或 分享图片类型时生成二维码
     */
    @Keep
    public String getUrl() {
        return url;
    }


    /**
     * 二维码左上角坐标 x
     */
    @Keep
    public int getX() {
        return x;
    }

    /**
     * 二维码左上角坐标 y
     */
    @Keep
    public int getY() {
        return y;
    }

    /**
     * 尺寸 宽高不一致时取最大
     */
    @Keep
    protected int getWh() {
        return wh <= 0 ? Math.max(width, height) : wh;
    }

    @Keep
    public int getWidth() {
        return width <= 0 ? wh : width;
    }

    @Keep
    public int getHeight() {
        return height <= 0 ? wh : height;
    }

    @Keep
    public ShareObject() {
    }

    @Keep
    public Map<String, Object> toMap() {
        return EntityUtils.entityToMap(this);
    }

    @Keep
    public static ShareObject fromMap(Map<String, Object> mapObj) {
        return EntityUtils.mapToEntity(mapObj, ShareObject.class);
    }
}
