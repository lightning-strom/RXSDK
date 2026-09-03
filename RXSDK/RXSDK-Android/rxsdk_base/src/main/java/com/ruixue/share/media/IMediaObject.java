package com.ruixue.share.media;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import androidx.annotation.NonNull;

import com.ruixue.share.ShareMediaType;

import java.util.Map;

public interface IMediaObject {
    String toUrl();

    IMediaObject.MediaType getMediaType();

    boolean isUrlMedia();

    Map<String, Object> toUrlExtraParams();

    Map<String, Object> toMap();

    byte[] toByte();

    public static enum MediaType {
        IMAGE {
            @NonNull
            public String toString() {
                return ShareMediaType.IMAGE;
            }
        },
        VIDEO {
            @NonNull
            public String toString() {
                return ShareMediaType.VIDEO;
            }
        },
        MUSIC {
            @NonNull
            public String toString() {
                return ShareMediaType.MUSIC;
            }
        },
        TEXT {
            @NonNull
            public String toString() {
                return ShareMediaType.TEXT;
            }
        },
        TEXT_IMAGE {
            @NonNull
            public String toString() {
                return ShareMediaType.TEXT_IMAGE;
            }
        },
        WEBPAGE {
            @NonNull
            public String toString() {
                return ShareMediaType.WEBPAGE;
            }
        };

        MediaType() {
        }
    }
}