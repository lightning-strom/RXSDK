package com.ruixue.push.entity;

import android.os.Parcel;
import android.os.Parcelable;

import java.util.HashMap;
import java.util.Map;

public class PushMessage implements Parcelable{

    private String taskId;

    private String title;

    private String content;

    private String msg;
    //额外消息
    private String brandName;
    //对应所谓的键值对(初始化值，防止序列化出错)
    private Map<String, String> keyValue;

    public PushMessage(String notifyId, String title, String content, String msg, String brandNamd, Map<String,String> keyValue) {
        this.taskId = notifyId;
        this.title = title;
        this.content = content;
        this.msg = msg;
        this.brandName = brandNamd;
        this.keyValue = keyValue;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public Map<String, String> getKeyValue() {
        return keyValue;
    }

    public void setKeyValue(Map<String, String> keyValue) {
        this.keyValue = keyValue;
    }


    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(this.taskId);
        dest.writeString(this.title);
        dest.writeString(this.content);
        dest.writeString(this.msg);
        dest.writeString(this.brandName);
        if (keyValue != null) {
            dest.writeInt(this.keyValue.size());
            for (Map.Entry<String, String> entry : this.keyValue.entrySet()) {
                dest.writeString(entry.getKey());
                dest.writeString(entry.getValue());
            }
        }

    }

    protected PushMessage(Parcel in) {
        this.taskId = in.readString();
        this.title = in.readString();
        this.content = in.readString();
        this.msg = in.readString();
        this.brandName = in.readString();
        int keyValueSize = in.readInt();
        this.keyValue = new HashMap<String, String>(keyValueSize);
        for (int i = 0; i < keyValueSize; i++) {
            String key = in.readString();
            String value = in.readString();
            this.keyValue.put(key, value);
        }
    }

    public static final Creator<PushMessage> CREATOR = new Creator<PushMessage>() {
        @Override
        public PushMessage createFromParcel(Parcel source) {
            return new PushMessage(source);
        }

        @Override
        public PushMessage[] newArray(int size) {
            return new PushMessage[size];
        }
    };

    @Override
    public String toString() {
        return "RxPushMsg {" +
                "taskidd=" + taskId +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", msg='" + msg + '\'' +
                ", brandName='" + brandName + '\'' +
                ", keyValue=" + keyValue +
                '}';
    }
}
