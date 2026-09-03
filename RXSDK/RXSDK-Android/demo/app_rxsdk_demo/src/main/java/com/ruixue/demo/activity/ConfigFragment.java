package com.ruixue.demo.activity;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.SparseArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.RadioGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.bumptech.glide.Glide;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.CaptchaPurpose;
import com.ruixue.demo.data.SettingsBean;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.PasswordStrength;
import com.ruixue.passport.LoginMethod;
import com.ruixue.qipai.R;

import java.util.List;

public class ConfigFragment extends Fragment implements View.OnClickListener {

    private View root;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    boolean isSelectLogin = true;
    ImageView imageViewLogin;
    ImageView imageViewHall;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        if (root == null) {
            root = inflater.inflate(R.layout.config_fragment, container, false);
        }
        SettingsBean.getInstance().load(requireContext());
        SettingsBean.getInstance().setBg_hall(null);
        SettingsBean.getInstance().setBg_login(null);

        imageViewLogin = root.findViewById(R.id.img_bg_login);

        imageViewLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isSelectLogin = true;
                openPicture();
            }
        });
        imageViewHall = root.findViewById(R.id.img_bg_hall);

        imageViewHall.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isSelectLogin = false;
                openPicture();
            }
        });

        //解析text
        Button btn = root.findViewById(R.id.open);
        btn.setOnClickListener(this);

        RadioGroup radioGroup = root.findViewById(R.id.rb_group_screen_orientation);
        int orientation = SettingsBean.getInstance().getOrientation();
        if (orientation == ActivityInfo.SCREEN_ORIENTATION_SENSOR) {
            radioGroup.check(R.id.rb_orientation_sensor);
        } else if (orientation == ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT) {
            radioGroup.check(R.id.rb_orientation_portrait);
        } else {
            radioGroup.check(R.id.rb_orientation_landscape);
        }

        radioGroup.setOnCheckedChangeListener((group, checkedId) -> {
            if (checkedId == R.id.rb_orientation_landscape) {
                SettingsBean.getInstance().setOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
            } else if (checkedId == R.id.rb_orientation_portrait) {
                SettingsBean.getInstance().setOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT);
            } else if (checkedId == R.id.rb_orientation_sensor) {
                SettingsBean.getInstance().setOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR);
            }
        });
        RadioGroup rb_language = root.findViewById(R.id.rb_language);

        SparseArray<String> lang = new SparseArray<>();
        lang.put(R.id.rb_language_zh, "zh");
        lang.put(R.id.rb_language_en, "en");
        lang.put(R.id.rb_language_ja, "ja");
        lang.put(R.id.rb_language_ar, "ar");

        String langStr = SettingsBean.getInstance().getLanguage();
        if (TextUtils.isEmpty(langStr)) {
            SettingsBean.getInstance().setLanguage(lang.get(rb_language.getCheckedRadioButtonId()));
        } else {
            switch (langStr) {
                case "zh":
                    rb_language.check(R.id.rb_language_zh);
                    break;
                case "en":
                    rb_language.check(R.id.rb_language_en);
                    break;
                case "ja":
                    rb_language.check(R.id.rb_language_ja);
                case "ar":
                    rb_language.check(R.id.rb_language_ar);
                    break;
            }
        }

        rb_language.setOnCheckedChangeListener((group, checkedId) -> {
            SettingsBean.getInstance().setLanguage(lang.get(checkedId));
            RuiXueSdk.setLanguage(getActivity(), lang.get(checkedId));
        });
        RadioGroup rgAccount = root.findViewById(R.id.rb_group_account_type);
        RadioGroup rb_group_pwd = root.findViewById(R.id.rb_group_pwd);

        RuiXueSdk.setPasswordStrength(rb_group_pwd.getCheckedRadioButtonId() == R.id.rb_pwd1 ? PasswordStrength.Average : PasswordStrength.Strong);
        rb_group_pwd.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                if (checkedId == R.id.rb_pwd1) {
                    RuiXueSdk.setPasswordStrength(PasswordStrength.Average);
                } else if (checkedId == R.id.rb_pwd2) {
                    RuiXueSdk.setPasswordStrength(PasswordStrength.Strong);
                }
            }
        });

        int captcha = SettingsBean.getInstance().getIsCaptcha();
        if (captcha == 0) {
            rgAccount.check(R.id.rb_account_username);
        } else {
            rgAccount.check(R.id.rb_account_captcha);
        }

        rgAccount.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                if (checkedId == R.id.rb_account_username) {
                    SettingsBean.getInstance().setIsCaptcha(0);
                } else if (checkedId == R.id.rb_account_captcha) {
                    SettingsBean.getInstance().setIsCaptcha(1);
                }
            }
        });

        int loginType = SettingsBean.getInstance().getLoginType();
        if (loginType == CaptchaPurpose.ACCOUNT_TYPE_PHONE) {

        } else {

        }

        ((CheckBox) root.findViewById(R.id.check1)).setOnCheckedChangeListener(listener);
        ((CheckBox) root.findViewById(R.id.check2)).setOnCheckedChangeListener(listener);
        ((CheckBox) root.findViewById(R.id.check4)).setOnCheckedChangeListener(listener);
        ((CheckBox) root.findViewById(R.id.check3)).setOnCheckedChangeListener(listener);
        ((CheckBox) root.findViewById(R.id.check5)).setOnCheckedChangeListener(listener);
        ((CheckBox) root.findViewById(R.id.check6)).setOnCheckedChangeListener(listener);
        ((CheckBox) root.findViewById(R.id.check7)).setOnCheckedChangeListener(listener);
        ((CheckBox) root.findViewById(R.id.check8)).setOnCheckedChangeListener(listener);

        CheckBox cbq = root.findViewById(R.id.cb_first_quicklogin);
        cbq.setChecked(SettingsBean.getInstance().isFirstQuickLogin());
        (cbq).setOnCheckedChangeListener((buttonView, isChecked) -> {
            SettingsBean.getInstance().setFirstQuickLogin(isChecked);
        });

        List<String> methods = SettingsBean.getInstance().getLoginMethods();
        if (methods != null) {
            for (int i = 0; i < methods.size(); i++) {
                String method = methods.get(i);
                if (method.equals(LoginMethod.GUEST)) {
                    ((CheckBox) root.findViewById(R.id.check1)).setChecked(true);
                } else if (method.equals(LoginMethod.USERNAME)) {
                    int type = SettingsBean.getInstance().getLoginType();
                    ((CheckBox) root.findViewById(R.id.check2)).setChecked(true);
                } else if (method.equals(LoginMethod.WECHAT)) {
                    ((CheckBox) root.findViewById(R.id.check3)).setChecked(true);
                } else if (method.equals(LoginMethod.CAPTCHACODE)) {
                    ((CheckBox) root.findViewById(R.id.check4)).setChecked(true);
                } else if (method.equals(LoginMethod.QUICKPHONE)) {
                    ((CheckBox) root.findViewById(R.id.check5)).setChecked(true);
                } else if (method.equals(LoginMethod.GOOGLE)) {
                    ((CheckBox) root.findViewById(R.id.check6)).setChecked(true);
                } else if (method.equals(LoginMethod.FACEBOOK)) {
                    ((CheckBox) root.findViewById(R.id.check7)).setChecked(true);
                } else if (method.equals(LoginMethod.LINE)) {
                    ((CheckBox) root.findViewById(R.id.check8)).setChecked(true);
                }
            }
        }

        String packageName = requireContext().getPackageName();
        if (!RuiXueSdk.isOasVersion()) {
            root.findViewById(R.id.check6).setVisibility(View.GONE);
            root.findViewById(R.id.check7).setVisibility(View.GONE);
            root.findViewById(R.id.check8).setVisibility(View.GONE);
            rb_language.setVisibility(View.GONE);
            SettingsBean.getInstance().setLanguage(lang.get(R.id.rb_language_zh));
            RuiXueSdk.setLanguage(getActivity(), lang.get(R.id.rb_language_zh));
        }

        return root;
    }

    CompoundButton.OnCheckedChangeListener listener = new CompoundButton.OnCheckedChangeListener() {
        @Override
        public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
            String method = null;

            if (buttonView.getId() == R.id.check1) {
                method = LoginMethod.GUEST;
            } else if (buttonView.getId() == R.id.check2) {
                method = LoginMethod.USERNAME;
                SettingsBean.getInstance().setLoginType(CaptchaPurpose.ACCOUNT_TYPE_NORMAL);
            } else if (buttonView.getId() == R.id.check3) {
                method = LoginMethod.WECHAT;
            } else if (buttonView.getId() == R.id.check4) {
                method = LoginMethod.CAPTCHACODE;
            } else if (buttonView.getId() == R.id.check5) {
                method = LoginMethod.QUICKPHONE;
            } else if (buttonView.getId() == R.id.check6) {
                method = LoginMethod.GOOGLE;
            } else if (buttonView.getId() == R.id.check7) {
                method = LoginMethod.FACEBOOK;
            } else if (buttonView.getId() == R.id.check8) {
                method = LoginMethod.LINE;
            }
            if (isChecked) {
                SettingsBean.getInstance().addLoginMethod(method);
            } else {
                SettingsBean.getInstance().removeLoginMethod(method);
            }
        }
    };

    private static final int FILE_SELECT_CODE = 100;
    private static final int REQUEST_SHARE_FILE_CODE = 120;

    public void openPicture() {
        // 进入相册 以下是例子：用不到的api可以不写
//        Matisse.from(getActivity()).choose(MimeType.allOf()) // 选择 mime 的类型
//                .countable(true).maxSelectable(1) // 图片选择的最多数量
//                .restrictOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED).thumbnailScale(0.85f) // 缩略图的比例
//                .imageEngine(new GlideEngine()) // 使用的图片加载引擎
//                .forResult(REQUEST_CODE_CHOOSE); // 设置作为标记的请求码

        Intent intent = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        startActivityForResult(intent, FILE_SELECT_CODE);

//        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
////        intent.putExtra(MediaStore.EXTRA_PICK_IMAGES_MAX, maxNumPhotosAndVideos);
//
//        intent.setType("image/*");
//        intent.addCategory(Intent.CATEGORY_OPENABLE);
//        try {
//            startActivityForResult(Intent.createChooser(intent, "选择文件"), FILE_SELECT_CODE);
//            getActivity().overridePendingTransition(0, 0);
//        } catch (Exception ex) {
//            // Potentially direct the user to the Market with OnProgressChangeListener Dialog
//            Toast.makeText(getContext(), "请先安装文件管理器", Toast.LENGTH_SHORT).show();
//        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        RXLogger.i("requestCode " + requestCode + " resultCode " + resultCode);
        if (requestCode == FILE_SELECT_CODE) {
            if (isSelectLogin) {
                if (data == null || data.getData() == null) {
                    imageViewLogin.setImageResource(R.drawable.bg_wlmj);
                } else {
                    SettingsBean.getInstance().setBg_login(data.getData().toString());
                    Glide.with(getContext()).load(data.getData().toString()).into(imageViewLogin);
                }

            } else {
                if (data == null || data.getData() == null) {
                    imageViewHall.setImageResource(R.drawable.bg_hall);
                } else {
                    SettingsBean.getInstance().setBg_hall(data.getData().toString());
                    Glide.with(getContext()).load(data.getData().toString()).into(imageViewHall);
                }
            }
//            List<Uri> mSelected = Matisse.obtainResult(data);
//            Log.d("Matisse", "mSelected: " + mSelected);
        }
    }

    @Override
    public void onClick(View v) {
        int id = v.getId();

        SettingsBean.getInstance().save(requireContext());
        RXLogger.i("rx demo settings:" + SettingsBean.getInstance().toJson());
        Navigation.findNavController(getView()).navigate(R.id.action_configFragment_to_loginFragment);
    }


}