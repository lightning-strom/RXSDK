package com.ruixue.model;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/12/21
 */

public class BusinessBean implements Serializable {

    @SerializedName("interval")
    private Integer interval;
    @SerializedName("list")
    private List<ListBean> list;

    public static BusinessBean objectFromData(String str) {

        return new Gson().fromJson(str, BusinessBean.class);
    }

    public Integer getInterval() {
        return interval;
    }

    public void setInterval(Integer interval) {
        this.interval = interval;
    }

    public List<ListBean> getList() {
        return list;
    }

    public void setList(List<ListBean> list) {
        this.list = list;
    }

    public static class ListBean {
        @SerializedName("tag")
        private String tag;
        @SerializedName("created_at")
        private String createdAt;
        @SerializedName("status")
        private Integer status;
        @SerializedName("cpid")
        private String cpid;
        @SerializedName("name")
        private String name;
        @SerializedName("updated_at")
        private String updatedAt;
        @SerializedName("thumbnail")
        private String thumbnail;
        @SerializedName("id")
        private Integer id;
        @SerializedName("button_list")
        private List<ButtonListBean> buttonList;

        public static ListBean objectFromData(String str) {

            return new Gson().fromJson(str, ListBean.class);
        }

        public String getTag() {
            return tag;
        }

        public void setTag(String tag) {
            this.tag = tag;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public Integer getStatus() {
            return status;
        }

        public void setStatus(Integer status) {
            this.status = status;
        }

        public String getCpid() {
            return cpid;
        }

        public void setCpid(String cpid) {
            this.cpid = cpid;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getUpdatedAt() {
            return updatedAt;
        }

        public void setUpdatedAt(String updatedAt) {
            this.updatedAt = updatedAt;
        }

        public String getThumbnail() {
            return thumbnail;
        }

        public void setThumbnail(String thumbnail) {
            this.thumbnail = thumbnail;
        }

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public List<ButtonListBean> getButtonList() {
            return buttonList;
        }

        public void setButtonList(List<ButtonListBean> buttonList) {
            this.buttonList = buttonList;
        }

        public static class ButtonListBean {
            @SerializedName("name")
            private String name;
            @SerializedName("tag")
            private String tag;
            @SerializedName("description")
            private String description;
            @SerializedName("pop_logic")
            private Integer popLogic;
            @SerializedName("number")
            private Integer number;
            @SerializedName("type")
            private Integer type;
            @SerializedName("window_list")
            private List<WindowListBean> windowList;

            public static ButtonListBean objectFromData(String str) {

                return new Gson().fromJson(str, ButtonListBean.class);
            }

            public String getName() {
                return name;
            }

            public void setName(String name) {
                this.name = name;
            }

            public String getTag() {
                return tag;
            }

            public void setTag(String tag) {
                this.tag = tag;
            }

            public String getDescription() {
                return description;
            }

            public void setDescription(String description) {
                this.description = description;
            }

            public Integer getPopLogic() {
                return popLogic;
            }

            public void setPopLogic(Integer popLogic) {
                this.popLogic = popLogic;
            }

            public Integer getNumber() {
                return number;
            }

            public void setNumber(Integer number) {
                this.number = number;
            }

            public Integer getType() {
                return type;
            }

            public void setType(Integer type) {
                this.type = type;
            }

            public List<WindowListBean> getWindowList() {
                return windowList;
            }

            public void setWindowList(List<WindowListBean> windowList) {
                this.windowList = windowList;
            }

            public static class WindowListBean {
                @SerializedName("updated_at")
                private String updatedAt;
                @SerializedName("id")
                private Integer id;
                @SerializedName("cpid")
                private String cpid;
                @SerializedName("name")
                private String name;
                @SerializedName("status")
                private Integer status;
                @SerializedName("creator")
                private CreatorBean creator;
                @SerializedName("tag")
                private String tag;
                @SerializedName("updater")
                private UpdaterBean updater;
                @SerializedName("created_at")
                private String createdAt;
                @SerializedName("gift_list")
                private List<GiftListBean> giftList;

                public static WindowListBean objectFromData(String str) {

                    return new Gson().fromJson(str, WindowListBean.class);
                }

                public String getUpdatedAt() {
                    return updatedAt;
                }

                public void setUpdatedAt(String updatedAt) {
                    this.updatedAt = updatedAt;
                }

                public Integer getId() {
                    return id;
                }

                public void setId(Integer id) {
                    this.id = id;
                }

                public String getCpid() {
                    return cpid;
                }

                public void setCpid(String cpid) {
                    this.cpid = cpid;
                }

                public String getName() {
                    return name;
                }

                public void setName(String name) {
                    this.name = name;
                }

                public Integer getStatus() {
                    return status;
                }

                public void setStatus(Integer status) {
                    this.status = status;
                }

                public CreatorBean getCreator() {
                    return creator;
                }

                public void setCreator(CreatorBean creator) {
                    this.creator = creator;
                }

                public String getTag() {
                    return tag;
                }

                public void setTag(String tag) {
                    this.tag = tag;
                }

                public UpdaterBean getUpdater() {
                    return updater;
                }

                public void setUpdater(UpdaterBean updater) {
                    this.updater = updater;
                }

                public String getCreatedAt() {
                    return createdAt;
                }

                public void setCreatedAt(String createdAt) {
                    this.createdAt = createdAt;
                }

                public List<GiftListBean> getGiftList() {
                    return giftList;
                }

                public void setGiftList(List<GiftListBean> giftList) {
                    this.giftList = giftList;
                }

                public static class CreatorBean {
                    @SerializedName("id")
                    private Integer id;
                    @SerializedName("name")
                    private String name;
                    @SerializedName("nickname")
                    private String nickname;
                    @SerializedName("team_id")
                    private Integer teamId;

                    public static CreatorBean objectFromData(String str) {

                        return new Gson().fromJson(str, CreatorBean.class);
                    }

                    public Integer getId() {
                        return id;
                    }

                    public void setId(Integer id) {
                        this.id = id;
                    }

                    public String getName() {
                        return name;
                    }

                    public void setName(String name) {
                        this.name = name;
                    }

                    public String getNickname() {
                        return nickname;
                    }

                    public void setNickname(String nickname) {
                        this.nickname = nickname;
                    }

                    public Integer getTeamId() {
                        return teamId;
                    }

                    public void setTeamId(Integer teamId) {
                        this.teamId = teamId;
                    }
                }

                public static class UpdaterBean {
                    @SerializedName("name")
                    private String name;
                    @SerializedName("nickname")
                    private String nickname;
                    @SerializedName("team_id")
                    private Integer teamId;
                    @SerializedName("id")
                    private Integer id;

                    public static UpdaterBean objectFromData(String str) {

                        return new Gson().fromJson(str, UpdaterBean.class);
                    }

                    public String getName() {
                        return name;
                    }

                    public void setName(String name) {
                        this.name = name;
                    }

                    public String getNickname() {
                        return nickname;
                    }

                    public void setNickname(String nickname) {
                        this.nickname = nickname;
                    }

                    public Integer getTeamId() {
                        return teamId;
                    }

                    public void setTeamId(Integer teamId) {
                        this.teamId = teamId;
                    }

                    public Integer getId() {
                        return id;
                    }

                    public void setId(Integer id) {
                        this.id = id;
                    }
                }

                public static class GiftListBean {
                    @SerializedName("goods")
                    private GoodsBean goods;
                    @SerializedName("creator")
                    private CreatorBeanX creator;
                    @SerializedName("created_at")
                    private String createdAt;
                    @SerializedName("tag")
                    private String tag;
                    @SerializedName("amount")
                    private Integer amount;
                    @SerializedName("id")
                    private Integer id;
                    @SerializedName("name")
                    private String name;
                    @SerializedName("updater")
                    private UpdaterBeanX updater;
                    @SerializedName("status")
                    private Integer status;
                    @SerializedName("cpid")
                    private String cpid;
                    @SerializedName("updated_at")
                    private String updatedAt;
                    @SerializedName("rx_gift")
                    private RxGiftBean rxGift;
                    @SerializedName("buy_type")
                    private BuyTypeBean buyType;

                    public static GiftListBean objectFromData(String str) {

                        return new Gson().fromJson(str, GiftListBean.class);
                    }

                    public GoodsBean getGoods() {
                        return goods;
                    }

                    public void setGoods(GoodsBean goods) {
                        this.goods = goods;
                    }

                    public CreatorBeanX getCreator() {
                        return creator;
                    }

                    public void setCreator(CreatorBeanX creator) {
                        this.creator = creator;
                    }

                    public String getCreatedAt() {
                        return createdAt;
                    }

                    public void setCreatedAt(String createdAt) {
                        this.createdAt = createdAt;
                    }

                    public String getTag() {
                        return tag;
                    }

                    public void setTag(String tag) {
                        this.tag = tag;
                    }

                    public Integer getAmount() {
                        return amount;
                    }

                    public void setAmount(Integer amount) {
                        this.amount = amount;
                    }

                    public Integer getId() {
                        return id;
                    }

                    public void setId(Integer id) {
                        this.id = id;
                    }

                    public String getName() {
                        return name;
                    }

                    public void setName(String name) {
                        this.name = name;
                    }

                    public UpdaterBeanX getUpdater() {
                        return updater;
                    }

                    public void setUpdater(UpdaterBeanX updater) {
                        this.updater = updater;
                    }

                    public Integer getStatus() {
                        return status;
                    }

                    public void setStatus(Integer status) {
                        this.status = status;
                    }

                    public String getCpid() {
                        return cpid;
                    }

                    public void setCpid(String cpid) {
                        this.cpid = cpid;
                    }

                    public String getUpdatedAt() {
                        return updatedAt;
                    }

                    public void setUpdatedAt(String updatedAt) {
                        this.updatedAt = updatedAt;
                    }

                    public RxGiftBean getRxGift() {
                        return rxGift;
                    }

                    public void setRxGift(RxGiftBean rxGift) {
                        this.rxGift = rxGift;
                    }

                    public BuyTypeBean getBuyType() {
                        return buyType;
                    }

                    public void setBuyType(BuyTypeBean buyType) {
                        this.buyType = buyType;
                    }

                    public static class GoodsBean {
                        @SerializedName("goods_tag")
                        private String goodsTag;
                        @SerializedName("goods_name")
                        private String goodsName;
                        @SerializedName("status")
                        private Integer status;
                        @SerializedName("props")
                        private Object props;
                        @SerializedName("id")
                        private Integer id;

                        public static GoodsBean objectFromData(String str) {

                            return new Gson().fromJson(str, GoodsBean.class);
                        }

                        public String getGoodsTag() {
                            return goodsTag;
                        }

                        public void setGoodsTag(String goodsTag) {
                            this.goodsTag = goodsTag;
                        }

                        public String getGoodsName() {
                            return goodsName;
                        }

                        public void setGoodsName(String goodsName) {
                            this.goodsName = goodsName;
                        }

                        public Integer getStatus() {
                            return status;
                        }

                        public void setStatus(Integer status) {
                            this.status = status;
                        }

                        public Object getProps() {
                            return props;
                        }

                        public void setProps(Object props) {
                            this.props = props;
                        }

                        public Integer getId() {
                            return id;
                        }

                        public void setId(Integer id) {
                            this.id = id;
                        }
                    }

                    public static class CreatorBeanX {
                        @SerializedName("nickname")
                        private String nickname;
                        @SerializedName("team_id")
                        private Integer teamId;
                        @SerializedName("id")
                        private Integer id;
                        @SerializedName("name")
                        private String name;

                        public static CreatorBeanX objectFromData(String str) {

                            return new Gson().fromJson(str, CreatorBeanX.class);
                        }

                        public String getNickname() {
                            return nickname;
                        }

                        public void setNickname(String nickname) {
                            this.nickname = nickname;
                        }

                        public Integer getTeamId() {
                            return teamId;
                        }

                        public void setTeamId(Integer teamId) {
                            this.teamId = teamId;
                        }

                        public Integer getId() {
                            return id;
                        }

                        public void setId(Integer id) {
                            this.id = id;
                        }

                        public String getName() {
                            return name;
                        }

                        public void setName(String name) {
                            this.name = name;
                        }
                    }

                    public static class UpdaterBeanX {
                        @SerializedName("id")
                        private Integer id;
                        @SerializedName("name")
                        private String name;
                        @SerializedName("nickname")
                        private String nickname;
                        @SerializedName("team_id")
                        private Integer teamId;

                        public static UpdaterBeanX objectFromData(String str) {

                            return new Gson().fromJson(str, UpdaterBeanX.class);
                        }

                        public Integer getId() {
                            return id;
                        }

                        public void setId(Integer id) {
                            this.id = id;
                        }

                        public String getName() {
                            return name;
                        }

                        public void setName(String name) {
                            this.name = name;
                        }

                        public String getNickname() {
                            return nickname;
                        }

                        public void setNickname(String nickname) {
                            this.nickname = nickname;
                        }

                        public Integer getTeamId() {
                            return teamId;
                        }

                        public void setTeamId(Integer teamId) {
                            this.teamId = teamId;
                        }
                    }

                    public static class RxGiftBean {
                        @SerializedName("id")
                        private Integer id;
                        @SerializedName("name")
                        private String name;
                        @SerializedName("tag")
                        private String tag;
                        @SerializedName("list")
                        private Object list;

                        public static RxGiftBean objectFromData(String str) {

                            return new Gson().fromJson(str, RxGiftBean.class);
                        }

                        public Integer getId() {
                            return id;
                        }

                        public void setId(Integer id) {
                            this.id = id;
                        }

                        public String getName() {
                            return name;
                        }

                        public void setName(String name) {
                            this.name = name;
                        }

                        public String getTag() {
                            return tag;
                        }

                        public void setTag(String tag) {
                            this.tag = tag;
                        }

                        public Object getList() {
                            return list;
                        }

                        public void setList(Object list) {
                            this.list = list;
                        }
                    }

                    public static class BuyTypeBean {
                        @SerializedName("name")
                        private String name;
                        @SerializedName("id")
                        private Integer id;

                        public static BuyTypeBean objectFromData(String str) {

                            return new Gson().fromJson(str, BuyTypeBean.class);
                        }

                        public String getName() {
                            return name;
                        }

                        public void setName(String name) {
                            this.name = name;
                        }

                        public Integer getId() {
                            return id;
                        }

                        public void setId(Integer id) {
                            this.id = id;
                        }
                    }
                }
            }
        }
    }
}
