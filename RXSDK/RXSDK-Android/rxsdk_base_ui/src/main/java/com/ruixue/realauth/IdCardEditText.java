package com.ruixue.realauth;


import android.content.Context;
import android.util.AttributeSet;

// Created by wangliang on 2025/5/13.
public class IdCardEditText extends DeleteAwareEditText {

    private boolean editMode = false;

    public IdCardEditText(Context context) {
        super(context);
    }

    public IdCardEditText(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public IdCardEditText(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public void setEditMode(boolean editMode) {
        this.editMode = editMode;
    }

    // 禁止双击、拖拽、长按弹窗等
    @Override
    protected void onSelectionChanged(int selStart, int selEnd) {
        // 强制光标在末尾
        super.onSelectionChanged(selStart, selEnd);
        if (editMode) {
            return;
        }
        if (selStart != length() || selEnd != length()) {
            setSelection(length());
        }
    }
}
