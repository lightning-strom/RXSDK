package com.ruixue.socialize;

import com.ruixue.share.PlatformType;
import com.ruixue.share.PlatformSns;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */
public interface ShareClickListener {
     /**
      *
      * @param snsPlatform snsPlatform
      * @param share_media share_media
      * @return 事件是否已处理不再继续传递
      */
     boolean onClick(PlatformSns snsPlatform, PlatformType share_media);
}
