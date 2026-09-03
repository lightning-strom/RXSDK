package com.ruixue.adapter;


import android.content.Context;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.Account;
import com.ruixue.passport.AccountHelper;
import com.ruixue.passport.LoginMethod;
import com.ruixue.ui.R;
import com.ruixue.view.AlertTipView;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class AccountAdapter extends BaseAdapter {

    private final List<Account> accountList;
    private final Context mContext;
    private int mSelectedPosition = 0;

    private OnItemDeleteListener mListener;

    public void setOnItemDeleteListener(OnItemDeleteListener listener) {
        this.mListener = listener;
    }

    public AccountAdapter(Context context, Collection<Account> accountList) {
        this.accountList = accountList == null ? new ArrayList<>() : new ArrayList<>(accountList);
        this.mContext = context;
    }

    @Override
    public int getCount() {
        return accountList.size();
    }

    @Override
    public Object getItem(int i) {
        if (i >= 0 && i < accountList.size()) {
            return accountList.get(i);
        } else {
            return null;
        }
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    public void updateSelect(int pos) {
        mSelectedPosition = pos;
    }

    public void remove(int pos) {
        if (accountList.size() > 0 && accountList.size() > pos) {
            Account account = accountList.get(pos);
            if (account != null) {
                RXLogger.i("item removed idx:" + pos+" ,username:"+account.getUsername());
                accountList.remove(pos);
                AccountHelper.deleteAccount(account);
                AccountAdapter.this.notifyDataSetChanged();
                if (null != mListener) {
                    mListener.onDelete(account, pos, accountList.size());
                }
            }
        } else {
            RXLogger.i("item ignored pos :" + pos);
        }
    }

    @Override
    public View getView(int i, View convertView, ViewGroup viewGroup) {
        ViewHolder holder;
        if (convertView == null) {
            convertView = LayoutInflater.from(mContext).inflate(R.layout.rx_account_list_item, null);
            holder = new ViewHolder(convertView);
            holder.item_del.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    AlertTipView.create(mContext, mContext.getString(R.string.rx_txt_tips), mContext.getString(R.string.rx_confirm_del_account), new RXJSONCallback() {
                        @Override
                        public void onSuccess(@Nullable JSONObject data) {
                            remove(i);
                        }

                        @Override
                        public void onFailed(@NonNull JSONObject cause) {

                        }
                    }).show();
                }
            });
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
//            Log.v(RuiXueSdk.TAG, "positon " + i + " convertView is not null, " + convertView);
        }
        Account rxAccount = accountList.get(i);
        if (rxAccount != null) {
            String accountStr = rxAccount.getDisplayUsername();
            holder.account.setText(accountStr);
            String ext = RXSdkApi.getInstance().getSdkInfo().getState() != 0 && rxAccount.getMethod().equals(LoginMethod.USERNAME) ? "3" : "";
            LoginMethod loginMethod = LoginMethod.create(rxAccount.getMethod(), ext);
            holder.userimg.setBackgroundResource(loginMethod.getIcon());
        }

        return convertView;
    }

    //DiskCacheStrategy.NONE：表示不缓存任何内容。
    //DiskCacheStrategy.ALL ：表示既缓存原始图片，也缓存转换过后的图片。
//    private RequestOptions getReqOptions() {
//        RequestOptions options = new RequestOptions().centerCrop().placeholder(R.drawable.ruixue_user).priority(Priority.HIGH).diskCacheStrategy(DiskCacheStrategy.ALL);
//        return options;
//    }

    //第一步 定义接口
    public interface OnItemDeleteListener {
        void onDelete(Account rxAccount, int position, int size);
    }

    public static class ViewHolder {
        TextView account;
        ImageView userimg;
        ImageView item_del;

        public ViewHolder(@NonNull View convertView) {
            account = convertView.findViewById(R.id.account);
            userimg = convertView.findViewById(R.id.userimg);
            item_del = convertView.findViewById(R.id.item_del);
        }
    }
}