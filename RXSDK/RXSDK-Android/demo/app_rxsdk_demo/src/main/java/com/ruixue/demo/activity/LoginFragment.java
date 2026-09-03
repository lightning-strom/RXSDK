package com.ruixue.demo.activity;

import android.annotation.SuppressLint;
import android.content.res.Configuration;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.IdRes;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.bumptech.glide.Glide;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.RXUICallback;
import com.ruixue.demo.GlobalConfig;
import com.ruixue.demo.data.SettingsBean;
import com.ruixue.demo.helper.LoginV2DemoHelper;
import com.ruixue.demo.utils.Logger;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.LoginUIConfig;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.passport.LoginMethod;
import com.ruixue.qipai.R;
import com.ruixue.ui.BuildConfig;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class LoginFragment extends Fragment implements View.OnClickListener {
    private static final String TAG = LoginFragment.class.getSimpleName();


    private View root;

    RXJSONCallback rxjsonCallback = new RXJSONCallback() {
        @Override
        public void onSuccess(@Nullable JSONObject data) {

        }

        @Override
        public void onFailed(@NonNull JSONObject cause) {

        }
    };


    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
    }

    @SuppressLint("SetTextI18n")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        RuiXueSdk.setLanguage(getActivity(), SettingsBean.getInstance().getLanguage());
        if (root == null) {
            root = inflater.inflate(R.layout.login_fragment, container, false);
        }
        getActivity().setRequestedOrientation(SettingsBean.getInstance().getOrientation());

        String uri = SettingsBean.getInstance().getBg_login();
        if (!TextUtils.isEmpty(uri)) {
            ImageView imageView = findViewById(R.id.img_bg);
            Glide.with(getContext()).load(uri).into(imageView);
        }
        TextView version = root.findViewById(R.id.tv_version);
        version.setText("v1.0.1." + BuildConfig.COMMIT_ID);

        findViewById(R.id.btn_rxlogin).setOnClickListener(this);
        findViewById(R.id.btn_user_privacy).setOnClickListener(this);
        findViewById(R.id.btn_rxret_config).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Navigation.findNavController(getView()).navigate(R.id.action_loginFragment_to_configFragment);
            }
        });
        Bundle bundle = getArguments();
        if (bundle != null) {
            if (bundle.getBoolean("switch_user", false)) {
//                showLogin();
            }
        }
        return root;
    }

    public final <T extends View> T findViewById(@IdRes int id) {
        return root.findViewById(id);
    }

    @Override
    public void onClick(View view) {
        int resid = view.getId();
        if (resid == R.id.btn_rxlogin) {
            if (SettingsBean.getInstance().isFirstQuickLogin()) {
                showOAuthLoginUI();
            } else {
                showLoginView();
            }
        } else if (resid == R.id.btn_user_privacy) {
            showPrivacyView();
        }


    }

    private void showPrivacyView() {
        String agreement = String.format("<a href='%s' >%s</a>", "https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00001", "《用户协议》");
        agreement += String.format("、<a href='%s' >%s</a>", "https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00002", "《隐私政策》");
        String source = "&#12288;&#12288;在您使用我们（微乐）服务前，请您务必审慎阅读、充分理解" + agreement + "的各条款。同时，您应特";
        source += "别注意前述协议中免除或者限制我们责任的条款、对您权利进行限制的条款、约定争议解决方式和司法管辖的条款。如您已";
        source += "详细阅读并同意" + agreement + "请点击“同意”开始使用我们的服务。";

        RXSdkUI.getInstance().userPrivacyPolicy(getActivity(), "用户协议和隐私政策", source, rxjsonCallback).show();

    }

    private void showOAuthLoginUI() {
        RXSdkUI.getInstance().showOAuthLoginUI(getActivity(), getLoginUIConfig(), getLoginCallback());
    }

    private void showLoginView() {
        LoginUIConfig loginUIConfig = getLoginUIConfig();
        if (RuiXueSdk.isOasVersion()) {
            RXSdkUI.getInstance().loginUIOS(getActivity(), loginUIConfig, null, getLoginCallback()).show();
        } else {
            RXSdkUI.getInstance().loginUI(getActivity(), loginUIConfig, getLoginCallback()).show();
        }
    }

    private static LoginUIConfig getLoginUIConfig() {
        LoginUIConfig loginUIConfig = RXGlobalData.getPassportCfg();
        SettingsBean settingsBean = SettingsBean.getInstance();
        List<String> loginMethods = new ArrayList<>(settingsBean.getLoginMethods());
        if (isHuyaLoginScenario()) {
            loginMethods.clear();
            loginMethods.add(LoginMethod.HUYA);
        }
        loginUIConfig.setLoginMethods(loginMethods);
        loginUIConfig.setCaptchaLogin(settingsBean.getIsCaptcha() > 0);
        loginUIConfig.setTitleResId(R.drawable.logo);
        loginUIConfig.setLoginType(settingsBean.getLoginType());
        loginUIConfig.setFirstNeedSetPassword(true);
        Map<String, Object> loginMap = LoginV2DemoHelper.getLoginMap();
        loginUIConfig.setLoginMethods(loginMap);

        Map<String, Object> cmap = new HashMap<>();
        cmap.put("sign_fields", new String[]{"openid", "age"});
        loginUIConfig.setCustomParams(cmap);

        return loginUIConfig;
    }

    private static boolean isHuyaLoginScenario() {
        Map<String, Object> ext = GlobalConfig.getExt();
        if (ext == null || ext.isEmpty()) {
            return false;
        }
        String type = String.valueOf(ext.get("type"));
        if ("huya".equalsIgnoreCase(type)) {
            return true;
        }
        return hasExtValue(ext, "gameId")
                && hasExtValue(ext, "loginClientID")
                && hasExtValue(ext, "payAppId");
    }

    private static boolean hasExtValue(Map<String, Object> ext, String key) {
        Object value = ext.get(key);
        return value != null && !TextUtils.isEmpty(String.valueOf(value).trim());
    }

    @NonNull
    private RXUICallback getLoginCallback() {
        return new RXUICallback() {
            /**
             *点击登录按钮时回调，用于在发送登录请求时候可以添加cp自定义参数传给服务器。
             * @param params 登录请求参数
             */
            @Override
            public Map<String, Object> onClickHandle(Map<String, Object> params) {
                String method = (String) params.get("method");
                Map<String, Object> map = LoginV2DemoHelper.getLoginMap();
                if (map.containsKey(method)) {
                    try {
                        if (params.containsKey("ext")) {
                            HashMap<String, Object> pa = (HashMap<String, Object>) params.get("ext");
                            pa.putAll((Map<? extends String, ?>) map.get(method));
                        } else {
                            params.put("ext", Objects.requireNonNull(map.get(method)));
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                return params;
            }

            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Logger.e(TAG, "oncallback: " + data);
                ToastUtils.showToastSafe(requireActivity(),
                        "登录成功" + (data == null ? "" : (": " + data)));
                Navigation.findNavController(requireView()).navigate(R.id.action_loginFragment_to_mainFragment);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Logger.e(TAG, "oncallback: " + cause);
                String msg = cause.optString("msg", cause.toString());
                ToastUtils.showToastSafe(requireActivity(), "登录失败: " + msg);
            }
        };
    }
}