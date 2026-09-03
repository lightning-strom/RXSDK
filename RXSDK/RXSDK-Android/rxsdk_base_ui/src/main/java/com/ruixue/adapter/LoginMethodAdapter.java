package com.ruixue.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.ruixue.passport.LoginMethod;
import com.ruixue.ui.R;

import java.util.ArrayList;
import java.util.List;

public class LoginMethodAdapter extends BaseAdapter {

    private final Context mContext;
    List<String> dataList;

    public LoginMethodAdapter(Context context, List<String> methodList) {
        this.mContext = context;
        dataList = methodList != null ? methodList : new ArrayList<>();
    }


    @Override
    public int getCount() {
        return dataList.size();
    }

    @Override
    public Object getItem(int position) {
        if (position >= 0 && position < dataList.size()) {
            return dataList.get(position);
        } else {
            return null;
        }
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder viewHolder;
        if (convertView == null) {
            convertView = LayoutInflater.from(mContext).inflate(R.layout.rx_login_method_item, parent, false);
            viewHolder = new ViewHolder();
            viewHolder.bgView = convertView.findViewById(R.id.bg_ico_method);
            viewHolder.ivIco = convertView.findViewById(R.id.iv_ico_method);
            viewHolder.tvName = convertView.findViewById(R.id.tv_name);
            convertView.setTag(viewHolder);

        } else {
            viewHolder = (ViewHolder) convertView.getTag();
        }

        String method = dataList.get(position);
        LoginMethod loginMethod = new LoginMethod(method, method.equals(LoginMethod.USERNAME) ? "3" : "");
        viewHolder.tvName.setText(loginMethod.getName());
        viewHolder.ivIco.setBackgroundResource(loginMethod.getIcon());

        return convertView;
    }


    static class ViewHolder {
        RelativeLayout bgView;
        ImageView ivIco;
        TextView tvName;
    }
}