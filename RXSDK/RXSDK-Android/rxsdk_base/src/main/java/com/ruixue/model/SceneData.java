package com.ruixue.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2025/1/4
 */
public class SceneData implements Serializable {
    @SerializedName("id")
    private Integer id; // 场景主键 ID
    @SerializedName("name")
    private String name; // 场景名称，可能存在重复值
    @SerializedName("tag")
    private String tag; // 场景标识，项目内唯一
    @SerializedName("button_list")
    private List<ButtonListBean> buttonList; // 按钮配置列表，描述场景中的触发按钮信息

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getTag() {
        return tag;
    }

    public List<ButtonListBean> getButtonList() {
        return buttonList;
    }

    public static class ButtonListBean implements Serializable {
        @SerializedName("description")
        private String description; // 按钮描述信息
        @SerializedName("name")
        private String name; // 按钮名称
        @SerializedName("tag")
        private String tag; // 按钮标识
        @SerializedName("type")
        private Integer type; // 按钮类型，0: 点击触发，1: 自动触发
        @SerializedName("window_list")
        private List<WindowListBean> windowList; // 关联窗口列表

        public String getDescription() {
            return description;
        }

        public String getName() {
            return name;
        }

        public String getTag() {
            return tag;
        }

        public Integer getType() {
            return type;
        }

        public List<WindowListBean> getWindowList() {
            return windowList;
        }

        public static class WindowListBean implements Serializable {
            @SerializedName("id")
            private Integer id; // 窗口主键 ID
            @SerializedName("name")
            private String name; // 窗口名称
            @SerializedName("tag")
            private String tag; // 窗口标识
            @SerializedName("version")
            private String version; // 窗口版本
            @SerializedName("gift_list")
            private List<GiftListBean> giftList; // 礼包列表，描述窗口中包含的礼包

            public Integer getId() {
                return id;
            }

            public String getName() {
                return name;
            }

            public String getTag() {
                return tag;
            }

            public String getVersion() {
                return version;
            }

            public List<GiftListBean> getGiftList() {
                return giftList;
            }

            public static class GiftListBean implements Serializable {
                @SerializedName("amount")
                private Integer amount; // 礼包价格
                @SerializedName("buy_type")
                private BuyTypeBean buyType; // 购买介质信息
                @SerializedName("goods")
                private GoodsBean goods; // 计费点信息
                @SerializedName("id")
                private Integer id; // 礼包主键 ID
                @SerializedName("name")
                private String name; // 礼包名称
                @SerializedName("rx_gift")
                private Object rxGift; // 瑞雪礼包信息
                @SerializedName("tag")
                private String tag; // 礼包标识

                public Integer getAmount() {
                    return amount;
                }

                public BuyTypeBean getBuyType() {
                    return buyType;
                }

                public GoodsBean getGoods() {
                    return goods;
                }

                public Integer getId() {
                    return id;
                }

                public String getName() {
                    return name;
                }

                public Object getRxGift() {
                    return rxGift;
                }

                public String getTag() {
                    return tag;
                }

                public static class BuyTypeBean implements Serializable {
                    @SerializedName("id")
                    private Integer id; // 购买介质 ID，-1: 法定货币，-2: 无需付费，正整数: 道具 ID
                    @SerializedName("name")
                    private String name; // 购买介质名称
                    @SerializedName("tag")
                    private String tag; // 购买介质标识

                    public Integer getId() {
                        return id;
                    }

                    public String getName() {
                        return name;
                    }

                    public String getTag() {
                        return tag;
                    }
                }

                public static class GoodsBean implements Serializable {
                    @SerializedName("goods_name")
                    private String goodsName; // 计费点名称
                    @SerializedName("goods_tag")
                    private String goodsTag; // 计费点标签
                    @SerializedName("id")
                    private Integer id; // 计费点主键 ID
                    @SerializedName("status")
                    private Integer status; // 计费点状态，1: 启用，-1: 禁用
                    @SerializedName("props")
                    private List<PropsBean> props; // 道具列表

                    public String getGoodsName() {
                        return goodsName;
                    }

                    public String getGoodsTag() {
                        return goodsTag;
                    }

                    public Integer getId() {
                        return id;
                    }

                    public Integer getStatus() {
                        return status;
                    }

                    public List<PropsBean> getProps() {
                        return props;
                    }

                    public static class PropsBean implements Serializable {
                        @SerializedName("id")
                        private Integer id; // 道具主键 ID
                        @SerializedName("name")
                        private String name; // 道具名称
                        @SerializedName("tag")
                        private String tag; // 道具标识
                        @SerializedName("max")
                        private Integer max; // 道具的最大操作数量
                        @SerializedName("alias")
                        private String alias; // 道具别名
                        @SerializedName("default_language")
                        private String defaultLanguage; // 道具默认语言
                        @SerializedName("language")
                        private String language; // 道具支持的语言列表
                        @SerializedName("default_image")
                        private String defaultImage; // 道具的默认图片
                        @SerializedName("is_permanent")
                        private Integer isPermanent; // 是否永久有效，0: 永久，1: 非永久
                        @SerializedName("time_limit")
                        private Integer timeLimit; // 道具有效期（天）
                        @SerializedName("icon")
                        private String icon; // 道具图标
                        @SerializedName("type")
                        private Integer type; // 道具类型，0: 普通道具，1: 代币道具
                        @SerializedName("buy_type")
                        private Object buyType; // 道具的购买介质
                        @SerializedName("number")
                        private Integer number; // 道具数量

                        public Integer getId() {
                            return id;
                        }

                        public String getName() {
                            return name;
                        }

                        public String getTag() {
                            return tag;
                        }

                        public Integer getMax() {
                            return max;
                        }

                        public String getAlias() {
                            return alias;
                        }

                        public String getDefaultLanguage() {
                            return defaultLanguage;
                        }

                        public String getLanguage() {
                            return language;
                        }

                        public String getDefaultImage() {
                            return defaultImage;
                        }

                        public Integer getIsPermanent() {
                            return isPermanent;
                        }

                        public Integer getTimeLimit() {
                            return timeLimit;
                        }

                        public String getIcon() {
                            return icon;
                        }

                        public Integer getType() {
                            return type;
                        }

                        public Object getBuyType() {
                            return buyType;
                        }

                        public Integer getNumber() {
                            return number;
                        }
                    }
                }
            }
        }
    }
}
