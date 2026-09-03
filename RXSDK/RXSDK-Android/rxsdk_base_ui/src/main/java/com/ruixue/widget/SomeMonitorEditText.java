package com.ruixue.widget;

import android.graphics.Color;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.ruixue.ui.R;

public class SomeMonitorEditText implements TextWatcher {

    private Button button;
    private EditText[] editTexts;

    public static SomeMonitorEditText create(final Button button, final EditText... text) {
        return new SomeMonitorEditText().setMonitorEditText(button, text);
    }

    public SomeMonitorEditText setMonitorEditText(final Button button, final EditText... text) {
        this.button = button;
        this.editTexts = text;
        for (EditText editText : text) {
            if (editText != null && editText.getVisibility() == View.VISIBLE) {
                editText.addTextChangedListener(SomeMonitorEditText.this);
            }
        }
        return this;
    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {
        //   Auto-generated method stub

    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {

    }

    @Override
    public void afterTextChanged(Editable s) {
        for (EditText editText : editTexts) {
            if (editText.getVisibility() == View.VISIBLE && editText.length() == 0) {
//                button.setBackgroundColor(Color.parseColor("#AADDB5"));
                button.setEnabled(false);
                return;//这句代码值两千万
            } else {
//                button.setBackgroundResource(R.drawable.shape_btn_bg_green);
                button.setEnabled(true);
            }
        }
    }

}