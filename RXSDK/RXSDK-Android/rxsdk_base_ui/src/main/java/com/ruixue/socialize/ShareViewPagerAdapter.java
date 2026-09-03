package com.ruixue.socialize;

import androidx.annotation.NonNull;
import androidx.viewpager.widget.PagerAdapter;
import android.content.Context;
import android.view.View;
import android.view.ViewGroup;

import com.ruixue.share.PlatformSns;

import java.util.ArrayList;
import java.util.List;
/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */
class ShareViewPagerAdapter extends PagerAdapter {
    private final List<PlatformSns[][]> mPageData;
    private final Context mContext;
    private final ShareViewPagerHelper mMenuHelper;

    public ShareViewPagerAdapter(Context var1, ShareDialogConfig var2) {
        this(var1, var2,  null);
    }

    public ShareViewPagerAdapter(Context var1, ShareDialogConfig var2, List<PlatformSns> var3) {
        this.mPageData = new ArrayList<>();
        this.mContext = var1;
        this.mMenuHelper = new ShareViewPagerHelper(var2);
        this.setData(var3);
    }

    public void setData(List<PlatformSns> snsPlatforms) {
        this.mPageData.clear();
        if (snsPlatforms != null) {
            this.mPageData.addAll(this.mMenuHelper.formatPageData(snsPlatforms));
        }

        this.notifyDataSetChanged();
    }

    public int getCount() {
        return this.mPageData == null ? 0 : this.mPageData.size();
    }

    public boolean isViewFromObject(@NonNull View var1, @NonNull Object var2) {
        return var1 == var2;
    }

    @NonNull
    public Object instantiateItem(ViewGroup var1, int var2) {
        View var3 = this.mMenuHelper.createPageLayout(this.mContext, (PlatformSns[][])this.mPageData.get(var2));
        var1.addView(var3);
        return var3;
    }

    public void destroyItem(ViewGroup var1, int var2, @NonNull Object var3) {
        var1.removeView((View)var3);
    }
}
