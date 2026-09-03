package com.ruixue.socialize;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import android.content.Context;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.LinearLayout.LayoutParams;

import com.ruixue.share.PlatformSns;

import java.util.ArrayList;
import java.util.List;

class ShareViewPagerHelper extends ShareLayoutHelper {
    private static String TAG = ShareViewPagerHelper.class.getSimpleName();

    public ShareViewPagerHelper(ShareDialogConfig var1) {
        super(var1);
    }

    /**
     *
     * @param snsPlatforms
     * @return 分页数据
     */
    public List<PlatformSns[][]> formatPageData(List<PlatformSns> snsPlatforms) {
        int pageCapacity = this.mShareDialogConfig.getPageCapacity();
        int size = snsPlatforms.size();
        ArrayList<PlatformSns[][]> pages = new ArrayList<>();
        int index;
        if (size < this.mShareDialogConfig.mMenuColumnNum) {  //数量小于 1 行
            PlatformSns[][] var15 = new PlatformSns[1][size];

            for(index = 0; index < snsPlatforms.size(); ++index) {
                var15[0][index] = (PlatformSns)snsPlatforms.get(index);
            }

            pages.add(var15);
            return pages;
        } else {
            int pageCount = size / pageCapacity;//页数量
            index = -1;
            int sizeMod = size % pageCapacity;//页余数
            if (sizeMod != 0) {
                index = sizeMod / this.mShareDialogConfig.mMenuColumnNum + (sizeMod % this.mShareDialogConfig.mMenuColumnNum != 0 ? 1 : 0);
                ++pageCount;
            }

            int cursor;
            for(cursor = 0; cursor < pageCount; ++cursor) {
                int rowNum;
                if (cursor == pageCount - 1 && index != -1) {
                    rowNum = index;
                }
                else {
                    rowNum = mShareDialogConfig.getMenuRowNum();
                }
                PlatformSns[][] var9 = new PlatformSns[rowNum][this.mShareDialogConfig.mMenuColumnNum];
                pages.add(var9);
            }

            cursor = 0;

            for(int i = 0; i < pages.size(); ++i) {
                PlatformSns[][] page = (PlatformSns[][])pages.get(i);
                for (PlatformSns[] row : page) { //row
                    for (int k = 0; k < row.length; ++k) {//column
                        if (cursor < size) {
                            row[k] = (PlatformSns) snsPlatforms.get(cursor);
                        }
                        ++cursor;
                    }
                }
            }

            return pages;
        }
    }

    public View createPageLayout(Context context, PlatformSns[][] snsPlatforms) {
        LinearLayout linearLayout = new LinearLayout(context);
        linearLayout.setOrientation(LinearLayout.VERTICAL);
        linearLayout.setGravity(Gravity.TOP);
        LayoutParams layoutParams = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        linearLayout.setLayoutParams(layoutParams);

        for(int i = 0; i < snsPlatforms.length; ++i) {
            PlatformSns[] snsPlatform = snsPlatforms[i];
            View view = this.createRowLayout(context, snsPlatform, i != 0);
            linearLayout.addView(view);
        }

        return linearLayout;
    }

    private View createRowLayout(Context context, PlatformSns[] var2, boolean nonFirstRow) {
        LinearLayout var4 = new LinearLayout(context);
        var4.setOrientation(LinearLayout.HORIZONTAL);
        var4.setGravity(Gravity.AXIS_SPECIFIED);
        LayoutParams var5 = new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
        if (nonFirstRow) {
            var5.topMargin = this.dip2px(context, ShareDialogConfig.MENU_ROW_MARGIN);
        }

        var4.setLayoutParams(var5);

        for(int i = 0; i < var2.length; ++i) {
            View var7 = this.createSnsButton(context, var2[i]);
            var4.addView(var7);
        }

        return var4;
    }

}