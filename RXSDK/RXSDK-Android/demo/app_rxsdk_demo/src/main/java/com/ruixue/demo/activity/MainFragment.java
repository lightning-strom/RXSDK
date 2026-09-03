package com.ruixue.demo.activity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.bumptech.glide.Glide;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.RXUICallback;
import com.ruixue.demo.GlobalConfig;
import com.ruixue.demo.data.SettingsBean;
import com.ruixue.demo.utils.Logger;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.IRXView;
import com.ruixue.openapi.OnViewCloseListener;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.LoginMethod;
import com.ruixue.qipai.R;
import com.ruixue.ui.BuildConfig;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.view.AlertTipView;
import com.ruixue.view.RXServiceView;
import com.ruixue.view.RXServiceWeb;
import com.ruixue.view.UserCenterView;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class MainFragment extends Fragment implements View.OnClickListener {

    private View root;

//    RXJSONCallback rxjsonCallback = new RXJSONCallback() {
//        @Override
//        public void onSuccess(@Nullable JSONObject data) {
//
//        }
//        @Override
//        public void onFailed(@NonNull JSONObject cause) {
//
//        }
//    };

    @Override
    public void onClick(View v) {
        int id = v.getId();

    }


    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @SuppressLint("SetTextI18n")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        if (root == null) {
            root = inflater.inflate(R.layout.hall_fragment, container, false);
        }
        String uri = SettingsBean.getInstance().getBg_hall();
        if (!TextUtils.isEmpty(uri)) {
            ImageView imageView = root.findViewById(R.id.img_bg);
            Glide.with(getContext()).load(uri).into(imageView);
        }
        TextView version = root.findViewById(R.id.tv_version);
        version.setText("v1.0.1." + BuildConfig.COMMIT_ID);
        root.findViewById(R.id.btn_rxhelper).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RXServiceWeb h = (RXServiceWeb) RXSdkUI.getInstance().helperCenterUI(getActivity(), new HashMap<>(), getCallback());
                LoginData loginData = RuiXueSdk.getLoginData();
                if (loginData != null && LoginMethod.isChannel(loginData.getMethod())) {
                    h.setSyncInfoEnable(true);
                    Map<String, Object> m = new HashMap<>();
                    m.put("appid", GlobalConfig.getWxAppId());
                    h.setSyncParams(m);
                }
                h.show();
            }
        });
        root.findViewById(R.id.btn_rxpay).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Map<String, Object> pay = new HashMap<>();
//                pay.put("goods_tag", "rxpayid1");
                Map<String, Object> extMap = GlobalConfig.getExt();
                String goods_tag = extMap != null ? (String) extMap.get("goods_tag") : null;
                if (!GlobalConfig.getConfig().isTest() && !TextUtils.isEmpty(goods_tag)) {
                    pay.put("goods_tag", goods_tag);
                } else {
                    pay.put("goods_tag", com.ruixue.demo.config.DemoTestConfig.GOODS_TAG_DEFAULT);
                }
//                pay.put("goods_tag", goods_tag);

                pay.put("hq_type", "xsolla_inapp");

                pay.put("transmit_args", "this is cp transmit_args");
                pay.put("trade_no", String.valueOf(System.currentTimeMillis()));
                LoadingDialog loadingDialog = LoadingDialog.create(getActivity());
                loadingDialog.showDelay(100).closeDelay(17000);

                RXSdkApi.getInstance().pay(getActivity(), pay, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        if (data != null) {
                            RXLogger.e(data.toString());
                        }
                        loadingDialog.dismiss();
                        AlertTipView.create(getActivity(), "这是demo显示，支付成功", "支付成功", null).show();
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        RXLogger.e(cause.toString());
                        loadingDialog.dismiss();
                        AlertTipView.create(getActivity(), "这是demo显示，支付失败", cause.toString(), null).show();
                    }
                });
            }
        });
        root.findViewById(R.id.btn_rxservices).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RXServiceView.create(getActivity(), "http://rxapi.jilinhaiqi.com/static/service/#/welcome").show();
            }
        });
        root.findViewById(R.id.btn_deregister).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Map<String, Object> custom = new HashMap<>();
                custom.put("transmit_args", "透传参数");
                custom.put("game_user_id", 1000);
                custom.put("nickname", "用户昵称");
                custom.put("head_img_url", "用户头像");
                custom.put("queue_name", "default");
                RXSdkUI.getInstance().applyForDeregisterUI(getActivity(), custom, getCallback()).show();
            }
        });
        root.findViewById(R.id.btn_rxusercenter).setOnClickListener(v -> {
            UserCenterView userCenterView = UserCenterView.create(getActivity()).setTitleResId(R.drawable.logo).setCallback(getCallback()).setWebViewCloseListener(new OnViewCloseListener() {
                @Override
                public void onClosed(IRXView v) {
                    Logger.e("RXSDK", "on rx webview closed ");
                }
            });
//            userCenterView.setJsDisable(true);
            LoginData loginData = RuiXueSdk.getLoginData();
            if (loginData != null && LoginMethod.isChannel(loginData.getMethod())) {
                userCenterView.setSyncInfoEnable(true);
                Map<String, Object> m = new HashMap<>();
                m.put("appid", GlobalConfig.getWxAppId());
                userCenterView.setSyncParams(m);
            }
            Map<String, Object> custom = new HashMap<>();
            custom.put("transmit_args", "cc透传参数");
            custom.put("game_user_id", "1000001");
            custom.put("nickname", "cc用户昵称");
            custom.put("head_img_url", "https://oss.ruixueyun.com/service/help_center_default_icon_230630_3.png");
            custom.put("queue_name", "default");
            userCenterView.setCustomParams(custom);
            Context context = requireContext();
            userCenterView.setLogoDrawable(ContextCompat.getDrawable(context, R.drawable.logo));//设置用户中心logo
            userCenterView.setCustomUrl(GlobalConfig.getDomain() + (RXSdkApi.getInstance().getSdkInfo().getState() == 1 ? "static/passport/#/overseausercenter " : "static/passport/#/userCenter"));
            userCenterView.show();
        });
        root.findViewById(R.id.btn_rxret_login).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Navigation.findNavController(getView()).navigate(R.id.action_mainFragment_to_loginFragment);
            }
        });
        //share
        root.findViewById(R.id.btn_rxshare).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

            }
        });
        root.findViewById(R.id.btn_rxopenconfig).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Navigation.findNavController(getView()).navigate(R.id.action_mainFragment_to_configFragment);
            }
        });
        return root;
    }

    @NonNull
    private RXUICallback getCallback() {
        return new RXUICallback() {
            @Override
            public Map<String, Object> onClickHandle(Map<String, Object> params) {
                return params;
            }

            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.i("UserCenterView:" + data);
                if (data != null && !data.optString("type", "").equals("switch_user")) {
//                        showLog(data.toString());
                } else {
                    Bundle bundle = new Bundle();
                    bundle.putBoolean("switch_user", true);
                    RuiXueSdk.logout(null);
                    Navigation.findNavController(getView()).navigate(R.id.action_mainFragment_to_loginFragment, bundle);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Log.e("RXSDK", "UserCenterView: " + cause);
            }
        };
    }
}