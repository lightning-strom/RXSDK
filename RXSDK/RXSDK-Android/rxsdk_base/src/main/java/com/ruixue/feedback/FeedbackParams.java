package com.ruixue.feedback;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.utils.EntityUtils;

import org.json.JSONObject;

import java.util.Map;

/**
 * 反馈参数对象
 * 
 * <p>用于封装 {@link com.ruixue.openapi.RXSDK#createFeedback} 和 
 * {@link com.ruixue.openapi.RXSDK#satisfactionEvaluation} 方法的参数</p>
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class FeedbackParams {

    @Keep
    @Nullable
    private String kindId;

    @Keep
    @Nullable
    private String content;

    @Keep
    @Nullable
    private String contact;

    @Keep
    @Nullable
    private String images;

    @Keep
    @Nullable
    private String satisfaction;

    @Keep
    @Nullable
    private String comment;

    @Keep
    @Nullable
    private Map<String, Object> extension;

    /**
     * 构造函数
     */
    public FeedbackParams() {
    }

    /**
     * 从 Map 创建参数对象
     * 
     * @param map 参数 Map
     * @return FeedbackParams 对象
     */
    @NonNull
    public static FeedbackParams fromMap(@NonNull Map<String, Object> map) {
        return EntityUtils.mapToEntity(map, FeedbackParams.class);
    }

    /**
     * 转换为 Map
     * 
     * @return Map 对象
     */
    @NonNull
    public Map<String, Object> toMap() {
        return EntityUtils.entityToMap(this, true, false);
    }

    /**
     * 转换为 JSONObject
     * 
     * @return JSONObject 对象
     */
    @NonNull
    public JSONObject toJSONObject() {
        return new JSONObject(toMap());
    }

    /**
     * 转换为 JSON 字符串
     * 
     * @return JSON 字符串
     */
    @NonNull
    public String toJSONString() {
        return new JSONObject(toMap()).toString();
    }

    // Getters and Setters

    @Nullable
    public String getKindId() {
        return kindId;
    }

    /**
     * 设置反馈类型 ID
     * 
     * @param kindId 反馈类型 ID
     * @return this
     */
    @NonNull
    public FeedbackParams setKindId(@Nullable String kindId) {
        this.kindId = kindId;
        return this;
    }

    @Nullable
    public String getContent() {
        return content;
    }

    /**
     * 设置反馈内容
     * 
     * @param content 反馈内容
     * @return this
     */
    @NonNull
    public FeedbackParams setContent(@Nullable String content) {
        this.content = content;
        return this;
    }

    @Nullable
    public String getContact() {
        return contact;
    }

    /**
     * 设置联系方式
     * 
     * @param contact 联系方式
     * @return this
     */
    @NonNull
    public FeedbackParams setContact(@Nullable String contact) {
        this.contact = contact;
        return this;
    }

    @Nullable
    public String getImages() {
        return images;
    }

    /**
     * 设置图片（多个图片 URL，用逗号分隔）
     * 
     * @param images 图片 URL 字符串
     * @return this
     */
    @NonNull
    public FeedbackParams setImages(@Nullable String images) {
        this.images = images;
        return this;
    }

    @Nullable
    public String getSatisfaction() {
        return satisfaction;
    }

    /**
     * 设置满意度（用于满意度评价）
     * 
     * @param satisfaction 满意度（如：1-5）
     * @return this
     */
    @NonNull
    public FeedbackParams setSatisfaction(@Nullable String satisfaction) {
        this.satisfaction = satisfaction;
        return this;
    }

    @Nullable
    public String getComment() {
        return comment;
    }

    /**
     * 设置评价内容（用于满意度评价）
     * 
     * @param comment 评价内容
     * @return this
     */
    @NonNull
    public FeedbackParams setComment(@Nullable String comment) {
        this.comment = comment;
        return this;
    }

    @Nullable
    public Map<String, Object> getExtension() {
        return extension;
    }

    /**
     * 设置扩展字段
     * 
     * @param extension 扩展字段 Map
     * @return this
     */
    @NonNull
    public FeedbackParams setExtension(@Nullable Map<String, Object> extension) {
        this.extension = extension;
        return this;
    }
}
