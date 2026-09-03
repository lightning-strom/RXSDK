package com.ruixue.share;

import androidx.annotation.StringDef;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@StringDef({MIMEType.TEXT, MIMEType.IMAGE,
        MIMEType.AUDIO, MIMEType.VIDEO, MIMEType.FILE})
@Retention(RetentionPolicy.SOURCE)
public @interface MIMEType {
    /**
     * Share Text
     */
    final String TEXT = "text/plain";

    /**
     * Share Image
     */
    final String IMAGE = "image/*";

    /**
     * Share Audio
     */
    final String AUDIO = "audio/*";

    /**
     * Share Video
     */
    final String VIDEO = "video/*";

    /**
     * Share File
     */
    final String FILE = "*/*";
}
