package com.ruixue.view;

import android.content.Context;
import android.text.Layout;
import android.util.AttributeSet;
import android.view.MotionEvent;

import androidx.annotation.Nullable;

import java.util.ArrayList;
import java.util.List;

public class LoginPrivacyTextView extends androidx.appcompat.widget.AppCompatTextView {

    List<String> nameList = new ArrayList<>();

    public LoginPrivacyTextView(Context context) {
        super(context);
    }

    public LoginPrivacyTextView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public LoginPrivacyTextView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }


    @Override
    public boolean onTouchEvent(MotionEvent event) {

        int lastIndex = 0;
        try {
            if (event.getAction() == MotionEvent.ACTION_DOWN) {
                String sp = getText().toString();
                Layout layout = getLayout();

                for (int i = 0; i < nameList.size(); i++) {

                    int index = sp.indexOf(nameList.get(i), lastIndex);
                    lastIndex = index + nameList.get(i).length();

                    String singleText = nameList.get(i).substring(0, 1);
                    int singleSize = (int) getPaint().measureText(singleText);

                    int xCoord = (int) (layout.getPrimaryHorizontal(index) + getCompoundPaddingLeft());
                    int width = (int) getPaint().measureText(nameList.get(i));

                    if (nameList.get(i).length() <= 2) {
                        if (event.getX() > xCoord && event.getX() < (xCoord + width)){
                            return super.onTouchEvent(event);
                        }
                    }else {
                        if (event.getX() > (xCoord + singleSize) && event.getX() < (xCoord + width - singleSize)) {
                            return super.onTouchEvent(event);
                        }
                    }
                }
            }else {
                return super.onTouchEvent(event);
            }
            return false;
        }catch (Exception e) {
            return super.onTouchEvent(event);
        }
    }

    public void setName(String name) {
        nameList.add(name);
    }

}
