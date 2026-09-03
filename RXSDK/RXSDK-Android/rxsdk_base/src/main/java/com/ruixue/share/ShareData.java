package com.ruixue.share;

import com.google.gson.Gson;
import com.ruixue.utils.EntityUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/7/27
 */
public class ShareData {

    public Map<String, Object> toMap() {
        return EntityUtils.entityToMap(this);
    }

    public JSONObject toJSONObject() {
        try {
            return new JSONObject(new Gson().toJson(this));
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }


    public Map<String, Object> getShareReportData() {
        Map<String, Object> properties = new HashMap<>();
        if (getTrigger()!=null) {
            properties.put("trigger_tag", getTrigger().getTag());
            properties.put("trigger_id", (getTrigger().getId()));
            properties.put("trigger_type", (getTrigger().getType()));
        }
        if (getContent()!=null) {
            properties.put("material_type", getContent().getMaterial_type());
            properties.put("material_id", (getContent().getMaterial_id()));
            properties.put("landing_id", (getContent().getLanding_id()));
        }
        if (getStrategy()!=null) {
            properties.put("strategy_id", (getStrategy().getId()));
            properties.put("strategy_type", (getStrategy().getType()));
            properties.put("region", getStrategy().getRegion());
            properties.put("platform", getStrategy().getPlatform());
        }
        return properties;
    }

    public static ShareData fromJson(String jsonStr) {
        return new Gson().fromJson(jsonStr, ShareData.class);
    }

    public static ShareData fromJson(JSONObject json) {
        if (json != null) {
            return new Gson().fromJson(json.toString(), ShareData.class);
        } else {
            return null;
        }
    }

    protected TriggerBean trigger;

    protected StrategyBean strategy;

    protected ContentBean content;

    protected PlatformsBean platforms;
    protected String identity;
    protected String transmits;

    protected String failed_msg;

    protected Map<String, Object> scheduling;


    public void setTransmits(String transmits) {
        this.transmits = transmits;
    }

    public String getFailedMsg() {
        return failed_msg;
    }

    public Map<String, Object> getScheduling() {
        return scheduling;
    }

    public void setScheduling(Map<String, Object> scheduling) {
        this.scheduling = scheduling;
    }

    public TriggerBean getTrigger() {
        return trigger;
    }

    public StrategyBean getStrategy() {
        return strategy;
    }

    public ContentBean getContent() {
        return content;
    }

    public PlatformsBean getPlatforms() {
        return platforms;
    }

    public String getIdentity() {
        return identity;
    }

    public String getTransmits() {
        return transmits;
    }

    public static class TriggerBean {
        protected int id;
        protected String tag;
        protected int type;
        protected String title;
        protected String failed_msg;

        public int getId() {
            return id;
        }

        public String getTag() {
            return tag;
        }

        public String getTitle() {
            return title;
        }

        public String getFailed_msg() {
            return failed_msg;
        }

        public int getType() {
            return type;
        }
    }

    /*
    "strategy": {
      "id": 81,
      "platform": "wechat",
      "share_type": 1,
      "type": 1,
      "name": "诱导类2",
      "region": "-1",
      "product_id": "1002",
      "channel_id": "100",
      "status": 1
    }
     */
    public static class StrategyBean {
        protected int id;
        protected String platform;
        protected String product_id;
        protected String channel_id;


        private String region;
        private int type;

        public int getId() {
            return id;
        }

        public int getType() {
            return type;
        }

        public String getPlatform() {
            return platform;
        }

        public String getProduct_id() {
            return product_id;
        }

        public String getChannel_id() {
            return channel_id;
        }

        public String getRegion() {
            return region;
        }
    }

    /**
     * "title": "诱导类链接标题", // 标题
     * "url": "https://domain-open.com/youdao?identity=9sz2oNCnR", // 链接
     * "material_type": "link", // 素材类型
     * "material_id": 1, // 素材ID
     * "landing_id": 1, // 落地页ID
     * "image": " ", // 图片地址
     * "content": "诱导类链接文案" // 素材内容
     * "x": 0, // 图片类型时 二维码x轴坐标
     * "y": 0, // 图片类型时 二维码y轴坐标
     * "width": 0, // 图片类型时 二维码宽度
     * "height": 0 // 图片类型时 二维码高度
     */
    public static class ContentBean {
        protected String title;
        protected String url;
        protected String material_type;
        protected String copywriting;
        protected int material_id;
        protected int landing_id;
        protected String image;
        protected String content;
        protected int x;
        protected int y;
        protected int width;
        protected int height;
        protected int meta_source;
        protected List<ImageBean> atlas;

        protected TemplateBean template;

        public void setUrl(String url) {
            this.url = url;
        }

        public String getTitle() {
            return title;
        }

        public String getUrl() {
            return url;
        }

        public String getMaterial_type() {
            return material_type;
        }

        public int getMaterial_id() {
            return material_id;
        }

        public int getLanding_id() {
            return landing_id;
        }

        public String getImage() {
            return image;
        }

        public String getContent() {
            return content;
        }

        public int getX() {
            return x;
        }

        public int getY() {
            return y;
        }

        public int getWidth() {
            return width;
        }

        public int getHeight() {
            return height;
        }

        public List<ImageBean> getAtlas() {
            return atlas;
        }

        public TemplateBean getTemplate() {
            return template;
        }
    }

    public static class TemplateBean {
        protected String template_id;
        protected List<String> images;
        protected List<String> contents;
        protected List<String> audios;

        public String getTemplate_id() {
            return template_id;
        }

        public List<String> getImages() {
            return images;
        }

        public List<String> getContents() {
            return contents;
        }

        public List<String> getAudios() {
            return audios;
        }
    }

    public static class ImageBean {
        protected String image_url;
        protected String landing_url;
        protected int width;
        protected int height;
        protected int x;
        protected int y;

        public String getImage_url() {
            return image_url;
        }

        public String getLanding_url() {
            return landing_url;
        }

        public int getWidth() {
            return width;
        }

        public int getHeight() {
            return height;
        }

        public int getX() {
            return x;
        }

        public int getY() {
            return y;
        }
    }

    public static class PlatformsBean {
        public int wechat;
    }

}
