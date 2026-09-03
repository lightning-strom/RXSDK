package com.ruixue.feedbackui.bean;

import android.os.Parcel;
import android.os.Parcelable;

import java.io.Serializable;

public class FileItem implements Parcelable {

    public long id;
    public String serverUrl = "";

    public String path = "";

    // 100 成功， -2 失败
    public int progress = -1;

    public String mineType = "";

    public String objectKey = "";

    public int failCount = 0;

    public FileItem() {

    }

    protected FileItem(Parcel in) {
        id = in.readLong();
        serverUrl = in.readString();
        path = in.readString();
        progress = in.readInt();
        mineType = in.readString();
        objectKey = in.readString();
        failCount = in.readInt();
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeLong(id);
        dest.writeString(serverUrl);
        dest.writeString(path);
        dest.writeInt(progress);
        dest.writeString(mineType);
        dest.writeString(objectKey);
        dest.writeInt(failCount);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Creator<FileItem> CREATOR = new Creator<FileItem>() {
        @Override
        public FileItem createFromParcel(Parcel in) {
            return new FileItem(in);
        }

        @Override
        public FileItem[] newArray(int size) {
            return new FileItem[size];
        }
    };
}
