package com.ruixue.share;

import androidx.annotation.IntDef;
import androidx.annotation.Keep;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@IntDef({ShareScene.SESSION, ShareScene.TIMELINE, ShareScene.FAVORITE,
        ShareScene.SPECIFIED_CONTACT, ShareScene.STATUS, ShareScene.SELECT})
@Retention(RetentionPolicy.SOURCE)
@Keep
public @interface ShareScene {

    //用户自由选择
    @Keep int SELECT = -1;

    /**
     * 好友
     */
    @Keep int SESSION = 0;
    /**
     * 朋友圈
     */
    @Keep int TIMELINE = 1;
    /**
     * 收藏
     */
    @Keep int FAVORITE = 2;

    /**
     * 特定好友
     */
    @Keep int SPECIFIED_CONTACT = 3;

    @Keep int STATUS = 4;
}

